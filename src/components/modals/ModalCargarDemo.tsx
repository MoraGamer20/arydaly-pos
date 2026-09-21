import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  RefreshCw,
  CheckCircle2,
  X,
  Package,
  ShoppingCart,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface ModalCargarDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalCargarDemo: React.FC<ModalCargarDemoProps> = ({
  isOpen,
  onClose,
}) => {
  const { loadDemoData } = usePOS();
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    loadDemoData();
    setIsDone(true);
  };

  const handleFinish = () => {
    setIsDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-indigo-300">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">
                Cargar Datos de Demostración
              </h3>
              <p className="text-xs text-indigo-200">
                Poblar catálogo y ventas de ejemplo de ARYDALY
              </p>
            </div>
          </div>
          {!isDone && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {isDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              ¡Datos Demo Cargados con Éxito!
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Se han cargado productos de abarrotes de ejemplo con código de barras, precios y stock, junto a ventas recientes y movimientos contables para pruebas.
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explorar el Sistema</span>
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Esta acción poblará la base de datos local con datos de muestra para que puedas probar todas las funciones:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Catálogo de productos de abarrotes con códigos de barras</span>
              </li>
              <li className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Historial de tickets y ventas de mostrador</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Movimientos en libro mayor y corte de caja de ejemplo</span>
              </li>
            </ul>

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
                onClick={handleConfirm}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Cargar Datos Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
