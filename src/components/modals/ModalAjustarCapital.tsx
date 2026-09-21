import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  DollarSign,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface ModalAjustarCapitalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalAjustarCapital: React.FC<ModalAjustarCapitalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, setCustomNetCapital, currentUser } = usePOS();

  const [amountStr, setAmountStr] = useState<string>(
    settings.initialCapital !== undefined ? settings.initialCapital.toString() : '0'
  );
  const [reason, setReason] = useState<string>('Ajuste de Capital Base de Operaciones');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCapital = typeof settings.initialCapital === 'number' ? settings.initialCapital : 0;
  const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const presets = [0, 500, 1000, 2000, 5000, 10000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr);
    const validAmount = isNaN(parsedAmount) || parsedAmount < 0 ? 0 : parsedAmount;

    setCustomNetCapital(validAmount, reason.trim() || 'Ajuste de Capital Base');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Fijar Capital Neto / Base
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 text-[10px] font-extrabold uppercase tracking-wider">
                  ARYDALY
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Personaliza el fondo de apertura o capital de tu negocio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {showSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              ¡Capital Actualizado con Éxito!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              El Capital Base ha sido establecido en{' '}
              <strong className="text-slate-800 font-mono">
                {settings.currencySymbol}
                {parseFloat(amountStr || '0').toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </strong>
              . El libro mayor contable y el resumen diario han sido recalibrados.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Current status display */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Capital Registrado Actual
                </span>
                <p className="text-xl font-black font-mono text-slate-900 mt-0.5">
                  {settings.currencySymbol}
                  {currentCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Modo {currentUser?.role === 'admin' ? 'Administrador' : 'Autorizado'}</span>
              </div>
            </div>

            {/* Input Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nuevo Capital Inicial / Neto ({settings.currencySymbol} {settings.currencyCode})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                  {settings.currencySymbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 bg-white border-2 border-blue-600/60 rounded-2xl text-xl font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Puedes escribir <strong>0</strong> si deseas iniciar sin saldo inicial, o ingresar tu capital real.</span>
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                Atajos Rápidos
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmountStr(val.toString())}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                      amountStr === val.toString()
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val === 0 ? '$0 Limpio' : `$${val.toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason / Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Motivo o Justificación del Asiento
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej. Fondo en efectivo real en caja, Aportación de socios..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Info notice */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Al aplicar este cambio, se ajustará el capital de base y se asentará el movimiento en el <strong>Libro Mayor</strong> para que el Saldo de Caja, el Resumen del Día y el Corte concuerden exactamente con este importe.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isAdminOrManager}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform active:scale-95"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Guardar y Fijar Capital</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
