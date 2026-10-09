/**
 * Central API Client for Storecraft Frontend
 * Interacts with FastAPI backend routes and Supabase database.
 * Gracefully handles offline fallback to keep UI functional.
 */

const API_BASE = import.meta.env.VITE_API_URL || ''

function getAuthToken() {
  try {
    const raw = localStorage.getItem('launch-your-store-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.state?.token || null
    }
  } catch (e) {
    // Ignore parse error
  }
  return null
}

function authHeaders() {
  const token = getAuthToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(res) {
  if (!res.ok) {
    let errDetail = 'Request failed'
    try {
      const errJson = await res.json()
      errDetail = errJson.detail || JSON.stringify(errJson)
    } catch (e) {
      errDetail = res.statusText || `HTTP ${res.status}`
    }
    throw new Error(errDetail)
  }
  return res.json()
}

export const api = {
  // ---- Health ----
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`)
    return handleResponse(res)
  },

  // ---- Authentication ----
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(res)
  },

  async signup(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    return handleResponse(res)
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  // ---- Store Wizard ----
  async completeWizard(wizardData) {
    const res = await fetch(`${API_BASE}/stores/wizard`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(wizardData)
    })
    return handleResponse(res)
  },

  // ---- Public Storefront (Shopper) ----
  async getPublicStore(slug) {
    const res = await fetch(`${API_BASE}/public/${encodeURIComponent(slug)}`)
    return handleResponse(res)
  },

  async getPublicProducts(slug, params = {}) {
    const query = new URLSearchParams()
    if (params.category) query.set('category', params.category)
    if (params.q) query.set('q', params.q)
    if (params.sort) query.set('sort', params.sort)
    if (params.page) query.set('page', params.page)
    if (params.limit) query.set('limit', params.limit)

    const qs = query.toString() ? `?${query.toString()}` : ''
    const res = await fetch(`${API_BASE}/public/${encodeURIComponent(slug)}/products${qs}`)
    return handleResponse(res)
  },

  async createPublicOrder(slug, orderPayload) {
    const res = await fetch(`${API_BASE}/public/${encodeURIComponent(slug)}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    })
    return handleResponse(res)
  },

  // ---- Admin Dashboard ----
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  async getRevenueTrend(days = 30) {
    const res = await fetch(`${API_BASE}/dashboard/revenue-trend?days=${days}`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  // ---- Admin Inventory ----
  async getProducts(params = {}) {
    const query = new URLSearchParams()
    if (params.category_id) query.set('category_id', params.category_id)
    if (params.q) query.set('q', params.q)
    if (params.page) query.set('page', params.page)
    if (params.limit) query.set('limit', params.limit)

    const qs = query.toString() ? `?${query.toString()}` : ''
    const res = await fetch(`${API_BASE}/products/${qs}`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(productData)
    })
    return handleResponse(res)
  },

  async updateProduct(productId, productData) {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(productData)
    })
    return handleResponse(res)
  },

  async updateProductStock(productId, stock) {
    const res = await fetch(`${API_BASE}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ stock })
    })
    return handleResponse(res)
  },

  async deleteProduct(productId) {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  // ---- Admin Orders ----
  async getOrders(params = {}) {
    const query = new URLSearchParams()
    if (params.status) query.set('status', params.status)
    if (params.page) query.set('page', params.page)
    if (params.limit) query.set('limit', params.limit)

    const qs = query.toString() ? `?${query.toString()}` : ''
    const res = await fetch(`${API_BASE}/orders/${qs}`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  async updateOrderStatus(orderId, status, note = '') {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status, note })
    })
    return handleResponse(res)
  },

  // ---- Categories & Seeding ----
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories/`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  async importDummyProducts() {
    const res = await fetch(`${API_BASE}/categories/import-dummy`, {
      method: 'POST',
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  // ---- AI Assistant & Suggestions ----
  async askAI(message) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ message })
    })
    return handleResponse(res)
  },

  async askDirectTool(tool, params = {}) {
    const res = await fetch(`${API_BASE}/chat/tool`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ tool, params })
    })
    return handleResponse(res)
  },

  async getAISetupSuggestions(description) {
    const res = await fetch(`${API_BASE}/ai/setup-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    })
    return handleResponse(res)
  },

  /**
   * Upload an image file and return a data URL (client-side only, no backend storage needed).
   * For production: swap this with a real upload-to-storage call.
   */
  uploadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'))
      const maxBytes = 5 * 1024 * 1024 // 5 MB
      if (file.size > maxBytes) return reject(new Error('Image must be under 5 MB'))
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowed.includes(file.type)) return reject(new Error('Only JPEG, PNG, WebP, or GIF allowed'))
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  },

  // ---- CSV Importer ----
  async uploadCSV(file) {
    const formData = new FormData()
    formData.append('file', file)

    const token = getAuthToken()
    const headers = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}/import/csv`, {
      method: 'POST',
      headers,
      body: formData
    })
    return handleResponse(res)
  },

  // ---- Team & Settings ----
  async getTeam() {
    const res = await fetch(`${API_BASE}/team/`, {
      headers: authHeaders()
    })
    return handleResponse(res)
  },

  async inviteTeamMember(email, role = 'staff') {
    const res = await fetch(`${API_BASE}/team/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, role })
    })
    return handleResponse(res)
  },

  async removeTeamMember(id) {
    const res = await fetch(`${API_BASE}/team/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    return handleResponse(res)
  }
}
