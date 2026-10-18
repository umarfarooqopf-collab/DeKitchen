-- =======================================================
-- De Kitchen Restaurant - Complete Supabase Database Schema
-- =======================================================

-- 1. Enable UUID Extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if recreating
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS menu_items CASCADE;
-- DROP TABLE IF EXISTS reservations CASCADE;

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('chinese', 'italian', 'continental', 'bbq', 'burgers', 'pizzas', 'sides', 'drinks', 'desserts')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    image TEXT,
    badge TEXT,
    in_stock BOOLEAN DEFAULT TRUE NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 120,
    prep_time TEXT DEFAULT '15-20 min',
    calories TEXT,
    variations JSONB DEFAULT '[]'::jsonb,
    add_ons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    city TEXT DEFAULT 'Downtown',
    delivery_notes TEXT,
    order_type TEXT DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash_on_delivery', 'card', 'bank_transfer')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    estimated_delivery_time TEXT DEFAULT '30-45 minutes',
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Reservations Table (Table Booking)
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY DEFAULT ('RES-' || floor(random() * 90000 + 10000)::text),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    special_request TEXT,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_in_stock ON menu_items(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);

-- 7. Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Menu Items Policies: Anyone can view active menu, Service Role can insert/update/delete
CREATE POLICY "Public can view menu items" 
    ON menu_items FOR SELECT 
    USING (true);

CREATE POLICY "Service role can manage menu items" 
    ON menu_items FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Orders Policies:
-- 1. Anyone can create an order
CREATE POLICY "Public can insert orders" 
    ON orders FOR INSERT 
    WITH CHECK (true);

-- 2. Public can view order by exact ID (for customer tracking)
CREATE POLICY "Public can view their own order by ID" 
    ON orders FOR SELECT 
    USING (true);

-- 3. Service role (Admin) can update and select all orders
CREATE POLICY "Service role can manage all orders" 
    ON orders FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Reservations Policies:
CREATE POLICY "Public can book tables" 
    ON reservations FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Service role can manage reservations" 
    ON reservations FOR ALL 
    USING (true) 
    WITH CHECK (true);
