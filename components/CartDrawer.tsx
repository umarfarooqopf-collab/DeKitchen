'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/format';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-900 border-l border-dark-700 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-6 border-b border-dark-700 flex items-center justify-between bg-dark-850">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Your Cart</h2>
                <p className="text-xs text-dark-500 font-medium">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center text-dark-500 mb-4 border border-dark-700">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-400 max-w-xs mb-6">
                  Explore our handcrafted burgers, artisan pizzas, and gourmet sides!
                </p>
                <Link
                  href="/menu"
                  onClick={closeCartDrawer}
                  className="px-6 py-2.5 rounded-xl bg-primary text-dark-950 font-bold hover:bg-primary-hover transition shadow-glow"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-dark-800/80 rounded-2xl p-4 border border-dark-700 flex gap-4 transition hover:border-primary/40"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-white truncate pr-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-gray-500 hover:text-accent-red transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected Variation */}
                    {item.selectedVariation && (
                      <p className="text-xs text-primary font-medium mt-0.5">
                        {item.selectedVariation.selectedOption}
                      </p>
                    )}

                    {/* Add-ons */}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        +{item.selectedAddOns.map((a) => a.name).join(', ')}
                      </p>
                    )}

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>

                      <div className="flex items-center bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="px-2 py-1 text-gray-400 hover:text-white hover:bg-dark-700 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="px-2 py-1 text-gray-400 hover:text-white hover:bg-dark-700 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-dark-850 border-t border-dark-700 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-primary font-bold">FREE (Orders Rs. 2,000+)</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-dark-700">
                  <span>Total</span>
                  <span className="text-primary font-black">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="py-3 px-4 rounded-xl border border-dark-700 text-center text-xs font-semibold text-gray-200 hover:bg-dark-800 hover:text-white transition"
                >
                  View Cart Page
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="py-3 px-4 rounded-xl bg-primary text-dark-950 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-primary-hover transition shadow-glow"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
