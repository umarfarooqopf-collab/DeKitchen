'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderTimeline from '@/components/OrderTimeline';
import { Order } from '@/types';
import {
  Search,
  Truck,
  Phone,
  MapPin,
  Clock,
  RotateCw,
  AlertCircle,
  ShieldCheck,
  User,
  ShoppingBag,
} from 'lucide-react';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (id: string, isSilent = false) => {
    if (!id.trim()) return;
    if (!isSilent) setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setOrder(null);
        setError(data.error || `No order found with ID #${id}`);
      }
    } catch (err) {
      setError('Failed to query order tracking status. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderIdInput);
  };

  const handleRefresh = () => {
    if (order) {
      setRefreshing(true);
      fetchOrder(order.id, true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Kitchen Dispatch</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Track Your Order
        </h1>
        <p className="text-sm text-gray-400">
          Enter your Order ID (e.g. DK-78241) to monitor live cooking status and courier progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-dark-900 border border-dark-700/80 p-4 sm:p-6 rounded-3xl shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. DK-78241)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-primary text-dark-950 font-black text-sm hover:bg-primary-hover shadow-glow transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-dark-900 border border-dark-700/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl animate-fadeIn">
          
          {/* Header of Active Order */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{order.id}</span>
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
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-700 text-xs font-bold text-gray-300 hover:text-white hover:bg-dark-800 transition self-start sm:self-auto"
            >
              <RotateCw className={`w-3.5 h-3.5 text-primary ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Timeline Visualizer */}
          <OrderTimeline status={order.status} timeline={order.timeline || []} />

          {/* Delivery & Driver Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-800">
            {/* Courier Dispatch Card */}
            <div className="bg-dark-850 border border-dark-700 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Assigned Delivery Rider
                </span>
                <span className="text-xs text-green-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> De Kitchen Fleet
                </span>
              </div>

              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rashid Ahmed</h4>
                  <p className="text-xs text-gray-400">Thermal insulated bike courier</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-dark-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Est: {order.estimatedDeliveryTime || '30-45 mins'}
                </span>
                <a
                  href="tel:+923139833396"
                  className="text-primary hover:underline font-bold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Rider
                </a>
              </div>
            </div>

            {/* Destination Info */}
            <div className="bg-dark-850 border border-dark-700 p-5 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Delivery Destination
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

          {/* Ordered Dishes Recap */}
          <div className="pt-4 border-t border-dark-800 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Dishes in This Order ({order.items.length})
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

            <div className="flex justify-between text-sm font-black text-white pt-2">
              <span>Total Paid</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>

        </div>
      )}

      {/* Demo helper notice */}
      <div className="p-4 bg-dark-900 border border-dark-800 rounded-2xl text-center text-xs text-gray-400">
        💡 <span className="font-semibold text-gray-300">Try demo order IDs:</span>{' '}
        <button
          onClick={() => {
            setOrderIdInput('DK-78241');
            fetchOrder('DK-78241');
          }}
          className="text-primary underline font-mono ml-1 mr-2"
        >
          DK-78241
        </button>
        or
        <button
          onClick={() => {
            setOrderIdInput('DK-39120');
            fetchOrder('DK-39120');
          }}
          className="text-primary underline font-mono ml-2"
        >
          DK-39120
        </button>
      </div>

    </div>
  );
}
