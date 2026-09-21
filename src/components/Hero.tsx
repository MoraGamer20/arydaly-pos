import React, { useState } from 'react';
import {
  Download,
  PlayCircle,
  CheckCircle,
  Zap,
  TrendingUp,
  Package,
  CreditCard,
  Plus,
  Minus,
  Sparkles,
  Barcode,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { HERO_DATA } from '../data/content';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenTourModal: () => void;
  onOpenBuyModal: () => void;
}

interface MiniTicketItem {
  id: string;
  name: string;
  code: string;
  qty: number;
  price: number;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenDemoModal,
  onOpenTourModal,
  onOpenBuyModal,
}) => {
  // Interactive mini ticket in the hero mockup
  const [ticketItems, setTicketItems] = useState<MiniTicketItem[]>([
    { id: '1', name: 'Refresco Cola 600ml', code: '750105531', qty: 2, price: 18.0 },
    { id: '2', name: 'Pan Blanco Tradicional', code: '750102030', qty: 1, price: 43.5 },
    { id: '3', name: 'Aceite Vegetal 800ml', code: '750103049', qty: 1, price: 44.0 },
  ]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = ticketItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const itemsCount = ticketItems.reduce((acc, item) => acc + item.qty, 0);

  const updateQty = (id: string, delta: number) => {
    setTicketItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta);
            return { ...item, qty: newQty };
          }
          return item;
        })
    );
  };

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 2800);
  };

  const addQuickProduct = () => {
    const randomProducts = [
      { name: 'Leche Entera 1L', code: '750100014', price: 26.5 },
      { name: 'Café Tostado 400g', code: '750107771', price: 98.0 },
      { name: 'Galletas de Avena 250g', code: '750108882', price: 22.0 },
    ];
    const item = randomProducts[Math.floor(Math.random() * randomProducts.length)];
    const existing = ticketItems.find((p) => p.name === item.name);
    if (existing) {
      updateQty(existing.id, 1);
    } else {
      setTicketItems((prev) => [
        ...prev,
        { id: String(Date.now()), name: item.name, code: item.code, qty: 1, price: item.price },
      ]);
    }
  };

  return (
    <section
      id="hero-principal"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-blue-100/60 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-72 h-72 bg-indigo-100/50 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content & Headlines */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{HERO_DATA.badge}</span>
            <span className="hidden sm:inline text-blue-400">•</span>
            <span className="hidden sm:inline text-slate-600 font-normal">Compatible con Windows, Mac y Web</span>
          </div>

          {/* H1 Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
            <span className="text-blue-600">{HERO_DATA.titleHighlight}</span>{' '}
            {HERO_DATA.titleSuffix}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            {HERO_DATA.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <button
              id="hero-cta-demo"
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{HERO_DATA.ctaPrimary}</span>
            </button>

            <button
              id="hero-cta-tour"
              onClick={onOpenTourModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <PlayCircle className="w-5 h-5 text-blue-600" />
              <span>{HERO_DATA.ctaSecondary}</span>
            </button>
          </div>

          {/* Key Trust Checkmarks under buttons */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500 font-medium mb-12">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Instalación en 2 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Soporte técnico en español
            </span>
          </div>
        </div>

        {/* Realistic SaaS POS System Showcase Mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Decorative Outer Shadow Frame */}
          <div className="relative rounded-2xl bg-slate-900/5 p-2 sm:p-3 ring-1 ring-slate-900/10 shadow-2xl shadow-blue-900/10">
            {/* Mockup Window */}
            <div className="rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-xs">
              {/* Window Header / Title Bar */}
              <div className="bg-slate-900 text-slate-200 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 ml-2 hidden sm:inline">
                    VentaPro POS v4.5 • Caja Principal (Turno Activo)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Servidor en línea
                  </span>
                  <span className="text-slate-400 font-mono">14:32:05</span>
                  <span className="text-slate-300 font-medium">Cajero: Juan Pérez</span>
                </div>
              </div>

              {/* POS Interface Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                {/* Left Side: Active Ticket / Cashier Grid (7 cols) */}
                <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-slate-50/50">
                  <div>
                    {/* Scanner & Quick Search Bar */}
                    <div className="flex items-center gap-2 mb-3.5">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Barcode className="w-5 h-5 text-blue-600" />
                        </div>
                        <input
                          type="text"
                          readOnly
                          value="7501055312345 (Lector listo...)"
                          aria-label="Código de barras"
                          className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 shadow-2xs font-mono"
                        />
                      </div>
                      <button
                        onClick={addQuickProduct}
                        className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-200 border border-blue-300/60 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Simular escaneo de nuevo producto"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar producto
                      </button>
                    </div>

                    {/* Active Items Table */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="grid grid-cols-12 bg-slate-100/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider py-2 px-3 border-b border-slate-200">
                        <span className="col-span-6">Producto</span>
                        <span className="col-span-3 text-center">Cantidad</span>
                        <span className="col-span-3 text-right">Importe</span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-48 sm:max-h-56 overflow-y-auto">
                        {ticketItems.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-12 items-center py-2 px-3 text-xs text-slate-800 hover:bg-blue-50/40 transition-colors"
                          >
                            <div className="col-span-6 flex flex-col">
                              <span className="font-semibold text-slate-900 truncate">{item.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{item.code}</span>
                            </div>
                            <div className="col-span-3 flex items-center justify-center gap-1">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                                aria-label="Disminuir"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold w-6 text-center text-slate-900">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                                aria-label="Aumentar"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                              ${(item.qty * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment & Totals Summary Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2 text-xs text-slate-600">
                      <span>Artículos en ticket: <strong className="text-slate-900 font-bold">{itemsCount}</strong></span>
                      <span>IVA Incluido (16%): <strong className="text-slate-900 font-mono">${(subtotal * 0.1379).toFixed(2)}</strong></span>
                    </div>

                    <div className="flex items-center justify-between bg-blue-50/80 p-3 rounded-lg border border-blue-200/80 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-900">Total a Pagar</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono">
                        ${subtotal.toFixed(2)} <span className="text-xs text-blue-600 font-sans font-semibold">MXN</span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSimulatePayment}
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Cobrar Ticket [F12]</span>
                      </button>
                      <button
                        onClick={onOpenTourModal}
                        className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4 text-blue-600" />
                        <span>Ver funciones [F2]</span>
                      </button>
                    </div>

                    {paymentSuccess && (
                      <div className="mt-2 p-2 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ¡Venta registrada con éxito! Ticket #004893 impreso.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Real-time Business Metrics & Snapshot (5 cols) */}
                <div className="lg:col-span-5 p-4 sm:p-5 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Métricas del Día
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        +14.2% vs ayer
                      </span>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[11px] text-slate-500 block">Ventas hoy</span>
                        <span className="text-lg font-extrabold text-slate-900 font-mono">$18,450</span>
                        <span className="text-[10px] text-emerald-600 block font-medium">126 transacciones</span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="text-[11px] text-emerald-700 block">Ganancia estimada</span>
                        <span className="text-lg font-extrabold text-emerald-700 font-mono">$6,320</span>
                        <span className="text-[10px] text-emerald-600 block font-medium">Margen: 34.2%</span>
                      </div>
                    </div>

                    {/* Stock Alert Mini Widget */}
                    <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/70 mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-700" />
                          Alerta de Stock Bajo
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-200/70 px-1.5 py-0.2 rounded-sm">
                          3 productos
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-tight">
                        Aceite Vegetal 800ml (Quedan 3 pzas) y Café Gourmet (Quedan 4 pzas) están por agotarse.
                      </p>
                    </div>

                    {/* Quick Hourly Sales Bars */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        Flujo de ventas por hora
                      </span>
                      <div className="grid grid-cols-6 gap-1.5 h-12 items-end">
                        {[
                          { hour: '10h', height: '40%', val: '$1.4k' },
                          { hour: '11h', height: '65%', val: '$2.8k' },
                          { hour: '12h', height: '90%', val: '$4.2k' },
                          { hour: '13h', height: '100%', val: '$5.1k' },
                          { hour: '14h', height: '75%', val: '$3.5k' },
                          { hour: '15h', height: '30%', val: '$1.4k' },
                        ].map((b, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                            <div
                              style={{ height: b.height }}
                              className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-indigo-500 opacity-90 hover:opacity-100 transition-opacity"
                              title={`${b.hour}: ${b.val}`}
                            />
                            <span className="text-[9px] text-slate-400 font-mono">{b.hour}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card bottom footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Facturación CFDI 4.0 lista
                    </span>
                    <button
                      onClick={onOpenDemoModal}
                      className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      Probar demo <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
