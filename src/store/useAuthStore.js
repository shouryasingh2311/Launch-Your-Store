import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {
        id: 'usr-owner-1',
        name: 'Aarav Patel',
        email: 'owner@crafthaven.store',
        role: 'owner', // 'owner' | 'staff'
        store_id: 'store-demo-1',
        store_slug: 'craft-haven'
      },
      token: 'mock-jwt-token-eyJuYW1lIjoiQWFyYXYiLCJyb2xlIjoib3duZXIifQ',
      isAuthenticated: true,

      login: async (email, password, role = 'owner') => {
        // Simulated network delay
        await new Promise(r => setTimeout(r, 400))
        const user = {
          id: role === 'owner' ? 'usr-owner-1' : 'usr-staff-2',
          name: role === 'owner' ? 'Aarav Patel (Owner)' : 'Priya Nair (Staff)',
          email: email || (role === 'owner' ? 'owner@crafthaven.store' : 'staff@crafthaven.store'),
          role: role,
          store_id: 'store-demo-1',
          store_slug: 'craft-haven'
        }
        set({
          user,
          token: `mock-jwt-token-${role}`,
          isAuthenticated: true
        })
        return { success: true, user }
      },

      signup: async (name, email, password) => {
        await new Promise(r => setTimeout(r, 400))
        const user = {
          id: `usr-${Date.now()}`,
          name: name || 'Store Owner',
          email: email || 'founder@store.com',
          role: 'owner',
          store_id: null,
          store_slug: null
        }
        set({
          user,
          token: `mock-jwt-token-new-${Date.now()}`,
          isAuthenticated: true
        })
        return { success: true, user }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },

      // Judge-friendly instant switcher between Owner and Staff roles!
      switchRole: (newRole) => {
        const currentUser = get().user || {}
        set({
          user: {
            ...currentUser,
            role: newRole,
            name: newRole === 'owner' ? 'Aarav Patel (Owner)' : 'Priya Nair (Staff)',
            email: newRole === 'owner' ? 'owner@crafthaven.store' : 'staff@crafthaven.store'
          }
        })
      }
    }),
    {
      name: 'launch-your-store-auth'
    }
  )
)
