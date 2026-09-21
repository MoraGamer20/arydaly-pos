import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  DollarSign,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Receipt,
  X,
  Calculator,
} from 'lucide-react';
import { CorteDiarioModal } from '../modals/CorteDiarioModal';

export const CashRegisterView: React.FC = () => {
  const {
    cashSession,
    cashMovements,
    settings,
    openCashRegister,
    closeCashRegister,
    addCashMovement,
    currentUser,
  } = usePOS();

  // Modals
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [isMovementModal, setIsMovementModal] = useState(false);
  const [isCorteModal, setIsCorteModal] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');

  // Form states
  const [openingAmountInput, setOpeningAmountInput] = useState('1000.00');
  const [openingNotes, setOpeningNotes] = useState('');

  const [closingCashInput, setClosingCashInput] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  const [movementAmount, setMovementAmount] = useState('');
  const [movementReason, setMovementReason] = useState('');

  const isCashOpen = cashSession.status === 'open';

  // Handle Open
  const handleOpenRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(openingAmountInput) || 0;
    openCashRegister(amount, openingNotes);
    setIsOpenModal(false);
  };

  // Handle Close
  const handleCloseRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const counted = parseFloat(closingCashInput) || 0;
    closeCashRegister(counted, closingNotes);
    setIsCloseModal(false);
  };

  // Handle Movement
  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(movementAmount) || 0;
    if (amount <= 0 || !movementReason.trim()) return;
    addCashMovement(movementType, amount, movementReason.trim());
    setIsMovementModal(false);
    setMovementAmount('');
    setMovementReason('');
  };

  // Difference calculation for close modal
  const countedNum = parseFloat(closingCashInput) || 0;
  const closeDifference = Math.round((countedNum - cashSession.expectedAmount) * 100) / 100;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Control de Caja & Arqueos
          </h2>
          <p className="text-xs text-slate-500">
            Administra apertura de turnos, entradas, salidas y arqueo final de efectivo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCorteModal(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Corte del Día</span>
          </button>

          {isCashOpen ? (
            <>
              <button
                onClick={() => {
                  setMovementType('in');
                  setIsMovementModal(true);
                }}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Entrada $</span>
              </button>
              <button
                onClick={() => {
                  setMovementType('out');
                  setIsMovementModal(true);
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <MinusCircle className="w-4 h-4" />
                <span>Retiro / Gasto</span>
              </button>
              <button
                onClick={() => {
                  setClosingCashInput(cashSession.expectedAmount.toFixed(2));
                  setIsCloseModal(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Cerrar Turno</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setOpeningAmountInput('1000.00');
                setIsOpenModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Abrir Turno de Caja</span>
            </button>
          )}
        </div>
      </div>

      {/* Cash Status Alert Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isCashOpen
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/80 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {isCashOpen ? (
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}
          <div>
            <h4 className="font-extrabold text-sm">
              {isCashOpen ? 'TURNO DE CAJA ABIERTO' : 'TURNO DE CAJA CERRADO'}
            </h4>
            <p className="text-xs text-slate-600">
              {isCashOpen
                ? `Abierto por ${cashSession.userName} el ${new Date(
                    cashSession.openedAt
                  ).toLocaleDateString('es-MX')} a las ${new Date(
                    cashSession.openedAt
                  ).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
                : 'La caja se encuentra cerrada. Registra la apertura del turno para habilitar cobros en efectivo.'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Efectivo Esperado
          </span>
          <div className="text-2xl font-black font-mono">
            {settings.currencySymbol}
            {cashSession.expectedAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 5 Financial Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Fondo Inicial */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Fondo Inicial
          </span>
          <div className="text-xl font-black font-mono text-slate-800">
            {settings.currencySymbol}
            {cashSession.openingAmount.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Monto base al abrir</span>
        </div>

        {/* Ventas en Efectivo */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ventas en Efectivo
          </span>
          <div className="text-xl font-black font-mono text-emerald-600">
            +{settings.currencySymbol}
            {cashSession.cashSales.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Ingresos por ventas de mostrador</span>
        </div>

        {/* Entradas */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Entradas de Dinero
          </span>
          <div className="text-xl font-black font-mono text-blue-600">
            +{settings.currencySymbol}
            {cashSession.cashIn.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Aportaciones o cambio extra</span>
        </div>

        {/* Salidas / Gastos */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Salidas / Retiros
          </span>
          <div className="text-xl font-black font-mono text-rose-600">
            -{settings.currencySymbol}
            {cashSession.cashOut.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Pagos a proveedores o gastos</span>
        </div>

        {/* Total Esperado */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-1 bg-blue-50/30">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Saldo Teórico en Caja
          </span>
          <div className="text-xl font-black font-mono text-blue-800">
            {settings.currencySymbol}
            {cashSession.expectedAmount.toFixed(2)}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Total que debe haber en cajón</span>
        </div>
      </div>

      {/* Cash Movements Table */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Movimientos Manuales de Caja del Turno
            </h3>
          </div>
          <span className="text-xs text-slate-400">{cashMovements.length} movimientos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold bg-slate-50">
                <th className="py-3 px-3">Hora</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Concepto / Motivo</th>
                <th className="py-3 px-3 text-right">Monto</th>
                <th className="py-3 px-3">Usuario Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashMovements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No se han registrado entradas ni salidas manuales en este turno.
                  </td>
                </tr>
              ) : (
                cashMovements.map((cm) => (
                  <tr key={cm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {new Date(cm.createdAt).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cm.type === 'in'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {cm.type === 'in' ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-rose-600" />
                        )}
                        {cm.type === 'in' ? 'Entrada' : 'Salida / Gasto'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{cm.reason}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-sm">
                      <span className={cm.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}>
                        {cm.type === 'in' ? '+' : '-'}
                        {settings.currencySymbol}
                        {cm.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-[140px]">
                      {cm.userName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Open Register */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-600" />
                Apertura de Turno de Caja
              </h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleOpenRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monto de Fondo Inicial ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  required
                  value={openingAmountInput}
                  onChange={(e) => setOpeningAmountInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xl font-bold font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  placeholder="1000.00"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Dinero en billetes y monedas que se deja en el cajón para dar cambio.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas de apertura (Opcional)
                </label>
                <input
                  type="text"
                  value={openingNotes}
                  onChange={(e) => setOpeningNotes(e.target.value)}
                  placeholder="Ej. Fondo en morralla y billetes de 50"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Abrir Caja y Comenzar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Close Register / Arqueo */}
      {isCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Corte y Arqueo de Caja
              </h3>
              <button onClick={() => setIsCloseModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCloseRegister} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Fondo Inicial:</span>
                  <span className="font-mono font-semibold">
                    {settings.currencySymbol}
                    {cashSession.openingAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>+ Ventas en Efectivo:</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    +{settings.currencySymbol}
                    {cashSession.cashSales.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>+ Entradas de dinero:</span>
                  <span className="font-mono font-semibold text-blue-600">
                    +{settings.currencySymbol}
                    {cashSession.cashIn.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>- Salidas y gastos:</span>
                  <span className="font-mono font-semibold text-rose-600">
                    -{settings.currencySymbol}
                    {cashSession.cashOut.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
                  <span>Efectivo Teórico Esperado:</span>
                  <span className="font-mono">
                    {settings.currencySymbol}
                    {cashSession.expectedAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Efectivo Físico Contado en Cajón ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={closingCashInput}
                  onChange={(e) => setClosingCashInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-2xl font-black font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Difference callout */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  closeDifference === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : closeDifference > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <span>
                  {closeDifference === 0
                    ? '✅ Cuadre Exacto (Sin diferencias)'
                    : closeDifference > 0
                    ? `🟢 Sobrante en caja (+${settings.currencySymbol}${closeDifference.toFixed(2)})`
                    : `🔴 Faltante en caja (-${settings.currencySymbol}${Math.abs(closeDifference).toFixed(2)})`}
                </span>
                <span className="font-mono text-sm font-black">
                  {settings.currencySymbol}
                  {closeDifference.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observaciones del cierre (Opcional)
                </label>
                <input
                  type="text"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Ej. Cierre de turno vespertino sin novedades"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCloseModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirmar Cierre de Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: In / Out Cash Movement */}
      {isMovementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                {movementType === 'in' ? (
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-rose-600" />
                )}
                {movementType === 'in'
                  ? 'Registrar Entrada de Efectivo'
                  : 'Registrar Salida / Retiro de Dinero'}
              </h3>
              <button onClick={() => setIsMovementModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMovement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monto a {movementType === 'in' ? 'Ingresar' : 'Retirar'} ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  required
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xl font-bold font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Concepto / Motivo *
                </label>
                <input
                  type="text"
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  placeholder={
                    movementType === 'in'
                      ? 'Ej. Cambio extra en monedas de $5 y $10'
                      : 'Ej. Pago de garrafones, flete, compra menor de insumos'
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsMovementModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-xs ${
                    movementType === 'in'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirmar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Corte del Dia Modal */}
      <CorteDiarioModal isOpen={isCorteModal} onClose={() => setIsCorteModal(false)} />
    </div>
  );
};
