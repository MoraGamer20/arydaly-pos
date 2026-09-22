import React, { useEffect, useRef } from 'react';
import { Barcode, AlertTriangle, Plus, X } from 'lucide-react';

interface ModalProductoNoEncontradoProps {
  isOpen: boolean;
  barcode: string;
  onClose: () => void;
  onCreateProduct: (barcode: string) => void;
}

export const ModalProductoNoEncontrado: React.FC<ModalProductoNoEncontradoProps> = ({
  isOpen,
  barcode,
  onClose,
  onCreateProduct,
}) => {
  const createBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      createBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-amber-500/10 border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Producto no encontrado</h3>
              <p className="text-xs text-amber-800 font-semibold">Código no registrado en catálogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Se escaneó un código de barras que no coincide con ningún producto activo en el inventario:
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
            <Barcode className="w-7 h-7 text-slate-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Código Escaneado
              </span>
              <span className="font-mono text-base font-black text-slate-800 tracking-wider break-all">
                {barcode}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            ¿Deseas dar de alta este producto ahora mismo? Al seleccionar <strong>Crear producto</strong>, serás dirigido al formulario con este código ya colocado automáticamente.
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            Cancelar (Esc)
          </button>
          <button
            ref={createBtnRef}
            type="button"
            onClick={() => onCreateProduct(barcode)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Crear producto con este código</span>
          </button>
        </div>
      </div>
    </div>
  );
};
