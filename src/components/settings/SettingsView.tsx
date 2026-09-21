import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Settings as SettingsIcon,
  Store,
  Receipt,
  Percent,
  Database,
  Save,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  Cloud,
  Layers,
  DollarSign,
} from 'lucide-react';
import { ModalAjustarCapital } from '../modals/ModalAjustarCapital';
import { ModalLimpiarProduccion } from '../modals/ModalLimpiarProduccion';
import { ModalCargarDemo } from '../modals/ModalCargarDemo';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    setCustomNetCapital,
    loadDemoData,
    clearAllData,
    exportDataJSON,
  } = usePOS();

  const [form, setForm] = useState({ ...settings });
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showCapitalModal, setShowCapitalModal] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [showLoadDemoModal, setShowLoadDemoModal] = useState(false);

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCapital = typeof form.initialCapital === 'number' ? form.initialCapital : 0;
    updateSettings(form);
    setCustomNetCapital(cleanCapital, 'Ajuste de Capital desde Configuración');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleExportBackup = () => {
    exportDataJSON();
  };

  const handleLoadDemo = () => {
    setShowLoadDemoModal(true);
  };

  const handleClearAll = () => {
    setShowCleanModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            Configuración General del Sistema
          </h2>
          <p className="text-xs text-slate-500">
            Personaliza los datos de tu negocio, impuestos, formato de tickets y copias de seguridad
          </p>
        </div>

        {showSavedToast && (
          <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuración guardada correctamente</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store Data */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Identidad del Comercio & Fiscal
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre de la Tienda / Negocio *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                RFC / Identificador Fiscal
              </label>
              <input
                type="text"
                value={form.rfc}
                onChange={(e) => setForm({ ...form, rfc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teléfono de Atención
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirección Física del Establecimiento
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo de Contacto
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Currency & Taxes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Moneda & Configuración Fiscal
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Símbolo de Moneda
              </label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Código de Moneda
              </label>
              <select
                value={form.currencyCode}
                onChange={(e) => setForm({ ...form, currencyCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="USD">USD - Dólar Estadounidense</option>
                <option value="EUR">EUR - Euro</option>
                <option value="COP">COP - Peso Colombiano</option>
                <option value="PEN">PEN - Sol Peruano</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tasa de Impuesto / IVA (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={form.taxRate}
                onChange={(e) =>
                  setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Capital Inicial Base ({form.currencySymbol})
                </label>
                <button
                  type="button"
                  onClick={() => setShowCapitalModal(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                >
                  Asistente de Capital
                </button>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.initialCapital !== undefined && form.initialCapital !== null ? form.initialCapital : 0}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, initialCapital: val === '' ? 0 : parseFloat(val) || 0 });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-semibold">Atajos:</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, initialCapital: 0 })}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold"
                >
                  $0 Limpio
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, initialCapital: 1000 })}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold"
                >
                  $1,000
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, initialCapital: 5000 })}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold"
                >
                  $5,000
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Receipt Template */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Diseño del Ticket Térmico de Venta
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Texto en Encabezado del Ticket
              </label>
              <textarea
                rows={2}
                value={form.receiptHeader}
                onChange={(e) => setForm({ ...form, receiptHeader: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Texto de Pie / Agradecimiento
              </label>
              <textarea
                rows={2}
                value={form.receiptFooter}
                onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Toda la Configuración</span>
          </button>
        </div>
      </form>

      {/* Section 4: Database & System Maintenance */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-slate-700" />
          <h3 className="font-extrabold text-sm text-slate-800">
            Mantenimiento & Respaldo de Base de Datos
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Respaldo JSON */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                Descargar Copia de Respaldo (JSON)
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Exporta tus productos, clientes, ventas, ingresos, egresos y sesiones para resguardar fuera del navegador.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors self-start shadow-xs"
            >
              Exportar Respaldo
            </button>
          </div>

          {/* Card 2: Cargar Datos Demo ARYDALY */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                Cargar Datos Demo ARYDALY
              </h4>
              <p className="text-[11px] text-indigo-700/80 mt-1">
                Puebla el catálogo de abarrotes, ventas, clientes, compras y libro mayor de ARYDALY para pruebas y demostración.
              </p>
            </div>
            <button
              onClick={handleLoadDemo}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors self-start shadow-xs"
            >
              Cargar Datos Demo
            </button>
          </div>

          {/* Card 3: Limpiar Datos para Producción */}
          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-rose-800 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-600" />
                Limpiar Datos para Producción
              </h4>
              <p className="text-[11px] text-rose-600/80 mt-1">
                Elimina ventas, gastos y movimientos de prueba para empezar a registrar operaciones reales desde cero en ARYDALY.
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors self-start shadow-xs"
            >
              Limpiar Datos
            </button>
          </div>
        </div>

        {/* Cloud Readiness note */}
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <Cloud className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Preparado para sincronización en la nube (Supabase / Vercel)</h5>
            <p className="text-blue-800 text-[11px]">
              El esquema PostgreSQL relacional completo con Row Level Security está incluido en el archivo{' '}
              <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900">supabase-schema.sql</code>{' '}
              listo para conectar con Supabase al desplegar en producción en GitHub y Vercel.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Ajustar Capital */}
      <ModalAjustarCapital
        isOpen={showCapitalModal}
        onClose={() => setShowCapitalModal(false)}
      />

      {/* Modal Limpiar Sistema para Producción */}
      <ModalLimpiarProduccion
        isOpen={showCleanModal}
        onClose={() => setShowCleanModal(false)}
      />

      {/* Modal Cargar Datos Demo */}
      <ModalCargarDemo
        isOpen={showLoadDemoModal}
        onClose={() => setShowLoadDemoModal(false)}
      />
    </div>
  );
};
