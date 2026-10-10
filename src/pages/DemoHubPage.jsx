import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ExternalLink, ArrowRight, Sparkles, Shirt, Smartphone, Armchair,
  ShoppingBag, Check, ArrowLeft, ArrowUpRight, Zap
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { DEMO_WINDOWS } from '../components/storefront/DemoShowcaseModal'

export function DemoHubPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('demo-fashion')
  const activeWindow = DEMO_WINDOWS.find(w => w.id === activeTab) || DEMO_WINDOWS[0]

  return (
    <div className="min-h-screen bg-[#F8E7C9] text-[#064E3B] flex flex-col justify-between">
      
      {/* ── Top Header Bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FFF9EC]/95 backdrop-blur-md border-b border-[#E8D5AE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center font-black text-champagne text-sm shadow-clay-btn">
              SK
            </div>
            <div>
              <span className="font-poppins font-bold text-brand text-base block leading-tight tracking-tight">
                StoreKraft Demo Windows
              </span>
              <span className="text-[10px] text-[var(--sc-muted)] leading-none">
                4 Unique Commercial Storefront Architectures
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-semibold text-[#4B5F57] hover:text-brand flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <Button size="sm" onClick={() => navigate('/onboarding')} className="text-xs font-bold px-4">
              Build Your Own Store →
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Showcase Hub ──────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20">
            <Sparkles className="h-3.5 w-3.5" /> 4 Separate Commercial Demo Windows
          </div>
          <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold text-[#064E3B] tracking-tight">
            Explore 4 Entirely Distinct Storefronts
          </h1>
          <p className="text-sm text-[#4B5F57] max-w-2xl mx-auto leading-relaxed">
            Each window is engineered with an entirely unique design language, custom header, bespoke product cards, dedicated color palette, and curated catalog. Nothing is shared or generic.
          </p>
        </div>

        {/* ── 4 Window Switcher Tabs ─────────────────────────── */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {DEMO_WINDOWS.map((win) => {
            const Icon = win.icon
            const isActive = activeTab === win.id
            return (
              <button
                key={win.id}
                onClick={() => setActiveTab(win.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  isActive
                    ? 'bg-[#064E3B] text-[#F8E7C9] scale-105 shadow-md'
                    : 'bg-[#FFF9EC] text-[#064E3B] border border-[#E8D5AE] hover:border-[#064E3B]/50'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full inline-block"
                  style={{ backgroundColor: win.accentColor }}
                />
                <Icon className="h-4 w-4" />
                <span>Window {win.windowNumber}: {win.storeName}</span>
              </button>
            )
          })}
        </div>

        {/* ── Interactive Window Showcase Frame ──────────────── */}
        <div className="clay-card overflow-hidden border-2 border-[#E8D5AE] rounded-3xl shadow-xl">
          {/* Simulated Browser Address Bar */}
          <div className="bg-[#F4E4C4] border-b border-[#E8D5AE] px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-stone-700 bg-white px-3.5 py-2 rounded-xl border border-[#E8D5AE] shadow-2xs truncate flex-1">
              <span className="text-emerald-700 font-bold">🔒</span>
              <span className="font-bold text-stone-900">{activeWindow.url}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold ml-auto shrink-0">
                ACTIVE PRODUCTION DEMO
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate(`/s/${activeWindow.slug}`)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
                style={{
                  backgroundColor: activeWindow.accentColor,
                  color: '#FFFFFF'
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Open Window {activeWindow.windowNumber} Fullscreen
              </button>

              <Button
                onClick={() => navigate('/onboarding')}
                variant="secondary"
                className="text-xs font-semibold px-4 py-2.5"
              >
                Use Template in Wizard <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Window Body */}
          <div
            className="p-6 sm:p-12 transition-all space-y-8"
            style={{ backgroundColor: activeWindow.bgColor, color: activeWindow.textColor }}
          >
            <div className="max-w-4xl space-y-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-xs"
                style={{
                  borderColor: activeWindow.accentColor,
                  color: activeWindow.accentColor,
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}
              >
                Window {activeWindow.windowNumber} • {activeWindow.vertical}
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                {activeWindow.tagline}
              </h2>

              <p className="text-sm opacity-85 max-w-2xl leading-relaxed">
                Experience this storefront live. It features its own distinct CSS design tokens, custom typography, individual category groupings, dedicated checkout flow, and completely separate catalog items.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/s/${activeWindow.slug}`)}
                  className="px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:opacity-95"
                  style={{
                    backgroundColor: activeWindow.accentColor,
                    color: '#FFFFFF'
                  }}
                >
                  Launch Full Storefront <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bespoke Sample Products Preview */}
            <div className="p-6 rounded-2xl border border-black/10 bg-black/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                <span>Tailored Products in this Window</span>
                <span className="font-mono text-[11px]">3 of 6 bespoke catalog items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeWindow.sampleProducts.map((p, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-black/15 bg-white/5 backdrop-blur-xs flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest block mb-1"
                        style={{ color: activeWindow.accentColor }}
                      >
                        {p.tag}
                      </span>
                      <h4 className="text-xs font-semibold line-clamp-1">{p.name}</h4>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-black/10">
                      <span className="text-xs font-bold">{p.price}</span>
                      <button
                        onClick={() => navigate(`/s/${activeWindow.slug}`)}
                        className="text-[11px] font-bold underline"
                        style={{ color: activeWindow.accentColor }}
                      >
                        Explore Item →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-black/10">
              {activeWindow.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 font-bold"
                    style={{ color: activeWindow.accentColor }}
                  />
                  <span className="opacity-90">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Links to All 4 Windows ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_WINDOWS.map((win) => {
            const Icon = win.icon
            return (
              <div
                key={win.id}
                onClick={() => navigate(`/s/${win.slug}`)}
                className="clay-card p-5 cursor-pointer hover:border-[#064E3B] transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand/10 text-brand">
                      Window {win.windowNumber}
                    </span>
                    <Icon className="h-4 w-4 text-brand" />
                  </div>
                  <h4 className="font-poppins font-bold text-sm text-[#064E3B] group-hover:underline">
                    {win.storeName}
                  </h4>
                  <p className="text-xs text-[#4B5F57] mt-1 line-clamp-2">
                    {win.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8D5AE] flex items-center justify-between text-xs font-bold text-brand">
                  <span>Open Website</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-[#E8D5AE] py-6 bg-[#FFF9EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4B5F57]">
          <p>© 2026 StoreKraft Technologies Inc. 4 Commercial Demo Storefronts.</p>
          <div className="flex items-center gap-4">
            <Link to="/s/demo-fashion" className="hover:text-brand font-medium">1. Fashion</Link>
            <span>·</span>
            <Link to="/s/demo-electronics" className="hover:text-brand font-medium">2. Electronics</Link>
            <span>·</span>
            <Link to="/s/demo-decor" className="hover:text-brand font-medium">3. Decor</Link>
            <span>·</span>
            <Link to="/s/craft-haven" className="hover:text-brand font-medium">4. Flagship</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
