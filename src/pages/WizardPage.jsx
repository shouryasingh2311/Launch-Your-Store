import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HexColorPicker } from 'react-colorful'
import {
  Sparkles, Check, ArrowRight, ArrowLeft, Upload,
  FileSpreadsheet, AlertTriangle, ExternalLink, Copy,
  CheckCircle2, QrCode, RotateCcw, Image, ChevronDown,
  Palette, Monitor, Smartphone, RefreshCw, Plus, Package,
  Send, Bot, Layout, Sliders
} from 'lucide-react'
import { Input } from '../components/ui/Input'
import { CountryCodeSelector } from '../components/ui/CountryCodeSelector'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { LatticeLoader } from '../components/ui/LatticeLoader'
import { PREDEFINED_CATEGORIES, THEMES_METADATA, DEMO_STORE_PRODUCTS } from '../lib/mockData'
import { analyzeStorePrompt } from '../lib/aiStoreAnalyzer'
import { LivePhonePreview } from '../components/wizard/LivePhonePreview'
import { useStoreData } from '../store/useStoreData'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../lib/api'
import confetti from 'canvas-confetti'
import { cn, CURRENCY_CONFIG, formatCurrency } from '../lib/utils'

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' }
]

const QUICK_SUGGESTIONS = [
  'Minimalist Ceramic & Pottery Studio',
  'Organic Specialty Coffee Roasters',
  'Contemporary Streetwear & Apparel',
  'Handcrafted Leather Goods & Bags',
  'Botanical Skincare & Wellness',
  'Modern Ergonomic Workspace Gear'
]

const HEADING_FONTS = ['Poppins', 'Inter', 'Playfair Display', 'Space Grotesk', 'Lato', 'Montserrat']
const BODY_FONTS = ['Inter', 'Poppins', 'Lato', 'Space Grotesk', 'Open Sans', 'Roboto']

const defaultOverrides = () => ({
  colors: {},
  background: { type: 'solid', color: '', gradient: { from: '', to: '', angle: 135 }, heroImageUrl: '' },
  button: { radius: 'rounded', position: 'hero', style: 'filled', shadow: true },
  fonts: { heading: '', body: '' }
})

function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

