import React, { useMemo } from 'react'
import { ShoppingBag, Search, ShoppingCart, ArrowLeft } from 'lucide-react'

const DEMO_PRODUCTS = [
  { name: 'Artisan Ceramic Mug', price: '₹1,499', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80' },
  { name: 'Minimalist Vase', price: '₹799',  img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80' },
  { name: 'Organic Linen Tote', price: '₹549',    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' },
  { name: 'Soy Wax Candle', price: '₹399',    img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=300&q=80' },
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
}) {
  const themeClass = `theme-${themeId}`
  const baseDefaults = THEME_DEFAULTS[themeId] || THEME_DEFAULTS.emerald
  const ov = themeOverrides?.colors || {}
  const btnRadius = themeOverrides?.button?.radius || 'rounded'
  const btnPosition = themeOverrides?.button?.position || 'hero' // 'header' | 'hero' | 'floating' | 'footer'
  const heroImg = themeOverrides?.background?.heroImageUrl || ''

  const headingFont = themeOverrides?.fonts?.heading || ''
  const bodyFont = themeOverrides?.fonts?.body || ''

  const radiusMap = { square: '0px', rounded: '10px', pill: '999px' }
  const buttonRadius = radiusMap[btnRadius] || '10px'

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
            {btnPosition === 'header' && (
              <div
                className="px-2 py-0.5 text-[8px] font-bold transition-all"
                style={{
                  background: 'var(--store-primary)',
                  color: 'var(--store-primary-contrast)',
                  borderRadius: buttonRadius
                }}
              >
                Shop Now
              </div>
            )}
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
                minHeight: 80
              }}
            >
              <p className="font-bold text-[11px] leading-tight text-[var(--store-primary-contrast)] drop-shadow-sm">
                {tagline || 'Shop our latest collection'}
              </p>
              {btnPosition === 'hero' && (
                <div
                  className="px-3 py-1 text-[9px] font-bold"
                  style={{
                    background: heroImg ? 'var(--store-primary)' : 'rgba(255,255,255,0.18)',
                    color: heroImg ? 'var(--store-primary-contrast)' : '#fff',
                    borderRadius: buttonRadius
                  }}
                >
                  Shop Now
                </div>
              )}
            </div>

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

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PRODUCTS.slice(0, 4).map((p, i) => (
                <div
                  key={i}
                  className="overflow-hidden border border-[var(--store-border)] bg-[var(--store-surface)]"
                  style={{ borderRadius: `calc(${buttonRadius} / 1.2)` }}
                >
                  <img src={p.img} alt={p.name} className="h-[60px] w-full object-cover" loading="lazy" />
                  <div className="p-1.5 space-y-0.5">
                    <p className="text-[9px] font-semibold truncate text-[var(--store-text)]">{p.name}</p>
                    <p className="text-[9px] font-bold text-[var(--store-primary)]">{p.price}</p>
                    <div
                      className="mt-1 text-[8px] font-bold text-center py-0.5 text-[var(--store-primary-contrast)] bg-[var(--store-primary)]"
                      style={{ borderRadius: buttonRadius }}
                    >
                      Add to Cart
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCT detail page ── */}
        {previewPage === 'product' && (
          <div className="flex-1 bg-[var(--store-bg)]">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--store-border)] text-[var(--store-text)]">
              <ArrowLeft className="h-3 w-3" />
              <span className="text-[10px]">Back</span>
            </div>
            <img src={DEMO_PRODUCTS[0].img} alt="Product" className="w-full h-28 object-cover" />
            <div className="p-3 space-y-2 bg-[var(--store-surface)]">
              <h2 className="font-bold text-xs text-[var(--store-heading)]">{DEMO_PRODUCTS[0].name}</h2>
              <p className="text-[10px] text-[var(--store-text)] opacity-80">Handcrafted artisan design made for durable everyday performance.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[var(--store-primary)]">{DEMO_PRODUCTS[0].price}</span>
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
            {DEMO_PRODUCTS.slice(0, 2).map((p, i) => (
              <div key={i} className="flex gap-2 items-center border-b border-[var(--store-border)] pb-2">
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
              <span>₹2,298</span>
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
          <div
            className="absolute bottom-10 right-3 z-30 px-2.5 py-1 text-[8px] font-bold shadow-lg flex items-center gap-1 cursor-pointer animate-bounce"
            style={{
              background: 'var(--store-primary)',
              color: 'var(--store-primary-contrast)',
              borderRadius: '999px'
            }}
          >
            <ShoppingBag className="h-3 w-3" /> Shop Now
          </div>
        )}

        {/* ── Sticky Footer CTA bar (if chosen) ── */}
        {btnPosition === 'footer' && previewPage === 'home' && (
          <div className="sticky bottom-6 z-20 px-3 py-1.5 bg-[var(--store-surface)] border-t border-[var(--store-border)]">
            <div
              className="w-full text-center py-1 text-[9px] font-bold"
              style={{
                background: 'var(--store-primary)',
                color: 'var(--store-primary-contrast)',
                borderRadius: buttonRadius
              }}
            >
              Shop Now
            </div>
          </div>
        )}

        {/* Mini status bar at bottom */}
        <div className="shrink-0 px-3 py-1.5 text-[9px] text-[var(--store-text)] opacity-70 border-t border-[var(--store-border)] bg-[var(--store-surface)] text-center">
          Theme: <span className="font-semibold capitalize">{themeId}</span>
          <span className="ml-1 opacity-75">· Button: {btnPosition}</span>
        </div>
      </div>
    </div>
  )
}
