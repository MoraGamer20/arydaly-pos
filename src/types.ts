export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface FeatureItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  iconName: string;
  previewType: 'sales' | 'inventory' | 'billing' | 'reports' | 'employees' | 'barcode';
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  popular?: boolean;
  buttonText: string;
  features: string[];
  notIncluded?: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  businessName: string;
  businessType: string;
  city: string;
  quote: string;
  metricHighlight: string;
  stars: number;
  avatarColor: string;
  initials: string;
}

export interface IntegrationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  iconName: string;
  compatibility: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  iconName: string;
}

export interface InventoryDemoProduct {
  id: string;
  barcode: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  cost: number;
  price: number;
  status: 'optimal' | 'warning' | 'critical';
}

export interface SaleTransaction {
  id: string;
  ticketNumber: string;
  time: string;
  customer: string;
  itemsCount: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  total: number;
  status: 'Completada' | 'Facturada';
}
