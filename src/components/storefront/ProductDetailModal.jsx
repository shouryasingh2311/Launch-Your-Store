import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { formatINR, cn } from '../../lib/utils'
import { useCartStore } from '../../store/useCartStore'
import { useToast } from '../ui/Toast'
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react'

export function ProductDetailModal({ product, isOpen, onClose, storeSlug }) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCartStore()
  const toast = useToast()

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null)
      setQuantity(1)
    }
  }, [product])

  if (!product) return null

  const effectivePrice = product.price + (selectedVariant?.price_delta || 0)

  const handleAddToCart = () => {
    addItem(storeSlug, product, selectedVariant, quantity)
    toast.success('Added to Cart', `${quantity}x ${product.name} added to your bag.`)
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      onClose()
    }, 600)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Product Image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--store-primary,#4f46e5)]">
              {product.categoryName || 'Product'}
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-900 mt-1">
              {product.name}
            </h2>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {formatINR(effectivePrice)}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-slate-400 line-through">
                {formatINR(product.compare_at_price)}
              </span>
            )}
            {product.discount_pct > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {product.discount_pct}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description || 'Premium quality handcrafted goods produced with strict quality controls.'}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700">Option / Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        isSelected
                          ? "border-[var(--store-primary,#4f46e5)] bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {v.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700">Quantity</label>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 rounded text-slate-600 hover:bg-slate-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 rounded text-slate-600 hover:bg-slate-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {product.stock <= 5 && (
                <span className="text-xs font-semibold text-amber-600">
                  ⚡ Only {product.stock} left in stock
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={cn(
                "w-full py-3 rounded-[var(--store-radius,8px)] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm",
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] hover:opacity-90 active:scale-[0.99]"
              )}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Bag — {formatINR(effectivePrice * quantity)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
