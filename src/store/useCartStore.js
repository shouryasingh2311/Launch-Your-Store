import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Map of slug -> array of cart items
      stores: {},
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),

      getStoreCart: (slug) => {
        const stores = get().stores
        return stores[slug] || []
      },

      addItem: (slug, product, variant = null, qty = 1) => {
        set((state) => {
          const currentItems = state.stores[slug] || []
          const itemKey = variant ? `${product.id}-${variant.id}` : product.id
          const existingIndex = currentItems.findIndex(i => i.itemKey === itemKey)

          let updated
          if (existingIndex > -1) {
            updated = [...currentItems]
            updated[existingIndex].qty += qty
          } else {
            updated = [
              ...currentItems,
              {
                itemKey,
                product_id: product.id,
                name: product.name,
                price: product.price + (variant?.price_delta || 0),
                image_url: product.image_url,
                variant: variant ? variant.name : null,
                variant_id: variant ? variant.id : null,
                qty
              }
            ]
          }

          return {
            stores: {
              ...state.stores,
              [slug]: updated
            },
            isCartOpen: true
          }
        })
      },

      updateQty: (slug, itemKey, qty) => {
        set((state) => {
          const currentItems = state.stores[slug] || []
          if (qty <= 0) {
            return {
              stores: {
                ...state.stores,
                [slug]: currentItems.filter(i => i.itemKey !== itemKey)
              }
            }
          }
          const updated = currentItems.map(i => i.itemKey === itemKey ? { ...i, qty } : i)
          return {
            stores: {
              ...state.stores,
              [slug]: updated
            }
          }
        })
      },

      removeItem: (slug, itemKey) => {
        set((state) => {
          const currentItems = state.stores[slug] || []
          return {
            stores: {
              ...state.stores,
              [slug]: currentItems.filter(i => i.itemKey !== itemKey)
            }
          }
        })
      },

      clearCart: (slug) => {
        set((state) => ({
          stores: {
            ...state.stores,
            [slug]: []
          }
        }))
      }
    }),
    {
      name: 'launch-your-store-cart'
    }
  )
)
