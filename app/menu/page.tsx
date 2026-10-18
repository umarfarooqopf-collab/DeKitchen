'use client';

import React, { useState, useMemo } from 'react';
import { initialMenuItems } from '@/lib/menuData';
import FoodCard from '@/components/FoodCard';
import { FoodCategory } from '@/types';
import { Search, SlidersHorizontal, Utensils, Sparkles } from 'lucide-react';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories: { key: FoodCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'All Items', icon: '🍽️' },
    { key: 'bbq', label: 'Live BBQ', icon: '🍢' },
    { key: 'chinese', label: 'Chinese', icon: '🥢' },
    { key: 'continental', label: 'Continental', icon: '🥩' },
    { key: 'italian', label: 'Italian', icon: '🍕' },
    { key: 'burgers', label: 'Burgers', icon: '🍔' },
    { key: 'sides', label: 'Loaded Sides', icon: '🍟' },
    { key: 'drinks', label: 'Drinks & Shakes', icon: '🥤' },
    { key: 'desserts', label: 'Desserts', icon: '🍰' },
  ];

  const filteredItems = useMemo(() => {
    return initialMenuItems
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>We Know the Magic of Flavour</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          De Kitchen Menu
        </h1>
        <p className="text-sm text-gray-400">
          Browse our Chinese wok specialties, artisan Italian pastas & pizzas, Continental steaks, and sizzling charcoal BBQ.
        </p>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-dark-900 border border-dark-700/80 p-4 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tikka, chow mein, steak, pizza..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="text-xs text-gray-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-primary"
          >
            <option value="featured">Featured / Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-dark-950 shadow-glow scale-105'
                  : 'bg-dark-900 border border-dark-700 text-gray-300 hover:text-white hover:border-gray-500'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-dark-900/50 rounded-3xl border border-dark-800">
          <Utensils className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No dishes found</h3>
          <p className="text-xs text-gray-400 mb-6">
            We couldn&apos;t find any dish matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 rounded-xl bg-primary text-dark-950 font-bold text-xs shadow-glow"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
