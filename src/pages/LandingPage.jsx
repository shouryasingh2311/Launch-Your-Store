import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Store, LayoutDashboard, ShoppingBag, Palette, Sliders, Shield, LogOut } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useStoreData } from '../store/useStoreData'
import { useAuthStore } from '../store/useAuthStore'
import { DemoShowcaseModal } from '../components/storefront/DemoShowcaseModal'

const COMMERCIAL_CAPABILITIES = [
  {
    icon: Palette,
    title: 'Precision Brand Theming',
    desc: 'Live mobile preview with real-time controls for multi-color palettes, typography, button radius, and mobile layout positions.'
  },
  {
    icon: ShoppingBag,
    title: 'High-Converting Storefront',
    desc: 'Instant tenant store with responsive category filters, product discovery modal, slide-out cart drawer, and seamless checkout.'
  },
  {
    icon: LayoutDashboard,
    title: 'Merchant Command Center',
    desc: 'Comprehensive operational dashboard with gross revenue metrics, low-stock threshold triggers, and real-time inventory management.'
  },
  {
    icon: Sliders,
    title: 'Flexible Catalog Operations',
    desc: 'Seed instant demo collections, import bulk CSV/Excel product catalogs with error validation, or use rapid manual cataloguing.'
  },
  {
    icon: Shield,
    title: 'Role-Based Authentication',
    desc: 'Strict multi-tier security separating owner administration and staff operations with persistent session isolation.'
  },
  {
    icon: Store,
    title: 'Instant Production Deployment',
    desc: 'Generate a dedicated store URL with built-in QR code sharing for packaging, social commerce, and immediate sales.'
  }
]

export function LandingPage() {
  const navigate = useNavigate()
  const { store } = useStoreData()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
            <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center font-black text-champagne text-sm shadow-clay-btn">
              SK
            </div>
            <div>
              <span className="font-poppins font-bold text-brand text-base block leading-tight tracking-tight">
                StoreKraft
              </span>
              <span className="text-[10px] text-[var(--sc-muted)] leading-none">Craft your store in minutes</span>
            </div>
          </Link>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-xs font-semibold text-brand px-2">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-[var(--sc-muted)] hover:text-brand transition-colors rounded-lg flex items-center gap-1 text-xs"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate('/login')} className="text-xs font-bold px-4">
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main Hero & Compact Overview ─────────────────── */}
      <main className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-poppins font-extrabold text-3xl sm:text-5xl lg:text-6xl text-brand tracking-tight leading-[1.12]">
            Your commercial store,<br />
            <span className="relative inline-block">
              <span className="relative z-10">crafted in minutes.</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-2.5 bg-brand/15 rounded-full -z-0 blur-sm" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--sc-muted)] max-w-2xl mx-auto leading-relaxed">
            The complete no-code e-commerce platform built for modern retail. Configure branding, curate products, and launch your tenant storefront with integrated merchant operations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" onClick={handleMakeYourOwnClick} className="font-bold text-sm px-8">
              Make your own <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsDemoModalOpen(true)}
              className="text-sm px-6 font-semibold"
            >
              <Store className="h-4 w-4 mr-2" />
              Explore 4 Demo Stores
            </Button>
          </div>
        </div>

        {/* ── Commercial Capability Cards ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {COMMERCIAL_CAPABILITIES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="clay-card p-5 space-y-2.5 transition-all duration-200 hover:border-brand/40">
              <div className="h-9 w-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="font-poppins font-semibold text-sm text-brand">{title}</h2>
              <p className="text-xs text-[var(--sc-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-champagne-border py-5 bg-champagne-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--sc-muted)]">
          <p>© 2026 StoreKraft Technologies Inc. Commercial Store Platform.</p>
          <div className="flex items-center gap-4">
            <button onClick={handleAdminClick} className="hover:text-brand transition-colors font-medium">
              Admin Portal
            </button>
            <span>·</span>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-brand transition-colors font-medium"
            >
              4 Demo Storefronts
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
