import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStoreData } from '../store/useStoreData'
import { StorefrontHeader } from '../components/storefront/StorefrontHeader'
import { HeroSection } from '../components/storefront/HeroSection'
import { CategoryChips } from '../components/storefront/CategoryChips'
import { ProductCard } from '../components/storefront/ProductCard'
import { ProductDetailModal } from '../components/storefront/ProductDetailModal'
import { CartDrawer } from '../components/storefront/CartDrawer'
import { CheckoutModal } from '../components/storefront/CheckoutModal'
import { EmptyState } from '../components/ui/EmptyState'
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react'

export function StorefrontPage() {
  const { slug } = useParams()
  const { store, products, categories } = useStoreData()

  // Use either the routed store or the current store
  const activeStore = store?.slug === slug ? store : { ...store, slug }

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'price-asc' | 'price-desc'

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.is_active !== false)

    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory || p.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, selectedCategory, searchQuery, sortBy])

  // Scroll to catalog when clicking hero Explore
  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const themeClass = `theme-${activeStore?.theme_id || 'elegant'}`

  return (
    <div className={`min-h-screen bg-[var(--store-bg,#ffffff)] text-[var(--store-text,#0f172a)] ${themeClass} transition-colors duration-300 flex flex-col justify-between`}>
      <div>
        {/* Top Announcement Bar */}
        {activeStore?.content?.announcement && (
          <div className="bg-[var(--store-primary,#4f46e5)] text-[var(--store-primary-contrast,#ffffff)] py-2 px-4 text-center text-xs font-semibold tracking-wide">
            {activeStore.content.announcement}
          </div>
        )}

        {/* Storefront Header */}
        <StorefrontHeader
          store={activeStore}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Themed Hero Banner */}
        <HeroSection
          store={activeStore}
          onExploreClick={handleScrollToCatalog}
        />

        {/* Catalog Section */}
        <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          
          {/* Controls: Category chips & Sorting bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <CategoryChips
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5 text-[var(--store-muted,#64748b)]" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-[var(--store-surface,#ffffff)] border border-[var(--store-border,#e2e8f0)] rounded-[var(--store-radius,8px)] px-2.5 py-1.5 text-[var(--store-text,#0f172a)] focus:outline-none"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              description="Try adjusting your search terms or selecting another category filter."
              actionLabel="View All Products"
              onAction={() => {
                setSelectedCategory(null)
                setSearchQuery('')
              }}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeSlug={activeStore?.slug}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Storefront Footer */}
      <footer className="border-t border-[var(--store-border,#e2e8f0)] bg-[var(--store-surface,#ffffff)] mt-16 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-[var(--store-muted,#64748b)]">
          <div className="space-y-2 md:col-span-2">
            <h4 className="font-heading font-bold text-sm text-[var(--store-text,#0f172a)]">
              {activeStore?.name}
            </h4>
            <p className="max-w-sm">
              {activeStore?.tagline || 'Curated online storefront powered by Launch-Your-Store.'}
            </p>
            <p className="pt-2 text-[11px]">
              © {new Date().getFullYear()} {activeStore?.name}. All rights reserved.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-[var(--store-text,#0f172a)] mb-2">Contact</h5>
            <p>{activeStore?.contact_email || 'support@store.com'}</p>
            <p>{activeStore?.phone || '+91 98000 00000'}</p>
            <p className="mt-1">{activeStore?.address}</p>
          </div>

          <div>
            <h5 className="font-semibold text-[var(--store-text,#0f172a)] mb-2">Platform</h5>
            <Link to="/onboarding" className="text-indigo-600 hover:underline block mb-1">
              Build Your Own Store →
            </Link>
            <Link to="/admin/dashboard" className="text-slate-600 hover:underline block">
              Merchant Admin Login
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        storeSlug={activeStore?.slug}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSlug={activeStore?.slug}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        storeSlug={activeStore?.slug}
      />
    </div>
  )
}
