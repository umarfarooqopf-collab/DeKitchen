'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  total: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'de_kitchen_nextjs_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, 'cartItemId'>) => {
    const variationKey = item.selectedVariation ? item.selectedVariation.selectedOption : 'none';
    const addOnsKey = item.selectedAddOns?.map((a) => a.id).sort().join(',') || 'none';
    const instructionsKey = item.specialInstructions?.trim() || '';
    const cartItemId = `${item.menuItemId}-${variationKey}-${addOnsKey}-${instructionsKey}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, cartItemId }];
    });

    setIsCartDrawerOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setPromoDiscountRate(0);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'DEKITCHEN10' || normalized === 'SAVE10') {
      setPromoCode(normalized);
      setPromoDiscountRate(0.10); // 10% off
      return true;
    } else if (normalized === 'GOURMET20') {
      setPromoCode(normalized);
      setPromoDiscountRate(0.20); // 20% off
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscountRate(0);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      Number(
        items
          .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
          .toFixed(2)
      ),
    [items]
  );

  const discount = useMemo(
    () => Number((subtotal * promoDiscountRate).toFixed(2)),
    [subtotal, promoDiscountRate]
  );

  const discountedSubtotal = Math.max(0, subtotal - discount);

  const tax = useMemo(
    () => Number((discountedSubtotal * 0.05).toFixed(2)),
    [discountedSubtotal]
  );

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 2000 ? 0 : 150;
  }, [subtotal]);

  const total = useMemo(
    () => Number((discountedSubtotal + tax + deliveryFee).toFixed(2)),
    [discountedSubtotal, tax, deliveryFee]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        tax,
        deliveryFee,
        discount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        total,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        toggleCartDrawer: () => setIsCartDrawerOpen((v) => !v),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
