# De Kitchen - Modern Next.js App Router Deployment & Setup Guide

This guide provides step-by-step instructions to run, configure, and deploy **De Kitchen** with Next.js, Supabase, Tailwind CSS, TypeScript, and the Admin Dashboard.

---

## 🚀 1. Local Development Setup

### Prerequisites
- Node.js (version 18.17+ or 20+)
- npm or pnpm or bun

### Step 1: Install Dependencies
Open your terminal in the project directory (`DeKitchen-main`):
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience the site!

---

## 🔐 2. Admin Dashboard Access

- **Admin URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login Passcode:** `admin123` (configured in `.env.local` via `ADMIN_PASSWORD`)
- **Features in Admin Panel:**
  - **Live Sales & Gross Revenue:** Real-time financial analytics and order status pipeline.
  - **Live Order Management (`/admin/orders`):** View customer names, addresses, phones with direct WhatsApp link, and live status changer (Pending → Confirmed → Preparing → Out for Delivery → Delivered).
  - **Catalog & Price Control (`/admin/menu`):** Toggle in-stock/sold-out status in 1 click, edit item prices/descriptions, and add new dishes with custom photos.

---

## 🗄️ 3. Supabase Database Configuration

The application includes a resilient database abstraction layer (`lib/db.ts`):
- **Local Persistent Mode:** Works immediately without any setup by saving orders and catalog state safely to `data/orders.json` and `data/menu.json`.
- **Supabase Cloud Mode:** Seamlessly connects to your Supabase PostgreSQL database once you supply credentials!

### To connect your Supabase database:

1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. In your Supabase project dashboard, open the **SQL Editor**.
3. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/student/Desktop/DeKitchen-main/supabase/schema.sql) and click **Run**. This creates:
   - `menu_items` table with constraints and RLS policies
   - `orders` table with timeline JSON and status check constraints
   - `reservations` table for table booking
   - Indexes for fast query performance
4. (Optional) Run [`supabase/seed.sql`](file:///c:/Users/student/Desktop/DeKitchen-main/supabase/seed.sql) in the SQL Editor to seed the rich gourmet menu items into Supabase.
5. In your Supabase Project Settings (`Project Settings` → `API`), copy:
   - **Project URL**
   - **anon / public key**
   - **service_role secret key**
6. Open `.env.local` and paste your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```
7. Restart your development server (`npm run dev`). The app is now fully powered by Supabase!

---

## 🌐 4. Cloud Deployment (Vercel)

Deploying De Kitchen to Vercel takes less than 2 minutes:

1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your De Kitchen repository.
4. Under **Environment Variables**, add:
   - `ADMIN_PASSWORD` = `your-secure-admin-password`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
   - `NEXT_PUBLIC_RESTAURANT_NAME` = `"De Kitchen"`
   - `NEXT_PUBLIC_RESTAURANT_PHONE` = `"+92 313 9833396"`
   - `NEXT_PUBLIC_RESTAURANT_WHATSAPP` = `"923139833396"`
5. Click **Deploy**. Vercel will build and launch your production web app.

---

## 🛒 5. Full Customer Ordering & Tracking Workflow

1. **Browse Food (`/menu`):** Search and filter by category (Burgers, Pizzas, Sides, Drinks, Desserts).
2. **Customize Dish (`/menu/[id]`):** Select variations (Single/Double patty, Crust styles) and optional add-ons (extra cheese, bacon, dips) with live price calculation.
3. **Cart Drawer & Page (`/cart`):** Review items, apply promo code (e.g. `DEKITCHEN10` for 10% off), adjust quantities.
4. **Checkout (`/checkout`):** Fill customer name, delivery address, phone, and select payment method (Cash on Delivery, Credit Card, Bank Transfer).
5. **Confirmation (`/order-confirmation/[id]`):** Instant confirmation receipt with order ID (e.g. `DK-78241`) and direct WhatsApp notification link.
6. **Real-Time Order Tracking (`/track-order` or `/track-order/[id]`):** Real-time 5-stage timeline visualizer showing chef progress and assigned courier info.
7. **Admin Fulfillment (`/admin/orders`):** Restaurant managers instantly see the new order, can call/WhatsApp the customer with 1 click, and advance its status to `Delivered`.
