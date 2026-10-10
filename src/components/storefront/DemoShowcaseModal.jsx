import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ExternalLink, ArrowRight, Sparkles, Shirt, Smartphone, Armchair, ShoppingBag, Check } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export const DEMO_SHOWCASE_CARDS = [
  {
    id: 'demo-fashion',
    slug: 'demo-fashion',
    title: 'Fashion & Haute Couture',
    storeName: 'Atelier Noir',
    vertical: 'Apparel & Streetwear',
    tagline: 'Tailored silhouettes, raw selvedge denim & breathable Italian linens',
    themeName: 'Rose Gold & Obsidian Noir',
    font: 'Playfair Display + Inter',
    heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
    colors: ['#18181B', '#FB7185', '#27272A', '#FDA4AF'],
    icon: Shirt,
    highlights: ['Editorial lookbook hero', 'Kurabo selvedge denim', 'Mulberry silk slip dresses', 'Obsidian dark aesthetic'],
    theme_id: 'rose'
  },
  {
    id: 'demo-electronics',
    slug: 'demo-electronics',
    title: 'Electronics & Audio Gear',
    storeName: 'Pulse Audio & Tech',
    vertical: 'Tech & Hardware',
    tagline: 'Studio acoustic engineering, LDAC Hi-Res sound & tactile mechanical switches',
    themeName: 'Midnight Teal & Electric Cyan',
    font: 'Space Grotesk + Inter',
    heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    colors: ['#0F172A', '#0D9488', '#1E293B', '#38BDF8'],
    icon: Smartphone,
    highlights: ['Cyber tech grid specs', '40mm Beryllium drivers', 'Gasket 75% mechanical keyboard', 'Floating glow CTA button'],
    theme_id: 'midnight'
  },
  {
    id: 'demo-decor',
    slug: 'demo-decor',
    title: 'Home Decor & Living',
    storeName: 'Terra Living & Ceramics',
    vertical: 'Artisan Ceramics & Decor',
    tagline: 'Wheel-thrown pottery, raw travertine vessels & hand-poured botanical candles',
    themeName: 'Sunset Amber & Terracotta',
    font: 'Playfair Display + Lato',
    heroImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=700&q=80',
    colors: ['#FAF5EF', '#B45309', '#FFFFFF', '#292524'],
    icon: Armchair,
    highlights: ['Volcanic glaze pottery', 'Turkish travertine vessels', 'Organic flax waffle throws', 'Warm clay styling'],
    theme_id: 'amber'
  },
  {
    id: 'craft-haven',
    slug: 'craft-haven',
    title: 'All-in-1 Flagship Store',
    storeName: 'StoreKraft Flagship',
    vertical: 'Curated Department Store',
    tagline: 'Multi-category department showcase spanning apparel, tech, decor, and fine jewelry',
    themeName: 'Emerald Ink & Champagne',
    font: 'Poppins + Inter',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    colors: ['#F8E7C9', '#064E3B', '#FFF9EC', '#E8D5AE'],
    icon: ShoppingBag,
    highlights: ['Multi-category filtering', 'Department store architecture', 'Signature clay cards', 'Complete catalog range'],
    theme_id: 'emerald'
  }
]

export function DemoShowcaseModal({ isOpen, onClose, onSelectTemplate }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleOpenStore = (slug) => {
    onClose()
    navigate(`/s/${slug}`)
  }

  const handleUseTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template)
    } else {
      onClose()
      navigate('/onboarding')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-champagne-card border-2 border-champagne-border rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-champagne-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              StoreKraft Showcase
            </div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
              Choose a Demo Storefront to Explore
            </h2>
            <p className="text-xs sm:text-sm text-[var(--sc-muted)] mt-1">
              Every demo is built with its own completely distinct design system, typography, color palette, and curated product catalog.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--sc-muted)] hover:text-brand hover:bg-brand/10 transition-colors"
            aria-label="Close demo modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4 Demo Templates Grid */}
        <div className="flex-1 overflow-y-auto py-6 pr-1 grid grid-cols-1 md:grid-cols-2 gap-5">
          {DEMO_SHOWCASE_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.id}
                className="clay-card overflow-hidden flex flex-col justify-between border-2 border-champagne-border hover:border-brand/40 transition-all duration-300 group shadow-sm hover:shadow-lg"
              >
                {/* Visual Header / Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                  <img
                    src={card.heroImage}
                    alt={card.storeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-white/90 text-stone-900 shadow-sm flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-brand" />
                      {card.vertical}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-poppins text-xl font-bold tracking-tight text-white drop-shadow-sm">
                      {card.storeName}
                    </h3>
                    <p className="text-xs text-stone-300 font-light drop-shadow-sm">
                      {card.title}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[var(--sc-muted)] leading-relaxed">
                    {card.tagline}
                  </p>

                  {/* Palette pills & Font info */}
                  <div className="space-y-2 pt-2 border-t border-champagne-border">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--sc-muted)] font-medium">Palette:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[var(--sc-ink)] mr-1">
                          {card.themeName}
                        </span>
                        {card.colors.map((c, i) => (
                          <span
                            key={i}
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-2xs inline-block"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--sc-muted)] font-medium">Typography:</span>
                      <span className="font-mono text-xs text-[var(--sc-ink)] font-semibold">
                        {card.font}
                      </span>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[var(--sc-ink)]">
                    {card.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-brand shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-3 border-t border-champagne-border grid grid-cols-2 gap-2.5">
                    <Button
                      onClick={() => handleOpenStore(card.slug)}
                      className="w-full text-xs font-bold"
                    >
                      View Live Store <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Button>
                    <Button
                      onClick={() => handleUseTemplate(card)}
                      variant="secondary"
                      className="w-full text-xs font-semibold"
                    >
                      Use Template <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer info note */}
        <div className="pt-4 border-t border-champagne-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--sc-muted)]">
          <p>
            You can test live cart checkout, search filters, and product modals in all 4 storefronts.
          </p>
          <button
            onClick={onClose}
            className="text-brand font-bold hover:underline"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  )
}
