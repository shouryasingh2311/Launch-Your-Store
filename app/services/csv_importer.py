import csv
import io
import re
from typing import Any
import openpyxl

from app.schemas import ImportRowError

TEMPLATE_HEADERS = ["name", "description", "price", "stock", "category", "sku", "image_url"]

HEADER_FUZZY_PATTERNS = {
    "name": [r"^name$", r"^product.*name$", r"^title$", r"^item.*name$"],
    "description": [r"^description$", r"^desc$", r"^details$", r"^summary$"],
    "price": [r"^price$", r"^mrp$", r"^cost$", r"^rate$", r"^price.*inr$"],
    "stock": [r"^stock$", r"^qty$", r"^quantity$", r"^inventory$", r"^units$"],
    "category": [r"^category$", r"^.*category.*$", r"^department$", r"^collection$", r"^type$"],
    "sku": [r"^sku$", r"^code$", r"^item.*code$", r"^.*bar\s*code.*$"],
    "image_url": [r"^image.*url$", r"^image$", r"^photo$", r"^picture$", r"^img$"],
}


def parse_currency(val: Any) -> float | None:
    """Clean currency string handling ₹, Rs., commas, suffixes and returns float."""
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    # Strip common currency prefixes and suffixes
    s = re.sub(r"^(?:₹|rs\.?|inr)\s*", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s*(?:/-|inr)$", "", s, flags=re.IGNORECASE)
    # Remove any remaining ₹, commas, or whitespace
    cleaned = re.sub(r"[₹\s,]", "", s)
    try:
        val_float = float(cleaned)
        return val_float if val_float >= 0 else None
    except ValueError:
        return None


def parse_stock(val: Any) -> int | None:
    """Parse stock integer handling floating strings like '10.0' or '15'."""
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    try:
        val_float = float(s)
        if val_float.is_integer() and val_float >= 0:
            return int(val_float)
        return None
    except ValueError:
        return None


def suggest_column_mapping(headers: list[str]) -> dict[str, str]:
    """Auto-map input headers to canonical fields using fuzzy regex."""
    mapping: dict[str, str] = {}
    used_canonicals = set()

    for h in headers:
        clean_h = h.strip().lower()
        matched = False
        for canonical, patterns in HEADER_FUZZY_PATTERNS.items():
            if canonical in used_canonicals:
                continue
            if any(re.match(p, clean_h) for p in patterns):
                mapping[h] = canonical
                used_canonicals.add(canonical)
                matched = True
                break
        if not matched:
            mapping[h] = clean_h if clean_h in TEMPLATE_HEADERS else "ignore"

    return mapping


def read_tabular_data(file_bytes: bytes, filename: str) -> tuple[list[str], list[dict[str, Any]]]:
    """Read CSV or XLSX file and return (headers, rows)."""
    headers: list[str] = []
    rows: list[dict[str, Any]] = []

    if filename.lower().endswith(".xlsx"):
        wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
        sheet = wb.active
        raw_rows = list(sheet.iter_rows(values_only=True))
        if raw_rows:
            headers = [str(cell).strip() for cell in raw_rows[0] if cell is not None]
            for r in raw_rows[1:]:
                if not any(r):
                    continue  # skip empty row
                row_dict = {}
                for idx, h in enumerate(headers):
                    val = r[idx] if idx < len(r) else None
                    row_dict[h] = val
                rows.append(row_dict)
    else:  # CSV
        text_stream = io.StringIO(file_bytes.decode("utf-8-sig", errors="replace"))
        reader = csv.reader(text_stream)
        raw_rows = list(reader)
        if raw_rows:
            headers = [h.strip() for h in raw_rows[0] if h.strip()]
            for r in raw_rows[1:]:
                if not any(cell.strip() for cell in r if cell):
                    continue  # skip blank rows
                row_dict = {}
                for idx, h in enumerate(headers):
                    val = r[idx].strip() if idx < len(r) else ""
                    row_dict[h] = val
                rows.append(row_dict)

    return headers, rows


def validate_catalog_rows(
    raw_rows: list[dict[str, Any]],
    column_mapping: dict[str, str],
) -> tuple[list[dict[str, Any]], list[ImportRowError]]:
    """Validate and clean tabular rows, returning valid cleaned rows and row-by-row error report."""
    valid_rows: list[dict[str, Any]] = []
    errors: list[ImportRowError] = []

    seen_skus: set[str] = set()
    seen_names: set[tuple[str, str]] = set()

    for idx, raw in enumerate(raw_rows):
        row_num = idx + 2  # 1-indexed header is row 1
        row_has_error = False

        # Map to canonical fields
        mapped_item: dict[str, Any] = {}
        for original_col, canonical_field in column_mapping.items():
            if canonical_field and canonical_field != "ignore":
                mapped_item[canonical_field] = raw.get(original_col)

        # 1. Validate name (required)
        name = str(mapped_item.get("name") or "").strip()
        if not name:
            errors.append(
                ImportRowError(
                    row=row_num,
                    field="name",
                    issue="Product name is required.",
                    fix_suggestion="Provide a non-empty name for the product.",
                )
            )
            row_has_error = True

        # 2. Validate price (required, > 0)
        raw_price = mapped_item.get("price")
        parsed_price = parse_currency(raw_price)
        if parsed_price is None or parsed_price <= 0:
            errors.append(
                ImportRowError(
                    row=row_num,
                    field="price",
                    issue=f"Invalid price value '{raw_price}'.",
                    fix_suggestion="Enter a valid positive price, e.g. '1299.00' or '₹499'.",
                )
            )
            row_has_error = True

        # 3. Validate stock (integer >= 0)
        raw_stock = mapped_item.get("stock")
        parsed_stock = parse_stock(raw_stock) if raw_stock not in (None, "") else 0
        if parsed_stock is None:
            errors.append(
                ImportRowError(
                    row=row_num,
                    field="stock",
                    issue=f"Invalid stock count '{raw_stock}'.",
                    fix_suggestion="Provide a non-negative whole number, e.g. '10'.",
                )
            )
            row_has_error = True

        # 4. Validate duplicate SKU
        sku = str(mapped_item.get("sku") or "").strip()
        if sku:
            if sku.lower() in seen_skus:
                errors.append(
                    ImportRowError(
                        row=row_num,
                        field="sku",
                        issue=f"Duplicate SKU '{sku}' found within file.",
                        fix_suggestion="Ensure each product SKU is unique.",
                    )
                )
                row_has_error = True
            else:
                seen_skus.add(sku.lower())

        # 5. Check duplicate (name, category)
        category_name = str(mapped_item.get("category") or "General").strip()
        name_cat_key = (name.lower(), category_name.lower())
        if name and name_cat_key in seen_names:
            errors.append(
                ImportRowError(
                    row=row_num,
                    field="name",
                    issue=f"Duplicate product '{name}' in category '{category_name}'.",
                    fix_suggestion="Merge into single row or assign unique names.",
                )
            )
            row_has_error = True
        elif name:
            seen_names.add(name_cat_key)

        if not row_has_error:
            valid_rows.append(
                {
                    "name": name,
                    "description": str(mapped_item.get("description") or "").strip() or None,
                    "price": parsed_price,
                    "stock": parsed_stock or 0,
                    "category": category_name,
                    "sku": sku or None,
                    "image_url": str(mapped_item.get("image_url") or "").strip() or None,
                }
            )

    return valid_rows, errors
