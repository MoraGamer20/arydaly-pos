import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { lookupBarcodeOnline, normalizeBarcode, ExternalProductResult } from '../../services/openFoodFacts';
import { soundEffects } from '../../utils/sound';
import { ProductImage } from '../common/ProductImage';
import {
  Barcode,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Zap,
  ArrowRight,
  RefreshCw,
  X,
  Keyboard,
  Package,
  Sparkles,
  Edit2,
  DollarSign,
  Plus,
} from 'lucide-react';

interface QuickProductScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditExisting?: (product: Product) => void;
  initialBarcode?: string | null;
}

type ScanStage = 'scan' | 'duplicate' | 'form';

export const QuickProductScannerModal: React.FC<QuickProductScannerModalProps> = ({
  isOpen,
  onClose,
  onEditExisting,
  initialBarcode,
}) => {
  const { products, categories, settings, saveProduct } = usePOS();

  // Modal flow state
  const [stage, setStage] = useState<ScanStage>('scan');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupFeedback, setLookupFeedback] = useState<{
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    description: string;
  } | null>(null);

  // If duplicate found
  const [duplicateProduct, setDuplicateProduct] = useState<Product | null>(null);

  // Count registered in current continuous session
  const [sessionCount, setSessionCount] = useState(0);
  const [lastSavedName, setLastSavedName] = useState<string | null>(null);

  // Product Form Data for the current scanned item
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
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

  // Focus references
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const costPriceInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset on open
  useEffect(() => {
    if (isOpen) {
      setStage('scan');
      setBarcodeInput(initialBarcode || '');
      setDuplicateProduct(null);
      setLookupFeedback(null);
      setLastSavedName(null);

      // Auto-focus barcode input
      setTimeout(() => {
        barcodeInputRef.current?.focus();
        barcodeInputRef.current?.select();
      }, 100);

      // If initialBarcode provided, trigger search immediately
      if (initialBarcode && initialBarcode.trim()) {
        processBarcode(initialBarcode.trim());
      }
    }
  }, [isOpen, initialBarcode]);

  // Global keydown listeners for shortcuts: Esc (close/cancel), F2 (focus search/scan)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (stage === 'form' || stage === 'duplicate') {
          // Return to scan stage
          setStage('scan');
          setBarcodeInput('');
          setDuplicateProduct(null);
          setLookupFeedback(null);
          setTimeout(() => barcodeInputRef.current?.focus(), 80);
        } else {
          onClose();
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        setStage('scan');
        setBarcodeInput('');
        setDuplicateProduct(null);
        setTimeout(() => barcodeInputRef.current?.focus(), 80);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stage, onClose]);

  if (!isOpen) return null;

  /**
   * Main scan & lookup processor
   */
  const processBarcode = async (rawCode: string) => {
    const code = normalizeBarcode(rawCode);
    if (!code) return;

    setIsSearching(true);
    setLookupFeedback(null);

    // 1. DUPLICATE CHECK: Search first in ARYDALY database
    const existing = products.find(
      (p) => p.barcode.trim().toLowerCase() === code.toLowerCase()
    );

    if (existing) {
      setIsSearching(false);
      if (settings.soundOnScan !== false) soundEffects.playScanSuccess();
      setDuplicateProduct(existing);
      setStage('duplicate');
      return;
    }

    // 2. Query external catalog (Open Food Facts + local catalog)
    try {
      const result: ExternalProductResult = await lookupBarcodeOnline(code, categories);

      const generatedSku = `SKU-${code.slice(-5) || Math.floor(1000 + Math.random() * 9000)}`;

      if (result.found) {
        if (settings.soundOnScan !== false) soundEffects.playScanSuccess();
        setLookupFeedback({
          type: 'success',
          title: 'Producto identificado automáticamente',
          description: `Se obtuvieron los datos de "${result.name}". Confirma precios y existencias.`,
        });

        setFormData({
          name: result.name,
          sku: generatedSku,
          barcode: code,
          categoryId: result.categorySuggestion || categories[0]?.id || '',
          brand: result.brand || '',
          costPrice: 0,
          salePrice: 0,
          stock: 10,
          minStock: 5,
          unit: result.unit || 'pieza',
          imageUrl: result.imageUrl || '',
          description: result.description || '',
        });

        setStage('form');
        // Auto-focus on Cost Price so user only types Cost & Sale Price!
        setTimeout(() => {
          costPriceInputRef.current?.focus();
          costPriceInputRef.current?.select();
        }, 150);
      } else {
        // Not found in external source -> Don't block! Open form for manual capture
        if (settings.soundOnScan !== false) soundEffects.playScanError();
        setLookupFeedback({
          type: 'info',
          title: 'Producto no encontrado automáticamente',
          description: `El código ${code} no está en la base externa. Captura los datos para darlo de alta en ARYDALY.`,
        });

        setFormData({
          name: '',
          sku: generatedSku,
          barcode: code,
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

        setStage('form');
        // Auto-focus on Name input for manual entry
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 150);
      }
    } catch (err) {
      console.error('Error during barcode lookup:', err);
      // Fallback open manual form
      setFormData({
        name: '',
        sku: `SKU-${code.slice(-5)}`,
        barcode: code,
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
      setStage('form');
      setTimeout(() => nameInputRef.current?.focus(), 150);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle barcode submit (from Enter key, USB scanner, or manual button)
   */
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!barcodeInput.trim() || isSearching) return;
    processBarcode(barcodeInput.trim());
  };

  /**
   * Save product and loop back to scan immediately for continuous fast loading
   */
  const handleSaveAndScanNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Por favor ingresa el nombre del producto.');
      nameInputRef.current?.focus();
      return;
    }

    if (Number(formData.salePrice) <= 0) {
      alert('El precio de venta debe ser mayor a 0.');
      return;
    }

    // Save in POS Context
    const saved = saveProduct({
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim(),
      categoryId: formData.categoryId,
      brand: formData.brand.trim() || 'General',
      costPrice: Number(formData.costPrice) || 0,
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 5,
      unit: formData.unit,
      imageUrl: formData.imageUrl.trim() || undefined,
      description: formData.description.trim() || undefined,
      isActive: true,
    });

    if (settings.soundOnScan !== false) soundEffects.playRegisterBell();

    setSessionCount((c) => c + 1);
    setLastSavedName(saved.name);

    // Continuous loop: Return immediately to scan stage and focus barcode input!
    setStage('scan');
    setBarcodeInput('');
    setDuplicateProduct(null);
    setLookupFeedback({
      type: 'success',
      title: '¡Producto registrado con éxito!',
      description: `"${saved.name}" fue agregado al catálogo. Escanea el siguiente producto.`,
    });

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 100);
  };

  /**
   * If duplicate exists, user clicks "Editar este producto"
   */
  const handleEditExisting = () => {
    if (duplicateProduct) {
      if (onEditExisting) {
        onEditExisting(duplicateProduct);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with ARYDALY branding */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">Alta Rápida con Escáner</h3>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Carga Continua
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Escanear código → Autocompletar → Confirmar precios/stock → Siguiente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sessionCount > 0 && (
              <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold border border-white/20 hidden sm:block">
                +{sessionCount} registrados
              </div>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Notification feedback bar */}
          {lookupFeedback && (
            <div
              className={`p-3.5 rounded-2xl flex items-start gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
                lookupFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : lookupFeedback.type === 'warning'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : lookupFeedback.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}
            >
              {lookupFeedback.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {lookupFeedback.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {lookupFeedback.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              {lookupFeedback.type === 'info' && (
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold">{lookupFeedback.title}</p>
                <p className="text-[11px] opacity-90 mt-0.5">{lookupFeedback.description}</p>
              </div>
            </div>
          )}

          {/* STAGE 1: SCANNER INPUT */}
          {stage === 'scan' && (
            <div className="space-y-4">
              <form onSubmit={handleBarcodeSubmit} className="space-y-3">
                <div className="bg-slate-50 border-2 border-dashed border-blue-400/80 rounded-2xl p-6 text-center space-y-3 hover:bg-blue-50/20 transition-colors">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                    <Barcode className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      Escanea el código de barras del producto
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Apunta tu lector USB o pistola de código (EAN-13, UPC, EAN-8) o escribe el código manualmente y presiona <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-mono rounded text-[10px]">Enter</kbd>.
                    </p>
                  </div>

                  <div className="relative max-w-md mx-auto">
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      autoFocus
                      disabled={isSearching}
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Ej. 7501055365449..."
                      className="w-full text-center pl-10 pr-24 py-3 bg-white border-2 border-blue-500 rounded-2xl text-base font-mono font-bold text-slate-900 tracking-wider shadow-inner focus:outline-hidden focus:ring-4 focus:ring-blue-500/20"
                    />
                    <Barcode className="w-5 h-5 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <button
                      type="submit"
                      disabled={isSearching || !barcodeInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    >
                      {isSearching ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <span>Buscar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick shortcut chips */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 bg-slate-100/70 p-3 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                  Atajos: <kbd className="px-1 bg-white border border-slate-300 rounded font-mono text-[10px]">Enter</kbd> Buscar/Guardar • <kbd className="px-1 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> Cancelar • <kbd className="px-1 bg-white border border-slate-300 rounded font-mono text-[10px]">F2</kbd> Re-enfocar
                </span>
                <span className="font-semibold text-blue-600">
                  Total en catálogo: {products.length} productos
                </span>
              </div>
            </div>
          )}

          {/* STAGE 2: DUPLICATE FOUND WARNING */}
          {stage === 'duplicate' && duplicateProduct && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-900">
                    Este producto ya está registrado en ARYDALY
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    El código de barras <span className="font-mono font-bold">{duplicateProduct.barcode}</span> ya pertenece a este producto en tu catálogo:
                  </p>
                </div>
              </div>

              {/* Product mini card */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <ProductImage
                    src={duplicateProduct.imageUrl}
                    alt={duplicateProduct.name}
                    containerClassName="w-full h-full bg-slate-100 flex items-center justify-center"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-sm truncate">{duplicateProduct.name}</p>
                  <p className="text-xs text-slate-500 font-mono">
                    SKU: {duplicateProduct.sku} • Código: {duplicateProduct.barcode}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="font-bold text-blue-700 font-mono">
                      Precio: {settings.currencySymbol}{duplicateProduct.salePrice.toFixed(2)}
                    </span>
                    <span className="text-slate-600">
                      Stock: <strong className="text-slate-900">{duplicateProduct.stock}</strong> {duplicateProduct.unit}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStage('scan');
                    setDuplicateProduct(null);
                    setBarcodeInput('');
                    setTimeout(() => barcodeInputRef.current?.focus(), 80);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50"
                >
                  Escanear Otro Producto
                </button>
                <button
                  type="button"
                  onClick={handleEditExisting}
                  className="w-full sm:w-auto px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Este Producto</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: SMART AUTO-FILLED FORM */}
          {stage === 'form' && (
            <form onSubmit={handleSaveAndScanNext} className="space-y-4">
              {/* Product preview banner */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3.5">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 shadow-xs">
                  <ProductImage
                    src={formData.imageUrl}
                    alt={formData.name || 'Producto nuevo'}
                    containerClassName="w-full h-full bg-slate-100 flex items-center justify-center"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md font-mono">
                      {formData.barcode}
                    </span>
                    {formData.brand && (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                        {formData.brand}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-1 line-clamp-1">
                    {formData.name || '(Sin nombre especificado)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ingresa tus precios y existencias locales de ARYDALY. Puedes editar cualquier campo antes de guardar.
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Coca-Cola Original 600 ml"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej. Coca-Cola, Sabritas, Bimbo"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COST PRICE (Highlighted) */}
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-200">
                  <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center justify-between">
                    <span>Precio de Compra (Costo)</span>
                    <span className="font-mono text-[10px] text-blue-700">{settings.currencySymbol}</span>
                  </label>
                  <input
                    ref={costPriceInputRef}
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* SALE PRICE (Highlighted) */}
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 mb-1 flex items-center justify-between">
                    <span>Precio de Venta al Público *</span>
                    <span className="font-mono text-[10px] text-emerald-700">{settings.currencySymbol}</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.salePrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-black text-emerald-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* STOCK INICIAL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* STOCK MINIMO */}
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
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="pieza">Pieza (pza)</option>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="litro">Litro (lt)</option>
                    <option value="paquete">Paquete</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Clave</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setStage('scan');
                    setBarcodeInput('');
                    setTimeout(() => barcodeInputRef.current?.focus(), 80);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  ← Volver a Escanear
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar y Escanear Siguiente (Enter)</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer session info */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between shrink-0">
          <span>
            {lastSavedName ? (
              <span className="text-emerald-700 font-semibold">
                ✓ Último registrado: <strong>{lastSavedName}</strong>
              </span>
            ) : (
              'Listo para captura masiva de catálogo.'
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold"
          >
            Terminar y Salir
          </button>
        </div>
      </div>
    </div>
  );
};
