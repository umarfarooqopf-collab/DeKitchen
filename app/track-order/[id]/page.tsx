'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OrderTimeline from '@/components/OrderTimeline';
import { Order } from '@/types';
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  RotateCw,
  AlertCircle,
  ShieldCheck,
  User,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

export default function DirectTrackOrderPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isSilent = false) => {
    if (!orderId) return;
    if (!isSilent) setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setOrder(null);
        setError(data.error || `Could not find order #${orderId}`);
      }
    } catch (err) {
      setError('Failed to query order tracking status. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 15 seconds for live status updates
    const interval = setInterval(() => fetchOrder(true), 15000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-gray-400">Loading order tracker #{orderId}...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-gray-400">{error || `We couldn't locate order #${orderId}.`}</p>
        <Link
          href="/track-order"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-dark-950 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Order Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/track-order"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition mb-3"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Search Another Order</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Live Tracking for #{order.id}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Auto-updates in real-time as the kitchen prepares and delivers your dishes.
        </p>
      </div>

      <div className="bg-dark-900 border border-dark-700/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white font-mono">{order.id}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'delivered'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                    : order.status === 'cancelled'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-primary/20 text-primary border border-primary/40 animate-pulse'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Ordered on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchOrder(true);
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-700 text-xs font-bold text-gray-300 hover:text-white hover:bg-dark-800 transition self-start sm:self-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 text-primary ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Timeline Visualizer */}
        <OrderTimeline status={order.status} timeline={order.timeline || []} />

        {/* Dispatch details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-800">
          <div className="bg-dark-850 border border-dark-700 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Assigned Courier
            </span>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Rashid Ahmed</h4>
                <p className="text-xs text-gray-400">Thermal insulated fleet bike</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-850 border border-dark-700 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Destination
            </span>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">{order.customer.name}</h4>
                <p className="text-xs text-gray-300">{order.customer.address}</p>
                <p className="text-xs text-gray-500">{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dishes list */}
        <div className="pt-4 border-t border-dark-800 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Order Contents ({order.items.length} items)
          </h4>
          <div className="space-y-2">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-dark-800/60 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-dark-800 text-white flex items-center justify-center font-bold text-[10px]">
                    {i.quantity}x
                  </span>
                  <span className="text-white font-medium">{i.name}</span>
                  {i.selectedVariation && (
                    <span className="text-[11px] text-primary">({i.selectedVariation.selectedOption})</span>
                  )}
                </div>
                <span className="font-bold text-white">${(i.unitPrice * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-base font-black text-white pt-2">
            <span>Total Paid</span>
            <span className="text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
