import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Award,
  DollarSign,
  Download,
  Filter,
  ArrowUpRight,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [reportTab, setReportTab] = useState<'top' | 'categories'>('top');

  const topProducts = [
    { name: 'Refresco Cola Original 600ml', units: 1420, revenue: '$25,560', pct: 95 },
    { name: 'Pan de Caja Blanco Tradicional', units: 890, revenue: '$38,715', pct: 80 },
    { name: 'Leche Entera 1L', units: 760, revenue: '$20,140', pct: 68 },
    { name: 'Café Tostado y Molido 400g', units: 310, revenue: '$30,380', pct: 54 },
    { name: 'Aceite Vegetal 800ml', units: 285, revenue: '$12,540', pct: 45 },
  ];

  const categoryProfits = [
    { category: 'Abarrotes y Alimentos', margin: '38%', share: '45%', amount: '$67,014' },
    { category: 'Bebidas y Refrescos', margin: '32%', share: '24%', amount: '$35,740' },
    { category: 'Lácteos y Derivados', margin: '26%', share: '16%', amount: '$23,827' },
    { category: 'Limpieza y Cuidado', margin: '42%', share: '15%', amount: '$22,338' },
  ];

  const monthlyHistory = [
    { month: 'Mar', val: 112000, height: '60%' },
    { month: 'Abr', val: 124000, height: '68%' },
    { month: 'May', val: 138000, height: '76%' },
    { month: 'Jun', val: 135000, height: '74%' },
    { month: 'Jul', val: 142000, height: '80%' },
    { month: 'Ago', val: 146000, height: '84%' },
    { month: 'Sep', val: 154000, height: '94%' },
  ];

  return (
    <section id="reportes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Inteligencia Financiera
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Conoce cómo va tu negocio
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Gráficas claras y reportes ejecutivos para que siempre sepas cuánto vendiste, cuánto ganaste realmente y qué productos generan la mayor rentabilidad.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Venta Mensual Consolidada</span>
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mb-1">
              $154,000 <span className="text-xs text-slate-500 font-sans font-normal">MXN</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18.2% vs mismo mes del año anterior</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-emerald-700 mb-2">
              <span>Ganancia Neta en Bolsillo</span>
              <span className="p-1.5 rounded-lg bg-emerald-200 text-emerald-800">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-700 font-mono mb-1">
              $52,360 <span className="text-xs text-emerald-600 font-sans font-normal">MXN</span>
            </div>
            <div className="text-xs text-emerald-800 font-medium">
              Margen de utilidad neta promedio: <strong>34.0%</strong>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-purple-700 mb-2">
              <span>Ticket Promedio por Cliente</span>
              <span className="p-1.5 rounded-lg bg-purple-200 text-purple-800">
                <BarChart3 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-purple-700 font-mono mb-1">
              $195.40 <span className="text-xs text-purple-600 font-sans font-normal">MXN</span>
            </div>
            <div className="text-xs text-purple-800 font-medium">
              Basado en 788 tickets emitidos este mes
            </div>
          </div>
        </div>

        {/* 2 Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Trend Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Histórico de Ventas Mensuales</h3>
                  <p className="text-xs text-slate-400">Comparativa de ingresos brutos en caja</p>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-800">
                  Crecimiento constante
                </span>
              </div>

              {/* Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-3 pt-4 pb-2">
                {monthlyHistory.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(m.val / 1000).toFixed(0)}k
                    </span>
                    <div
                      style={{ height: m.height }}
                      className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-400 group-hover:from-blue-500 group-hover:to-indigo-300 transition-all shadow-xs"
                    />
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      {m.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Periodo: Marzo - Septiembre 2026</span>
              <span className="text-emerald-400 font-semibold">+37.5% en 7 meses</span>
            </div>
          </div>

          {/* Top Selling Products / Category breakdown (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">Productos Más Vendidos</h3>
                </div>
                <div className="flex gap-1 text-[11px] font-bold">
                  <button
                    onClick={() => setReportTab('top')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      reportTab === 'top'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Top 5
                  </button>
                  <button
                    onClick={() => setReportTab('categories')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      reportTab === 'categories'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Categorías
                  </button>
                </div>
              </div>

              {reportTab === 'top' ? (
                <div className="space-y-3.5">
                  {topProducts.map((prod, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                        <span className="truncate pr-2">
                          <strong className="text-blue-600 mr-1">#{idx + 1}</strong> {prod.name}
                        </span>
                        <span className="font-mono text-slate-900 shrink-0">{prod.revenue}</span>
                      </div>
                      <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${prod.pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        {prod.units} unidades despachadas
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryProfits.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{cat.category}</div>
                        <div className="text-[10px] text-slate-500">
                          Aporte: {cat.share} del total de ventas
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">{cat.amount}</div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                          Margen {cat.margin}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Exportar reporte para contador:</span>
              <button
                onClick={() => alert('Demostración: Reporte ejecutivo generado en Excel')}
                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
