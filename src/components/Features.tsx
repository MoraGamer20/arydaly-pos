import React from 'react';
import {
  Zap,
  PackageCheck,
  Receipt,
  TrendingUp,
  Users,
  UserCheck,
  CheckCircle2,
  Barcode,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FEATURES } from '../data/content';

export const Features: React.FC = () => {
  const renderVisualMockup = (previewType: string, id: string) => {
    switch (previewType) {
      case 'sales':
        return (
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-blue-400 font-semibold">TICKET ACTUAL #004895</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ESCANER ACTIVO
              </span>
            </div>
            <div className="space-y-2 mb-4 font-mono text-xs">
              <div className="flex justify-between bg-slate-800/80 p-2 rounded-md">
                <span>2x Refresco Cola 600ml</span>
                <span className="text-emerald-400 font-bold">$36.00</span>
              </div>
              <div className="flex justify-between bg-slate-800/80 p-2 rounded-md">
                <span>1x Pan de Caja Blanco 680g</span>
                <span className="text-emerald-400 font-bold">$43.50</span>
              </div>
              <div className="flex justify-between bg-slate-800/80 p-2 rounded-md">
                <span>1x Café Tostado Molido 400g</span>
                <span className="text-emerald-400 font-bold">$98.00</span>
              </div>
            </div>
            <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-800/60 mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">TOTAL A COBRAR</span>
              <span className="text-2xl font-black text-white font-mono">$177.50</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-center">
              <div className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                [F12] Efectivo
              </div>
              <div className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                [F11] Tarjeta
              </div>
              <div className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer">
                [F10] Mixto
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 uppercase">Existencias en Almacén</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                2 en Stock Crítico
              </span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Aceite Vegetal 800ml</div>
                  <div className="text-[10px] text-slate-500 font-mono">Stock mínimo: 10 pzas</div>
                </div>
                <span className="px-2 py-1 rounded-md bg-rose-100 text-rose-700 font-bold text-xs">
                  3 pzas (Agotándose)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Leche Entera 1L</div>
                  <div className="text-[10px] text-slate-500 font-mono">Stock mínimo: 12 pzas</div>
                </div>
                <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-xs">
                  6 pzas (Bajo)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Refresco Cola 600ml</div>
                  <div className="text-[10px] text-slate-500 font-mono">Stock mínimo: 15 pzas</div>
                </div>
                <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                  48 pzas (Óptimo)
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Costo total almacén: <strong>$84,350 MXN</strong></span>
              <span className="text-blue-600 font-semibold cursor-pointer">Reordenar sugerido →</span>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-indigo-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-800/80">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  Módulo de Facturación CFDI 4.0
                </span>
              </div>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md">
                TIMBRADO SAT OK
              </span>
            </div>
            <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/60 mb-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Cliente:</span>
                <span className="font-bold text-white">Comercializadora Del Valle S.A.</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>RFC:</span>
                <span className="font-mono text-indigo-300">CVA1804259A1</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Uso CFDI:</span>
                <span className="text-white">G03 - Gastos en general</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Folio Fiscal UUID:</span>
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                  4A91E8B2-7C3F-4182-9B...
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold flex items-center justify-center gap-1.5 text-white shadow-xs cursor-pointer">
                <span>Descargar XML + PDF</span>
              </button>
              <button className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold flex items-center justify-center gap-1.5 text-slate-200 cursor-pointer">
                <span>Enviar a WhatsApp</span>
              </button>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Balance y Utilidades Netas
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600">Septiembre 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-slate-500 block text-[11px]">Ventas Totales Mes</span>
                <span className="text-xl font-black text-blue-700 font-mono">$148,920</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">+18.5% vs mes anterior</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-slate-500 block text-[11px]">Ganancia Neta</span>
                <span className="text-xl font-black text-emerald-700 font-mono">$49,610</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Margen neto: 33.3%</span>
              </div>
            </div>
            {/* Visual Bar Comparison */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Corte de caja matutino</span>
                  <span className="font-mono text-slate-900 font-bold">$9,240</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Corte de caja vespertino</span>
                  <span className="font-mono text-slate-900 font-bold">$9,210</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'employees':
        return (
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Control de Usuarios y Permisos
                </span>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                SEGURIDAD ACTIVA
              </span>
            </div>
            <div className="space-y-2 text-xs mb-4">
              <div className="p-2.5 rounded-lg bg-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-100">Juan Pérez (Cajero Turno A)</span>
                  <span className="text-[10px] text-slate-400 block">Solo cobro y corte ciego</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-800">
                  En Turno
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-100">Ana Robles (Supervisora)</span>
                  <span className="text-[10px] text-slate-400 block">Autoriza cancelaciones y descuentos</span>
                </div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-sm border border-blue-800">
                  Supervisor
                </span>
              </div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span>¿Exigir clave para cancelar ticket?</span>
                <span className="text-emerald-400 font-bold">Activado</span>
              </div>
              <div className="flex items-center justify-between">
                <span>¿Permitir modificar precios en caja?</span>
                <span className="text-rose-400 font-bold">Bloqueado</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="funciones" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Funcionalidades Diseñadas Para Crecer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Potencia comercial y control total en cada venta
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Cada módulo ha sido perfeccionado con la retroalimentación de miles de dueños de tiendas, abarrotes, farmacias y comercios minoristas.
          </p>
        </div>

        {/* Alternating Feature Rows */}
        <div className="space-y-24">
          {FEATURES.map((feature, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={feature.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual Mockup Side */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative">
                    {/* Decorative colored glow backdrop */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-lg opacity-70 -z-10" />
                    {renderVisualMockup(feature.previewType, feature.id)}
                  </div>
                </div>

                {/* Text & Bullets Side */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-black font-mono px-2.5 py-1 rounded-md bg-blue-100 text-blue-700">
                      {feature.number}
                    </span>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {feature.subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-base text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Bullet Benefits */}
                  <div className="space-y-3">
                    {feature.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
