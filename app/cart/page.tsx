'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/format';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    tax,
    deliveryFee,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (!inputCode.trim()) return;

    const valid = applyPromoCode(inputCode);
    if (valid) {
      setPromoSuccess(`Promo code ${inputCode.toUpperCase()} applied!`);
      setInputCode('');
    } else {
      setPromoError('Invalid coupon code. Try DEKITCHEN10 or GOURMET20');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-dark-900 border border-dark-700 flex items-center justify-center mx-auto text-dark-500">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-white">Your Cart is Empty</h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Looks like you haven&apos;t added any delicious gourmet burgers or artisan pizzas yet.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-dark-950 font-bold hover:bg-primary-hover shadow-glow transition"
        >
          <span>Explore Gourmet Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Review Your Order Cart
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order basket
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-accent-red transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear entire cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-dark-900 border border-dark-700/80 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 items-center justify-between hover:border-primary/40 transition"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-dark-800 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.name}
                  </h3>
                  
                  {item.selectedVariation && (
                    <span className="inline-block text-xs text-primary font-semibold">
                      {item.selectedVariation.selectedOption}
                    </span>
                  )}

                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-gray-400">
                      Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </p>
                  )}

                  {item.specialInstructions && (
                    <p className="text-xs text-amber-300 italic">
                      Note: &ldquo;{item.specialInstructions}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Price, Controls, and Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-dark-800">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-500 block">Unit: {formatPrice(item.unitPrice)}</span>
                  <span className="text-lg font-black text-white">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="p-2 text-gray-500 hover:text-accent-red transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping More Dishes</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="space-y-6">
          <div className="bg-dark-900 border border-dark-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white tracking-tight border-b border-dark-800 pb-4">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 block uppercase tracking-wider">
                Have a Promo Voucher?
              </label>

              {promoCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coupon {promoCode} active (-{formatPrice(discount)})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-gray-400 hover:text-white underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. DEKITCHEN10"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-700 text-xs font-bold text-white transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoError && <p className="text-xs text-red-400">{promoError}</p>}
              {promoSuccess && <p className="text-xs text-green-400">{promoSuccess}</p>}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-xs text-gray-300 pt-2 border-t border-dark-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Special Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Sales Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-primary font-bold">FREE (Orders Rs. 2,000+)</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-dark-800">
                <span>Estimated Total</span>
                <span className="text-2xl text-primary font-black">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-primary text-dark-950 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-hover shadow-glow transition transform hover:-translate-y-0.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-dark-500 text-center">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
