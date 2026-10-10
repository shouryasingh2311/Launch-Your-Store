import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Search, Sparkles, ArrowRight, Zap, Check,
  Cpu, Sliders, Volume2, ShieldCheck, Terminal, Award
} from 'lucide-react'
import { formatINR } from '../../../lib/utils'
import { DEMO_STORE_PRODUCTS, DEMO_STORES } from '../../../lib/mockData'
import { useCartStore } from '../../../store/useCartStore'
import { useToast } from '../../ui/Toast'
import { CartDrawer } from '../CartDrawer'
import { CheckoutModal } from '../CheckoutModal'
import { ProductDetailModal } from '../ProductDetailModal'

const ELEC_PRODUCTS = DEMO_STORE_PRODUCTS['demo-electronics']
const STORE_DATA = DEMO_STORES['demo-electronics']

export function ElectronicsStorefront() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [justAddedId, setJustAddedId] = useState(null)

  const { stores, openCart, addItem } = useCartStore()
  const toast = useToast()

  const cartItems = stores['demo-electronics'] || []
  const cartCount = cartItems.reduce((acc, it) => acc + it.qty, 0)

  const handleQuickAdd = (product, e) => {
    e.stopPropagation()
    addItem('demo-electronics', product, null, 1)
    toast.success('Hardware Added', `${product.name} staged in deployment cart.`)
    setJustAddedId(product.id)
    setTimeout(() => setJustAddedId(null), 1400)
  }

  const categories = [
    { id: 'all', name: 'All Pro Gear' },
    { id: 'Wireless Audio & ANC', name: 'Studio Acoustics' },
    { id: 'Mechanical Keyboards', name: 'Mechanical Keyboards' },
    { id: 'Studio Reference Sound', name: 'Reference Sound' },
    { id: 'Desk Ambient Lighting', name: 'Desk Lighting' },
    { id: 'Fast Charging Stations', name: 'Charging Docks' },
  ]

  const filtered = ELEC_PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryName === activeCategory
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#E2E8F0] font-sans selection:bg-teal-500 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* ── Cyber Telemetry Status Bar ────────────────────── */}
        <div className="bg-[#05080F] border-b border-teal-500/20 py-2 px-4 text-xs font-mono text-teal-400 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            <span>CORE NODE: ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">LDAC 990KBPS HI-RES AUDIO ENABLED</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span>2-YEAR ADVANCED HARDWARE REPLACEMENT</span>
            <span className="text-teal-400 font-bold">EXPRESS 48H DISPATCH</span>
          </div>
        </div>

        {/* ── Technical Hardware Header ────────────────────── */}
        <header className="sticky top-0 z-40 bg-[#0A0E17]/95 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Brand Logo & Telemetry */}
            <Link to="/s/demo-electronics" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors shadow-lg shadow-teal-500/10">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono font-bold text-lg text-white tracking-wider block">
                  PULSE AUDIO & TECH
                </span>
                <span className="text-[10px] font-mono text-teal-400 tracking-widest block uppercase">
                  Acoustic Hardware Engineering
                </span>
              </div>
            </Link>

            {/* Navigation Specs */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase text-slate-400">
              <button onClick={() => setActiveCategory('Wireless Audio & ANC')} className="hover:text-teal-400 transition-colors">
                ANC Acoustics
              </button>
              <button onClick={() => setActiveCategory('Mechanical Keyboards')} className="hover:text-teal-400 transition-colors">
                Keyboards
              </button>
              <button onClick={() => setActiveCategory('Studio Reference Sound')} className="hover:text-teal-400 transition-colors">
                Studio Monitors
              </button>
              <a href="#tech-specs" className="hover:text-cyan-400 text-teal-400 transition-colors flex items-center gap-1">
                Benchmarks <Zap className="h-3 w-3" />
              </a>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search SKUs, specs..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-400 w-48 font-mono"
                />
              </div>

              {/* Cart Trigger */}
              <button
                onClick={openCart}
                className="relative px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/40 text-teal-300 hover:bg-teal-500 hover:text-slate-950 transition-all text-xs font-mono font-bold flex items-center gap-2 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Deployment Bag</span>
                {cartCount > 0 && (
                  <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ── Cyber Hero Banner ────────────────────────────── */}
        <section className="relative border-b border-slate-800 bg-[#0E1320] overflow-hidden py-16 sm:py-24">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/30">
              <Zap className="h-3.5 w-3.5 text-teal-400" /> Studio Grade • 40mm Beryllium Drivers
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight font-space">
              Engineered For Audio Purists & Creators.
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Hybrid 42dB active noise cancellation, factory-lubed linear switches, flat-response active reference monitors, and high-performance desk hardware.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById('tech-catalog')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-3.5 rounded-lg bg-teal-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2"
              >
                Browse Pro Lineup <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">LDAC Certified</span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">45-Hour ANC</span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">Hot-Swap PCB</span>
              </div>
            </div>

            {/* Live Interactive Spec Dials */}
            <div id="tech-specs" className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 max-w-4xl mx-auto text-left">
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-teal-400 uppercase tracking-widest block">FREQUENCY CURVE</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">5Hz – 40,000Hz</div>
                <p className="text-xs text-slate-400 mt-1">Ultra-flat audio mastering spectrum with zero harmonic distortion.</p>
              </div>
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block">INPUT LATENCY</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">0.2ms Ultra-Fast</div>
                <p className="text-xs text-slate-400 mt-1">1000Hz polling rate via 2.4GHz proprietary RF wireless protocol.</p>
              </div>
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-teal-400 uppercase tracking-widest block">DRIVER ARCHITECTURE</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">Pure Beryllium Foil</div>
                <p className="text-xs text-slate-400 mt-1">Rigid, lightweight diaphragm delivering unmatched transient speed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hardware Catalog Section ─────────────────────── */}
        <main id="tech-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-10 overflow-x-auto gap-4">
            <div className="flex items-center gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeCategory === c.id
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-teal-400 shrink-0">
              {filtered.length} Pro Hardware Units
            </span>
          </div>

          {/* Hardware Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-[#0D121F] border border-slate-800 hover:border-teal-500/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                {/* Product Image with Tech HUD Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/90 border border-teal-500/40 text-teal-400 text-[10px] font-mono px-2 py-0.5 rounded">
                    SKU: {product.sku}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/90 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                    Stock: {product.stock} units
                  </div>
                </div>

                {/* Technical Card Details */}
                <div className="p-5 space-y-3 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider block mb-1">
                      {product.categoryName}
                    </span>
                    <h3 className="font-mono text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-mono font-bold text-teal-300">
                        {formatINR(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xs font-mono text-slate-500 line-through ml-2">
                          {formatINR(product.compare_at_price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={e => handleQuickAdd(product, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                        justAddedId === product.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-teal-500/10 border border-teal-500/40 text-teal-300 hover:bg-teal-500 hover:text-slate-950'
                      }`}
                    >
                      {justAddedId === product.id ? (
                        <>
                          <Check className="h-3 w-3" /> Staged
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3" /> Quick Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── Technical Hardware Footer ─────────────────────── */}
      <footer className="border-t border-slate-800 bg-[#060910] py-14 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              PULSE ACOUSTIC & HARDWARE CORP.
            </h4>
            <p className="max-w-md text-slate-400 leading-relaxed font-sans text-xs">
              Designing reference-grade audiophile equipment, custom mechanical typing boards, and creator ergonomics. Built for longevity with 2-year hardware replacement warranty.
            </p>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} Pulse Audio Systems Inc. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-white text-xs uppercase tracking-wider">Engineering Specs</h5>
            <p>Firmware v2.4.1 Release</p>
            <p>LDAC & Hi-Res Certification</p>
            <p>Gasket Switch Sound Tests</p>
          </div>

          <div className="space-y-2">
            <h5 className="text-white text-xs uppercase tracking-wider">Platform Hub</h5>
            <p>support@pulsehardware.tech</p>
            <p>Global Priority Dispatch</p>
            <Link to="/onboarding" className="text-teal-400 hover:underline block pt-2">
              Launch Your Own Storefront →
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        storeSlug="demo-electronics"
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSlug="demo-electronics"
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        storeSlug="demo-electronics"
      />
    </div>
  )
}
