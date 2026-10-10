import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Search, Sparkles, ArrowRight, Flame, Check,
  Compass, Heart, Feather, Droplets, Leaf
} from 'lucide-react'
import { formatINR } from '../../../lib/utils'
import { DEMO_STORE_PRODUCTS, DEMO_STORES } from '../../../lib/mockData'
import { useCartStore } from '../../../store/useCartStore'
import { useToast } from '../../ui/Toast'
import { CartDrawer } from '../CartDrawer'
import { CheckoutModal } from '../CheckoutModal'
import { ProductDetailModal } from '../ProductDetailModal'

const DECOR_PRODUCTS = DEMO_STORE_PRODUCTS['demo-decor']
const STORE_DATA = DEMO_STORES['demo-decor']

export function DecorStorefront() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [justAddedId, setJustAddedId] = useState(null)

  const { stores, openCart, addItem } = useCartStore()
  const toast = useToast()

  const cartItems = stores['demo-decor'] || []
  const cartCount = cartItems.reduce((acc, it) => acc + it.qty, 0)

  const handleQuickAdd = (product, e) => {
    e.stopPropagation()
    addItem('demo-decor', product, null, 1)
    toast.success('Added to Studio Basket', `${product.name} carefully wrapped.`)
    setJustAddedId(product.id)
    setTimeout(() => setJustAddedId(null), 1400)
  }

  const categories = [
    { id: 'all', name: 'All Studio Drops' },
    { id: 'Stoneware & Ceramic Vases', name: 'Ceramic Vases' },
    { id: 'Handcrafted Tableware', name: 'Tableware & Mugs' },
    { id: 'Sculptural Vessels', name: 'Stone Vessels' },
    { id: 'Botanical Amber Candles', name: 'Amber Candles' },
    { id: 'Organic Linen Textiles', name: 'Linen Textiles' },
  ]

  const filtered = DECOR_PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryName === activeCategory
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#292524] font-serif selection:bg-amber-200 selection:text-stone-900 flex flex-col justify-between">
      <div>
        {/* ── Studio Announcement Ticker ────────────────────── */}
        <div className="bg-[#ECE4D8] text-[#78350F] border-b border-[#DECFC0] py-2 px-4 text-center text-xs tracking-wider font-medium">
          Kiln Firing Batch #08 Live • Wheel-Thrown Stoneware Pottery • Plastic-Free Honeycomb Packaging
        </div>

        {/* ── Artisan Studio Header ────────────────────────── */}
        <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E7E0D5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Left Story Links */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-serif uppercase tracking-widest text-stone-600">
              <a href="#artisan-story" className="hover:text-amber-800 transition-colors">
                The Kiln Process
              </a>
              <button onClick={() => setActiveCategory('Stoneware & Ceramic Vases')} className="hover:text-amber-800 transition-colors">
                Pottery
              </button>
              <button onClick={() => setActiveCategory('Botanical Amber Candles')} className="hover:text-amber-800 transition-colors">
                Aromatics
              </button>
            </div>

            {/* Centered Brand Mark */}
            <div className="text-center">
              <Link to="/s/demo-decor" className="block group">
                <span className="font-serif text-2xl sm:text-3xl tracking-widest uppercase font-normal text-stone-900 block group-hover:text-amber-900 transition-colors">
                  TERRA LIVING
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 block font-sans">
                  Ceramics & Tactile Living
                </span>
              </Link>
            </div>

            {/* Right Basket & Search */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pieces..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E7E0D5] rounded-full text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-700 w-40 font-sans"
                />
              </div>

              {/* Basket Trigger */}
              <button
                onClick={openCart}
                className="relative px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-800 hover:border-amber-700 transition-colors text-xs font-serif tracking-wider flex items-center gap-2 shadow-2xs"
              >
                <ShoppingBag className="h-4 w-4 text-amber-700" />
                <span className="hidden sm:inline">Studio Basket</span>
                {cartCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center font-sans">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ── Warm Artisan Hero ────────────────────────────── */}
        <section className="relative border-b border-[#E7E0D5] bg-[#F4EDE2] overflow-hidden py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-serif tracking-widest uppercase bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/20">
                  <Flame className="h-3 w-3" /> Small-Batch Kiln Firing #08 Live
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-stone-900 tracking-tight leading-[1.12]">
                  Objects Sculpted with Clay, Fire & Soul.
                </h1>

                <p className="text-stone-600 text-sm sm:text-base max-w-xl font-sans font-light leading-relaxed">
                  Wheel-thrown stoneware pottery, Turkish travertine vessels, organic honeycomb linen throws, and hand-poured botanical candles crafted by generational artisans.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById('decor-catalog')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#B45309] text-white font-serif text-xs uppercase tracking-widest font-semibold hover:bg-amber-800 transition-all shadow-md shadow-amber-900/15 flex items-center gap-2"
                  >
                    View Studio Drops <Compass className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-stone-500 italic">
                    100% Recyclable Honeycomb Packaging
                  </span>
                </div>
              </div>

              {/* Artisan Pottery Showcase Imagery */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white group">
                  <img
                    src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80"
                    alt="Artisan Stoneware"
                    className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase font-serif tracking-widest text-amber-200">Wood-Fired at 1280°C</span>
                    <p className="font-serif text-lg font-normal">Volcanic Glaze Ribbed Stoneware Vase</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── The 4 Stages of the Wheel Strip ───────────────── */}
        <section id="artisan-story" className="border-b border-[#E7E0D5] bg-[#FDFCFA] py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-center font-serif text-xl sm:text-2xl text-stone-900 mb-8 font-normal">
              The Artisan Pottery Method
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
              <div className="space-y-1.5 p-3">
                <span className="font-sans font-bold text-amber-800 text-sm">01. CLAY WEDGING</span>
                <p className="text-stone-500 font-sans leading-relaxed">Natural high-fire stoneware thoroughly kneaded to eliminate air pockets.</p>
              </div>
              <div className="space-y-1.5 p-3">
                <span className="font-sans font-bold text-amber-800 text-sm">02. WHEEL THROWING</span>
                <p className="text-stone-500 font-sans leading-relaxed">Slow-spinning kickwheel shaping giving each vessel singular organic contours.</p>
              </div>
              <div className="space-y-1.5 p-3">
                <span className="font-sans font-bold text-amber-800 text-sm">03. KILN FIRING</span>
                <p className="text-stone-500 font-sans leading-relaxed">Fired for 36 hours at 1,280°C in an authentic wood-stoked kiln.</p>
              </div>
              <div className="space-y-1.5 p-3">
                <span className="font-sans font-bold text-amber-800 text-sm">04. VOLCANIC GLAZE</span>
                <p className="text-stone-500 font-sans leading-relaxed">Hand-dipped mineral glazes creating tactile stone textures.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Catalog Section ──────────────────────────────── */}
        <main id="decor-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Category Filter Chips */}
          <div className="flex items-center justify-between border-b border-[#E7E0D5] pb-5 mb-10 overflow-x-auto gap-4 font-sans">
            <div className="flex items-center gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-xs transition-all ${
                    activeCategory === c.id
                      ? 'bg-amber-800 text-white font-medium shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-300 hover:text-stone-900'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-500 shrink-0 font-serif">
              {filtered.length} Handcrafted Pieces
            </span>
          </div>

          {/* Organic Pottery Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white border border-[#E7E0D5] hover:border-amber-700/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                {/* 1:1 Aspect ratio square image */}
                <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-sans font-medium px-2.5 py-1 rounded-full shadow-2xs">
                    Kiln Batch #08
                  </div>
                </div>

                {/* Card Editorial Info */}
                <div className="p-6 space-y-3 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-amber-800 font-semibold block mb-1">
                      {product.categoryName}
                    </span>
                    <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs font-sans text-stone-600 font-light line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#E7E0D5] flex items-center justify-between font-sans">
                    <div>
                      <span className="text-base font-serif font-semibold text-stone-900">
                        {formatINR(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xs text-stone-400 line-through ml-2 font-serif">
                          {formatINR(product.compare_at_price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={e => handleQuickAdd(product, e)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                        justAddedId === product.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-900 text-white hover:bg-amber-800'
                      }`}
                    >
                      {justAddedId === product.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Wrapped
                        </>
                      ) : (
                        'Add to Basket'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── Organic Ceramic Studio Footer ─────────────────── */}
      <footer className="border-t border-[#E7E0D5] bg-[#F4EDE2] py-14 text-xs font-sans text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <h4 className="font-serif text-lg text-stone-900 tracking-wider">
              TERRA LIVING & CERAMIC WORKSHOP
            </h4>
            <p className="max-w-md font-light leading-relaxed">
              Hand-thrown stoneware pottery, sculptural mineral vessels, and clean-burning botanical aromatics. Every piece carries the signature stamp of our studio kiln.
            </p>
            <p className="text-[11px] text-stone-500 font-serif">
              © {new Date().getFullYear()} Terra Living Co. Handcrafted with reverence.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 text-xs">Studio Location</h5>
            <p>Kiln Barn No. 4, Indiranagar</p>
            <p>Bengaluru, Karnataka - 560038</p>
            <p>Studio Open: Tue - Sun (11am - 7pm)</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 text-xs">Craft Guarantee</h5>
            <p>100% Non-Toxic Food Safe Glazes</p>
            <p>Safe Transit Bubble Guarantee</p>
            <Link to="/onboarding" className="text-amber-800 font-semibold hover:underline block pt-2 font-serif">
              Launch Your Own Storefront →
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        storeSlug="demo-decor"
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSlug="demo-decor"
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        storeSlug="demo-decor"
      />
    </div>
  )
}
