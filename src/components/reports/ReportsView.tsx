import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Printer,
  Download,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  ArrowUpRight,
  Package,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { sales, products, categories, settings } = usePOS();

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Filter sales based on period
  const now = new Date();
  const filteredSales = sales.filter((s) => {
    if (period === 'all') return true;
    const sDate = new Date(s.createdAt);
    if (period === 'today') {
      return sDate.toDateString() === now.toDateString();
    }
    if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return sDate >= oneWeekAgo;
    }
    if (period === 'month') {
      return (
        sDate.getMonth() === now.getMonth() && sDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // Financial Metrics
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);

  const totalCost = filteredSales.reduce(
    (sum, s) =>
      sum +
      s.items.reduce(
        (iSum, item) => iSum + (item.unitCost || 0) * item.quantity,
        0
      ),
    0
  );

  const grossProfit = Math.max(0, totalRevenue - totalCost);
  const profitMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;
  const avgTicket = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  // Breakdown by payment method
  const cashTotal = filteredSales
    .filter((s) => s.paymentMethod === 'cash')
    .reduce((sum, s) => sum + s.total, 0);

  const cardTotal = filteredSales
    .filter((s) => s.paymentMethod === 'card')
    .reduce((sum, s) => sum + s.total, 0);

  const transferTotal = filteredSales
    .filter((s) => s.paymentMethod === 'transfer')
    .reduce((sum, s) => sum + s.total, 0);

  // Breakdown by Category
  const categorySalesMap: Record<string, number> = {};
  filteredSales.forEach((s) => {
    s.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const catId = prod?.categoryId || 'cat-general';
      categorySalesMap[catId] = (categorySalesMap[catId] || 0) + item.subtotal;
    });
  });

  // Top selling products in filtered sales
  const productCountMap: Record<
    string,
    { name: string; qty: number; total: number; profit: number }
  > = {};

  filteredSales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productCountMap[item.productId]) {
        productCountMap[item.productId] = {
          name: item.productName,
          qty: 0,
          total: 0,
          profit: 0,
        };
      }
      productCountMap[item.productId].qty += item.quantity;
      productCountMap[item.productId].total += item.subtotal;
      productCountMap[item.productId].profit +=
        (item.unitPrice - (item.unitCost || 0)) * item.quantity;
    });
  });

  const topProductsList = Object.values(productCountMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Reportes Financieros & Estadísticas
          </h2>
          <p className="text-xs text-slate-500">
            Analiza ingresos netos, costos de mercancía, márgenes de ganancia y rendimiento por categoría
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-2xs">
            {(
              [
                { id: 'today', label: 'Hoy' },
                { id: 'week', label: '7 días' },
                { id: 'month', label: 'Este Mes' },
                { id: 'all', label: 'Todo' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  period === p.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintReport}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ventas Totales
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {settings.currencySymbol}
              {totalRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              {filteredSales.length} transacciones registradas
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Costo de Ventas
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {settings.currencySymbol}
              {totalCost.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">Costo de reposición mercancía</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Utilidad Bruta
            </span>
            <div className="text-2xl font-black font-mono text-emerald-600">
              {settings.currencySymbol}
              {grossProfit.toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              Margen de Ganancia: {profitMargin}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ticket Promedio
            </span>
            <div className="text-2xl font-black font-mono text-indigo-700">
              {settings.currencySymbol}
              {avgTicket.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">Gasto medio por cliente</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Efectivo
            </span>
            <span className="text-xl font-black font-mono text-slate-900 block">
              {settings.currencySymbol}
              {cashTotal.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {totalRevenue > 0 ? Math.round((cashTotal / totalRevenue) * 100) : 0}% del total
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Tarjeta Débito / Crédito
            </span>
            <span className="text-xl font-black font-mono text-slate-900 block">
              {settings.currencySymbol}
              {cardTotal.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {totalRevenue > 0 ? Math.round((cardTotal / totalRevenue) * 100) : 0}% del total
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Transferencia / SPEI
            </span>
            <span className="text-xl font-black font-mono text-slate-900 block">
              {settings.currencySymbol}
              {transferTotal.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {totalRevenue > 0 ? Math.round((transferTotal / totalRevenue) * 100) : 0}% del total
            </span>
          </div>
        </div>
      </div>

      {/* Categories & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base">Ventas por Categoría</h3>
            <span className="text-xs text-slate-400 font-semibold">Participación</span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const catRev = categorySalesMap[cat.id] || 0;
              const catPercent = totalRevenue > 0 ? Math.round((catRev / totalRevenue) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="font-mono font-bold text-slate-700">
                      {settings.currencySymbol}
                      {catRev.toFixed(2)}{' '}
                      <span className="text-slate-400 text-[10px]">({catPercent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Products Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base">Productos Más Vendidos</h3>
            <span className="text-xs text-slate-400 font-semibold">Unidades & Utilidad</span>
          </div>

          <div className="space-y-3">
            {topProductsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Sin ventas registradas en el periodo seleccionado.
              </p>
            ) : (
              topProductsList.map((prod, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{prod.name}</p>
                      <p className="text-slate-400 text-[11px]">{prod.qty} piezas cobradas</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">
                      {settings.currencySymbol}
                      {prod.total.toFixed(2)}
                    </span>
                    <span className="font-mono text-emerald-600 text-[11px] font-bold">
                      +{settings.currencySymbol}
                      {prod.profit.toFixed(2)} ganancia
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
