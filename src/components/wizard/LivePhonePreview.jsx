import React, { useMemo } from 'react'
import { ShoppingBag, Search, ShoppingCart, ArrowLeft } from 'lucide-react'

const DEMO_PRODUCTS = [
  { name: 'Artisan Mug', price: '₹1,499', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80' },
  { name: 'Ceramic Vase', price: '₹799',  img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80' },
  { name: 'Linen Tote', price: '₹549',    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' },
  { name: 'Soy Candle', price: '₹399',    img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=300&q=80' },
]

/**
 * LivePhonePreview
 * Renders a mini mobile phone frame with a simulated storefront inside.
 * Applies theme CSS variables and real-time theme_overrides for colour, font,
 * button shape and hero image — mirroring exactly what the live store will show.
 *
 * Props:
 *  themeId         – 'minimal' | 'vibrant' | 'elegant' | 'midnight'
 *  storeName       – store name string
 *  tagline         – store tagline string
 *  categoryNames   – string[]
 *  themeOverrides  – { colors, background, button, fonts } object
 *  previewPage     – 'home' | 'product' | 'cart'
 *  logoUrl         – optional data URL for store logo
 */
export function LivePhonePreview({
  themeId = 'minimal',
  storeName = 'My Store',
  tagline = 'Welcome to our store',
  categoryNames = [],
  themeOverrides = {},
  previewPage = 'home',
  logoUrl = '',
}) {
  const themeClass = `theme-${themeId}`
  const ov = themeOverrides?.colors || {}
  const btnRadius = themeOverrides?.button?.radius || 'rounded'
  const heroImg = themeOverrides?.background?.heroImageUrl || ''

  // Heading font
  const headingFont = themeOverrides?.fonts?.heading || ''
  const bodyFont = themeOverrides?.fonts?.body || ''

  // Map button radius key to CSS value
  const radiusMap = { square: '0px', rounded: '10px', pill: '999px' }
  const buttonRadius = radiusMap[btnRadius] || '10px'

  // Build inline CSS-variable override string for the preview container
  const inlineStyle = useMemo(() => {
    const vars = {}
    if (ov.primary)     vars['--store-primary']          = ov.primary
    if (ov.primaryText) vars['--store-primary-contrast']  = ov.primaryText
    if (ov.background)  vars['--store-bg']               = ov.background
    if (ov.surface)     vars['--store-surface']          = ov.surface
    if (ov.text)        vars['--store-text']             = ov.text
    if (ov.heading)     vars['--store-heading']          = ov.heading
    if (ov.border)      vars['--store-border']           = ov.border
    if (ov.muted)       vars['--store-muted']            = ov.muted
    if (headingFont)    vars['--heading-font']           = `'${headingFont}', sans-serif`
    if (bodyFont)       vars['--body-font']              = `'${bodyFont}', sans-serif`
    return vars
  }, [ov, headingFont, bodyFont])

  const headerLogo = logoUrl ? (
    <img src={logoUrl} alt={storeName} className="h-6 max-w-[80px] object-contain" />
  ) : (
    <div className="flex items-center gap-1.5">
      <div className="h-5 w-5 rounded-md bg-[var(--store-primary,#18181b)] text-[var(--store-primary-contrast,#fff)] flex items-center justify-center font-black text-[9px]">
        {storeName ? storeName.charAt(0) : 'S'}
      </div>
      <span className="font-bold text-[11px] text-[var(--store-text,#09090b)] truncate max-w-[80px]">
        {storeName || 'My Store'}
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
        className={`w-full h-full overflow-y-auto overflow-x-hidden ${themeClass} transition-all duration-300 text-[11px] flex flex-col`}
        style={inlineStyle}
      >
        {/* Store nav header */}
        <header className="sticky top-0 z-10 px-3 py-2 mt-5 flex items-center justify-between border-b border-[var(--store-border,#e4e4e7)] bg-[var(--store-header-bg,var(--store-surface,#fff))]">
          {headerLogo}
          <div className="flex items-center gap-2 text-[var(--store-text,#09090b)]">
            <Search className="h-3 w-3 opacity-60" />
            <ShoppingCart className="h-3 w-3 opacity-60" />
          </div>
        </header>

        {/* ── HOME page ── */}
        {previewPage === 'home' && (
          <div className="flex-1 p-2.5 space-y-2.5 bg-[var(--store-bg,#fff)]">
            {/* Hero */}
            <div
              className="rounded-xl overflow-hidden flex flex-col items-center justify-center text-center gap-1.5 p-4"
              style={{
                background: heroImg ? `url(${heroImg}) center/cover no-repeat` : 'var(--store-primary,#18181b)',
                minHeight: 80
              }}
            >
              <p className="font-bold text-[11px] leading-tight text-[var(--store-primary-contrast,#fff)] drop-shadow-sm">
                {tagline || 'Shop our latest collection'}
              </p>
              <div
                className="px-3 py-1 text-[9px] font-bold"
                style={{
                  background: heroImg ? 'var(--store-primary,#18181b)' : 'rgba(255,255,255,0.15)',
                  color: heroImg ? 'var(--store-primary-contrast,#fff)' : '#fff',
                  borderRadius: buttonRadius
                }}
              >
                Shop Now
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-1.5 overflow-hidden">
              {(categoryNames.length > 0 ? ['All', ...categoryNames] : ['All', 'Featured', 'New']).slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[9px] font-semibold bg-[var(--store-surface,#fff)] border border-[var(--store-border,#e4e4e7)] text-[var(--store-text,#09090b)] truncate flex-shrink-0"
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
                  className="overflow-hidden border border-[var(--store-border,#e4e4e7)] bg-[var(--store-surface,#fff)]"
                  style={{ borderRadius: `calc(${buttonRadius} / 1.2)` }}
                >
                  <img src={p.img} alt={p.name} className="h-[60px] w-full object-cover" loading="lazy" />
                  <div className="p-1.5 space-y-0.5">
                    <p className="text-[9px] font-semibold truncate text-[var(--store-text,#09090b)]">{p.name}</p>
                    <p className="text-[9px] font-bold text-[var(--store-primary,#18181b)]">{p.price}</p>
                    <div
                      className="mt-1 text-[8px] font-bold text-center py-0.5 text-[var(--store-primary-contrast,#fff)] bg-[var(--store-primary,#18181b)]"
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
          <div className="flex-1 bg-[var(--store-bg,#fff)]">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--store-border,#e4e4e7)] text-[var(--store-text,#09090b)]">
              <ArrowLeft className="h-3 w-3" />
              <span className="text-[10px]">Back</span>
            </div>
            <img src={DEMO_PRODUCTS[0].img} alt="Product" className="w-full h-28 object-cover" />
            <div className="p-3 space-y-2 bg-[var(--store-surface,#fff)]">
              <h2 className="font-bold text-xs text-[var(--store-heading,var(--store-text,#09090b))]">{DEMO_PRODUCTS[0].name}</h2>
              <p className="text-[10px] text-[var(--store-muted,#71717a)]">Handcrafted ceramic mug with artisan glaze. Perfect for your morning ritual.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[var(--store-primary,#18181b)]">{DEMO_PRODUCTS[0].price}</span>
                <span className="text-[9px] text-green-600 font-medium">In stock</span>
              </div>
              <div
                className="text-center py-1.5 text-[10px] font-bold text-[var(--store-primary-contrast,#fff)] bg-[var(--store-primary,#18181b)]"
                style={{ borderRadius: buttonRadius }}
              >
                Add to Cart
              </div>
            </div>
          </div>
        )}

        {/* ── CART page ── */}
        {previewPage === 'cart' && (
          <div className="flex-1 bg-[var(--store-bg,#fff)] p-3 space-y-3">
            <h2 className="font-bold text-xs text-[var(--store-text,#09090b)]">Your Cart</h2>
            {DEMO_PRODUCTS.slice(0, 2).map((p, i) => (
              <div key={i} className="flex gap-2 items-center border-b border-[var(--store-border,#e4e4e7)] pb-2">
                <img src={p.img} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-semibold truncate text-[var(--store-text,#09090b)]">{p.name}</p>
                  <p className="text-[9px] font-bold text-[var(--store-primary,#18181b)]">{p.price}</p>
                </div>
                <span className="text-[9px] text-[var(--store-muted,#71717a)]">×1</span>
              </div>
            ))}
            <div className="flex justify-between text-[10px] font-bold pt-1 text-[var(--store-text,#09090b)]">
              <span>Total</span>
              <span>₹2,298</span>
            </div>
            <div
              className="text-center py-1.5 text-[10px] font-bold text-[var(--store-primary-contrast,#fff)] bg-[var(--store-primary,#18181b)]"
              style={{ borderRadius: buttonRadius }}
            >
              Checkout
            </div>
          </div>
        )}

        {/* Mini status bar at bottom */}
        <div className="shrink-0 px-3 py-1.5 text-[9px] text-[var(--store-muted,#71717a)] border-t border-[var(--store-border,#e4e4e7)] bg-[var(--store-surface,#fff)] text-center">
          Theme: <span className="font-semibold capitalize">{themeId}</span>
          {ov.primary && <span className="ml-1 opacity-60">· custom colours</span>}
        </div>
      </div>
    </div>
  )
}
