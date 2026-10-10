/**
 * Intelligent AI Store Discovery & Analysis Engine for StoreKraft
 * Dynamically analyzes merchant descriptions and produces cohesive,
 * premium store branding, tailored categories, taglines, and color palettes.
 */

const NICHE_PROFILES = [
  {
    keywords: ['coffee', 'roast', 'cafe', 'espresso', 'brew', 'beans', 'tea', 'matcha', 'bakery', 'pastry'],
    categoryPool: ['Single Origin Coffee', 'Specialty Blends', 'Cold Brew & Cans', 'Brewing Equipment', 'Artisanal Beans', 'Mugs & Tumblers'],
    namePrefixes: ['Velvet', 'Atlas', 'Ember', 'North', 'Craft', 'Ritual', 'Apex'],
    nameSuffixes: ['Roastery', 'Coffee Co.', 'Brew Lab', 'Botanical Bakes', 'Supply & Co.'],
    taglines: [
      'Artisanal small-batch coffee and curated essentials roasted for perfection.',
      'Sustainably sourced single origins crafted for the modern daily ritual.',
      'Distinctive flavours roasted with obsession, delivered directly to your doorstep.'
    ],
    theme: 'elegant',
    colors: { primary: '#064E3B', primaryText: '#F8E7C9', background: '#FDFBF7', surface: '#FFFDF9', heading: '#064E3B', text: '#2D3748', price: '#B45309' }
  },
  {
    keywords: ['ceramic', 'pottery', 'clay', 'mug', 'vase', 'plate', 'handmade', 'artisan', 'craft', 'decor', 'candle', 'home'],
    categoryPool: ['Hand-thrown Tableware', 'Sculptural Vases', 'Artisan Drinkware', 'Soy & Beeswax Candles', 'Home Accents', 'Studio Limited Sets'],
    namePrefixes: ['Terra', 'Nordic', 'Clay', 'Form', 'Haven', 'Studio', 'Ochre'],
    nameSuffixes: ['Ceramics', 'Atelier', 'Craft Studio', 'Living Goods', 'Home Workshop'],
    taglines: [
      'Thoughtfully crafted objects and functional ceramics made to endure.',
      'Handcrafted tactile ceramics and serene living accents for modern sanctuaries.',
      'Timeless ceramic artistry celebrating simple, intentional living.'
    ],
    theme: 'elegant',
    colors: { primary: '#14532D', primaryText: '#FFFFFF', background: '#F8E7C9', surface: '#FFFDF6', heading: '#14532D', text: '#3E4C41', price: '#B45309' }
  },
  {
    keywords: ['clothing', 'clothes', 'fashion', 'streetwear', 'apparel', 'hoodie', 'tshirt', 'wear', 'outfit', 'jacket', 'sneaker', 'shoes'],
    categoryPool: ['Heavyweight Hoodies', 'Graphic Outerwear', 'Tailored Pants', 'Footwear & Runners', 'Caps & Beanies', 'Seasonal Drops'],
    namePrefixes: ['Kinetics', 'Vanguard', 'District', 'Monochrome', 'Epoch', 'Overcast', 'Studio'],
    nameSuffixes: ['Apparel', 'Garments', 'Streetwear', 'Project', 'Supply', 'Label'],
    taglines: [
      'Architectural silhouettes and premium heavyweight garments engineered for the street.',
      'Modern utilitarian apparel designed for effortless daily rotation.',
      'Limited production contemporary streetwear without compromise.'
    ],
    theme: 'midnight',
    colors: { primary: '#0D9488', primaryText: '#FFFFFF', background: '#0F172A', surface: '#1E293B', heading: '#F8FAFC', text: '#94A3B8', price: '#38BDF8' }
  },
  {
    keywords: ['skincare', 'beauty', 'cosmetic', 'serum', 'lotion', 'wellness', 'fragrance', 'perfume', 'glow', 'hair', 'soap'],
    categoryPool: ['Botanical Serums', 'Barrier Creams', 'Gentle Cleansers', 'Body Elixirs', 'Clean Fragrance', 'Discovery Sets'],
    namePrefixes: ['Lumina', 'Botany', 'Aura', 'Pure', 'Flora', 'Soleil', 'Cellular'],
    nameSuffixes: ['Botanicals', 'Skincare Labs', 'Wellness Co.', 'Dermatics', 'Naturals'],
    taglines: [
      'Clinical botanicals and bioactive skincare formulated for resilient skin.',
      'Clean, biocompatible formulations crafted to illuminate your natural barrier.',
      'Mindful daily self-care rituals backed by rigorous dermatological science.'
    ],
    theme: 'vibrant',
    colors: { primary: '#E11D48', primaryText: '#FFFFFF', background: '#FFF1F2', surface: '#FFFFFF', heading: '#881337', text: '#4C0519', price: '#BE123C' }
  },
  {
    keywords: ['tech', 'gadget', 'keyboard', 'computer', 'audio', 'electronics', 'hardware', 'desk', 'workspace', 'monitor'],
    categoryPool: ['Custom Mechanical Keyboards', 'Ergonomic Desk Pads', 'CNC Aluminium Stands', 'Braided Cables', 'Audio & DACs', 'Workspace Tools'],
    namePrefixes: ['Nexus', 'Quantum', 'Keeb', 'Apex', 'Circuit', 'Omni', 'Hyper'],
    nameSuffixes: ['Tech Lab', 'Peripherals', 'Deskworks', 'Studio Gear', 'Engineering Co.'],
    taglines: [
      'Precision-engineered workspace peripherals built for creators and enthusiasts.',
      'High-performance tactile gear designed to elevate your creative station.',
      'Minimalist industrial hardware built for relentless focus and speed.'
    ],
    theme: 'midnight',
    colors: { primary: '#8B5CF6', primaryText: '#FFFFFF', background: '#090D16', surface: '#161F30', heading: '#F1F5F9', text: '#94A3B8', price: '#A78BFA' }
  },
  {
    keywords: ['jewel', 'watch', 'gold', 'silver', 'diamond', 'ring', 'necklace', 'bracelet', 'luxury'],
    categoryPool: ['Fine Necklaces', 'Hand-set Rings', 'Solid Gold Bangles', 'Statement Earrings', 'Precious Stones', 'Heirloom Watches'],
    namePrefixes: ['Aurelia', 'Vesper', 'Solstice', 'Luster', 'Crown', 'Gilded'],
    nameSuffixes: ['Fine Jewelry', 'Atelier & Gems', 'Diamonds', 'Makers', 'Timepieces'],
    taglines: [
      'Ethically crafted fine jewelry and bespoke heirlooms for everyday elegance.',
      'Sculpted precious metals and diamonds made to celebrate lifetime milestones.',
      'Refined understated luxury handcrafted in solid 18k gold and sterling silver.'
    ],
    theme: 'elegant',
    colors: { primary: '#B45309', primaryText: '#FFFFFF', background: '#FAF7F2', surface: '#FFFFFF', heading: '#1C1917', text: '#44403C', price: '#D97706' }
  }
]

