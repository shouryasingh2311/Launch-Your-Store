import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { formatINR } from '../../lib/utils'
import { useCartStore } from '../../store/useCartStore'
import { useStoreData } from '../../store/useStoreData'
import { CheckCircle2, ShieldCheck, ArrowRight, Truck } from 'lucide-react'
import confetti from 'canvas-confetti'

export function CheckoutModal({ isOpen, onClose, storeSlug, onOrderCompleted }) {
  const { stores, clearCart } = useCartStore()
  const { createOrder } = useStoreData()
  const items = stores[storeSlug] || []

  const [formData, setFormData] = useState({
    name: 'Pooja Iyer',
    email: 'pooja.iyer@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 4B, Palm Grove Residences, Indiranagar, Bengaluru - 560038',
    paymentMethod: 'UPI' // 'UPI' | 'Card' | 'COD'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)
  const shipping = subtotal >= 1999 ? 0 : 100
  const discount = subtotal > 3000 ? 300 : 0
  const total = subtotal + shipping - discount

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const orderPayload = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        subtotal,
        discount,
        shipping,
        total,
        payment_method: formData.paymentMethod,
        items: items.map(it => ({
          product_id: it.product_id,
          variant_id: it.variant_id,
          name_snapshot: it.name + (it.variant ? ` (${it.variant})` : ''),
          price_snapshot: it.price,
          qty: it.qty
        }))
      }

      const created = createOrder(orderPayload)
      clearCart(storeSlug)
      setIsSubmitting(false)
      setCompletedOrder(created)

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch (err) {
        // silent fallback if confetti blocked
      }

      if (onOrderCompleted) onOrderCompleted(created)
    }, 600)
  }

  const handleClose = () => {
    setCompletedOrder(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={completedOrder ? "Order Confirmed! 🎉" : "Express Checkout"}
      description={completedOrder ? "Your order has been placed successfully." : "Enter your shipping details below."}
      maxWidth="max-w-lg"
    >
      {completedOrder ? (
        <div className="text-center py-4 space-y-4">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Reference</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
              #{completedOrder.order_number}
            </h3>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-2 text-left border border-slate-100">
            <div className="flex justify-between font-medium">
              <span>Customer:</span>
              <span className="text-slate-900">{completedOrder.customer_name}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Paid / Due:</span>
              <span className="text-emerald-700 font-bold">{formatINR(completedOrder.total)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Payment Mode:</span>
              <span className="text-slate-900">{completedOrder.payment_method}</span>
            </div>
            <div className="border-t border-slate-200/60 pt-2 flex items-center gap-2 text-indigo-700">
              <Truck className="h-4 w-4" />
              <span>Tracking notifications active via SMS & Email.</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Complete Delivery Address"
            required
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'Card', 'COD'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: m })}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    formData.paymentMethod === m
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m === 'COD' ? 'Cash on Delivery' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Festival Promo Discount</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-sm pt-1.5 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-indigo-600">{formatINR(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • ${formatINR(total)}`}
          </button>
        </form>
      )}
    </Modal>
  )
}
