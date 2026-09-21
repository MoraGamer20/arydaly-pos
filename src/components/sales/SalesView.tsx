import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Sale } from '../../types/pos';
import {
  Receipt,
  Search,
  Calendar,
  Filter,
  Eye,
  Printer,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const {
    sales,
    settings,
    setLastSale,
    setShowReceiptModal,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Filter sales
  const filteredSales = sales.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.ticketNumber.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.cashierName.toLowerCase().includes(q);

    const matchesMethod = methodFilter === 'all' || s.paymentMethod === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const averageTicket = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
  const totalItemsSold = filteredSales.reduce(
    (acc, s) => acc + s.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );

  const handleOpenReceipt = (sale: Sale) => {
    setLastSale(sale);
    setShowReceiptModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Historial de Ventas & Tickets
          </h2>
          <p className="text-xs text-slate-500">
            Consulta todas las transacciones realizadas, reimprime tickets y analiza cobros
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Ventas Filtradas
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {settings.currencySymbol}
              {totalRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              {filteredSales.length} transacciones
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ticket Promedio
            </span>
            <div className="text-2xl font-black font-mono text-blue-700">
              {settings.currencySymbol}
              {averageTicket.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">Monto medio por cliente</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Artículos Vendidos
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {totalItemsSold} unidades
            </div>
            <p className="text-[11px] text-slate-500">Total de productos cobrados</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ticket #, cliente o cajero..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Todos los Métodos de Pago</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Cajero</th>
                <th className="py-3 px-4 text-center">Artículos</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No se encontraron registros de ventas con los criterios especificados.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-800">
                      {sale.ticketNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(sale.createdAt).toLocaleDateString('es-MX')}{' '}
                      {new Date(sale.createdAt).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 truncate max-w-[140px]">
                      {sale.customerName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[130px]">
                      {sale.cashierName}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {sale.items.reduce((acc, i) => acc + i.quantity, 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {sale.paymentMethod === 'cash' ? (
                          <Banknote className="w-3 h-3 text-emerald-600" />
                        ) : sale.paymentMethod === 'card' ? (
                          <CreditCard className="w-3 h-3 text-blue-600" />
                        ) : (
                          <ArrowRightLeft className="w-3 h-3 text-indigo-600" />
                        )}
                        {sale.paymentMethod === 'cash'
                          ? 'Efectivo'
                          : sale.paymentMethod === 'card'
                          ? 'Tarjeta'
                          : 'Transf.'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {settings.currencySymbol}
                      {sale.subtotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-sm text-slate-900">
                      {settings.currencySymbol}
                      {sale.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenReceipt(sale)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] flex items-center gap-1.5 mx-auto transition-colors"
                        title="Reimprimir o consultar ticket"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
