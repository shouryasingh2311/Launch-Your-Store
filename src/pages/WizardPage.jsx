import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { HexColorPicker } from 'react-colorful'
import {
  Sparkles, Check, ArrowRight, ArrowLeft, Upload,
  FileSpreadsheet, AlertTriangle, ExternalLink, Copy,
  CheckCircle2, QrCode, RotateCcw, Image, ChevronDown,
  Palette, Monitor, Smartphone, RefreshCw
} from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { PREDEFINED_CATEGORIES, THEMES_METADATA, getAISetupSuggestions } from '../lib/mockData'
import { LivePhonePreview } from '../components/wizard/LivePhonePreview'
import { useStoreData } from '../store/useStoreData'
import { api } from '../lib/api'
import confetti from 'canvas-confetti'
import { cn } from '../lib/utils'

// ── Default theme overrides (empty = base theme) ──────────
const defaultOverrides = () => ({
  colors: {},
  background: { type: 'solid', color: '', gradient: { from: '', to: '', angle: 135 }, heroImageUrl: '' },
  button: { radius: 'rounded', style: 'filled', shadow: true },
  fonts: { heading: '', body: '' }
})

// ── Follow-up questions for AI Discovery ─────────────────
const FOLLOWUP_QUESTIONS = [
  {
    id: 'what_sell',
    question: 'What do you mainly sell?',
    chips: ['Clothes & Accessories', 'Home Decor', 'Food & Groceries', 'Electronics', 'Beauty & Wellness', 'Handmade Crafts']
  },
  {
    id: 'who_customer',
    question: 'Who are your main customers?',
    chips: ['General public', 'Young adults (18–30)', 'Families', 'Businesses', 'Gift shoppers']
  },
  {
    id: 'vibe',
    question: 'What vibe best describes your brand?',
    chips: ['Clean & minimal', 'Bold & vibrant', 'Luxury & elegant', 'Fun & colourful', 'Dark & premium']
  },
  {
    id: 'store_name',
    question: 'Do you have a store name in mind?',
    chips: ['Not yet — suggest one', 'Yes, I\'ll type it below']
  }
]

const HEADING_FONTS = ['Poppins', 'Inter', 'Playfair Display', 'Space Grotesk', 'Lato', 'Montserrat']
const BODY_FONTS = ['Inter', 'Poppins', 'Lato', 'Space Grotesk', 'Open Sans', 'Roboto']

// ── Contrast ratio checker (WCAG) ────────────────────────
function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const toLinear = c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const light = Math.max(l1, l2)
  const dark = Math.min(l1, l2)
  return (light + 0.05) / (dark + 0.05)
}

function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

