import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getMenuItems } from '@/lib/db';
import { Order, CartItem, OrderStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, orderType, paymentMethod, promoCode } = body;

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone, and delivery address are required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // SERVER-SIDE SECURITY & PRICE VALIDATION
    // Fetch real menu items from DB to verify exact pricing
    const menuCatalog = await getMenuItems();
    const catalogMap = new Map(menuCatalog.map((m) => [m.id, m]));

    let validatedSubtotal = 0;
    const validatedItems: CartItem[] = [];

    for (const item of items) {
      const catalogItem = catalogMap.get(item.menuItemId);
      if (!catalogItem) {
        return NextResponse.json(
          { success: false, error: `Invalid menu item: ${item.name}` },
          { status: 400 }
        );
      }

      // Check stock
      if (!catalogItem.inStock) {
        return NextResponse.json(
          { success: false, error: `Item ${catalogItem.name} is currently sold out` },
          { status: 400 }
        );
      }

      // Base price from catalog
      const basePrice = catalogItem.price;
      let variationDelta = 0;

      if (item.selectedVariation && catalogItem.variations) {
        const foundVariationGroup = catalogItem.variations.find(
          (v) => v.name === item.selectedVariation.name
        );
        const foundOption = foundVariationGroup?.options.find(
          (o) => o.label === item.selectedVariation.selectedOption
        );
        if (foundOption) {
          variationDelta = foundOption.priceDelta;
        }
      }

      // Add-ons price validation
      let addOnsTotal = 0;
      const validatedAddOns = [];
      if (item.selectedAddOns && Array.isArray(item.selectedAddOns)) {
        for (const addon of item.selectedAddOns) {
          const catalogAddOn = catalogItem.addOns?.find((a) => a.id === addon.id);
          if (catalogAddOn) {
            addOnsTotal += catalogAddOn.price;
            validatedAddOns.push(catalogAddOn);
          }
        }
      }

      const unitPrice = Number((basePrice + variationDelta + addOnsTotal).toFixed(2));
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      validatedSubtotal += unitPrice * quantity;

      validatedItems.push({
        cartItemId: item.cartItemId || `${item.menuItemId}-${Date.now()}`,
        menuItemId: catalogItem.id,
        name: catalogItem.name,
        basePrice,
        unitPrice,
        quantity,
        image: catalogItem.image,
        category: catalogItem.category,
        selectedVariation: item.selectedVariation,
        selectedAddOns: validatedAddOns,
        specialInstructions: item.specialInstructions || '',
      });
    }

    validatedSubtotal = Number(validatedSubtotal.toFixed(2));

    // Calculate discount if promo code supplied
    let discount = 0;
    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase();
      if (cleanCode === 'DEKITCHEN10' || cleanCode === 'SAVE10') {
        discount = Number((validatedSubtotal * 0.10).toFixed(2));
      } else if (cleanCode === 'GOURMET20') {
        discount = Number((validatedSubtotal * 0.20).toFixed(2));
      }
    }

    const discountedSubtotal = Math.max(0, validatedSubtotal - discount);
    const tax = Number((discountedSubtotal * 0.05).toFixed(2));
    const deliveryFee = validatedSubtotal >= 2000 ? 0.00 : 150.00;
    const total = Number((discountedSubtotal + tax + deliveryFee).toFixed(2));

    // Generate unique order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DK-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || '',
        address: customer.address.trim(),
        city: customer.city?.trim() || 'Local Area',
        notes: customer.notes?.trim() || '',
      },
      orderType: orderType || 'delivery',
      paymentMethod: paymentMethod || 'cash_on_delivery',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      status: 'pending',
      items: validatedItems,
      subtotal: validatedSubtotal,
      tax,
      deliveryFee,
      discount,
      total,
      estimatedDeliveryTime: '30-45 minutes',
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order submitted by customer',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await createOrder(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: created,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing order' },
      { status: 500 }
    );
  }
}
