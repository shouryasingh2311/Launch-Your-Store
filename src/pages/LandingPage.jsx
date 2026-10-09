import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Store, LayoutDashboard, Wand2, ShoppingBag, Zap, Bot, Palette, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useStoreData } from '../store/useStoreData'

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI-Powered Setup',
    desc: 'Describe your business in one line. AI drafts your store name, categories and theme automatically.'
  },
  {
    icon: Palette,
    title: 'Full Theme Customiser',
    desc: 'Live phone preview as you change fonts, colours and button shapes. No design skills required.'
  },
  {
    icon: ShoppingBag,
    title: 'Complete Storefront',
    desc: 'Responsive hero, category filters, product grid, cart drawer and checkout — all included.'
  },
  {
    icon: LayoutDashboard,
    title: 'Merchant Admin',
    desc: 'Analytics, inventory CRUD, order management, and team roles in one clean dashboard.'
  },
  {
    icon: Bot,
    title: 'AI Store Assistant',
    desc: 'Ask "What is my revenue this week?" and get data-backed answers — never hallucinated figures.'
  },
  {
    icon: Zap,
    title: 'Live in 3 Minutes',
    desc: 'Unique public URL the moment you finish the wizard. Share it, QR it, print it.'
  },
]

export function LandingPage() {
  const { store } = useStoreData()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Navigation ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-champagne-card/80 backdrop-blur-md border-b border-champagne-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo wordmark */}
          <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
            <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center font-black text-champagne text-sm shadow-clay-btn">
              SC
            </div>
            <div>
              <span className="font-poppins font-bold text-brand text-base block leading-tight tracking-tight">
                Storecraft
              </span>
              <span className="text-[10px] text-[var(--sc-muted)] leading-none">Craft your store in minutes</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/login" className="text-xs font-semibold text-[var(--sc-muted)] hover:text-brand transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/admin/dashboard">
              <Button size="sm" variant="secondary" className="text-xs">
                Admin
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button size="sm" className="text-xs font-bold">
                Make your own <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">

          {/* Eye-catch badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
            bg-brand/10 text-brand border border-brand/20 mb-8">
            <Wand2 className="h-3.5 w-3.5" />
            AI-first no-code store builder
          </div>

          <h1 className="font-poppins font-extrabold text-4xl sm:text-6xl lg:text-7xl text-brand
            tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Your store,<br />
            <span className="relative inline-block">
              <span className="relative z-10">crafted in minutes.</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-brand/15 rounded-full -z-0 blur-sm" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--sc-muted)] max-w-xl mx-auto mt-6 leading-relaxed">
            Tell us what you sell. Storecraft asks a few quick questions, then hands you a fully themed, live storefront and merchant dashboard — zero code.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link to="/onboarding">
              <Button size="lg" className="font-bold text-sm px-8">
                Make your own <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to={`/s/${store?.slug}`}>
              <Button size="lg" variant="secondary" className="text-sm px-6">
                <Store className="h-4 w-4 mr-2" />
                See demo store
              </Button>
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-14 text-xs text-[var(--sc-muted)]">
            {['No credit card', 'Live in 3 minutes', 'AI setup included', 'Full admin dashboard'].map(f => (
              <span key={f} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* ── Feature grid ────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-brand">
              Everything you need, nothing you don't
            </h2>
            <p className="text-sm text-[var(--sc-muted)] mt-2">
              All 15 hackathon checkpoints shipped and verified.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="clay-card p-6 space-y-3 hover:scale-[1.01] transition-transform duration-200">
                <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-poppins font-semibold text-sm text-brand">{title}</h3>
                <p className="text-xs text-[var(--sc-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA strip ────────────────────────────── */}
        <section className="bg-brand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center space-y-6">
            <h2 className="font-poppins font-extrabold text-2xl sm:text-4xl text-champagne">
              Ready to open your store?
            </h2>
            <p className="text-sm text-champagne/75 max-w-md mx-auto">
              No setup fees. No designer. Just type what you sell and we'll handle the rest.
            </p>
            <Link to="/onboarding">
              <Button
                size="lg"
                className="bg-[var(--sc-champagne)] text-[var(--sc-ink)] hover:bg-champagne-card font-bold text-sm px-10
                  shadow-[0_3px_0_0_rgba(255,255,255,0.4)] active:shadow-none"
              >
                Make your own <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-champagne-border py-8 text-center text-xs text-[var(--sc-muted)]">
        <p>
          Storecraft — Built with React 18, Vite, Tailwind CSS · Cypher Hackathon
          &nbsp;·&nbsp;
          <Link to="/admin/dashboard" className="hover:text-brand transition-colors">Admin</Link>
          &nbsp;·&nbsp;
          <Link to={`/s/${store?.slug}`} className="hover:text-brand transition-colors">Demo store</Link>
        </p>
      </footer>
    </div>
  )
}
