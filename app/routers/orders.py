from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.auth import TenantContext, require_staff_or_owner
from app.database import get_db
from app.models import Notification, Order, OrderEvent
from app.schemas import OrderResponse, OrderStatusUpdateRequest

router = APIRouter(prefix="/orders", tags=["Orders (Admin)"])


@router.get("", response_model=list[OrderResponse])
def list_merchant_orders(
    status_filter: str | None = Query(None, alias="status", pattern=r"^(placed|packed|shipped|delivered|cancelled)$"),
    q: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> list[OrderResponse]:
    """List orders for the authenticated merchant's store with optional status filter and customer search."""
    if not tenant.store_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found.")

    query = (
        select(Order)
        .options(joinedload(Order.items), joinedload(Order.events))
        .where(Order.store_id == tenant.store_id)
    )

    if status_filter:
        query = query.where(Order.status == status_filter)

    if q:
        search_filter = f"%{q.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Order.order_number).like(search_filter),
                func.lower(Order.customer_name).like(search_filter),
                func.lower(Order.email).like(search_filter),
            )
        )

    offset = (page - 1) * limit
    orders = db.scalars(query.order_by(Order.id.desc()).offset(offset).limit(limit)).unique().all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(
    order_id: int,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Get complete order details including items and event history."""
    order = db.scalar(
        select(Order)
        .options(joinedload(Order.items), joinedload(Order.events))
        .where(Order.id == order_id, Order.store_id == tenant.store_id)
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
    return OrderResponse.model_validate(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    data: OrderStatusUpdateRequest,
    tenant: TenantContext = Depends(require_staff_or_owner),
    db: Session = Depends(get_db),
) -> OrderResponse:
    """Update order status. Automatically records status event timeline and customer notification."""
    order = db.scalar(
        select(Order)
        .options(joinedload(Order.items), joinedload(Order.events))
        .where(Order.id == order_id, Order.store_id == tenant.store_id)
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    old_status = order.status
    new_status = data.status

    if old_status == new_status:
        return OrderResponse.model_validate(order)

    # Update order status
    order.status = new_status

    # Record event in timeline
    event_note = data.note or f"Status changed from {old_status} to {new_status} by {tenant.user.role}."
    event = OrderEvent(
        order_id=order.id,
        store_id=tenant.store_id,
        status=new_status,
        note=event_note,
    )
    db.add(event)

    # Simulated customer notification
    status_messages: dict[str, str] = {
        "packed": f"Your order {order.order_number} has been packed and is ready for dispatch.",
        "shipped": f"Great news! Your order {order.order_number} is on the way.",
        "delivered": f"Your order {order.order_number} has been delivered. Thank you for shopping with us!",
        "cancelled": f"Your order {order.order_number} has been cancelled.",
    }
    msg = status_messages.get(new_status, f"Order {order.order_number} status updated to {new_status}.")

    notification = Notification(
        store_id=tenant.store_id,
        order_id=order.id,
        channel="email",
        message=msg,
    )
    db.add(notification)

    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order)
