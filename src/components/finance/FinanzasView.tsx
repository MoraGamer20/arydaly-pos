import React, { useState, useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Calendar,
  Filter,
  DollarSign,
  Download,
  Printer,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { MovimientoFinanciero } from '../../types/pos';
import { ModalAjustarCapital } from '../modals/ModalAjustarCapital';

export const FinanzasView: React.FC = () => {
  const {
    financialMovements,
    settings,
    currentUser,
    cashSession,
  } = usePOS();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ingreso' | 'egreso'>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('month');
  const [showCapitalModal, setShowCapitalModal] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Filtered movements
  const filteredMovements = useMemo(() => {
    return financialMovements.filter((m) => {
      // Type
      if (typeFilter !== 'all' && m.type !== typeFilter) {
        return false;
      }

      // Search
      if (
        searchTerm &&
        !m.concept.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.userName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Time
      if (timeFilter === 'today' && m.date !== todayStr) return false;
      if (timeFilter === 'yesterday' && m.date !== yesterdayStr) return false;
      if (timeFilter === 'week') {
        const d = new Date(m.date);
        const now = new Date();
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (timeFilter === 'month') {
        if (!m.date.startsWith(todayStr.slice(0, 7))) return false;
      }

      return true;
    });
  }, [financialMovements, typeFilter, searchTerm, timeFilter, todayStr, yesterdayStr]);

  // Aggregate indicators for the filtered period
  const totalIncome = filteredMovements
    .filter((m) => m.status === 'active')
    .reduce((sum, m) => sum + m.incomeAmount, 0);

  const totalExpense = filteredMovements
    .filter((m) => m.status === 'active')
    .reduce((sum, m) => sum + m.expenseAmount, 0);

  // Flujo neto (Ingresos - Egresos)
  const netFlow = Math.round((totalIncome - totalExpense) * 100) / 100;

  // Saldo actual en caja (from cashSession or running ledger balance)
  const currentCashBalance = financialMovements.length > 0 && financialMovements[0].status === 'active'
    ? financialMovements[0].balanceAfter
    : settings.initialCapital;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'Fecha,Hora,Tipo,Concepto,Categoria,Ingreso,Egreso,Saldo_Acumulado,Metodo_Pago,Usuario,Estado\n';
    const rows = filteredMovements
      .map(
        (m) =>
          `"${m.date}","${m.time}","${m.type}","${m.concept}","${m.category}",${m.incomeAmount},${m.expenseAmount},${m.balanceAfter},"${m.paymentMethod}","${m.userName}","${m.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARYDALY-Libro-Mayor-${todayStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Libro Diario y Centro Contable
              </h1>
              <p className="text-xs text-slate-500">
                Historial auditado de todos los movimientos de capital e ingresos/egresos de {settings.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCapitalModal(true)}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <DollarSign className="w-4 h-4 text-emerald-200" />
            <span>Fijar Capital Base</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Imprimir Mayor</span>
          </button>
        </div>
      </div>

      {/* 4 Indicadores del Período (Section 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ingresos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Total de Ingresos
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-2">
            +{settings.currencySymbol}
            {totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Egresos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Total de Egresos
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-rose-600 mt-2">
            -{settings.currencySymbol}
            {totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Flujo Neto */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Flujo Neto del Período
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p
            className={`text-2xl font-black font-mono mt-2 ${
              netFlow >= 0 ? 'text-indigo-700' : 'text-rose-600'
            }`}
          >
            {netFlow >= 0 ? '+' : ''}{settings.currencySymbol}
            {netFlow.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-400">Ingresos - Egresos</span>
        </div>

        {/* Saldo en Caja */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                Saldo Actual en Caja
              </span>
              <span className="p-1.5 rounded-lg bg-slate-700 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-black font-mono mt-2 text-amber-400">
              {settings.currencySymbol}
              {currentCashBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400">Saldo acumulado en libro</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCapitalModal(true)}
            className="mt-2 text-left text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
          >
            Modificar Capital Base &rarr;
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en concepto o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time range */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Hoy ({todayStr})</option>
            <option value="yesterday">Ayer ({yesterdayStr})</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="all">Todo el Historial</option>
          </select>

          {/* Type filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('ingreso')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                typeFilter === 'ingreso' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Ingresos (+)
            </button>
            <button
              onClick={() => setTypeFilter('egreso')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                typeFilter === 'egreso' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Egresos (-)
            </button>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Libro de Movimientos ({filteredMovements.length})
          </h2>
          <span className="text-xs text-slate-500">
            Fórmula de balance: Saldo = Capital Inicial + Σ(Ingresos) - Σ(Egresos)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Fecha / Hora</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Concepto</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3 text-right text-emerald-700">Ingreso (+)</th>
                <th className="py-3 px-3 text-right text-rose-700">Egreso (-)</th>
                <th className="py-3 px-3 text-right font-bold text-slate-800">Saldo Acumulado</th>
                <th className="py-3 px-3 text-center">Método</th>
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-sans">
                    No hay registros en el libro contable para este período.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-50/80 transition-colors font-sans ${
                      m.status === 'cancelled' ? 'opacity-40 line-through bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      <div>{m.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.time}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
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
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{m.concept}</div>
                      {m.notes && <div className="text-[10px] text-slate-400 italic">{m.notes}</div>}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                      {m.incomeAmount > 0
                        ? `+${settings.currencySymbol}${m.incomeAmount.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
                      {m.expenseAmount > 0
                        ? `-${settings.currencySymbol}${m.expenseAmount.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap bg-slate-50/50">
                      {settings.currencySymbol}
                      {m.balanceAfter.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="capitalize text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {m.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{m.userName}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {m.status === 'active' ? 'Activo' : 'Cancelado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajustar Capital */}
      <ModalAjustarCapital
        isOpen={showCapitalModal}
        onClose={() => setShowCapitalModal(false)}
      />
    </div>
  );
};
