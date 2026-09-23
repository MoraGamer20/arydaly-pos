import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { CheckoutModal } from './CheckoutModal';
import { ReceiptModal } from './ReceiptModal';
import { ProductImage } from '../common/ProductImage';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  UserPlus,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Keyboard,
  RotateCcw,
} from 'lucide-react';

export const POSView: React.FC = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    saveCustomer,
    cashSession,
    showReceiptModal,
    setShowReceiptModal,
    setActiveView,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false);
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount and on return
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Filtered products
  const filteredProducts = products.filter((product) => {
    if (!product.isActive) return false;
    const matchesCategory =
      selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.barcode.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      (product.brand && product.brand.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Handle barcode or exact match Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = searchQuery.trim().toLowerCase();
      if (!q) return;

      // 1. Check exact barcode match first
      const exactBarcode = products.find(
        (p) => p.isActive && p.barcode.toLowerCase() === q
      );
      if (exactBarcode) {
        addToCart(exactBarcode, 1);
        setSearchQuery('');
        return;
      }

      // 2. Check exact SKU match
      const exactSku = products.find(
        (p) => p.isActive && p.sku.toLowerCase() === q
      );
      if (exactSku) {
        addToCart(exactSku, 1);
        setSearchQuery('');
        return;
      }

      // 3. If there is only 1 filtered product, add it
      if (filteredProducts.length === 1) {
        addToCart(filteredProducts[0], 1);
        setSearchQuery('');
      }
    }
  };

  // Keyboard shortcut listener for F12 (Cobrar), Esc (Clear cart)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        if (cart.length > 0) {
          setIsCheckoutOpen(true);
        }
      } else if (e.key === 'Escape' && !isCheckoutOpen && !showReceiptModal) {
        if (searchQuery) {
          setSearchQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [cart.length, isCheckoutOpen, showReceiptModal, searchQuery]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * (settings.taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCreateQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCustName.trim()) return;
    const newCust = saveCustomer({
      name: quickCustName.trim(),
      phone: quickCustPhone.trim(),
    });
    setSelectedCustomer(newCust);
    setShowQuickCustomerModal(false);
    setQuickCustName('');
    setQuickCustPhone('');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* LEFT / CENTER: Products Search, Categories & Catalog Grid */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
        {/* Cash warning banner if closed */}
        {cashSession.status === 'closed' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-amber-800 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Atención:</strong> La caja registradora está cerrada. Puedes buscar productos y armar carritos, pero debes abrir turno para registrar cobros en efectivo.
              </span>
            </div>
            <button
              onClick={() => setActiveView('cash')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors text-[11px]"
            >
              Abrir Turno
            </button>
          </div>
        )}

        {/* Top Search Bar with Barcode Scanner Simulator */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Escanear código de barras [F2] o buscar producto por nombre / SKU..."
              className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Barcode className="w-3.5 h-3.5 text-blue-600" />
              <span>Enter p/ agregar</span>
            </div>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap shadow-xs ${
              selectedCategoryId === 'all'
                ? 'bg-blue-600 text-white shadow-blue-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todos ({products.filter((p) => p.isActive).length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.categoryId === cat.id && p.isActive
            ).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-blue-600/30 font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">No se encontraron productos</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                No hay coincidencias para &quot;{searchQuery}&quot;. Intenta con otro nombre, código de barras o categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= product.minStock;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (!isOutOfStock) {
                        addToCart(product, 1);
                      }
                    }}
                    className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer group text-left relative ${
                      isOutOfStock ? 'opacity-60 grayscale' : 'hover:border-blue-400'
                    }`}
                  >
                    {/* Image thumbnail & stock badge */}
                    <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Stock badge */}
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          isOutOfStock
                            ? 'bg-rose-600 text-white'
                            : isLowStock
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isOutOfStock ? 'Agotado' : `${product.stock} ${product.unit}s`}
                      </span>

                      {/* Barcode badge */}
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono font-semibold bg-slate-900/80 text-slate-100 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {product.barcode}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block">
                          {product.brand || 'General'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-sm font-black font-mono text-slate-900">
                          {settings.currencySymbol}
                          {product.salePrice.toFixed(2)}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: SALES CART SIDEBAR */}
      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 shadow-lg">
        {/* Cart Header & Customer Selector */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm text-slate-800">
                Ticket Actual ({totalItemCount} {totalItemCount === 1 ? 'artículo' : 'artículos'})
              </h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                title="Vaciar carrito [Esc]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar</span>
              </button>
            )}
          </div>

          {/* Customer Selection */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <select
                value={selectedCustomer?.id || 'cust-general'}
                onChange={(e) => {
                  const cust = customers.find((c) => c.id === e.target.value);
                  setSelectedCustomer(cust || customers[0]);
                }}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    👤 {c.name} {c.currentBalance > 0 ? `(Debe $${c.currentBalance})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowQuickCustomerModal(true)}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-blue-600 rounded-xl transition-colors shadow-2xs"
              title="Registrar nuevo cliente rápido"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-600">El carrito de compra está vacío</p>
              <p className="text-[11px] text-slate-400">
                Escanea un código de barras o haz clic sobre los productos del catálogo.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {settings.currencySymbol}
                      {item.unitPrice.toFixed(2)} c/u
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({item.product.sku})</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartQuantity(item.product.id, parseInt(e.target.value) || 1)
                    }
                    className="w-10 text-center py-0.5 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />

                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal & Trash */}
                <div className="text-right min-w-[65px]">
                  <p className="text-xs font-black font-mono text-slate-900">
                    {settings.currencySymbol}
                    {item.subtotal.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors mt-0.5"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Bottom Summary & Checkout Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Subtotal & Tax details */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">
                {settings.currencySymbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>IVA ({settings.taxRate}%):</span>
              <span className="font-mono font-medium">
                {settings.currencySymbol}
                {tax.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Grand Total Display */}
          <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
            <span className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
              Total a Pagar
            </span>
            <div className="text-2xl md:text-3xl font-black font-mono text-blue-700">
              {settings.currencySymbol}
              {total.toFixed(2)}
            </div>
          </div>

          {/* Big Green Checkout Button */}
          <button
            onClick={() => {
              if (cart.length > 0) setIsCheckoutOpen(true);
            }}
            disabled={cart.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm md:text-base tracking-wide shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <DollarSign className="w-5 h-5" />
            <span>COBRAR [F12]</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
              <Keyboard className="w-3 h-3 text-slate-400" />
              <span>F12 = Cobrar | Esc = Limpiar</span>
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />

      {/* Quick Customer Creation Modal */}
      {showQuickCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Alta Rápida de Cliente
            </h3>
            <form onSubmit={handleCreateQuickCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={quickCustName}
                  onChange={(e) => setQuickCustName(e.target.value)}
                  placeholder="Ej. Don Antonio Morales"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  value={quickCustPhone}
                  onChange={(e) => setQuickCustPhone(e.target.value)}
                  placeholder="Ej. 55 1234 5678"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickCustomerModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Guardar y Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
