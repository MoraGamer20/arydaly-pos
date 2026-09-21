// TypeScript types for VentaPro POS

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  pinCode?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId: string;
  brand?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string; // 'pieza', 'kg', 'litro', 'caja', 'paquete'
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'mixed';

export interface Customer {
  id: string;
  name: string;
  rfc?: string;
  phone?: string;
  email?: string;
  address?: string;
  creditLimit: number;
  currentBalance: number;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  rfc?: string;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  ticketNumber: string;
  customerId?: string;
  customerName: string;
  cashierId: string;
  cashierName: string;
  cashRegisterId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeGiven: number;
  paymentReference?: string;
  status: 'completed' | 'cancelled' | 'refunded';
  notes?: string;
  items: SaleItem[];
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  userName: string;
  total: number;
  invoiceReference?: string;
  status: 'completed' | 'cancelled';
  notes?: string;
  items: PurchaseItem[];
  createdAt: string;
}

export type MovementType =
  | 'sale'
  | 'purchase'
  | 'adjustment_in'
  | 'adjustment_out'
  | 'return'
  | 'loss';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  movementType: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface CashMovement {
  id: string;
  cashRegisterId: string;
  userId: string;
  userName: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface CashRegisterSession {
  id: string;
  userId: string;
  userName: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount: number;
  cashSales: number;
  cashIn: number;
  cashOut: number;
  difference: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
  notes?: string;
}

export interface BusinessSettings {
  name: string;
  rfc: string;
  phone: string;
  email: string;
  address: string;
  currencySymbol: string;
  currencyCode: string;
  country: string;
  taxRate: number; // e.g. 16 for 16%
  receiptHeader: string;
  receiptFooter: string;
  ticketWidth: '58mm' | '80mm';
  rendicionPeriod: 'bimestral' | 'mensual';
  initialCapital: number;
  logoUrl?: string;
}

export type NavView =
  | 'dashboard'
  | 'pos'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'suppliers'
  | 'purchases'
  | 'cash'
  | 'ingresos'
  | 'egresos'
  | 'finanzas'
  | 'reports'
  | 'rendicion-bimestral'
  | 'users'
  | 'settings'
  | 'sales';

export type IncomeType = 'sale' | 'capital_contribution' | 'return' | 'extraordinary' | 'manual' | 'other';

export interface Ingreso {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  saleNumber?: string;
  concept: string;
  category: string;
  type: IncomeType;
  amount: number;
  paymentMethod: PaymentMethod;
  userId: string;
  userName: string;
  referenceId?: string;
  notes?: string;
  voucherUrl?: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface Egreso {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  concept: string;
  category: string;
  amount: number;
  paymentMethod: PaymentMethod;
  relatedParty?: string; // Proveedor, empleado o servicio
  userId: string;
  userName: string;
  referenceId?: string;
  notes?: string;
  receiptUrl?: string; // Comprobante opcional
  voucherUrl?: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isSystem?: boolean;
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface MovimientoFinanciero {
  id: string;
  date: string;
  time: string;
  type: 'ingreso' | 'egreso';
  concept: string;
  category: string;
  incomeAmount: number;
  expenseAmount: number;
  balanceAfter: number;
  paymentMethod: PaymentMethod;
  userId: string;
  userName: string;
  referenceId?: string;
  notes?: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface DailyCut {
  id: string;
  date: string;
  time: string;
  initialCapital: number;
  totalIncome: number;
  totalExpense: number;
  totalSales: number;
  totalExpenses: number;
  otherIncome: number;
  netCapital: number;
  expectedCash: number;
  registeredCash: number;
  difference: number;
  salesCount: number;
  cashSales: number;
  cardSales: number;
  transferSales: number;
  userId: string;
  userName: string;
  notes?: string;
  createdAt: string;
}

export interface BimestralReport {
  bimester: number; // 1-6
  bimesterName: string;
  year: number;
  startDate: string;
  endDate: string;
  initialCapital: number;
  totalIncome: number;
  totalExpense: number;
  totalSales: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  finalCapital: number;
  profitMarginPercent: number;
  salesCount: number;
}

