import React, { useState, useMemo } from 'react'
import { AdminLayout } from '../components/admin/AdminLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Drawer } from '../components/ui/Drawer'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { useStoreData } from '../store/useStoreData'
import { formatINR } from '../lib/utils'
import { useToast } from '../components/ui/Toast'
import { api } from '../lib/api'
import { Search, Plus, Trash2, Edit2, Check, AlertCircle, Filter } from 'lucide-react'

export function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, updateStockInline, bulkUpdateStock, addCategory } = useStoreData()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])

  // Category addition modal state
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleCreateCategory = (e) => {
    e?.preventDefault()
    const trimmed = newCategoryName.trim()
    if (!trimmed) {
      toast.warning('Name Required', 'Please enter a category name.')
      return
    }
    const existing = categories.find(c => c.name.toLowerCase() === trimmed.toLowerCase())
    if (existing) {
      toast.warning('Already Exists', `Category "${trimmed}" already exists.`)
      return
    }
    const created = addCategory(trimmed)
    toast.success('Category Added', `Category "${trimmed}" is now active in inventory.`)
    setNewCategoryName('')
    setIsAddCatModalOpen(false)
    setFormData(prev => ({ ...prev, category_id: created.id }))
  }

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category_id: 'cat-fashion',
    price: '',
    compare_at_price: '',
    stock: '',
    sku: '',
    image_url: '',
    description: ''
  })

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.sku?.toLowerCase().includes(search.toLowerCase())
      const matchesCat = selectedCategory === 'all' || p.category_id === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [products, search, selectedCategory])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category_id: categories[0]?.id || 'cat-fashion',
      price: '',
      compare_at_price: '',
      stock: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: ''
    })
    setIsDrawerOpen(true)
  }

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod)
    setFormData({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      compare_at_price: prod.compare_at_price || '',
      stock: prod.stock,
      sku: prod.sku,
      image_url: prod.image_url,
      description: prod.description || ''
    })
    setIsDrawerOpen(true)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    const cat = categories.find(c => c.id === formData.category_id)

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        categoryName: cat?.name || 'General',
        price: Number(formData.price),
        compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
        stock: Number(formData.stock)
      })
      try {
        await api.updateProduct(editingProduct.id, {
          name: formData.name,
          category_id: formData.category_id,
          price: Number(formData.price),
          compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
          stock: Number(formData.stock),
          sku: formData.sku,
          description: formData.description
        })
      } catch (err) {
        console.warn('API updateProduct fallback to local store:', err.message)
      }
      toast.success('Product Updated', `${formData.name} was updated successfully.`)
    } else {
      addProduct({
        ...formData,
        categoryName: cat?.name || 'General',
        price: Number(formData.price),
        compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
        stock: Number(formData.stock)
      })
      try {
        await api.createProduct({
          name: formData.name,
          category_id: formData.category_id,
          price: Number(formData.price),
          compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
          stock: Number(formData.stock),
          sku: formData.sku,
          description: formData.description
        })
      } catch (err) {
        console.warn('API createProduct fallback to local store:', err.message)
      }
      toast.success('Product Created', `${formData.name} was added to the catalog.`)
    }
    setIsDrawerOpen(false)
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete product "${name}"?`)) {
      deleteProduct(id)
      setSelectedIds(prev => prev.filter(i => i !== id))
      try {
        await api.deleteProduct(id)
      } catch (err) {
        console.warn('API deleteProduct fallback to local store:', err.message)
      }
      toast.info('Product Removed', `${name} has been deleted.`)
    }
  }

  // Bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleBulkRestock = () => {
    if (selectedIds.length === 0) return
    bulkUpdateStock(selectedIds, 50)
    toast.success('Bulk Updated', `Set stock to 50 for ${selectedIds.length} items.`)
    setSelectedIds([])
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Product Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage product details, pricing, variants, and real-time inventory counts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddCatModalOpen(true)} variant="secondary" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Category
            </Button>
            <Button onClick={handleOpenAdd} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>
        </div>

        {/* Filters & Bulk Actions Bar */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, SKUs..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs animate-in fade-in">
              <span className="font-semibold text-indigo-900">
                {selectedIds.length} products selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkRestock}
                  className="px-2.5 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  Set Stock to 50
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-slate-500 hover:text-slate-700 underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Products Table (Desktop) & Cards (Mobile) */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Add your first item or clear your active search filter."
            actionLabel="Add Product"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock (Inline Edit)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedIds.includes(p.id)
                    const isLow = p.stock <= (p.low_stock_threshold || 5)

                    return (
                      <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              setSelectedIds(prev =>
                                e.target.checked ? [...prev, p.id] : prev.filter(i => i !== p.id)
                              )
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="h-10 w-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 leading-snug">{p.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">
                          {p.categoryName || 'General'}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {formatINR(p.price)}
                        </td>
                        <td className="p-4">
                          {/* Inline Stock Input */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => updateStockInline(p.id, e.target.value)}
                              className="w-16 px-2 py-1 text-xs border rounded-md font-semibold text-center focus:ring-1 focus:ring-indigo-500"
                            />
                            {isLow && (
                              <span className="text-amber-500 text-[10px] font-bold" title="Low Stock Warning">
                                ⚠️ Low
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={p.stock > 0 ? 'success' : 'danger'} size="sm">
                            {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Product Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={editingProduct ? "Edit Product" : "Add New Product"}
          description="Update catalog inventory specs and image."
        >
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <Input
              label="Product Title"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> New Category
                </button>
              </div>
              <select
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (INR ₹)"
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              <Input
                label="Compare Price (₹)"
                type="number"
                value={formData.compare_at_price}
                onChange={e => setFormData({ ...formData, compare_at_price: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Stock Quantity"
                type="number"
                required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
              <Input
                label="SKU Identifier"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <Input
              label="Image URL"
              value={formData.image_url}
              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              helperText="Paste direct image link (Unsplash or hosted CDN)"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Product details, materials, specs..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <Button type="submit" variant="primary" size="md" className="flex-1">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Drawer>

        {/* Add Category Modal */}
        {isAddCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Add Inventory Category</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create a new category to organize and filter products in your inventory.
                </p>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Handmade Ceramics, Accessories"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsAddCatModalOpen(false)
                      setNewCategoryName('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Add Category
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
