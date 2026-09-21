import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod } from '../../types/pos';
import {
  Banknote,
  CreditCard,
  ArrowRightLeft,
  Layers,
  CheckCircle,
  X,
  AlertCircle,
  Calculator,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  tax,
  total,
}) => {
  const { settings, completeSale, selectedCustomer } = usePOS();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmountPaidInput(total.toFixed(2));
      setReference('');
      setNotes('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, total]);

  if (!isOpen) return null;

  const numPaid = parseFloat(amountPaidInput) || 0;
  const change = Math.max(0, Math.round((numPaid - total) * 100) / 100);
  const isSufficient = paymentMethod !== 'cash' || numPaid >= total;

  // Quick denomination helper
  const handleQuickAdd = (add: number) => {
    setAmountPaidInput(add.toFixed(2));
  };

  const handleExactCash = () => {
    setAmountPaidInput(total.toFixed(2));
  };

  const handleConfirm = () => {
    if (!isSufficient && paymentMethod === 'cash') {
      setError(`El monto recibido ($${numPaid}) es insuficiente para cubrir el total ($${total}).`);
      return;
    }

    const result = completeSale({
      method: paymentMethod,
      amountPaid: paymentMethod === 'cash' ? numPaid : total,
      reference,
      notes,
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Error al procesar la venta.');
    }
  };

  // Keyboard shortcut for Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Cobrar Venta
            </h2>
            <p className="text-xs text-slate-500">
              Cliente:{' '}
              <span className="font-semibold text-slate-700">
                {selectedCustomer?.name || 'Público General'}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Display Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Total a Pagar
            </span>
            <div className="text-3xl md:text-4xl font-black tracking-tight font-mono">
              {settings.currencySymbol}
              {total.toFixed(2)} {settings.currencyCode}
            </div>
          </div>
          <div className="text-right text-xs text-blue-200 space-y-0.5">
            <p>
              Subtotal: {settings.currencySymbol}
              {subtotal.toFixed(2)}
            </p>
            <p>
              IVA ({settings.taxRate}%): {settings.currencySymbol}
              {tax.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'Efectivo', icon: Banknote },
                { id: 'card', label: 'Tarjeta', icon: CreditCard },
                { id: 'transfer', label: 'Transferencia', icon: ArrowRightLeft },
                { id: 'mixed', label: 'Mixto/Otro', icon: Layers },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id as PaymentMethod);
                      setError(null);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Details */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Efectivo Recibido ({settings.currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xl font-bold">
                    {settings.currencySymbol}
                  </span>
                  <input
                    ref={inputRef}
                    type="number"
                    step="any"
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-2xl font-bold font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Denominaciones rápidas:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleExactCash}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Exacto ({settings.currencySymbol}{total.toFixed(0)})
                  </button>
                  {[50, 100, 200, 500, 1000].map((denom) => (
                    <button
                      key={denom}
                      type="button"
                      onClick={() => handleQuickAdd(denom)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      +{settings.currencySymbol}{denom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Change */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  isSufficient
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50/70 border-rose-200 text-rose-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {isSufficient ? 'Cambio a Entregar:' : 'Faltante:'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isSufficient ? 'Entregar al cliente' : 'Se requiere cubrir el total'}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono">
                  {settings.currencySymbol}
                  {isSufficient ? change.toFixed(2) : (total - numPaid).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Card / Transfer Reference */}
          {(paymentMethod === 'card' || paymentMethod === 'transfer') && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {paymentMethod === 'card'
                    ? 'Número de Voucher / Autorización (Opcional)'
                    : 'Clave de Rastreo / Referencia SPEI (Opcional)'}
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder={paymentMethod === 'card' ? 'Ej. AUTH-48291' : 'Ej. SPEI-002938'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Notas o comentarios (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Entrega a domicilio, factura solicitada, etc."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancelar [Esc]
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isSufficient}
            className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-extrabold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirmar y Finalizar Venta [Enter]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
