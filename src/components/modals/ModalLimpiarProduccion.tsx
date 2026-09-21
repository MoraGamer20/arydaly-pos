import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Package,
  DollarSign,
  TrendingDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ModalLimpiarProduccionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalLimpiarProduccion: React.FC<ModalLimpiarProduccionProps> = ({
  isOpen,
  onClose,
}) => {
  const { clearAllData, settings, products, sales } = usePOS();

  // Mode for products: 'empty' (0 products), 'zero_stock' (keep products but 0 stock), 'keep' (keep as is)
  const [productMode, setProductMode] = useState<'empty' | 'zero_stock' | 'keep'>('empty');
  const [capitalStr, setCapitalStr] = useState<string>('0');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClean = () => {
    const parsedCapital = parseFloat(capitalStr);
    const validCapital = isNaN(parsedCapital) || parsedCapital < 0 ? 0 : parsedCapital;

    clearAllData({
      keepProducts: productMode !== 'empty',
      resetStockToZero: productMode === 'zero_stock',
      initialCapital: validCapital,
    });

    setIsDone(true);
  };

  const handleFinish = () => {
    setIsDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-rose-300">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Limpiar Sistema para Producción
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 text-[10px] font-extrabold uppercase tracking-wider">
                  ARYDALY
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Pasa de modo pruebas a operaciones comerciales reales
              </p>
            </div>
          </div>
          {!isDone && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {isDone ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">
                ¡Sistema Limpio para Producción!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Todas las ventas, compras, gastos y movimientos de demostración han sido vaciados. La caja y el libro mayor han sido reiniciados con{' '}
                <strong className="text-slate-900 font-mono">
                  {settings.currencySymbol}
                  {parseFloat(capitalStr || '0').toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </strong>{' '}
                de capital.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between font-semibold">
                <span>Ventas registradas:</span>
                <span className="font-mono text-emerald-600 font-bold">0</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Saldo inicial en caja:</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {settings.currencySymbol}
                  {parseFloat(capitalStr || '0').toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Catálogo de productos:</span>
                <span className="font-mono text-slate-800 font-bold">
                  {productMode === 'empty'
                    ? '0 productos (Limpio)'
                    : productMode === 'zero_stock'
                    ? 'Productos conservados con stock 0'
                    : 'Productos y stock intactos'}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Entendido y Comenzar a Vender</span>
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Warning callout */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">¿Qué sucederá al limpiar el sistema?</p>
                <p className="text-rose-700 leading-relaxed text-[11px]">
                  Se borrarán todas las <strong>{sales.length} ventas</strong> registradas, compras a proveedores, ingresos, egresos operativos, cortes de caja y movimientos contables.
                </p>
              </div>
            </div>

            {/* Product option selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                ¿Qué deseas hacer con el catálogo de productos ({products.length} productos)?
              </label>
              <div className="space-y-2">
                <label
                  onClick={() => setProductMode('empty')}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                    productMode === 'empty'
                      ? 'border-rose-500 bg-rose-50/50 text-slate-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="productMode"
                    checked={productMode === 'empty'}
                    onChange={() => setProductMode('empty')}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      Vaciar todo el catálogo (0 productos)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Recomendado si vas a dar de alta tus propios productos reales de ARYDALY.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setProductMode('zero_stock')}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                    productMode === 'zero_stock'
                      ? 'border-indigo-500 bg-indigo-50/50 text-slate-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="productMode"
                    checked={productMode === 'zero_stock'}
                    onChange={() => setProductMode('zero_stock')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                      Conservar productos pero reiniciar stock a 0
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Mantiene nombres, precios y códigos de barras pero deja el inventario en cero listo para compras reales.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setProductMode('keep')}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                    productMode === 'keep'
                      ? 'border-blue-500 bg-blue-50/50 text-slate-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="productMode"
                    checked={productMode === 'keep'}
                    onChange={() => setProductMode('keep')}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      Mantener catálogo y existencias actuales
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Solo limpia el historial financiero y de ventas; los productos quedan iguales.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Capital Inicial Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Capital inicial en efectivo para apertura ({settings.currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                  {settings.currencySymbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={capitalStr}
                  onChange={(e) => setCapitalStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Atajos:</span>
                {[0, 500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCapitalStr(val.toString())}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      capitalStr === val.toString()
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClean}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar y Limpiar Todo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
