import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, ExternalLink, ArrowRight, Sparkles, Shirt, Smartphone, Armchair,
  ShoppingBag, Check, Globe, Laptop, ArrowUpRight, Zap, Flame, Compass, Maximize2
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const DEMO_WINDOWS = [
  {
    id: 'demo-fashion',
    slug: 'demo-fashion',
    title: 'Fashion & Haute Couture',
    storeName: 'Atelier Noir',
    vertical: 'Apparel & Streetwear',
    windowNumber: 1,
    tagline: 'Tailored silhouettes, Kurabo raw selvedge denim & Italian linen runway lookbook',
    themeName: 'Rose Gold & Obsidian Noir',
    font: 'Playfair Display + Inter',
    accentColor: '#FB7185',
    bgColor: '#121214',
    textColor: '#FFFFFF',
    url: 'https://storekraft.com/s/demo-fashion',
    icon: Shirt,
    highlights: [
      'Editorial runway lookbook with model photography',
      'Tall 3:4 portrait aspect ratio fashion garment cards',
      'Curated capsule: Selvedge denim, trench coats, silk slip dress',
      'Milano, Paris & Tokyo boutique footer directory'
    ],
    sampleProducts: [
      { name: 'Heritage Raw Selvedge Denim Jacket', price: '₹3,499', tag: 'Kurabo Mills' },
      { name: 'Pure Italian Linen Relaxed Overshirt', price: '₹2,199', tag: 'Garment-Dyed' },
      { name: 'Mulberry Silk Bias-Cut Midi Slip Dress', price: '₹4,899', tag: 'Grade 6A Silk' }
    ]
  },
  {
    id: 'demo-electronics',
    slug: 'demo-electronics',
    title: 'Electronics & Cyber Hardware',
    storeName: 'Pulse Audio & Tech',
    vertical: 'Pro Audio & Tech Specs',
    windowNumber: 2,
    tagline: 'Studio acoustic engineering, LDAC Hi-Res sound & tactile mechanical switches',
    themeName: 'Midnight Teal & Electric Cyan',
    font: 'Space Grotesk + Mono',
    accentColor: '#0D9488',
    bgColor: '#0A0E17',
    textColor: '#FFFFFF',
    url: 'https://storekraft.com/s/demo-electronics',
    icon: Smartphone,
    highlights: [
      'Cyber telemetry status bar & live specs benchmark',
      'Beryllium 40mm drivers with 42dB hybrid noise canceling',
      'Technical hardware SKU tags & gasket mechanical switch info',
      '2-year hardware replacement warranty portal'
    ],
    sampleProducts: [
      { name: 'AcousticPro ANC Wireless Studio Headphones', price: '₹8,999', tag: 'LDAC 990kbps' },
      { name: 'Tactile Gasket 75% Mechanical Keyboard RGB', price: '₹4,999', tag: 'Hot-Swap PCB' },
      { name: 'Studio Precision Active Reference Desk Monitors', price: '₹14,999', tag: 'Bi-Amp Kevlar' }
    ]
  },
  {
    id: 'demo-decor',
    slug: 'demo-decor',
    title: 'Home Decor & Ceramic Living',
    storeName: 'Terra Living & Ceramics',
    vertical: 'Handcrafted Stoneware',
    windowNumber: 3,
    tagline: 'Wheel-thrown pottery, raw travertine vessels & hand-poured botanical candles',
    themeName: 'Sunset Amber & Terracotta',
    font: 'Playfair Display + Lato',
    accentColor: '#B45309',
    bgColor: '#FAF6F0',
    textColor: '#292524',
    url: 'https://storekraft.com/s/demo-decor',
    icon: Armchair,
    highlights: [
      'Live kiln firing batch counter (#08 Live)',
      '4-stage artisan wheel pottery craft story strip',
      'Tactile earthenware cards with volcanic glaze badges',
      '100% plastic-free honeycomb packaging pledge'
    ],
    sampleProducts: [
      { name: 'Artisan Ribbed Stoneware Pottery Vase Set', price: '₹1,799', tag: 'Volcanic Glaze' },
      { name: 'Hand-Thrown Ceramic Espresso Mugs Set of 4', price: '₹1,399', tag: 'Raw Terracotta' },
      { name: 'Hand-Poured Amber & Vetiver Soy Candle', price: '₹799', tag: '55h Wood Wick' }
    ]
  },
  {
    id: 'craft-haven',
    slug: 'craft-haven',
    title: 'All-in-1 Flagship Store',
    storeName: 'StoreKraft Flagship',
    vertical: 'Curated Department Store',
    windowNumber: 4,
    tagline: 'Multi-category department showcase spanning apparel, tech, decor, and fine jewelry',
    themeName: 'Emerald Ink & Champagne',
    font: 'Poppins + Inter',
    accentColor: '#064E3B',
    bgColor: '#F8E7C9',
    textColor: '#064E3B',
    url: 'https://storekraft.com/s/craft-haven',
    icon: ShoppingBag,
    highlights: [
      'Multi-category department mega-navigation',
      'Spring Flagship Showcase split hero with gold badges',
      'Customer 5-star review ratings & Best Seller badges',
      'Complete catalog spanning fashion, tech, ceramics, jewelry'
    ],
    sampleProducts: [
      { name: 'Heritage Raw Denim Jacket', price: '₹3,499', tag: 'Fashion' },
      { name: 'AcousticPro ANC Headphones', price: '₹8,999', tag: 'Electronics' },
      { name: 'Artisan Ceramic Vase Set', price: '₹1,499', tag: 'Home Decor' }
    ]
  }
]

