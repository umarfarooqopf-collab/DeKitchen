'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialMenuItems } from '@/lib/menuData';
import FoodCard from '@/components/FoodCard';
import {
  Flame,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Star,
  Quote,
  ShoppingBag,
  CalendarCheck,
  MapPin,
  Utensils,
  TreePine,
  PackageCheck,
  Truck,
} from 'lucide-react';

export default function HomePage() {
  const [selectedHeroImage, setSelectedHeroImage] = useState(
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'
  );

  const heroThumbnails = [
    {
      title: 'Charcoal BBQ Boti',
      url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Continental Chicken Steak',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Wok-Tossed Chow Mein',
      url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Cheesy Pepperoni Pizza',
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const featuredItems = initialMenuItems.slice(0, 6);

  const reviews = [
    {
      name: 'Dr. Farhan Tariq',
      role: 'University Town, Peshawar',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      comment:
        'De Kitchen never disappoints! The charcoal BBQ Tikka Boti and Continental Chicken Steak are extraordinary. Perfect outdoor dining ambiance on Old Jamrod Road.',
    },
    {
      name: 'Aiman Khan',
      role: 'Satisfied Customer',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      comment:
        'Fast home delivery in Peshawar! The Chicken Chow Mein and Kung Pao were piping hot and full of authentic Chinese flavours. Highly recommend De Kitchen!',
    },
    {
      name: 'Hamza Afridi',
      role: 'Food Enthusiast',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      comment:
        'They truly know the magic of flavour! Great beef seekh kebabs, creamy pasta, and outstanding customer service. Best family restaurant in town.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-primary" />
              <span>We Know the Magic of Flavour</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Chinese, Italian, Continental & <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-8">Live BBQ</span>.
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to <strong className="text-white">De Kitchen</strong>, Peshawar&apos;s premier dining destination. Indulge in sizzling charcoal BBQ, wok-fresh Chinese, gourmet Italian pizzas & pastas, and Continental steaks.
            </p>

            {/* Facilities Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-gray-300 font-medium">
              <span className="px-3 py-1 rounded-lg bg-dark-900 border border-dark-700 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-primary" /> Dine-in
              </span>
              <span className="px-3 py-1 rounded-lg bg-dark-900 border border-dark-700 flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5 text-green-400" /> Outdoor Seating
              </span>
              <span className="px-3 py-1 rounded-lg bg-dark-900 border border-dark-700 flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-blue-400" /> In-Store Collection
              </span>
              <span className="px-3 py-1 rounded-lg bg-dark-900 border border-dark-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-primary" /> Home Delivery
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-dark-950 font-black text-base flex items-center justify-center gap-3 hover:bg-primary-hover shadow-glow transition transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                <span>Order Online Now</span>
              </Link>

              <Link
                href="/contact#book"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-dark-900 border border-dark-700 text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-dark-800 hover:border-primary/40 transition"
              >
                <CalendarCheck className="w-5 h-5 text-primary" />
                <span>Book a Table</span>
              </Link>
            </div>

            {/* Location & Contact Highlight */}
            <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <MapPin className="w-4 h-4 text-primary" />
                20-A, Old Jamrod Road, University Town, Peshawar
              </span>
              <span className="hidden sm:inline text-dark-600">&bull;</span>
              <a href="tel:03344444767" className="text-primary hover:underline font-bold">
                📞 0334 4444767
              </a>
            </div>
          </div>

          {/* Right Hero Image & Switcher */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square rounded-3xl overflow-hidden bg-dark-900 border border-dark-700 shadow-2xl p-4 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-60 rounded-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedHeroImage}
                alt="De Kitchen Gourmet Showcase"
                className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700 shadow-inner"
              />
              
              <div className="absolute bottom-6 left-6 right-6 bg-dark-950/80 backdrop-blur-md border border-dark-700 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider block">Signature Special</span>
                  <span className="text-sm font-bold text-white">De Kitchen Peshawar Specialty</span>
                </div>
                <Link
                  href="/menu"
                  className="p-2 rounded-xl bg-primary text-dark-950 font-bold hover:bg-primary-hover transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Image Thumbnails */}
            <div className="flex items-center gap-3 mt-6">
              {heroThumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedHeroImage(thumb.url)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                    selectedHeroImage === thumb.url
                      ? 'border-primary scale-110 shadow-glow'
                      : 'border-dark-700 opacity-60 hover:opacity-100 hover:border-gray-500'
                  }`}
                  title={thumb.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.url}
                    alt={thumb.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 CUISINES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-primary font-black uppercase tracking-widest block mb-2">
            Multi-Cuisine Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our 4 Signature Cuisines
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Master chefs dedicated to authentic recipes across four distinct culinary worlds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-700 hover:border-primary/50 transition group hover:shadow-glow">
            <span className="text-3xl block mb-3">🥢</span>
            <h3 className="text-lg font-bold text-white mb-1.5">Chinese Cuisine</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Authentic wok-tossed chow mein, kung pao chicken, egg fried rice, and savory spring rolls.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-700 hover:border-primary/50 transition group hover:shadow-glow">
            <span className="text-3xl block mb-3">🍕</span>
            <h3 className="text-lg font-bold text-white mb-1.5">Italian Classics</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Artisan sourdough pepperoni pizzas, creamy chicken fettuccine alfredo, and rich pastas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-700 hover:border-primary/50 transition group hover:shadow-glow">
            <span className="text-3xl block mb-3">🥩</span>
            <h3 className="text-lg font-bold text-white mb-1.5">Continental Steaks</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Char-grilled chicken fillets, creamy wild mushroom sauces, and buttery mashed potatoes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-700 hover:border-primary/50 transition group hover:shadow-glow">
            <span className="text-3xl block mb-3">🍢</span>
            <h3 className="text-lg font-bold text-white mb-1.5">Live Charcoal BBQ</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sizzling chicken tikka boti, juicy beef seekh kebabs, roasted over glowing embers with fresh naan.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED GOURMET CREATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs text-primary font-black uppercase tracking-widest block mb-1">
              Top Customer Favorites
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Dishes
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover group"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* RESERVATION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-700 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              Indoor & Outdoor Garden Seating
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Reserve Your Table in University Town, Peshawar
            </h3>
            <p className="text-sm text-gray-300">
              Enjoy peaceful outdoor garden dining or cozy indoor seating on Old Jamrod Road. Ideal for family dinners, birthdays, and celebrations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/contact#book"
              className="px-8 py-4 rounded-2xl bg-primary text-dark-950 font-black text-center text-sm hover:bg-primary-hover transition shadow-glow"
            >
              Reserve a Table
            </Link>
            <a
              href="tel:03344444767"
              className="px-8 py-4 rounded-2xl border border-dark-700 text-white font-bold text-center text-sm hover:bg-dark-800 transition"
            >
              Call 0334 4444767
            </a>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs text-primary font-black uppercase tracking-widest block mb-2">
            Guest Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loved Across Peshawar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-dark-900 border border-dark-700/80 flex flex-col justify-between relative hover:border-primary/40 transition duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-dark-700" />
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-dark-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <span className="text-xs text-primary font-medium">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