export function analyzeStorePrompt(rawPrompt) {
  const text = (rawPrompt || '').trim()
  if (!text) {
    return {
      name: 'StoreKraft Atelier',
      slug: 'storekraft-atelier',
      tagline: 'Craft your store in minutes.',
      categories: ['Featured Collection', 'Best Sellers', 'New Releases', 'Essentials'],
      theme_id: 'minimal',
      colors: { primary: '#064E3B', primaryText: '#F8E7C9', background: '#F8E7C9', surface: '#FFF9EC', heading: '#064E3B', text: '#4B5F57', price: '#064E3B' },
      analysisSummary: 'Enter a description of what you want to sell to receive an intelligent store breakdown.'
    }
  }

  const lower = text.toLowerCase()

  // Match best niche profile by keyword hits
  let bestProfile = null
  let maxScore = 0

  for (const profile of NICHE_PROFILES) {
    let score = 0
    for (const kw of profile.keywords) {
      if (lower.includes(kw)) score += 1
    }
    if (score > maxScore) {
      maxScore = score
      bestProfile = profile
    }
  }

  // Extract custom nouns/words if user mentioned a specific name
  const words = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1))

  let storeName = ''
  let tagline = ''
  let categories = []
  let theme_id = 'minimal'
  let colors = { primary: '#064E3B', primaryText: '#F8E7C9', background: '#F8E7C9', surface: '#FFF9EC', heading: '#064E3B', text: '#4B5F57', price: '#064E3B' }
  let detectedNiche = 'Custom Retail'

  if (bestProfile && maxScore > 0) {
    const prefix = bestProfile.namePrefixes[Math.floor(Math.random() * bestProfile.namePrefixes.length)]
    const suffix = bestProfile.nameSuffixes[Math.floor(Math.random() * bestProfile.nameSuffixes.length)]
    
    // Check if user has an explicit seed word
    const seedWord = capitalizedWords.find(w => !['Sell', 'Selling', 'Want', 'Make', 'Start', 'Store', 'Shop', 'Like', 'With'].includes(w))
    storeName = seedWord ? `${seedWord} ${suffix}` : `${prefix} ${suffix}`
    tagline = bestProfile.taglines[Math.floor(Math.random() * bestProfile.taglines.length)]
    categories = [...bestProfile.categoryPool.slice(0, 4)]
    theme_id = bestProfile.theme
    colors = { ...bestProfile.colors }
    detectedNiche = bestProfile.keywords[0].toUpperCase()
  } else {
    // Dynamic synthesis for custom niches
    const firstWord = capitalizedWords[0] || 'Vanguard'
    const secondWord = capitalizedWords[1] || 'Studio'
    storeName = `${firstWord} & ${secondWord} Co.`
    tagline = `Curated collection of handcrafted ${text.slice(0, 40)} crafted for discerning enthusiasts.`
    categories = [
      `${firstWord} Collection`,
      'Signature Editions',
      'Artisan Essentials',
      'Limited Releases'
    ]
    theme_id = 'minimal'
    detectedNiche = firstWord
  }

  const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return {
    name: storeName,
    slug,
    tagline,
    categories,
    theme_id,
    colors,
    detectedNiche,
    analysisSummary: `Extracted niche "${detectedNiche}". Formulated brand "${storeName}" with 4 targeted product categories and tailored visual styling.`
  }
}
