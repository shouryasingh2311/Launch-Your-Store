import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Store, ExternalLink, Sparkles, LogOut
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { DemoShowcaseModal, DEMO_WINDOWS } from '../components/storefront/DemoShowcaseModal'
import { DEMO_STORE_PRODUCTS, INITIAL_PRODUCTS } from '../lib/mockData'
import { cn } from '../lib/utils'

export function LandingPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('demo-fashion')

  const activeWindow = DEMO_WINDOWS.find(w => w.id === activeTab) || DEMO_WINDOWS[0]
  const sampleProducts = (DEMO_STORE_PRODUCTS[activeTab] || INITIAL_PRODUCTS).slice(0, 3)

  const handleAdminClick = () => {
    if (isAuthenticated && user?.role === 'owner') {
      navigate('/admin/dashboard')
    } else {
      navigate('/login?redirect=/admin/dashboard')
    }
  }

  const handleMakeYourOwnClick = () => {
    if (isAuthenticated) {
      navigate('/onboarding')
    } else {
      navigate('/signup?redirect=/onboarding')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-champagne-card/90 backdrop-blur-md border-b border-champagne-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
            <div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center font-black text-champagne text-xs shadow-clay-btn">
              SK
            </div>
            <div>
              <span className="font-poppins font-bold text-brand text-sm sm:text-base block leading-tight tracking-tight">
                StoreKraft
              </span>
              <span className="text-[10px] text-[var(--sc-muted)] leading-none">Craft your store in minutes</span>
            </div>
          </Link>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-3">
            <Link
              to="/demos"
              className="text-xs font-semibold text-brand hover:text-brand-hover px-2 py-1 rounded-md transition-colors hidden sm:inline-block"
            >
              4 Demo Stores
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-xs font-semibold text-brand px-2">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-[var(--sc-muted)] hover:text-brand transition-colors rounded-lg flex items-center gap-1 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate('/login')} className="text-xs font-bold px-3.5 h-8">
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main Hero & Interactive Showcase (Single-page, no scroll needed) ── */}
      <main className="flex-1 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">

          {/* Left Column: Hero & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-brand/10 text-brand border border-brand/20">
                <Sparkles className="h-3 w-3" />
                <span>Commercial No-Code Store Builder</span>
              </div>

              <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand tracking-tight leading-[1.12]">
                Your store.<br />
                <span className="text-[var(--sc-ink)]">Online in minutes.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[var(--sc-muted)] leading-relaxed max-w-md">
                Pick a tailored aesthetic, seed your catalog with one click, and launch a complete e-commerce storefront with instant checkout and merchant operations.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="lg" onClick={handleMakeYourOwnClick} className="font-bold text-xs sm:text-sm px-6 h-11 shadow-clay-btn">
                Make your own <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsDemoModalOpen(true)}
                className="text-xs sm:text-sm px-5 h-11 font-semibold"
              >
                <Store className="h-4 w-4 mr-1.5" />
                View 4 Demos
              </Button>
            </div>

            {/* Quick Aesthetic Switcher Pills */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sc-muted)] block">
                Choose an aesthetic to preview:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_WINDOWS.map((win) => {
                  const Icon = win.icon
                  const isActive = activeTab === win.id
                  return (
                    <button
                      key={win.id}
                      type="button"
                      onClick={() => setActiveTab(win.id)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer text-xs",
                        isActive
                          ? "bg-brand text-champagne border-brand font-bold shadow-sm"
                          : "bg-white/90 border-champagne-border text-[var(--sc-ink)] hover:border-brand/40 hover:bg-white"
                      )}
                    >
                      <div className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs",
                        isActive ? "bg-white/20 text-champagne" : "bg-brand/10 text-brand"
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs leading-tight">{win.storeName}</p>
                        <span className={cn(
                          "text-[9px] block opacity-80 truncate",
                          isActive ? "text-champagne/80" : "text-[var(--sc-muted)]"
                        )}>
                          {win.vertical.split('&')[0]}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Store Showcase Window (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <div className="clay-card overflow-hidden shadow-xl border border-champagne-border bg-white rounded-2xl transition-all duration-300">

              {/* Browser Device Header Bar */}
              <div className="bg-[#FAF6F0] px-3.5 py-2 border-b border-champagne-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  <div className="ml-2 px-2.5 py-0.5 rounded-md bg-white border border-champagne-border text-[11px] font-mono text-[var(--sc-muted)] flex items-center gap-1">
                    <span className="text-emerald-700 font-bold">https://</span>
                    <span className="text-[var(--sc-ink)] truncate max-w-[170px] sm:max-w-none">
                      storekraft.com/s/{activeWindow.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    Live Tenant
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/s/${activeWindow.slug}`)}
                    className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors"
                  >
                    <span>Full Store</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Dynamic Theme Storefront Canvas */}
              <div
                className="p-4 sm:p-5 transition-colors duration-300 relative"
                style={{
                  backgroundColor: activeWindow.bgColor,
                  color: activeWindow.textColor
                }}
              >
                {/* Store Mini Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-current/15">
                  <div className="min-w-0">
                    <span
                      className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1"
                      style={{
                        backgroundColor: `${activeWindow.accentColor}25`,
                        color: activeWindow.accentColor
                      }}
                    >
                      {activeWindow.vertical}
                    </span>
                    <h3
                      className="text-lg sm:text-xl font-bold tracking-tight truncate"
                      style={{ fontFamily: activeWindow.font.split('+')[0].trim() }}
                    >
                      {activeWindow.storeName}
                    </h3>
                    <p className="text-[11px] opacity-75 mt-0.5 max-w-sm line-clamp-1">
                      {activeWindow.tagline}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate(`/s/${activeWindow.slug}`)}
                    style={{
                      backgroundColor: activeWindow.accentColor,
                      color: '#ffffff'
                    }}
                    className="text-xs font-semibold shadow-xs flex-shrink-0 hover:opacity-90 h-8 px-3"
                  >
                    Enter Store →
                  </Button>
                </div>

                {/* 3 Real Product Cards from this Template */}
                <div className="grid grid-cols-3 gap-2.5 pt-3">
                  {sampleProducts.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="rounded-xl overflow-hidden border border-current/10 bg-white/5 backdrop-blur-xs flex flex-col justify-between group hover:scale-[1.02] transition-transform"
                    >
                      <div className="aspect-square w-full overflow-hidden relative bg-black/20">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="eager"
                        />
                        <span
                          className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs"
                          style={{
                            backgroundColor: activeWindow.accentColor,
                            color: '#ffffff'
                          }}
                        >
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <h4 className="text-[11px] font-medium leading-tight truncate">
                          {p.name}
                        </h4>
                        <span className="text-[9px] opacity-70 block truncate">
                          {p.categoryName || activeWindow.vertical}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini Footer Bar */}
                <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[11px] opacity-80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px]">Instant Checkout · Mobile Ready</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/onboarding')}
                    className="text-[10px] underline font-semibold hover:opacity-100"
                  >
                    Customize in wizard →
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-champagne-border py-3 bg-champagne-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--sc-muted)]">
          <p>© 2026 StoreKraft. Craft your store in minutes.</p>
          <div className="flex items-center gap-4">
            <button onClick={handleAdminClick} className="hover:text-brand transition-colors font-medium">
              Admin Portal
            </button>
            <span>·</span>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-brand transition-colors font-medium"
            >
              4 Demo Stores
            </button>
            <span>·</span>
            <button onClick={handleMakeYourOwnClick} className="hover:text-brand transition-colors font-medium">
              Create Store
            </button>
          </div>
        </div>
      </footer>

      {/* Demo Showcase Modal */}
      <DemoShowcaseModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectTemplate={(template) => {
          setIsDemoModalOpen(false)
          navigate(`/s/${template.slug}`)
        }}
      />
    </div>
  )
}
