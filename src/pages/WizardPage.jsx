import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Check, ArrowRight, ArrowLeft, Upload, FileSpreadsheet, Download, AlertTriangle, ExternalLink, Copy, CheckCircle2, QrCode } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { PREDEFINED_CATEGORIES, THEMES_METADATA, getAISetupSuggestions } from '../lib/mockData'
import { LivePhonePreview } from '../components/wizard/LivePhonePreview'
import { useStoreData } from '../store/useStoreData'
import confetti from 'canvas-confetti'

export function WizardPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateStore, importDummyProducts, store } = useStoreData()

  const [currentStep, setCurrentStep] = useState(1)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Wizard state (hydrated with initial or saved draft)
  const [wizardData, setWizardData] = useState(() => {
    const saved = localStorage.getItem('lys_wizard_draft')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return {
      name: 'Vedic Organic Blends',
      slug: 'vedic-organic',
      tagline: 'Artisan cold-pressed botanicals & wellness tea infusions',
      business_type: 'Health & Organic Wellness',
      contact_email: 'hello@vedicblends.in',
      phone: '+91 98450 88776',
      address: '22, Koramangala 4th Block, Bengaluru - 560034',
      logo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&h=200&q=80',
      categories: ['Fashion & Apparel', 'Home Decor & Living'],
      theme_id: 'elegant',
      importedProductsCount: 8
    }
  })

  // Save draft on every change
  useEffect(() => {
    localStorage.setItem('lys_wizard_draft', JSON.stringify(wizardData))
  }, [wizardData])

  // AI Setup Generator
  const handleGenerateAISuggestions = () => {
    if (!aiPrompt.trim()) return
    setIsAiLoading(true)

    setTimeout(() => {
      const suggestions = getAISetupSuggestions(aiPrompt)
      setWizardData(prev => ({
        ...prev,
        tagline: suggestions.tagline,
        theme_id: suggestions.theme_id,
        categories: suggestions.categories.map(c => c.name)
      }))
      setIsAiLoading(false)
      toast.success('AI Setup Applied! ⚡', `Generated tailored categories, tagline, and selected ${suggestions.theme_name} theme.`)
    }, 700)
  }

  // Category toggle
  const toggleCategory = (catName) => {
    setWizardData(prev => {
      const exists = prev.categories.includes(catName)
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter(c => c !== catName)
          : [...prev.categories, catName]
      }
    })
  }

  // Custom category input
  const [customCat, setCustomCat] = useState('')
  const handleAddCustomCat = () => {
    if (!customCat.trim()) return
    if (!wizardData.categories.includes(customCat.trim())) {
      setWizardData(prev => ({ ...prev, categories: [...prev.categories, customCat.trim()] }))
    }
    setCustomCat('')
  }

  // Dummy product import
  const [isImporting, setIsImporting] = useState(false)
  const handleImportDummy = () => {
    setIsImporting(true)
    setTimeout(() => {
      const count = importDummyProducts()
      setWizardData(prev => ({ ...prev, importedProductsCount: count }))
      setIsImporting(false)
      toast.success('Import Successful', `Seeded ${count} realistic catalog products with prices and images.`)
    }, 500)
  }

  // CSV State & Mock Validation
  const [csvFile, setCsvFile] = useState(null)
  const [csvPreviewRows, setCsvPreviewRows] = useState(null)
  const [csvErrors, setCsvErrors] = useState([])

  const handleSimulateCsvUpload = () => {
    setCsvFile({ name: 'catalog_export_v1.csv' })
    // Simulate real world CSV validation with errors for demonstration
    setCsvPreviewRows([
      { row: 1, name: 'Handcrafted Ceramic Mug', price: '₹799', stock: '25', category: 'Home Decor' },
      { row: 2, name: 'Artisan Linen Apron', price: '₹1,299', stock: '14', category: 'Fashion' },
      { row: 3, name: 'Scented Candle Amber', price: 'Rs. 450', stock: 'Invalid', category: 'Home Decor' },
      { row: 4, name: '', price: '₹899', stock: '10', category: 'Gourmet' }
    ])
    setCsvErrors([
      { row: 3, field: 'Stock', problem: "Non-integer value 'Invalid'", fix: 'Set to 0 or valid integer' },
      { row: 4, field: 'Name', problem: 'Required product name missing', fix: 'Row skipped' }
    ])
    toast.info('CSV Analyzed', '4 rows inspected: 2 valid rows ready to import, 2 errors diagnosed.')
  }

  // Final Launch Action
  const [isLaunched, setIsLaunched] = useState(false)
  const handleLaunchStore = () => {
    updateStore({
      name: wizardData.name,
      slug: wizardData.slug,
      tagline: wizardData.tagline,
      business_type: wizardData.business_type,
      contact_email: wizardData.contact_email,
      phone: wizardData.phone,
      address: wizardData.address,
      theme_id: wizardData.theme_id
    })

    setIsLaunched(true)
    localStorage.removeItem('lys_wizard_draft')

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      })
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar with Progress Indicator */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
              LYS
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Store Launch Wizard</h1>
              <p className="text-[11px] text-slate-500">Step {currentStep} of 5 — {['Business Profile', 'Categories', 'Products', 'Theme Picker', 'Launch Review'][currentStep - 1]}</p>
            </div>
          </div>

          {/* Progress Bar & Badges */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                onClick={() => !isLaunched && setCurrentStep(stepNum)}
                className={`h-2 sm:h-2.5 w-12 sm:w-16 rounded-full cursor-pointer transition-all ${
                  stepNum < currentStep
                    ? 'bg-indigo-600'
                    : stepNum === currentStep
                    ? 'bg-indigo-400'
                    : 'bg-slate-200'
                }`}
                title={`Step ${stepNum}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Wizard Form Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* SUCCESS CELEBRATION SCREEN */}
        {isLaunched ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xl space-y-6 animate-in zoom-in-95">
            <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Store Live Instantly
              </span>
              <h2 className="text-3xl font-black text-slate-900">Congratulations! 🎉</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                <span className="font-semibold text-slate-900">{wizardData.name}</span> is now published and accepting live orders.
              </p>
            </div>

            {/* Public Storefront URL Box */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-left space-y-3">
              <span className="text-xs font-bold uppercase tracking-wide text-indigo-900 block">
                Your Public Storefront Link:
              </span>
              <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-indigo-200">
                <code className="text-xs font-mono font-bold text-indigo-700 truncate">
                  {window.location.origin}/s/{wizardData.slug}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/s/${wizardData.slug}`)
                    toast.success('Copied!', 'Store URL copied to clipboard.')
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Copy Store URL"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
                <QrCode className="h-6 w-6 text-slate-400" />
                <span>QR code generated for printed packaging & receipt inserts.</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => navigate(`/s/${wizardData.slug}`)}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Open Live Storefront <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Go to Admin Panel <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* STEP 1: BUSINESS PROFILE & AI MAGIC */}
            {currentStep === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* AI Setup Box */}
                <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/40 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      AI Instant Setup Assist
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Describe your business in one sentence. Gemini will auto-generate your categories, tagline, and optimal theme.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="e.g. Handmade ceramic stoneware and soy scented candles"
                      className="flex-1 rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <Button
                      onClick={handleGenerateAISuggestions}
                      isLoading={isAiLoading}
                      size="sm"
                      className="shrink-0"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" /> Auto-Fill
                    </Button>
                  </div>
                </div>

                {/* Core Store Details Form */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Store Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Store Name"
                      required
                      value={wizardData.name}
                      onChange={e => setWizardData({
                        ...wizardData,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      })}
                    />
                    <div className="space-y-1.5">
                      <Input
                        label="Store Slug (URL)"
                        required
                        value={wizardData.slug}
                        onChange={e => setWizardData({ ...wizardData, slug: e.target.value })}
                        helperText={`Live URL: /s/${wizardData.slug}`}
                      />
                    </div>
                  </div>

                  <Input
                    label="Store Tagline"
                    value={wizardData.tagline}
                    onChange={e => setWizardData({ ...wizardData, tagline: e.target.value })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Email"
                      type="email"
                      value={wizardData.contact_email}
                      onChange={e => setWizardData({ ...wizardData, contact_email: e.target.value })}
                    />
                    <Input
                      label="Support Phone"
                      value={wizardData.phone}
                      onChange={e => setWizardData({ ...wizardData, phone: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Physical Address"
                    value={wizardData.address}
                    onChange={e => setWizardData({ ...wizardData, address: e.target.value })}
                  />
                </Card>
              </div>
            )}

            {/* STEP 2: CATEGORIES SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Select Store Categories</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Pick the categories relevant to your products, or type your own.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {PREDEFINED_CATEGORIES.map(cat => {
                      const isSelected = wizardData.categories.includes(cat.name)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 ml-1" />}
                        </button>
                      )
                    })}
                  </div>

                  {/* Add Custom Category */}
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      value={customCat}
                      onChange={e => setCustomCat(e.target.value)}
                      placeholder="Add custom category (e.g. Eco Crafts)"
                      className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <Button onClick={handleAddCustomCat} size="sm" variant="outline">
                      + Add
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* STEP 3: PRODUCTS & IMPORT (DUMMY & CSV) */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <Card className="p-6 space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Product Catalog Setup</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Seed with ready-made demo products or upload your Excel/CSV catalog.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Dummy Product Seed */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="indigo" size="sm" className="mb-2">Option A • Recommended</Badge>
                        <h3 className="text-sm font-bold text-slate-900">Instant Demo Products</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          Seed 8 realistic products with high-res photos, descriptions, variants, and INR pricing.
                        </p>
                      </div>
                      <Button
                        onClick={handleImportDummy}
                        isLoading={isImporting}
                        variant="primary"
                        size="md"
                        className="w-full"
                      >
                        ⚡ Seed Catalog ({wizardData.importedProductsCount || 8} items ready)
                      </Button>
                    </div>

                    {/* 2. CSV / Excel Upload */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="default" size="sm" className="mb-2">Option B • Bulk Upload</Badge>
                        <h3 className="text-sm font-bold text-slate-900">Upload CSV / Excel Sheet</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          Upload your existing product inventory with auto column mapping and row validation.
                        </p>
                      </div>
                      <Button
                        onClick={handleSimulateCsvUpload}
                        variant="outline"
                        size="md"
                        className="w-full border-slate-300"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1.5 text-emerald-600" />
                        Upload & Validate CSV
                      </Button>
                    </div>
                  </div>

                  {/* CSV Diagnostic Preview & Error Table */}
                  {csvPreviewRows && (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          CSV Inspection Report: {csvFile?.name}
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold">
                          ✓ 2 Valid Rows • ⚠️ 2 Fixes Diagnosed
                        </span>
                      </div>

                      {/* Diagnostic Errors */}
                      {csvErrors.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs space-y-1">
                          <p className="font-bold text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            Row-Level Validation Breakdown:
                          </p>
                          {csvErrors.map((err, i) => (
                            <p key={i} className="text-amber-800">
                              • Row {err.row}: {err.field} — {err.problem}. Suggested action: {err.fix}.
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* STEP 4: THEME SELECTION WITH SPLIT SCREEN LIVE PREVIEW */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Theme cards on left */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Choose Storefront Theme</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Each theme dynamically adapts typography, radii, headers, and card layouts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {THEMES_METADATA.map((theme) => {
                      const isSelected = wizardData.theme_id === theme.id
                      return (
                        <div
                          key={theme.id}
                          onClick={() => setWizardData({ ...wizardData, theme_id: theme.id })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-slate-900">{theme.name}</h3>
                            {isSelected && (
                              <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-snug mb-3">{theme.tagline}</p>
                          <div className="text-[11px] font-medium text-slate-400 space-y-0.5">
                            <div>Font: <span className="text-slate-700">{theme.font}</span></div>
                            <div>Corner Radius: <span className="text-slate-700">{theme.radius}</span></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Live Phone Preview on right */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="text-center mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Live Mobile View
                    </span>
                  </div>
                  <LivePhonePreview
                    themeId={wizardData.theme_id}
                    storeName={wizardData.name}
                    tagline={wizardData.tagline}
                    categoryNames={wizardData.categories}
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & LAUNCH */}
            {currentStep === 5 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Review & Launch Store</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your configuration before publishing your store live.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Store Name:</span>
                      <span className="font-semibold text-slate-900">{wizardData.name}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Store URL:</span>
                      <span className="font-semibold text-indigo-600 font-mono">/s/{wizardData.slug}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Selected Theme:</span>
                      <span className="font-semibold capitalize text-slate-900">{wizardData.theme_id}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Active Categories:</span>
                      <span className="font-semibold text-slate-900">{wizardData.categories.join(', ')}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Products Ready:</span>
                      <span className="font-semibold text-emerald-600">{wizardData.importedProductsCount || 8} items</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
                    🚀 Clicking <strong>Launch Store Now</strong> will generate your live public storefront link immediately.
                  </div>
                </Card>
              </div>
            )}

            {/* Sticky Navigation Bar */}
            <div className="sticky bottom-4 z-30 max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3.5 shadow-lg flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>

              {currentStep < 5 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                >
                  Next Step <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleLaunchStore}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200"
                >
                  🚀 Launch Store Now
                </Button>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
