import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

const DEFAULT_USERS = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    name: 'Admin',
    email: 'admin@storekraft.com',
    password: 'admin',
    role: 'owner',
    store_id: 'store-demo-1',
    store_slug: 'craft-haven',
    store_name: 'Craft Haven Co.',
    createdAt: '2026-10-01'
  },
  {
    id: 'usr-staff-1',
    username: 'staff',
    name: 'Store Staff',
    email: 'staff@storekraft.com',
    password: 'admin',
    role: 'staff',
    store_id: 'store-demo-1',
    store_slug: 'craft-haven',
    store_name: 'Craft Haven Co.',
    createdAt: '2026-10-05'
  }
]

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: DEFAULT_USERS,
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Authenticate user by username OR email and password.
       * Default Admin credentials: username 'admin', password 'admin'
       */
      login: async (identifier, password) => {
        const cleanId = (identifier || '').trim().toLowerCase()
        const cleanPwd = (password || '').trim()

        // 1. Try real backend API if reachable
        try {
          const res = await api.login(cleanId, cleanPwd)
          if (res && res.access_token) {
            const user = {
              id: res.user?.id || 'usr-1',
              username: cleanId.includes('@') ? cleanId.split('@')[0] : cleanId,
              name: res.user?.role === 'staff' ? 'Store Staff' : (res.store?.name || 'Admin'),
              email: res.user?.email || (cleanId.includes('@') ? cleanId : `${cleanId}@storekraft.com`),
              role: res.user?.role || (cleanId === 'admin' ? 'owner' : 'staff'),
              store_id: res.user?.store_id || res.store?.id || 'store-demo-1',
              store_slug: res.store?.slug || 'craft-haven',
              store_name: res.store?.name || 'StoreKraft Flagship'
            }
            set({
              user,
              token: res.access_token,
              isAuthenticated: true
            })
            return { success: true, user }
          }
        } catch {
          // Fall through to local auth verification
        }

        await new Promise(r => setTimeout(r, 150))

        // 2. Check default Admin credentials (username 'admin', password 'admin')
        if ((cleanId === 'admin' || cleanId === 'admin@storekraft.com') && cleanPwd === 'admin') {
          const adminUser = {
            id: 'usr-admin-1',
            username: 'admin',
            name: 'Admin',
            email: 'admin@storekraft.com',
            role: 'owner',
            store_id: 'store-demo-1',
            store_slug: 'craft-haven',
            store_name: 'Craft Haven Co.'
          }
          set({
            user: adminUser,
            token: 'sk-token-admin-session',
            isAuthenticated: true
          })
          return { success: true, user: adminUser }
        }

        // 3. Check registered users list
        const allUsers = get().users || DEFAULT_USERS
        const matched = allUsers.find(
          u => (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId) && u.password === cleanPwd
        )

        if (matched) {
          const activeUser = {
            id: matched.id,
            username: matched.username,
            name: matched.name,
            email: matched.email,
            role: matched.role || 'owner',
            store_id: matched.store_id || 'store-demo-1',
            store_slug: matched.store_slug || 'craft-haven',
            store_name: matched.store_name || `${matched.name}'s Store`
          }
          set({
            user: activeUser,
            token: `sk-token-${matched.id}`,
            isAuthenticated: true
          })
          return { success: true, user: activeUser }
        }

        throw new Error('Invalid username or password. Please check your credentials and try again.')
      },

      /**
       * Register a new merchant user. Saves user into the users directory
       * so admin can view all registered merchant data.
       */
      signup: async (name, email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase()
        const cleanName = (name || '').trim() || 'Merchant'
        const cleanPwd = (password || '').trim()

        if (!cleanEmail || !cleanPwd) {
          throw new Error('Email and password are required.')
        }

        const currentUsers = get().users || DEFAULT_USERS
        if (currentUsers.some(u => u.email?.toLowerCase() === cleanEmail)) {
          throw new Error('An account with this email already exists.')
        }

        // Try backend registration if available
        try {
          await api.signup(cleanName, cleanEmail, cleanPwd)
        } catch {
          // Local registration handles offline / direct operation
        }

        const newUser = {
          id: `usr-${Date.now()}`,
          username: cleanEmail.split('@')[0],
          name: cleanName,
          email: cleanEmail,
          password: cleanPwd,
          role: 'owner',
          store_id: `store-${Date.now()}`,
          store_slug: `${cleanEmail.split('@')[0]}-store`,
          store_name: `${cleanName}'s Store`,
          createdAt: new Date().toISOString().split('T')[0]
        }

        const updatedUsers = [...currentUsers, newUser]

        set({
          users: updatedUsers,
          user: newUser,
          token: `sk-token-${newUser.id}`,
          isAuthenticated: true
        })

        return { success: true, user: newUser }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },

      /**
       * Switch role between Staff and Owner with mandatory authentication
       * when switching to Owner/Admin.
       */
      switchRole: (newRole, adminPassword = '') => {
        const currentUser = get().user
        if (!currentUser) throw new Error('Not logged in')

        if (newRole === 'owner') {
          // Verification required when switching from staff to owner
          if (currentUser.role === 'staff' && adminPassword !== 'admin') {
            throw new Error('Invalid Admin credentials. Password must be "admin".')
          }
          set({
            user: {
              ...currentUser,
              role: 'owner',
              name: currentUser.username === 'staff' ? 'Admin' : currentUser.name
            }
          })
          return { success: true }
        } else {
          // Switching to staff
          set({
            user: {
              ...currentUser,
              role: 'staff'
            }
          })
          return { success: true }
        }
      }
    }),
    {
      name: 'storekraft-auth-v2'
    }
  )
)
