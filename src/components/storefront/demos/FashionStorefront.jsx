import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Search, Sparkles, ArrowRight, Eye, Check,
  ChevronRight, Heart, Globe, ArrowUpRight, ShieldCheck, Truck, RefreshCw
} from 'lucide-react'
import { formatINR } from '../../../lib/utils'
import { DEMO_STORE_PRODUCTS, DEMO_STORES } from '../../../lib/mockData'
import { useCartStore } from '../../../store/useCartStore'
import { useToast } from '../../ui/Toast'
import { CartDrawer } from '../CartDrawer'
import { CheckoutModal } from '../CheckoutModal'
import { ProductDetailModal } from '../ProductDetailModal'

const FASHION_PRODUCTS = DEMO_STORE_PRODUCTS['demo-fashion']
const STORE_DATA = DEMO_STORES['demo-fashion']

export function FashionStorefront() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [justAddedId, setJustAddedId] = useState(null)

  const { stores, openCart, addItem } = useCartStore()
  const toast = useToast()

  const cartItems = stores['demo-fashion'] || []
  const cartCount = cartItems.reduce((acc, it) => acc + it.qty, 0)

  const handleQuickAdd = (product, e) => {
    e.stopPropagation()
    addItem('demo-fashion', product, null, 1)
    toast.success('Added to Wardrobe Bag', `${product.name} is reserved.`)
    setJustAddedId(product.id)
    setTimeout(() => setJustAddedId(null), 1400)
  }

  const categories = [
    { id: 'all', name: 'All Capsule Drops' },
    { id: 'Outerwear & Jackets', name: 'Outerwear' },
    { id: 'Italian Linen & Shirts', name: 'Italian Linen' },
    { id: 'Haute Knitwear & Silk', name: 'Silk & Knitwear' },
    { id: 'Tuscan Leather Footwear', name: 'Tuscan Footwear' },
  ]

  const filtered = FASHION_PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryName === activeCategory
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#121214] text-[#F4F4F5] font-sans selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* ── Haute Couture Ticker ──────────────────────────── */}
        <div className="bg-[#1C1917] text-rose-300 border-b border-rose-950/40 py-2 px-4 text-center text-[11px] font-serif tracking-widest uppercase">
          Autumn / Winter 2026 Lookbook Capsule • Complimentary Global Courier on Orders over ₹4,999
        </div>

        {/* ── Editorial Header ─────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Left Menu */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-serif uppercase tracking-widest text-zinc-400">
              <button onClick={() => setActiveCategory('all')} className="hover:text-rose-300 transition-colors">
                Runway
              </button>
              <button onClick={() => setActiveCategory('Outerwear & Jackets')} className="hover:text-rose-300 transition-colors">
                Outerwear
              </button>
              <button onClick={() => setActiveCategory('Haute Knitwear & Silk')} className="hover:text-rose-300 transition-colors">
                Silk Atelier
              </button>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500 font-sans text-[11px]">Milano • Paris • Tokyo</span>
            </div>

            {/* Centered Brand Wordmark */}
            <div className="text-center">
              <Link to="/s/demo-fashion" className="block group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-normal uppercase text-white block group-hover:text-rose-300 transition-colors">
                  ATELIER NOIR
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-500 block font-serif">
                  Haute Couture & Ready-to-Wear
                </span>
              </Link>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search lookbook..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-rose-400/50 w-44"
                />
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative px-3.5 py-2 border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-rose-400/50 transition-colors text-xs font-serif uppercase tracking-wider flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4 text-rose-300" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ── Editorial Lookbook Hero ──────────────────────── */}
        <section className="relative border-b border-zinc-800 bg-[#16161A] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  <Sparkles className="h-3 w-3" /> Lookbook Vol. IV Released
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.08]">
                  Silhouette.<br />
                  <span className="italic font-light text-rose-300">Form in Motion.</span>
                </h1>

                <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-light leading-relaxed">
                  Sculpted double-breasted cashmere trench coats, raw Kurabo selvedge denim, and 22-momme pure mulberry silk. Designed in Milan with uncompromising tailoring.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById('fashion-catalog')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="px-8 py-3.5 bg-rose-500 text-zinc-950 font-serif uppercase tracking-widest text-xs font-bold hover:bg-rose-400 transition-all flex items-center gap-2 shadow-lg shadow-rose-950/50"
                  >
                    Explore Runway Capsule <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs text-zinc-500 font-serif italic">
                    Limited Run • Handcrafted Tailoring
                  </span>
                </div>
              </div>

              {/* High Fashion Imagery */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                    alt="Atelier Lookbook"
                    className="w-full h-[480px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] tracking-widest uppercase font-serif text-rose-300">Milano Studio</span>
                    <p className="font-serif text-lg font-normal">Virgin Wool Trench & Mulberry Silk</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Press Endorsements Strip ─────────────────────── */}
        <div className="border-b border-zinc-800 bg-[#0E0E10] py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-around gap-6 text-zinc-600 font-serif tracking-[0.25em] text-xs sm:text-sm uppercase">
            <span className="hover:text-zinc-400 transition-colors">VOGUE ITALIA</span>
            <span className="hover:text-zinc-400 transition-colors">GQ STYLE</span>
            <span className="hover:text-zinc-400 transition-colors">HARPER'S BAZAAR</span>
            <span className="hover:text-zinc-400 transition-colors">HYPEBEAST</span>
            <span className="hover:text-zinc-400 transition-colors">ELLE FASHION</span>
          </div>
        </div>

        {/* ── Catalog Section ──────────────────────────────── */}
        <main id="fashion-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Category Filter Chips */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-10 overflow-x-auto gap-4">
            <div className="flex items-center gap-3">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-4 py-2 text-xs font-serif tracking-wider uppercase transition-all border ${
                    activeCategory === c.id
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/40 font-semibold'
                      : 'text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <span className="text-xs font-serif text-zinc-500 shrink-0">
              {filtered.length} Tailored Pieces
            </span>
          </div>

          {/* Staggered Fashion Lookbook Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-[#17171C] border border-zinc-800 hover:border-rose-900/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
              >
                {/* 3:4 Tall Portrait Aspect Ratio Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-zinc-950/90 text-rose-200 font-serif text-xs uppercase tracking-widest border border-zinc-700">
                      View Garment Details
                    </span>
                  </div>

                  {/* Stock or sale badge */}
                  {product.compare_at_price && (
                    <div className="absolute top-3 left-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-[10px] font-serif uppercase tracking-wider px-2 py-0.5">
                      Runway Exclusive
                    </div>
                  )}
                </div>

                {/* Card Editorial Info */}
                <div className="p-5 space-y-3 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-serif tracking-widest uppercase text-zinc-500 block mb-1">
                      {product.categoryName}
                    </span>
                    <h3 className="font-serif text-base font-normal text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-serif font-semibold text-white">
                        {formatINR(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xs text-zinc-500 line-through ml-2 font-serif">
                          {formatINR(product.compare_at_price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={e => handleQuickAdd(product, e)}
                      className={`px-3 py-1.5 text-xs font-serif tracking-wider uppercase transition-all flex items-center gap-1 border ${
                        justAddedId === product.id
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-rose-400 hover:text-white'
                      }`}
                    >
                      {justAddedId === product.id ? (
                        <>
                          <Check className="h-3 w-3" /> Added
                        </>
                      ) : (
                        'Add to Bag'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── Haute Couture Footer ──────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-[#0C0C0E] py-14 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <h4 className="font-serif text-lg uppercase tracking-widest text-white">
              ATELIER NOIR
            </h4>
            <p className="max-w-md font-light leading-relaxed">
              Purveyors of contemporary haute couture and bespoke silhouettes. Every garment is crafted with registered textile mills across Milan and Kyoto.
            </p>
            <p className="text-[11px] text-zinc-600">
              © {new Date().getFullYear()} Atelier Noir S.r.l. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-serif uppercase tracking-widest text-zinc-300 text-xs">Boutiques</h5>
            <p>Via Monte Napoleone 14, Milano</p>
            <p>Rue du Faubourg Saint-Honoré, Paris</p>
            <p>Ginza 6-Chome, Tokyo</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-serif uppercase tracking-widest text-zinc-300 text-xs">Customer Service</h5>
            <p>concierge@ateliernoir.com</p>
            <p>White-Glove Courier Service</p>
            <Link to="/onboarding" className="text-rose-400 hover:underline block pt-2">
              Launch Your Own Storefront →
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        storeSlug="demo-fashion"
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSlug="demo-fashion"
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        storeSlug="demo-fashion"
      />
    </div>
  )
}
