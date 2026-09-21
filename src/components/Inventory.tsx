import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Barcode,
  ArrowDownRight,
  ArrowUpRight,
  Tag,
  DollarSign,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { DEMO_INVENTORY_PRODUCTS } from '../data/content';
import { InventoryDemoProduct } from '../types';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<InventoryDemoProduct[]>(DEMO_INVENTORY_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [inventoryNotification, setInventoryNotification] = useState<string | null>(null);

  const categories = ['Todas', 'Abarrotes', 'Bebidas', 'Lácteos', 'Panadería', 'Limpieza'];

  const filteredProducts = products.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const handleStockAdjustment = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          let newStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
          if (newStock <= item.minStock / 2) {
            newStatus = 'critical';
          } else if (newStock <= item.minStock) {
            newStatus = 'warning';
          }
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );

    const updatedProduct = products.find((p) => p.id === id);
    if (updatedProduct) {
      const action = delta > 0 ? 'Entrada registrada (+1)' : 'Salida / Merma (-1)';
      setInventoryNotification(`${action} en: ${updatedProduct.name}`);
      setTimeout(() => setInventoryNotification(null), 2500);
    }
  };

  return (
    <section id="inventario" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
            Control de Mercancías
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Conoce tu inventario en todo momento
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Nunca más te quedes sin tus productos más vendidos. Registra entradas de proveedores, mermas, caducidades y controla tus existencias con precisión milimétrica.
          </p>
        </div>

        {/* Inventory Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Productos en catálogo</span>
              <Boxes className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">1,480</div>
            <div className="text-xs text-slate-500 mt-1">En 24 categorías activas</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Valor total del inventario</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">$84,350</div>
            <div className="text-xs text-slate-500 mt-1">Precio al costo de compra</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Alertas de stock bajo</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono">3 productos</div>
            <div className="text-xs text-amber-700 mt-1 font-semibold">Requieren reorden urgente</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Movimientos de hoy</span>
              <ArrowDownRight className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">171 movs.</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">45 entradas / 126 ventas</div>
          </div>
        </div>

        {/* Interactive Inventory Table Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o código de barras (ej. 7501...)"
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-sans"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification alert */}
            {inventoryNotification && (
              <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {inventoryNotification}
              </div>
            )}
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-right">Costo</th>
                  <th className="py-3 px-4 text-right">Precio Venta</th>
                  <th className="py-3 px-4 text-right">Margen</th>
                  <th className="py-3 px-4 text-center">Existencia</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Ajustar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((item) => {
                  const marginPercent = ((item.price - item.cost) / item.price) * 100;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 font-medium">
                        {item.barcode}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${item.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                        {marginPercent.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-extrabold text-sm">
                        {item.stock} <span className="text-[10px] text-slate-400 font-normal">pzas</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'optimal' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Óptimo
                          </span>
                        )}
                        {item.status === 'warning' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Stock Bajo ({item.minStock} mín)
                          </span>
                        )}
                        {item.status === 'critical' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                            Crítico
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStockAdjustment(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Registrar entrada de mercancía (+1)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStockAdjustment(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Registrar merma o salida (-1)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer of Table */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
            <span>
              Mostrando {filteredProducts.length} de {products.length} productos filtrados
            </span>
            <span className="text-slate-400">
              * Puedes probar los botones (+) y (-) para simular entradas o salidas y observar cómo se recalculan los estados de stock en vivo.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
