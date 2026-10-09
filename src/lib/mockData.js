// Comprehensive Mock Dataset & Simulated Backend Engine for Launch-Your-Store

export const PREDEFINED_CATEGORIES = [
  { id: 'cat-fashion', name: 'Fashion & Apparel', emoji: '👗', slug: 'fashion', icon: 'Shirt' },
  { id: 'cat-electronics', name: 'Electronics & Gadgets', emoji: '⚡', slug: 'electronics', icon: 'Smartphone' },
  { id: 'cat-home', name: 'Home Decor & Living', emoji: '🛋️', slug: 'home-decor', icon: 'Armchair' },
  { id: 'cat-grocery', name: 'Gourmet & Grocery', emoji: '🥑', slug: 'grocery', icon: 'ShoppingBag' },
  { id: 'cat-beauty', name: 'Beauty & Skincare', emoji: '✨', slug: 'beauty', icon: 'Sparkles' },
  { id: 'cat-books', name: 'Books & Stationery', emoji: '📚', slug: 'books', icon: 'BookOpen' },
  { id: 'cat-toys', name: 'Toys & Kids', emoji: '🧸', slug: 'toys', icon: 'Smile' },
  { id: 'cat-jewellery', name: 'Fine Jewellery & Watches', emoji: '💍', slug: 'jewellery', icon: 'Watch' }
];

export const THEMES_METADATA = [
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Clean, typography-focused, modern essentials',
    font: 'Inter',
    radius: '4px',
    heroStyle: 'Centered with spotlight item',
    cardStyle: 'Flat with subtle border',
    accentColor: '#18181b',
    bgPreview: 'bg-white text-zinc-900 border-zinc-200'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    tagline: 'Playful gradients, energetic curves, trendy fashion',
    font: 'Poppins',
    radius: '16px',
    heroStyle: 'Split hero with gradient badge',
    cardStyle: 'Curved pill styling & hover float',
    accentColor: '#d946ef',
    bgPreview: 'bg-fuchsia-50 text-purple-950 border-purple-200'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    tagline: 'Warm cream luxury, serif headings, handcrafted goods',
    font: 'Playfair Display + Lato',
    radius: '8px',
    heroStyle: 'Full-bleed atmospheric banner',
    cardStyle: 'Delicate gold/olive borders',
    accentColor: '#14532d',
    bgPreview: 'bg-[#fbf9f5] text-stone-900 border-stone-200'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Sleek dark slate, neon teal accents, tech & gadgets',
    font: 'Space Grotesk',
    radius: '10px',
    heroStyle: 'Futuristic glowing grid',
    cardStyle: 'Glassmorphism dark tile',
    accentColor: '#14b8a6',
    bgPreview: 'bg-[#090d16] text-slate-100 border-slate-800'
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
    heroBadge: '✨ Spring 2026 Collection Live',
    heroCta: 'Explore Catalog',
    announcement: '🌿 Free express shipping on all orders over ₹1,999 with code VIBES'
  }
};

// Simulated AI Setup Endpoint Mock (FastAPI POST /ai/setup-suggestions)
export function getAISetupSuggestions(description) {
  const desc = (description || '').toLowerCase();
  
  if (desc.includes('tech') || desc.includes('gadget') || desc.includes('code') || desc.includes('electr')) {
    return {
      categories: [
        { name: 'Electronics & Gadgets', emoji: '⚡' },
        { name: 'Workspace Accessories', emoji: '💻' }
      ],
      tagline: 'Cutting-edge gear engineered for modern high-performance creators.',
      theme_id: 'midnight',
      theme_name: 'Midnight'
    };
  }
  
  if (desc.includes('cloth') || desc.includes('fashion') || desc.includes('wear') || desc.includes('dress') || desc.includes('street')) {
    return {
      categories: [
        { name: 'Fashion & Apparel', emoji: '👗' },
        { name: 'Fine Jewellery & Watches', emoji: '💍' }
      ],
      tagline: 'Bold, expressive silhouettes designed to stand out everywhere.',
      theme_id: 'vibrant',
      theme_name: 'Vibrant'
    };
  }

  if (desc.includes('book') || desc.includes('art') || desc.includes('home') || desc.includes('decor') || desc.includes('craft') || desc.includes('ceramic')) {
    return {
      categories: [
        { name: 'Home Decor & Living', emoji: '🛋️' },
        { name: 'Books & Stationery', emoji: '📚' }
      ],
      tagline: 'Timeless handmade treasures that transform every room.',
      theme_id: 'elegant',
      theme_name: 'Elegant'
    };
  }

  // Default clean suggestion
  return {
    categories: [
      { name: 'Home Decor & Living', emoji: '🛋️' },
      { name: 'Gourmet & Grocery', emoji: '🥑' }
    ],
    tagline: 'Simple, premium essentials delivered straight to your door.',
    theme_id: 'minimal',
    theme_name: 'Minimal'
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
