import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ExternalLink, LogOut } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { SpecularButton } from '../components/ui/SpecularButton'
import { ScrollExpand } from '../components/ui/ScrollExpand'
import { useAuthStore } from '../store/useAuthStore'
import { DEMO_WINDOWS } from '../components/storefront/DemoShowcaseModal'
import { DEMO_STORE_PRODUCTS, INITIAL_PRODUCTS } from '../lib/mockData'
import { cn } from '../lib/utils'

export function LandingPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('demo-fashion')

  // Auto-cycle through the 4 storefront types on a regular time interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = DEMO_WINDOWS.findIndex(w => w.id === prev)
        const nextIndex = (currentIndex + 1) % DEMO_WINDOWS.length
        return DEMO_WINDOWS[nextIndex].id
      })
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  const activeWindow = DEMO_WINDOWS.find(w => w.id === activeTab) || DEMO_WINDOWS[0]
  const sampleProducts = (DEMO_STORE_PRODUCTS[activeTab] || INITIAL_PRODUCTS).slice(0, 3)

  const handleMakeYourOwnClick = () => {
    if (isAuthenticated) {
      navigate('/onboarding')
    } else {
      navigate('/signup?redirect=/onboarding')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── ScrollExpand Opening Transition: "Built to scale" -> Main Website ── */}
      <ScrollExpand
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85"
        alt="StoreKraft Store Builder"
        title="Built to scale"
        scrollHint="Scroll to enter"
        useWindowScroll={true}
        startWidth={44}
        startHeight={56}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.25}
        scrollDistance={0.9}
        holdDistance={0.2}
      >
        <div className="max-w-xl text-center space-y-3 px-6">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-300 drop-shadow-sm">
            StoreKraft Studio
          </span>
          <h2 className="font-poppins font-black text-2xl sm:text-4xl text-white drop-shadow-lg">
            Commerce Without Limits
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 drop-shadow">
            Scroll down to enter your store builder workspace
          </p>
        </div>
      </ScrollExpand>

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

          {/* Navigation Controls: Clean, no demo button */}
          <nav className="flex items-center gap-3">
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
              <Button size="sm" onClick={() => navigate('/login')} className="text-xs font-bold px-4 h-8">
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main Hero & Auto-Cycling Live Showcase ─────────── */}
      <main className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          {/* Left Column: Sharp Hero & Single Clear CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-4">
              <h1 className="font-poppins font-extrabold text-3xl sm:text-5xl lg:text-6xl text-brand tracking-tight leading-[1.08]">
                Your store.<br />
                <span className="text-[var(--sc-ink)]">Online in minutes.</span>
              </h1>

              <p className="text-sm sm:text-base text-[var(--sc-muted)] leading-relaxed max-w-md">
                Pick a tailored aesthetic, seed your catalog with one click, and launch a complete e-commerce storefront with instant checkout and merchant operations.
              </p>
            </div>

            {/* Primary Action Button: Specular Animated Button */}
            <div className="pt-2">
              <SpecularButton
                size="lg"
                radius={16}
                tint="#064E3B"
                tintOpacity={0.96}
                textColor="#F8E7C9"
                lineColor="#F59E0B"
                baseColor="#042F2E"
                intensity={1.25}
                shineSize={12}
                shineFade={36}
                thickness={1.5}
                followMouse={true}
                autoAnimate={true}
                speed={0.4}
                proximity={300}
                onClick={handleMakeYourOwnClick}
                className="font-bold text-sm shadow-clay-btn group"
              >
                <span className="flex items-center gap-2 font-poppins font-bold">
                  Make your own <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </SpecularButton>
            </div>
          </div>

          {/* Right Column: Auto-Cycling Live Storefront Window (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <div className="clay-card overflow-hidden shadow-2xl border border-champagne-border bg-white rounded-2xl transition-all duration-300">

              {/* Browser Device Header Bar */}
              <div className="bg-[#FAF6F0] px-4 py-2.5 border-b border-champagne-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  <div className="ml-2 px-3 py-1 rounded-md bg-white border border-champagne-border text-[11px] font-mono text-[var(--sc-muted)] flex items-center gap-1">
                    <span className="text-emerald-700 font-bold">https://</span>
                    <span className="text-[var(--sc-ink)] truncate max-w-[200px] sm:max-w-none">
                      storekraft.com/s/{activeWindow.slug}
                    </span>
                  </div>
                </div>

                {/* 4 Template Cycle Indicators */}
                <div className="flex items-center gap-1.5">
                  {DEMO_WINDOWS.map((win, idx) => {
                    const isActive = activeTab === win.id
                    return (
                      <button
                        key={win.id}
                        type="button"
                        onClick={() => setActiveTab(win.id)}
                        title={win.storeName}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 cursor-pointer",
                          isActive ? "w-5 bg-brand" : "w-2 bg-slate-300 hover:bg-slate-400"
                        )}
                        aria-label={`Switch to ${win.storeName}`}
                      />
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => navigate(`/s/${activeWindow.slug}`)}
                    className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors ml-2"
                  >
                    <span>Full Store</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Dynamic Theme Storefront Canvas */}
              <div
                className="p-5 sm:p-6 transition-colors duration-500 relative"
                style={{
                  backgroundColor: activeWindow.bgColor,
                  color: activeWindow.textColor
                }}
              >
                {/* Store Mini Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-current/15">
                  <div className="min-w-0">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1"
                      style={{
                        backgroundColor: `${activeWindow.accentColor}25`,
                        color: activeWindow.accentColor
                      }}
                    >
                      {activeWindow.vertical}
                    </span>
                    <h3
                      className="text-xl sm:text-2xl font-bold tracking-tight truncate"
                      style={{ fontFamily: activeWindow.font.split('+')[0].trim() }}
                    >
                      {activeWindow.storeName}
                    </h3>
                    <p className="text-xs opacity-75 mt-0.5 max-w-sm line-clamp-1">
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
                <div className="grid grid-cols-3 gap-3 pt-3.5">
                  {sampleProducts.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="rounded-xl overflow-hidden border border-current/10 bg-white/5 backdrop-blur-xs flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-200"
                    >
                      <div className="aspect-square w-full overflow-hidden relative bg-black/20">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="eager"
                        />
                        <span
                          className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs"
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
                <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs opacity-80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px]">Auto-showcasing 4 distinct storefront designs</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/onboarding')}
                    className="text-[11px] underline font-semibold hover:opacity-100"
                  >
                    Customize in wizard →
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Footer: Clean copyright only, no bottom buttons ── */}
      <footer className="border-t border-champagne-border py-3 bg-champagne-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[var(--sc-muted)]">
          <p>© 2026 StoreKraft. Craft your store in minutes.</p>
        </div>
      </footer>
    </div>
  )
}
