import React from 'react'
import { ShoppingBag, Search, Sparkles, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'

export function StorefrontHeader({ store, searchQuery, setSearchQuery }) {
  const { stores, openCart } = useCartStore()
  const cartItems = stores[store?.slug] || []
  const totalCount = cartItems.reduce((acc, it) => acc + it.qty, 0)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--store-border,#e2e8f0)] bg-[var(--store-bg,#ffffff)]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo / Brand Name */}
          <Link to={`/s/${store?.slug}`} className="flex items-center gap-3 shrink-0 group">
            {store?.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-[var(--store-border,#e2e8f0)] shadow-xs"
              />
            ) : (
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs">
                {store?.name?.charAt(0) || 'S'}
              </div>
            )}
            <div>
              <span className="font-heading font-bold text-lg sm:text-xl text-[var(--store-text,#0f172a)] tracking-tight block leading-tight">
                {store?.name || 'Storefront'}
              </span>
              {store?.tagline && (
                <span className="hidden md:block text-xs text-[var(--store-muted,#64748b)] truncate max-w-xs">
                  {store.tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--store-muted,#64748b)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog, products, SKUs..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-[var(--store-radius,8px)] border border-[var(--store-border,#e2e8f0)] bg-[var(--store-surface,#ffffff)] text-[var(--store-text,#0f172a)] placeholder:text-[var(--store-muted,#64748b)] focus:outline-none focus:ring-2 focus:ring-[var(--store-primary,#4f46e5)] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Portal Quick Jump */}
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Switch to Store Admin Panel"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden md:inline">Admin Panel</span>
            </Link>

            {/* Cart trigger button */}
            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="relative p-2.5 rounded-[var(--store-radius,8px)] bg-[var(--store-surface,#ffffff)] border border-[var(--store-border,#e2e8f0)] text-[var(--store-text,#0f172a)] hover:bg-[var(--store-primary,#4f46e5)]/10 transition-colors shadow-2xs"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 rounded-full bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] text-[11px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--store-muted,#64748b)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[var(--store-radius,8px)] border border-[var(--store-border,#e2e8f0)] bg-[var(--store-surface,#ffffff)] text-[var(--store-text,#0f172a)] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
