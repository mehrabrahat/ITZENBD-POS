
import { Category, MenuItem, Table, TableStatus, Role, User } from './types';

export const TAX_RATE = 0.10; // 10%
export const SERVICE_CHARGE_RATE = 0.05; // 5%

export const ROLES: Role[] = ['ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN'];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Master Admin', role: 'ADMIN', pin: '1234' },
  { id: 'u2', name: 'Sarah Manager', role: 'MANAGER', pin: '2222' },
  { id: 'u3', name: 'John Cashier', role: 'CASHIER', pin: '3333' },
  { id: 'u4', name: 'Mike Chef', role: 'KITCHEN', pin: '4444' },
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Appetizers', icon: '🥗' },
  { id: '2', name: 'Main Course', icon: '🍲' },
  { id: '3', name: 'Desserts', icon: '🍰' },
  { id: '4', name: 'Beverages', icon: '🍹' },
  { id: '5', name: 'Alcohol', icon: '🍺' },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', categoryId: '1', name: 'Bruschetta', description: 'Grilled bread with tomato and basil', basePrice: 8.5, modifiers: [], imageUrl: 'https://picsum.photos/200/200?random=1', prepArea: 'Cold', isAvailable: true },
  { id: 'm2', categoryId: '1', name: 'Calamari', description: 'Deep fried squid rings', basePrice: 12.0, modifiers: [], imageUrl: 'https://picsum.photos/200/200?random=2', prepArea: 'Hot', isAvailable: true },
  { id: 'm3', categoryId: '2', name: 'Ribeye Steak', description: '300g Prime Angus beef', basePrice: 35.0, modifiers: [{id: 's1', name: 'Medium Rare', price: 0}, {id: 's2', name: 'Rare', price: 0}], imageUrl: 'https://picsum.photos/200/200?random=3', prepArea: 'Hot', isAvailable: true },
  { id: 'm4', categoryId: '2', name: 'Seafood Pasta', description: 'Linguine with mixed seafood', basePrice: 22.0, modifiers: [{id: 'p1', name: 'Extra Chili', price: 1.5}], imageUrl: 'https://picsum.photos/200/200?random=4', prepArea: 'Hot', isAvailable: true },
  { id: 'm5', categoryId: '3', name: 'Tiramisu', description: 'Classic Italian coffee cake', basePrice: 9.0, modifiers: [], imageUrl: 'https://picsum.photos/200/200?random=5', prepArea: 'Bakery', isAvailable: true },
  { id: 'm6', categoryId: '4', name: 'Fresh Lemonade', description: 'House-made organic lemon juice', basePrice: 5.5, modifiers: [], imageUrl: 'https://picsum.photos/200/200?random=6', prepArea: 'Bar', isAvailable: true },
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't2', number: 2, capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't3', number: 3, capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't4', number: 4, capacity: 6, status: TableStatus.AVAILABLE },
  { id: 't5', number: 5, capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't6', number: 6, capacity: 8, status: TableStatus.AVAILABLE },
  { id: 't7', number: 7, capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't8', number: 8, capacity: 4, status: TableStatus.AVAILABLE },
];
