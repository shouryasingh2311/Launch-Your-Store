import React, { useState } from 'react'
import { Plus, Eye, Check } from 'lucide-react'
import { formatINR, cn } from '../../lib/utils'
import { useCartStore } from '../../store/useCartStore'
import { useToast } from '../ui/Toast'

export function ProductCard({ product, storeSlug, onQuickView }) {
  const [imgError, setImgError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCartStore()
  const toast = useToast()

  const isLowStock = product.stock <= (product.low_stock_threshold || 5) && product.stock > 0
  const isOutOfStock = product.stock <= 0

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    if (isOutOfStock) return

    // If product has multiple variants, open detail view instead
    if (product.variants && product.variants.length > 1) {
      if (onQuickView) onQuickView(product)
      return
    }

    const defaultVariant = product.variants?.[0] || null
    addItem(storeSlug, product, defaultVariant, 1)
    toast.success('Added to Bag', `${product.name} is in your shopping cart.`)

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group relative flex flex-col rounded-[var(--store-radius,8px)] border border-[var(--store-border,#e2e8f0)] bg-[var(--store-surface,#ffffff)] overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
    >
      {/* Image Container with Fixed Aspect Ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {!imgError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-purple-500/30 flex items-center justify-center p-4">
            <span className="text-3xl font-bold text-[var(--store-primary,#4f46e5)] opacity-40">
              {product.name?.charAt(0) || 'P'}
            </span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discount_pct > 0 && (
            <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
              {product.discount_pct}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="rounded-md bg-amber-500/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-md bg-slate-800/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick View Button hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="h-3.5 w-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.categoryName && (
          <p className="text-[11px] font-medium text-[var(--store-muted,#64748b)] mb-1">
            {product.categoryName}
          </p>
        )}
        <h3 className="font-heading text-sm font-semibold text-[var(--store-text,#0f172a)] line-clamp-1 mb-2 group-hover:text-[var(--store-primary,#4f46e5)] transition-colors">
          {product.name}
        </h3>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[var(--store-border,#e2e8f0)]/60">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[var(--store-text,#0f172a)]">
              {formatINR(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-[var(--store-muted,#64748b)] line-through">
                {formatINR(product.compare_at_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "flex items-center justify-center h-8 px-3 rounded-[var(--store-radius,6px)] text-xs font-semibold transition-all shadow-2xs",
              justAdded
                ? "bg-emerald-600 text-white"
                : isOutOfStock
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] hover:opacity-90 active:scale-95"
            )}
          >
            {justAdded ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
