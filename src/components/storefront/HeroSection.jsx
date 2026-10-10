import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Award, Zap, Compass, Flame } from 'lucide-react'

export function HeroSection({ store, onExploreClick }) {
  const theme = store?.theme_id || 'emerald'
  const content = store?.content || {}
  const buttonText = store?.theme_overrides?.button?.text || content.heroCta || 'Explore Catalog'

  // 1. FASHION & APPAREL — ROSE GOLD & OBSIDIAN (Haute Couture Editorial Lookbook)
  if (theme === 'rose') {
    return (
      <section className="bg-[#18181B] text-rose-50 border-b border-[#27272A] py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle moody ambient gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-serif tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <Sparkles className="h-3 w-3 text-rose-400" />
                {content.heroBadge || 'Autumn/Winter Lookbook 2026'}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white leading-[1.08]">
                {content.heroTitle || 'Haute Couture Meets Modern Utility'}
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-light leading-relaxed">
                {content.heroSubtitle || 'Tailored silhouettes, raw selvedge denim, and breathable Italian linens designed for timeless presence.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={onExploreClick}
                  className="px-8 py-3.5 rounded-sm text-xs font-serif uppercase tracking-widest font-bold bg-[#FB7185] text-zinc-950 hover:bg-rose-400 transition-all shadow-lg shadow-rose-950/50 flex items-center gap-2"
                >
                  {buttonText} <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-zinc-500 font-serif italic tracking-wide">
                  Limited Runway Edition • Ships Worldwide
                </span>
              </div>

              {/* Editorial Fashion Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800 text-zinc-400 text-xs">
                <div>
                  <span className="block font-serif text-white text-sm font-semibold">100% Selvedge</span>
                  <span className="text-[11px] text-zinc-500">Kurabo Mills, Japan</span>
                </div>
                <div>
                  <span className="block font-serif text-white text-sm font-semibold">Italian Flax</span>
                  <span className="text-[11px] text-zinc-500">Pure European Linen</span>
                </div>
                <div>
                  <span className="block font-serif text-white text-sm font-semibold">Bespoke Fit</span>
                  <span className="text-[11px] text-zinc-500">Double-needle tailoring</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                  alt="Editorial Lookbook"
                  className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] tracking-widest uppercase text-rose-300 font-serif">Runway Capsule</span>
                  <p className="text-white font-serif text-lg font-medium">Vol. IV — Atelier Noir Collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 2. ELECTRONICS & GADGETS — MIDNIGHT TEAL & CYAN (Cyber Studio Hardware)
  if (theme === 'midnight') {
    return (
      <section className="bg-[#0F172A] border-b border-slate-800 py-16 sm:py-24 text-slate-100 relative overflow-hidden">
        {/* Ambient Neon Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase bg-teal-500/10 text-teal-300 border border-teal-500/30">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            {content.heroBadge || 'System Ready • Pro Hardware Released'}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight font-space">
            {content.heroTitle || 'Pure Acoustic Fidelity & Pro Hardware'}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            {content.heroSubtitle || 'Studio-grade hybrid active noise cancellation, custom mechanical switches, and high-performance creator hardware.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 rounded-xl text-sm font-mono font-bold bg-[#0D9488] text-white hover:bg-teal-500 transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2 hover:scale-[1.02]"
            >
              {buttonText} <Zap className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">LDAC 990kbps</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">45h Battery</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Hot-Swap</span>
            </div>
          </div>

          {/* Hardware Specs Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 border-t border-slate-800/80 max-w-4xl mx-auto text-left text-slate-300">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-teal-400 font-mono block">ACOUSTIC DRIVERS</span>
              <p className="text-sm font-bold text-white mt-1">40mm Pure Beryllium</p>
              <p className="text-xs text-slate-400 mt-0.5">5Hz - 40,000Hz Ultra-flat response</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-cyan-400 font-mono block">SWITCH ARCHITECTURE</span>
              <p className="text-sm font-bold text-white mt-1">Gasket 75% Mechanical</p>
              <p className="text-xs text-slate-400 mt-0.5">Factory-lubed linear gold stems</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-teal-400 font-mono block">WARRANTY GUARANTEE</span>
              <p className="text-sm font-bold text-white mt-1">2-Year Pro Replacement</p>
              <p className="text-xs text-slate-400 mt-0.5">Direct hardware exchange in 48h</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 3. HOME DECOR & CERAMICS — SUNSET AMBER & TERRACOTTA (Tactile Artisan Pottery)
  if (theme === 'amber') {
    return (
      <section className="bg-[#FAF5EF] text-stone-900 border-b border-[#E7E5E4] py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-serif tracking-wider uppercase bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/20">
                <Flame className="h-3 w-3 text-[#B45309]" />
                {content.heroBadge || 'Small-Batch Kiln Firing Live'}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-stone-900 tracking-tight leading-[1.12]">
                {content.heroTitle || 'Objects Sculpted with Clay, Fire & Soul'}
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl font-light leading-relaxed">
                {content.heroSubtitle || 'Wheel-thrown stoneware pottery, organic woven linen throws, and hand-poured botanical candles crafted by generational artisans.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onExploreClick}
                  className="px-8 py-3.5 rounded-xl text-sm font-serif font-bold bg-[#B45309] text-white hover:bg-amber-800 transition-all shadow-md shadow-amber-900/15 flex items-center gap-2 hover:translate-y-[-1px]"
                >
                  {buttonText} <Compass className="h-4 w-4" />
                </button>
                <span className="text-xs text-stone-500 font-serif italic">
                  Plastic-free honeycomb packaging • Safe transit
                </span>
              </div>

              {/* Handcrafted Credibility Markers */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-200/80 text-stone-700 text-xs">
                <div>
                  <span className="font-serif font-bold text-stone-900 text-sm block">Natural Clay</span>
                  <span className="text-stone-500 text-[11px]">High-fire non-toxic stoneware</span>
                </div>
                <div>
                  <span className="font-serif font-bold text-stone-900 text-sm block">50h Clean Burn</span>
                  <span className="text-stone-500 text-[11px]">Pure botanical soy wax</span>
                </div>
                <div>
                  <span className="font-serif font-bold text-stone-900 text-sm block">Artisan Signature</span>
                  <span className="text-stone-500 text-[11px]">Stamped studio mark</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80"
                  alt="Ceramic Studio Showcase"
                  className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase font-serif tracking-widest text-amber-200">Studio Batch 2026</span>
                  <p className="font-serif text-lg font-medium">Volcanic Glaze Ribbed Stoneware</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 4. ALL-IN-1 FLAGSHIP — EMERALD INK & CHAMPAGNE (Curated Department Store)
  return (
    <section className="bg-[#F8E7C9] text-[#064E3B] border-b border-[#E8D5AE] py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20">
            <Sparkles className="h-3.5 w-3.5" />
            {content.heroBadge || 'Spring Flagship Showcase 2026'}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-poppins font-extrabold text-[#064E3B] tracking-tight leading-[1.1]">
            {content.heroTitle || 'Curated Department Store for Modern Living'}
          </h1>

          <p className="text-base sm:text-lg text-[#4B5F57] max-w-2xl leading-relaxed">
            {content.heroSubtitle || 'Explore our flagship departments spanning haute apparel, audio hardware, handcrafted ceramics, and fine accessories.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-[#064E3B] text-[#F8E7C9] hover:bg-[#0A6048] transition-all shadow-md shadow-[#064E3B]/20 flex items-center gap-2"
            >
              {buttonText} <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-[#4B5F57] font-medium">
              Free Express Courier Shipping on Orders Over ₹1,999
            </span>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-14 border-t border-[#E8D5AE] mt-12 text-[#4B5F57]">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-[#064E3B]" />
            <span className="text-xs font-semibold">Verified Multi-Category Quality</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[#064E3B]" />
            <span className="text-xs font-semibold">Priority Express Delivery Across India</span>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-[#064E3B]" />
            <span className="text-xs font-semibold">Hassle-Free 7-Day Exchange Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  )
}