export function DemoShowcaseModal({ isOpen, onClose, onSelectTemplate }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('demo-fashion')
  const [viewMode, setViewMode] = useState('single') // 'single' (interactive window) or 'grid' (all 4)

  if (!isOpen) return null

  const activeWindow = DEMO_WINDOWS.find(w => w.id === activeTab) || DEMO_WINDOWS[0]

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main OS Window Frame Container */}
      <div className="relative w-full max-w-6xl bg-[#FFF9EC] border-2 border-[#E8D5AE] rounded-2xl sm:rounded-3xl shadow-2xl z-10 my-4 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* ── Top OS Window Bar with Traffic Lights ───────── */}
        <div className="bg-[#F4E4C4] border-b border-[#E8D5AE] px-4 py-3 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 inline-block shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-amber-500 inline-block shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-2xs" />
            <span className="ml-2 font-mono text-xs font-bold text-[#064E3B] tracking-wide hidden sm:inline">
              StoreKraft Demo Suite — 4 Distinct Commercial Websites
            </span>
          </div>

          {/* View Mode Toggle: Interactive Window vs 4-Grid */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#EAD6B0] p-1 rounded-lg text-xs font-semibold text-[#064E3B]">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'single' ? 'bg-[#064E3B] text-[#F8E7C9] shadow-xs' : 'hover:bg-black/5'
                }`}
              >
                Interactive Window View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-[#064E3B] text-[#F8E7C9] shadow-xs' : 'hover:bg-black/5'
                }`}
              >
                4-Window Grid
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#4B5F57] hover:text-[#064E3B] hover:bg-[#EAD6B0] transition-colors"
              aria-label="Close window"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── 4 Window Tabs Strip ───────────────────────────── */}
        <div className="bg-[#FFF4DD] border-b border-[#E8D5AE] px-3 pt-2.5 flex items-center gap-1.5 overflow-x-auto">
          {DEMO_WINDOWS.map((win) => {
            const Icon = win.icon
            const isActive = activeTab === win.id
            return (
              <button
                key={win.id}
                onClick={() => {
                  setActiveTab(win.id)
                  setViewMode('single')
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t-2 border-x-2 shrink-0 ${
                  isActive
                    ? 'bg-white border-[#E8D5AE] text-[#064E3B] shadow-xs translate-y-[1px]'
                    : 'bg-[#F2DFBD]/60 border-transparent text-[#4B5F57] hover:bg-[#F2DFBD] hover:text-[#064E3B]'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full inline-block"
                  style={{ backgroundColor: win.accentColor }}
                />
                <Icon className="h-3.5 w-3.5" />
                <span>Window {win.windowNumber}: {win.storeName}</span>
                <span className="text-[10px] font-normal opacity-70">({win.vertical.split(' ')[0]})</span>
              </button>
            )
          })}
        </div>

        {/* ── Mode 1: Single Interactive Window View ────────── */}
        {viewMode === 'single' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white">
            
            {/* Simulated Browser Address Bar & Big Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#F8F6F0] border border-[#E7E0D2]">
              <div className="flex items-center gap-2 font-mono text-xs text-stone-600 truncate flex-1 bg-white px-3 py-2 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-emerald-700 font-bold">🔒</span>
                <span className="font-semibold text-stone-900">{activeWindow.url}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold ml-auto shrink-0">
                  LIVE READY
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenStore(activeWindow.slug)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
                  style={{
                    backgroundColor: activeWindow.accentColor,
                    color: activeWindow.id === 'demo-decor' ? '#FFFFFF' : '#FFFFFF'
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Launch Window {activeWindow.windowNumber} Fullscreen
                </button>

                <Button
                  onClick={() => handleUseTemplate(activeWindow)}
                  variant="secondary"
                  className="text-xs font-semibold px-4 py-2"
                >
                  Use Template in Wizard <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>

            {/* Simulated Live Website Viewport Preview */}
            <div
              className="rounded-2xl border-2 border-stone-300 overflow-hidden shadow-lg transition-all"
              style={{ backgroundColor: activeWindow.bgColor, color: activeWindow.textColor }}
            >
              {/* Mock Window Top Bar */}
              <div className="p-3 border-b border-black/10 flex items-center justify-between text-xs px-5">
                <div className="flex items-center gap-3">
                  <span className="font-bold tracking-widest uppercase font-serif text-sm">
                    {activeWindow.storeName}
                  </span>
                  <span className="text-[11px] opacity-70">
                    • {activeWindow.vertical}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] opacity-80">
                  <span>Theme: {activeWindow.themeName}</span>
                  <span>•</span>
                  <span>Font: {activeWindow.font}</span>
                </div>
              </div>

              {/* Mock Hero Showcase */}
              <div className="p-6 sm:p-10 space-y-4 max-w-4xl">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border shadow-xs"
                  style={{
                    borderColor: activeWindow.accentColor,
                    color: activeWindow.accentColor,
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  {activeWindow.vertical} • Distinct Architecture
                </span>

                <h3 className="text-2xl sm:text-4xl font-bold tracking-tight leading-snug">
                  {activeWindow.tagline}
                </h3>

                <p className="text-xs sm:text-sm opacity-80 max-w-2xl leading-relaxed">
                  Notice how this website is completely unlike the other 3 demo stores: from tailored typography, custom header and lookbook layouts, to bespoke product attributes and custom footers.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleOpenStore(activeWindow.slug)}
                    className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                    style={{
                      backgroundColor: activeWindow.accentColor,
                      color: '#FFFFFF'
                    }}
                  >
                    Open Live Storefront <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenStore(activeWindow.slug)}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-current opacity-80 hover:opacity-100"
                  >
                    Test Live Cart & Checkout
                  </button>
                </div>
              </div>

              {/* Sample Product Cards Preview */}
              <div className="p-6 border-t border-black/10 bg-black/10">
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3 flex items-center justify-between">
                  <span>Curated Sample Products (No shared catalog)</span>
                  <span className="font-mono text-[11px]">3 of 6 bespoke items shown</span>
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
                          onClick={() => handleOpenStore(activeWindow.slug)}
                          className="text-[11px] font-bold underline"
                          style={{ color: activeWindow.accentColor }}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architectural Highlights Checklist */}
              <div className="p-6 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
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
        )}

        {/* ── Mode 2: 4-Window Grid Overview ────────────────── */}
        {viewMode === 'grid' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
            {DEMO_WINDOWS.map((win) => {
              const Icon = win.icon
              return (
                <div
                  key={win.id}
                  className="rounded-2xl border-2 border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  style={{ backgroundColor: win.bgColor, color: win.textColor }}
                >
                  {/* Browser Window Header */}
                  <div className="p-3 border-b border-black/10 flex items-center justify-between bg-black/10">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="font-mono text-[11px] font-bold ml-1">
                        Window {win.windowNumber}: {win.storeName}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/20">
                      {win.vertical}
                    </span>
                  </div>

                  {/* Window Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold tracking-tight">{win.title}</h4>
                      <p className="text-xs opacity-80 mt-1 leading-relaxed">{win.tagline}</p>

                      <div className="mt-3 pt-3 border-t border-black/10 space-y-1 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="opacity-70">Palette:</span>
                          <span className="font-semibold">{win.themeName}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="opacity-70">Typography:</span>
                          <span className="font-mono">{win.font}</span>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Action Button */}
                    <div className="pt-3 border-t border-black/10 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenStore(win.slug)}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        style={{
                          backgroundColor: win.accentColor,
                          color: '#FFFFFF'
                        }}
                      >
                        Launch Window {win.windowNumber} <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleUseTemplate(win)}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold border border-current opacity-80 hover:opacity-100"
                        title="Use Template"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Footer Bar ────────────────────────────────────── */}
        <div className="bg-[#F4E4C4] border-t border-[#E8D5AE] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4B5F57]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#064E3B]">4 Live Storefronts:</span>
            <button onClick={() => handleOpenStore('demo-fashion')} className="hover:underline hover:text-[#064E3B]">
              1. Atelier Noir (Fashion)
            </button>
            <span>•</span>
            <button onClick={() => handleOpenStore('demo-electronics')} className="hover:underline hover:text-[#064E3B]">
              2. Pulse Tech (Electronics)
            </button>
            <span>•</span>
            <button onClick={() => handleOpenStore('demo-decor')} className="hover:underline hover:text-[#064E3B]">
              3. Terra Living (Decor)
            </button>
            <span>•</span>
            <button onClick={() => handleOpenStore('craft-haven')} className="hover:underline hover:text-[#064E3B]">
              4. Flagship (All-in-1)
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-[#064E3B] font-bold hover:underline"
          >
            Close Window ✕
          </button>
        </div>

      </div>
    </div>
  )
}
