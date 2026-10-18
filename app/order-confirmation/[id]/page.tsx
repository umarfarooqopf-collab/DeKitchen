'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Order } from '@/types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  ArrowRight,
  Receipt,
  Loader2,
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error('Failed to load order confirmation:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-gray-400">Loading your order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-gray-400">Could not locate order #{orderId}.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-dark-950 font-bold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Construct WhatsApp notification message
  const whatsappText = encodeURIComponent(
    `🍔 *New Order Placed at De Kitchen!* 🍔\n` +
    `*Order ID:* ${order.id}\n` +
    `*Customer:* ${order.customer.name} (${order.customer.phone})\n` +
    `*Address:* ${order.customer.address}\n` +
    `*Total:* $${order.total.toFixed(2)} (${order.paymentMethod.replace('_', ' ')})\n` +
    `*Track Live:* ${typeof window !== 'undefined' ? window.location.origin : ''}/track-order?id=${order.id}`
  );
  const whatsappUrl = `https://wa.me/923139833396?text=${whatsappText}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Celebration Header */}
      <div className="text-center space-y-4 bg-dark-900 border border-dark-700/80 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-3xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400 animate-bounce">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs text-primary font-black uppercase tracking-widest block">
            Order Confirmed!
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Thank You For Ordering, {order.customer.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-gray-300 max-w-md mx-auto mt-2">
            Your gourmet order has been transmitted directly to our kitchen. Our chefs are preparing your food with passion.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="inline-flex items-center gap-3 bg-dark-800 border border-dark-700 px-5 py-2.5 rounded-2xl">
          <span className="text-xs text-gray-400 font-medium">Order Number:</span>
          <span className="text-base font-black text-primary font-mono">{order.id}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/track-order?id=${order.id}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary text-dark-950 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-hover shadow-glow transition"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status Live</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Order Summary & Receipt */}
      <div className="bg-dark-900 border border-dark-700/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-dark-800 pb-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Receipt className="w-5 h-5 text-primary" />
            <span>Official Order Receipt</span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-300">
          <div className="space-y-1">
            <span className="text-gray-500 uppercase font-semibold text-[10px] block">Customer</span>
            <p className="font-bold text-white text-sm">{order.customer.name}</p>
            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {order.customer.phone}</p>
            {order.customer.email && <p>{order.customer.email}</p>}
          </div>

          <div className="space-y-1">
            <span className="text-gray-500 uppercase font-semibold text-[10px] block">
              {order.orderType === 'delivery' ? 'Delivery Address' : 'Fulfillment'}
            </span>
            <p className="font-bold text-white text-sm flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{order.customer.address} ({order.customer.city})</span>
            </p>
            {order.customer.notes && (
              <p className="text-amber-300 italic">Notes: {order.customer.notes}</p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="border-t border-dark-800 pt-6 space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Dishes</h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white text-sm">{item.quantity}x {item.name}</span>
                  {item.selectedVariation && (
                    <span className="block text-primary text-[11px]">{item.selectedVariation.selectedOption}</span>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <span className="block text-gray-400 text-[11px]">
                      Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-bold text-white text-sm">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="border-t border-dark-800 pt-4 space-y-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Sales Tax (8%)</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-dark-800">
            <span>Grand Total</span>
            <span className="text-primary text-xl">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 pt-1">
            <span>Payment Method</span>
            <span className="capitalize">{order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})</span>
          </div>
        </div>
      </div>

    </div>
  );
}
