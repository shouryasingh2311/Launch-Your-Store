// Comprehensive Mock Dataset & Simulated Backend Engine for StoreKraft
import { analyzeStorePrompt } from './aiStoreAnalyzer'

export const PREDEFINED_CATEGORIES = [
  { id: 'cat-fashion', name: 'Fashion & Apparel', emoji: '', slug: 'fashion', icon: 'Shirt' },
  { id: 'cat-electronics', name: 'Electronics & Gadgets', emoji: '', slug: 'electronics', icon: 'Smartphone' },
  { id: 'cat-home', name: 'Home Decor & Living', emoji: '', slug: 'home-decor', icon: 'Armchair' },
  { id: 'cat-grocery', name: 'Gourmet & Grocery', emoji: '', slug: 'grocery', icon: 'ShoppingBag' },
  { id: 'cat-beauty', name: 'Beauty & Skincare', emoji: '', slug: 'beauty', icon: 'Sparkles' },
  { id: 'cat-books', name: 'Books & Stationery', emoji: '', slug: 'books', icon: 'BookOpen' },
  { id: 'cat-toys', name: 'Toys & Kids', emoji: '', slug: 'toys', icon: 'Smile' },
  { id: 'cat-jewellery', name: 'Fine Jewellery & Watches', emoji: '', slug: 'jewellery', icon: 'Watch' }
];

export const THEMES_METADATA = [
  {
    id: 'emerald',
    name: 'Emerald & Champagne',
    tagline: 'Signature luxury with Emerald Ink, warm champagne and gold accents',
    font: 'Poppins + Inter',
    radius: '10px',
    heroStyle: 'Warm split hero with gold accents',
    cardStyle: 'Clay card with champagne border',
    accentColor: '#064E3B',
    secondaryColor: '#F8E7C9',
    accentHighlight: '#D97706',
    bgPreview: 'bg-[#F8E7C9] text-[#064E3B] border-[#E8D5AE]'
  },
  {
    id: 'midnight',
    name: 'Midnight Teal & Violet',
    tagline: 'Deep dark slate infused with electric teal and neon violet accents',
    font: 'Space Grotesk',
    radius: '10px',
    heroStyle: 'Futuristic ambient glow',
    cardStyle: 'High-contrast dark slate tile',
    accentColor: '#0D9488',
    secondaryColor: '#8B5CF6',
    accentHighlight: '#38BDF8',
    bgPreview: 'bg-[#0F172A] text-slate-100 border-slate-700'
  },
  {
    id: 'rose',
    name: 'Rose Gold & Obsidian',
    tagline: 'Haute couture luxury pairing obsidian noir with blush rose gold',
    font: 'Playfair Display + Inter',
    radius: '8px',
    heroStyle: 'Atmospheric moody editorial banner',
    cardStyle: 'Delicate rose borders with dark surface',
    accentColor: '#FB7185',
    secondaryColor: '#18181B',
    accentHighlight: '#F43F5E',
    bgPreview: 'bg-[#18181B] text-rose-50 border-rose-900/30'
  },
  {
    id: 'minimal',
    name: 'Nordic Minimalist',
    tagline: 'Clean, typography-focused monochrome with crisp contrast',
    font: 'Inter',
    radius: '4px',
    heroStyle: 'Centered with spotlight item',
    cardStyle: 'Flat with subtle border',
    accentColor: '#111827',
    secondaryColor: '#F9FAFB',
    accentHighlight: '#4B5563',
    bgPreview: 'bg-white text-zinc-900 border-zinc-200'
  },
  {
    id: 'amber',
    name: 'Sunset Amber & Espresso',
    tagline: 'Warm terracotta, rich espresso and luminous amber gold',
    font: 'Playfair Display + Lato',
    radius: '8px',
    heroStyle: 'Warm earthy gradient with ambient glow',
    cardStyle: 'Earthy cream border with warm clay shadow',
    accentColor: '#F59E0B',
    secondaryColor: '#292524',
    accentHighlight: '#EA580C',
    bgPreview: 'bg-[#FAF5EF] text-stone-900 border-amber-200'
  },
  {
    id: 'ocean',
    name: 'Ocean Azure & Frost',
    tagline: 'Deep nautical navy, radiant cyan and cool frost surfaces',
    font: 'Poppins + Inter',
    radius: '12px',
    heroStyle: 'Fluid gradient hero with aquatic accents',
    cardStyle: 'Frost surface with crisp cyan highlights',
    accentColor: '#0284C7',
    secondaryColor: '#0C4A6E',
    accentHighlight: '#06B6D4',
    bgPreview: 'bg-[#F0F9FF] text-sky-950 border-sky-200'
  }
];

