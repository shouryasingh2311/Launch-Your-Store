import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Settings, ExternalLink, Store } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useStoreData } from '../../store/useStoreData'
import { ChatbotPanel } from '../chatbot/ChatbotPanel'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

export function AdminLayout({ children }) {
  const location = useLocation()
  const { user, switchRole } = useAuthStore()
  const { store } = useStoreData()

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products',  path: '/admin/products',  icon: Package },
    { label: 'Orders',    path: '/admin/orders',    icon: ShoppingCart },
    { label: 'Settings',  path: '/admin/settings',  icon: Settings, ownerOnly: true },
  ]

  const isStaff = user?.role === 'staff'

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="w-60 hidden md:flex flex-col justify-between shrink-0 bg-[var(--sc-ink)] text-[var(--sc-champagne)]">
        {/* Brand header */}
        <div>
          <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[var(--sc-champagne)] text-[var(--sc-ink)] flex items-center justify-center font-black text-xs flex-shrink-0">
              SC
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-[var(--sc-champagne)] font-poppins leading-tight truncate">
                {store?.name || 'Storecraft Admin'}
              </h2>
              <span className="text-[10px] text-white/40 font-mono truncate block">/s/{store?.slug}</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-0.5" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              const isDisabled = item.ownerOnly && isStaff

              return (
                <Link
                  key={item.path}
                  to={isDisabled ? '#' : item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-white/15 text-[var(--sc-champagne)] shadow-sm'
                      : isDisabled
                      ? 'text-white/25 cursor-not-allowed'
                      : 'text-white/65 hover:bg-white/10 hover:text-[var(--sc-champagne)]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isDisabled && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/30">
                      Owner
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to={`/s/${store?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--sc-champagne)] text-xs font-semibold transition-all border border-white/10"
          >
            <Store className="h-3.5 w-3.5" />
            View Live Store
            <ExternalLink className="h-3 w-3 opacity-50" />
          </Link>

          {/* User pill */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--sc-champagne)] truncate max-w-[110px]">
                {user?.name}
              </span>
              <Badge variant={user?.role === 'owner' ? 'indigo' : 'warning'} size="sm" className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/40">
              <span>Demo role:</span>
              <button
                onClick={() => switchRole(user?.role === 'owner' ? 'staff' : 'owner')}
                className="text-[var(--sc-champagne)]/70 hover:text-[var(--sc-champagne)] underline font-semibold transition-colors"
              >
                Switch to {user?.role === 'owner' ? 'Staff' : 'Owner'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar (visible on all screens; full nav on mobile) */}
        <header className="bg-champagne-card border-b border-champagne-border px-4 py-3 flex items-center justify-between">
          {/* Mobile wordmark */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-7 w-7 rounded-lg bg-brand text-champagne flex items-center justify-center font-black text-xs">
              SC
            </div>
            <span className="text-xs font-bold text-brand truncate max-w-[120px]">
              {store?.name || 'Storecraft'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-[var(--sc-muted)] font-medium">Merchant Dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchRole(user?.role === 'owner' ? 'staff' : 'owner')}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-brand/10 text-brand font-semibold border border-brand/20 hover:bg-brand/15 transition-all min-h-[36px]"
            >
              Role: <span className="capitalize">{user?.role}</span> · switch
            </button>
            <Link
              to={`/s/${store?.slug}`}
              className="text-xs p-1.5 rounded-lg border border-champagne-border text-[var(--sc-muted)] hover:text-brand hover:border-brand/40 md:hidden transition-colors"
              aria-label="View live store"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden sticky bottom-0 z-30 bg-champagne-card border-t border-champagne-border flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            if (item.ownerOnly && isStaff) return null
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 min-w-[44px] min-h-[44px] justify-center transition-colors',
                  isActive ? 'text-brand' : 'text-[var(--sc-muted)] hover:text-brand'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Global AI Chatbot */}
      <ChatbotPanel />
    </div>
  )
}
