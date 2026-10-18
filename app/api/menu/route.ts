import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, createMenuItem } from '@/lib/db';
import { MenuItem } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let items = await getMenuItems();
    if (category && category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve menu items' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, description, image, badge, inStock, variations, addOns } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(price),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: badge || '',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      rating: 5.0,
      reviewsCount: 1,
      prepTime: '15-20 min',
      variations: variations || [],
      addOns: addOns || [],
      createdAt: new Date().toISOString(),
    };

    const saved = await createMenuItem(newItem);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
