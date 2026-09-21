import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Calculator,
  CheckCircle2,
  X,
  AlertCircle,
  FileCheck2,
  Printer,
  Calendar,
  Clock,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface CorteDiarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorteDiarioModal: React.FC<CorteDiarioModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    currentUser,
    getDailyFinancialSummary,
    performDailyCut,
    dailyCuts,
  } = usePOS();

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentTimeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  const summary = getDailyFinancialSummary(todayStr);

  const [enteredCash, setEnteredCash] = useState<string>(String(summary.expectedCash || ''));
  const [notes, setNotes] = useState<string>('');
  const [completedCutId, setCompletedCutId] = useState<string | null>(null);

  if (!isOpen) return null;

  const actualCash = parseFloat(enteredCash) || 0;
  const difference = Math.round((actualCash - summary.expectedCash) * 100) / 100;

  const handleConfirmCut = () => {
    const cut = performDailyCut(actualCash, notes);
    setCompletedCutId(cut.id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">{settings.name}</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded">
                  Corte Diario
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Auditoría y cierre de operaciones del día
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {completedCutId ? (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  ¡Corte del Día Confirmado y Guardado!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Se ha registrado el arqueo diario en el historial financiero de {settings.name}.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Folio de Corte:</span>
                  <span className="font-mono font-bold">{completedCutId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Capital Neto del Día:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {settings.currencySymbol}{summary.netCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Efectivo Físico Reportado:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {settings.currencySymbol}{actualCash.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diferencia:</span>
                  <span
                    className={`font-mono font-bold ${
                      difference === 0
                        ? 'text-emerald-600'
                        : difference > 0
                        ? 'text-blue-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {difference >= 0 ? '+' : ''}{settings.currencySymbol}
                    {difference.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    {difference === 0 ? ' (Exacto)' : difference > 0 ? ' (Sobrante)' : ' (Faltante)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Comprobante
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Finalizar
                </button>
              </div>
            </div>
          ) : (
            /* Cut form and calculations */
            <>
              {/* Meta bar */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Fecha: {todayStr}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Hora: {currentTimeStr}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium truncate max-w-[130px]">{currentUser?.fullName || 'Admin'}</span>
                </div>
              </div>

              {/* Main Financial Calculation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Capital Inicial</p>
                  <p className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
                    {settings.currencySymbol}{summary.initialCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <ArrowDownLeft className="w-3 h-3" /> Total Ingresos
                  </p>
                  <p className="text-base font-extrabold text-emerald-700 font-mono mt-0.5">
                    +{settings.currencySymbol}{summary.totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-rose-700 flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Total Egresos
                  </p>
                  <p className="text-base font-extrabold text-rose-700 font-mono mt-0.5">
                    -{settings.currencySymbol}{summary.totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-blue-700">Capital Neto</p>
                  <p className="text-base font-extrabold text-blue-700 font-mono mt-0.5">
                    {settings.currencySymbol}{summary.netCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Breakdown Details */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Ventas del día ({summary.salesCount} tickets):</span>
                  <span className="font-mono font-bold text-slate-800">
                    {settings.currencySymbol}{summary.totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 pl-3">
                  <span>• Efectivo:</span>
                  <span className="font-mono">{settings.currencySymbol}{summary.cashSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 pl-3">
                  <span>• Tarjeta / Terminal:</span>
                  <span className="font-mono">{settings.currencySymbol}{summary.cardSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 pl-3">
                  <span>• Transferencia bancaria:</span>
                  <span className="font-mono">{settings.currencySymbol}{summary.transferSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200">
                  <span>Otros ingresos no ventas:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {settings.currencySymbol}{summary.otherIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total de gastos y egresos:</span>
                  <span className="font-mono font-bold text-rose-700">
                    -{settings.currencySymbol}{summary.totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Cash Reconciliation Form */}
              <div className="bg-white p-4 rounded-xl border-2 border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Efectivo Esperado en Caja:</span>
                  <span className="text-base font-extrabold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {settings.currencySymbol}{summary.expectedCash.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Efectivo Físico Contado en Caja ($):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">
                      {settings.currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={enteredCash}
                      onChange={(e) => setEnteredCash(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Live Difference Display */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-xs">
                  <span className="text-slate-600 font-medium">Diferencia de Efectivo:</span>
                  <span
                    className={`font-mono font-black text-sm ${
                      difference === 0
                        ? 'text-emerald-600'
                        : difference > 0
                        ? 'text-blue-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {difference >= 0 ? '+' : ''}{settings.currencySymbol}
                    {difference.toFixed(2)}{' '}
                    <span className="text-[11px] font-normal">
                      {difference === 0 ? '(Exacto)' : difference > 0 ? '(Sobrante)' : '(Faltante)'}
                    </span>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Observaciones o comentarios del corte:
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Ej. Fondo de apertura cuadrado, entrega de turno sin incidentes."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCut}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  <FileCheck2 className="w-4 h-4" />
                  Confirmar y Guardar Corte
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
