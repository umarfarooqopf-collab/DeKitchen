'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/types';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/format';
import { Star, Clock, Plus, Check, SlidersHorizontal } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export default function FoodCard({ item }: FoodCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!item.inStock) return;

    // Use default variation if any
    const defaultVariation = item.variations && item.variations.length > 0
      ? {
          name: item.variations[0].name,
          selectedOption: item.variations[0].options[0].label,
          priceDelta: item.variations[0].options[0].priceDelta,
        }
      : undefined;

    addItem({
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      unitPrice: item.price + (defaultVariation?.priceDelta || 0),
      quantity: 1,
      image: item.image,
      category: item.category,
      selectedVariation: defaultVariation,
      selectedAddOns: [],
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="group bg-dark-900 border border-dark-700/80 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col justify-between hover:shadow-glow">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />

        {/* Badge */}
        {item.badge && (
          <span className="absolute top-3 left-3 bg-primary text-dark-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
            {item.badge}
          </span>
        )}

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-3 right-3 bg-dark-950/80 backdrop-blur-md border border-dark-700 px-2.5 py-1 rounded-full flex items-center space-x-1 text-xs font-semibold text-white">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{item.rating}</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-dark-950/85 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-dark-500 mb-1">
            <span className="capitalize font-medium text-primary/90">{item.category}</span>
            {item.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.prepTime}
              </span>
            )}
          </div>

          <Link href={`/menu/${item.id}`} className="block group-hover:text-primary transition">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {item.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Pricing & Add Actions */}
        <div className="pt-3 border-t border-dark-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              {formatPrice(item.price)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Customize / Details button */}
            <Link
              href={`/menu/${item.id}`}
              className="p-2.5 rounded-xl border border-dark-700 text-gray-300 hover:text-white hover:border-primary/50 hover:bg-dark-800 transition"
              title="Customize variations & add-ons"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Link>

            {/* Quick Add to Cart */}
            <button
              onClick={handleQuickAdd}
              disabled={!item.inStock}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                !item.inStock
                  ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                  : isAdded
                  ? 'bg-green-500 text-dark-950 font-black'
                  : 'bg-primary text-dark-950 hover:bg-primary-hover shadow-glow'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
