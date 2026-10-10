import React, { useMemo, useState } from 'react'
import { ShoppingBag, Search, ShoppingCart, ArrowLeft, GripVertical } from 'lucide-react'
import { formatCurrency, cn } from '../../lib/utils'

const DEMO_PRODUCTS = [
  { id: 'dp-1', name: 'Artisan Ceramic Mug', price: '₹1,499', rawPrice: 1499, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80', desc: 'Handcrafted artisan ceramic mug for hot coffees and teas.' },
  { id: 'dp-2', name: 'Minimalist Vase', price: '₹799', rawPrice: 799, img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80', desc: 'Sleek matte glazed pottery vase with organic contours.' },
  { id: 'dp-3', name: 'Organic Linen Tote', price: '₹549', rawPrice: 549, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80', desc: 'Durable eco-friendly everyday carrier woven from natural fibers.' },
  { id: 'dp-4', name: 'Soy Wax Candle', price: '₹399', rawPrice: 399, img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=300&q=80', desc: 'Hand-poured aromatic candle with slow-burning wooden wick.' },
]

const THEME_DEFAULTS = {
  emerald:  { primary: '#064E3B', primaryText: '#F8E7C9', bg: '#F8E7C9', surface: '#FFF9EC', text: '#4B5F57', heading: '#064E3B', border: '#E8D5AE' },
  midnight: { primary: '#0D9488', primaryText: '#FFFFFF', bg: '#0F172A', surface: '#1E293B', text: '#94A3B8', heading: '#F8FAFC', border: '#334155' },
  rose:     { primary: '#FB7185', primaryText: '#FFFFFF', bg: '#18181B', surface: '#27272A', text: '#FDA4AF', heading: '#FFF1F2', border: '#3F3F46' },
  minimal:  { primary: '#111827', primaryText: '#FFFFFF', bg: '#FFFFFF', surface: '#F9FAFB', text: '#374151', heading: '#111827', border: '#E5E7EB' },
  amber:    { primary: '#F59E0B', primaryText: '#FFFFFF', bg: '#FAF5EF', surface: '#FFFFFF', text: '#57534E', heading: '#292524', border: '#E7E5E4' },
  ocean:    { primary: '#0284C7', primaryText: '#FFFFFF', bg: '#F0F9FF', surface: '#FFFFFF', text: '#334155', heading: '#0C4A6E', border: '#BAE6FD' },
}

export function LivePhonePreview({
  themeId = 'emerald',
  storeName = 'StoreKraft Shop',
  tagline = 'Welcome to our store',
  categoryNames = [],
  themeOverrides = {},
  previewPage = 'home',
  logoUrl = '',
  products = [],
  currency = 'INR',
  onButtonChange = null,
}) {
  const [isDraggingBtn, setIsDraggingBtn] = useState(false)
  const [activeDropZone, setActiveDropZone] = useState(null)

  const themeClass = `theme-${themeId}`
  const baseDefaults = THEME_DEFAULTS[themeId] || THEME_DEFAULTS.emerald
  const ov = themeOverrides?.colors || {}
  const btnConfig = themeOverrides?.button || {}
  const btnRadius = btnConfig.radius || 'rounded'
  const btnPosition = btnConfig.position || 'hero' // 'header' | 'hero' | 'subhero' | 'floating' | 'footer' | 'product'
  const btnText = btnConfig.text || 'Shop Now'
  const btnStyle = btnConfig.style || 'filled' // 'filled' | 'outline' | 'clay' | 'glow'
  const heroImg = themeOverrides?.background?.heroImageUrl || ''

  const headingFont = themeOverrides?.fonts?.heading || ''
  const bodyFont = themeOverrides?.fonts?.body || ''

  const radiusMap = { square: '0px', rounded: '10px', pill: '999px' }
  const buttonRadius = radiusMap[btnRadius] || '10px'

  // Map user's manual/selected products to preview items, falling back to DEMO_PRODUCTS if empty
  const activeProducts = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, idx) => {
        const rawNum = typeof p.price === 'number'
          ? p.price
          : (parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 999)
        const formatted = formatCurrency(rawNum, currency)
        return {
          id: p.id || `prod-${idx}`,
          name: p.name || p.title || 'Product',
          price: formatted,
          rawPrice: rawNum,
          img: p.image_url || (Array.isArray(p.images) && p.images[0]) || p.img || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
          desc: p.description || p.desc || 'Premium handcrafted quality.'
        }
      })
    }
    return DEMO_PRODUCTS
  }, [products, currency])

  const cartItems = activeProducts.slice(0, 2)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.rawPrice || 0), 0)

  const inlineStyle = useMemo(() => {
    const vars = {
      '--store-primary': ov.primary || baseDefaults.primary,
      '--store-primary-contrast': ov.primaryText || baseDefaults.primaryText,
      '--store-bg': ov.background || baseDefaults.bg,
      '--store-surface': ov.surface || baseDefaults.surface,
      '--store-text': ov.text || baseDefaults.text,
      '--store-heading': ov.heading || baseDefaults.heading,
      '--store-border': ov.border || baseDefaults.border,
    }
    if (headingFont) vars['--heading-font'] = `'${headingFont}', sans-serif`
    if (bodyFont) vars['--body-font'] = `'${bodyFont}', sans-serif`
    return vars
  }, [ov, baseDefaults, headingFont, bodyFont])

  const headerLogo = logoUrl ? (
    <img src={logoUrl} alt={storeName} className="h-6 max-w-[80px] object-contain rounded" />
  ) : (
    <div className="flex items-center gap-1.5">
      <div className="h-5 w-5 rounded-md bg-[var(--store-primary)] text-[var(--store-primary-contrast)] flex items-center justify-center font-black text-[9px]">
        {storeName ? storeName.charAt(0) : 'S'}
      </div>
      <span className="font-bold text-[11px] text-[var(--store-heading)] truncate max-w-[80px]">
        {storeName || 'StoreKraft'}
      </span>
    </div>
  )

  // Drag and drop handlers
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'custom-btn')
    setIsDraggingBtn(true)
  }

  const handleDragEnd = () => {
    setIsDraggingBtn(false)
    setActiveDropZone(null)
  }

  const handleDrop = (zone) => {
    setIsDraggingBtn(false)
    setActiveDropZone(null)
    onButtonChange?.({ position: zone })
  }

  // Common button renderer with drag support
  const renderCtaButton = (extraClass = '', isHeader = false) => {
    const isOutline = btnStyle === 'outline'
    const isClay = btnStyle === 'clay'
    const isGlow = btnStyle === 'glow'

    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        title="Drag and drop me to change position!"
        className={cn(
          "cursor-grab active:cursor-grabbing font-bold transition-all select-none flex items-center justify-center gap-1 group",
          isHeader ? "px-2 py-0.5 text-[8px]" : "px-3.5 py-1.5 text-[9px]",
          isClay && "shadow-clay-btn",
          isGlow && "shadow-lg ring-2 ring-white/30",
          extraClass
        )}
        style={{
          background: isOutline ? 'transparent' : 'var(--store-primary)',
          color: isOutline ? 'var(--store-primary)' : 'var(--store-primary-contrast)',
          border: isOutline ? '1.5px solid var(--store-primary)' : 'none',
          borderRadius: buttonRadius
        }}
      >
        <GripVertical className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        <span>{btnText}</span>
      </div>
    )
  }

  // Drop zone indicator
  const renderDropTarget = (zone, label) => {
    if (!isDraggingBtn && btnPosition !== zone) return null
    if (!isDraggingBtn) return null

    const isHovered = activeDropZone === zone
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setActiveDropZone(zone) }}
        onDragLeave={() => setActiveDropZone(null)}
        onDrop={(e) => { e.preventDefault(); handleDrop(zone) }}
        className={cn(
          "p-1.5 rounded-lg border-2 border-dashed text-center text-[8px] font-bold transition-all",
          isHovered
            ? "border-amber-400 bg-amber-400/20 text-amber-900 scale-102"
            : "border-brand/40 bg-brand/5 text-brand"
        )}
      >
        Drop button here ({label})
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-[272px] rounded-[38px] border-[8px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl overflow-hidden"
      style={{ aspectRatio: '9/19.5' }}
    >
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 bg-[#1a1a1a] rounded-full z-20 flex items-center justify-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-[#2a2a2a]" />
      </div>

      {/* Screen */}
      <div
        className={`w-full h-full overflow-y-auto overflow-x-hidden ${themeClass} transition-all duration-300 text-[11px] flex flex-col relative`}
        style={inlineStyle}
      >
        {/* Store nav header */}
        <header className="sticky top-0 z-10 px-3 py-2 mt-5 flex items-center justify-between border-b border-[var(--store-border)] bg-[var(--store-surface)]">
          {headerLogo}
          <div className="flex items-center gap-1.5 text-[var(--store-text)]">
            {btnPosition === 'header' && renderCtaButton('', true)}
            {renderDropTarget('header', 'Header Bar')}
            <Search className="h-3 w-3 opacity-60" />
            <ShoppingCart className="h-3 w-3 opacity-60" />
          </div>
        </header>

        {/* ── HOME page ── */}
        {previewPage === 'home' && (
          <div className="flex-1 p-2.5 space-y-2.5 bg-[var(--store-bg)]">
            {/* Hero */}
            <div
              className="rounded-xl overflow-hidden flex flex-col items-center justify-center text-center gap-1.5 p-4 relative"
              style={{
                background: heroImg ? `url(${heroImg}) center/cover no-repeat` : 'var(--store-primary)',
                minHeight: 88
              }}
            >
              <p className="font-bold text-[11px] leading-tight text-[var(--store-primary-contrast)] drop-shadow-sm">
                {tagline || 'Shop our latest collection'}
              </p>
              {btnPosition === 'hero' && renderCtaButton('mt-1')}
              {renderDropTarget('hero', 'Hero Section')}
            </div>

            {/* Sub-Hero Zone (if position === 'subhero') */}
            {btnPosition === 'subhero' && (
              <div className="flex justify-center py-1">
                {renderCtaButton('w-full')}
              </div>
            )}
            {renderDropTarget('subhero', 'Sub-Hero')}

            {/* Category chips */}
            <div className="flex gap-1.5 overflow-hidden">
              {(categoryNames.length > 0 ? ['All', ...categoryNames] : ['All', 'Featured', 'New']).slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[9px] font-semibold bg-[var(--store-surface)] border border-[var(--store-border)] text-[var(--store-text)] truncate flex-shrink-0"
                  style={{ borderRadius: buttonRadius }}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Product grid: renders ONLY manual catalogued products if available */}
            <div className="grid grid-cols-2 gap-2">
              {activeProducts.slice(0, 4).map((p, i) => (
                <div
                  key={p.id || i}
                  className="overflow-hidden border border-[var(--store-border)] bg-[var(--store-surface)] flex flex-col justify-between"
                  style={{ borderRadius: `calc(${buttonRadius} / 1.2)` }}
                >
                  <img src={p.img} alt={p.name} className="h-[60px] w-full object-cover" loading="lazy" />
                  <div className="p-1.5 space-y-0.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-semibold truncate text-[var(--store-text)]">{p.name}</p>
                      <p className="text-[9px] font-bold text-[var(--store-primary)]">{p.price}</p>
                    </div>
                    {btnPosition === 'product' ? (
                      renderCtaButton('mt-1 text-[8px] py-0.5 w-full')
                    ) : (
                      <div
                        className="mt-1 text-[8px] font-bold text-center py-0.5 text-[var(--store-primary-contrast)] bg-[var(--store-primary)]"
                        style={{ borderRadius: buttonRadius }}
                      >
                        Add to Cart
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {renderDropTarget('product', 'Product Cards')}
          </div>
        )}

        {/* ── PRODUCT detail page ── */}
        {previewPage === 'product' && (
          <div className="flex-1 bg-[var(--store-bg)]">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--store-border)] text-[var(--store-text)]">
              <ArrowLeft className="h-3 w-3" />
              <span className="text-[10px]">Back</span>
            </div>
            <img src={activeProducts[0].img} alt={activeProducts[0].name} className="w-full h-28 object-cover" />
            <div className="p-3 space-y-2 bg-[var(--store-surface)]">
              <h2 className="font-bold text-xs text-[var(--store-heading)]">{activeProducts[0].name}</h2>
              <p className="text-[10px] text-[var(--store-text)] opacity-80">{activeProducts[0].desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[var(--store-primary)]">{activeProducts[0].price}</span>
                <span className="text-[9px] text-green-700 font-medium">In stock</span>
              </div>
              <div
                className="text-center py-1.5 text-[10px] font-bold text-[var(--store-primary-contrast)] bg-[var(--store-primary)]"
                style={{ borderRadius: buttonRadius }}
              >
                Add to Cart
              </div>
            </div>
          </div>
        )}

        {/* ── CART page ── */}
        {previewPage === 'cart' && (
          <div className="flex-1 bg-[var(--store-bg)] p-3 space-y-3">
            <h2 className="font-bold text-xs text-[var(--store-heading)]">Your Cart</h2>
            {cartItems.map((p, i) => (
              <div key={p.id || i} className="flex gap-2 items-center border-b border-[var(--store-border)] pb-2">
                <img src={p.img} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-semibold truncate text-[var(--store-text)]">{p.name}</p>
                  <p className="text-[9px] font-bold text-[var(--store-primary)]">{p.price}</p>
                </div>
                <span className="text-[9px] text-[var(--store-text)] opacity-70">×1</span>
              </div>
            ))}
            <div className="flex justify-between text-[10px] font-bold pt-1 text-[var(--store-text)]">
              <span>Total</span>
              <span>{formatCurrency(cartTotal, currency)}</span>
            </div>
            <div
              className="text-center py-1.5 text-[10px] font-bold text-[var(--store-primary-contrast)] bg-[var(--store-primary)]"
              style={{ borderRadius: buttonRadius }}
            >
              Checkout
            </div>
          </div>
        )}

        {/* ── Floating Action CTA button (if chosen) ── */}
        {btnPosition === 'floating' && previewPage === 'home' && (
          <div className="absolute bottom-10 right-3 z-30">
            {renderCtaButton('px-3 py-1.5 text-[8px] shadow-xl')}
          </div>
        )}
        {renderDropTarget('floating', 'Floating Bottom')}

        {/* ── Sticky Footer CTA bar (if chosen) ── */}
        {btnPosition === 'footer' && previewPage === 'home' && (
          <div className="sticky bottom-6 z-20 px-3 py-1.5 bg-[var(--store-surface)] border-t border-[var(--store-border)]">
            {renderCtaButton('w-full py-1.5')}
          </div>
        )}
        {renderDropTarget('footer', 'Sticky Footer')}

        {/* Mini status bar at bottom */}
        <div className="shrink-0 px-3 py-1 text-[8px] text-[var(--store-text)] opacity-75 border-t border-[var(--store-border)] bg-[var(--store-surface)] flex items-center justify-between">
          <span className="capitalize">{themeId} · {btnRadius}</span>
          <span className="font-semibold text-brand">Btn: {btnPosition}</span>
        </div>
      </div>
    </div>
  )
}
