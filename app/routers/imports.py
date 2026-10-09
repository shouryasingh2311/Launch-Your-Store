import json
import re
from decimal import Decimal
from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import TenantContext, require_owner
from app.database import get_db
from app.models import Category, Product
from app.schemas import (
    ImportCommitResponse,
    ImportPreviewResponse,
    ImportValidateResponse,
)
from app.services.csv_importer import (
    TEMPLATE_HEADERS,
    read_tabular_data,
    suggest_column_mapping,
    validate_catalog_rows,
)

router = APIRouter(prefix="/import", tags=["CSV / Excel Import"])


@router.get("/template")
def download_import_template() -> Response:
    """Download standard CSV template with sample data."""
    csv_content = (
        "name,description,price,stock,category,sku,image_url\n"
        "Oversized Cotton Tee,Heavyweight premium casual streetwear,799.00,45,Fashion,FSH-001,https://example.com/tee.jpg\n"
        "Wireless Earbuds,Active noise cancellation with 32h battery,2999.00,30,Electronics,ELC-002,https://example.com/buds.jpg\n"
    )
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=catalog_import_template.csv"},
    )


@router.post("/preview", response_model=ImportPreviewResponse)
async def preview_catalog_import(
    file: UploadFile = File(...),
    tenant: TenantContext = Depends(require_owner),
) -> ImportPreviewResponse:
    """Upload CSV/Excel file to preview detected headers, fuzzy field mappings, and first 10 rows."""
    content = await file.read()
    headers, rows = read_tabular_data(content, file.filename or "file.csv")

    if not headers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File appears to be empty or missing header row.",
        )

    mapping = suggest_column_mapping(headers)
    preview = rows[:10]

    return ImportPreviewResponse(
        headers=headers,
        column_mapping=mapping,
        total_rows=len(rows),
        preview_rows=preview,
    )


@router.post("/validate", response_model=ImportValidateResponse)
async def validate_catalog_import(
    file: UploadFile = File(...),
    mapping_json: str | None = Form(None),
    tenant: TenantContext = Depends(require_owner),
) -> ImportValidateResponse:
    """Run full validation and generate a row-by-row error report without importing."""
    content = await file.read()
    headers, rows = read_tabular_data(content, file.filename or "file.csv")

    if mapping_json:
        try:
            mapping = json.loads(mapping_json)
        except Exception:
            mapping = suggest_column_mapping(headers)
    else:
        mapping = suggest_column_mapping(headers)

    valid_rows, errors = validate_catalog_rows(rows, mapping)

    return ImportValidateResponse(
        total_rows=len(rows),
        valid_rows=len(valid_rows),
        invalid_rows=len(rows) - len(valid_rows),
        errors=errors,
    )


@router.post("/commit", response_model=ImportCommitResponse)
async def commit_catalog_import(
    file: UploadFile = File(...),
    mapping_json: str | None = Form(None),
    auto_create_categories: bool = Form(True),
    tenant: TenantContext = Depends(require_owner),
    db: Session = Depends(get_db),
) -> ImportCommitResponse:
    """Import valid rows into store catalog and return summary report."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    content = await file.read()
    headers, rows = read_tabular_data(content, file.filename or "file.csv")

    if mapping_json:
        try:
            mapping = json.loads(mapping_json)
        except Exception:
            mapping = suggest_column_mapping(headers)
    else:
        mapping = suggest_column_mapping(headers)

    valid_rows, errors = validate_catalog_rows(rows, mapping)

    # Cache existing categories for this store
    categories = db.scalars(select(Category).where(Category.store_id == tenant.store_id)).all()
    cat_lookup = {c.name.lower(): c for c in categories}

    imported_count = 0
    skipped_count = len(rows) - len(valid_rows)

    for item in valid_rows:
        cat_name = item["category"] or "General"
        cat_key = cat_name.lower()

        cat_obj = cat_lookup.get(cat_key)
        if not cat_obj and auto_create_categories:
            cat_slug = re.sub(r"[^\w\s-]", "", cat_name.lower().strip())
            cat_slug = re.sub(r"[\s_-]+", "-", cat_slug).strip("-") or "cat"
            cat_obj = Category(
                store_id=tenant.store_id,
                name=cat_name,
                slug=cat_slug,
            )
            db.add(cat_obj)
            db.flush()
            cat_lookup[cat_key] = cat_obj

        product = Product(
            store_id=tenant.store_id,
            category_id=cat_obj.id if cat_obj else None,
            name=item["name"],
            description=item["description"],
            price=Decimal(str(item["price"])),
            stock=item["stock"],
            sku=item["sku"],
            image_url=item["image_url"],
            is_active=True,
        )
        db.add(product)
        imported_count += 1

    db.commit()

    return ImportCommitResponse(
        status="success",
        imported_count=imported_count,
        skipped_count=skipped_count,
        errors=errors,
        message=f"Successfully imported {imported_count} product(s). {skipped_count} row(s) skipped due to errors.",
    )
