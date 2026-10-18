'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Order, OrderStatus } from '@/types';
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Clock,
  RotateCw,
  MessageCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to retrieve orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: `Manager changed status to ${newStatus.replace('_', ' ')}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.data : o))
        );
      }
    } catch (err) {
      console.error('Error changing status:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.address.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const filterTabs: { key: 'all' | OrderStatus; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-6">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-wider block">
              Order Fulfillment
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">
              Live Order Management ({filteredOrders.length})
            </h1>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchOrders(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-700 text-xs font-bold text-gray-300 hover:text-white hover:bg-dark-800 transition self-start sm:self-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 text-primary ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Toolbar: Search and Status Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone, or Street Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.key;
              const count =
                tab.key === 'all'
                  ? orders.length
                  : orders.filter((o) => o.status === tab.key).length;

              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-primary text-dark-950 shadow-glow'
                      : 'bg-dark-900 border border-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? 'bg-dark-950 text-white' : 'bg-dark-800 text-gray-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading order registry...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-dark-900 border border-dark-800 rounded-3xl space-y-2">
            <h3 className="text-base font-bold text-white">No matching orders found</h3>
            <p className="text-xs text-gray-500">Try adjusting your search query or filter tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-dark-900 border border-dark-700/80 rounded-3xl overflow-hidden hover:border-primary/40 transition shadow-lg"
                >
                  {/* Top Bar Summary */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-white text-lg">{order.id}</span>
                        
                        {/* Status Dropdown */}
                        <select
                          value={order.status}
                          disabled={statusUpdatingId === order.id}
                          onChange={(e: any) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl border focus:outline-none transition ${
                            order.status === 'delivered'
                              ? 'bg-green-500/20 text-green-400 border-green-500/40'
                              : order.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : 'bg-primary/20 text-primary border-primary/40'
                          }`}
                        >
                          <option value="pending" className="bg-dark-900 text-white">Pending</option>
                          <option value="confirmed" className="bg-dark-900 text-white">Confirmed</option>
                          <option value="preparing" className="bg-dark-900 text-white">Preparing (Kitchen)</option>
                          <option value="out_for_delivery" className="bg-dark-900 text-white">Out for Delivery</option>
                          <option value="delivered" className="bg-dark-900 text-white">Delivered</option>
                          <option value="cancelled" className="bg-dark-900 text-white">Cancelled</option>
                        </select>

                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs text-gray-300">
                        <span className="font-bold text-white text-sm">{order.customer.name}</span>
                        <span className="mx-2 text-dark-500">&bull;</span>
                        <span className="text-gray-400">{order.customer.phone}</span>
                        <span className="mx-2 text-dark-500">&bull;</span>
                        <span className="text-gray-400">{order.customer.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-0 border-dark-800">
                      <div className="text-right">
                        <span className="text-[11px] text-gray-500 block uppercase font-medium">Grand Total</span>
                        <span className="text-xl font-black text-primary">${order.total.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Direct WhatsApp Callout */}
                        <a
                          href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(order.customer.name)},%20this%20is%20De%20Kitchen%20regarding%20order%20${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition"
                          title="Message customer on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="p-2.5 rounded-xl border border-dark-700 text-gray-300 hover:text-white hover:bg-dark-800 transition flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <span>{isExpanded ? 'Hide' : 'Details'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details Accordion */}
                  {isExpanded && (
                    <div className="p-6 bg-dark-850 border-t border-dark-800 space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        
                        {/* Customer & Delivery Full Card */}
                        <div className="space-y-3 bg-dark-900 border border-dark-700 p-4 rounded-2xl">
                          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Customer & Delivery Info
                          </h4>
                          <div className="space-y-1.5 text-gray-300">
                            <p><strong className="text-white">Name:</strong> {order.customer.name}</p>
                            <p><strong className="text-white">Phone:</strong> {order.customer.phone}</p>
                            {order.customer.email && <p><strong className="text-white">Email:</strong> {order.customer.email}</p>}
                            <p><strong className="text-white">Address:</strong> {order.customer.address}</p>
                            <p><strong className="text-white">City:</strong> {order.customer.city || 'Downtown'}</p>
                            {order.customer.notes && (
                              <p className="text-amber-300 italic"><strong className="text-white">Notes:</strong> {order.customer.notes}</p>
                            )}
                            <p><strong className="text-white">Type:</strong> <span className="capitalize">{order.orderType}</span></p>
                            <p><strong className="text-white">Payment:</strong> <span className="capitalize">{order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})</span></p>
                          </div>
                        </div>

                        {/* Order Timeline History */}
                        <div className="space-y-3 bg-dark-900 border border-dark-700 p-4 rounded-2xl">
                          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Status Change Log
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {order.timeline?.map((evt, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                                <div>
                                  <span className="font-bold text-white capitalize">{evt.status.replace(/_/g, ' ')}</span>
                                  <span className="text-gray-500 text-[10px] ml-2">
                                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <p className="text-gray-400">{evt.note}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                          Items Ordered ({order.items.length})
                        </h4>
                        <div className="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden divide-y divide-dark-800">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-white text-sm">{i.quantity}x {i.name}</span>
                                {i.selectedVariation && (
                                  <span className="text-primary block text-[11px] font-medium">
                                    Option: {i.selectedVariation.selectedOption}
                                  </span>
                                )}
                                {i.selectedAddOns && i.selectedAddOns.length > 0 && (
                                  <span className="text-gray-400 block text-[11px]">
                                    Add-ons: {i.selectedAddOns.map((a) => a.name).join(', ')}
                                  </span>
                                )}
                                {i.specialInstructions && (
                                  <span className="text-amber-300 block text-[11px] italic">
                                    Kitchen Note: {i.specialInstructions}
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-white text-sm">
                                ${(i.unitPrice * i.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Recap */}
                      <div className="flex justify-between items-center pt-2 text-xs text-gray-400 border-t border-dark-800">
                        <div>
                          Subtotal: ${order.subtotal.toFixed(2)} | Tax: ${order.tax.toFixed(2)} | Delivery: ${order.deliveryFee.toFixed(2)}
                          {order.discount > 0 && ` | Discount: -$${order.discount.toFixed(2)}`}
                        </div>
                        <Link
                          href={`/track-order?id=${order.id}`}
                          target="_blank"
                          className="text-primary hover:underline font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Public Tracking Page</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
