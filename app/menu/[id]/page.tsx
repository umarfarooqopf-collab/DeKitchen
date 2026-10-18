'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { initialMenuItems } from '@/lib/menuData';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/format';
import FoodCard from '@/components/FoodCard';
import {
  Star,
  Clock,
  Flame,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { AddOn, VariationOption } from '@/types';

export default function FoodDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem } = useCart();

  const item = initialMenuItems.find((m) => m.id === id);

  // Variations State
  const [selectedVariationOption, setSelectedVariationOption] = useState<{
    groupName: string;
    option: VariationOption;
  } | null>(() => {
    if (item?.variations && item.variations.length > 0) {
      return {
        groupName: item.variations[0].name,
        option: item.variations[0].options[0],
      };
    }
    return null;
  });

  // Selected Add-ons State
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Item Not Found</h2>
        <p className="text-gray-400">The dish you are looking for is unavailable or has been removed.</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-dark-950 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
      </div>
    );
  }

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addOn.id);
      if (exists) {
        return prev.filter((a) => a.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  // Calculate Unit Price based on base + variation delta + add-ons
  const unitPrice = useMemo(() => {
    let price = item.price;
    if (selectedVariationOption) {
      price += selectedVariationOption.option.priceDelta;
    }
    const addOnsSum = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return Number((price + addOnsSum).toFixed(2));
  }, [item.price, selectedVariationOption, selectedAddOns]);

  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleAddToCart = () => {
    if (!item.inStock) return;

    addItem({
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      unitPrice,
      quantity,
      image: item.image,
      category: item.category,
      selectedVariation: selectedVariationOption
        ? {
            name: selectedVariationOption.groupName,
            selectedOption: selectedVariationOption.option.label,
            priceDelta: selectedVariationOption.option.priceDelta,
          }
        : undefined,
      selectedAddOns,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const relatedItems = initialMenuItems
    .filter((m) => m.category === item.category && m.id !== item.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Back button */}
      <div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Back to Gourmet Menu</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Product Media Gallery */}
        <div className="space-y-4 lg:sticky lg:top-28">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-dark-900 border border-dark-700 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60" />

            {item.badge && (
              <span className="absolute top-4 left-4 bg-primary text-dark-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                {item.badge}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-dark-900 border border-dark-700/80 p-3 rounded-2xl text-center">
              <span className="text-xs text-dark-500 block">Prep Time</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {item.prepTime || '15-20 min'}
              </span>
            </div>
            <div className="bg-dark-900 border border-dark-700/80 p-3 rounded-2xl text-center">
              <span className="text-xs text-dark-500 block">Calories</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                {item.calories || '650 kcal'}
              </span>
            </div>
            <div className="bg-dark-900 border border-dark-700/80 p-3 rounded-2xl text-center">
              <span className="text-xs text-dark-500 block">Guest Rating</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {item.rating} ({item.reviewsCount})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Customization Form */}
        <div className="space-y-8 bg-dark-900 border border-dark-700/80 p-6 sm:p-8 rounded-3xl shadow-xl">
          
          {/* Title & Description */}
          <div className="space-y-2 border-b border-dark-800 pb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              {item.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {item.name}
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed pt-1">
              {item.description}
            </p>
          </div>

          {/* Variations Selection (e.g. Size, Crust, Spice) */}
          {item.variations && item.variations.length > 0 && (
            <div className="space-y-4 border-b border-dark-800 pb-6">
              {item.variations.map((group) => (
                <div key={group.name} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-white tracking-wide">
                      Select {group.name}
                    </label>
                    <span className="text-xs text-dark-500">Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.options.map((opt) => {
                      const isSelected =
                        selectedVariationOption?.groupName === group.name &&
                        selectedVariationOption.option.label === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() =>
                            setSelectedVariationOption({
                              groupName: group.name,
                              option: opt,
                            })
                          }
                          className={`p-3.5 rounded-2xl text-left border text-xs font-semibold flex justify-between items-center transition-all ${
                            isSelected
                              ? 'bg-primary/10 border-primary text-white shadow-glow'
                              : 'bg-dark-800 border-dark-700 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-primary font-bold">
                            {opt.priceDelta > 0 ? `+${formatPrice(opt.priceDelta)}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add-ons Selection */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="space-y-4 border-b border-dark-800 pb-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white tracking-wide">
                  Optional Gourmet Add-ons
                </label>
                <span className="text-xs text-dark-500">Multiple selection</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.addOns.map((addOn) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      type="button"
                      onClick={() => toggleAddOn(addOn)}
                      className={`p-3.5 rounded-2xl text-left border text-xs font-semibold flex justify-between items-center transition-all ${
                        isChecked
                          ? 'bg-primary/10 border-primary text-white shadow-glow'
                          : 'bg-dark-800 border-dark-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'bg-primary border-primary text-dark-950'
                              : 'border-dark-500 bg-dark-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addOn.name}</span>
                      </div>
                      <span className="text-primary font-bold">
                        +{formatPrice(addOn.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div className="space-y-2 border-b border-dark-800 pb-6">
            <label className="text-sm font-bold text-white tracking-wide block">
              Special Kitchen Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Extra napkins, no pickles, sauce on the side..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Quantity & Final Add to Cart Button */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Quantity</span>
                <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl overflow-hidden mt-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-gray-400 hover:text-white hover:bg-dark-700 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-gray-400 hover:text-white hover:bg-dark-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block font-medium">Total Price</span>
                <span className="text-3xl font-black text-primary tracking-tight">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!item.inStock}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                !item.inStock
                  ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                  : isAdded
                  ? 'bg-green-500 text-dark-950 shadow-glow'
                  : 'bg-primary text-dark-950 hover:bg-primary-hover shadow-glow transform hover:-translate-y-0.5'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  <span>Add {quantity} to Cart &bull; {formatPrice(totalPrice)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-dark-800">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((rel) => (
              <FoodCard key={rel.id} item={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