function ColorControl({ label, value, onChange, onReset }) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(value || '')
  const ref = useRef(null)

  useEffect(() => { setHexInput(value || '') }, [value])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="space-y-1.5" ref={ref}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">{label}</label>
        {onReset && (
          <button onClick={onReset} className="text-[var(--sc-muted)] hover:text-[var(--sc-ink)] p-1 rounded" title="Reset to default">
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-xl border-2 border-champagne-border shadow-sm flex-shrink-0"
          style={{ background: isValidHex(value) ? value : '#cccccc' }}
          aria-label={`Pick ${label} color`}
        />
        <input
          type="text"
          value={hexInput}
          onChange={e => {
            setHexInput(e.target.value)
            if (isValidHex(e.target.value)) onChange(e.target.value)
          }}
          className="clay-input flex-1 px-3 py-2 text-xs font-mono min-h-[44px]"
          placeholder="#064E3B"
          maxLength={7}
        />
      </div>
      {open && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 clay-card p-3 space-y-2 shadow-xl">
            <HexColorPicker color={isValidHex(value) ? value : '#064E3B'} onChange={v => { onChange(v); setHexInput(v) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function ImageUploadControl({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const handleFile = async (file) => {
    setIsUploading(true)
    try {
      const dataUrl = await api.uploadImage(file)
      onChange(dataUrl)
      toast.success('Image Uploaded', 'Logo attached successfully.')
    } catch (err) {
      toast.error('Upload failed', err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">{label}</label>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        className="clay-card p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-brand/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Preview" className="max-h-20 max-w-full rounded-lg object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[var(--sc-muted)]">
            <Image className="h-7 w-7 opacity-50" />
            <span className="text-xs font-medium">Click or drag logo to upload</span>
            <span className="text-[10px]">JPEG, PNG, WebP — max 5 MB</span>
          </div>
        )}
        {isUploading && <span className="text-xs text-brand font-medium">Processing upload…</span>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }} />
      {value && (
        <button onClick={() => onChange('')} className="text-[10px] text-[var(--sc-muted)] hover:text-red-700">
          Remove logo
        </button>
      )}
    </div>
  )
}

export function WizardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { updateStore, importDummyProducts, addProduct, setProducts, setCategories, products, saveCustomStore } = useStoreData()
  const { user, isAuthenticated } = useAuthStore()

  // Authentication gate: enforce login/signup before store setup
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/signup?redirect=${encodeURIComponent(location.pathname)}`)
    }
  }, [isAuthenticated, location.pathname, navigate])

  const [currentStep, setCurrentStep] = useState(1)

  // ── Step 1: AI Chat Discovery ────────────────────────
  const [aiPrompt, setAiPrompt] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('working') // 'working' | 'done' | 'error'
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your StoreKraft AI architect. Describe what you want to sell or tap a suggestion below, and I will generate your brand name, tagline, categories, and theme palette.'
    }
  ])

  // ── Step 2: Available Categories State ────────────────
  const [availableCategories, setAvailableCategories] = useState(PREDEFINED_CATEGORIES)
  const [customCatInput, setCustomCatInput] = useState('')

  // ── Wizard Data ──────────────────────────────────────
  const [wizardData, setWizardData] = useState(() => {
    try {
      const saved = localStorage.getItem('sk_wizard_draft')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      name: '',
      slug: '',
      tagline: '',
      business_type: '',
      contact_email: '',
      country_code: '+91',
      phone: '',
      address: '',
      logo_url: '',
      currency: 'INR',
      categories: ['Featured Collection', 'Best Sellers'],
      theme_id: 'emerald',
      theme_overrides: defaultOverrides(),
      importedProductsCount: 0
    }
  })

  useEffect(() => {
    localStorage.setItem('sk_wizard_draft', JSON.stringify(wizardData))
  }, [wizardData])

  const patchWizard = useCallback((patch) => setWizardData(prev => ({ ...prev, ...patch })), [])
  const patchOverrides = useCallback((patch) => {
    setWizardData(prev => ({
      ...prev,
      theme_overrides: { ...prev.theme_overrides, ...patch }
    }))
  }, [])

  // ── AI Prompt Analysis Execution ─────────────────────
  const handleAnalyzePrompt = async (promptText) => {
    const textToAnalyze = promptText || aiPrompt
    if (!textToAnalyze.trim()) {
      toast.warning('Input Required', 'Please describe your store concept or pick a suggestion.')
      return
    }

    setIsAiLoading(true)
    setAiStatus('working')

    // Add user message to thread
    setChatMessages(prev => [...prev, { sender: 'user', text: textToAnalyze }])

    try {
      // 1. Try backend AI endpoint if available
      let analysisResult = null
      try {
        const apiRes = await api.getAISetupSuggestions(textToAnalyze)
        if (apiRes && apiRes.categories) {
          analysisResult = {
            name: apiRes.name || '',
            slug: apiRes.slug || '',
            tagline: apiRes.tagline || '',
            categories: (apiRes.categories || []).map(c => typeof c === 'string' ? c : c.name),
            theme_id: apiRes.theme_id || 'emerald',
            colors: apiRes.colors || {},
            analysisSummary: apiRes.summary || `Extracted tailored store concepts for "${textToAnalyze}".`
          }
        }
      } catch {
        // Backend offline -> run high-fidelity client-side analyzer
      }

      if (!analysisResult) {
        // Subtle realistic synthesis delay so user sees orbital wave and stopwatch
        await new Promise(r => setTimeout(r, 700))
        analysisResult = analyzeStorePrompt(textToAnalyze)
      }

      // 2. Apply to wizard state
      const finalName = analysisResult.name || wizardData.name || 'StoreKraft Studio'
      const finalSlug = analysisResult.slug || finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      patchWizard({
        name: finalName,
        slug: finalSlug,
        tagline: analysisResult.tagline || wizardData.tagline,
        categories: analysisResult.categories || wizardData.categories,
        theme_id: analysisResult.theme_id || wizardData.theme_id,
        theme_overrides: {
          ...wizardData.theme_overrides,
          colors: {
            ...wizardData.theme_overrides.colors,
            ...(analysisResult.colors || {})
          }
        }
      })

      // Add to available categories if any new ones generated
      if (analysisResult.categories?.length) {
        setAvailableCategories(prev => {
          const existingNames = prev.map(c => c.name.toLowerCase())
          const newOnes = analysisResult.categories
            .filter(catName => !existingNames.includes(catName.toLowerCase()))
            .map(catName => ({ id: `cat-ai-${Date.now()}-${catName}`, name: catName, emoji: '', slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))
          return [...prev, ...newOnes]
        })
      }

      // Show checkmark mark transition on LatticeLoader
      setAiStatus('done')
      await new Promise(r => setTimeout(r, 800))

      // Add AI reply to chat thread
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Analyzed your prompt! I drafted brand "${finalName}" with tagline "${analysisResult.tagline}". Curated ${analysisResult.categories?.length || 4} targeted categories and configured the "${analysisResult.theme_id}" multi-color aesthetic. Review details in the card on the right.`
        }
      ])

      toast.success('Store Generated', `Configured "${finalName}".`)
    } catch (err) {
      setAiStatus('error')
      await new Promise(r => setTimeout(r, 1000))
      toast.error('Analysis error', err.message)
    } finally {
      setIsAiLoading(false)
      setAiStatus('working')
    }
  }

  // ── Step 2: Category Toggle & Custom Tag Addition ────
  const toggleCategory = (name) => {
    setWizardData(prev => {
      const exists = prev.categories.includes(name)
      return {
        ...prev,
        categories: exists ? prev.categories.filter(c => c !== name) : [...prev.categories, name]
      }
    })
  }

  const handleAddCustomCategory = () => {
    const trimmed = customCatInput.trim()
    if (!trimmed) return

    // 1. Add to available default tags list so it appears permanently
    if (!availableCategories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setAvailableCategories(prev => [
        ...prev,
        { id: `cat-custom-${Date.now()}`, name: trimmed, emoji: '', slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ])
    }

    // 2. Toggle active selection
    if (!wizardData.categories.includes(trimmed)) {
      patchWizard({ categories: [...wizardData.categories, trimmed] })
    }

    setCustomCatInput('')
    toast.success('Category Added', `"${trimmed}" added to default categories.`)
  }

  // ── Step 3: Product Catalog Operations ────────────────
  const [isImporting, setIsImporting] = useState(false)
  const handleSeedCatalogTemplate = (key = 'flagship') => {
    setIsImporting(true)
    setTimeout(() => {
      let seedItems = []
      if (key === 'fashion') seedItems = DEMO_STORE_PRODUCTS['demo-fashion'] || []
      else if (key === 'electronics') seedItems = DEMO_STORE_PRODUCTS['demo-electronics'] || []
      else if (key === 'decor') seedItems = DEMO_STORE_PRODUCTS['demo-decor'] || []
      else seedItems = DEMO_STORE_PRODUCTS['craft-haven'] || []

      setWizardProducts([...seedItems])
      patchWizard({ importedProductsCount: seedItems.length })
      setIsImporting(false)
      toast.success('Catalog Seeded', `${seedItems.length} products loaded from ${key} collection.`)
    }, 300)
  }
  const handleImportDummy = () => handleSeedCatalogTemplate('flagship')

  // CSV & Excel sheet parser
  const csvInputRef = useRef(null)
  const [csvFileName, setCsvFileName] = useState('')
  const [csvStats, setCsvStats] = useState(null)
  const [csvErrors, setCsvErrors] = useState([])

  const handleCsvFileSelected = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFileName(file.name)
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const text = evt.target?.result
        if (typeof text !== 'string') return

        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0)
        if (lines.length <= 1) {
          toast.warning('Empty File', 'CSV file does not contain data rows.')
          return
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
        const validRows = []
        const rowErrors = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
          const rowObj = {}
          headers.forEach((h, idx) => { rowObj[h] = values[idx] || '' })

          const name = rowObj.name || rowObj.title || rowObj.product || ''
          const rawPrice = (rowObj.price || '').replace(/[^0-9.]/g, '')
          const price = parseFloat(rawPrice) || 0
          const stock = parseInt(rowObj.stock || '10', 10)
          const category = rowObj.category || 'General'

          if (!name) {
            rowErrors.push({ row: i, field: 'name', problem: 'Missing product name', fix: 'Skipped' })
            continue
          }
          if (price <= 0) {
            rowErrors.push({ row: i, field: 'price', problem: `Invalid price "${rowObj.price}"`, fix: 'Set default 499' })
          }

          validRows.push({
            id: `csv-${Date.now()}-${i}`,
            name,
            price: price > 0 ? price : 499,
            stock: isNaN(stock) ? 10 : stock,
            categoryName: category,
            description: rowObj.description || `${name} imported from CSV.`,
            image_url: rowObj.image || rowObj.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
            is_active: true
          })
        }

        // Add valid products to wizard state (isolated to this store)
        setWizardProducts(prev => [...validRows, ...prev])
        patchWizard({ importedProductsCount: (wizardData.importedProductsCount || 0) + validRows.length })

        setCsvStats({ total: lines.length - 1, valid: validRows.length, errors: rowErrors.length })
        setCsvErrors(rowErrors)

        toast.success('Catalog Imported', `Imported ${validRows.length} valid products from ${file.name}.`)
      } catch (err) {
        toast.error('CSV Parsing Error', err.message)
      }
    }

    reader.readAsText(file)
  }

  // Manual Cataloguing state & modal
  const [showManualModal, setShowManualModal] = useState(false)
  const [manualTitle, setManualTitle] = useState('')
  const [manualPrice, setManualPrice] = useState('')
  const [manualPriceFormatted, setManualPriceFormatted] = useState('')
  const [manualDesc, setManualDesc] = useState('')
  const [manualImage, setManualImage] = useState('')
  const [wizardProducts, setWizardProducts] = useState([])

  const handleSaveManualProduct = (e) => {
    e.preventDefault()
    if (!manualTitle.trim()) {
      toast.warning('Title Required', 'Enter product name')
      return
    }

    const priceNum = parseFloat(manualPrice) || 999
    const newProd = {
      id: `manual-${Date.now()}`,
      name: manualTitle.trim(),
      price: priceNum,
      compare_at_price: Math.round(priceNum * 1.25),
      stock: 25,
      categoryName: wizardData.categories[0] || 'Catalog',
      description: manualDesc.trim() || `${manualTitle.trim()} handcrafted quality.`,
      image_url: manualImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      is_active: true
    }

    // Add only to wizard state (will be saved strictly under this store's slug/id on launch)
    setWizardProducts(prev => [newProd, ...prev])
    patchWizard({ importedProductsCount: (wizardData.importedProductsCount || 0) + 1 })
    toast.success('Product Added', `"${manualTitle}" added to catalog.`)

    // Reset modal
    setManualTitle('')
    setManualPrice('')
    setManualPriceFormatted('')
    setManualDesc('')
    setManualImage('')
    setShowManualModal(false)
  }

  const handleDeleteWizardProduct = (prodId) => {
    setWizardProducts(prev => prev.filter(p => p.id !== prodId))
    toast.info('Item Removed', 'Product removed from catalog.')
  }

  // ── Step 4: Theme Controls & Live Preview ────────────
  const [previewPage, setPreviewPage] = useState('home')

  const THEME_PRESETS = {
    emerald:  { primary: '#064E3B', primaryText: '#F8E7C9', bg: '#F8E7C9', surface: '#FFF9EC', text: '#4B5F57', heading: '#064E3B', price: '#064E3B' },
    midnight: { primary: '#0D9488', primaryText: '#FFFFFF', bg: '#0F172A', surface: '#1E293B', text: '#94A3B8', heading: '#F8FAFC', price: '#38BDF8' },
    rose:     { primary: '#FB7185', primaryText: '#FFFFFF', bg: '#18181B', surface: '#27272A', text: '#FDA4AF', heading: '#FFF1F2', price: '#F43F5E' },
    minimal:  { primary: '#111827', primaryText: '#FFFFFF', bg: '#FFFFFF', surface: '#F9FAFB', text: '#374151', heading: '#111827', price: '#111827' },
    amber:    { primary: '#F59E0B', primaryText: '#FFFFFF', bg: '#FAF5EF', surface: '#FFFFFF', text: '#57534E', heading: '#292524', price: '#EA580C' },
    ocean:    { primary: '#0284C7', primaryText: '#FFFFFF', bg: '#F0F9FF', surface: '#FFFFFF', text: '#334155', heading: '#0C4A6E', price: '#0284C7' },
  }

  const currentThemePreset = THEME_PRESETS[wizardData.theme_id] || THEME_PRESETS.emerald
  const ov = wizardData.theme_overrides?.colors || {}

  const setColor = (key, val) => {
    patchOverrides({
      colors: { ...wizardData.theme_overrides.colors, [key]: val }
    })
  }

  const resetTheme = () => {
    patchOverrides(defaultOverrides())
    toast.info('Theme Reset', 'Reset to theme defaults.')
  }

  // ── Step 5: Launch Store ──────────────────────────────
  const [isLaunched, setIsLaunched] = useState(false)
  const handleLaunchStore = () => {
    // 1. If user catalogued products in wizard, use ONLY those products
    const finalProducts = wizardProducts.length > 0 ? wizardProducts : (DEMO_STORE_PRODUCTS['craft-haven'] || products)

    // 2. Filter categories to ONLY those selected in wizard
    const finalCategories = (wizardData.categories || []).map((catName, idx) => ({
      id: `cat-wiz-${idx}`,
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }))

    const fullPhone = `${wizardData.country_code || '+91'} ${wizardData.phone || ''}`.trim()
    const activeCurrency = wizardData.currency || 'INR'

    const storePayload = {
      id: `store-${wizardData.slug || Date.now()}`,
      name: wizardData.name || 'StoreKraft Store',
      slug: wizardData.slug || 'storekraft-store',
      tagline: wizardData.tagline,
      business_type: wizardData.business_type,
      contact_email: wizardData.contact_email,
      phone: fullPhone,
      address: wizardData.address,
      logo_url: wizardData.logo_url,
      theme_id: wizardData.theme_id,
      theme_overrides: wizardData.theme_overrides,
      currency: activeCurrency,
      currency_symbol: CURRENCY_CONFIG[activeCurrency]?.symbol || '₹',
      content: {
        heroTitle: wizardData.name ? `${wizardData.name} Collection` : 'Curated Essentials',
        heroSubtitle: wizardData.tagline || 'Explore handcrafted goods made with purpose.',
        heroBadge: 'New Launch Live',
        heroCta: wizardData.theme_overrides?.button?.text || 'Explore Catalog',
        announcement: 'Welcome to our online store! Shipping available now.'
      }
    }

    // Multi-tenant Store Isolation: Save strictly under this store ID & slug
    saveCustomStore(storePayload, finalProducts, finalCategories)
    updateStore(storePayload)
    setProducts(finalProducts)
    setCategories(finalCategories)

    setIsLaunched(true)
    localStorage.removeItem('sk_wizard_draft')
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } })
    } catch {}
  }

  const STEPS = ['Brand Discovery', 'Categories', 'Catalog', 'Theme & Mobile', 'Launch']

  // Proceed handler for Step 1
  const handleStep1Next = () => {
    if (!wizardData.name.trim()) {
      toast.warning('Store Name Required', 'Please enter your Store Name or use the AI generator.')
      return
    }
    if (!wizardData.slug.trim()) {
      patchWizard({ slug: wizardData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
    }
    setCurrentStep(2)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Sticky Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-champagne-card/90 backdrop-blur-md border-b border-champagne-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand text-champagne flex items-center justify-center font-black text-sm">
              SK
            </div>
            <div>
              <h1 className="font-poppins text-sm font-bold text-brand leading-tight">StoreKraft Wizard</h1>
              <p className="text-[11px] text-[var(--sc-muted)]">
                Step {currentStep} of 5 — {STEPS[currentStep - 1]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {STEPS.map((label, i) => (
              <button
                key={i}
                onClick={() => !isLaunched && setCurrentStep(i + 1)}
                title={label}
                className={cn(
                  'h-2 sm:h-2.5 rounded-full transition-all duration-300',
                  i + 1 < currentStep   ? 'bg-brand w-8 sm:w-10' :
                  i + 1 === currentStep ? 'bg-brand/60 w-8 sm:w-10' :
                                          'bg-champagne-border w-5 sm:w-7'
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Body ─────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* SUCCESS SCREEN */}
        {isLaunched ? (
          <div className="max-w-xl mx-auto clay-card p-8 sm:p-12 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="font-poppins font-black text-3xl text-brand">Your store is live!</h2>
              <p className="text-sm text-[var(--sc-muted)]">
                <span className="font-semibold text-brand">{wizardData.name}</span> is published and accepting orders.
              </p>
            </div>
            <div className="p-4 clay-card space-y-3">
              <span className="text-xs font-bold uppercase tracking-wide text-brand block">Your public store link</span>
              <div className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-champagne-border">
                <code className="text-xs font-mono font-bold text-brand truncate flex-1">
                  {window.location.origin}/s/{wizardData.slug}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/s/${wizardData.slug}`); toast.success('Copied URL', '') }}
                  className="p-1.5 rounded-lg text-[var(--sc-muted)] hover:text-brand"
                  aria-label="Copy store URL"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--sc-muted)]">
                <QrCode className="h-5 w-5" />
                <span>QR code generated for printed packaging and receipts.</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button onClick={() => navigate(`/s/${wizardData.slug}`)} className="w-full">
                Open Storefront <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
              <Button onClick={() => navigate('/admin/dashboard')} variant="secondary" className="w-full">
                Admin Dashboard <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ══════════════════════════════════════════════════
                STEP 1: 2 VERTICAL CARDS (AI Chat & Manual Details)
                ══════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <h2 className="font-poppins font-bold text-2xl text-brand">Setup Your Store</h2>
                  <p className="text-xs text-[var(--sc-muted)]">
                    Use our intelligent AI architect on the left or fill in your store credentials manually on the right. Both update in real time.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                  {/* ── CARD 1 (LEFT): AI Store Discovery & Chat Box ── */}
                  <Card className="p-6 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-champagne-border pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-poppins font-bold text-base text-brand">
                              What should we build today?
                            </h3>
                            <p className="text-xs text-[var(--sc-muted)]">
                              StoreKraft AI Brand & Catalog Architect
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Clickable Quick Suggestions */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--sc-muted)] block">
                          Clickable Suggestions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_SUGGESTIONS.map(sug => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => {
                                setAiPrompt(sug)
                                handleAnalyzePrompt(sug)
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-champagne-card border border-champagne-border text-[var(--sc-ink)] hover:border-brand hover:bg-brand/10 transition-colors text-left"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Conversational Message Thread */}
                      <div className="p-3.5 rounded-xl bg-champagne-card/60 border border-champagne-border max-h-48 overflow-y-auto space-y-2.5 text-xs">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={cn(
                              'p-2.5 rounded-xl leading-relaxed',
                              msg.sender === 'ai'
                                ? 'bg-white border border-champagne-border text-[var(--sc-ink)] shadow-2xs'
                                : 'bg-brand text-champagne ml-4'
                            )}
                          >
                            <span className="font-bold text-[10px] uppercase block mb-1 opacity-75">
                              {msg.sender === 'ai' ? 'StoreKraft AI' : 'You'}
                            </span>
                            {msg.text}
                          </div>
                        ))}
                        {isAiLoading && (
                          <div className="p-3 rounded-xl bg-white border border-champagne-border text-[var(--sc-ink)] shadow-2xs">
                            <LatticeLoader
                              status={aiStatus}
                              label="Architecting store concept"
                              doneLabel="Brand synthesized in"
                              errorLabel="Analysis failed after"
                              pattern="orbit"
                              grid={3}
                              shape="round"
                              color="#064E3B"
                              doneColor="#059669"
                              errorColor="#dc2626"
                              cellSize={6}
                              gap={2.5}
                              fontSize={12}
                              step={90}
                              glow={true}
                              glowColor="rgba(5, 150, 105, 0.3)"
                              showTimer={true}
                            />
                          </div>
                        )}
                      </div>

                      {/* Chat Input & Submit */}
                      <div className="space-y-2">
                        <textarea
                          value={aiPrompt}
                          onChange={e => setAiPrompt(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyzePrompt() } }}
                          placeholder="e.g. Handmade minimalist ceramic tableware and hand-poured soy candles"
                          rows={2}
                          className="clay-input w-full px-3.5 py-2.5 text-xs resize-none"
                          aria-label="Describe your store"
                        />
                        <Button
                          onClick={() => handleAnalyzePrompt()}
                          isLoading={isAiLoading}
                          className="w-full font-bold text-xs"
                          disabled={!aiPrompt.trim()}
                        >
                          <Sparkles className="h-4 w-4 mr-1.5" />
                          Analyze & Generate Brand
                        </Button>
                      </div>
                    </div>

                    {/* Logo Upload inside Left Card */}
                    <div className="pt-3 border-t border-champagne-border">
                      <ImageUploadControl
                        label="Store Logo (Optional)"
                        value={wizardData.logo_url}
                        onChange={url => patchWizard({ logo_url: url })}
                      />
                    </div>
                  </Card>

                  {/* ── CARD 2 (RIGHT): Manual Information Filling ── */}
                  <Card className="p-6 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="border-b border-champagne-border pb-3">
                        <h3 className="font-poppins font-bold text-base text-brand">
                          Manual Store Details
                        </h3>
                        <p className="text-xs text-[var(--sc-muted)]">
                          Configure or refine credentials drafted by the AI
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Input
                          label="Store Name *"
                          required
                          placeholder="e.g. Terra Ceramic Studio"
                          value={wizardData.name}
                          onChange={e => {
                            const val = e.target.value
                            patchWizard({
                              name: val,
                              slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            })
                          }}
                        />

                        <Input
                          label="Store URL Slug *"
                          required
                          placeholder="e.g. terra-ceramic-studio"
                          value={wizardData.slug}
                          onChange={e => patchWizard({ slug: e.target.value })}
                          helperText={`Public URL: /s/${wizardData.slug || 'your-store'}`}
                        />

                        <Input
                          label="Store Tagline"
                          placeholder="e.g. Handcrafted objects made to endure."
                          value={wizardData.tagline}
                          onChange={e => patchWizard({ tagline: e.target.value })}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                          <div className="min-w-0">
                            <Input
                              label="Contact Email"
                              type="email"
                              placeholder="hello@yourstore.com"
                              value={wizardData.contact_email}
                              onChange={e => patchWizard({ contact_email: e.target.value })}
                            />
                          </div>
                          <div className="w-full space-y-1.5 min-w-0">
                            <label className="block text-xs font-semibold text-[var(--sc-ink)] tracking-wide uppercase">
                              Support Phone
                            </label>
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <CountryCodeSelector
                                value={wizardData.country_code || '+91'}
                                onChange={code => patchWizard({ country_code: code })}
                                className="w-[96px] flex-shrink-0"
                              />
                              <input
                                type="tel"
                                placeholder="98765 43210"
                                value={wizardData.phone || ''}
                                onChange={e => patchWizard({ phone: e.target.value })}
                                className="clay-input flex-1 min-w-0 h-11 px-3.5 text-sm text-[var(--sc-ink)] placeholder:text-[var(--sc-muted)]"
                                aria-label="Support phone number"
                              />
                            </div>
                          </div>
                        </div>

                        <Input
                          label="Physical Address"
                          placeholder="Studio location or city"
                          value={wizardData.address}
                          onChange={e => patchWizard({ address: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Logo Upload inside Right Card */}
                    <div className="pt-3 border-t border-champagne-border">
                      <ImageUploadControl
                        label="Store Logo (Optional)"
                        value={wizardData.logo_url}
                        onChange={url => patchWizard({ logo_url: url })}
                      />
                    </div>
                  </Card>
                </div>

                {/* Primary Proceed CTA for Step 1 */}
                <div className="flex justify-end pt-2">
                  <Button size="lg" onClick={handleStep1Next} className="font-bold text-sm px-8">
                    Proceed to Categories <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 2: CATEGORIES (Custom Tag Adds to Default Tags)
                ══════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="font-poppins font-bold text-base text-brand">Store Categories</h2>
                    <p className="text-xs text-[var(--sc-muted)] mt-1">
                      Choose which categories organize your catalog. Adding a custom category automatically includes it in the default tags list.
                    </p>
                  </div>

                  {/* Available Categories list (NO EMOJIS) */}
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(cat => {
                      const isSelected = wizardData.categories.includes(cat.name)
                      return (
                        <button
                          key={cat.id || cat.name}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={cn(
                            'px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all flex items-center gap-1.5 min-h-[40px]',
                            isSelected
                              ? 'bg-brand text-champagne border-brand shadow-clay-btn'
                              : 'bg-champagne-card text-[var(--sc-ink)] border-champagne-border hover:border-brand/40'
                          )}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 ml-1" />}
                        </button>
                      )
                    })}
                  </div>

                  {/* Add Custom Category Input */}
                  <div className="pt-3 border-t border-champagne-border flex gap-2">
                    <input
                      type="text"
                      value={customCatInput}
                      onChange={e => setCustomCatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddCustomCategory() }}
                      placeholder="Add custom category (e.g. Sustainable Goods)"
                      className="clay-input flex-1 px-3.5 py-2 text-xs min-h-[42px]"
                      aria-label="Custom category name"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleAddCustomCategory}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Category
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 3: CATALOG (Demo, Working CSV, Manual Cataloguing)
                ══════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <Card className="p-6 space-y-6">
                  <div>
                    <h2 className="font-poppins font-bold text-base text-brand">Product Catalog Setup</h2>
                    <p className="text-xs text-[var(--sc-muted)] mt-1">
                      Seed with ready-made demo products, upload your CSV sheet, or manually catalogue products one by one.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Option A: Seed Demo with 4 vertical choices */}
                    <div className="clay-card p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="indigo" size="sm" className="mb-2">Quick Start</Badge>
                        <h3 className="text-sm font-bold text-brand">Seed Ready Catalog</h3>
                        <p className="text-xs text-[var(--sc-muted)] mt-1">
                          Seed ready-made catalog collections tailored to your vertical:
                        </p>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSeedCatalogTemplate('fashion')}
                            disabled={isImporting}
                            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-champagne-border bg-white text-[var(--sc-ink)] hover:border-brand hover:bg-brand/10 text-left transition-colors"
                          >
                            Fashion (6)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSeedCatalogTemplate('electronics')}
                            disabled={isImporting}
                            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-champagne-border bg-white text-[var(--sc-ink)] hover:border-brand hover:bg-brand/10 text-left transition-colors"
                          >
                            Electronics (6)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSeedCatalogTemplate('decor')}
                            disabled={isImporting}
                            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-champagne-border bg-white text-[var(--sc-ink)] hover:border-brand hover:bg-brand/10 text-left transition-colors"
                          >
                            Home Decor (6)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSeedCatalogTemplate('flagship')}
                            disabled={isImporting}
                            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-champagne-border bg-white text-[var(--sc-ink)] hover:border-brand hover:bg-brand/10 text-left transition-colors"
                          >
                            Flagship All (8)
                          </button>
                        </div>
                        <p className="text-[10px] text-center text-[var(--sc-muted)] pt-0.5">
                          Current items: {wizardProducts.length}
                        </p>
                      </div>
                    </div>

                    {/* Option B: Working CSV & Excel Upload */}
                    <div className="clay-card p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="default" size="sm" className="mb-2">Bulk Import</Badge>
                        <h3 className="text-sm font-bold text-brand">Upload CSV / Sheet</h3>
                        <p className="text-xs text-[var(--sc-muted)] mt-1">
                          Auto-parses title, price, stock & category with error diagnostics.
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={csvInputRef}
                        accept=".csv, .tsv, .txt"
                        className="hidden"
                        onChange={handleCsvFileSelected}
                      />
                      <Button
                        onClick={() => csvInputRef.current?.click()}
                        variant="secondary"
                        className="w-full text-xs"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1.5 text-brand" />
                        Select CSV File
                      </Button>
                    </div>

                    {/* Option C: Manual Cataloguing */}
                    <div className="clay-card p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="success" size="sm" className="mb-2">Custom Item</Badge>
                        <h3 className="text-sm font-bold text-brand">Manual Cataloguing</h3>
                        <p className="text-xs text-[var(--sc-muted)] mt-1">
                          Add custom product image, currency, formatted price, and description directly.
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowManualModal(true)}
                        variant="secondary"
                        className="w-full text-xs"
                      >
                        <Plus className="h-4 w-4 mr-1.5 text-brand" />
                        Manual Cataloguing
                      </Button>
                    </div>
                  </div>

                  {/* CSV Diagnostic Output if loaded */}
                  {csvStats && (
                    <div className="space-y-3 pt-3 border-t border-champagne-border text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-brand">{csvFileName}</span>
                        <span className="text-[var(--sc-muted)]">
                          {csvStats.valid} valid imported · {csvStats.errors} flagged
                        </span>
                      </div>
                      {csvErrors.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs space-y-1">
                          <p className="font-bold text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Row-Level Flags:
                          </p>
                          {csvErrors.map((err, i) => (
                            <p key={i} className="text-amber-800">
                              • Row {err.row}: {err.field} — {err.problem}. Action: {err.fix}.
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Products Added List */}
                  {wizardProducts.length > 0 && (
                    <div className="pt-4 border-t border-champagne-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand uppercase tracking-wide">
                          Catalogued Products ({wizardProducts.length})
                        </span>
                        <span className="text-[11px] text-[var(--sc-muted)]">
                          These will be published to your store
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {wizardProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-2.5 rounded-xl border border-champagne-border bg-white flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={p.image_url || p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80'}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-champagne-border"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-brand truncate">{p.name}</p>
                                <p className="text-[11px] font-semibold text-[var(--sc-muted)]">
                                  {formatCurrency(p.price, wizardData.currency || 'INR')}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteWizardProduct(p.id)}
                              className="text-xs text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Product"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Manual Cataloguing Modal */}
                {showManualModal && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="clay-card max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between border-b border-champagne-border pb-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-brand" />
                          <h3 className="font-poppins font-bold text-base text-brand">Manual Cataloguing</h3>
                        </div>
                        <button
                          onClick={() => setShowManualModal(false)}
                          className="text-[var(--sc-muted)] hover:text-brand text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleSaveManualProduct} className="space-y-3">
                        <Input
                          label="Product Name *"
                          required
                          value={manualTitle}
                          onChange={e => setManualTitle(e.target.value)}
                          placeholder="e.g. Handcrafted Ceramic Mug"
                        />

                        {/* Currency Option */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">
                            Currency
                          </label>
                          <div className="relative">
                            <select
                              value={wizardData.currency || 'INR'}
                              onChange={e => patchWizard({ currency: e.target.value })}
                              className="clay-input w-full px-3 py-2 text-xs bg-white font-medium appearance-none pr-8 min-h-[42px]"
                            >
                              {Object.entries(CURRENCY_CONFIG).map(([currKey, conf]) => (
                                <option key={currKey} value={currKey}>
                                  {conf.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="h-3.5 w-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--sc-muted)]" />
                          </div>
                        </div>

                        {/* 1. Product Image */}
                        <ImageUploadControl
                          label="1. Product Image"
                          value={manualImage}
                          onChange={setManualImage}
                        />

                        {/* 2. Price with Auto Comma Place-Value Separation */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">
                            2. Price ({CURRENCY_CONFIG[wizardData.currency || 'INR']?.symbol || '₹'}) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand pointer-events-none">
                              {CURRENCY_CONFIG[wizardData.currency || 'INR']?.symbol || '₹'}
                            </span>
                            <input
                              type="text"
                              required
                              value={manualPriceFormatted}
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9.]/g, '')
                                setManualPrice(raw)
                                if (raw) {
                                  const parts = raw.split('.')
                                  const whole = parts[0]
                                  const decimal = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''
                                  const num = parseFloat(whole)
                                  if (!isNaN(num)) {
                                    const locale = CURRENCY_CONFIG[wizardData.currency || 'INR']?.locale || 'en-IN'
                                    const formattedWhole = new Intl.NumberFormat(locale).format(num)
                                    setManualPriceFormatted(formattedWhole + decimal)
                                  } else {
                                    setManualPriceFormatted(raw)
                                  }
                                } else {
                                  setManualPriceFormatted('')
                                }
                              }}
                              placeholder="e.g. 1,299"
                              className="clay-input w-full pl-8 pr-3 py-2 text-xs font-mono min-h-[42px]"
                            />
                          </div>
                          <p className="text-[10px] text-[var(--sc-muted)]">
                            Auto comma separated for {CURRENCY_CONFIG[wizardData.currency || 'INR']?.code} place values.
                          </p>
                        </div>

                        {/* 3. Description */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">
                            3. Product Description
                          </label>
                          <textarea
                            value={manualDesc}
                            onChange={e => setManualDesc(e.target.value)}
                            rows={3}
                            placeholder="Crafted with care, premium materials, and durable finishes."
                            className="clay-input w-full px-3 py-2 text-xs resize-none"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-champagne-border">
                          <Button type="button" variant="secondary" size="sm" onClick={() => setShowManualModal(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" size="sm" className="font-bold">
                            Save Product
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 4: THEME & LIVE MOBILE PREVIEW (Aligned Layout)
                ══════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <h2 className="font-poppins font-bold text-2xl text-brand">Brand Customiser & Layout</h2>
                  <p className="text-xs text-[var(--sc-muted)]">
                    Pick a premium multi-color theme, position mobile buttons, and fine-tune colors with instant live mobile sync.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                  {/* Left Controls Column */}
                  <div className="w-full lg:w-[460px] space-y-4 flex-shrink-0">

                    {/* Multi-Color Theme Presets */}
                    <Card className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-poppins font-bold text-sm text-brand">
                          Premium Multi-Colour Themes
                        </h3>
                        <button
                          onClick={resetTheme}
                          className="p-1.5 rounded-lg text-[var(--sc-muted)] hover:text-brand"
                          title="Reset to theme defaults"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {THEMES_METADATA.map(theme => {
                          const isSelected = wizardData.theme_id === theme.id
                          return (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => {
                                patchWizard({ theme_id: theme.id })
                                resetTheme()
                              }}
                              className={cn(
                                'p-3 rounded-xl border-2 text-left transition-all min-h-[48px]',
                                isSelected ? 'border-brand bg-brand/10 shadow-sm' : 'border-champagne-border bg-champagne-card hover:border-brand/30'
                              )}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex -space-x-1">
                                  <div className="h-3.5 w-3.5 rounded-full border border-white" style={{ background: theme.accentColor }} />
                                  <div className="h-3.5 w-3.5 rounded-full border border-white" style={{ background: theme.secondaryColor || '#F8E7C9' }} />
                                  {theme.accentHighlight && (
                                    <div className="h-3.5 w-3.5 rounded-full border border-white" style={{ background: theme.accentHighlight }} />
                                  )}
                                </div>
                                <span className={cn('text-xs font-bold truncate', isSelected ? 'text-brand' : 'text-[var(--sc-ink)]')}>
                                  {theme.name}
                                </span>
                                {isSelected && <Check className="h-3.5 w-3.5 ml-auto text-brand shrink-0" />}
                              </div>
                              <p className="text-[10px] text-[var(--sc-muted)] leading-tight line-clamp-1">
                                {theme.tagline}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Mobile Button Placement (Requested Feature) */}
                    <Card className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-poppins font-bold text-sm text-brand flex items-center gap-2">
                          <Sliders className="h-4 w-4" /> Mobile CTA Button Placement
                        </h3>
                      </div>
                      <p className="text-[11px] text-[var(--sc-muted)]">
                        Move the primary shopping call-to-action anywhere on the phone interface.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { key: 'header',   label: 'Header' },
                          { key: 'hero',     label: 'Hero' },
                          { key: 'floating', label: 'Floating' },
                          { key: 'footer',   label: 'Footer' },
                        ].map(({ key, label }) => {
                          const isSelected = (wizardData.theme_overrides?.button?.position || 'hero') === key
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => patchOverrides({
                                button: { ...wizardData.theme_overrides.button, position: key }
                              })}
                              className={cn(
                                'py-2 px-2 text-xs font-semibold rounded-xl border-2 transition-all min-h-[40px]',
                                isSelected ? 'border-brand bg-brand text-champagne' : 'border-champagne-border bg-champagne-card text-[var(--sc-ink)] hover:border-brand/40'
                              )}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Button Shape */}
                    <Card className="p-5 space-y-3">
                      <h3 className="font-poppins font-bold text-sm text-brand">Button Geometry</h3>
                      <div className="flex gap-2">
                        {[
                          { key: 'square',  label: 'Square' },
                          { key: 'rounded', label: 'Rounded' },
                          { key: 'pill',    label: 'Pill' },
                        ].map(({ key, label }) => {
                          const isSelected = (wizardData.theme_overrides?.button?.radius || 'rounded') === key
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => patchOverrides({
                                button: { ...wizardData.theme_overrides.button, radius: key }
                              })}
                              className={cn(
                                'flex-1 py-2 text-xs font-semibold border-2 transition-all min-h-[40px] rounded-xl',
                                isSelected ? 'border-brand bg-brand text-champagne' : 'border-champagne-border bg-champagne-card text-[var(--sc-ink)] hover:border-brand/40'
                              )}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Color Swatches */}
                    <Card className="p-5 space-y-4">
                      <h3 className="font-poppins font-bold text-sm text-brand flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Multi-Colour Customization
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ColorControl
                          label="Primary / Button"
                          value={ov.primary || currentThemePreset.primary}
                          onChange={v => setColor('primary', v)}
                          onReset={() => setColor('primary', '')}
                        />
                        <ColorControl
                          label="Page Background"
                          value={ov.background || currentThemePreset.bg}
                          onChange={v => setColor('background', v)}
                          onReset={() => setColor('background', '')}
                        />
                        <ColorControl
                          label="Card Surface"
                          value={ov.surface || currentThemePreset.surface}
                          onChange={v => setColor('surface', v)}
                          onReset={() => setColor('surface', '')}
                        />
                        <ColorControl
                          label="Headings"
                          value={ov.heading || currentThemePreset.heading}
                          onChange={v => setColor('heading', v)}
                          onReset={() => setColor('heading', '')}
                        />
                      </div>
                    </Card>

                    {/* Typography */}
                    <Card className="p-5 space-y-3">
                      <h3 className="font-poppins font-bold text-sm text-brand">Typography Pairing</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">Heading Font</label>
                          <select
                            value={wizardData.theme_overrides?.fonts?.heading || ''}
                            onChange={e => patchOverrides({ fonts: { ...wizardData.theme_overrides.fonts, heading: e.target.value } })}
                            className="clay-input w-full px-3 py-2 text-xs min-h-[40px]"
                          >
                            <option value="">Theme Default</option>
                            {HEADING_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">Body Font</label>
                          <select
                            value={wizardData.theme_overrides?.fonts?.body || ''}
                            onChange={e => patchOverrides({ fonts: { ...wizardData.theme_overrides.fonts, body: e.target.value } })}
                            className="clay-input w-full px-3 py-2 text-xs min-h-[40px]"
                          >
                            <option value="">Theme Default</option>
                            {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Right Column: Live Phone Preview */}
                  <div className="flex-1 flex flex-col items-center gap-3 sticky top-24 w-full">
                    <div className="flex gap-1 bg-champagne-card border border-champagne-border rounded-xl p-1">
                      {['home', 'product', 'cart'].map(p => (
                        <button
                          key={p}
                          onClick={() => setPreviewPage(p)}
                          className={cn(
                            'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize min-h-[36px]',
                            previewPage === p ? 'bg-brand text-champagne' : 'text-[var(--sc-muted)] hover:text-brand'
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <span className="text-[11px] font-bold text-[var(--sc-muted)] uppercase tracking-wider">
                      Live Storefront Mobile Preview
                    </span>

                    <LivePhonePreview
                      themeId={wizardData.theme_id}
                      storeName={wizardData.name}
                      tagline={wizardData.tagline}
                      categoryNames={wizardData.categories}
                      themeOverrides={wizardData.theme_overrides}
                      previewPage={previewPage}
                      logoUrl={wizardData.logo_url}
                      products={wizardProducts}
                      currency={wizardData.currency || 'INR'}
                    />

                    <p className="text-[10px] text-[var(--sc-muted)] text-center max-w-[280px]">
                      Changes to themes and button positions reflect immediately in the mobile viewport.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 5: REVIEW & PUBLISH (No Emojis)
                ══════════════════════════════════════════════════ */}
            {currentStep === 5 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="font-poppins font-bold text-base text-brand">Review & Publish</h2>
                    <p className="text-xs text-[var(--sc-muted)] mt-1">
                      Confirm store specifications before generating your live production URL.
                    </p>
                  </div>

                  <div className="divide-y divide-champagne-border text-xs">
                    {[
                      ['Store Name', wizardData.name || 'StoreKraft Store'],
                      ['Store URL', `/s/${wizardData.slug || 'storekraft-store'}`],
                      ['Theme Aesthetic', wizardData.theme_id?.toUpperCase()],
                      ['Button Placement', wizardData.theme_overrides?.button?.position || 'Hero'],
                      ['Curated Categories', wizardData.categories.join(', ') || 'General'],
                      ['Catalog Items', `${wizardData.importedProductsCount || 8} items ready`],
                    ].map(([label, val]) => (
                      <div key={label} className="py-2.5 flex justify-between">
                        <span className="text-[var(--sc-muted)]">{label}:</span>
                        <span className="font-semibold text-brand truncate ml-4">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-brand/10 border border-brand/20 text-xs text-brand">
                    Publishing activates your public URL and provisions your merchant administration portal.
                  </div>
                </Card>
              </div>
            )}

            {/* ── Sticky Navigation Bar ── */}
            <div className="sticky bottom-4 z-30 max-w-2xl mx-auto clay-card px-4 py-3 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>

              {currentStep < 5 ? (
                <Button
                  size="sm"
                  onClick={() => {
                    if (currentStep === 1) handleStep1Next()
                    else setCurrentStep(p => Math.min(5, p + 1))
                  }}
                >
                  Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleLaunchStore}
                  className="bg-brand font-bold"
                >
                  Launch Store Now
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
