export type FoodCategory =
  | 'all'
  | 'chinese'
  | 'italian'
  | 'continental'
  | 'bbq'
  | 'burgers'
  | 'pizzas'
  | 'sides'
  | 'drinks'
  | 'desserts';

export interface VariationOption {
  label: string;
  priceDelta: number;
}

export interface Variation {
  name: string;
  options: VariationOption[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'chinese' | 'italian' | 'continental' | 'bbq' | 'burgers' | 'pizzas' | 'sides' | 'drinks' | 'desserts';
  price: number;
  description: string;
  image: string;
  badge?: string;
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
  prepTime?: string;
  calories?: string;
  variations?: Variation[];
  addOns?: AddOn[];
  createdAt?: string;
}

export interface SelectedVariation {
  name: string;
  selectedOption: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string; // generated unique id
  menuItemId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  category: string;
  selectedVariation?: SelectedVariation;
  selectedAddOns?: AddOn[];
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_on_delivery' | 'card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type OrderType = 'delivery' | 'pickup';

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  notes?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  estimatedDeliveryTime?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
  popularItems: { name: string; count: number; revenue: number }[];
}

export interface TableReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
