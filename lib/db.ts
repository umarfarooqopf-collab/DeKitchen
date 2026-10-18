import fs from 'fs';
import path from 'path';
import { MenuItem, Order, OrderStatus, TableReservation, SalesSummary } from '@/types';
import { initialMenuItems } from '@/lib/menuData';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

// Ensure local persistent storage directory exists
function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(MENU_FILE)) {
      fs.writeFileSync(MENU_FILE, JSON.stringify(initialMenuItems, null, 2), 'utf8');
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      // Seed with 2 demo orders for a rich out-of-the-box experience
      const demoOrders: Order[] = [
        {
          id: 'DK-78241',
          customer: {
            name: 'Sarah Jenkins',
            phone: '+1 (555) 234-5678',
            email: 'sarah.j@example.com',
            address: '452 Elm Street, Apt 3B',
            city: 'Downtown',
            notes: 'Please leave at apartment door.',
          },
          orderType: 'delivery',
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'pending',
          status: 'preparing',
          items: [
            {
              cartItemId: 'burger-1-default',
              menuItemId: 'burger-1',
              name: 'De Classic Burger',
              basePrice: 8.99,
              unitPrice: 10.79,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
              category: 'burgers',
              selectedAddOns: [{ id: 'c2', name: 'Crispy Beef Bacon', price: 1.80 }],
            },
            {
              cartItemId: 'sides-1-default',
              menuItemId: 'sides-1',
              name: 'Loaded BBQ Fries',
              basePrice: 5.99,
              unitPrice: 5.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
              category: 'sides',
            },
          ],
          subtotal: 27.57,
          tax: 2.21,
          deliveryFee: 0.00,
          discount: 0.00,
          total: 29.78,
          estimatedDeliveryTime: '25-35 minutes',
          timeline: [
            { status: 'pending', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), note: 'Order placed by customer' },
            { status: 'confirmed', timestamp: new Date(Date.now() - 20 * 60000).toISOString(), note: 'Kitchen accepted the order' },
            { status: 'preparing', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), note: 'Chef started preparation' },
          ],
          createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
        },
        {
          id: 'DK-39120',
          customer: {
            name: 'Michael Chen',
            phone: '+1 (555) 987-6543',
            email: 'm.chen@example.com',
            address: '88 Grand Avenue',
            city: 'Westside',
          },
          orderType: 'delivery',
          paymentMethod: 'card',
          paymentStatus: 'paid',
          status: 'delivered',
          items: [
            {
              cartItemId: 'pizza-1-default',
              menuItemId: 'pizza-1',
              name: 'Cheesy Pepperoni',
              basePrice: 12.99,
              unitPrice: 14.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
              category: 'pizzas',
              selectedAddOns: [{ id: 'p1', name: 'Double Mozzarella', price: 2.00 }],
            },
            {
              cartItemId: 'drinks-1-default',
              menuItemId: 'drinks-1',
              name: 'Fresh Berry Mocktail',
              basePrice: 4.99,
              unitPrice: 4.99,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
              category: 'drinks',
            },
          ],
          subtotal: 24.97,
          tax: 2.00,
          deliveryFee: 2.99,
          discount: 0.00,
          total: 29.96,
          estimatedDeliveryTime: 'Delivered',
          timeline: [
            { status: 'pending', timestamp: new Date(Date.now() - 80 * 60000).toISOString(), note: 'Order placed by customer' },
            { status: 'confirmed', timestamp: new Date(Date.now() - 75 * 60000).toISOString(), note: 'Order confirmed' },
            { status: 'preparing', timestamp: new Date(Date.now() - 65 * 60000).toISOString(), note: 'Food cooked to perfection' },
            { status: 'out_for_delivery', timestamp: new Date(Date.now() - 40 * 60000).toISOString(), note: 'Driver on the way' },
            { status: 'delivered', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), note: 'Delivered safely' },
          ],
          createdAt: new Date(Date.now() - 80 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        },
      ];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(demoOrders, null, 2), 'utf8');
    }
    if (!fs.existsSync(RESERVATIONS_FILE)) {
      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error initializing data store:', err);
  }
}

