'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/format';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Building2,
  Truck,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { PaymentMethod, OrderType } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, deliveryFee, discount, promoCode, total, clearCart } = useCart();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Downtown');
  const [notes, setNotes] = useState('');

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  // Mock Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!name.trim() || !phone.trim() || (orderType === 'delivery' && !address.trim())) {
      setErrorMessage('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: orderType === 'delivery' ? address.trim() : 'Pickup at Restaurant',
          city,
          notes: notes.trim(),
        },
        orderType,
        paymentMethod,
        promoCode: promoCode || undefined,
        items,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      const createdOrder = data.data;

      // Clear the cart
      clearCart();

      // Redirect to confirmation page
      router.push(`/order-confirmation/${createdOrder.id}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong while submitting your order.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-gray-400">Add some food to your cart before proceeding to checkout.</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-dark-950 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition mb-3"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Secure Online Checkout
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Complete your delivery details and choose how you&apos;d like to pay.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Form Inputs (Customer & Delivery & Payment) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Type Toggle (Delivery vs Pickup) */}
          <div className="bg-dark-900 border border-dark-700/80 p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide">
              1. Fulfillment Type
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-primary/10 border-primary text-white shadow-glow'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Doorstep Delivery</h4>
                  <p className="text-xs text-gray-400">Direct to your home or office</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  orderType === 'pickup'
                    ? 'bg-primary/10 border-primary text-white shadow-glow'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Building2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Self Pickup</h4>
                  <p className="text-xs text-gray-400">Collect fresh from kitchen</p>
                </div>
              </button>
            </div>
          </div>

          {/* Customer Contact Details */}
          <div className="bg-dark-900 border border-dark-700/80 p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-lg font-bold text-white tracking-wide">
              2. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  Email Address (for Receipt)
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address (only if delivery chosen) */}
          {orderType === 'delivery' && (
            <div className="bg-dark-900 border border-dark-700/80 p-6 sm:p-8 rounded-3xl space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold text-white tracking-wide">
                3. Delivery Address
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    Street Address & House/Apartment No. <span className="text-primary">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Delivery Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Ring bell 4B or leave at gate"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="bg-dark-900 border border-dark-700/80 p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {orderType === 'delivery' ? '4. Payment Method' : '3. Payment Method'}
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'bg-primary/10 border-primary text-white shadow-glow'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Cash on Delivery / Pickup</h4>
                    <p className="text-xs text-gray-400">Pay with cash when your food arrives</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-primary bg-primary'
                      : 'border-dark-500'
                  }`}
                />
              </button>

              {/* Credit / Debit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-primary/10 border-primary text-white shadow-glow'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Credit / Debit Card</h4>
                    <p className="text-xs text-gray-400">Visa, Mastercard, American Express</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-dark-500'
                  }`}
                />
              </button>

              {/* Card Inputs if Card chosen */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-dark-850 rounded-2xl border border-dark-700 space-y-3 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-semibold">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-400 font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-400 font-semibold">CVC / CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-green-400" />
                    <span>Test mode enabled: Any card details will validate for demonstration.</span>
                  </p>
                </div>
              )}

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-primary/10 border-primary text-white shadow-glow'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Online Bank Transfer</h4>
                    <p className="text-xs text-gray-400">Transfer directly to De Kitchen account</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-primary bg-primary'
                      : 'border-dark-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="space-y-6">
          <div className="bg-dark-900 border border-dark-700/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl sticky top-28">
            <h3 className="text-xl font-bold text-white tracking-tight border-b border-dark-800 pb-4">
              Order Summary
            </h3>

            {/* Quick Items List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((i) => (
                <div key={i.cartItemId} className="flex justify-between text-xs text-gray-300">
                  <div className="pr-2">
                    <span className="font-semibold text-white">{i.quantity}x</span> {i.name}
                    {i.selectedVariation && (
                      <span className="block text-[11px] text-primary">{i.selectedVariation.selectedOption}</span>
                    )}
                  </div>
                  <span className="font-semibold text-white flex-shrink-0">
                    ${(i.unitPrice * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="space-y-2 text-xs text-gray-300 pt-4 border-t border-dark-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {orderType === 'pickup' || deliveryFee === 0 ? (
                    <span className="text-primary font-bold">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-dark-800">
                <span>Grand Total</span>
                <span className="text-2xl text-primary font-black">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-dark-950 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-hover shadow-glow transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting Order to Kitchen...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm & Place Order (${total.toFixed(2)})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-500 text-center leading-normal">
              By confirming, your order is instantly sent to the De Kitchen preparation queue.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
