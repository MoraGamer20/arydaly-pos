import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { soundEffects } from '../../utils/sound';
import {
  Barcode,
  PackageCheck,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Boxes,
  ArrowRight,
} from 'lucide-react';

interface ModalRecepcionEscanerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReceptionItem {
  productId: string;
  name: string;
  barcode: string;
  sku: string;
  currentStock: number;
  quantityReceived: number;
  unit: string;
  costPrice: number;
}

export const ModalRecepcionEscaner: React.FC<ModalRecepcionEscanerProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, receiveMerchandiseBatch, settings, suppliers } = usePOS();

  const [scanInput, setScanInput] = useState('');
  const [items, setItems] = useState<ReceptionItem[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSuccessFinished, setIsSuccessFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setItems([]);
      setScanInput('');
      setFeedbackMsg(null);
      setIsSuccessFinished(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = scanInput.trim().toLowerCase();
    if (!code) return;

    // Look for product by barcode or SKU
    const found = products.find(
      (p) =>
        p.isActive &&
        (p.barcode.trim().toLowerCase() === code || p.sku.trim().toLowerCase() === code)
    );

    if (!found) {
      if (settings.soundOnScan !== false) soundEffects.playScanError();
      setFeedbackMsg({
        type: 'error',
        text: `No se encontró ningún producto con código o SKU "${scanInput}".`,
      });
      setScanInput('');
      inputRef.current?.focus();
      return;
    }

    // Found product - add or increment quantity
    if (settings.soundOnScan !== false) soundEffects.playScanSuccess();

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === found.id);
      if (existing) {
        const updatedQty = existing.quantityReceived + 1;
        setFeedbackMsg({
          type: 'success',
          text: `+1 unidad de "${found.name}" (Total a recibir: ${updatedQty} ${found.unit}s)`,
        });
        return prev.map((item) =>
          item.productId === found.id
            ? { ...item, quantityReceived: updatedQty }
            : item
        );
      } else {
        setFeedbackMsg({
          type: 'success',
          text: `✓ Agregado: "${found.name}" (1 ${found.unit})`,
        });
        return [
          {
            productId: found.id,
            name: found.name,
            barcode: found.barcode,
            sku: found.sku,
            currentStock: found.stock,
            quantityReceived: 1,
            unit: found.unit,
            costPrice: found.costPrice,
          },
          ...prev,
        ];
      }
    });

    setScanInput('');
    inputRef.current?.focus();
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = Math.max(1, item.quantityReceived + delta);
            return { ...item, quantityReceived: newQty };
          }
          return item;
        })
        .filter((item) => item.quantityReceived > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleConfirmReception = () => {
    if (items.length === 0) return;

    const supplier = suppliers.find((s) => s.id === selectedSupplierId);
    const supplierText = supplier ? ` - Proveedor: ${supplier.companyName}` : '';
    const invoiceText = invoiceRef.trim() ? ` (Factura/Remisión: ${invoiceRef.trim()})` : '';
    const reason = `Entrada con Escáner de Mercancía${supplierText}${invoiceText}`;

    receiveMerchandiseBatch(
      items.map((i) => ({ productId: i.productId, quantity: i.quantityReceived })),
      reason
    );

    setIsSuccessFinished(true);
  };

  const totalUnits = items.reduce((sum, item) => sum + item.quantityReceived, 0);
  const totalCost = items.reduce(
    (sum, item) => sum + item.quantityReceived * item.costPrice,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                Recepción & Entrada de Mercancía con Escáner
              </h3>
              <p className="text-xs text-slate-500">
                Escanea los productos continuamente a medida que los desempacas para sumar existencias
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccessFinished ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-800">
              ¡Entrada de Mercancía Registrada!
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Se han agregado <strong>{totalUnits} unidades</strong> de{' '}
              <strong>{items.length} productos</strong> al stock central de ARYDALY. Todos los movimientos quedaron registrados en el Kardex.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Aceptar y Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
            {/* Top Scanning Bar */}
            <form onSubmit={handleScanSubmit} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Pasa el producto por el lector de código de barras o escribe el código:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Escanear producto con lector USB (ej. 7501055365449)..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-emerald-500/40 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden shadow-xs"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar (+1)</span>
                </button>
              </div>

              {/* Feedback Alert */}
              {feedbackMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedbackMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}
            </form>

            {/* Optional Metadata: Supplier & Invoice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Proveedor (Opcional):
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value="">-- Sin proveedor específico --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  No. Factura / Folio de Recepción (Opcional):
                </label>
                <input
                  type="text"
                  value={invoiceRef}
                  onChange={(e) => setInvoiceRef(e.target.value)}
                  placeholder="Ej. FAC-9821 / REM-2026"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Scanned Items Table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {items.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Barcode className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-xs font-semibold text-slate-600">
                    Aún no has escaneado ningún producto.
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                    Pasa los códigos de barras frente al lector USB. Cada lectura incrementará automáticamente la cantidad a recibir.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-4">Producto</th>
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3 text-center">Stock Actual</th>
                      <th className="py-2.5 px-3 text-center">A Recibir</th>
                      <th className="py-2.5 px-3 text-center">Nuevo Stock</th>
                      <th className="py-2.5 px-3 text-right">Costo Estimado</th>
                      <th className="py-2.5 px-3 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const resultingStock = item.currentStock + item.quantityReceived;
                      return (
                        <tr key={item.productId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                            {item.barcode}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-500">
                            {item.currentStock} {item.unit}s
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.productId, -1)}
                                className="w-5 h-5 rounded bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="font-mono font-black text-emerald-800 text-xs px-1">
                                +{item.quantityReceived}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.productId, 1)}
                                className="w-5 h-5 rounded bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                              <span>{resultingStock}</span>
                              <span className="text-[10px]">{item.unit}s</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">
                            {settings.currencySymbol}
                            {(item.quantityReceived * item.costPrice).toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Quitar producto de la lista"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bottom Summary & Actions */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Productos Distintos
                  </span>
                  <strong className="text-base font-black text-slate-900 font-mono">
                    {items.length}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Unidades Totales
                  </span>
                  <strong className="text-base font-black text-emerald-700 font-mono">
                    +{totalUnits} unidades
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Inversión Mercancía
                  </span>
                  <strong className="text-base font-black text-slate-900 font-mono">
                    {settings.currencySymbol}
                    {totalCost.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={items.length === 0}
                  onClick={handleConfirmReception}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Confirmar Entrada de Mercancía</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
