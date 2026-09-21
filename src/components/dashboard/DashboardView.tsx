import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  DollarSign,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  ShoppingCart,
  Receipt,
  CreditCard,
  Building2,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CorteDiarioModal } from '../modals/CorteDiarioModal';
import { ModalAjustarCapital } from '../modals/ModalAjustarCapital';

export const DashboardView: React.FC = () => {
  const {
    settings,
    currentUser,
    sales,
    financialMovements,
    products,
    setActiveView,
    getDailyFinancialSummary,
    loadDemoData,
  } = usePOS();

  const [showCorteModal, setShowCorteModal] = useState(false);
  const [showAjustarCapitalModal, setShowAjustarCapitalModal] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const summary = getDailyFinancialSummary(todayStr);

  // Check if system is empty
  const isEmptySystem = sales.length === 0 && financialMovements.length === 0 && products.length === 0;

  // Recent 6 financial movements
  const recentMovements = financialMovements.slice(0, 6);

  // Low stock products alert
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock && p.isActive);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Empty State Banner if clean brand new install */}
      {isEmptySystem && (
        <div className="bg-blue-900 border border-blue-700/60 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
                Sistema Administrativo Limpio
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight">
              Bienvenido a ARYDALY — Listo para Operar
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl">
              El sistema ha iniciado completamente limpio sin datos ficticios. Puedes comenzar registrando tus productos y realizando ventas, o cargar datos demostrativos para explorar todos los módulos financieros.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView('products')}
              className="px-3.5 py-2 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors"
            >
              + Agregar Productos
            </button>
            <button
              onClick={loadDemoData}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold border border-blue-500/50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Cargar Datos Demo
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header: ARYDALY Branding & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {settings.name}
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 uppercase tracking-wide">
              Control Financiero
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>•</span>
            <span>Usuario: {currentUser?.fullName || 'Administrador'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAjustarCapitalModal(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-transform active:scale-95"
            title="Fijar o cambiar el capital neto / base de ARYDALY"
          >
            <DollarSign className="w-4 h-4 text-emerald-200" />
            <span>Ajustar Capital Base</span>
          </button>

          <button
            onClick={() => setShowCorteModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-transform active:scale-95"
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Corte del Día</span>
          </button>

          <button
            onClick={() => setActiveView('pos')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Punto de Venta [F1]</span>
          </button>
        </div>
      </div>

      {/* 4 PROMINENT FINANCIAL KPI HERO CARDS (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. CAPITAL NETO DEL DÍA (Hero highlight) */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200">
                Capital Neto del Día
              </span>
              <span className="p-2 rounded-xl bg-blue-600/40 text-blue-200">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-black font-mono tracking-tight mt-2">
              {settings.currencySymbol}
              {summary.netCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-2 pt-2 border-t border-blue-500/30 flex items-center justify-between text-[11px] text-blue-100">
              <span>Capital Base:</span>
              <span className="font-mono font-bold">
                {settings.currencySymbol}{summary.initialCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAjustarCapitalModal(true)}
            className="mt-3 w-full py-1.5 px-2.5 bg-white/20 hover:bg-white/30 border border-white/25 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
            <span>Fijar / Cambiar Capital Base</span>
          </button>
        </div>

        {/* 2. INGRESOS DEL DÍA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Ingresos del Día
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <p className="text-2xl md:text-3xl font-black font-mono tracking-tight text-emerald-600">
              +{settings.currencySymbol}
              {summary.totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Por Ventas ({summary.salesCount}):</span>
              <span className="font-mono font-bold text-slate-700">
                {settings.currencySymbol}{summary.totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* 3. EGRESOS DEL DÍA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Egresos del Día
            </span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <p className="text-2xl md:text-3xl font-black font-mono tracking-tight text-rose-600">
              -{settings.currencySymbol}
              {summary.totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Gastos Operativos:</span>
              <span className="font-mono font-bold text-slate-700">
                {settings.currencySymbol}{summary.totalOperatingExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* 4. GANANCIA DEL DÍA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Ganancia del Día
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <p className="text-2xl md:text-3xl font-black font-mono tracking-tight text-indigo-700">
              {settings.currencySymbol}
              {summary.netProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Ganancia Bruta:</span>
              <span className="font-mono font-bold text-slate-700">
                {settings.currencySymbol}{summary.grossProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: RESUMEN DEL DÍA (Mathematical Breakdown & Cash reconciliation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Resumen del Día Detailed Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Resumen del Día
              </h2>
              <p className="text-xs text-slate-500">
                Fórmula: Capital Inicial + Ingresos - Egresos = Capital Neto
              </p>
            </div>
            <button
              onClick={() => setActiveView('finanzas')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Ver Libro Mayor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mathematical Formula Flow Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Capital Inicial</span>
              <p className="text-base font-black font-mono text-slate-800 mt-0.5">
                {settings.currencySymbol}{summary.initialCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase">+ Ingresos</span>
              <p className="text-base font-black font-mono text-emerald-600 mt-0.5">
                +{settings.currencySymbol}{summary.totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-rose-600 uppercase">- Egresos</span>
              <p className="text-base font-black font-mono text-rose-600 mt-0.5">
                -{settings.currencySymbol}{summary.totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-blue-200">= Capital Neto</span>
              <p className="text-base font-black font-mono mt-0.5">
                {settings.currencySymbol}{summary.netCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Breakdown Grid Requested in Section 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Sales breakdown */}
            <div className="space-y-2.5 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Desglose de Ventas ({summary.salesCount})</span>
                <span className="font-mono text-blue-700">
                  {settings.currencySymbol}{summary.totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>• Ventas en efectivo:</span>
                  <span className="font-mono font-semibold">
                    {settings.currencySymbol}{summary.cashSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Ventas con tarjeta:</span>
                  <span className="font-mono font-semibold">
                    {settings.currencySymbol}{summary.cardSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Ventas por transferencia:</span>
                  <span className="font-mono font-semibold">
                    {settings.currencySymbol}{summary.transferSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Other Incomes and Total Expenses */}
            <div className="space-y-2.5 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-700">Otros Movimientos</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>• Otros ingresos no ventas:</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    +{settings.currencySymbol}{summary.otherIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Compra de mercancía:</span>
                  <span className="font-mono font-semibold text-rose-600">
                    -{settings.currencySymbol}{summary.merchandiseExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Total de gastos del día:</span>
                  <span className="font-mono font-bold text-rose-700">
                    -{settings.currencySymbol}{summary.totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links bar to modules */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveView('ingresos')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Módulo de Ingresos
            </button>
            <button
              onClick={() => setActiveView('egresos')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Módulo de Egresos
            </button>
            <button
              onClick={() => setActiveView('rendicion-bimestral')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Rendición Bimestral
            </button>
          </div>
        </div>

        {/* Right Col: Quick Cash Audit & Alerts */}
        <div className="space-y-4">
          {/* Cash reconciliation block */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Efectivo en Caja
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-2xl font-black font-mono text-slate-900">
              {settings.currencySymbol}{summary.expectedCash.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500">
              Monto esperado según ventas en efectivo y movimientos de caja registrados hoy.
            </p>

            <button
              onClick={() => setShowCorteModal(true)}
              className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              Realizar Arqueo / Corte
            </button>
          </div>

          {/* Low inventory alert if any */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold">
                  {lowStockProducts.length} producto(s) por agotarse
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                Productos como <span className="font-semibold">{lowStockProducts[0]?.name}</span> requieren reabastecimiento con proveedores.
              </p>
              <button
                onClick={() => setActiveView('inventory')}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline block"
              >
                Revisar inventario &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RECENT MOVEMENTS TABLE (Financial Ledger Preview) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Últimos Movimientos Financieros
            </h2>
            <p className="text-xs text-slate-500">
              Registro auditado de ingresos y egresos recientes en {settings.name}
            </p>
          </div>

          <button
            onClick={() => setActiveView('finanzas')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Ver historial completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentMovements.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No hay movimientos registrados el día de hoy. Las ventas y egresos aparecerán aquí automáticamente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Fecha / Hora</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3 text-right">Ingreso</th>
                  <th className="py-2.5 px-3 text-right">Egreso</th>
                  <th className="py-2.5 px-3 text-right">Saldo en Caja</th>
                  <th className="py-2.5 px-3 text-center">Método</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {m.date} <span className="text-[10px] text-slate-400">{m.time}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          m.type === 'ingreso'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {m.type === 'ingreso' ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3" /> Ingreso
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3" /> Egreso
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 truncate max-w-[200px]">
                      {m.concept}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{m.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {m.incomeAmount > 0
                        ? `+${settings.currencySymbol}${m.incomeAmount.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                      {m.expenseAmount > 0
                        ? `-${settings.currencySymbol}${m.expenseAmount.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {settings.currencySymbol}
                      {m.balanceAfter.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="capitalize text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {m.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Corte del Día Modal */}
      <CorteDiarioModal isOpen={showCorteModal} onClose={() => setShowCorteModal(false)} />

      {/* Ajustar Capital Base Modal */}
      <ModalAjustarCapital
        isOpen={showAjustarCapitalModal}
        onClose={() => setShowAjustarCapitalModal(false)}
      />
    </div>
  );
};
