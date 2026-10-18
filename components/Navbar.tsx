'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { UtensilsCrossed, ShoppingBag, Menu, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCartDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Contact & Booking', href: '/contact' },
    { label: 'Track Order', href: '/track-order' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/95 backdrop-blur-md border-b border-dark-700/80 py-3 shadow-xl'
          : 'bg-dark-950/80 backdrop-blur-sm py-4 border-b border-dark-700/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center space-x-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo.png"
            alt="De Kitchen Logo"
            className="w-11 h-11 object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-primary transition">
              De Kitchen<span className="text-primary">.</span>
            </span>
            <span className="text-[9.5px] uppercase tracking-wider text-primary font-semibold -mt-1 hidden sm:block">
              We Know the Magic of Flavour
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10 font-semibold shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Cart & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Admin shortcut icon */}
          <Link
            href="/admin"
            title="Admin Portal"
            className="p-2.5 rounded-xl border border-dark-700 text-gray-400 hover:text-primary hover:border-primary/40 transition hidden sm:flex items-center"
          >
            <ShieldAlert className="w-4 h-4" />
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCartDrawer}
            className="relative p-2.5 rounded-xl bg-dark-900 border border-dark-700 text-white hover:border-primary/50 hover:text-primary transition flex items-center justify-center group"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-dark-950 text-xs font-black rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center animate-pulse shadow-glow">
                {itemCount}
              </span>
            )}
          </button>

          {/* Book Table Button */}
          <Link
            href="/contact#book"
            className="hidden lg:inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-dark-950 hover:bg-primary-hover shadow-glow transition transform hover:-translate-y-0.5"
          >
            Book a Table
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-700 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                  isActive
                    ? 'text-primary bg-primary/10 font-bold'
                    : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-dark-700 flex flex-col space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white flex items-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>Admin Dashboard</span>
            </Link>
            <Link
              href="/contact#book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-primary text-dark-950 font-bold text-sm shadow-glow"
            >
              Book a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
