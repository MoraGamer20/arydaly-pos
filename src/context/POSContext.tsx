import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  BusinessSettings,
  CartItem,
  CashMovement,
  CashRegisterSession,
  Category,
  Customer,
  DailyCut,
  Egreso,
  ExpenseCategory,
  IncomeCategory,
  Ingreso,
  InventoryMovement,
  MovimientoFinanciero,
  NavView,
  PaymentMethod,
  Product,
  Purchase,
  Sale,
  Supplier,
  User,
  UserRole,
  BimestralReport,
} from '../types/pos';
import {
  INITIAL_CASH_MOVEMENTS,
  INITIAL_CASH_SESSION,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_DAILY_CUTS,
  INITIAL_EXPENSE_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_FINANCIAL_MOVEMENTS,
  INITIAL_INCOME_CATEGORIES,
  INITIAL_INCOMES,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_SETTINGS,
  INITIAL_SUPPLIERS,
  INITIAL_USERS,
  getARYDALYDemoData,
} from '../data/initialData';

const STORAGE_KEY = 'arydaly_pos_database_v2';

interface POSContextType {
  currentUser: User | null;
  users: User[];
  settings: BusinessSettings;
  products: Product[];
  categories: Category[];
  customers: Customer[];
  suppliers: Supplier[];
  sales: Sale[];
  purchases: Purchase[];
  inventoryMovements: InventoryMovement[];
  cashSession: CashRegisterSession;
  cashMovements: CashMovement[];
  incomes: Ingreso[];
  expenses: Egreso[];
  expenseCategories: ExpenseCategory[];
  incomeCategories: IncomeCategory[];
  financialMovements: MovimientoFinanciero[];
  dailyCuts: DailyCut[];
  cart: CartItem[];
  selectedCustomer: Customer | null;
  activeView: NavView;
  lastSale: Sale | null;
  showReceiptModal: boolean;
  setShowReceiptModal: (show: boolean) => void;
  setLastSale: (sale: Sale | null) => void;
  setActiveView: (view: NavView) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchUser: (user: User) => void;
  pendingNewProductBarcode: string | null;
  setPendingNewProductBarcode: (barcode: string | null) => void;
  openNewProductWithBarcode: (barcode: string) => void;
  addToCart: (product: Product, quantity?: number) => { success: boolean; error?: string };
  updateCartQuantity: (productId: string, quantity: number) => { success: boolean; error?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  completeSale: (paymentDetails: {
    method: PaymentMethod;
    amountPaid: number;
    reference?: string;
    notes?: string;
  }) => { success: boolean; sale?: Sale; error?: string };
  openCashRegister: (openingAmount: number, notes?: string) => void;
  closeCashRegister: (actualCash: number, notes?: string) => { difference: number };
  addCashMovement: (type: 'in' | 'out', amount: number, reason: string) => void;
  saveProduct: (productData: Partial<Product> & { name: string; salePrice: number }) => Product;
  deleteProduct: (id: string) => void;
  adjustInventory: (productId: string, newStock: number, reason: string) => void;
  receiveMerchandiseBatch: (items: { productId: string; quantity: number }[], reason?: string) => void;
  saveCustomer: (customerData: Partial<Customer> & { name: string }) => Customer;
  deleteCustomer: (id: string) => void;
  saveSupplier: (supplierData: Partial<Supplier> & { companyName: string }) => Supplier;
  deleteSupplier: (id: string) => void;
  saveCategory: (categoryData: Partial<Category> & { name: string }) => Category;
  deleteCategory: (id: string) => void;
  saveUser: (userData: Partial<User> & { email: string; fullName: string; role: UserRole }) => User;
  deleteUser: (id: string) => void;
  recordPurchase: (purchaseData: {
    supplierId: string;
    items: { productId: string; quantity: number; unitCost: number }[];
    invoiceReference?: string;
    notes?: string;
  }) => Purchase;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  setCustomNetCapital: (newCapital: number, reason?: string) => void;
  addIncome: (incomeData: Omit<Ingreso, 'id' | 'createdAt' | 'status'>) => Ingreso;
  cancelIncome: (id: string, reason?: string) => void;
  addExpense: (expenseData: Omit<Egreso, 'id' | 'createdAt' | 'status'>) => Egreso;
  cancelExpense: (id: string, reason?: string) => void;
  addExpenseCategory: (name: string, description?: string, color?: string) => ExpenseCategory;
  deleteExpenseCategory: (id: string) => void;
  addIncomeCategory: (name: string, description?: string) => IncomeCategory;
  performDailyCut: (registeredCash: number, notes?: string) => DailyCut;
  getDailyFinancialSummary: (dateStr?: string) => {
    initialCapital: number;
    totalIncome: number;
    totalExpense: number;
    netCapital: number;
    totalSales: number;
    cashSales: number;
    cardSales: number;
    transferSales: number;
    otherIncome: number;
    totalOperatingExpenses: number;
    merchandiseExpense: number;
    salesCount: number;
    cogs: number;
    grossProfit: number;
    netProfit: number;
    expectedCash: number;
  };
  getBimestralReport: (year: number, bimester: number) => BimestralReport;
  loadDemoData: () => void;
  clearAllData: (options?: {
    keepProducts?: boolean;
    resetStockToZero?: boolean;
    initialCapital?: number;
  }) => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonData: string) => boolean;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core Entities State
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [settings, setSettings] = useState<BusinessSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(INITIAL_INVENTORY_MOVEMENTS);
  const [cashSession, setCashSession] = useState<CashRegisterSession>(INITIAL_CASH_SESSION);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>(INITIAL_CASH_MOVEMENTS);

  // Financial System State
  const [incomes, setIncomes] = useState<Ingreso[]>(INITIAL_INCOMES);
  const [expenses, setExpenses] = useState<Egreso[]>(INITIAL_EXPENSES);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(INITIAL_EXPENSE_CATEGORIES);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>(INITIAL_INCOME_CATEGORIES);
  const [financialMovements, setFinancialMovements] = useState<MovimientoFinanciero[]>(INITIAL_FINANCIAL_MOVEMENTS);
  const [dailyCuts, setDailyCuts] = useState<DailyCut[]>(INITIAL_DAILY_CUTS);

