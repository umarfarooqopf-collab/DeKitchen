import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Truck,
  HeartHandshake,
  UtensilsCrossed,
  MapPin,
  TreePine,
  Utensils,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Hero / Brand Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Media */}
        <div className="relative rounded-3xl overflow-hidden bg-dark-900 border border-dark-700 shadow-2xl aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
            alt="Master Chefs at De Kitchen Peshawar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-70" />
          
          <div className="absolute bottom-6 left-6 right-6 bg-dark-900/90 backdrop-blur-md border border-dark-700 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">De Kitchen Peshawar</h4>
                <p className="text-xs text-gray-400">20-A, Old Jamrod Road, University Town</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              Est. 2018
            </span>
          </div>
        </div>

        {/* Right Story */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-primary" />
            <span>We Know the Magic of Flavour</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Peshawar&apos;s Multi-Cuisine <span className="text-primary">Culinary Haven</span>
          </h1>

          <p className="text-base text-gray-300 leading-relaxed">
            At <strong className="text-white">De Kitchen</strong>, we believe every meal should be a memorable celebration of taste. Established in University Town, Peshawar, we bring together four diverse culinary traditions under one roof: authentic wok-fresh <strong className="text-white">Chinese</strong>, artisanal <strong className="text-white">Italian</strong> sourdough & pasta, gourmet <strong className="text-white">Continental</strong> steaks, and live charcoal <strong className="text-white">BBQ</strong>.
          </p>

          <p className="text-sm text-gray-400 leading-relaxed">
            Whether you choose to unwind in our charming outdoor garden seating, enjoy our cozy indoor family dining, pick up takeaway on Old Jamrod Road, or order fast home delivery to your doorstep, our team guarantees unmatched freshness and hospitality.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-dark-900 border border-dark-700/80 rounded-xl text-center">
              <span className="text-xs text-primary font-bold block">Chinese</span>
              <span className="text-[11px] text-gray-400">Wok Specialties</span>
            </div>
            <div className="p-3 bg-dark-900 border border-dark-700/80 rounded-xl text-center">
              <span className="text-xs text-primary font-bold block">Italian</span>
              <span className="text-[11px] text-gray-400">Pizzas & Pastas</span>
            </div>
            <div className="p-3 bg-dark-900 border border-dark-700/80 rounded-xl text-center">
              <span className="text-xs text-primary font-bold block">Continental</span>
              <span className="text-[11px] text-gray-400">Gourmet Steaks</span>
            </div>
            <div className="p-3 bg-dark-900 border border-dark-700/80 rounded-xl text-center">
              <span className="text-xs text-primary font-bold block">Live BBQ</span>
              <span className="text-[11px] text-gray-400">Charcoal Sizzler</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-2xl bg-primary text-dark-950 font-bold hover:bg-primary-hover shadow-glow transition"
            >
              Explore Full Menu
            </Link>
            <Link
              href="/contact#book"
              className="px-8 py-3.5 rounded-2xl border border-dark-700 text-white font-bold hover:bg-dark-800 transition"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </div>

      {/* Facilities & Services */}
      <div className="bg-dark-900 border border-dark-700/80 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Our Facilities & Dining Services
          </h2>
          <p className="text-xs text-gray-400">
            Designed to give you the ultimate culinary comfort in University Town, Peshawar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-700 space-y-2">
            <Utensils className="w-6 h-6 text-primary" />
            <h4 className="text-sm font-bold text-white">Indoor Dine-in</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Warm, air-conditioned seating perfect for family gatherings, business lunches, and dinners.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-700 space-y-2">
            <TreePine className="w-6 h-6 text-green-400" />
            <h4 className="text-sm font-bold text-white">Outdoor Garden Seating</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Open-air garden terrace with fresh breezes and live charcoal aromas under the evening stars.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-700 space-y-2">
            <PackageCheck className="w-6 h-6 text-blue-400" />
            <h4 className="text-sm font-bold text-white">In-Store Collection</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Quick takeaway service on Old Jamrod Road with designated express collection counters.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-700 space-y-2">
            <Truck className="w-6 h-6 text-primary" />
            <h4 className="text-sm font-bold text-white">Home Delivery</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hot and prompt home delivery across Peshawar with thermal insulation packing.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
