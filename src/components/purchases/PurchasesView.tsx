import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Truck,
  Plus,
  Trash2,
  CheckCircle,
  X,
  Building2,
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const {
    purchases,
    suppliers,
    products,
    settings,
    recordPurchase,
  } = usePOS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // Purchase items draft
  const [purchaseItems, setPurchaseItems] = useState<
    { productId: string; quantity: number; unitCost: number }[]
  >([]);

  // Current item being added
  const [addItemProdId, setAddItemProdId] = useState(products[0]?.id || '');
  const [addItemQty, setAddItemQty] = useState(10);
  const [addItemCost, setAddItemCost] = useState(products[0]?.costPrice || 10);

  const openNewPurchase = () => {
    setSelectedSupplierId(suppliers[0]?.id || '');
    setInvoiceRef(`FAC-${Math.floor(1000 + Math.random() * 9000)}`);
    setPurchaseNotes('');
    setPurchaseItems([]);
    if (products[0]) {
      setAddItemProdId(products[0].id);
      setAddItemCost(products[0].costPrice);
      setAddItemQty(10);
    }
    setIsModalOpen(true);
  };

  const handleProductSelectChange = (prodId: string) => {
    setAddItemProdId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setAddItemCost(prod.costPrice);
    }
  };

  const handleAddDraftItem = () => {
    if (!addItemProdId || addItemQty <= 0) return;
    const existingIdx = purchaseItems.findIndex((i) => i.productId === addItemProdId);
    if (existingIdx >= 0) {
      const updated = [...purchaseItems];
      updated[existingIdx].quantity += addItemQty;
      updated[existingIdx].unitCost = addItemCost;
      setPurchaseItems(updated);
    } else {
      setPurchaseItems([
        ...purchaseItems,
        { productId: addItemProdId, quantity: addItemQty, unitCost: addItemCost },
      ]);
    }
  };

  const handleRemoveDraftItem = (prodId: string) => {
    setPurchaseItems((prev) => prev.filter((i) => i.productId !== prodId));
  };

  const draftGrandTotal = purchaseItems.reduce(
    (acc, i) => acc + i.quantity * i.unitCost,
    0
  );

  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseItems.length === 0 || !selectedSupplierId) return;

    recordPurchase({
      supplierId: selectedSupplierId,
      items: purchaseItems,
      invoiceReference: invoiceRef,
      notes: purchaseNotes,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Compras a Proveedores & Entradas
          </h2>
          <p className="text-xs text-slate-500">
            Registra surtido de mercancía y reabastece existencias en el inventario automáticamente
          </p>
        </div>

        <button
          onClick={openNewPurchase}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Compra / Factura</span>
        </button>
      </div>

      {/* History of Purchases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-800">
            Historial de Compras ({purchases.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">No. Compra</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Factura / Nota</th>
                <th className="py-3 px-4 text-center">Artículos</th>
                <th className="py-3 px-4 text-right">Total Invertido</th>
                <th className="py-3 px-4">Registrado por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No se han registrado compras a proveedores todavía.
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-800">
                      {p.purchaseNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(p.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{p.supplierName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.invoiceReference || 'S/N'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                        {p.items.reduce((acc, i) => acc + i.quantity, 0)} unidades
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-sm text-slate-900">
                      {settings.currencySymbol}
                      {p.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-[120px]">
                      {p.userName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Purchase */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Registrar Compra y Surtir Inventario
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Proveedor *
                  </label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Factura / Folio de Remisión
                  </label>
                  <input
                    type="text"
                    value={invoiceRef}
                    onChange={(e) => setInvoiceRef(e.target.value)}
                    placeholder="Ej. F-98214"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Add items to order box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Añadir Producto a la Compra
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      Producto
                    </label>
                    <select
                      value={addItemProdId}
                      onChange={(e) => handleProductSelectChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={addItemQty}
                      onChange={(e) => setAddItemQty(parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                      Costo Unit. ({settings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={addItemCost}
                      onChange={(e) => setAddItemCost(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddDraftItem}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar al pedido</span>
                  </button>
                </div>
              </div>

              {/* Items List in this purchase */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Artículos en esta compra ({purchaseItems.length}):
                </span>
                {purchaseItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    Agrega al menos un producto para registrar la compra.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {purchaseItems.map((item) => {
                      const prod = products.find((p) => p.id === item.productId);
                      const subtotal = item.quantity * item.unitCost;
                      return (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800">{prod?.name}</span>
                            <span className="text-slate-500 ml-2 font-mono">
                              {item.quantity} x {settings.currencySymbol}
                              {item.unitCost.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold font-mono text-slate-900">
                              {settings.currencySymbol}
                              {subtotal.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDraftItem(item.productId)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Total Callout */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Total a Pagar al Proveedor:</span>
                <span className="text-lg font-mono font-black">
                  {settings.currencySymbol}
                  {draftGrandTotal.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas de la compra (Opcional)
                </label>
                <input
                  type="text"
                  value={purchaseNotes}
                  onChange={(e) => setPurchaseNotes(e.target.value)}
                  placeholder="Ej. Pago con transferencia a 15 días"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={purchaseItems.length === 0}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirmar Compra y Aumentar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