  // Active POS state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(INITIAL_CUSTOMERS[0] || null);
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pendingNewProductBarcode, setPendingNewProductBarcode] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const openNewProductWithBarcode = useCallback((barcode: string) => {
    setPendingNewProductBarcode(barcode);
    setActiveView('products');
  }, []);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.sales) setSales(parsed.sales);
        if (parsed.purchases) setPurchases(parsed.purchases);
        if (parsed.inventoryMovements) setInventoryMovements(parsed.inventoryMovements);
        if (parsed.cashSession) setCashSession(parsed.cashSession);
        if (parsed.cashMovements) setCashMovements(parsed.cashMovements);
        if (parsed.incomes) setIncomes(parsed.incomes);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.expenseCategories) setExpenseCategories(parsed.expenseCategories);
        if (parsed.incomeCategories) setIncomeCategories(parsed.incomeCategories);
        if (parsed.financialMovements) setFinancialMovements(parsed.financialMovements);
        if (parsed.dailyCuts) setDailyCuts(parsed.dailyCuts);
        if (parsed.currentUserId) {
          const matchedUser = (parsed.users || INITIAL_USERS).find((u: User) => u.id === parsed.currentUserId);
          if (matchedUser) setCurrentUser(matchedUser);
        }
      }
    } catch (e) {
      console.error('Failed to load ARYDALY database from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persist to LocalStorage on updates
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const payload = {
        users,
        settings,
        products,
        categories,
        customers,
        suppliers,
        sales,
        purchases,
        inventoryMovements,
        cashSession,
        cashMovements,
        incomes,
        expenses,
        expenseCategories,
        incomeCategories,
        financialMovements,
        dailyCuts,
        currentUserId: currentUser?.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to persist ARYDALY state to localStorage', e);
    }
  }, [
    isInitialized,
    users,
    settings,
    products,
    categories,
    customers,
    suppliers,
    sales,
    purchases,
    inventoryMovements,
    cashSession,
    cashMovements,
    incomes,
    expenses,
    expenseCategories,
    incomeCategories,
    financialMovements,
    dailyCuts,
    currentUser,
  ]);

  // Auth Operations
  const login = useCallback(
    (email: string, role: UserRole = 'cashier') => {
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        setCurrentUser(user);
        return true;
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      return true;
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const switchUser = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  // Cart operations
  const addToCart = useCallback(
    (product: Product, quantity = 1): { success: boolean; error?: string } => {
      let result: { success: boolean; error?: string } = { success: true };

      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        const currentQty = existing ? existing.quantity : 0;
        const targetQty = currentQty + quantity;

        if (settings.blockSalesWithoutStock !== false) {
          if (product.stock <= 0) {
            result = {
              success: false,
              error: `"${product.name}" está agotado (0 existencias en almacén).`,
            };
            return prev;
          }
          if (targetQty > product.stock) {
            result = {
              success: false,
              error: `Existencias insuficientes para "${product.name}". Disponible: ${product.stock}, en carrito: ${currentQty}.`,
            };
            return prev;
          }
        }

        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: targetQty,
                  subtotal: Math.round(targetQty * item.unitPrice * 100) / 100,
                }
              : item
          );
        } else {
          return [
            ...prev,
            {
              product,
              quantity,
              unitPrice: product.salePrice,
              discount: 0,
              subtotal: Math.round(quantity * product.salePrice * 100) / 100,
            },
          ];
        }
      });

      return result;
    },
    [settings.blockSalesWithoutStock]
  );

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number): { success: boolean; error?: string } => {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
        return { success: true };
      }

      const prod = products.find((p) => p.id === productId);
      if (prod && settings.blockSalesWithoutStock !== false && quantity > prod.stock) {
        return {
          success: false,
          error: `Existencias insuficientes para "${prod.name}". Máximo disponible: ${prod.stock}.`,
        };
      }

      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity,
                subtotal: Math.round(quantity * item.unitPrice * 100) / 100,
              }
            : item
        )
      );
      return { success: true };
    },
    [products, settings.blockSalesWithoutStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Helper to compute current running balance from active financial movements
  const computeCurrentBalance = useCallback(
    (existingMovements: MovimientoFinanciero[] = financialMovements) => {
      let balance = settings.initialCapital || 0;
      for (const m of existingMovements) {
        if (m.status === 'active') {
          balance += m.incomeAmount - m.expenseAmount;
        }
      }
      return Math.round(balance * 100) / 100;
    },
    [settings.initialCapital, financialMovements]
  );

  // Complete Sale - CONNECTED DIRECTLY TO INCOME AND FINANCIAL LEDGER
  const completeSale = useCallback(
    (paymentDetails: {
      method: PaymentMethod;
      amountPaid: number;
      reference?: string;
      notes?: string;
    }) => {
      if (cart.length === 0) {
        return { success: false, error: 'El carrito está vacío.' };
      }
      if (!currentUser) {
        return { success: false, error: 'No hay cajero autenticado.' };
      }
      if (cashSession.status === 'closed' && paymentDetails.method === 'cash') {
        return {
          success: false,
          error: 'La caja está cerrada. Debes abrir turno de caja antes de cobrar en efectivo.',
        };
      }

      const subtotalTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
      const taxAmount = Math.round(subtotalTotal * (settings.taxRate / 100) * 100) / 100;
      const totalAmount = Math.round((subtotalTotal + taxAmount) * 100) / 100;

      if (paymentDetails.amountPaid < totalAmount && paymentDetails.method === 'cash') {
        return {
          success: false,
          error: `El monto recibido ($${paymentDetails.amountPaid}) es menor al total ($${totalAmount}).`,
        };
      }

      const change =
        paymentDetails.method === 'cash'
          ? Math.round((paymentDetails.amountPaid - totalAmount) * 100) / 100
          : 0;

      const ticketNumber = `TK-${String(sales.length + 101).padStart(6, '0')}`;
      const saleId = `sale-${Date.now()}`;
      const now = new Date();
      const nowIso = now.toISOString();
      const todayDate = nowIso.slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);

      const newSaleItems = cart.map((item, idx) => ({
        id: `si-${Date.now()}-${idx}`,
        saleId,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitCost: item.product.costPrice,
        unitPrice: item.unitPrice,
        discount: item.discount,
        subtotal: item.subtotal,
      }));

      const newSale: Sale = {
        id: saleId,
        ticketNumber,
        customerId: selectedCustomer?.id || 'cust-general',
        customerName: selectedCustomer?.name || 'Público en General',
        cashierId: currentUser.id,
        cashierName: currentUser.fullName,
        cashRegisterId: cashSession.id,
        subtotal: subtotalTotal,
        tax: taxAmount,
        discount: 0,
        total: totalAmount,
        paymentMethod: paymentDetails.method,
        amountPaid: paymentDetails.amountPaid,
        changeGiven: change,
        paymentReference: paymentDetails.reference,
        status: 'completed',
        notes: paymentDetails.notes,
        items: newSaleItems,
        createdAt: nowIso,
      };

      // 1. Deduct Stock & Record Inventory Movements
      const newMovements: InventoryMovement[] = [];
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const cartItem = cart.find((ci) => ci.product.id === p.id);
          if (cartItem) {
            const newStock = Math.max(0, p.stock - cartItem.quantity);
            newMovements.push({
              id: `im-${Date.now()}-${p.id}`,
              productId: p.id,
              productName: p.name,
              movementType: 'sale',
              quantity: -cartItem.quantity,
              previousStock: p.stock,
              newStock,
              reason: `Venta Ticket ${ticketNumber}`,
              userId: currentUser.id,
              userName: currentUser.fullName,
              createdAt: nowIso,
            });
            return {
              ...p,
              stock: newStock,
              updatedAt: nowIso,
            };
          }
          return p;
        })
      );

      setInventoryMovements((prev) => [...newMovements, ...prev]);

      // 2. Update Cash Register if paid in cash
      if (paymentDetails.method === 'cash') {
        setCashSession((prev) => ({
          ...prev,
          cashSales: Math.round((prev.cashSales + totalAmount) * 100) / 100,
          expectedAmount: Math.round((prev.expectedAmount + totalAmount) * 100) / 100,
        }));
      }

      // 3. Save Sale
      setSales((prev) => [newSale, ...prev]);

      // 4. AUTOMATICALLY REGISTER INCOME IN /ingresos
      const newIncome: Ingreso = {
        id: `inc-sale-${newSale.id}`,
        date: todayDate,
        time: timeStr,
        saleNumber: ticketNumber,
        concept: `Venta #${ticketNumber} (${newSale.customerName})`,
        category: 'Ventas',
        type: 'sale',
        amount: totalAmount,
        paymentMethod: paymentDetails.method,
        userId: currentUser.id,
        userName: currentUser.fullName,
        referenceId: newSale.id,
        notes: `Cobro en ${paymentDetails.method.toUpperCase()} - Ticket ${ticketNumber}`,
        status: 'active',
        createdAt: nowIso,
      };
      setIncomes((prev) => [newIncome, ...prev]);

      // 5. AUTOMATICALLY RECORD FINANCIAL LEDGER MOVEMENT IN /finanzas
      setFinancialMovements((prev) => {
        const lastBalance = prev.length > 0 ? prev[0].balanceAfter : settings.initialCapital;
        const newBalance = Math.round((lastBalance + totalAmount) * 100) / 100;
        const newFinMov: MovimientoFinanciero = {
          id: `mov-${Date.now()}`,
          date: todayDate,
          time: timeStr,
          type: 'ingreso',
          concept: newIncome.concept,
          category: 'Ventas',
          incomeAmount: totalAmount,
          expenseAmount: 0,
          balanceAfter: newBalance,
          paymentMethod: paymentDetails.method,
          userId: currentUser.id,
          userName: currentUser.fullName,
          referenceId: newSale.id,
          notes: `Venta confirmada #${ticketNumber}`,
          status: 'active',
          createdAt: nowIso,
        };
        return [newFinMov, ...prev];
      });

      // 6. Reset Cart & show receipt
      setCart([]);
      setLastSale(newSale);
      setShowReceiptModal(true);

      return { success: true, sale: newSale };
    },
    [cart, currentUser, cashSession, settings.taxRate, settings.initialCapital, sales.length, selectedCustomer]
  );

  // Manual Income registration
  const addIncome = useCallback(
    (incomeData: Omit<Ingreso, 'id' | 'createdAt' | 'status'>) => {
      const now = new Date();
      const nowIso = now.toISOString();
      const id = `inc-${Date.now()}`;
      const newIncome: Ingreso = {
        ...incomeData,
        id,
        status: 'active',
        createdAt: nowIso,
      };

      setIncomes((prev) => [newIncome, ...prev]);

      // Also record in financial ledger
      setFinancialMovements((prev) => {
        const lastBalance = prev.length > 0 ? prev[0].balanceAfter : settings.initialCapital;
        const newBalance = Math.round((lastBalance + newIncome.amount) * 100) / 100;
        const finMov: MovimientoFinanciero = {
          id: `mov-${Date.now()}`,
          date: newIncome.date,
          time: newIncome.time,
          type: 'ingreso',
          concept: newIncome.concept,
          category: newIncome.category,
          incomeAmount: newIncome.amount,
          expenseAmount: 0,
          balanceAfter: newBalance,
          paymentMethod: newIncome.paymentMethod,
          userId: newIncome.userId,
          userName: newIncome.userName,
          referenceId: newIncome.id,
          notes: newIncome.notes,
          status: 'active',
          createdAt: nowIso,
        };
        return [finMov, ...prev];
      });

      // If in cash, update cash session
      if (newIncome.paymentMethod === 'cash') {
        setCashSession((prev) => ({
          ...prev,
          cashIn: Math.round((prev.cashIn + newIncome.amount) * 100) / 100,
          expectedAmount: Math.round((prev.expectedAmount + newIncome.amount) * 100) / 100,
        }));
      }

      return newIncome;
    },
    [settings.initialCapital]
  );

  // Cancel income
  const cancelIncome = useCallback((id: string, reason?: string) => {
    setIncomes((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'cancelled', notes: `${inc.notes || ''} [CANCELADO: ${reason || 'Por administrador'}]` } : inc))
    );
    setFinancialMovements((prev) =>
      prev.map((mov) => (mov.referenceId === id || mov.id === id ? { ...mov, status: 'cancelled' } : mov))
    );
  }, []);

  // Manual Expense registration
  const addExpense = useCallback(
    (expenseData: Omit<Egreso, 'id' | 'createdAt' | 'status'>) => {
      const now = new Date();
      const nowIso = now.toISOString();
      const id = `exp-${Date.now()}`;
      const newExpense: Egreso = {
        ...expenseData,
        id,
        status: 'active',
        createdAt: nowIso,
      };

      setExpenses((prev) => [newExpense, ...prev]);

      // Record in financial ledger
      setFinancialMovements((prev) => {
        const lastBalance = prev.length > 0 ? prev[0].balanceAfter : settings.initialCapital;
        const newBalance = Math.round((lastBalance - newExpense.amount) * 100) / 100;
        const finMov: MovimientoFinanciero = {
          id: `mov-${Date.now()}`,
          date: newExpense.date,
          time: newExpense.time,
          type: 'egreso',
          concept: newExpense.concept,
          category: newExpense.category,
          incomeAmount: 0,
          expenseAmount: newExpense.amount,
          balanceAfter: newBalance,
          paymentMethod: newExpense.paymentMethod,
          userId: newExpense.userId,
          userName: newExpense.userName,
          referenceId: newExpense.id,
          notes: newExpense.notes,
          status: 'active',
          createdAt: nowIso,
        };
        return [finMov, ...prev];
      });

      // If in cash, decrease expected cash
      if (newExpense.paymentMethod === 'cash') {
        setCashSession((prev) => ({
          ...prev,
          cashOut: Math.round((prev.cashOut + newExpense.amount) * 100) / 100,
          expectedAmount: Math.round((prev.expectedAmount - newExpense.amount) * 100) / 100,
        }));
      }

      return newExpense;
    },
    [settings.initialCapital]
  );

  // Cancel expense
  const cancelExpense = useCallback((id: string, reason?: string) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, status: 'cancelled', notes: `${exp.notes || ''} [CANCELADO: ${reason || 'Por administrador'}]` } : exp))
    );
    setFinancialMovements((prev) =>
      prev.map((mov) => (mov.referenceId === id || mov.id === id ? { ...mov, status: 'cancelled' } : mov))
    );
  }, []);

  // Expense Categories Management
  const addExpenseCategory = useCallback((name: string, description?: string, color = '#64748B') => {
    const newCat: ExpenseCategory = {
      id: `expcat-${Date.now()}`,
      name: name.trim(),
      description,
      color,
      isSystem: false,
    };
    setExpenseCategories((prev) => [...prev, newCat]);
    return newCat;
  }, []);

  const deleteExpenseCategory = useCallback((id: string) => {
    setExpenseCategories((prev) => prev.filter((c) => c.id !== id || c.isSystem));
  }, []);

  const addIncomeCategory = useCallback((name: string, description?: string) => {
    const newCat: IncomeCategory = {
      id: `inccat-${Date.now()}`,
      name: name.trim(),
      description,
      isSystem: false,
    };
    setIncomeCategories((prev) => [...prev, newCat]);
    return newCat;
  }, []);

  // Cash Register operations
  const openCashRegister = useCallback(
    (openingAmount: number, notes?: string) => {
      if (!currentUser) return;
      const newSession: CashRegisterSession = {
        id: `cash-sess-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        openingAmount,
        expectedAmount: openingAmount,
        cashSales: 0,
        cashIn: 0,
        cashOut: 0,
        difference: 0,
        status: 'open',
        openedAt: new Date().toISOString(),
        notes: notes || 'Apertura de turno',
      };
      setCashSession(newSession);
    },
    [currentUser]
  );

  const closeCashRegister = useCallback(
    (actualCash: number, notes?: string) => {
      const difference = Math.round((actualCash - cashSession.expectedAmount) * 100) / 100;
      setCashSession((prev) => ({
        ...prev,
        closingAmount: actualCash,
        difference,
        status: 'closed',
        closedAt: new Date().toISOString(),
        notes: notes || prev.notes,
      }));
      return { difference };
    },
    [cashSession.expectedAmount]
  );

  const addCashMovement = useCallback(
    (type: 'in' | 'out', amount: number, reason: string) => {
      if (!currentUser) return;
      const movement: CashMovement = {
        id: `cm-${Date.now()}`,
        cashRegisterId: cashSession.id,
        userId: currentUser.id,
        userName: currentUser.fullName,
        type,
        amount,
        reason,
        createdAt: new Date().toISOString(),
      };
      setCashMovements((prev) => [movement, ...prev]);
      setCashSession((prev) => {
        const cashIn = type === 'in' ? prev.cashIn + amount : prev.cashIn;
        const cashOut = type === 'out' ? prev.cashOut + amount : prev.cashOut;
        const expected =
          type === 'in'
            ? prev.expectedAmount + amount
            : prev.expectedAmount - amount;
        return {
          ...prev,
          cashIn,
          cashOut,
          expectedAmount: Math.round(expected * 100) / 100,
        };
      });
    },
    [currentUser, cashSession.id]
  );

  // Product CRUD
  const saveProduct = useCallback(
    (productData: Partial<Product> & { name: string; salePrice: number }) => {
      const now = new Date().toISOString();
      let savedProduct: Product;
      if (productData.id) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === productData.id) {
              savedProduct = {
                ...p,
                ...productData,
                updatedAt: now,
              } as Product;
              return savedProduct;
            }
            return p;
          })
        );
      } else {
        const id = `prod-${Date.now()}`;
        const sku = productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
        const barcode = productData.barcode || `750${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        savedProduct = {
          id,
          sku,
          barcode,
          name: productData.name,
          description: productData.description || '',
          categoryId: productData.categoryId || categories[0]?.id || 'cat-general',
          brand: productData.brand || 'ARYDALY',
          costPrice: productData.costPrice || 0,
          salePrice: productData.salePrice,
          stock: productData.stock || 0,
          minStock: productData.minStock || 5,
          unit: productData.unit || 'pieza',
          imageUrl: productData.imageUrl || '',
          isActive: productData.isActive !== false,
          createdAt: now,
          updatedAt: now,
        };
        setProducts((prev) => [savedProduct, ...prev]);
      }
      return savedProduct!;
    },
    [categories]
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const adjustInventory = useCallback(
    (productId: string, newStock: number, reason: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const now = new Date().toISOString();
      const diff = newStock - product.stock;
      const movementType = diff >= 0 ? 'adjustment_in' : 'adjustment_out';

      const movement: InventoryMovement = {
        id: `im-adj-${Date.now()}`,
        productId,
        productName: product.name,
        movementType,
        quantity: diff,
        previousStock: product.stock,
        newStock,
        reason,
        userId: currentUser?.id || 'u-admin',
        userName: currentUser?.fullName || 'Administrador',
        createdAt: now,
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock, updatedAt: now } : p))
      );
      setInventoryMovements((prev) => [movement, ...prev]);
    },
    [products, currentUser]
  );

  const receiveMerchandiseBatch = useCallback(
    (items: { productId: string; quantity: number }[], reason = 'Entrada de mercancía con escáner') => {
      if (!items.length) return;
      const now = new Date().toISOString();
      const movements: InventoryMovement[] = [];

      setProducts((prev) =>
        prev.map((p) => {
          const item = items.find((i) => i.productId === p.id);
          if (item && item.quantity > 0) {
            const newStock = p.stock + item.quantity;
            movements.push({
              id: `im-recv-${Date.now()}-${p.id}`,
              productId: p.id,
              productName: p.name,
              movementType: 'adjustment_in',
              quantity: item.quantity,
              previousStock: p.stock,
              newStock,
              reason,
              userId: currentUser?.id || 'u-admin',
              userName: currentUser?.fullName || 'Administrador',
              createdAt: now,
            });
            return {
              ...p,
              stock: newStock,
              updatedAt: now,
            };
          }
          return p;
        })
      );

      setInventoryMovements((prev) => [...movements, ...prev]);
    },
    [currentUser]
  );

  // Customer CRUD
  const saveCustomer = useCallback((customerData: Partial<Customer> & { name: string }) => {
    let saved: Customer;
    if (customerData.id) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customerData.id) {
            saved = { ...c, ...customerData } as Customer;
            return saved;
          }
          return c;
        })
      );
    } else {
      saved = {
        id: `cust-${Date.now()}`,
        name: customerData.name,
        rfc: customerData.rfc || 'XAXX010101000',
        phone: customerData.phone || '',
        email: customerData.email || '',
        address: customerData.address || '',
        creditLimit: customerData.creditLimit || 0,
        currentBalance: customerData.currentBalance || 0,
        notes: customerData.notes || '',
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [...prev, saved]);
    }
    return saved!;
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Supplier CRUD
  const saveSupplier = useCallback((supplierData: Partial<Supplier> & { companyName: string }) => {
    let saved: Supplier;
    if (supplierData.id) {
      setSuppliers((prev) =>
        prev.map((s) => {
          if (s.id === supplierData.id) {
            saved = { ...s, ...supplierData } as Supplier;
            return saved;
          }
          return s;
        })
      );
    } else {
      saved = {
        id: `sup-${Date.now()}`,
        companyName: supplierData.companyName,
        contactName: supplierData.contactName || '',
        phone: supplierData.phone || '',
        email: supplierData.email || '',
        address: supplierData.address || '',
        rfc: supplierData.rfc || '',
        notes: supplierData.notes || '',
        createdAt: new Date().toISOString(),
      };
      setSuppliers((prev) => [...prev, saved]);
    }
    return saved!;
  }, []);

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Category CRUD
  const saveCategory = useCallback((categoryData: Partial<Category> & { name: string }) => {
    let saved: Category;
    if (categoryData.id) {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryData.id) {
            saved = { ...cat, ...categoryData } as Category;
            return saved;
          }
          return cat;
        })
      );
    } else {
      saved = {
        id: `cat-${Date.now()}`,
        name: categoryData.name,
        description: categoryData.description || '',
        color: categoryData.color || '#2563EB',
        icon: categoryData.icon || 'Package',
        createdAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, saved]);
    }
    return saved!;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  // User CRUD
  const saveUser = useCallback(
    (userData: Partial<User> & { email: string; fullName: string; role: UserRole }) => {
      let saved: User;
      if (userData.id) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userData.id) {
              saved = { ...u, ...userData } as User;
              return saved;
            }
            return u;
          })
        );
      } else {
        saved = {
          id: `u-${Date.now()}`,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          avatarUrl:
            userData.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          pinCode: userData.pinCode || '1234',
          isActive: userData.isActive !== false,
          createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, saved]);
      }
      return saved!;
    },
    []
  );

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  // Purchase recording - DIRECTLY CONNECTED TO EXPENSES AND FINANCIAL LEDGER
  const recordPurchase = useCallback(
    (purchaseData: {
      supplierId: string;
      items: { productId: string; quantity: number; unitCost: number }[];
      invoiceReference?: string;
      notes?: string;
    }) => {
      const supplier = suppliers.find((s) => s.id === purchaseData.supplierId);
      const now = new Date();
      const nowIso = now.toISOString();
      const todayDate = nowIso.slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);
      const purchaseId = `pur-${Date.now()}`;
      const purchaseNumber = `COM-${String(purchases.length + 501).padStart(5, '0')}`;

      let grandTotal = 0;
      const purchaseItems: {
        id: string;
        purchaseId: string;
        productId: string;
        productName: string;
        quantity: number;
        unitCost: number;
        subtotal: number;
      }[] = [];

      const newMovements: InventoryMovement[] = [];

      purchaseData.items.forEach((item, idx) => {
        const prod = products.find((p) => p.id === item.productId);
        const subtotal = Math.round(item.quantity * item.unitCost * 100) / 100;
        grandTotal += subtotal;

        if (prod) {
          purchaseItems.push({
            id: `pi-${Date.now()}-${idx}`,
            purchaseId,
            productId: item.productId,
            productName: prod.name,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal,
          });

          const newStock = prod.stock + item.quantity;
          newMovements.push({
            id: `im-pur-${Date.now()}-${idx}`,
            productId: prod.id,
            productName: prod.name,
            movementType: 'purchase',
            quantity: item.quantity,
            previousStock: prod.stock,
            newStock,
            reason: `Compra de mercancía ${purchaseNumber}`,
            userId: currentUser?.id || 'u-admin',
            userName: currentUser?.fullName || 'Admin',
            createdAt: nowIso,
          });
        }
      });

      // Update product stocks & cost prices
      setProducts((prev) =>
        prev.map((p) => {
          const bought = purchaseData.items.find((item) => item.productId === p.id);
          if (bought) {
            return {
              ...p,
              stock: p.stock + bought.quantity,
              costPrice: bought.unitCost > 0 ? bought.unitCost : p.costPrice,
              updatedAt: nowIso,
            };
          }
          return p;
        })
      );

      setInventoryMovements((prev) => [...newMovements, ...prev]);

      const newPurchase: Purchase = {
        id: purchaseId,
        purchaseNumber,
        supplierId: purchaseData.supplierId,
        supplierName: supplier?.companyName || 'Proveedor General',
        userId: currentUser?.id || 'u-admin',
        userName: currentUser?.fullName || 'Admin',
        total: Math.round(grandTotal * 100) / 100,
        invoiceReference: purchaseData.invoiceReference,
        status: 'completed',
        notes: purchaseData.notes,
        items: purchaseItems,
        createdAt: nowIso,
      };

      setPurchases((prev) => [newPurchase, ...prev]);

      // AUTOMATICALLY REGISTER EXPENSE IN /egresos
      const newExpense: Egreso = {
        id: `exp-pur-${newPurchase.id}`,
        date: todayDate,
        time: timeStr,
        concept: `Compra mercancía #${purchaseNumber} (${newPurchase.supplierName})`,
        category: 'Mercancía',
        amount: Math.round(grandTotal * 100) / 100,
        paymentMethod: 'cash',
        relatedParty: newPurchase.supplierName,
        userId: currentUser?.id || 'u-admin',
        userName: currentUser?.fullName || 'Admin',
        referenceId: newPurchase.id,
        notes: purchaseData.notes || `Compra a proveedor ${newPurchase.supplierName}`,
        status: 'active',
        createdAt: nowIso,
      };
      setExpenses((prev) => [newExpense, ...prev]);

      // AUTOMATICALLY RECORD FINANCIAL LEDGER MOVEMENT IN /finanzas
      setFinancialMovements((prev) => {
        const lastBalance = prev.length > 0 ? prev[0].balanceAfter : settings.initialCapital;
        const newBalance = Math.round((lastBalance - newExpense.amount) * 100) / 100;
        const finMov: MovimientoFinanciero = {
          id: `mov-${Date.now()}`,
          date: todayDate,
          time: timeStr,
          type: 'egreso',
          concept: newExpense.concept,
          category: 'Mercancía',
          incomeAmount: 0,
          expenseAmount: newExpense.amount,
          balanceAfter: newBalance,
          paymentMethod: 'cash',
          userId: currentUser?.id || 'u-admin',
          userName: currentUser?.fullName || 'Admin',
          referenceId: newPurchase.id,
          notes: `Compra de mercancía #${purchaseNumber}`,
          status: 'active',
          createdAt: nowIso,
        };
        return [finMov, ...prev];
      });

      return newPurchase;
    },
    [suppliers, purchases.length, products, currentUser, settings.initialCapital]
  );

  // Settings
  const updateSettings = useCallback((newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Directly set / adjust Net / Base Capital for ARYDALY
  const setCustomNetCapital = useCallback(
    (newCapital: number, reason?: string) => {
      const safeCapital = Math.max(0, Math.round(Number(newCapital) * 100) / 100);
      const now = new Date();
      const todayDate = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);
      const notes = reason || `Capital base establecido por ${currentUser?.fullName || 'Administrador'} a $${safeCapital.toFixed(2)}`;

      // 1. Update settings
      setSettings((prev) => ({ ...prev, initialCapital: safeCapital }));

      // 2. Adjust cash session base
      setCashSession((prev) => {
        const cashIn = prev.cashIn || 0;
        const cashOut = prev.cashOut || 0;
        const cashSales = prev.cashSales || 0;
        return {
          ...prev,
          openingAmount: safeCapital,
          expectedAmount: Math.round((safeCapital + cashSales + cashIn - cashOut) * 100) / 100,
        };
      });

      // 3. Register or calibrate financial movement in general ledger
      setFinancialMovements((prev) => {
        const adjustmentEntry: MovimientoFinanciero = {
          id: `mov-cap-${Date.now()}`,
          date: todayDate,
          time: timeStr,
          type: 'ingreso',
          concept: reason || `Fijación de Capital Base ARYDALY ($${safeCapital.toFixed(2)})`,
          category: 'Aportación de capital',
          incomeAmount: safeCapital,
          expenseAmount: 0,
          balanceAfter: safeCapital,
          paymentMethod: 'cash',
          userId: currentUser?.id || 'u-admin',
          userName: currentUser?.fullName || 'Administrador ARYDALY',
          notes,
          status: 'active',
          createdAt: now.toISOString(),
        };

        // If empty or only had demo capital movement
        if (prev.length === 0 || (prev.length === 1 && prev[0].category.includes('capital'))) {
          return [adjustmentEntry];
        }

        // If previous active movements exist, compute delta
        const lastBalance = prev.length > 0 ? prev[0].balanceAfter : 0;
        const diff = Math.round((safeCapital - lastBalance) * 100) / 100;

        if (Math.abs(diff) > 0.001) {
          const deltaEntry: MovimientoFinanciero = {
            id: `mov-cap-${Date.now()}`,
            date: todayDate,
            time: timeStr,
            type: diff >= 0 ? 'ingreso' : 'egreso',
            concept: reason || `Ajuste de Capital por Administrador (${diff >= 0 ? '+' : ''}$${diff.toFixed(2)})`,
            category: 'Ajuste de Capital',
            incomeAmount: diff >= 0 ? diff : 0,
            expenseAmount: diff < 0 ? Math.abs(diff) : 0,
            balanceAfter: safeCapital,
            paymentMethod: 'cash',
            userId: currentUser?.id || 'u-admin',
            userName: currentUser?.fullName || 'Administrador ARYDALY',
            notes: `Ajuste manual de saldo contable a $${safeCapital.toFixed(2)}`,
            status: 'active',
            createdAt: now.toISOString(),
          };
          return [deltaEntry, ...prev];
        }

        return prev;
      });
    },
    [currentUser]
  );

  // Daily Financial Summary
  const getDailyFinancialSummary = useCallback(
    (dateStr?: string) => {
      const targetDate = dateStr || new Date().toISOString().slice(0, 10);
      const initialCapital = typeof settings.initialCapital === 'number' ? settings.initialCapital : 0;

      // Active incomes on targetDate
      const daysIncomes = incomes.filter((inc) => inc.status === 'active' && inc.date === targetDate);
      const totalIncome = daysIncomes.reduce((acc, curr) => acc + curr.amount, 0);

      // Active expenses on targetDate
      const daysExpenses = expenses.filter((exp) => exp.status === 'active' && exp.date === targetDate);
      const totalExpense = daysExpenses.reduce((acc, curr) => acc + curr.amount, 0);

      // Sales breakdown
      const daysSales = sales.filter(
        (s) => s.status === 'completed' && s.createdAt.slice(0, 10) === targetDate
      );
      const totalSales = daysSales.reduce((acc, curr) => acc + curr.total, 0);
      const cashSales = daysSales
        .filter((s) => s.paymentMethod === 'cash')
        .reduce((acc, curr) => acc + curr.total, 0);
      const cardSales = daysSales
        .filter((s) => s.paymentMethod === 'card')
        .reduce((acc, curr) => acc + curr.total, 0);
      const transferSales = daysSales
        .filter((s) => s.paymentMethod === 'transfer')
        .reduce((acc, curr) => acc + curr.total, 0);

      const otherIncome = Math.max(0, totalIncome - totalSales);

      // Merchandise vs operating expenses
      const merchandiseExpense = daysExpenses
        .filter((exp) => exp.category === 'Mercancía')
        .reduce((acc, curr) => acc + curr.amount, 0);
      const totalOperatingExpenses = Math.max(0, totalExpense - merchandiseExpense);

      // CAPITAL NETO = CAPITAL INICIAL + INGRESOS - EGRESOS
      const netCapital = Math.round((initialCapital + totalIncome - totalExpense) * 100) / 100;

      // Cost of goods sold (COGS) for sales today
      let cogs = 0;
      daysSales.forEach((s) => {
        s.items.forEach((item) => {
          cogs += item.quantity * (item.unitCost || 0);
        });
      });
      cogs = Math.round(cogs * 100) / 100;

      // GANANCIA: Ingresos por ventas - Costo de productos vendidos - Gastos operativos
      const grossProfit = Math.round((totalSales - cogs) * 100) / 100;
      const netProfit = Math.round((grossProfit - totalOperatingExpenses) * 100) / 100;

      // Expected cash in register today
      const cashExpenses = daysExpenses
        .filter((exp) => exp.paymentMethod === 'cash')
        .reduce((acc, curr) => acc + curr.amount, 0);
      const cashIncomesManual = daysIncomes
        .filter((inc) => inc.paymentMethod === 'cash' && inc.type !== 'sale')
        .reduce((acc, curr) => acc + curr.amount, 0);
      const expectedCash = Math.round((initialCapital + cashSales + cashIncomesManual - cashExpenses) * 100) / 100;

      return {
        initialCapital,
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        netCapital,
        totalSales: Math.round(totalSales * 100) / 100,
        cashSales: Math.round(cashSales * 100) / 100,
        cardSales: Math.round(cardSales * 100) / 100,
        transferSales: Math.round(transferSales * 100) / 100,
        otherIncome: Math.round(otherIncome * 100) / 100,
        totalOperatingExpenses: Math.round(totalOperatingExpenses * 100) / 100,
        merchandiseExpense: Math.round(merchandiseExpense * 100) / 100,
        salesCount: daysSales.length,
        cogs,
        grossProfit,
        netProfit,
        expectedCash,
      };
    },
    [settings.initialCapital, incomes, expenses, sales]
  );

  // Perform Daily Cut (Corte del Día)
  const performDailyCut = useCallback(
    (registeredCash: number, notes?: string) => {
      const now = new Date();
      const todayDate = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);
      const summary = getDailyFinancialSummary(todayDate);
      const difference = Math.round((registeredCash - summary.expectedCash) * 100) / 100;

      const newCut: DailyCut = {
        id: `cut-${Date.now()}`,
        date: todayDate,
        time: timeStr,
        initialCapital: summary.initialCapital,
        totalIncome: summary.totalIncome,
        totalExpense: summary.totalExpense,
        totalSales: summary.totalSales,
        totalExpenses: summary.totalExpense,
        otherIncome: summary.otherIncome,
        netCapital: summary.netCapital,
        expectedCash: summary.expectedCash,
        registeredCash: Math.round(registeredCash * 100) / 100,
        difference,
        salesCount: summary.salesCount,
        cashSales: summary.cashSales,
        cardSales: summary.cardSales,
        transferSales: summary.transferSales,
        userId: currentUser?.id || 'u-admin',
        userName: currentUser?.fullName || 'Administrador ARYDALY',
        notes: notes || '',
        createdAt: now.toISOString(),
      };

      setDailyCuts((prev) => [newCut, ...prev]);

      // Update cash register session
      setCashSession((prev) => ({
        ...prev,
        closingAmount: registeredCash,
        difference,
        status: 'closed',
        closedAt: now.toISOString(),
        notes: `Corte diario realizado. Diferencia: $${difference}`,
      }));

      return newCut;
    },
    [getDailyFinancialSummary, currentUser]
  );

  // Bimestral Report Generator
  const getBimestralReport = useCallback(
    (year: number, bimester: number): BimestralReport => {
      const bimesterNames = [
        'Enero - Febrero',
        'Marzo - Abril',
        'Mayo - Junio',
        'Julio - Agosto',
        'Septiembre - Octubre',
        'Noviembre - Diciembre',
      ];
      const name = bimesterNames[bimester - 1] || 'Bimestre';

      // Define date range
      const startMonth = (bimester - 1) * 2 + 1; // 1, 3, 5, 7, 9, 11
      const endMonth = startMonth + 1; // 2, 4, 6, 8, 10, 12

      const startMonthStr = String(startMonth).padStart(2, '0');
      const endMonthStr = String(endMonth).padStart(2, '0');
      const startDate = `${year}-${startMonthStr}-01`;

      // Get last day of end month
      const lastDayOfEndMonth = new Date(year, endMonth, 0).getDate();
      const endDate = `${year}-${endMonthStr}-${String(lastDayOfEndMonth).padStart(2, '0')}`;

      // Incomes in period
      const periodIncomes = incomes.filter(
        (inc) => inc.status === 'active' && inc.date >= startDate && inc.date <= endDate
      );
      const totalIncome = periodIncomes.reduce((acc, curr) => acc + curr.amount, 0);

      // Expenses in period
      const periodExpenses = expenses.filter(
        (exp) => exp.status === 'active' && exp.date >= startDate && exp.date <= endDate
      );
      const totalExpense = periodExpenses.reduce((acc, curr) => acc + curr.amount, 0);

      // Sales in period
      const periodSales = sales.filter((s) => {
        const d = s.createdAt.slice(0, 10);
        return s.status === 'completed' && d >= startDate && d <= endDate;
      });
      const totalSales = periodSales.reduce((acc, curr) => acc + curr.total, 0);

      // Cost of Goods Sold (COGS)
      let costOfGoodsSold = 0;
      periodSales.forEach((s) => {
        s.items.forEach((item) => {
          costOfGoodsSold += item.quantity * (item.unitCost || 0);
        });
      });
      costOfGoodsSold = Math.round(costOfGoodsSold * 100) / 100;

      // Operating Expenses (All expenses except merchandise already factored into COGS)
      const merchandiseExpenses = periodExpenses
        .filter((exp) => exp.category === 'Mercancía')
        .reduce((acc, curr) => acc + curr.amount, 0);
      const operatingExpenses = Math.round((totalExpense - merchandiseExpenses) * 100) / 100;

      // Calculations requested:
      // Ganancia bruta = Ventas totales - Costo de productos vendidos
      const grossProfit = Math.round((totalSales - costOfGoodsSold) * 100) / 100;
      // Ganancia neta = Ganancia bruta - Gastos operativos
      const netProfit = Math.round((grossProfit - operatingExpenses) * 100) / 100;

      const initialCapital = typeof settings.initialCapital === 'number' ? settings.initialCapital : 0;
      // Capital final = Capital inicial + Ingresos - Egresos
      const finalCapital = Math.round((initialCapital + totalIncome - totalExpense) * 100) / 100;

      // Margin percent
      const profitMarginPercent =
        totalSales > 0 ? Math.round((netProfit / totalSales) * 1000) / 10 : 0;

      return {
        bimester,
        bimesterName: name,
        year,
        startDate,
        endDate,
        initialCapital,
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        totalSales: Math.round(totalSales * 100) / 100,
        costOfGoodsSold,
        grossProfit,
        operatingExpenses,
        netProfit,
        finalCapital,
        profitMarginPercent,
        salesCount: periodSales.length,
      };
    },
    [incomes, expenses, sales, settings.initialCapital]
  );

  // Load Demo Data for ARYDALY
  const loadDemoData = useCallback(() => {
    const demo = getARYDALYDemoData();
    setCategories(demo.categories);
    setProducts(demo.products);
    setCustomers(demo.customers);
    setSuppliers(demo.suppliers);
    setSales(demo.sales);
    setIncomes(demo.incomes);
    setExpenses(demo.expenses);
    setFinancialMovements(demo.movements);
    const updatedSettings = { ...settings, initialCapital: 5000 };
    setSettings(updatedSettings);
    const demoSession: CashRegisterSession = {
      id: 'session-demo',
      userId: 'u-admin',
      userName: 'Administrador ARYDALY',
      openingAmount: 5000,
      expectedAmount: 3297,
      cashSales: 155,
      cashIn: 0,
      cashOut: 1420,
      difference: 0,
      status: 'open',
      openedAt: new Date().toISOString(),
      notes: 'Turno activo con datos demostrativos de ARYDALY',
    };
    setCashSession(demoSession);

    // Immediate synchronous save to localStorage
    try {
      const payload = {
        users,
        settings: updatedSettings,
        products: demo.products,
        categories: demo.categories,
        customers: demo.customers,
        suppliers: demo.suppliers,
        sales: demo.sales,
        purchases: [],
        inventoryMovements: INITIAL_INVENTORY_MOVEMENTS,
        cashSession: demoSession,
        cashMovements: INITIAL_CASH_MOVEMENTS,
        incomes: demo.incomes,
        expenses: demo.expenses,
        expenseCategories,
        incomeCategories,
        financialMovements: demo.movements,
        dailyCuts: INITIAL_DAILY_CUTS,
        currentUserId: currentUser?.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving demo data to localStorage', e);
    }
  }, [settings, users, currentUser, expenseCategories, incomeCategories]);

  // Clear all data (starts clean for production use)
  const clearAllData = useCallback(
    (options?: {
      keepProducts?: boolean;
      resetStockToZero?: boolean;
      initialCapital?: number;
    }) => {
      const cleanCapital = Math.max(0, Number(options?.initialCapital ?? 0));

      let nextProducts: Product[] = [];
      if (options?.keepProducts) {
        if (options?.resetStockToZero) {
          nextProducts = products.map((p) => ({ ...p, stock: 0 }));
        } else {
          nextProducts = products;
        }
      }

      const nextSuppliers = options?.keepProducts ? suppliers : [];

      setProducts(nextProducts);
      setCategories(INITIAL_CATEGORIES);
      setCustomers(INITIAL_CUSTOMERS);
      setSuppliers(nextSuppliers);
      setSales([]);
      setPurchases([]);
      setInventoryMovements([]);
      setIncomes([]);
      setExpenses([]);
      setFinancialMovements([]);
      setDailyCuts([]);

      const updatedSettings = { ...settings, initialCapital: cleanCapital };
      setSettings(updatedSettings);

      const cleanSession: CashRegisterSession = {
        id: `session-${Date.now()}`,
        userId: currentUser?.id || 'u-admin',
        userName: currentUser?.fullName || 'Administrador ARYDALY',
        openingAmount: cleanCapital,
        expectedAmount: cleanCapital,
        cashSales: 0,
        cashIn: 0,
        cashOut: 0,
        difference: 0,
        status: 'open',
        openedAt: new Date().toISOString(),
        notes: `Turno limpio para operaciones reales con $${cleanCapital.toFixed(2)} de capital base`,
      };

      setCashSession(cleanSession);
      setCashMovements([]);
      setCart([]);

      // Immediate synchronous persistence to localStorage
      try {
        const payload = {
          users,
          settings: updatedSettings,
          products: nextProducts,
          categories: INITIAL_CATEGORIES,
          customers: INITIAL_CUSTOMERS,
          suppliers: nextSuppliers,
          sales: [],
          purchases: [],
          inventoryMovements: [],
          cashSession: cleanSession,
          cashMovements: [],
          incomes: [],
          expenses: [],
          expenseCategories,
          incomeCategories,
          financialMovements: [],
          dailyCuts: [],
          currentUserId: currentUser?.id,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error('Failed to immediately persist cleaned state to localStorage', e);
      }
    },
    [products, suppliers, settings, currentUser, users, expenseCategories, incomeCategories]
  );

  // Export JSON Backup
  const exportDataJSON = useCallback(() => {
    const data = {
      brand: 'ARYDALY',
      system: 'Sistema Administrativo y POS',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings,
      users,
      products,
      categories,
      customers,
      suppliers,
      sales,
      purchases,
      inventoryMovements,
      incomes,
      expenses,
      expenseCategories,
      incomeCategories,
      financialMovements,
      dailyCuts,
      cashSession,
      cashMovements,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARYDALY-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [
    settings,
    users,
    products,
    categories,
    customers,
    suppliers,
    sales,
    purchases,
    inventoryMovements,
    incomes,
    expenses,
    expenseCategories,
    incomeCategories,
    financialMovements,
    dailyCuts,
    cashSession,
    cashMovements,
  ]);

  // Import JSON Backup
  const importDataJSON = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.suppliers) setSuppliers(parsed.suppliers);
      if (parsed.sales) setSales(parsed.sales);
      if (parsed.purchases) setPurchases(parsed.purchases);
      if (parsed.inventoryMovements) setInventoryMovements(parsed.inventoryMovements);
      if (parsed.incomes) setIncomes(parsed.incomes);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.expenseCategories) setExpenseCategories(parsed.expenseCategories);
      if (parsed.incomeCategories) setIncomeCategories(parsed.incomeCategories);
      if (parsed.financialMovements) setFinancialMovements(parsed.financialMovements);
      if (parsed.dailyCuts) setDailyCuts(parsed.dailyCuts);
      if (parsed.cashSession) setCashSession(parsed.cashSession);
      if (parsed.cashMovements) setCashMovements(parsed.cashMovements);
      return true;
    } catch (e) {
      console.error('Failed to import ARYDALY JSON backup', e);
      return false;
    }
  }, []);

  return (
    <POSContext.Provider
      value={{
        currentUser,
        users,
        settings,
        products,
        categories,
        customers,
        suppliers,
        sales,
        purchases,
        inventoryMovements,
        cashSession,
        cashMovements,
        incomes,
        expenses,
        expenseCategories,
        incomeCategories,
        financialMovements,
        dailyCuts,
        cart,
        selectedCustomer,
        activeView,
        lastSale,
        showReceiptModal,
        setShowReceiptModal,
        setLastSale,
        setActiveView,
        login,
        logout,
        switchUser,
        pendingNewProductBarcode,
        setPendingNewProductBarcode,
        openNewProductWithBarcode,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        setSelectedCustomer,
        completeSale,
        openCashRegister,
        closeCashRegister,
        addCashMovement,
        saveProduct,
        deleteProduct,
        adjustInventory,
        receiveMerchandiseBatch,
        saveCustomer,
        deleteCustomer,
        saveSupplier,
        deleteSupplier,
        saveCategory,
        deleteCategory,
        saveUser,
        deleteUser,
        recordPurchase,
        updateSettings,
        setCustomNetCapital,
        addIncome,
        cancelIncome,
        addExpense,
        cancelExpense,
        addExpenseCategory,
        deleteExpenseCategory,
        addIncomeCategory,
        performDailyCut,
        getDailyFinancialSummary,
        getBimestralReport,
        loadDemoData,
        clearAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