export const INITIAL_PRODUCTS = [
  // Fashion
  {
    id: 'prod-1',
    name: 'Heritage Raw Denim Jacket',
    category_id: 'cat-fashion',
    categoryName: 'Fashion & Apparel',
    price: 3499,
    compare_at_price: 4999,
    discount_pct: 30,
    stock: 24,
    low_stock_threshold: 5,
    sku: 'FASH-JKT-001',
    image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    description: 'Crafted from 13.5oz selvedge denim with antique brass hardware and double-needle contrast stitching.',
    is_active: true,
    variants: [
      { id: 'v-1', name: 'Size S', stock: 6, price_delta: 0 },
      { id: 'v-2', name: 'Size M', stock: 12, price_delta: 0 },
      { id: 'v-3', name: 'Size L', stock: 6, price_delta: 0 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Pure Linen Oversized Shirt',
    category_id: 'cat-fashion',
    categoryName: 'Fashion & Apparel',
    price: 1899,
    compare_at_price: 2499,
    discount_pct: 24,
    stock: 4,
    low_stock_threshold: 6,
    sku: 'FASH-SHT-002',
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    description: 'Breathable European linen garment-dyed in gentle earth tones for relaxed daily elegance.',
    is_active: true,
    variants: [
      { id: 'v-4', name: 'Size M', stock: 2, price_delta: 0 },
      { id: 'v-5', name: 'Size L', stock: 2, price_delta: 0 }
    ]
  },
  // Electronics
  {
    id: 'prod-3',
    name: 'AcousticPro ANC Wireless Headphones',
    category_id: 'cat-electronics',
    categoryName: 'Electronics & Gadgets',
    price: 8999,
    compare_at_price: 11999,
    discount_pct: 25,
    stock: 15,
    low_stock_threshold: 4,
    sku: 'ELEC-HDP-003',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'Studio-grade 40mm beryllium drivers with hybrid 40dB noise cancellation and 45-hour battery.',
    is_active: true,
    variants: [
      { id: 'v-6', name: 'Matte Obsidian', stock: 10, price_delta: 0 },
      { id: 'v-7', name: 'Lunar Silver', stock: 5, price_delta: 0 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Minimalist Mechanical Keyboard 75%',
    category_id: 'cat-electronics',
    categoryName: 'Electronics & Gadgets',
    price: 4999,
    compare_at_price: 5999,
    discount_pct: 16,
    stock: 3,
    low_stock_threshold: 5,
    sku: 'ELEC-KBD-004',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    description: 'Gasket-mounted mechanical keyboard with lubed linear switches, PBT keycaps and hot-swap PCB.',
    is_active: true,
    variants: [
      { id: 'v-8', name: 'Linear Red Switches', stock: 2, price_delta: 0 },
      { id: 'v-9', name: 'Tactile Brown Switches', stock: 1, price_delta: 0 }
    ]
  },
  // Home Decor
  {
    id: 'prod-5',
    name: 'Artisan Ceramic Vase Set of 2',
    category_id: 'cat-home',
    categoryName: 'Home Decor & Living',
    price: 1499,
    compare_at_price: 1999,
    discount_pct: 25,
    stock: 19,
    low_stock_threshold: 5,
    sku: 'HOME-VAS-005',
    image_url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    description: 'Wheel-thrown stoneware pottery with organic matte glaze texture. Safe for fresh blooms or dry pampas.',
    is_active: true,
    variants: [
      { id: 'v-10', name: 'Terracotta & Sand', stock: 19, price_delta: 0 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Hand-Poured Soy Wax Amber Candle',
    category_id: 'cat-home',
    categoryName: 'Home Decor & Living',
    price: 799,
    compare_at_price: 999,
    discount_pct: 20,
    stock: 42,
    low_stock_threshold: 8,
    sku: 'HOME-CND-006',
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    description: 'Infused with wild cedarwood, smoked vanilla, and bergamot. 50 hours of soot-free burn time.',
    is_active: true,
    variants: [
      { id: 'v-11', name: 'Cedar & Vanilla', stock: 22, price_delta: 0 },
      { id: 'v-12', name: 'Amber & Patchouli', stock: 20, price_delta: 0 }
    ]
  },
  // Beauty
  {
    id: 'prod-7',
    name: 'Botanical Cold-Pressed Face Oil',
    category_id: 'cat-beauty',
    categoryName: 'Beauty & Skincare',
    price: 1299,
    compare_at_price: 1599,
    discount_pct: 18,
    stock: 28,
    low_stock_threshold: 6,
    sku: 'BEAU-OIL-007',
    image_url: 'https://images.unsplash.com/photo-1608248597359-bb4f0b2f6fb3?auto=format&fit=crop&w=800&q=80',
    description: 'Rosehip, squalane and blue tansy lipid blend to deeply nourish barrier and calm sensitivity.',
    is_active: true,
    variants: [
      { id: 'v-13', name: '30ml Dropper', stock: 28, price_delta: 0 }
    ]
  },
  // Jewellery
  {
    id: 'prod-8',
    name: '18K Gold Vermeil Twisted Croissant Hoops',
    category_id: 'cat-jewellery',
    categoryName: 'Fine Jewellery & Watches',
    price: 2899,
    compare_at_price: 3899,
    discount_pct: 25,
    stock: 2,
    low_stock_threshold: 4,
    sku: 'JEWL-EAR-008',
    image_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    description: 'Solid 925 sterling silver base with heavy 2.5-micron gold plating. Water-resistant and hypoallergenic.',
    is_active: true,
    variants: [
      { id: 'v-14', name: 'Standard (18mm)', stock: 2, price_delta: 0 }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    order_number: 'ORD-1001',
    customer_name: 'Aditi Sharma',
    email: 'aditi.sharma@example.com',
    phone: '+91 98765 43210',
    address: '42, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
    subtotal: 5398,
    discount: 500,
    shipping: 0,
    total: 4898,
    status: 'delivered',
    payment_method: 'UPI / NetBanking',
    created_at: '2026-03-28T14:32:00Z',
    items: [
      { id: 'item-1', product_id: 'prod-1', name_snapshot: 'Heritage Raw Denim Jacket (Size M)', price_snapshot: 3499, qty: 1 },
      { id: 'item-2', product_id: 'prod-2', name_snapshot: 'Pure Linen Oversized Shirt (Size L)', price_snapshot: 1899, qty: 1 }
    ],
    timeline: [
      { status: 'placed', note: 'Order placed online via UPI', time: '2026-03-28T14:32:00Z' },
      { status: 'packed', note: 'Boxed and dispatched to warehouse dock', time: '2026-03-28T18:10:00Z' },
      { status: 'shipped', note: 'Handed to BlueDart Express AWB #8492019', time: '2026-03-29T10:00:00Z' },
      { status: 'delivered', note: 'Delivered and signed by security desk', time: '2026-03-31T16:45:00Z' }
    ]
  },
  {
    id: 'ord-1002',
    order_number: 'ORD-1002',
    customer_name: 'Rahul Varma',
    email: 'rahul.varma@gmail.com',
    phone: '+91 91234 56789',
    address: 'Flat 304, Green Heights, Powai, Mumbai - 400076',
    subtotal: 8999,
    discount: 0,
    shipping: 0,
    total: 8999,
    status: 'shipped',
    payment_method: 'Credit Card',
    created_at: '2026-04-02T11:15:00Z',
    items: [
      { id: 'item-3', product_id: 'prod-3', name_snapshot: 'AcousticPro ANC Wireless Headphones (Obsidian)', price_snapshot: 8999, qty: 1 }
    ],
    timeline: [
      { status: 'placed', note: 'Order placed and paid', time: '2026-04-02T11:15:00Z' },
      { status: 'packed', note: 'Packed with fragile protective air wrap', time: '2026-04-02T15:20:00Z' },
      { status: 'shipped', note: 'Dispatched via Delhivery Express', time: '2026-04-03T09:30:00Z' }
    ]
  },
  {
    id: 'ord-1003',
    order_number: 'ORD-1003',
    customer_name: 'Pooja Iyer',
    email: 'pooja.iyer@outlook.com',
    phone: '+91 99887 76655',
    address: 'B-12, Alwarpet, Chennai, Tamil Nadu - 600018',
    subtotal: 4398,
    discount: 300,
    shipping: 100,
    total: 4198,
    status: 'packed',
    payment_method: 'Cash on Delivery',
    created_at: '2026-04-05T09:05:00Z',
    items: [
      { id: 'item-4', product_id: 'prod-5', name_snapshot: 'Artisan Ceramic Vase Set of 2', price_snapshot: 1499, qty: 1 },
      { id: 'item-5', product_id: 'prod-8', name_snapshot: '18K Gold Vermeil Twisted Croissant Hoops', price_snapshot: 2899, qty: 1 }
    ],
    timeline: [
      { status: 'placed', note: 'Cash on delivery verified via SMS OTP', time: '2026-04-05T09:05:00Z' },
      { status: 'packed', note: 'Packing completed, awaiting logistics pickup', time: '2026-04-05T12:00:00Z' }
    ]
  },
  {
    id: 'ord-1004',
    order_number: 'ORD-1004',
    customer_name: 'Kabir Mehta',
    email: 'kabir.m@gmail.com',
    phone: '+91 98450 11223',
    address: '77, Vasant Vihar, New Delhi - 110057',
    subtotal: 2098,
    discount: 0,
    shipping: 100,
    total: 2198,
    status: 'placed',
    payment_method: 'UPI',
    created_at: '2026-04-06T16:20:00Z',
    items: [
      { id: 'item-6', product_id: 'prod-6', name_snapshot: 'Hand-Poured Soy Wax Amber Candle', price_snapshot: 799, qty: 1 },
      { id: 'item-7', product_id: 'prod-7', name_snapshot: 'Botanical Cold-Pressed Face Oil', price_snapshot: 1299, qty: 1 }
    ],
    timeline: [
      { status: 'placed', note: 'New order received', time: '2026-04-06T16:20:00Z' }
    ]
  }
];

export const INITIAL_DEMO_STORE = {
  id: 'store-demo-1',
  slug: 'craft-haven',
  name: 'Craft Haven Co.',
  tagline: 'Thoughtfully curated lifestyle essentials & handcrafted goods',
  logo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&h=200&q=80',
  contact_email: 'hello@crafthaven.store',
  phone: '+91 98765 00000',
  address: 'Indiranagar 12th Main, Bengaluru, India',
  business_type: 'Home & Lifestyle Goods',
  theme_id: 'elegant',
  theme_overrides: {
    primaryColor: '#14532d',
    fontHeading: 'Playfair Display',
    fontBody: 'Lato'
  },
  content: {
    heroTitle: 'Objects Crafted with Purpose & Soul',
    heroSubtitle: 'Discover sustainably sourced artisan essentials for everyday living, shipped straight to your doorstep.',
    heroBadge: 'Spring Collection Live',
    heroCta: 'Explore Catalog',
    announcement: 'Free express shipping on all orders over ₹1,999 with code VIBES'
  }
};

// Simulated AI Setup Endpoint Mock (FastAPI POST /ai/setup-suggestions)
export function getAISetupSuggestions(description) {
  const analysis = analyzeStorePrompt(description);
  return {
    name: analysis.name,
    slug: analysis.slug,
    categories: analysis.categories.map(name => ({ name, emoji: '' })),
    tagline: analysis.tagline,
    theme_id: analysis.theme_id,
    theme_name: analysis.theme_id,
    colors: analysis.colors,
    summary: analysis.analysisSummary
  };
}

// Simulated Chatbot Deterministic Tool Execution (Never hallucinating numbers)
export function executeChatbotQuery(query, products = INITIAL_PRODUCTS, orders = INITIAL_ORDERS) {
  const q = query.toLowerCase();

  // 1. Top products
  if (q.includes('top') || q.includes('best seller') || q.includes('popular')) {
    const sorted = [...products].sort((a, b) => (b.price * (50 - b.stock)) - (a.price * (50 - a.stock))).slice(0, 5);
    return {
      answer: "Here are your top 5 products based on sales volume and revenue generation this month:",
      table: {
        columns: ['Product Name', 'Price', 'Sold Qty', 'Revenue Est.'],
        rows: sorted.map((p, idx) => [
          p.name,
          `₹${p.price.toLocaleString('en-IN')}`,
          `${35 - idx * 5} units`,
          `₹${((35 - idx * 5) * p.price).toLocaleString('en-IN')}`
        ])
      },
      tool: 'top_products',
      params: { period: 'this_month', limit: 5, by: 'revenue' }
    };
  }

  // 2. Low stock
  if (q.includes('low stock') || q.includes('inventory') || q.includes('restock') || q.includes('out of stock')) {
    const lowStock = products.filter(p => p.stock <= (p.low_stock_threshold || 5));
    return {
      answer: `Found ${lowStock.length} items currently at or below minimum threshold:`,
      table: {
        columns: ['SKU', 'Product Name', 'Current Stock', 'Threshold', 'Status'],
        rows: lowStock.map(p => [
          p.sku,
          p.name,
          `${p.stock} units`,
          `${p.low_stock_threshold} units`,
          p.stock <= 2 ? '⚠️ Critical' : '⚡ Reorder Soon'
        ])
      },
      tool: 'low_stock',
      params: { threshold: 5 }
    };
  }

  // 3. Revenue comparison
  if (q.includes('revenue') || q.includes('sales') || q.includes('compare') || q.includes('growth')) {
    return {
      answer: "Revenue comparison between This Week vs Last Week shows a 24.8% growth trajectory:",
      table: {
        columns: ['Metric', 'Last Week', 'This Week', 'Delta'],
        rows: [
          ['Total Orders', '18 orders', '23 orders', '+27.7%'],
          ['Gross Revenue', '₹58,400', '₹72,900', '+24.8%'],
          ['Average Order Value', '₹3,244', '₹3,169', '-2.3%'],
          ['Fulfillment Rate', '94.4%', '98.2%', '+3.8%']
        ]
      },
      tool: 'revenue_compare',
      params: { period_a: 'this_week', period_b: 'last_week' }
    };
  }

  // 4. Orders summary
  if (q.includes('order') || q.includes('status') || q.includes('pending')) {
    const placed = orders.filter(o => o.status === 'placed').length;
    const packed = orders.filter(o => o.status === 'packed').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    return {
      answer: `Here is the current operational pipeline across all live orders:`,
      table: {
        columns: ['Status Pipeline', 'Count', 'Action Needed'],
        rows: [
          ['Placed (New)', `${placed} orders`, 'Needs packaging & invoice'],
          ['Packed', `${packed} orders`, 'Awaiting courier pickup'],
          ['Shipped (In Transit)', `${shipped} orders`, 'Tracking actively monitored'],
          ['Delivered', `${delivered} orders`, 'Completed']
        ]
      },
      tool: 'orders_summary',
      params: { period: 'last_30_days', status: 'all' }
    };
  }

  // 5. Category breakdown
  if (q.includes('category') || q.includes('categories')) {
    return {
      answer: "Here is your sales and product count breakdown by category:",
      table: {
        columns: ['Category', 'Active Products', 'Sales Share'],
        rows: [
          ['Fashion & Apparel', '2 items', '36%'],
          ['Electronics & Gadgets', '2 items', '31%'],
          ['Fine Jewellery & Watches', '1 item', '16%'],
          ['Home Decor & Living', '2 items', '12%'],
          ['Beauty & Skincare', '1 item', '5%']
        ]
      },
      tool: 'sales_by_category',
      params: { period: 'this_month' }
    };
  }

  // 6. Cross-store or unsupported query -> strictly honest refusal!
  return {
    answer: "I don't have that data. I only have access to verified operational queries for your authenticated store.",
    table: null,
    tool: null,
    params: null
  };
}

// =========================================================================
// 4 DISTINCT COMMERCIAL DEMO STORE TEMPLATES
// 1. Fashion & Apparel (Atelier Noir)
// 2. Electronics & Audio (Pulse Audio & Tech)
// 3. Home Decor & Ceramics (Terra Living & Decor)
// 4. All-in-1 Flagship (StoreKraft Flagship)
// =========================================================================

export const DEMO_STORES = {
  'demo-fashion': {
    id: 'demo-fashion',
    slug: 'demo-fashion',
    name: 'Atelier Noir',
    tagline: 'Contemporary Haute Couture & Modern Editorial Apparel',
    business_type: 'Fashion & Apparel',
    theme_id: 'rose',
    theme_overrides: {
      colors: {
        primary: '#FB7185',
        primaryText: '#FFFFFF',
        background: '#18181B',
        surface: '#27272A',
        text: '#FDA4AF',
        heading: '#FFF1F2',
        border: '#3F3F46'
      },
      fonts: { heading: 'Playfair Display', body: 'Inter' },
      button: { radius: 'rounded', position: 'hero', style: 'filled', text: 'Explore Runway' }
    },
    content: {
      heroTitle: 'Haute Couture Meets Modern Utility',
      heroSubtitle: 'Tailored silhouettes, raw selvedge denim, and breathable Italian linens designed in Milan.',
      heroBadge: 'Autumn/Winter Lookbook 2026',
      heroCta: 'Explore Runway',
      announcement: 'Complimentary white-glove courier delivery on all orders over ₹4,999'
    }
  },

  'demo-electronics': {
    id: 'demo-electronics',
    slug: 'demo-electronics',
    name: 'Pulse Audio & Tech',
    tagline: 'Studio Acoustic Engineering & Ergonomic Hardware',
    business_type: 'Electronics & Gadgets',
    theme_id: 'midnight',
    theme_overrides: {
      colors: {
        primary: '#0D9488',
        primaryText: '#FFFFFF',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#94A3B8',
        heading: '#F8FAFC',
        border: '#334155'
      },
      fonts: { heading: 'Space Grotesk', body: 'Inter' },
      button: { radius: 'pill', position: 'floating', style: 'glow', text: 'Shop Pro Gear' }
    },
    content: {
      heroTitle: 'Pure Acoustic Fidelity & Pro Hardware',
      heroSubtitle: 'Studio-grade hybrid active noise cancellation, custom mechanical switches, and high-performance desk gear.',
      heroBadge: 'New Pro Lineup Released',
      heroCta: 'Shop Pro Gear',
      announcement: '2-Year Hardware Replacement Warranty + Express Free Delivery Worldwide'
    }
  },

  'demo-decor': {
    id: 'demo-decor',
    slug: 'demo-decor',
    name: 'Terra Living & Ceramics',
    tagline: 'Hand-Thrown Stoneware Pottery & Tactile Living Accents',
    business_type: 'Home Decor & Living',
    theme_id: 'amber',
    theme_overrides: {
      colors: {
        primary: '#B45309',
        primaryText: '#FFFFFF',
        background: '#FAF5EF',
        surface: '#FFFFFF',
        text: '#57534E',
        heading: '#292524',
        border: '#E7E5E4'
      },
      fonts: { heading: 'Playfair Display', body: 'Lato' },
      button: { radius: 'rounded', position: 'hero', style: 'clay', text: 'View Studio Drops' }
    },
    content: {
      heroTitle: 'Objects Sculpted with Clay, Fire & Soul',
      heroSubtitle: 'Wheel-thrown pottery, organic woven linen throws, and hand-poured botanical candles crafted by generational artisans.',
      heroBadge: 'Small-Batch Kiln Firing Live',
      heroCta: 'View Studio Drops',
      announcement: 'Zero plastic packaging. Sustainably shipped in recyclable honeycomb paper.'
    }
  },

  'craft-haven': {
    id: 'demo-flagship',
    slug: 'craft-haven',
    name: 'StoreKraft Flagship',
    tagline: 'Curated Department Store for Modern Living',
    business_type: 'Multi-Category Department Store',
    theme_id: 'midnight',
    theme_overrides: {
      colors: {
        primary: '#D97706',
        primaryText: '#0F172A',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#94A3B8',
        heading: '#FFFFFF',
        border: '#334155'
      },
      fonts: { heading: 'Poppins', body: 'Inter' },
      button: { radius: 'rounded', position: 'hero', style: 'filled', text: 'Explore All Departments' }
    },
    content: {
      heroTitle: 'Curated Department Store for Modern Living',
      heroSubtitle: 'Explore our multi-category flagship collection spanning haute apparel, audio hardware, handcrafted ceramics, and fine accessories.',
      heroBadge: 'Spring Flagship Showcase 2026',
      heroCta: 'Explore All Departments',
      announcement: 'Free express shipping on all orders over ₹1,999 with code FLAGSHIP'
    }
  }
};

// Aliases for friendly routing
DEMO_STORES['demo-flagship'] = DEMO_STORES['craft-haven'];
DEMO_STORES['atelier-noir'] = DEMO_STORES['demo-fashion'];
DEMO_STORES['pulse-tech'] = DEMO_STORES['demo-electronics'];
DEMO_STORES['terra-living'] = DEMO_STORES['demo-decor'];

export const DEMO_STORE_CATEGORIES = {
  'demo-fashion': [
    { id: 'cat-f1', name: 'Outerwear & Jackets', slug: 'outerwear' },
    { id: 'cat-f2', name: 'Italian Linen & Shirts', slug: 'linen-shirts' },
    { id: 'cat-f3', name: 'Tailored Trousers', slug: 'tailored' },
    { id: 'cat-f4', name: 'Tuscan Leather Footwear', slug: 'footwear' },
    { id: 'cat-f5', name: 'Haute Knitwear & Silk', slug: 'knitwear' },
  ],
  'demo-electronics': [
    { id: 'cat-e1', name: 'Wireless Audio & ANC', slug: 'audio' },
    { id: 'cat-e2', name: 'Mechanical Keyboards', slug: 'keyboards' },
    { id: 'cat-e3', name: 'Studio Reference Sound', slug: 'studio-sound' },
    { id: 'cat-e4', name: 'Desk Ambient Lighting', slug: 'lighting' },
    { id: 'cat-e5', name: 'Fast Charging Stations', slug: 'charging' },
  ],
  'demo-decor': [
    { id: 'cat-d1', name: 'Stoneware & Ceramic Vases', slug: 'vases' },
    { id: 'cat-d2', name: 'Handcrafted Tableware', slug: 'tableware' },
    { id: 'cat-d3', name: 'Sculptural Vessels', slug: 'vessels' },
    { id: 'cat-d4', name: 'Botanical Amber Candles', slug: 'candles' },
    { id: 'cat-d5', name: 'Organic Linen Textiles', slug: 'textiles' },
  ],
  'craft-haven': PREDEFINED_CATEGORIES,
  'demo-flagship': PREDEFINED_CATEGORIES,
};

export const DEMO_STORE_PRODUCTS = {
  'demo-fashion': [
    {
      id: 'fash-1',
      name: 'Heritage Raw Selvedge Denim Jacket',
      price: 3499,
      compare_at_price: 4999,
      stock: 18,
      categoryName: 'Outerwear & Jackets',
      sku: 'NOIR-JKT-01',
      description: 'Crafted from 13.5oz Kurabo Japanese selvedge denim with antique brass hardware and double-needle contrast stitching.',
      image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'fash-2',
      name: 'Pure Italian Linen Relaxed Overshirt',
      price: 2199,
      compare_at_price: 2899,
      stock: 24,
      categoryName: 'Italian Linen & Shirts',
      sku: 'NOIR-SHT-02',
      description: 'Airy, breathable European flax linen garment-dyed in muted charcoal. Pre-washed for a buttery soft drape.',
      image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'fash-3',
      name: 'Sculpted Double-Breasted Cashmere Trench',
      price: 8499,
      compare_at_price: 11999,
      stock: 7,
      categoryName: 'Outerwear & Jackets',
      sku: 'NOIR-TRN-03',
      description: 'Substantial 520gsm virgin wool-cashmere blend featuring horn buttons, structured storm flap and belted waist.',
      image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'fash-4',
      name: 'French Terry Drop-Shoulder Minimalist Hoodie',
      price: 2799,
      compare_at_price: 3499,
      stock: 35,
      categoryName: 'Haute Knitwear & Silk',
      sku: 'NOIR-HD-04',
      description: '450gsm heavyweight organic cotton loopback French terry with double-layered hood and clean pocketless torso.',
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'fash-5',
      name: 'Vegetable-Tanned Tuscan Leather Chelsea Boots',
      price: 6499,
      compare_at_price: 8999,
      stock: 12,
      categoryName: 'Tuscan Leather Footwear',
      sku: 'NOIR-BOT-05',
      description: 'Handcrafted in Florence from full-grain calfskin with Goodyear-welted Dainite rubber soles and elasticated gussets.',
      image_url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'fash-6',
      name: 'Mulberry Silk Bias-Cut Midi Slip Dress',
      price: 4899,
      compare_at_price: 6499,
      stock: 9,
      categoryName: 'Haute Knitwear & Silk',
      sku: 'NOIR-DRS-06',
      description: '100% 22-momme Grade 6A mulberry silk with gentle cowl neckline and graceful bias drape that moves like liquid mercury.',
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      is_active: true
    }
  ],

  'demo-electronics': [
    {
      id: 'elec-1',
      name: 'AcousticPro ANC Wireless Studio Headphones',
      price: 8999,
      compare_at_price: 11999,
      stock: 22,
      categoryName: 'Wireless Audio & ANC',
      sku: 'PULSE-HDP-01',
      description: 'Custom 40mm beryllium drivers, hybrid 42dB active noise cancellation, LDAC Hi-Res certification, and 45-hour battery life.',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'elec-2',
      name: 'Tactile Gasket 75% Mechanical Keyboard RGB',
      price: 4999,
      compare_at_price: 6499,
      stock: 14,
      categoryName: 'Mechanical Keyboards',
      sku: 'PULSE-KBD-02',
      description: 'CNC anodized aluminum frame with gasket mounting, factory-lubed linear switches, south-facing RGB and hot-swap PCB.',
      image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'elec-3',
      name: 'Studio Precision Active Reference Desk Monitors',
      price: 14999,
      compare_at_price: 18999,
      stock: 6,
      categoryName: 'Studio Reference Sound',
      sku: 'PULSE-MON-03',
      description: 'Bi-amplified 5-inch Kevlar woofers and silk dome tweeters tuned flat for mixing, production, and audiophile desktop audio.',
      image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'elec-4',
      name: 'Curved 4K Display Ambient Magnetic Lightbar',
      price: 2499,
      compare_at_price: 3299,
      stock: 30,
      categoryName: 'Desk Ambient Lighting',
      sku: 'PULSE-LGT-04',
      description: 'Asymmetric optical glare-free design with wireless 2.4GHz desktop rotary dial, auto-dimming sensor and CRI 97 daylight rating.',
      image_url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'elec-5',
      name: 'MagCharge 3-in-1 Fast Wireless Stand',
      price: 3199,
      compare_at_price: 4199,
      stock: 25,
      categoryName: 'Fast Charging Stations',
      sku: 'PULSE-CHG-05',
      description: 'Simultaneously charge phone at 15W, watch at 5W, and earbuds at 5W with weighted solid aluminum base and braided cable.',
      image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'elec-6',
      name: 'Carbon Fiber Ergonomic Vertical Wireless Mouse',
      price: 1999,
      compare_at_price: 2799,
      stock: 19,
      categoryName: 'Mechanical Keyboards',
      sku: 'PULSE-MOU-06',
      description: '57-degree natural handshake angle that relieves carpal strain. PixArt 4000 DPI sensor with silent mechanical switches.',
      image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      is_active: true
    }
  ],

  'demo-decor': [
    {
      id: 'decor-1',
      name: 'Artisan Ribbed Stoneware Pottery Vase Set',
      price: 1799,
      compare_at_price: 2399,
      stock: 16,
      categoryName: 'Stoneware & Ceramic Vases',
      sku: 'TERRA-VAS-01',
      description: 'Hand-thrown in small batches with tactile volcanic glaze. Water-tight construction designed for fresh eucalyptus or pampas.',
      image_url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'decor-2',
      name: 'Hand-Thrown Ceramic Espresso Mugs Set of 4',
      price: 1399,
      compare_at_price: 1899,
      stock: 28,
      categoryName: 'Handcrafted Tableware',
      sku: 'TERRA-MUG-02',
      description: 'Unfinished raw terracotta base paired with milky satin glaze. Microwave and dishwasher safe, sized for 90ml double shots.',
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'decor-3',
      name: 'Sculpted Travertine Stone Incense Vessel',
      price: 899,
      compare_at_price: 1299,
      stock: 40,
      categoryName: 'Sculptural Vessels',
      sku: 'TERRA-VES-03',
      description: 'Chiseled from solid Turkish travertine with organic porous cavities. Holds stick, rope, and cone incense safely.',
      image_url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'decor-4',
      name: 'Hand-Poured Amber & Vetiver Soy Candle',
      price: 799,
      compare_at_price: 999,
      stock: 50,
      categoryName: 'Botanical Amber Candles',
      sku: 'TERRA-CND-04',
      description: 'Botanical wax blend infused with wild patchouli, smoked cedar, and bergamot. FSC-certified crackling wood wick with 55h burn time.',
      image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'decor-5',
      name: 'Waffle-Weave Pure Organic Linen Throw Blanket',
      price: 2599,
      compare_at_price: 3499,
      stock: 12,
      categoryName: 'Organic Linen Textiles',
      sku: 'TERRA-THR-05',
      description: 'Pre-washed French flax linen with dimensional honeycomb weave. Moisture-wicking, breathable, and gets softer with every wash.',
      image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
      is_active: true
    },
    {
      id: 'decor-6',
      name: 'Terracotta Minimalist Indoor Planter with Saucer',
      price: 1199,
      compare_at_price: 1599,
      stock: 22,
      categoryName: 'Stoneware & Ceramic Vases',
      sku: 'TERRA-PLT-06',
      description: 'High-fire porous natural clay promoting root aeration with integrated drainage hole and matching catch tray.',
      image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      is_active: true
    }
  ],

  'craft-haven': INITIAL_PRODUCTS,
  'demo-flagship': INITIAL_PRODUCTS
};

DEMO_STORE_PRODUCTS['atelier-noir'] = DEMO_STORE_PRODUCTS['demo-fashion'];
DEMO_STORE_PRODUCTS['pulse-tech'] = DEMO_STORE_PRODUCTS['demo-electronics'];
DEMO_STORE_PRODUCTS['terra-living'] = DEMO_STORE_PRODUCTS['demo-decor'];

DEMO_STORE_CATEGORIES['atelier-noir'] = DEMO_STORE_CATEGORIES['demo-fashion'];
DEMO_STORE_CATEGORIES['pulse-tech'] = DEMO_STORE_CATEGORIES['demo-electronics'];
DEMO_STORE_CATEGORIES['terra-living'] = DEMO_STORE_CATEGORIES['demo-decor'];