// -------------------------------------------------------------
// MENU ITEMS
// -------------------------------------------------------------
export async function getMenuItems(): Promise<MenuItem[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: Number(item.price),
            description: item.description,
            image: item.image,
            badge: item.badge,
            inStock: item.in_stock,
            rating: Number(item.rating || 4.8),
            reviewsCount: item.reviews_count || 100,
            prepTime: item.prep_time || '15-20 min',
            calories: item.calories,
            variations: item.variations || [],
            addOns: item.add_ons || [],
            createdAt: item.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local store:', err);
      }
    }
  }

  // Local fallback
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(MENU_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return initialMenuItems;
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const all = await getMenuItems();
  return all.find((item) => item.id === id) || null;
}

export async function createMenuItem(item: MenuItem): Promise<MenuItem> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase.from('menu_items').insert({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          image: item.image,
          badge: item.badge,
          in_stock: item.inStock,
          rating: item.rating || 4.8,
          reviews_count: item.reviewsCount || 50,
          prep_time: item.prepTime || '15-20 min',
          calories: item.calories,
          variations: item.variations || [],
          add_ons: item.addOns || [],
        });
        if (!error) return item;
      } catch (err) {
        console.error('Supabase createMenuItem error:', err);
      }
    }
  }

  ensureDataFiles();
  const raw = fs.readFileSync(MENU_FILE, 'utf8');
  const items: MenuItem[] = JSON.parse(raw);
  items.push(item);
  fs.writeFileSync(MENU_FILE, JSON.stringify(items, null, 2), 'utf8');
  return item;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const updatePayload: Record<string, any> = {};
        if (updates.name !== undefined) updatePayload.name = updates.name;
        if (updates.price !== undefined) updatePayload.price = updates.price;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.description !== undefined) updatePayload.description = updates.description;
        if (updates.image !== undefined) updatePayload.image = updates.image;
        if (updates.badge !== undefined) updatePayload.badge = updates.badge;
        if (updates.inStock !== undefined) updatePayload.in_stock = updates.inStock;
        if (updates.variations !== undefined) updatePayload.variations = updates.variations;
        if (updates.addOns !== undefined) updatePayload.add_ons = updates.addOns;

        const { error } = await supabase.from('menu_items').update(updatePayload).eq('id', id);
        if (!error) {
          const item = await getMenuItemById(id);
          return item;
        }
      } catch (err) {
        console.error('Supabase updateMenuItem error:', err);
      }
    }
  }

  ensureDataFiles();
  const raw = fs.readFileSync(MENU_FILE, 'utf8');
  const items: MenuItem[] = JSON.parse(raw);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  fs.writeFileSync(MENU_FILE, JSON.stringify(items, null, 2), 'utf8');
  return items[index];
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase deleteMenuItem error:', err);
      }
    }
  }

  ensureDataFiles();
  const raw = fs.readFileSync(MENU_FILE, 'utf8');
  const items: MenuItem[] = JSON.parse(raw);
  const filtered = items.filter((i) => i.id !== id);
  fs.writeFileSync(MENU_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  return true;
}

// -------------------------------------------------------------
// ORDERS
// -------------------------------------------------------------
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((o: any) => ({
            id: o.id,
            customer: {
              name: o.customer_name,
              phone: o.customer_phone,
              email: o.customer_email,
              address: o.delivery_address,
              city: o.city,
              notes: o.delivery_notes,
            },
            orderType: o.order_type || 'delivery',
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            status: o.status,
            items: o.items || [],
            subtotal: Number(o.subtotal),
            tax: Number(o.tax),
            deliveryFee: Number(o.delivery_fee),
            discount: Number(o.discount || 0),
            total: Number(o.total),
            estimatedDeliveryTime: o.estimated_delivery_time,
            timeline: o.timeline || [],
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getOrders failed, using local store:', err);
      }
    }
  }

  ensureDataFiles();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: Order[] = JSON.parse(raw);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
        if (!error && data) {
          return {
            id: data.id,
            customer: {
              name: data.customer_name,
              phone: data.customer_phone,
              email: data.customer_email,
              address: data.delivery_address,
              city: data.city,
              notes: data.delivery_notes,
            },
            orderType: data.order_type || 'delivery',
            paymentMethod: data.payment_method,
            paymentStatus: data.payment_status,
            status: data.status,
            items: data.items || [],
            subtotal: Number(data.subtotal),
            tax: Number(data.tax),
            deliveryFee: Number(data.delivery_fee),
            discount: Number(data.discount || 0),
            total: Number(data.total),
            estimatedDeliveryTime: data.estimated_delivery_time,
            timeline: data.timeline || [],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Supabase getOrderById failed, using local store:', err);
      }
    }
  }

  const all = await getOrders();
  return all.find((o) => o.id === id) || null;
}

