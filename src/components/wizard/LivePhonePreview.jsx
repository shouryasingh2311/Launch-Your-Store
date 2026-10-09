import React from 'react'
import { Sparkles, ShoppingBag } from 'lucide-react'
import { formatINR } from '../../lib/utils'

export function LivePhonePreview({ themeId, storeName, tagline, categoryNames = [], primaryColor = null }) {
  // Theme class for the preview phone shell
  const themeClass = `theme-${themeId || 'minimal'}`

  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px] rounded-[38px] border-[8px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden aspect-[9/19]">
      {/* Phone Camera Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-24 bg-slate-900 rounded-full z-20 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-slate-800" />
      </div>

      {/* Screen Frame */}
      <div className={`w-full h-full overflow-y-auto bg-[var(--store-bg,#ffffff)] text-[var(--store-text,#0f172a)] ${themeClass} p-3 pt-8 flex flex-col justify-between transition-colors duration-300 text-[11px]`}>
        
        {/* Mock Store Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--store-border,#e2e8f0)]">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] flex items-center justify-center font-bold text-[10px]">
                {storeName ? storeName.charAt(0) : 'S'}
              </div>
              <span className="font-heading font-bold text-xs truncate max-w-[120px]">
                {storeName || 'My Store'}
              </span>
            </div>
            <div className="h-6 w-6 rounded-md border border-[var(--store-border,#e2e8f0)] flex items-center justify-center">
              <ShoppingBag className="h-3 w-3" />
            </div>
          </div>

          {/* Hero Section in Mini */}
          <div className="my-3 p-3 rounded-lg bg-[var(--store-surface,#ffffff)] border border-[var(--store-border,#e2e8f0)] text-center space-y-1.5 shadow-2xs">
            <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[var(--store-primary,#4f46e5)]/10 text-[var(--store-primary,#4f46e5)]">
              ✨ Live Store Preview
            </span>
            <p className="font-heading font-bold text-xs leading-tight">
              {tagline || 'Welcome to our online store'}
            </p>
            <div className="inline-block px-3 py-1 rounded text-[10px] font-bold bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)]">
              Shop Now
            </div>
          </div>

          {/* Category Chips mini */}
          <div className="flex gap-1 overflow-hidden my-2">
            {(categoryNames.length > 0 ? categoryNames : ['All', 'Featured', 'Trending']).slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[9px] font-medium bg-[var(--store-surface,#ffffff)] border border-[var(--store-border,#e2e8f0)] truncate"
              >
                {c}
              </span>
            ))}
          </div>

          {/* 2-col mini product cards */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { name: 'Artisan Goods', price: '₹1,499', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80' },
              { name: 'Ceramic Vase', price: '₹799', img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80' }
            ].map((p, idx) => (
              <div key={idx} className="rounded-md border border-[var(--store-border,#e2e8f0)] bg-[var(--store-surface,#ffffff)] overflow-hidden">
                <img src={p.img} alt={p.name} className="h-16 w-full object-cover" />
                <div className="p-1.5">
                  <p className="font-semibold truncate text-[10px]">{p.name}</p>
                  <p className="text-[10px] font-bold mt-0.5">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Footer indicator */}
        <div className="pt-3 border-t border-[var(--store-border,#e2e8f0)] text-center text-[9px] text-[var(--store-muted,#64748b)]">
          Theme: <span className="font-bold capitalize">{themeId}</span>
        </div>
      </div>
    </div>
  )
}
