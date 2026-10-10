import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_DEMO_STORE, INITIAL_PRODUCTS, INITIAL_ORDERS, PREDEFINED_CATEGORIES, DEMO_STORES, DEMO_STORE_PRODUCTS, DEMO_STORE_CATEGORIES } from '../lib/mockData'

export const useStoreData = create(
  persist(
    (set, get) => ({
      // Store details
      store: INITIAL_DEMO_STORE,
      categories: PREDEFINED_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customStores: {},
      team: [
        { id: 'tm-1', name: 'Admin', email: 'admin@storekraft.com', role: 'owner', added_at: '2026-03-01' },
        { id: 'tm-2', name: 'Store Staff', email: 'staff@storekraft.com', role: 'staff', added_at: '2026-03-15' },
        { id: 'tm-3', name: 'Inventory Specialist', email: 'inventory@storekraft.com', role: 'staff', added_at: '2026-03-20' }
      ],
      notifications: [
        { id: 'notif-1', channel: 'SMS', message: 'Order ORD-1001 marked as Delivered', timestamp: '2026-03-31T16:45:00Z' },
        { id: 'notif-2', channel: 'Email', message: 'Shipping label created for Order ORD-1002 (Delhivery)', timestamp: '2026-04-03T09:30:00Z' },
        { id: 'notif-3', channel: 'WhatsApp', message: 'Order confirmation sent for ORD-1004', timestamp: '2026-04-06T16:21:00Z' }
      ],

      // Multi-tenant Store Isolation: Save & Retrieve custom user stores
      saveCustomStore: (storeData, productsArray, categoriesArray) => {
        const slug = storeData.slug
        set(state => ({
          customStores: {
            ...(state.customStores || {}),
            [slug]: {
              store: storeData,
              products: Array.isArray(productsArray) ? productsArray : [],
              categories: Array.isArray(categoriesArray) ? categoriesArray : []
            }
          }
        }))
      },

      getStoreData: (slug) => {
        const state = get()
        const targetSlug = slug || 'craft-haven'

        // 1. Check if user-created custom store exists in persistent storage
        if (state.customStores && state.customStores[targetSlug]) {
          return state.customStores[targetSlug]
        }

        // 2. Check if it's one of the 4 commercial demo stores
        if (DEMO_STORES[targetSlug]) {
          return {
            store: DEMO_STORES[targetSlug],
            products: DEMO_STORE_PRODUCTS[targetSlug] || INITIAL_PRODUCTS,
            categories: DEMO_STORE_CATEGORIES[targetSlug] || PREDEFINED_CATEGORIES
          }
        }

        // 3. Check if active session store matches target slug
        if (state.store?.slug === targetSlug) {
          return {
            store: state.store,
            products: state.products || INITIAL_PRODUCTS,
            categories: state.categories || PREDEFINED_CATEGORIES
          }
        }

        // 4. Fallback to craft-haven (flagship)
        return {
          store: DEMO_STORES['craft-haven'] || INITIAL_DEMO_STORE,
          products: DEMO_STORE_PRODUCTS['craft-haven'] || INITIAL_PRODUCTS,
          categories: DEMO_STORE_CATEGORIES['craft-haven'] || PREDEFINED_CATEGORIES
        }
      },

      // Update store settings / theme
      updateStore: (patch) => {
        set(state => ({
          store: {
            ...state.store,
            ...patch,
            theme_overrides: {
              ...(state.store.theme_overrides || {}),
              ...(patch.theme_overrides || {})
            },
            content: {
              ...(state.store.content || {}),
              ...(patch.content || {})
            }
          }
        }))
      },

      setTheme: (themeId, overrides = {}) => {
        set(state => ({
          store: {
            ...state.store,
            theme_id: themeId,
            theme_overrides: {
              ...state.store.theme_overrides,
              ...overrides
            }
          }
        }))
      },

      // Product Management
      addProduct: (productData) => {
        const newProduct = {
          ...productData,
          id: `prod-${Date.now()}`,
          stock: Number(productData.stock) || 0,
          price: Number(productData.price) || 0,
          compare_at_price: productData.compare_at_price ? Number(productData.compare_at_price) : null,
          is_active: productData.is_active !== false,
          variants: productData.variants || [{ id: `v-${Date.now()}`, name: 'Standard', stock: Number(productData.stock) || 0, price_delta: 0 }]
        }
        set(state => ({
          products: [newProduct, ...state.products]
        }))
        return newProduct
      },

      updateProduct: (id, patch) => {
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, ...patch } : p)
        }))
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }))
      },

      updateStockInline: (id, newStock) => {
        const val = Math.max(0, parseInt(newStock, 10) || 0)
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, stock: val } : p)
        }))
      },

      bulkUpdateStock: (productIds, newStock) => {
        const val = Math.max(0, parseInt(newStock, 10) || 0)
        set(state => ({
          products: state.products.map(p => productIds.includes(p.id) ? { ...p, stock: val } : p)
        }))
      },

      bulkUpdatePrice: (productIds, priceAdjustment) => {
        const adj = Number(priceAdjustment) || 0
        set(state => ({
          products: state.products.map(p => {
            if (productIds.includes(p.id)) {
              return { ...p, price: Math.max(1, p.price + adj) }
            }
            return p
          })
        }))
      },

      setCategories: (newCategories) => {
        set({ categories: Array.isArray(newCategories) ? newCategories : [] })
      },

      setProducts: (newProducts) => {
        set({ products: Array.isArray(newProducts) ? newProducts : [] })
      },

      // Category actions
      addCategory: (name, emoji = '') => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        const newCat = {
          id: `cat-${Date.now()}`,
          name,
          emoji,
          slug
        }
        set(state => ({
          categories: [...state.categories, newCat]
        }))
        return newCat
      },

      // Import Dummy products
      importDummyProducts: () => {
        set(state => ({
          products: [...INITIAL_PRODUCTS]
        }))
        return INITIAL_PRODUCTS.length
      },

      // Orders
      createOrder: (orderData) => {
        const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
        const newOrder = {
          id: `ord-${Date.now()}`,
          order_number: orderNumber,
          customer_name: orderData.customer_name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          subtotal: orderData.subtotal,
          discount: orderData.discount || 0,
          shipping: orderData.shipping || 0,
          total: orderData.total,
          status: 'placed',
          payment_method: orderData.payment_method || 'UPI',
          created_at: new Date().toISOString(),
          items: orderData.items || [],
          timeline: [
            {
              status: 'placed',
              note: `Order received via ${orderData.payment_method || 'UPI'}`,
              time: new Date().toISOString()
            }
          ]
        }

        // Deduct inventory stock
        const updatedProducts = get().products.map(prod => {
          const orderedItem = orderData.items?.find(it => it.product_id === prod.id)
          if (orderedItem) {
            return { ...prod, stock: Math.max(0, prod.stock - orderedItem.qty) }
          }
          return prod
        })

        // Log notification
        const newNotif = {
          id: `notif-${Date.now()}`,
          channel: 'SMS/Email',
          message: `New order ${orderNumber} placed for ${orderData.customer_name} (₹${orderData.total})`,
          timestamp: new Date().toISOString()
        }

        set(state => ({
          orders: [newOrder, ...state.orders],
          products: updatedProducts,
          notifications: [newNotif, ...state.notifications]
        }))

        return newOrder
      },

      updateOrderStatus: (orderId, newStatus, note = '') => {
        const order = get().orders.find(o => o.id === orderId)
        if (!order) return

        const timestamp = new Date().toISOString()
        const defaultNotes = {
          placed: 'Order placed by customer',
          packed: 'Order inspected and securely packed',
          shipped: 'Order dispatched with courier AWB tracking',
          delivered: 'Package marked delivered by carrier',
          cancelled: 'Order cancelled and inventory released'
        }

        const newTimelineEvent = {
          status: newStatus,
          note: note || defaultNotes[newStatus] || `Status updated to ${newStatus}`,
          time: timestamp
        }

        const simNotif = {
          id: `notif-${Date.now()}`,
          channel: 'Customer Notification (Simulated)',
          message: `Order #${order.order_number} is now ${newStatus.toUpperCase()}. ${newTimelineEvent.note}`,
          timestamp
        }

        set(state => ({
          orders: state.orders.map(o => {
            if (o.id === orderId) {
              return {
                ...o,
                status: newStatus,
                timeline: [...o.timeline, newTimelineEvent]
              }
            }
            return o
          }),
          notifications: [simNotif, ...state.notifications]
        }))
      },

      // Team
      inviteTeamMember: (email, role = 'staff', name = '') => {
        const newMember = {
          id: `tm-${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          role,
          added_at: new Date().toISOString().split('T')[0]
        }
        set(state => ({
          team: [...state.team, newMember]
        }))
        return newMember
      },

      removeTeamMember: (id) => {
        set(state => ({
          team: state.team.filter(t => t.id !== id)
        }))
      }
    }),
    {
      name: 'launch-your-store-data'
    }
  )
)
