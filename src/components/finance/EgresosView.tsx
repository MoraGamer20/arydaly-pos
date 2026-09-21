import React, { useState, useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  ArrowUpRight,
  PlusCircle,
  Search,
  Calendar,
  CreditCard,
  Tag,
  DollarSign,
  AlertCircle,
  X,
  Trash2,
  FolderPlus,
  Building,
  User,
  FileText,
  PieChart,
} from 'lucide-react';
import { Egreso, PaymentMethod } from '../../types/pos';

export const EgresosView: React.FC = () => {
  const {
    expenses,
    expenseCategories,
    addExpense,
    cancelExpense,
    addExpenseCategory,
    deleteExpenseCategory,
    settings,
    currentUser,
    suppliers,
  } = usePOS();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  // Modal: Nuevo Egreso
  const [showModal, setShowModal] = useState(false);
  const [concept, setConcept] = useState('');
  const [category, setCategory] = useState('Servicios');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [relatedParty, setRelatedParty] = useState('');
  const [notes, setNotes] = useState('');
  const [voucherUrl, setVoucherUrl] = useState('');

  // Modal: Categorías de Egresos
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Modal: Cancelar Egreso
  const [cancelingExpenseId, setCancelingExpenseId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // Search
      if (
        searchTerm &&
        !exp.concept.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !exp.relatedParty?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !exp.userName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
        return false;
      }

      // Method
      if (selectedMethod !== 'all' && exp.paymentMethod !== selectedMethod) {
        return false;
      }

      // Time
      if (timeFilter === 'today' && exp.date !== todayStr) {
        return false;
      }
      if (timeFilter === 'week') {
        const d = new Date(exp.date);
        const now = new Date();
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (timeFilter === 'month') {
        if (!exp.date.startsWith(todayStr.slice(0, 7))) return false;
      }

      return true;
    });
  }, [expenses, searchTerm, selectedCategory, selectedMethod, timeFilter, todayStr]);

  // Aggregate stats
  const totalAmount = filteredExpenses
    .filter((e) => e.status === 'active')
    .reduce((sum, e) => sum + e.amount, 0);

  const merchandiseTotal = filteredExpenses
    .filter((e) => e.status === 'active' && e.category === 'Mercancía')
    .reduce((sum, e) => sum + e.amount, 0);

  const operatingTotal = Math.max(0, totalAmount - merchandiseTotal);

  // Group by category for visual summary
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses
      .filter((e) => e.status === 'active')
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!concept.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const now = new Date();
    addExpense({
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 8),
      concept: concept.trim(),
      category,
      amount: Math.round(numAmount * 100) / 100,
      paymentMethod,
      relatedParty: relatedParty.trim(),
      userId: currentUser?.id || 'u-admin',
      userName: currentUser?.fullName || 'Administrador',
      notes: notes.trim(),
      voucherUrl: voucherUrl.trim(),
    });

    // Reset & close
    setConcept('');
    setAmount('');
    setRelatedParty('');
    setNotes('');
    setVoucherUrl('');
    setShowModal(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addExpenseCategory(newCatName.trim(), newCatDesc.trim());
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleConfirmCancel = () => {
    if (cancelingExpenseId) {
      cancelExpense(cancelingExpenseId, cancelReason || 'Cancelado por usuario');
      setCancelingExpenseId(null);
      setCancelReason('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Módulo de Egresos
              </h1>
              <p className="text-xs text-slate-500">
                Control de salidas de dinero, compras de mercancía y gastos operativos en {settings.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCatModal(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-slate-600" />
            <span>Categorías de Gastos</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Gasto / Egreso</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Total Egresos ({filteredExpenses.filter((e) => e.status === 'active').length} registros)
          </span>
          <p className="text-2xl font-black font-mono text-rose-600 mt-1">
            -{settings.currencySymbol}
            {totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Mercancía / Proveedores
          </span>
          <p className="text-2xl font-black font-mono text-slate-800 mt-1">
            {settings.currencySymbol}
            {merchandiseTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Gastos Operativos (Luz, Renta, etc.)
          </span>
          <p className="text-2xl font-black font-mono text-amber-700 mt-1">
            {settings.currencySymbol}
            {operatingTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      {categoryTotals.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Distribución de Gastos por Categoría:</span>
            <span className="text-slate-400 font-normal">Período seleccionado</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {categoryTotals.map(([catName, catTotal]) => (
              <div
                key={catName}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
              >
                <span className="font-semibold text-slate-700">{catName}:</span>
                <span className="font-mono font-bold text-rose-600">
                  {settings.currencySymbol}{catTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({totalAmount > 0 ? Math.round((catTotal / totalAmount) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar concepto o beneficiario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Time range */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="today">Hoy ({todayStr})</option>
            <option value="week">Últimos 7 Días</option>
            <option value="month">Este Mes</option>
            <option value="all">Todo el Historial</option>
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">Todas las Categorías</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Method */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">Todos los Métodos</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detalle de Egresos ({filteredExpenses.length})
          </h2>
          <span className="text-xs text-slate-500">
            Regla: Las compras de mercancía se registran automáticamente
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Fecha / Hora</th>
                <th className="py-3 px-3">Concepto</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Beneficiario / Proveedor</th>
                <th className="py-3 px-3 text-center">Método</th>
                <th className="py-3 px-3 text-right">Monto</th>
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No se encontraron egresos para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      exp.status === 'cancelled' ? 'opacity-50 line-through bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      <div>{exp.date}</div>
                      <div className="text-[10px] text-slate-400">{exp.time}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{exp.concept}</div>
                      {exp.notes && (
                        <div className="text-[10px] text-slate-400 italic">{exp.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {exp.relatedParty || '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="capitalize text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
                      -{settings.currencySymbol}
                      {exp.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{exp.userName}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exp.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {exp.status === 'active' ? 'Activo' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {exp.status === 'active' && (
                        <button
                          onClick={() => setCancelingExpenseId(exp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Cancelar egreso"
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

      {/* Modal: Registrar Egreso */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                <h3 className="font-extrabold text-sm tracking-tight">
                  Registrar Gasto / Egreso
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-rose-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Concepto del Gasto:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Recibo de luz CFE, Renta del local, Flete..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {expenseCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Método de Pago:
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="cash">Efectivo (Caja)</option>
                    <option value="card">Tarjeta del Negocio</option>
                    <option value="transfer">Transferencia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Beneficiario / Proveedor:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CFE, Dueño de local, etc."
                    value={relatedParty}
                    onChange={(e) => setRelatedParty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Observaciones adicionales:
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles del comprobante o factura..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Guardar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Categorías de Egresos */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm tracking-tight">
                  Categorías de Gastos de ARYDALY
                </h3>
              </div>
              <button
                onClick={() => setShowCatModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Form to add category */}
              <form onSubmit={handleCreateCategory} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">Crear Nueva Categoría:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nombre (ej. Mantenimiento de equipo)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    + Agregar
                  </button>
                </div>
              </form>

              {/* List of categories */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {expenseCategories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      {c.isSystem && (
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          Sistema
                        </span>
                      )}
                    </div>
                    {!c.isSystem && (
                      <button
                        onClick={() => deleteExpenseCategory(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Cancel */}
      {cancelingExpenseId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Cancelar Egreso</h3>
            </div>
            <p className="text-xs text-slate-600">
              ¿Estás seguro de cancelar este egreso? El saldo se recalculará en el libro contable.
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
                onClick={() => setCancelingExpenseId(null)}
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
