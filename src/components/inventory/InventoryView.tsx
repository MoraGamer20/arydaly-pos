import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { soundEffects } from '../../utils/sound';
import { ModalRecepcionEscaner } from '../modals/ModalRecepcionEscaner';
import {
  Boxes,
  Sliders,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  History,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
  CheckCircle2,
  X,
  Barcode,
  PackageCheck,
  Search,
  Plus,
  Minus,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    inventoryMovements,
    settings,
    adjustInventory,
    setActiveView,
  } = usePOS();

  // Calculations
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalCostValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  const totalSaleValue = products.reduce((acc, p) => acc + p.stock * p.salePrice, 0);
  const potentialProfit = Math.max(0, totalSaleValue - totalCostValue);

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  // Modal for adjustment
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [adjustType, setAdjustType] = useState<'add' | 'subtract' | 'set'>('add');
  const [adjustAmount, setAdjustAmount] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState('Entrada de mercancía / Reabastecimiento');
  const [notes, setNotes] = useState('');

  // Scanner & Reception Modal state
  const [isRecepcionModalOpen, setIsRecepcionModalOpen] = useState(false);
  const [quickScanQuery, setQuickScanQuery] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'found' | 'not_found'>('idle');

  const currentProduct = products.find((p) => p.id === selectedProductId);

  const handleOpenAdjust = (prodId?: string, type: 'add' | 'subtract' | 'set' = 'add', reason = 'Entrada de mercancía / Reabastecimiento') => {
    if (prodId) setSelectedProductId(prodId);
    setAdjustAmount(1);
    setAdjustType(type);
    setAdjustReason(reason);
    setNotes('');
    setIsAdjustModalOpen(true);
  };

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickScanQuery.trim().toLowerCase();
    if (!q) return;

    const found = products.find(
      (p) =>
        p.isActive &&
        (p.barcode.trim().toLowerCase() === q ||
          p.sku.trim().toLowerCase() === q ||
          p.name.trim().toLowerCase().includes(q))
    );

    if (found) {
      if (settings.soundOnScan !== false) soundEffects.playScanSuccess();
      setScannedProduct(found);
      setScanStatus('found');
    } else {
      if (settings.soundOnScan !== false) soundEffects.playScanError();
      setScannedProduct(null);
      setScanStatus('not_found');
    }
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    let newStock = currentProduct.stock;
    if (adjustType === 'add') {
      newStock += adjustAmount;
    } else if (adjustType === 'subtract') {
      newStock = Math.max(0, newStock - adjustAmount);
    } else {
      newStock = Math.max(0, adjustAmount);
    }

    const fullReason = notes ? `${adjustReason} - ${notes}` : adjustReason;
    adjustInventory(currentProduct.id, newStock, fullReason);
    setIsAdjustModalOpen(false);

    // Update scanned product if it matches
    if (scannedProduct && scannedProduct.id === currentProduct.id) {
      setScannedProduct({ ...scannedProduct, stock: newStock });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-600" />
            Control de Inventario & Kardex
          </h2>
          <p className="text-xs text-slate-500">
            Supervisa existencias físicas, valor total en almacén y movimientos auditados
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setIsRecepcionModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Entrada con Escáner</span>
          </button>
          <button
            onClick={() => handleOpenAdjust()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Ajustar Stock Manual</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Existencias Totales
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {totalStockUnits} unidades
            </div>
            <p className="text-[11px] text-slate-500">{products.length} productos registrados</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Valor a Costo
            </span>
            <div className="text-2xl font-black font-mono text-slate-900">
              {settings.currencySymbol}
              {totalCostValue.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">Capital invertido en mercancía</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Valor a la Venta
            </span>
            <div className="text-2xl font-black font-mono text-blue-700">
              {settings.currencySymbol}
              {totalSaleValue.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">Recuperación estimada total</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Utilidad Potencial
            </span>
            <div className="text-2xl font-black font-mono text-emerald-600">
              {settings.currencySymbol}
              {potentialProfit.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">
              Margen promedio:{' '}
              <strong>
                {totalSaleValue > 0
                  ? Math.round((potentialProfit / totalSaleValue) * 100)
                  : 0}
                %
              </strong>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Scanner Lookup & Stock Adjust Card */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Escanear Producto para Consulta y Ajuste Inmediato
              </h3>
              <p className="text-[11px] text-slate-500">
                Pasa cualquier código por el lector para ver existencias en tiempo real y aplicar entrada, salida o ajuste
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleQuickScan} className="flex gap-2">
          <div className="relative flex-1">
            <Barcode className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickScanQuery}
              onChange={(e) => setQuickScanQuery(e.target.value)}
              placeholder="Escanear código de barras con lector USB o teclear código / SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
        </form>

        {scanStatus === 'not_found' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              No se encontró ningún producto con el código <strong>&quot;{quickScanQuery}&quot;</strong> en el inventario.
            </span>
          </div>
        )}

        {scannedProduct && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-scale-up">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                <img
                  src={scannedProduct.imageUrl}
                  alt={scannedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-blue-600">
                    {scannedProduct.brand || 'General'}
                  </span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                    {scannedProduct.barcode}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{scannedProduct.name}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-mono">SKU: {scannedProduct.sku}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-slate-700">
                    Stock actual:{' '}
                    <strong
                      className={`font-mono text-xs ${
                        scannedProduct.stock <= 0
                          ? 'text-rose-600'
                          : scannedProduct.stock <= scannedProduct.minStock
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {scannedProduct.stock} {scannedProduct.unit}s
                    </strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">Mínimo: {scannedProduct.minStock}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions for scanned product */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => handleOpenAdjust(scannedProduct.id, 'add', 'Entrada rápida por escaneo')}
                className="flex-1 md:flex-initial px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Entrada</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAdjust(scannedProduct.id, 'subtract', 'Salida / Merma')}
                className="flex-1 md:flex-initial px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Salida</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAdjust(scannedProduct.id, 'set', 'Ajuste directo por inventario')}
                className="flex-1 md:flex-initial px-3 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Ajuste Físico</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Critical Stock Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-slate-800 text-base">
                Productos con Stock Mínimo o Agotados ({lowStockProducts.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveView('purchases')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Comprar a Proveedor &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3 text-center">Stock Actual</th>
                  <th className="pb-3 text-center">Stock Mínimo</th>
                  <th className="pb-3 text-right">Costo Reposición</th>
                  <th className="pb-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{prod.name}</td>
                    <td className="py-3 font-mono text-slate-500">{prod.sku}</td>
                    <td className="py-3 text-center font-bold font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          prod.stock <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prod.stock} {prod.unit}s
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono text-slate-500">
                      {prod.minStock} {prod.unit}s
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      {settings.currencySymbol}
                      {prod.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => handleOpenAdjust(prod.id)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Ajustar Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movements Kardex Table */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Historial de Movimientos de Inventario (Kardex)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {inventoryMovements.length} movimientos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold bg-slate-50">
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-3">Producto</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3 text-center">Cant.</th>
                <th className="py-3 px-3 text-center">Previo</th>
                <th className="py-3 px-3 text-center">Nuevo Stock</th>
                <th className="py-3 px-3">Motivo / Detalle</th>
                <th className="py-3 px-3">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryMovements.map((m) => {
                const isPositive = m.quantity > 0;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString('es-MX')}{' '}
                      {new Date(m.createdAt).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{m.productName}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          m.movementType === 'purchase' || m.movementType === 'adjustment_in'
                            ? 'bg-emerald-50 text-emerald-700'
                            : m.movementType === 'sale'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-rose-600" />
                        )}
                        {m.movementType === 'sale'
                          ? 'Venta'
                          : m.movementType === 'purchase'
                          ? 'Compra'
                          : m.movementType === 'adjustment_in'
                          ? 'Ajuste +'
                          : 'Ajuste -'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                        {isPositive ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {m.previousStock}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                      {m.newStock}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{m.reason}</td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-[120px]">
                      {m.userName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {isAdjustModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                Ajustar Inventario Manual
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seleccionar Producto
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actual: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex justify-between items-center">
                <span>Existencia Actual:</span>
                <span className="text-base font-mono font-black">
                  {currentProduct.stock} {currentProduct.unit}s
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Operación
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'add', label: 'Sumar +' },
                    { id: 'subtract', label: 'Restar -' },
                    { id: 'set', label: 'Fijar Total =' },
                  ].map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setAdjustType(op.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        adjustType === op.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cantidad a {adjustType === 'add' ? 'Añadir' : adjustType === 'subtract' ? 'Descontar' : 'Establecer'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo del Ajuste
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Entrada de mercancía / Reabastecimiento">
                    Entrada de mercancía / Reabastecimiento
                  </option>
                  <option value="Merma o producto caducado">Merma o producto caducado</option>
                  <option value="Ajuste por conteo físico / Auditoría">
                    Ajuste por conteo físico / Auditoría
                  </option>
                  <option value="Devolución de cliente">Devolución de cliente</option>
                  <option value="Consumo interno del negocio">Consumo interno del negocio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas adicionales (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Factura F-1284, lote dañado, etc."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Reception Modal */}
      <ModalRecepcionEscaner
        isOpen={isRecepcionModalOpen}
        onClose={() => setIsRecepcionModalOpen(false)}
      />
    </div>
  );
};
