import React from 'react'
import { cn } from '../../lib/utils'

export function CategoryChips({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            "px-4 py-2 text-xs font-semibold rounded-[var(--store-radius,8px)] transition-all border",
            selectedCategory === null
              ? "bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] border-[var(--store-primary,#4f46e5)] shadow-xs"
              : "bg-[var(--store-surface,#ffffff)] text-[var(--store-text,#0f172a)] border-[var(--store-border,#e2e8f0)] hover:bg-slate-100"
          )}
        >
          All Products
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "px-3.5 py-2 text-xs font-medium rounded-[var(--store-radius,8px)] transition-all border flex items-center gap-1.5",
                isSelected
                  ? "bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] border-[var(--store-primary,#4f46e5)] shadow-xs"
                  : "bg-[var(--store-surface,#ffffff)] text-[var(--store-text,#0f172a)] border-[var(--store-border,#e2e8f0)] hover:bg-slate-100"
              )}
            >
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
