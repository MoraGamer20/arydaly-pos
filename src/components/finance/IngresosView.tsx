import React, { useState, useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  ArrowDownLeft,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Tag,
  DollarSign,
  AlertCircle,
  X,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Ingreso, PaymentMethod } from '../../types/pos';

export const IngresosView: React.FC = () => {
  const {
    incomes,
    incomeCategories,
    addIncome,
    cancelIncome,
    settings,
    currentUser,
  } = usePOS();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [concept, setConcept] = useState('');
  const [category, setCategory] = useState('Otros');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');

  // Cancel modal state
  const [cancelingIncomeId, setCancelingIncomeId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter incomes
  const filteredIncomes = useMemo(() => {
    return incomes.filter((inc) => {
      // Search term
      if (
        searchTerm &&
        !inc.concept.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inc.saleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inc.userName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && inc.category !== selectedCategory) {
        return false;
      }

      // Method filter
      if (selectedMethod !== 'all' && inc.paymentMethod !== selectedMethod) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && inc.type !== selectedType) {
        return false;
      }

      // Time filter
      if (timeFilter === 'today' && inc.date !== todayStr) {
        return false;
      }
      if (timeFilter === 'week') {
        const d = new Date(inc.date);
        const now = new Date();
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (timeFilter === 'month') {
        if (!inc.date.startsWith(todayStr.slice(0, 7))) return false;
      }

      return true;
    });
  }, [incomes, searchTerm, selectedCategory, selectedMethod, selectedType, timeFilter, todayStr]);

  // Aggregate stats
  const totalAmount = filteredIncomes
    .filter((i) => i.status === 'active')
    .reduce((sum, i) => sum + i.amount, 0);

  const salesIncomeTotal = filteredIncomes
    .filter((i) => i.status === 'active' && i.type === 'sale')
    .reduce((sum, i) => sum + i.amount, 0);

  const manualIncomeTotal = filteredIncomes
    .filter((i) => i.status === 'active' && i.type === 'manual')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!concept.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const now = new Date();
    addIncome({
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 8),
      concept: concept.trim(),
      category,
      type: 'manual',
      amount: Math.round(numAmount * 100) / 100,
      paymentMethod,
      userId: currentUser?.id || 'u-admin',
      userName: currentUser?.fullName || 'Administrador',
      notes: notes.trim(),
    });

    // Reset & close
    setConcept('');
    setAmount('');
    setNotes('');
    setShowModal(false);
  };

  const handleConfirmCancel = () => {
    if (cancelingIncomeId) {
      cancelIncome(cancelingIncomeId, cancelReason || 'Cancelado por usuario');
      setCancelingIncomeId(null);
      setCancelReason('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Módulo de Ingresos
              </h1>
              <p className="text-xs text-slate-500">
                Registro de todo el dinero que entra a {settings.name} (Ventas directas y manuales)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Ingreso Manual</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for the filtered period */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Total Ingresos ({filteredIncomes.filter((i) => i.status === 'active').length} movimientos)
          </span>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-1">
            +{settings.currencySymbol}
            {totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Ingresos Automáticos por Ventas
          </span>
          <p className="text-2xl font-black font-mono text-slate-800 mt-1">
            {settings.currencySymbol}
            {salesIncomeTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Ingresos Manuales / Aportaciones
          </span>
          <p className="text-2xl font-black font-mono text-indigo-700 mt-1">
            {settings.currencySymbol}
            {manualIncomeTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por concepto, folio o cajero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Time range */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="today">Hoy ({todayStr})</option>
            <option value="week">Últimos 7 Días</option>
            <option value="month">Este Mes</option>
            <option value="all">Todo el Historial</option>
          </select>

          {/* Payment Method */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todos los Métodos</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="credit">Crédito</option>
          </select>

          {/* Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todos los Tipos</option>
            <option value="sale">Ventas de Mostrador</option>
            <option value="manual">Ingresos Manuales</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detalle de Ingresos ({filteredIncomes.length})
          </h2>
          <span className="text-xs text-slate-500">
            Regla: Los ingresos por ventas se sincronizan en tiempo real
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Fecha / Hora</th>
                <th className="py-3 px-3">Concepto</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3 text-center">Tipo</th>
                <th className="py-3 px-3 text-center">Método</th>
                <th className="py-3 px-3 text-right">Monto</th>
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No se encontraron ingresos para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((inc) => (
                  <tr
                    key={inc.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      inc.status === 'cancelled' ? 'opacity-50 line-through bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      <div>{inc.date}</div>
                      <div className="text-[10px] text-slate-400">{inc.time}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{inc.concept}</div>
                      {inc.saleNumber && (
                        <span className="text-[10px] text-blue-600 font-mono">
                          Ticket #{inc.saleNumber}
                        </span>
                      )}
                      {inc.notes && (
                        <div className="text-[10px] text-slate-400 italic">{inc.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {inc.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inc.type === 'sale'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {inc.type === 'sale' ? 'Venta' : 'Manual'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="capitalize text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {inc.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                      +{settings.currencySymbol}
                      {inc.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{inc.userName}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inc.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {inc.status === 'active' ? 'Activo' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {inc.type === 'manual' && inc.status === 'active' && (
                        <button
                          onClick={() => setCancelingIncomeId(inc.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Cancelar ingreso manual"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nuevo Ingreso Manual */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5" />
                <h3 className="font-extrabold text-sm tracking-tight">
                  Registrar Ingreso Manual
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncome} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Concepto del Ingreso:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Aportación de socio, Cobro a cliente..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoría:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Aportación de capital">Aportación de capital</option>
                    <option value="Cobro de deuda">Cobro de deuda</option>
                    <option value="Devolución recibida">Devolución recibida</option>
                    <option value="Préstamo recibido">Préstamo recibido</option>
                    <option value="Ingreso extraordinario">Ingreso extraordinario</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Método de Pago:
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="transfer">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monto ({settings.currencySymbol}):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    min="0.5"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Observaciones adicionales:
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el origen del dinero..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Cancel */}
      {cancelingIncomeId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Cancelar Ingreso</h3>
            </div>
            <p className="text-xs text-slate-600">
              ¿Estás seguro de cancelar este ingreso? Se marcará como cancelado y se auditará en el libro contable.
            </p>
            <input
              type="text"
              placeholder="Motivo de la cancelación..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelingIncomeId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Regresar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