// ── Color picker control ──────────────────────────────────
function ColorControl({ label, value, onChange, contrastWith, onReset }) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(value || '')
  const ref = useRef(null)

  useEffect(() => { setHexInput(value || '') }, [value])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const hasContrast = contrastWith && isValidHex(value) && isValidHex(contrastWith)
  const ratio = hasContrast ? contrastRatio(value, contrastWith) : null
  const contrastFail = ratio !== null && ratio < 4.5

  return (
    <div className="space-y-1.5" ref={ref}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">{label}</label>
        <div className="flex items-center gap-1">
          {contrastFail && (
            <span className="text-[10px] text-orange-700 bg-orange-100 rounded px-1.5 py-0.5 font-medium">
              Contrast {ratio.toFixed(1)}:1 ⚠
            </span>
          )}
          {onReset && (
            <button onClick={onReset} className="text-[var(--sc-muted)] hover:text-[var(--sc-ink)] p-1 rounded" title="Reset to theme default">
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
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

// ── Image Upload control ──────────────────────────────────
function ImageUploadControl({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const handleFile = async (file) => {
    setIsUploading(true)
    try {
      const dataUrl = await api.uploadImage(file)
      onChange(dataUrl)
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
            <Image className="h-8 w-8 opacity-50" />
            <span className="text-xs">Click or drag to upload</span>
            <span className="text-[10px]">JPEG, PNG, WebP — max 5 MB</span>
          </div>
        )}
        {isUploading && <span className="text-xs text-brand">Uploading…</span>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }} />
      {value && (
        <button onClick={() => onChange('')} className="text-[10px] text-[var(--sc-muted)] hover:text-[var(--sc-danger)]">
          Remove image
        </button>
      )}
    </div>
  )
}

// ── Main WizardPage ───────────────────────────────────────
export function WizardPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateStore, importDummyProducts } = useStoreData()

  const [currentStep, setCurrentStep] = useState(1)

  // ── Step 1: AI Discovery state ────────────────────────
  const [discoveryPhase, setDiscoveryPhase] = useState('input') // 'input' | 'questions' | 'done'
  const [aiPrompt, setAiPrompt] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [followupIndex, setFollowupIndex] = useState(0)
  const [followupAnswers, setFollowupAnswers] = useState({})
  const [freeTextAnswer, setFreeTextAnswer] = useState('')

  // ── Wizard data ──────────────────────────────────────
  const [wizardData, setWizardData] = useState(() => {
    try {
      const saved = localStorage.getItem('sc_wizard_draft')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      name: '',
      slug: '',
      tagline: '',
      business_type: '',
      contact_email: '',
      phone: '',
      address: '',
      logo_url: '',
      categories: [],
      theme_id: 'minimal',
      theme_overrides: defaultOverrides(),
      importedProductsCount: 0
    }
  })

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem('sc_wizard_draft', JSON.stringify(wizardData))
  }, [wizardData])

  const patchWizard = useCallback((patch) => setWizardData(prev => ({ ...prev, ...patch })), [])
  const patchOverrides = useCallback((patch) => {
    setWizardData(prev => ({
      ...prev,
      theme_overrides: { ...prev.theme_overrides, ...patch }
    }))
  }, [])

  // ── Step 1: Send initial prompt ──────────────────────
  const handleStartDiscovery = async () => {
    if (!aiPrompt.trim()) return
    setIsAiLoading(true)
    try {
      // Try real API first
      const suggestions = await api.getAISetupSuggestions(aiPrompt)
      if (suggestions?.categories) {
        applyAISuggestions(suggestions)
        setDiscoveryPhase('done')
        setIsAiLoading(false)
        return
      }
    } catch {
      // fall through to follow-up questions
    }
    setIsAiLoading(false)
    setDiscoveryPhase('questions')
    setFollowupIndex(0)
  }

  const applyAISuggestions = (suggestions) => {
    patchWizard({
      tagline: suggestions.tagline || wizardData.tagline,
      theme_id: suggestions.theme_id || wizardData.theme_id,
      categories: (suggestions.categories || []).map(c => typeof c === 'string' ? c : c.name)
    })
  }

  // ── Step 1: Answer a follow-up question ──────────────
  const handleChipAnswer = (qid, answer) => {
    const updated = { ...followupAnswers, [qid]: answer }
    setFollowupAnswers(updated)
    if (followupIndex < FOLLOWUP_QUESTIONS.length - 1) {
      setFollowupIndex(i => i + 1)
    } else {
      finishFollowup(updated)
    }
  }

  const handleFreeTextNext = () => {
    if (!freeTextAnswer.trim()) return
    const q = FOLLOWUP_QUESTIONS[followupIndex]
    const updated = { ...followupAnswers, [q.id]: freeTextAnswer }
    setFollowupAnswers(updated)
    setFreeTextAnswer('')
    if (followupIndex < FOLLOWUP_QUESTIONS.length - 1) {
      setFollowupIndex(i => i + 1)
    } else {
      finishFollowup(updated)
    }
  }

  const finishFollowup = (answers) => {
    setIsAiLoading(true)
    setTimeout(() => {
      const combinedPrompt = `${aiPrompt}. ${Object.values(answers).join('. ')}`
      const suggestions = getAISetupSuggestions(combinedPrompt)
      const storeName = answers.store_name && !answers.store_name.toLowerCase().includes('suggest')
        ? answers.store_name
        : suggestions.name || ''
      applyAISuggestions(suggestions)
      if (storeName) {
        patchWizard({
          name: storeName,
          slug: storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        })
      }
      setIsAiLoading(false)
      setDiscoveryPhase('done')
      toast.success('Store drafted!', 'AI pre-filled your categories, tagline and theme. Edit anything below.')
    }, 600)
  }

  // ── Category toggle ──────────────────────────────────
  const toggleCategory = (name) => {
    setWizardData(prev => {
      const exists = prev.categories.includes(name)
      return {
        ...prev,
        categories: exists ? prev.categories.filter(c => c !== name) : [...prev.categories, name]
      }
    })
  }
  const [customCat, setCustomCat] = useState('')

  // ── Dummy import ─────────────────────────────────────
  const [isImporting, setIsImporting] = useState(false)
  const handleImportDummy = () => {
    setIsImporting(true)
    setTimeout(() => {
      const count = importDummyProducts()
      patchWizard({ importedProductsCount: count })
      setIsImporting(false)
      toast.success('Catalog seeded!', `${count} demo products added with images and INR prices.`)
    }, 500)
  }

  // ── CSV ──────────────────────────────────────────────
  const [csvFile, setCsvFile] = useState(null)
  const [csvPreviewRows, setCsvPreviewRows] = useState(null)
  const [csvErrors, setCsvErrors] = useState([])
  const handleSimulateCsvUpload = () => {
    setCsvFile({ name: 'catalog_export_v1.csv' })
    setCsvPreviewRows([
      { row: 1, name: 'Handcrafted Ceramic Mug', price: '₹799', stock: '25', category: 'Home Decor' },
      { row: 2, name: 'Artisan Linen Apron',     price: '₹1,299', stock: '14', category: 'Fashion' },
      { row: 3, name: 'Scented Candle Amber',    price: 'Rs. 450', stock: 'Invalid', category: 'Home Decor' },
      { row: 4, name: '',                         price: '₹899',  stock: '10', category: 'Gourmet' }
    ])
    setCsvErrors([
      { row: 3, field: 'Stock', problem: "Non-integer 'Invalid'", fix: 'Set to 0 or valid integer' },
      { row: 4, field: 'Name',  problem: 'Required field missing', fix: 'Row skipped' }
    ])
    toast.info('CSV analysed', '4 rows inspected: 2 valid, 2 fixable errors.')
  }

  // ── Theme customiser: undo/redo stack ────────────────
  const [history, setHistory] = useState([defaultOverrides()])
  const [historyIdx, setHistoryIdx] = useState(0)
  const pushHistory = (overrides) => {
    const next = history.slice(0, historyIdx + 1)
    next.push(overrides)
    setHistory(next)
    setHistoryIdx(next.length - 1)
  }
  const undo = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1
      setHistoryIdx(idx)
      patchOverrides(history[idx])
    }
  }
  const redo = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1
      setHistoryIdx(idx)
      patchOverrides(history[idx])
    }
  }

  const setColor = (key, val) => {
    const next = {
      ...wizardData.theme_overrides,
      colors: { ...wizardData.theme_overrides.colors, [key]: val }
    }
    patchOverrides(next)
    pushHistory(next)
  }

  const resetColor = (key) => setColor(key, '')
  const resetTheme = () => {
    const fresh = defaultOverrides()
    patchOverrides(fresh)
    pushHistory(fresh)
  }

  // Preview page switcher
  const [previewPage, setPreviewPage] = useState('home')

  // ── Launch ───────────────────────────────────────────
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
      logo_url: wizardData.logo_url,
      theme_id: wizardData.theme_id,
      theme_overrides: wizardData.theme_overrides
    })
    setIsLaunched(true)
    localStorage.removeItem('sc_wizard_draft')
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } })
    } catch {}
  }

  const STEPS = ['Make your own', 'Categories', 'Products', 'Theme', 'Launch']

  // ── Current theme's base CSS vars for preview ────────
  const themeColors = {
    minimal:  { primary: '#18181b', bg: '#ffffff' },
    vibrant:  { primary: '#d946ef', bg: '#fdf4ff' },
    elegant:  { primary: '#7c3aed', bg: '#f9f6f0' },
    midnight: { primary: '#14b8a6', bg: '#090d16' },
  }
  const base = themeColors[wizardData.theme_id] || themeColors.minimal
  const ov = wizardData.theme_overrides?.colors || {}

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Sticky header with progress ──────────────────── */}
      <header className="sticky top-0 z-40 bg-champagne-card/90 backdrop-blur-md border-b border-champagne-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand text-champagne flex items-center justify-center font-black text-sm">
              SC
            </div>
            <div>
              <h1 className="font-poppins text-sm font-bold text-brand leading-tight">Storecraft Wizard</h1>
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
                  i + 1 < currentStep  ? 'bg-brand w-8 sm:w-10' :
                  i + 1 === currentStep ? 'bg-brand/60 w-8 sm:w-10' :
                                          'bg-champagne-border w-5 sm:w-7'
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ── Main body ────────────────────────────────────── */}
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
                <span className="font-semibold text-brand">{wizardData.name}</span> is now published and accepting orders.
              </p>
            </div>
            <div className="p-4 clay-card space-y-3">
              <span className="text-xs font-bold uppercase tracking-wide text-brand block">Your public store link</span>
              <div className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-champagne-border">
                <code className="text-xs font-mono font-bold text-brand truncate flex-1">
                  {window.location.origin}/s/{wizardData.slug}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/s/${wizardData.slug}`); toast.success('Copied!', '') }}
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

            {/* ════════════════════════════════
                STEP 1: Make your own (AI)
                ════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto">

                {discoveryPhase === 'input' && (
                  <Card className="p-6 sm:p-8 space-y-5">
                    <div className="space-y-1">
                      <h2 className="font-poppins font-bold text-xl text-brand">What kind of store do you want to create?</h2>
                      <p className="text-sm text-[var(--sc-muted)]">
                        One line is all it takes. We'll ask a few quick questions, then draft everything for you.
                      </p>
                    </div>

                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleStartDiscovery() }}
                      placeholder="e.g. I sell handmade ceramic mugs and soy candles for home décor lovers"
                      rows={3}
                      className="clay-input w-full px-4 py-3 text-sm resize-none"
                      aria-label="Describe your business"
                    />

                    <div className="flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => { setDiscoveryPhase('done'); setCurrentStep(1) }}
                        className="text-xs text-[var(--sc-muted)] hover:text-brand underline-offset-2 hover:underline"
                      >
                        Skip — I'll fill it in myself
                      </button>
                      <Button
                        onClick={handleStartDiscovery}
                        isLoading={isAiLoading}
                        disabled={!aiPrompt.trim()}
                      >
                        <Sparkles className="h-4 w-4 mr-1.5" />
                        Let's go
                      </Button>
                    </div>
                  </Card>
                )}

                {discoveryPhase === 'questions' && (
                  <Card className="p-6 sm:p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono text-[var(--sc-muted)]">
                          Question {followupIndex + 1} of {FOLLOWUP_QUESTIONS.length}
                        </span>
                        <h2 className="font-poppins font-bold text-lg text-brand mt-1">
                          {FOLLOWUP_QUESTIONS[followupIndex].question}
                        </h2>
                      </div>
                      <button
                        onClick={() => { setDiscoveryPhase('done') }}
                        className="text-xs text-[var(--sc-muted)] hover:text-brand underline-offset-2 hover:underline shrink-0"
                      >
                        Skip questions
                      </button>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-1.5">
                      {FOLLOWUP_QUESTIONS.map((_, i) => (
                        <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all', i <= followupIndex ? 'bg-brand' : 'bg-champagne-border')} />
                      ))}
                    </div>

                    {/* Quick-reply chips */}
                    <div className="flex flex-wrap gap-2">
                      {FOLLOWUP_QUESTIONS[followupIndex].chips.map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleChipAnswer(FOLLOWUP_QUESTIONS[followupIndex].id, chip)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold border-2 border-champagne-border bg-champagne-card text-[var(--sc-ink)] hover:border-brand hover:bg-brand hover:text-champagne transition-all min-h-[44px]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Free-text option */}
                    <div className="flex gap-2 pt-2 border-t border-champagne-border">
                      <input
                        type="text"
                        value={freeTextAnswer}
                        onChange={e => setFreeTextAnswer(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleFreeTextNext() }}
                        placeholder="Or type your own answer…"
                        className="clay-input flex-1 px-3.5 py-2 text-sm min-h-[44px]"
                        aria-label="Custom answer"
                      />
                      <Button size="sm" onClick={handleFreeTextNext} disabled={!freeTextAnswer.trim()}>
                        Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </Card>
                )}

                {/* done state → show and edit the pre-filled form */}
                {(discoveryPhase === 'done' || discoveryPhase === 'input') && discoveryPhase !== 'questions' && (
                  <Card className="p-6 space-y-4">
                    {discoveryPhase === 'done' && (
                      <div className="p-3 rounded-xl bg-brand/8 border border-brand/20 text-xs text-brand font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        AI pre-filled your store. Review and edit anything below.
                      </div>
                    )}

                    <h2 className="font-poppins font-bold text-base text-brand">Store Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Store Name"
                        required
                        value={wizardData.name}
                        onChange={e => patchWizard({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                      />
                      <Input
                        label="Store Slug (URL)"
                        required
                        value={wizardData.slug}
                        onChange={e => patchWizard({ slug: e.target.value })}
                        helperText={`Live URL: /s/${wizardData.slug}`}
                      />
                    </div>

                    <Input
                      label="Store Tagline"
                      value={wizardData.tagline}
                      onChange={e => patchWizard({ tagline: e.target.value })}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Contact Email" type="email" value={wizardData.contact_email} onChange={e => patchWizard({ contact_email: e.target.value })} />
                      <Input label="Support Phone"               value={wizardData.phone}         onChange={e => patchWizard({ phone: e.target.value })} />
                    </div>

                    <Input label="Physical Address" value={wizardData.address} onChange={e => patchWizard({ address: e.target.value })} />

                    {/* Logo upload */}
                    <ImageUploadControl
                      label="Business Logo"
                      value={wizardData.logo_url}
                      onChange={url => patchWizard({ logo_url: url })}
                    />
                  </Card>
                )}
              </div>
            )}

            {/* ════════════════════════════════
                STEP 2: Categories
                ════════════════════════════════ */}
            {currentStep === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="font-poppins font-bold text-base text-brand">Select Store Categories</h2>
                    <p className="text-xs text-[var(--sc-muted)] mt-1">Pick relevant categories or add your own.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {PREDEFINED_CATEGORIES.map(cat => {
                      const isSelected = wizardData.categories.includes(cat.name)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={cn(
                            'px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all flex items-center gap-1.5 min-h-[44px]',
                            isSelected
                              ? 'bg-brand text-champagne border-brand shadow-clay-btn'
                              : 'bg-champagne-card text-[var(--sc-ink)] border-champagne-border hover:border-brand/40'
                          )}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 ml-1" />}
                        </button>
                      )
                    })}
                  </div>
                  <div className="pt-3 border-t border-champagne-border flex gap-2">
                    <input
                      type="text"
                      value={customCat}
                      onChange={e => setCustomCat(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && customCat.trim()) { toggleCategory(customCat.trim()); setCustomCat('') } }}
                      placeholder="Add custom category (e.g. Eco Crafts)"
                      className="clay-input flex-1 px-3.5 py-2 text-xs min-h-[44px]"
                      aria-label="Custom category name"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => { if (customCat.trim()) { toggleCategory(customCat.trim()); setCustomCat('') } }}
                    >
                      + Add
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* ════════════════════════════════
                STEP 3: Products
                ════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <Card className="p-6 space-y-6">
                  <div>
                    <h2 className="font-poppins font-bold text-base text-brand">Product Catalog Setup</h2>
                    <p className="text-xs text-[var(--sc-muted)] mt-1">Seed with demo products or upload your CSV catalog.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option A */}
                    <div className="clay-card p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="indigo" size="sm" className="mb-2">Recommended</Badge>
                        <h3 className="text-sm font-bold text-brand">Instant Demo Products</h3>
                        <p className="text-xs text-[var(--sc-muted)] mt-1">
                          Seed 8 realistic products with photos, descriptions and INR pricing.
                        </p>
                      </div>
                      <Button onClick={handleImportDummy} isLoading={isImporting} className="w-full">
                        ⚡ Seed Catalog ({wizardData.importedProductsCount || 8} items)
                      </Button>
                    </div>
                    {/* Option B */}
                    <div className="clay-card p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <Badge variant="default" size="sm" className="mb-2">Bulk Upload</Badge>
                        <h3 className="text-sm font-bold text-brand">Upload CSV / Excel Sheet</h3>
                        <p className="text-xs text-[var(--sc-muted)] mt-1">
                          Auto column mapping with row-level error reporting.
                        </p>
                      </div>
                      <Button onClick={handleSimulateCsvUpload} variant="secondary" className="w-full">
                        <FileSpreadsheet className="h-4 w-4 mr-1.5 text-brand" />
                        Upload & Validate CSV
                      </Button>
                    </div>
                  </div>

                  {csvPreviewRows && (
                    <div className="space-y-3 pt-3 border-t border-champagne-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-brand">{csvFile?.name}</span>
                        <span className="text-[var(--sc-muted)]">✓ 2 valid · ⚠ 2 fixable</span>
                      </div>
                      {csvErrors.length > 0 && (
                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs space-y-1">
                          <p className="font-bold text-orange-900 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-orange-600" /> Row-Level Errors:
                          </p>
                          {csvErrors.map((err, i) => (
                            <p key={i} className="text-orange-800">
                              • Row {err.row}: {err.field} — {err.problem}. Fix: {err.fix}.
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ════════════════════════════════
                STEP 4: Theme Customiser
                ════════════════════════════════ */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {/* Mobile: preview on top, collapsible */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                  {/* ── Controls panel ── */}
                  <div className="w-full lg:w-[420px] space-y-4 flex-shrink-0">

                    {/* Base theme selector */}
                    <Card className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="font-poppins font-bold text-base text-brand">Theme & Customise</h2>
                        <div className="flex gap-1">
                          <button
                            onClick={undo}
                            disabled={historyIdx === 0}
                            className="p-1.5 rounded-lg text-[var(--sc-muted)] hover:text-brand disabled:opacity-30"
                            title="Undo"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={redo}
                            disabled={historyIdx === history.length - 1}
                            className="p-1.5 rounded-lg text-[var(--sc-muted)] hover:text-brand disabled:opacity-30"
                            title="Redo"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={resetTheme}
                            className="p-1.5 rounded-lg text-[var(--sc-muted)] hover:text-brand"
                            title="Reset all to theme defaults"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {THEMES_METADATA.map(theme => {
                          const isSelected = wizardData.theme_id === theme.id
                          return (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => { patchWizard({ theme_id: theme.id }); resetTheme() }}
                              className={cn(
                                'p-3 rounded-xl border-2 text-left transition-all min-h-[44px]',
                                isSelected ? 'border-brand bg-brand/8' : 'border-champagne-border bg-champagne-card hover:border-brand/30'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full shrink-0" style={{ background: themeColors[theme.id]?.primary }} />
                                <span className={cn('text-xs font-semibold', isSelected ? 'text-brand' : 'text-[var(--sc-ink)]')}>
                                  {theme.name}
                                </span>
                                {isSelected && <Check className="h-3.5 w-3.5 ml-auto text-brand" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Colors */}
                    <Card className="p-5 space-y-4">
                      <h3 className="font-poppins font-semibold text-sm text-brand flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Colours
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ColorControl label="Primary button"      value={ov.primary || base.primary}          onChange={v => setColor('primary', v)}          onReset={() => resetColor('primary')} />
                        <ColorControl label="Button text"         value={ov.primaryText || '#ffffff'}         onChange={v => setColor('primaryText', v)}       onReset={() => resetColor('primaryText')} contrastWith={ov.primary || base.primary} />
                        <ColorControl label="Page background"     value={ov.background || base.bg}           onChange={v => setColor('background', v)}        onReset={() => resetColor('background')} />
                        <ColorControl label="Card surface"        value={ov.surface || '#ffffff'}            onChange={v => setColor('surface', v)}           onReset={() => resetColor('surface')} />
                        <ColorControl label="Heading text"        value={ov.heading || '#09090b'}            onChange={v => setColor('heading', v)}           onReset={() => resetColor('heading')} contrastWith={ov.background || base.bg} />
                        <ColorControl label="Body text"           value={ov.text || '#3f3f46'}               onChange={v => setColor('text', v)}              onReset={() => resetColor('text')} contrastWith={ov.background || base.bg} />
                        <ColorControl label="Price / accent"      value={ov.price || ov.primary || base.primary} onChange={v => setColor('price', v)}         onReset={() => resetColor('price')} />
                        <ColorControl label="Border"              value={ov.border || '#e4e4e7'}             onChange={v => setColor('border', v)}            onReset={() => resetColor('border')} />
                      </div>
                    </Card>

                    {/* Button shape */}
                    <Card className="p-5 space-y-3">
                      <h3 className="font-poppins font-semibold text-sm text-brand">Button Shape</h3>
                      <div className="flex gap-2">
                        {[
                          { key: 'square',  label: 'Square',  css: '0px' },
                          { key: 'rounded', label: 'Rounded', css: '10px' },
                          { key: 'pill',    label: 'Pill',    css: '999px' },
                        ].map(({ key, label }) => {
                          const isSelected = (wizardData.theme_overrides?.button?.radius || 'rounded') === key
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => patchOverrides({ button: { ...wizardData.theme_overrides.button, radius: key } })}
                              className={cn(
                                'flex-1 py-2 text-xs font-semibold border-2 transition-all min-h-[44px]',
                                key === 'square'  ? 'rounded-sm' : key === 'pill' ? 'rounded-full' : 'rounded-xl',
                                isSelected ? 'border-brand bg-brand text-champagne' : 'border-champagne-border text-[var(--sc-ink)] hover:border-brand/40'
                              )}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </Card>

                    {/* Fonts */}
                    <Card className="p-5 space-y-3">
                      <h3 className="font-poppins font-semibold text-sm text-brand">Fonts</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">Heading</label>
                          <select
                            value={wizardData.theme_overrides?.fonts?.heading || ''}
                            onChange={e => patchOverrides({ fonts: { ...wizardData.theme_overrides.fonts, heading: e.target.value } })}
                            className="clay-input w-full px-3 py-2 text-sm min-h-[44px]"
                            aria-label="Heading font"
                          >
                            <option value="">Theme default</option>
                            {HEADING_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">Body</label>
                          <select
                            value={wizardData.theme_overrides?.fonts?.body || ''}
                            onChange={e => patchOverrides({ fonts: { ...wizardData.theme_overrides.fonts, body: e.target.value } })}
                            className="clay-input w-full px-3 py-2 text-sm min-h-[44px]"
                            aria-label="Body font"
                          >
                            <option value="">Theme default</option>
                            {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* Hero image upload */}
                    <Card className="p-5 space-y-3">
                      <h3 className="font-poppins font-semibold text-sm text-brand flex items-center gap-2">
                        <Image className="h-4 w-4" /> Hero Image
                      </h3>
                      <ImageUploadControl
                        label="Hero / Banner Image"
                        value={wizardData.theme_overrides?.background?.heroImageUrl || ''}
                        onChange={url => patchOverrides({
                          background: { ...wizardData.theme_overrides.background, heroImageUrl: url }
                        })}
                      />
                    </Card>
                  </div>

                  {/* ── Live phone preview ── */}
                  <div className="flex-1 flex flex-col items-center gap-3 sticky top-24">
                    {/* Preview page switcher */}
                    <div className="flex gap-1 bg-champagne-card border border-champagne-border rounded-xl p-1">
                      {['home', 'product', 'cart'].map(p => (
                        <button
                          key={p}
                          onClick={() => setPreviewPage(p)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize min-h-[36px]',
                            previewPage === p ? 'bg-brand text-champagne' : 'text-[var(--sc-muted)] hover:text-brand'
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[var(--sc-muted)] uppercase tracking-wider">Live Preview</span>
                    <LivePhonePreview
                      themeId={wizardData.theme_id}
                      storeName={wizardData.name}
                      tagline={wizardData.tagline}
                      categoryNames={wizardData.categories}
                      themeOverrides={wizardData.theme_overrides}
                      previewPage={previewPage}
                      logoUrl={wizardData.logo_url}
                    />
                    <p className="text-[10px] text-[var(--sc-muted)] text-center max-w-[280px]">
                      Preview updates instantly. Changes persist to your live store.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════
                STEP 5: Review & Launch
                ════════════════════════════════ */}
            {currentStep === 5 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="font-poppins font-bold text-base text-brand">Review & Launch</h2>
                    <p className="text-xs text-[var(--sc-muted)] mt-1">Check everything before publishing your store.</p>
                  </div>
                  <div className="divide-y divide-champagne-border text-xs">
                    {[
                      ['Store Name', wizardData.name],
                      ['Store URL', `/s/${wizardData.slug}`],
                      ['Theme', wizardData.theme_id],
                      ['Categories', wizardData.categories.join(', ') || 'None selected'],
                      ['Products Ready', `${wizardData.importedProductsCount || 8} items`],
                    ].map(([label, val]) => (
                      <div key={label} className="py-2.5 flex justify-between">
                        <span className="text-[var(--sc-muted)]">{label}:</span>
                        <span className="font-semibold text-brand truncate ml-4">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-brand/8 border border-brand/20 text-xs text-brand">
                    Clicking <strong>Launch Store Now</strong> publishes your live storefront link immediately.
                  </div>
                </Card>
              </div>
            )}

            {/* ── Sticky nav bar ── */}
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
                  onClick={() => setCurrentStep(p => Math.min(5, p + 1))}
                >
                  Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleLaunchStore}
                  className="bg-brand"
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
