import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'

export function HeroSection({ store, onExploreClick }) {
  const theme = store?.theme_id || 'elegant'
  const content = store?.content || {}

  // 1. MINIMAL THEME HERO
  if (theme === 'minimal') {
    return (
      <section className="border-b border-[var(--store-border,#e4e4e7)] bg-[var(--store-bg,#ffffff)] py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
            {content.heroBadge || 'Curated Essentials 2026'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.1] mb-6">
            {content.heroTitle || store?.name || 'Thoughtfully Made Goods'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto mb-8 font-normal">
            {content.heroSubtitle || store?.tagline || 'Engineered with precision, built for longevity. Explore our collection.'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs"
            >
              {content.heroCta || 'Browse Catalog'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // 2. VIBRANT THEME HERO
  if (theme === 'vibrant') {
    return (
      <section className="bg-gradient-to-br from-fuchsia-100/60 via-purple-50/50 to-pink-100/40 py-12 sm:py-20 border-b border-fuchsia-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-sm shadow-fuchsia-200">
                <Sparkles className="h-3.5 w-3.5" />
                {content.heroBadge || 'Trending Drops • Limited Edition'}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-purple-950 tracking-tight leading-tight">
                {content.heroTitle || 'Live Loud. Dress Iconic.'}
              </h1>
              <p className="text-base sm:text-lg text-purple-800/80 max-w-xl">
                {content.heroSubtitle || 'Discover fresh streetwear, artisan statement pieces, and viral aesthetics engineered to pop.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onExploreClick}
                  className="px-7 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white hover:opacity-95 transition-all shadow-md shadow-fuchsia-300 flex items-center gap-2"
                >
                  {content.heroCta || 'Shop Trending'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                  alt="Vibrant showcase"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent flex items-end p-6">
                  <p className="text-white text-sm font-medium">Authentic verified designer drops</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 3. MIDNIGHT THEME HERO
  if (theme === 'midnight') {
    return (
      <section className="bg-[#090d16] border-b border-slate-800/80 py-16 sm:py-24 text-slate-100 relative overflow-hidden">
        {/* Ambient Neon Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono tracking-wider uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            {content.heroBadge || 'System Ready • Cyber Grade'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-space">
            {content.heroTitle || 'Precision Tech & Next-Gen Gear'}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
            {content.heroSubtitle || 'Tactile keyboards, noise-canceling acoustics, and premium creator hardware built for enthusiasts.'}
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-lg text-sm font-mono font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              {content.heroCta || 'Launch Storefront'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    )
  }

  // 4. ELEGANT THEME HERO (Default)
  return (
    <section className="bg-[#fbf9f5] border-b border-[#e7e5e4] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs tracking-wider uppercase font-semibold bg-[#14532d]/10 text-[#14532d]">
            <Sparkles className="h-3 w-3" />
            {content.heroBadge || 'Heritage & Craftsmanship'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal text-stone-900 tracking-tight leading-[1.15] font-serif">
            {content.heroTitle || 'Objects Crafted with Purpose & Soul'}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            {content.heroSubtitle || 'Discover sustainably sourced artisan essentials for everyday living, shipped straight to your doorstep.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-7 py-3 rounded-md text-sm font-medium bg-[#14532d] text-white hover:bg-[#114224] transition-colors shadow-sm flex items-center gap-2"
            >
              {content.heroCta || 'Explore Catalog'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-14 border-t border-stone-200/70 mt-12 text-stone-700">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#14532d]" />
            <span className="text-xs font-medium">100% Genuine Artisan Verification</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[#14532d]" />
            <span className="text-xs font-medium">Express Courier Shipping Across India</span>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-[#14532d]" />
            <span className="text-xs font-medium">Hassle-Free 7-Day Exchange</span>
          </div>
        </div>
      </div>
    </section>
  )
}
