import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, Search, Sparkles, ArrowRight, Check,
  Store, Award, Truck, RefreshCw, Star, ShieldCheck
} from 'lucide-react'
import { formatINR } from '../../../lib/utils'
import { INITIAL_PRODUCTS, PREDEFINED_CATEGORIES, DEMO_STORES } from '../../../lib/mockData'
import { useCartStore } from '../../../store/useCartStore'
import { useToast } from '../../ui/Toast'
import { CartDrawer } from '../CartDrawer'
import { CheckoutModal } from '../CheckoutModal'
import { ProductDetailModal } from '../ProductDetailModal'

const FLAGSHIP_PRODUCTS = INITIAL_PRODUCTS
const STORE_DATA = DEMO_STORES['craft-haven']

export function FlagshipStorefront() {
  const [activeDepartment, setActiveDepartment] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [justAddedId, setJustAddedId] = useState(null)

  const { stores, openCart, addItem } = useCartStore()
  const toast = useToast()

  const cartItems = stores['craft-haven'] || []
  const cartCount = cartItems.reduce((acc, it) => acc + it.qty, 0)

  const handleQuickAdd = (product, e) => {
    e.stopPropagation()
    addItem('craft-haven', product, null, 1)
    toast.success('Added to Cart', `${product.name} added to your shopping bag.`)
    setJustAddedId(product.id)
    setTimeout(() => setJustAddedId(null), 1400)
  }

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'cat-fashion', name: 'Fashion & Apparel' },
    { id: 'cat-electronics', name: 'Electronics & Audio' },
    { id: 'cat-home', name: 'Home & Ceramics' },
    { id: 'cat-jewellery', name: 'Fine Jewellery' },
    { id: 'cat-beauty', name: 'Beauty & Skincare' },
  ]

  const filtered = FLAGSHIP_PRODUCTS.filter(p => {
    const matchDept = activeDepartment === 'all' || p.category_id === activeDepartment
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchDept && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#F8E7C9] text-[#064E3B] font-sans selection:bg-[#064E3B] selection:text-[#F8E7C9] flex flex-col justify-between">
      <div>
        {/* ── Flagship Announcement Ticker ──────────────────── */}
        <div className="bg-[#064E3B] text-[#F8E7C9] py-2 px-4 text-center text-xs font-semibold tracking-wide">
          StoreKraft Flagship Department Store • Free Express Courier Delivery Across India Over ₹1,999 • Code: FLAGSHIP
        </div>

        {/* ── Flagship Department Header ────────────────────── */}
        <header className="sticky top-0 z-40 bg-[#FFF9EC]/95 backdrop-blur-md border-b border-[#E8D5AE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Logo & Brand Wordmark */}
            <Link to="/s/craft-haven" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-black text-lg shadow-sm">
                SK
              </div>
              <div>
                <span className="font-poppins font-black text-xl text-[#064E3B] tracking-tight block leading-tight">
                  STOREKRAFT FLAGSHIP
                </span>
                <span className="text-[10px] text-[#4B5F57] tracking-wider block font-medium uppercase">
                  Curated Multi-Category Department Store
                </span>
              </div>
            </Link>

            {/* Department Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#4B5F57]">
              {departments.slice(1, 5).map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDepartment(d.id)}
                  className="hover:text-[#064E3B] transition-colors"
                >
                  {d.name}
                </button>
              ))}
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4B5F57]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search all departments..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E8D5AE] rounded-lg text-[#064E3B] placeholder:text-[#4B5F57]/60 focus:outline-none focus:border-[#064E3B] w-48 shadow-2xs"
                />
              </div>

              {/* Shopping Bag Trigger */}
              <button
                onClick={openCart}
                className="relative px-4 py-2 rounded-xl bg-[#064E3B] text-[#F8E7C9] hover:bg-[#0A6048] transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Shopping Bag</span>
                {cartCount > 0 && (
                  <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-[#F8E7C9] text-[#064E3B] text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ── Flagship Grand Split Hero ────────────────────── */}
        <section className="relative border-b border-[#E8D5AE] bg-[#F8E7C9] overflow-hidden py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20">
                <Sparkles className="h-3.5 w-3.5" /> Spring Flagship Showcase 2026
              </div>

              <h1 className="font-poppins text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#064E3B] tracking-tight leading-[1.08]">
                Curated Department Store for Modern Living.
              </h1>

              <p className="text-[#4B5F57] text-sm sm:text-base max-w-2xl leading-relaxed">
                Explore our full spectrum of departments spanning Japanese selvedge apparel, beryllium studio acoustic hardware, wheel-thrown ceramic pottery, and fine vermeil jewelry.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('flagship-catalog')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-8 py-3.5 rounded-xl bg-[#064E3B] text-[#F8E7C9] font-bold text-xs uppercase tracking-wider hover:bg-[#0A6048] transition-all shadow-md shadow-[#064E3B]/20 flex items-center gap-2"
                >
                  Explore All Departments <ArrowRight className="h-4 w-4" />
                </button>
                <span className="text-xs text-[#4B5F57] font-medium">
                  Verified Artisan & Manufacturer Guarantee
                </span>
              </div>
            </div>

            {/* Department Pillars Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-14 border-t border-[#E8D5AE] mt-12 text-[#4B5F57]">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-[#064E3B]" />
                <span className="text-xs font-semibold">Verified Multi-Category Quality Standards</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-[#064E3B]" />
                <span className="text-xs font-semibold">Priority Express Delivery Across 24,000+ Pincodes</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-[#064E3B]" />
                <span className="text-xs font-semibold">Hassle-Free 7-Day Doorstep Exchange Policy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Catalog Section ──────────────────────────────── */}
        <main id="flagship-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Department Filter Tabs */}
          <div className="flex items-center justify-between border-b border-[#E8D5AE] pb-5 mb-10 overflow-x-auto gap-4">
            <div className="flex items-center gap-2">
              {departments.map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDepartment(d.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    activeDepartment === d.id
                      ? 'bg-[#064E3B] text-[#F8E7C9] border-[#064E3B] shadow-sm'
                      : 'bg-[#FFF9EC] text-[#064E3B] border-[#E8D5AE] hover:border-[#064E3B]/40'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-[#4B5F57] shrink-0">
              {filtered.length} Curated Items
            </span>
          </div>

          {/* Department Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-[#FFF9EC] border border-[#E8D5AE] hover:border-[#064E3B]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md"
              >
                {/* 1:1 Aspect Image with Department Ribbon */}
                <div className="relative aspect-square w-full overflow-hidden bg-white">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#064E3B] text-[#F8E7C9] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {product.categoryName}
                  </div>
                  {product.discount_pct && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {product.discount_pct}% OFF
                    </div>
                  )}
                </div>

                {/* Card Editorial Info */}
                <div className="p-5 space-y-3 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1 text-amber-600 text-xs mb-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="font-bold">4.9</span>
                      <span className="text-[10px] text-[#4B5F57]">(Verified Purchase)</span>
                    </div>
                    <h3 className="font-poppins font-bold text-sm text-[#064E3B] group-hover:text-[#0A6048] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#4B5F57] font-normal line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#E8D5AE] flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-[#064E3B]">
                        {formatINR(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xs text-[#4B5F57] line-through ml-2">
                          {formatINR(product.compare_at_price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={e => handleQuickAdd(product, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        justAddedId === product.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#064E3B] text-[#F8E7C9] hover:bg-[#0A6048]'
                      }`}
                    >
                      {justAddedId === product.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> In Bag
                        </>
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── Multi-Category Flagship Footer ─────────────────── */}
      <footer className="border-t border-[#E8D5AE] bg-[#FFF9EC] py-14 text-xs text-[#4B5F57]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <h4 className="font-poppins font-bold text-base text-[#064E3B]">
              STOREKRAFT FLAGSHIP STORE
            </h4>
            <p className="max-w-md leading-relaxed">
              Curated department catalog connecting discerning shoppers with exceptional craftsmanship across apparel, acoustics, ceramics, and personal goods.
            </p>
            <p className="text-[11px] text-[#4B5F57]">
              © {new Date().getFullYear()} StoreKraft Flagship Store. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-[#064E3B] text-xs">Flagship Departments</h5>
            <p>Haute Apparel & Selvedge Denim</p>
            <p>Pro Audio & Mechanical Hardware</p>
            <p>Stoneware Ceramics & Studio Living</p>
            <p>Fine Jewelry & Skincare</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-[#064E3B] text-xs">Platform Links</h5>
            <p>Concierge Order Support</p>
            <p>Track Courier AWB Number</p>
            <Link to="/onboarding" className="text-[#064E3B] font-bold hover:underline block pt-2">
              Build Your Own Storecraft →
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        storeSlug="craft-haven"
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSlug="craft-haven"
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        storeSlug="craft-haven"
      />
    </div>
  )
}
