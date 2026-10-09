import React from 'react'
import { Drawer } from '../ui/Drawer'
import { useCartStore } from '../../store/useCartStore'
import { formatINR } from '../../lib/utils'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'

export function CartDrawer({ storeSlug, onCheckout }) {
  const { isCartOpen, closeCart, stores, updateQty, removeItem } = useCartStore()
  const items = stores[storeSlug] || []

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)
  const freeShippingThreshold = 1999
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title="Shopping Bag"
      description={`${items.length} unique ${items.length === 1 ? 'item' : 'items'}`}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Explore our handpicked collection and add your favorite essentials."
          actionLabel="Continue Shopping"
          onAction={closeCart}
        />
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Free Shipping Meter */}
          <div className="mb-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex justify-between items-center text-xs font-semibold text-indigo-950 mb-1.5">
              <span>
                {subtotal >= freeShippingThreshold
                  ? '🎉 You unlocked Free Express Shipping!'
                  : `Add ${formatINR(freeShippingThreshold - subtotal)} more for Free Shipping`}
              </span>
              <span>{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-indigo-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.itemKey}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors shadow-2xs"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {item.name}
                  </h4>
                  {item.variant && (
                    <span className="text-[11px] text-slate-500 block">
                      {item.variant}
                    </span>
                  )}
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {formatINR(item.price)}
                  </p>
                </div>

                {/* Quantity adjustments */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center border border-slate-200 rounded-md bg-white">
                    <button
                      onClick={() => updateQty(storeSlug, item.itemKey, item.qty - 1)}
                      className="p-1 text-slate-500 hover:text-slate-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(storeSlug, item.itemKey, item.qty + 1)}
                      className="p-1 text-slate-500 hover:text-slate-800"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(storeSlug, item.itemKey)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Footer */}
          <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {subtotal >= freeShippingThreshold ? 'FREE' : '₹100'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Estimated Total</span>
                <span>{formatINR(subtotal + (subtotal >= freeShippingThreshold ? 0 : 100))}</span>
              </div>
            </div>

            <button
              onClick={() => {
                closeCart()
                onCheckout && onCheckout()
              }}
              className="w-full py-3 rounded-[var(--store-radius,8px)] bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] font-bold text-sm shadow-sm hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 transition-all"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
