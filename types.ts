
export type Role = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN';

export interface User {
  id: string;
  name: string;
  role: Role;
  pin: string; // Stored as plain text for mock, would be hashed in real DB
}

export interface AuditLog {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  action: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  CLEANING = 'CLEANING'
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  PAID = 'PAID',
  VOID = 'VOID'
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY'
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  modifiers: Modifier[];
  imageUrl: string;
  prepArea: 'Hot' | 'Cold' | 'Bar' | 'Bakery'; // Added for KOT routing
  isAvailable: boolean; // Added for stock availability
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers: Modifier[];
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED';
  prepArea: 'Hot' | 'Cold' | 'Bar' | 'Bakery'; // Added for tracking in order
  discountValue?: number;
  discountType?: 'percentage' | 'fixed';
}

export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface Order {
  id: string;
  tableId?: string;
  orderNumber: string;
  receiptNumber?: string;
  reprintCount: number;
  status: OrderStatus;
  type: OrderType;
  items: OrderItem[];
  subtotal: number;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  serviceCharge: number;
  total: number;
  createdAt: number;
  paidAt?: number;
  paymentMethod?: PaymentMethod;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
