from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Category, Order, OrderItem, Product


def resolve_period_range(period: str) -> tuple[datetime, datetime]:
    """Resolve period string into (start_datetime, end_datetime) in UTC."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    period_clean = period.lower().strip()
    if period_clean == "today":
        return today_start, now
    elif period_clean == "this_week":
        start = today_start - timedelta(days=today_start.weekday())
        return start, now
    elif period_clean == "last_week":
        end = today_start - timedelta(days=today_start.weekday())
        start = end - timedelta(days=7)
        return start, end
    elif period_clean == "this_month":
        start = today_start.replace(day=1)
        return start, now
    elif period_clean == "last_month":
        first_of_this_month = today_start.replace(day=1)
        end = first_of_this_month - timedelta(seconds=1)
        start = end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return start, end
    elif period_clean == "last_7_days":
        return today_start - timedelta(days=7), now
    elif period_clean == "last_30_days":
        return today_start - timedelta(days=30), now
    else:
        # Default to last 30 days
        return today_start - timedelta(days=30), now


def tool_top_products(
    db: Session,
    store_id: int,
    period: str = "this_month",
    limit: int = 5,
    by: str = "revenue",
) -> dict[str, Any]:
    """Return top products ranked by revenue or units sold."""
    start_dt, end_dt = resolve_period_range(period)

    order_by_col = (
        func.sum(OrderItem.price_snapshot * OrderItem.qty)
        if by.lower() == "revenue"
        else func.sum(OrderItem.qty)
    )

    query = (
        select(
            OrderItem.name_snapshot,
            func.sum(OrderItem.qty).label("total_units"),
            func.sum(OrderItem.price_snapshot * OrderItem.qty).label("total_revenue"),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .where(
            OrderItem.store_id == store_id,
            Order.status != "cancelled",
            Order.created_at >= start_dt,
            Order.created_at <= end_dt,
        )
        .group_by(OrderItem.name_snapshot)
        .order_by(order_by_col.desc())
        .limit(limit)
    )

    rows = db.execute(query).all()
    if not rows:
        return {
            "answer": f"You don't have any product sales recorded for {period.replace('_', ' ')}.",
            "table": {"columns": ["Product Name", "Units Sold", "Total Revenue"], "rows": []},
        }

    formatted_rows = [
        [r[0], int(r[1]), f"₹{float(r[2]):,.2f}"]
        for r in rows
    ]
    top_name = rows[0][0]
    return {
        "answer": f"Your top selling product for {period.replace('_', ' ')} is '{top_name}' with {int(rows[0][1])} units sold.",
        "table": {
            "columns": ["Product Name", "Units Sold", "Total Revenue"],
            "rows": formatted_rows,
        },
    }


def tool_low_stock(
    db: Session,
    store_id: int,
    threshold: int = 5,
) -> dict[str, Any]:
    """Return products with inventory levels at or below threshold."""
    query = (
        select(Product.name, Product.sku, Product.stock, Product.low_stock_threshold, Product.price)
        .where(
            Product.store_id == store_id,
            Product.is_active.is_(True),
            Product.stock <= threshold,
        )
        .order_by(Product.stock.asc())
    )
    rows = db.execute(query).all()
    if not rows:
        return {
            "answer": f"All active items have healthy inventory levels above {threshold} units.",
            "table": {"columns": ["Product Name", "SKU", "Stock", "Threshold", "Price"], "rows": []},
        }

    formatted_rows = [
        [r[0], r[1] or "-", int(r[2]), int(r[3]), f"₹{float(r[4]):,.2f}"]
        for r in rows
    ]
    return {
        "answer": f"You have {len(rows)} product(s) with low stock (under {threshold} units remaining).",
        "table": {
            "columns": ["Product Name", "SKU", "Stock", "Threshold", "Price"],
            "rows": formatted_rows,
        },
    }


def tool_revenue_compare(
    db: Session,
    store_id: int,
    period_a: str = "this_week",
    period_b: str = "last_week",
) -> dict[str, Any]:
    """Compare store revenue and order count between two time periods."""
    start_a, end_a = resolve_period_range(period_a)
    start_b, end_b = resolve_period_range(period_b)

    def get_stats(s_dt, e_dt):
        row = db.execute(
            select(
                func.coalesce(func.sum(Order.total), Decimal("0.00")),
                func.count(Order.id),
            ).where(
                Order.store_id == store_id,
                Order.status != "cancelled",
                Order.created_at >= s_dt,
                Order.created_at <= e_dt,
            )
        ).one()
        return float(row[0]), int(row[1])

    rev_a, orders_a = get_stats(start_a, end_a)
    rev_b, orders_b = get_stats(start_b, end_b)

    diff = rev_a - rev_b
    pct_change = round(((diff / rev_b) * 100), 1) if rev_b > 0 else 0.0
    trend = "up" if diff >= 0 else "down"

    answer = (
        f"Revenue for {period_a.replace('_', ' ')} is ₹{rev_a:,.2f} ({orders_a} orders) vs "
        f"₹{rev_b:,.2f} ({orders_b} orders) for {period_b.replace('_', ' ')} ({trend} {abs(pct_change)}%)."
    )

    table = {
        "columns": ["Period", "Revenue", "Orders"],
        "rows": [
            [period_a.replace("_", " ").title(), f"₹{rev_a:,.2f}", orders_a],
            [period_b.replace("_", " ").title(), f"₹{rev_b:,.2f}", orders_b],
        ],
    }
    return {"answer": answer, "table": table}


def tool_orders_summary(
    db: Session,
    store_id: int,
    period: str = "this_month",
    days: int | None = None,
    status: str | None = None,
) -> dict[str, Any]:
    """Return order volume, total revenue, and status breakdown for a time period."""
    if days:
        period = f"last_{days}_days"
    start_dt, end_dt = resolve_period_range(period)

    query = select(Order.status, func.count(Order.id), func.sum(Order.total)).where(
        Order.store_id == store_id,
        Order.created_at >= start_dt,
        Order.created_at <= end_dt,
    )
    if status:
        query = query.where(Order.status == status.lower().strip())

    rows = db.execute(query.group_by(Order.status)).all()
    if not rows:
        return {
            "answer": f"No orders recorded for {period.replace('_', ' ')}.",
            "table": {"columns": ["Status", "Order Count", "Total Value"], "rows": []},
        }

    total_orders = sum(int(r[1]) for r in rows)
    total_val = sum(float(r[2] or 0) for r in rows)

    formatted_rows = [
        [r[0].capitalize(), int(r[1]), f"₹{float(r[2] or 0):,.2f}"]
        for r in rows
    ]

    return {
        "answer": f"You received {total_orders} order(s) totalling ₹{total_val:,.2f} in {period.replace('_', ' ')}.",
        "table": {"columns": ["Status", "Order Count", "Total Value"], "rows": formatted_rows},
    }


def tool_sales_by_category(
    db: Session,
    store_id: int,
    period: str = "this_month",
) -> dict[str, Any]:
    """Return sales breakdown grouped by product category."""
    start_dt, end_dt = resolve_period_range(period)

    query = (
        select(
            func.coalesce(Category.name, "Uncategorized"),
            func.sum(OrderItem.qty),
            func.sum(OrderItem.price_snapshot * OrderItem.qty),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .outerjoin(Product, Product.id == OrderItem.product_id)
        .outerjoin(Category, Category.id == Product.category_id)
        .where(
            OrderItem.store_id == store_id,
            Order.status != "cancelled",
            Order.created_at >= start_dt,
            Order.created_at <= end_dt,
        )
        .group_by(Category.name)
        .order_by(func.sum(OrderItem.price_snapshot * OrderItem.qty).desc())
    )

    rows = db.execute(query).all()
    if not rows:
        return {
            "answer": f"No category sales recorded for {period.replace('_', ' ')}.",
            "table": {"columns": ["Category", "Units Sold", "Total Revenue"], "rows": []},
        }

    formatted_rows = [
        [r[0], int(r[1]), f"₹{float(r[2] or 0):,.2f}"]
        for r in rows
    ]
    top_cat = rows[0][0]
    return {
        "answer": f"Your leading category for {period.replace('_', ' ')} is '{top_cat}' with ₹{float(rows[0][2] or 0):,.2f} in sales.",
        "table": {"columns": ["Category", "Units Sold", "Total Revenue"], "rows": formatted_rows},
    }


def tool_product_info(
    db: Session,
    store_id: int,
    name: str,
) -> dict[str, Any]:
    """Search for a specific product and return current stock, price, and active status."""
    clean_name = f"%{name.strip().lower()}%"
    product = db.scalar(
        select(Product).where(
            Product.store_id == store_id,
            func.lower(Product.name).like(clean_name),
        )
    )
    if not product:
        return {
            "answer": f"I couldn't find any product matching '{name}' in your store.",
            "table": {"columns": ["Field", "Value"], "rows": []},
        }

    table = {
        "columns": ["Property", "Value"],
        "rows": [
            ["Product Name", product.name],
            ["SKU", product.sku or "None"],
            ["Price", f"₹{float(product.price):,.2f}"],
            ["Stock on Hand", str(product.stock)],
            ["Status", "Active" if product.is_active else "Inactive"],
        ],
    }
    return {
        "answer": f"'{product.name}' is currently ₹{float(product.price):,.2f} with {product.stock} units in stock.",
        "table": table,
    }


CHAT_TOOL_REGISTRY = {
    "top_products": tool_top_products,
    "low_stock": tool_low_stock,
    "revenue_compare": tool_revenue_compare,
    "orders_summary": tool_orders_summary,
    "sales_by_category": tool_sales_by_category,
    "product_info": tool_product_info,
}
