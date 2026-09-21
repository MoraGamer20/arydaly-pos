/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { POSView } from './components/pos/POSView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { InventoryView } from './components/inventory/InventoryView';
import { SalesView } from './components/sales/SalesView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { CustomersView } from './components/customers/CustomersView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { CashRegisterView } from './components/cash/CashRegisterView';
import { IngresosView } from './components/finance/IngresosView';
import { EgresosView } from './components/finance/EgresosView';
import { FinanzasView } from './components/finance/FinanzasView';
import { RendicionBimestralView } from './components/finance/RendicionBimestralView';
import { ReportsView } from './components/reports/ReportsView';
import { UsersView } from './components/users/UsersView';
import { SettingsView } from './components/settings/SettingsView';
import { ReceiptModal } from './components/pos/ReceiptModal';

const POSAppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cart,
    showReceiptModal,
    setShowReceiptModal,
  } = usePOS();

  // Global keyboard shortcuts (F1-F4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1: Ir a POS / Vender
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveView('pos');
      }
      // F2: Dashboard
      else if (e.key === 'F2') {
        e.preventDefault();
        setActiveView('dashboard');
      }
      // F3: Catálogo Productos
      else if (e.key === 'F3') {
        e.preventDefault();
        setActiveView('products');
      }
      // F4: Control de Caja
      else if (e.key === 'F4') {
        e.preventDefault();
        setActiveView('cash');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveView]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Dynamic View Router */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeView === 'pos' && <POSView />}
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'products' && <ProductsView />}
          {activeView === 'inventory' && <InventoryView />}
          {activeView === 'sales' && <SalesView />}
          {activeView === 'purchases' && <PurchasesView />}
          {activeView === 'customers' && <CustomersView />}
          {activeView === 'suppliers' && <SuppliersView />}
          {activeView === 'cash' && <CashRegisterView />}
          {activeView === 'ingresos' && <IngresosView />}
          {activeView === 'egresos' && <EgresosView />}
          {activeView === 'finanzas' && <FinanzasView />}
          {activeView === 'reports' && <ReportsView />}
          {activeView === 'rendicion-bimestral' && <RendicionBimestralView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Receipt Modal for reprinting / reviewing tickets */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <POSAppContent />
    </POSProvider>
  );
}
