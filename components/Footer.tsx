import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Phone, Mail, MapPin, ArrowRight, Heart, Clock, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-700/80 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logo.png"
                alt="De Kitchen Logo"
                className="w-12 h-12 object-contain rounded-xl"
              />
              <span className="text-2xl font-black text-white">
                De Kitchen<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-xs text-primary font-bold uppercase tracking-wider">
              &ldquo;We Know the Magic of Flavour&rdquo;
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Serving Peshawar the finest Chinese, authentic Italian, rich Continental steaks, and sizzling live charcoal BBQ.
            </p>
            <div className="pt-1 text-xs text-amber-400 flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Hours: 11:00 AM – 11:00 PM (Daily)</span>
            </div>
          </div>

          {/* Cuisines & Facilities */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Cuisines & Dining</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-primary" /> Authentic Chinese & Wok</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-primary" /> Italian Sourdough & Pastas</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-primary" /> Continental Gourmet Steaks</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-primary" /> Live Charcoal Sizzling BBQ</li>
            </ul>

            <div className="pt-2 border-t border-dark-800">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1.5">Facilities:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-300">
                <span className="bg-dark-800 px-2 py-0.5 rounded-md border border-dark-700">Dine-in</span>
                <span className="bg-dark-800 px-2 py-0.5 rounded-md border border-dark-700">Outdoor seating</span>
                <span className="bg-dark-800 px-2 py-0.5 rounded-md border border-dark-700">In-store collection</span>
                <span className="bg-dark-800 px-2 py-0.5 rounded-md border border-dark-700">Home delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Full Menu & Ordering
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact#book" className="hover:text-primary transition flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Reserve a Table
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-primary transition flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Visit & Order</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:03344444767"
                  className="hover:text-primary transition flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-bold text-white">0334 4444767</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923344444767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition flex items-center gap-2.5 text-[#25D366]"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>WhatsApp: 0334 4444767</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:dekitchen2018@gmail.com"
                  className="hover:text-primary transition flex items-center gap-2.5"
                >
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs">dekitchen2018@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-gray-300">
                  20-A, Old Jamrod Road, University Town, Peshawar, Pakistan
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} De Kitchen &bull; Peshawar, Pakistan. All rights reserved.</p>
          <p className="flex items-center gap-1">
            We Know the Magic of Flavour
          </p>
        </div>
      </div>
    </footer>
  );
}
