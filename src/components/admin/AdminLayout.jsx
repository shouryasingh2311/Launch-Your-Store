import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Settings, ExternalLink, Store, LogOut, ShieldAlert, KeyRound, Globe } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useStoreData } from '../../store/useStoreData'
import { useToast } from '../ui/Toast'
import { ChatbotPanel } from '../chatbot/ChatbotPanel'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'

export function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const { user, isAuthenticated, switchRole, logout } = useAuthStore()
  const { store } = useStoreData()

  // Modal state for switching from Staff to Owner
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
    }
  }, [isAuthenticated, location.pathname, navigate])

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products',  path: '/admin/products',  icon: Package },
    { label: 'Orders',    path: '/admin/orders',    icon: ShoppingCart },
    { label: 'Settings',  path: '/admin/settings',  icon: Settings, ownerOnly: true },
  ]

  const isStaff = user?.role === 'staff'

  const handleRoleToggle = () => {
    if (user?.role === 'owner') {
      // Direct downgrade to staff
      switchRole('staff')
      toast.info('Role Updated', 'Switched to Staff operational mode.')
    } else {
      // Prompt for admin password to become Owner
      setAdminPasswordInput('')
      setAuthError('')
      setShowAuthModal(true)
    }
  }

  const handleConfirmOwnerAuth = (e) => {
    e.preventDefault()
    try {
      switchRole('owner', adminPasswordInput)
      setShowAuthModal(false)
      toast.success('Authenticated as Owner', 'Full administrative permissions granted.')
    } catch (err) {
      setAuthError(err.message || 'Invalid administrator password.')
    }
  }

  const handleSignOut = () => {
    logout()
    toast.info('Signed Out', 'You have been signed out.')
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="w-60 hidden md:flex flex-col justify-between shrink-0 bg-[var(--sc-ink)] text-[var(--sc-champagne)]">
        <div>
          <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[var(--sc-champagne)] text-[var(--sc-ink)] flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
              SK
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-[var(--sc-champagne)] font-poppins leading-tight truncate">
                {store?.name || 'StoreKraft Admin'}
              </h2>
              <span className="text-[10px] text-white/40 font-mono truncate block">/s/{store?.slug || 'craft-haven'}</span>
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
          {/* Platform Owner view link for owners */}
          {user?.role === 'owner' && (
            <div className="px-3 pt-2">
              <Link
                to="/owner/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-200/90 hover:text-white hover:bg-white/10 transition-colors border border-amber-300/25 bg-white/5"
              >
                <Globe className="h-3.5 w-3.5 text-amber-300" />
                <span>Platform Owner View</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to={`/s/${store?.slug || 'craft-haven'}`}
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
                {user?.name || 'Administrator'}
              </span>
              <Badge variant={user?.role === 'owner' ? 'indigo' : 'warning'} size="sm" className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/50">
              <button
                onClick={handleRoleToggle}
                className="text-[var(--sc-champagne)]/80 hover:text-[var(--sc-champagne)] underline font-semibold transition-colors"
              >
                Switch to {user?.role === 'owner' ? 'Staff' : 'Owner'}
              </button>
              <button
                onClick={handleSignOut}
                className="text-white/40 hover:text-red-300 flex items-center gap-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-champagne-card border-b border-champagne-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-7 w-7 rounded-lg bg-brand text-champagne flex items-center justify-center font-black text-xs">
              SK
            </div>
            <span className="text-xs font-bold text-brand truncate max-w-[140px]">
              {store?.name || 'StoreKraft'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-[var(--sc-muted)] font-medium">StoreKraft Merchant Dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRoleToggle}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-brand/10 text-brand font-semibold border border-brand/20 hover:bg-brand/15 transition-all min-h-[36px]"
            >
              Role: <span className="capitalize">{user?.role}</span> · switch
            </button>
            <button
              onClick={handleSignOut}
              className="text-xs p-1.5 rounded-lg border border-champagne-border text-[var(--sc-muted)] hover:text-brand hover:border-brand/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <Link
              to={`/s/${store?.slug || 'craft-haven'}`}
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

      {/* ── Owner Authentication Modal ────────────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-sm text-brand">Owner Authentication</h3>
                <p className="text-xs text-[var(--sc-muted)]">Confirm administrator credentials</p>
              </div>
            </div>

            <p className="text-xs text-[var(--sc-muted)]">
              Switching to Owner unlocks financial revenue data, staff management, and brand settings.
            </p>

            <form onSubmit={handleConfirmOwnerAuth} className="space-y-3">
              <Input
                label="Admin Password"
                type="password"
                required
                autoFocus
                placeholder="Enter admin password (default: admin)"
                value={adminPasswordInput}
                onChange={e => { setAdminPasswordInput(e.target.value); setAuthError('') }}
              />

              {authError && (
                <div className="p-2 rounded-lg bg-red-100 text-red-800 text-xs flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {authError}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-bold">
                  Authenticate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global AI Chatbot */}
      <ChatbotPanel />
    </div>
  )
}
