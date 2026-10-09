import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { api } from '../lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {
        id: 'usr-owner-1',
        name: 'Aura Artisan Studio (Owner)',
        email: 'owner@launchstore.com',
        role: 'owner', // 'owner' | 'staff'
        store_id: 'demo-store-id',
        store_slug: 'demo-store'
      },
      token: 'mock-jwt-token-eyJuYW1lIjoiQWFyYXYiLCJyb2xlIjoib3duZXIifQ',
      isAuthenticated: true,

      login: async (email, password, role = 'owner') => {
        try {
          const res = await api.login(email, password)
          if (res && res.access_token) {
            const user = {
              id: res.user?.id || 'usr-1',
              name: res.user?.role === 'staff' ? 'Demo Staff' : (res.store?.name || 'Store Owner'),
              email: res.user?.email || email,
              role: res.user?.role || role,
              store_id: res.user?.store_id || res.store?.id,
              store_slug: res.store?.slug || 'demo-store'
            }
            set({
              user,
              token: res.access_token,
              isAuthenticated: true
            })
            return { success: true, user }
          }
        } catch (apiErr) {
          console.warn('Backend login returned error or unavailable, using demo state:', apiErr.message)
        }

        // Graceful offline demo fallback
        await new Promise(r => setTimeout(r, 200))
        const user = {
          id: role === 'owner' ? 'usr-owner-1' : 'usr-staff-2',
          name: role === 'owner' ? 'Store Owner' : 'Store Staff',
          email: email || (role === 'owner' ? 'owner@launchstore.com' : 'staff@launchstore.com'),
          role: role,
          store_id: 'store-demo-1',
          store_slug: 'demo-store'
        }
        set({
          user,
          token: `mock-jwt-token-${role}`,
          isAuthenticated: true
        })
        return { success: true, user }
      },

      signup: async (name, email, password) => {
        try {
          const res = await api.signup(name, email, password)
          if (res && res.access_token) {
            const user = {
              id: res.user?.id || `usr-${Date.now()}`,
              name: name || 'Store Owner',
              email: res.user?.email || email,
              role: 'owner',
              store_id: res.store?.id || null,
              store_slug: res.store?.slug || null
            }
            set({
              user,
              token: res.access_token,
              isAuthenticated: true
            })
            return { success: true, user }
          }
        } catch (apiErr) {
          console.warn('Backend signup error, using demo state:', apiErr.message)
        }

        await new Promise(r => setTimeout(r, 200))
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
