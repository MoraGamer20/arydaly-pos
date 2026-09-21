import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DEMO_RECENT_SALES } from '../data/content';

export const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoy' | 'semana' | 'mes'>('hoy');
  const [activeTab, setActiveTab] = useState<'ventas' | 'transacciones'>('ventas');

  const getStats = () => {
    switch (selectedPeriod) {
      case 'semana':
        return {
          ventas: '$98,240',
          ventasSub: '+12.4% vs semana previa',
          ganancia: '$33,400',
          gananciaSub: 'Margen: 34.0%',
          productos: '684',
          clientes: '262',
          chartData: [
            { label: 'Lun', val: 12400, height: '45%' },
            { label: 'Mar', val: 14800, height: '55%' },
            { label: 'Mie', val: 13900, height: '50%' },
            { label: 'Jue', val: 16500, height: '62%' },
            { label: 'Vie', val: 21800, height: '85%' },
            { label: 'Sab', val: 24500, height: '95%' },
            { label: 'Dom', val: 18450, height: '70%' },
          ],
        };
      case 'mes':
        return {
          ventas: '$148,920',
          ventasSub: '+18.5% vs mes previo',
          ganancia: '$49,610',
          gananciaSub: 'Margen: 33.3%',
          productos: '2,840',
          clientes: '890',
          chartData: [
            { label: 'Sem 1', val: 32000, height: '60%' },
            { label: 'Sem 2', val: 38400, height: '72%' },
            { label: 'Sem 3', val: 41200, height: '78%' },
            { label: 'Sem 4', val: 37320, height: '70%' },
          ],
        };
      case 'hoy':
      default:
        return {
          ventas: '$18,450',
          ventasSub: '+14.2% vs ayer',
          ganancia: '$6,320',
          gananciaSub: 'Margen: 34.2%',
          productos: '126',
          clientes: '48',
          chartData: [
            { label: '09:00', val: 1200, height: '25%' },
            { label: '11:00', val: 3400, height: '50%' },
            { label: '13:00', val: 6100, height: '85%' },
            { label: '15:00', val: 3800, height: '55%' },
            { label: '17:00', val: 5200, height: '75%' },
            { label: '19:00', val: 7650, height: '98%' },
            { label: '21:00', val: 2800, height: '40%' },
          ],
        };
    }
  };

  const currentStats = getStats();

  return (
    <section id="dashboard-demo" className="py-20 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Demostración del Panel Administrativo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-3">
            El control de tu negocio en tiempo real
          </h2>
          <p className="text-base text-slate-600">
            Explora cómo se visualizan las métricas clave, productos con inventario crítico y las últimas ventas en vivo.
          </p>

          {/* Period Selector Tabs */}
          <div className="inline-flex items-center p-1 mt-6 rounded-xl bg-slate-200/80 border border-slate-300/70 shadow-2xs">
            <button
              onClick={() => setSelectedPeriod('hoy')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'hoy'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoy en Caja
            </button>
            <button
              onClick={() => setSelectedPeriod('semana')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'semana'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setSelectedPeriod('mes')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'mes'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Este Mes
            </button>
          </div>
        </div>

        {/* Dashboard Frame */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Top Bar */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Panel de Control Ejecutivo
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    En vivo
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Corte general y balance comercial • Datos demostrativos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Última actualización: hace 1 minuto
              </span>
            </div>
          </div>

          {/* 4 Main KPI Cards */}
          <div className="p-6 border-b border-slate-200/80 bg-slate-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sales Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Ventas acumuladas</span>
                  <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {currentStats.ventas}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{currentStats.ventasSub}</span>
                </div>
              </div>

              {/* Profit Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Ganancia neta real</span>
                  <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">
                  {currentStats.ganancia}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-slate-500">
                  {currentStats.gananciaSub}
                </div>
              </div>

              {/* Products Sold Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Productos vendidos</span>
                  <span className="p-1 rounded-md bg-purple-50 text-purple-600">
                    <ShoppingCart className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {currentStats.productos}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Unidades totales despachadas
                </div>
              </div>

              {/* Customers Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Clientes atendidos</span>
                  <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {currentStats.clientes}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Ticket promedio: <strong>${(18450 / 48).toFixed(1)} MXN</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Center Split: Chart on Left, Inventory Alerts & Transactions on Right */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sales Chart (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Curva de Ingresos ({selectedPeriod.toUpperCase()})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Distribución y picos de venta en caja
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                  Pico mayor: 19:00 hrs ($7,650)
                </span>
              </div>

              {/* Visual Bars Container */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100">
                {currentStats.chartData.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${bar.val.toLocaleString()}
                    </span>
                    <div
                      style={{ height: bar.height }}
                      className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-700 group-hover:to-indigo-600 transition-all shadow-xs"
                    />
                    <span className="text-xs font-semibold text-slate-600 font-mono">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Venta regular
                </span>
                <span>Margen promedio: <strong>34.2%</strong></span>
              </div>
            </div>

            {/* Inventory Alerts & Status (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Alert Box */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Productos con Stock Bajo
                  </span>
                  <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    3 Urgentes
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-amber-200 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">Aceite Vegetal 800ml</span>
                      <span className="text-[10px] text-slate-500 block">Abarrotes • Mínimo 10 pzas</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      3 pzas
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">Café Tostado Gourmet 400g</span>
                      <span className="text-[10px] text-slate-500 block">Abarrotes • Mínimo 8 pzas</span>
                    </div>
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      4 pzas
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">Leche Entera 1L</span>
                      <span className="text-[10px] text-slate-500 block">Lácteos • Mínimo 12 pzas</span>
                    </div>
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      6 pzas
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Actions Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Acciones Rápidas del Sistema
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold flex items-center justify-between">
                      <span>Corte Z de Caja</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold flex items-center justify-between">
                      <span>Reordenar Stock</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Cajero en turno: <strong>Juan Pérez</strong></span>
                  <span className="text-emerald-600 font-bold">Caja #1 Abierta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table: Recent Transactions */}
          <div className="p-6 border-t border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">
                Últimas Transacciones en Mostrador
              </h4>
              <span className="text-xs text-slate-500">Mostrando 4 ventas recientes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Ticket</th>
                    <th className="py-2.5 px-3">Hora</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Artículos</th>
                    <th className="py-2.5 px-3">Método</th>
                    <th className="py-2.5 px-3 text-right">Importe</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEMO_RECENT_SALES.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                        {sale.ticketNumber}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{sale.time}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{sale.customer}</td>
                      <td className="py-2.5 px-3">{sale.itemsCount} productos</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[11px]">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ${sale.total.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sale.status === 'Facturada'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Disclaimer */}
            <p className="mt-4 text-[11px] text-center text-slate-400">
              * Nota: Las cifras y nombres mostrados corresponden a un entorno de demostración comercial para ilustrar el funcionamiento del sistema.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
