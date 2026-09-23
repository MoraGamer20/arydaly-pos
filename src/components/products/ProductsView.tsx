import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { QuickProductScannerModal } from './QuickProductScannerModal';
import { ProductImage } from '../common/ProductImage';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  Barcode,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    products,
    categories,
    settings,
    saveProduct,
    deleteProduct,
    pendingNewProductBarcode,
    setPendingNewProductBarcode,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick scanner modal state
  const [isQuickScannerOpen, setIsQuickScannerOpen] = useState(false);
  const [scannerInitialBarcode, setScannerInitialBarcode] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    categoryId: '',
    brand: '',
    costPrice: 0,
    salePrice: 0,
    stock: 0,
    minStock: 5,
    unit: 'pieza',
    imageUrl: '',
    description: '',
  });

  // If another view (POS, inventory) triggered openNewProductWithBarcode
  useEffect(() => {
    if (pendingNewProductBarcode) {
      setScannerInitialBarcode(pendingNewProductBarcode);
      setIsQuickScannerOpen(true);
      setPendingNewProductBarcode(null);
    }
  }, [pendingNewProductBarcode, setPendingNewProductBarcode]);

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `750${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      categoryId: categories[0]?.id || '',
      brand: '',
      costPrice: 0,
      salePrice: 0,
      stock: 10,
      minStock: 5,
      unit: 'pieza',
      imageUrl: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode,
      categoryId: p.categoryId,
      brand: p.brand || '',
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      stock: p.stock,
      minStock: p.minStock,
      unit: p.unit,
      imageUrl: p.imageUrl || '',
      description: p.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.salePrice <= 0) return;

    saveProduct({
      id: editingProduct?.id,
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim(),
      categoryId: formData.categoryId,
      brand: formData.brand.trim(),
      costPrice: Number(formData.costPrice),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      unit: formData.unit,
      imageUrl: formData.imageUrl,
      description: formData.description,
      isActive: true,
    });

    setIsModalOpen(false);
  };

  const handleDelete = (p: Product) => {
    if (window.confirm(`¿Estás seguro de eliminar "${p.name}" del catálogo?`)) {
      deleteProduct(p.id);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q));

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock <= p.minStock && p.stock > 0;
    if (stockFilter === 'out') matchesStock = p.stock <= 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Catálogo de Productos
          </h2>
          <p className="text-xs text-slate-500">
            Administra precios de venta, costos, códigos de barras y existencias ({products.length} productos registrados)
          </p>
        </div>

        {/* Action Buttons: Alta rápida con escáner + Nuevo Producto */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => {
              setScannerInitialBarcode(null);
              setIsQuickScannerOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all"
            title="Captura masiva con escáner USB o código de barras (autocompletado)"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>⚡ Alta rápida con escáner</span>
          </button>

          <button
            onClick={openNewModal}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>+ Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, código o SKU..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category & Stock filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Todo el Inventario</option>
            <option value="low">⚠️ Stock Bajo</option>
            <option value="out">🔴 Agotados (0 stock)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Código / SKU</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">P. Compra</th>
                <th className="py-3 px-4 text-right">P. Venta</th>
                <th className="py-3 px-4 text-right">Margen %</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-3">
                      <Package className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-600">No se encontraron productos</p>
                      <p className="text-[11px] text-slate-400">
                        {searchQuery ? `No hay coincidencias para "${searchQuery}".` : 'Comienza registrando tu catálogo.'}
                      </p>
                      <button
                        onClick={() => setIsQuickScannerOpen(true)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>⚡ Alta rápida con escáner</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const category = categories.find((c) => c.id === product.categoryId);
                  const marginPercent =
                    product.salePrice > 0
                      ? Math.round(
                          ((product.salePrice - product.costPrice) / product.salePrice) * 100
                        )
                      : 0;

                  const isLow = product.stock <= product.minStock && product.stock > 0;
                  const isOut = product.stock <= 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <ProductImage
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{product.name}</p>
                            <p className="text-[10px] text-slate-400">{product.brand || 'General'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <p className="font-bold text-slate-700">{product.barcode}</p>
                        <p className="text-[10px] text-slate-400">{product.sku}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                          {category?.name || 'Sin categoría'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-600">
                        {settings.currencySymbol}
                        {product.costPrice.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {settings.currencySymbol}
                        {product.salePrice.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            marginPercent >= 30
                              ? 'bg-emerald-50 text-emerald-700'
                              : marginPercent > 10
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {marginPercent}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock} {product.unit}s
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK PRODUCT SCANNER MODAL (Alta rápida continua con escáner) */}
      <QuickProductScannerModal
        isOpen={isQuickScannerOpen}
        onClose={() => setIsQuickScannerOpen(false)}
        initialBarcode={scannerInitialBarcode}
        onEditExisting={(prod) => openEditModal(prod)}
      />

      {/* Traditional New / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Coca-Cola Original 600 ml"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SKU / Clave Interna *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código de Barras *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej. Bimbo, Sabritas, Alpura"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Precio de Compra (Costo) ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Precio de Venta al Público * ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-blue-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Min Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Mínimo (Alerta)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData({ ...formData, minStock: parseFloat(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="pieza">Pieza (pza)</option>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="litro">Litro (lt)</option>
                    <option value="paquete">Paquete</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>

                {/* Image URL preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL de Imagen</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... (o se obtiene con escáner)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre presentación, sabor, etc."
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
