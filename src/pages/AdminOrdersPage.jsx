import React, { useState } from 'react'
import { AdminLayout } from '../components/admin/AdminLayout'
import { Card } from '../components/ui/Card'
import { Drawer } from '../components/ui/Drawer'
import { Badge } from '../components/ui/Badge'
import { useStoreData } from '../store/useStoreData'
import { formatINR } from '../lib/utils'
import { useToast } from '../components/ui/Toast'
import { api } from '../lib/api'
import { ShoppingCart, Eye, Clock, CheckCircle2, Truck, Box, XCircle, BellRing, ArrowRight } from 'lucide-react'

export function AdminOrdersPage() {
  const { orders, updateOrderStatus, notifications } = useStoreData()
  const toast = useToast()

  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true
    return o.status === statusFilter
  })

  const statusBadges = {
    placed: { variant: 'indigo', label: 'Placed' },
    packed: { variant: 'warning', label: 'Packed' },
    shipped: { variant: 'default', label: 'In Transit' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'danger', label: 'Cancelled' }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev)
    try {
      await api.updateOrderStatus(orderId, newStatus)
    } catch (err) {
      console.warn('API updateOrderStatus fallback to local store:', err.message)
    }
    toast.success('Status Updated', `Order marked as ${newStatus.toUpperCase()}. Simulated customer notification dispatched!`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Order Fulfillment & Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer orders, advance fulfillment status, and trigger simulated updates.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 border-b border-slate-200">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'placed', label: 'Placed', count: orders.filter(o => o.status === 'placed').length },
            { id: 'packed', label: 'Packed', count: orders.filter(o => o.status === 'packed').length },
            { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
            { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Snapshot</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => {
                  const badge = statusBadges[order.status] || { variant: 'default', label: order.status }

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{order.customer_name}</p>
                          <span className="text-[11px] text-slate-400">{order.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs truncate">
                        {order.items?.map(it => `${it.qty}x ${it.name_snapshot}`).join(', ') || 'Items'}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {formatINR(order.total)}
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 font-medium">{order.payment_method}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={badge.variant} size="sm">
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 font-semibold text-xs transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail & Timeline Drawer */}
        <Drawer
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder?.order_number}`}
          description="Customer order details, item snapshots, and tracking history."
        >
          {selectedOrder && (
            <div className="space-y-6">
              
              {/* Quick Status Advance Control */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Update Fulfillment Status:
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="flex-1 text-xs rounded-lg border border-slate-300 p-2 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="placed">Placed (Order Received)</option>
                    <option value="packed">Packed (Ready for Dispatch)</option>
                    <option value="shipped">Shipped (In Transit)</option>
                    <option value="delivered">Delivered (Completed)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <p className="text-[10px] text-indigo-700 font-medium flex items-center gap-1">
                  <BellRing className="h-3 w-3" />
                  Selecting a status triggers simulated SMS/WhatsApp alerts.
                </p>
              </div>

              {/* Customer Details */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Shipping Destination
                </h4>
                <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-1 text-slate-700">
                  <p className="font-semibold text-slate-900">{selectedOrder.customer_name}</p>
                  <p>{selectedOrder.email} • {selectedOrder.phone}</p>
                  <p className="text-slate-500">{selectedOrder.address}</p>
                </div>
              </div>

              {/* Items Snapshot */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Items Ordered (Price Snapshot Guaranteed)
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-white text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{it.name_snapshot}</p>
                        <span className="text-slate-400 text-[11px]">Qty: {it.qty}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatINR(it.price_snapshot * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Event History */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Fulfillment Timeline
                </h4>
                <div className="space-y-3 border-l-2 border-indigo-200 pl-4 ml-1">
                  {selectedOrder.timeline?.map((ev, idx) => (
                    <div key={idx} className="relative text-xs space-y-0.5">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                      <p className="font-bold capitalize text-slate-900">{ev.status}</p>
                      <p className="text-slate-600 text-[11px]">{ev.note}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(ev.time).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </Drawer>

      </div>
    </AdminLayout>
  )
}
