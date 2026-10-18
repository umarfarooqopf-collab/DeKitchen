'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Order, SalesSummary, OrderStatus } from '@/types';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  TrendingUp,
  ArrowRight,
  RotateCw,
  CheckCircle,
  Truck,
  ChefHat,
  AlertCircle,
  Phone,
  Eye,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds for live order stream
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.data : o))
        );
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Computations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
  ).length;

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Status breakdown
  const statusCounts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    preparing: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
  };
  orders.forEach((o) => {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status] += 1;
    }
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-6">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-wider block">
              Management Dashboard
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">
              Live Sales & Order Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchOrders(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-700 text-xs font-bold text-gray-300 hover:text-white hover:bg-dark-800 transition"
            >
              <RotateCw className={`w-3.5 h-3.5 text-primary ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Orders</span>
            </button>
            <Link
              href="/admin/orders"
              className="px-4 py-2.5 rounded-xl bg-primary text-dark-950 font-bold text-xs hover:bg-primary-hover shadow-glow transition"
            >
              Manage All Orders
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-900 border border-dark-700/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</span>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">${totalRevenue.toFixed(2)}</div>
            <p className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Calculated from all non-cancelled orders
            </p>
          </div>

          <div className="bg-dark-900 border border-dark-700/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{orders.length}</div>
            <p className="text-[11px] text-gray-400">Lifetime customer orders</p>
          </div>

          <div className="bg-dark-900 border border-dark-700/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kitchen Queue</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400">{activeOrdersCount}</div>
            <p className="text-[11px] text-amber-300 font-semibold">Active orders in progress</p>
          </div>

          <div className="bg-dark-900 border border-dark-700/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Order Value</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">${avgOrderValue.toFixed(2)}</div>
            <p className="text-[11px] text-gray-400">Per ticket average</p>
          </div>
        </div>

        {/* Order Status Breakdown Bar */}
        <div className="bg-dark-900 border border-dark-700/80 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Order Status Pipeline
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-dark-800 rounded-2xl border border-dark-700 text-center">
              <span className="text-xs text-gray-400 block font-medium">Pending</span>
              <span className="text-xl font-black text-yellow-400">{statusCounts.pending}</span>
            </div>
            <div className="p-3 bg-dark-800 rounded-2xl border border-dark-700 text-center">
              <span className="text-xs text-gray-400 block font-medium">Confirmed</span>
              <span className="text-xl font-black text-blue-400">{statusCounts.confirmed}</span>
            </div>
            <div className="p-3 bg-dark-800 rounded-2xl border border-dark-700 text-center">
              <span className="text-xs text-gray-400 block font-medium">Preparing</span>
              <span className="text-xl font-black text-orange-400">{statusCounts.preparing}</span>
            </div>
            <div className="p-3 bg-dark-800 rounded-2xl border border-dark-700 text-center">
              <span className="text-xs text-gray-400 block font-medium">Out for Delivery</span>
              <span className="text-xl font-black text-purple-400">{statusCounts.out_for_delivery}</span>
            </div>
            <div className="p-3 bg-dark-800 rounded-2xl border border-dark-700 text-center">
              <span className="text-xs text-gray-400 block font-medium">Delivered</span>
              <span className="text-xl font-black text-green-400">{statusCounts.delivered}</span>
            </div>
            <div className="p-3 bg-dark-800 rounded-2xl border border-dark-700 text-center">
              <span className="text-xs text-gray-400 block font-medium">Cancelled</span>
              <span className="text-xl font-black text-red-400">{statusCounts.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Recent Live Orders Stream */}
        <div className="bg-dark-900 border border-dark-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-dark-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Live Incoming Orders
              </h2>
              <p className="text-xs text-gray-400">Click action buttons to update status in real-time</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No orders recorded yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="bg-dark-850 border border-dark-700 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-white text-base">{order.id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300">
                      <span className="font-bold text-white">{order.customer.name}</span> &bull;{' '}
                      <span className="text-gray-400">{order.customer.phone}</span> &bull;{' '}
                      <span className="text-gray-400">{order.customer.address}</span>
                    </div>

                    <div className="text-xs text-gray-400">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-0 border-dark-800">
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Total</span>
                      <span className="text-lg font-black text-primary">${order.total.toFixed(2)}</span>
                    </div>

                    {/* Quick advance buttons based on current status */}
                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          className="px-3.5 py-2 rounded-xl bg-blue-500 text-dark-950 font-bold text-xs hover:bg-blue-400 transition"
                        >
                          Accept
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          className="px-3.5 py-2 rounded-xl bg-orange-500 text-dark-950 font-bold text-xs hover:bg-orange-400 transition"
                        >
                          Cook
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                          className="px-3.5 py-2 rounded-xl bg-purple-500 text-dark-950 font-bold text-xs hover:bg-purple-400 transition"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="px-3.5 py-2 rounded-xl bg-green-500 text-dark-950 font-bold text-xs hover:bg-green-400 transition"
                        >
                          Complete
                        </button>
                      )}

                      <Link
                        href={`/track-order?id=${order.id}`}
                        target="_blank"
                        className="p-2 rounded-xl border border-dark-700 text-gray-400 hover:text-white hover:bg-dark-800 transition"
                        title="View Public Tracker"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