export async function createOrder(order: Order): Promise<Order> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase.from('orders').insert({
          id: order.id,
          customer_name: order.customer.name,
          customer_phone: order.customer.phone,
          customer_email: order.customer.email,
          delivery_address: order.customer.address,
          city: order.customer.city || 'Downtown',
          delivery_notes: order.customer.notes,
          order_type: order.orderType,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          status: order.status,
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax,
          delivery_fee: order.deliveryFee,
          discount: order.discount,
          total: order.total,
          estimated_delivery_time: order.estimatedDeliveryTime || '30-45 minutes',
          timeline: order.timeline,
        });
        if (!error) return order;
        console.error('Supabase createOrder error, falling back to local file:', error);
      } catch (err) {
        console.error('Supabase createOrder exception:', err);
      }
    }
  }

  ensureDataFiles();
  const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
  const orders: Order[] = JSON.parse(raw);
  orders.unshift(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  return order;
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  note?: string
): Promise<Order | null> {
  const current = await getOrderById(id);
  if (!current) return null;

  const statusNote = note || `Status updated to ${newStatus.replace('_', ' ')}`;
  const updatedTimeline = [
    ...current.timeline,
    {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: statusNote,
    },
  ];

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({
            status: newStatus,
            timeline: updatedTimeline,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        if (!error) {
          return {
            ...current,
            status: newStatus,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
      } catch (err) {
        console.error('Supabase updateOrderStatus error:', err);
      }
    }
  }

  ensureDataFiles();
  const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
  const orders: Order[] = JSON.parse(raw);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    status: newStatus,
    timeline: updatedTimeline,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  return orders[index];
}

// -------------------------------------------------------------
// ANALYTICS & SUMMARY
// -------------------------------------------------------------
export async function getSalesSummary(): Promise<SalesSummary> {
  const orders = await getOrders();
  
  let totalRevenue = 0;
  const statusBreakdown: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    preparing: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
  };

  const itemMap: Record<string, { count: number; revenue: number }> = {};

  orders.forEach((o) => {
    if (o.status !== 'cancelled') {
      totalRevenue += o.total;
    }
    if (statusBreakdown[o.status] !== undefined) {
      statusBreakdown[o.status] += 1;
    }

    o.items?.forEach((item) => {
      if (!itemMap[item.name]) {
        itemMap[item.name] = { count: 0, revenue: 0 };
      }
      itemMap[item.name].count += item.quantity;
      itemMap[item.name].revenue += item.unitPrice * item.quantity;
    });
  });

  const popularItems = Object.entries(itemMap)
    .map(([name, data]) => ({ name, count: data.count, revenue: Number(data.revenue.toFixed(2)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activeOrders =
    (statusBreakdown.pending || 0) +
    (statusBreakdown.confirmed || 0) +
    (statusBreakdown.preparing || 0) +
    (statusBreakdown.out_for_delivery || 0);

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders: orders.length,
    activeOrders,
    averageOrderValue: orders.length > 0 ? Number((totalRevenue / orders.length).toFixed(2)) : 0,
    statusBreakdown,
    popularItems,
  };
}

// -------------------------------------------------------------
// RESERVATIONS
// -------------------------------------------------------------
export async function createReservation(res: Omit<TableReservation, 'id' | 'createdAt' | 'status'>): Promise<TableReservation> {
  const reservation: TableReservation = {
    ...res,
    id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.from('reservations').insert({
          id: reservation.id,
          name: reservation.name,
          email: reservation.email,
          phone: reservation.phone,
          guests: reservation.guests,
          reservation_date: reservation.date,
          reservation_time: reservation.time,
          special_request: reservation.specialRequest,
          status: reservation.status,
        });
      } catch (err) {
        console.error('Supabase reservation error:', err);
      }
    }
  }

  ensureDataFiles();
  try {
    const raw = fs.readFileSync(RESERVATIONS_FILE, 'utf8');
    const all = JSON.parse(raw);
    all.unshift(reservation);
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(all, null, 2), 'utf8');
  } catch (err) {
    console.error('Local reservation save error:', err);
  }

  return reservation;
}
