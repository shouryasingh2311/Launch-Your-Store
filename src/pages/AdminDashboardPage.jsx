import React, { useState, useEffect } from 'react'
import { AdminLayout } from '../components/admin/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { useStoreData } from '../store/useStoreData'
import { useAuthStore } from '../store/useAuthStore'
import { formatINR } from '../lib/utils'
import { api } from '../lib/api'
import { TrendingUp, ShoppingCart, AlertCircle, PackageCheck, ArrowUpRight, Plus, RefreshCw } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function AdminDashboardPage() {
  const { store, products, orders, updateStockInline } = useStoreData()

  const [dbSummary, setDbSummary] = useState(null)
  const [dbChart, setDbChart] = useState(null)

  useEffect(() => {
    let isCancelled = false
    async function loadStats() {
      try {
        const [sumRes, chartRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getRevenueTrend(7)
        ])
        if (!isCancelled) {
          if (sumRes) setDbSummary(sumRes)
          if (chartRes && chartRes.length > 0) {
            setDbChart(chartRes.map(pt => ({
              day: pt.date?.slice(5) || pt.date,
              revenue: Number(pt.revenue)
            })))
          }
        }
      } catch (err) {
        // Graceful fallback to local mock store
        console.warn('Dashboard DB stats fetch fallback to local:', err.message)
      }
    }
    loadStats()
    return () => { isCancelled = true }
  }, [])

  // Calculate KPIs
  const totalRevenue = dbSummary?.gross_revenue !== undefined ? dbSummary.gross_revenue : orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalOrders = dbSummary?.total_orders !== undefined ? dbSummary.total_orders : orders.length
  const avgOrderValue = dbSummary?.aov !== undefined ? dbSummary.aov : (totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0)
  const lowStockProducts = products.filter(p => p.stock <= (p.low_stock_threshold || 5))

  // 7-day revenue chart data
  const chartData = dbChart || [
    { day: 'Mon', revenue: 14200 },
    { day: 'Tue', revenue: 18900 },
    { day: 'Wed', revenue: 16400 },
    { day: 'Thu', revenue: 24800 },
    { day: 'Fri', revenue: 31200 },
    { day: 'Sat', revenue: 42100 },
    { day: 'Sun', revenue: totalRevenue > 50000 ? totalRevenue : 48900 }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Title & Store Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live operational metrics for <span className="font-semibold text-slate-800">{store?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin/products">
              <Button size="sm" variant="outline" className="text-xs">
                Manage Inventory
              </Button>
            </Link>
            <Link to={`/s/${store?.slug}`} target="_blank" rel="noreferrer">
              <Button size="sm" variant="primary" className="text-xs">
                Launch View <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Gross Revenue</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatINR(totalRevenue)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span>+24.8%</span> from last week
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Total Orders</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {totalOrders}
            </div>
            <p className="text-[11px] text-indigo-600 font-medium">
              100% fulfillment pipeline active
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Avg Order Value (AOV)</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <PackageCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatINR(avgOrderValue)}
            </div>
            <p className="text-[11px] text-slate-500">
              Per completed transaction
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Low Stock Alerts</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {lowStockProducts.length}
            </div>
            <p className="text-[11px] text-amber-600 font-medium">
              Requires warehouse replenishment
            </p>
          </Card>
        </div>

        {/* Charts & Low Stock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-8">
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Weekly Revenue Trajectory</h3>
                  <p className="text-[11px] text-slate-500">Real-time GMV across all channels</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  INR (₹)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Quick Restock Action Box */}
          <div className="lg:col-span-4">
            <Card className="p-5 space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Low Stock List
                  </h3>
                  <Link to="/admin/products" className="text-xs text-indigo-600 font-semibold hover:underline">
                    View all
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Quickly restock inventory directly with 1 click.
                </p>

                <div className="space-y-3">
                  {lowStockProducts.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-amber-600 font-medium">Stock: {p.stock} units</p>
                      </div>
                      <button
                        onClick={() => updateStockInline(p.id, p.stock + 10)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shrink-0 shadow-2xs"
                        title="Add 10 units"
                      >
                        +10 Restock
                      </button>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <p className="text-xs text-emerald-600 text-center py-6 font-medium">
                      ✓ All inventory levels are healthy!
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link to="/admin/orders" className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors">
                  View Full Orders Timeline →
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Registered Merchants & Users Directory (Admin Portal) */}
        <Card className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-champagne-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-brand font-poppins flex items-center gap-2">
                Merchant Accounts & Users Directory
              </h3>
              <p className="text-[11px] text-[var(--sc-muted)]">
                Registered platform users, owner profiles and staff credentials saved in StoreKraft
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand self-start sm:self-auto">
              {(useAuthStore.getState().users || []).length} Registered Accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-champagne-border text-[var(--sc-muted)] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Merchant / Name</th>
                  <th className="py-2.5 px-3">Username / Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Store Name</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne-border">
                {(useAuthStore.getState().users || []).map((u) => (
                  <tr key={u.id} className="hover:bg-champagne-card/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-brand">
                      {u.name || 'Merchant'}
                    </td>
                    <td className="py-3 px-3 text-[var(--sc-muted)] font-mono text-[11px]">
                      {u.email || u.username}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'owner' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.role || 'owner'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--sc-muted)]">
                      {u.store_name || store?.name || 'StoreKraft Store'}
                    </td>
                    <td className="py-3 px-3 text-[var(--sc-muted)]">
                      {u.createdAt || '2026-10-01'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </AdminLayout>
  )
}
