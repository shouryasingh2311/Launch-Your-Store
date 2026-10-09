from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import TenantContext, require_staff_or_owner
from app.database import get_db
from app.models import Notification, Order, OrderEvent, Product
from app.schemas import (
    ActivityItem,
    DashboardSummaryResponse,
    RevenueDataPoint,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard (Admin)"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> DashboardSummaryResponse:
    """Retrieve key store performance indicators: revenue, orders, AOV, and low stock items."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    store_id = tenant.store_id

    # Revenue & orders metrics (excluding cancelled orders)
    orders_data = db.execute(
        select(
            func.coalesce(func.sum(Order.total), Decimal("0.00")),
            func.count(Order.id),
        ).where(
            Order.store_id == store_id,
            Order.status != "cancelled",
        )
    ).one()
    total_rev = float(orders_data[0])
    total_orders = int(orders_data[1])
    aov = round(total_rev / total_orders, 2) if total_orders > 0 else 0.0

    # Low stock count
    low_stock = db.scalar(
        select(func.count(Product.id)).where(
            Product.store_id == store_id,
            Product.is_active.is_(True),
            Product.stock <= Product.low_stock_threshold,
        )
    ) or 0

    # Pending orders count
    pending = db.scalar(
        select(func.count(Order.id)).where(
            Order.store_id == store_id,
            Order.status.in_(["placed", "packed"]),
        )
    ) or 0

    return DashboardSummaryResponse(
        total_revenue=round(total_rev, 2),
        total_orders=total_orders,
        average_order_value=aov,
        low_stock_count=low_stock,
        pending_orders_count=pending,
    )


@router.get("/revenue-series", response_model=list[RevenueDataPoint])
def get_revenue_series(
    days: int = Query(30, ge=7, le=90, description="Number of days to chart"),
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> list[RevenueDataPoint]:
    """Retrieve daily revenue and order volume for chart visualization with complete contiguous dates."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    store_id = tenant.store_id
    now = datetime.now(timezone.utc)
    start_date = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

    # Fetch orders in range
    orders = db.scalars(
        select(Order).where(
            Order.store_id == store_id,
            Order.status != "cancelled",
            Order.created_at >= start_date,
        )
    ).all()

    # Pre-populate map of all days with 0 to ensure smooth chart
    daily_map: dict[str, dict[str, Any]] = {}
    for i in range(days):
        day_str = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        daily_map[day_str] = {"revenue": 0.0, "orders": 0}

    # Aggregate orders into days
    for o in orders:
        if o.created_at:
            day_key = o.created_at.strftime("%Y-%m-%d")
            if day_key in daily_map:
                daily_map[day_key]["revenue"] += float(o.total)
                daily_map[day_key]["orders"] += 1

    return [
        RevenueDataPoint(
            date=d,
            revenue=round(data["revenue"], 2),
            orders_count=data["orders"],
        )
        for d, data in sorted(daily_map.items())
    ]


@router.get("/activity", response_model=list[ActivityItem])
def get_store_activity(
    limit: int = Query(20, ge=5, le=50),
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> list[ActivityItem]:
    """Retrieve chronological activity log of recent orders, status transitions, and alerts."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    store_id = tenant.store_id
    activities: list[ActivityItem] = []

    # 1. Recent orders
    recent_orders = db.scalars(
        select(Order).where(Order.store_id == store_id).order_by(Order.id.desc()).limit(limit)
    ).all()
    for o in recent_orders:
        activities.append(
            ActivityItem(
                id=f"order-{o.id}",
                type="order",
                title=f"New Order #{o.order_number}",
                description=f"{o.customer_name} placed an order for ₹{float(o.total):.2f}",
                timestamp=o.created_at,
            )
        )

    # 2. Recent order events (status changes)
    recent_events = db.scalars(
        select(OrderEvent).where(OrderEvent.store_id == store_id).order_by(OrderEvent.id.desc()).limit(limit)
    ).all()
    for ev in recent_events:
        activities.append(
            ActivityItem(
                id=f"event-{ev.id}",
                type="status_change",
                title=f"Order Status: {ev.status.capitalize()}",
                description=ev.note or f"Status changed to {ev.status}",
                timestamp=ev.created_at,
            )
        )

    # 3. Recent notifications
    recent_notifications = db.scalars(
        select(Notification).where(Notification.store_id == store_id).order_by(Notification.id.desc()).limit(limit)
    ).all()
    for n in recent_notifications:
        activities.append(
            ActivityItem(
                id=f"notif-{n.id}",
                type="notification",
                title=f"Alert ({n.channel.upper()})",
                description=n.message,
                timestamp=n.created_at,
            )
        )

    # Sort all activities newest first and return top limit
    activities.sort(key=lambda a: a.timestamp, reverse=True)
    return activities[:limit]
