import React, { useState } from 'react';
import {
  Receipt,
  FileCheck,
  Download,
  Send,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Printer,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

export const Billing: React.FC = () => {
  const [invoiceStatus, setInvoiceStatus] = useState<'idle' | 'stamping' | 'success'>('idle');

  const handleSimulateStamp = () => {
    setInvoiceStatus('stamping');
    setTimeout(() => {
      setInvoiceStatus('success');
    }, 1200);
  };

  const features = [
    {
      icon: Receipt,
      title: 'Generación en 3 clics',
      desc: 'Convierte cualquier ticket de venta en una factura electrónica en cuestión de segundos directamente en el mostrador.',
    },
    {
      icon: FileCheck,
      title: 'Cumplimiento CFDI 4.0',
      desc: 'Validaciones automáticas del RFC, código postal del receptor, régimen fiscal y catálogos oficiales del SAT.',
    },
    {
      icon: Send,
      title: 'Envío automático por correo y WhatsApp',
      desc: 'Entrega los archivos PDF y XML al instante a la bandeja de entrada o teléfono móvil de tu cliente.',
    },
    {
      icon: Clock,
      title: 'Historial y control de cancelaciones',
      desc: 'Consulta comprobantes emitidos por fecha, cliente o monto, y gestiona solicitudes de cancelación oficiales sin multas.',
    },
    {
      icon: Building,
      title: 'Catálogo de clientes fiscales',
      desc: 'Guarda los datos de tus clientes frecuentes para que sus próximas facturas se generen con un solo clic.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Descarga masiva de XML y PDF',
      desc: 'Exporta tus comprobantes fiscales por mes o trimestre listos para entregar a tu contador o despacho.',
    },
  ];

  return (
    <section id="facturacion" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
            Módulo Fiscal Integrado
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Facturación fácil y rápida
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Emite facturas electrónicas válidas sin depender de portales lentos ni pagar costos adicionales por timbre. Diseñado para simplificar tus obligaciones fiscales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 6 Features Grid (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Portal de autofacturación para tus clientes:</strong> Imprime un código QR o enlace en el ticket para que tus clientes puedan generar su factura ellos mismos desde casa u oficina.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Invoice Preview Mockup (6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-slate-800 relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Emisión de Factura CFDI 4.0</h4>
                    <span className="text-[11px] text-slate-400">Asociada al Ticket #004891</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    invoiceStatus === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {invoiceStatus === 'success' ? 'TIMBRADA SAT' : 'BORRADOR LISTO'}
                </span>
              </div>

              {/* Form Preview */}
              <div className="space-y-3 text-xs mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">RFC Receptor</span>
                    <span className="font-mono font-bold text-white">CVA1804259A1</span>
                  </div>
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Código Postal</span>
                    <span className="font-mono font-bold text-white">72160</span>
                  </div>
                </div>

                <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Razón Social</span>
                  <span className="font-bold text-white">COMERCIALIZADORA DEL VALLE S.A. DE C.V.</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Régimen Fiscal</span>
                    <span className="text-slate-200">601 - General de Ley Personas Morales</span>
                  </div>
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Uso CFDI</span>
                    <span className="text-slate-200">G03 - Gastos en general</span>
                  </div>
                </div>

                {/* Items in Invoice */}
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block mb-1">Conceptos a facturar (18 artículos)</span>
                  <div className="flex justify-between text-slate-200 font-mono text-[11px]">
                    <span>Insumos para cafetería y abarrotes</span>
                    <span>$1,224.14</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-mono text-[11px] mt-0.5">
                    <span>IVA Trasladado (16.00%)</span>
                    <span>$195.86</span>
                  </div>
                  <div className="flex justify-between text-white font-mono font-bold text-sm pt-2 mt-1 border-t border-slate-700">
                    <span>TOTAL FACTURA</span>
                    <span className="text-emerald-400">$1,420.00 MXN</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {invoiceStatus === 'idle' && (
                  <button
                    onClick={handleSimulateStamp}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Simular Timbrado con SAT [PAC Autorizado]</span>
                  </button>
                )}

                {invoiceStatus === 'stamping' && (
                  <div className="w-full py-3 px-4 bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Conectando con servidor de timbrado oficial...</span>
                  </div>
                )}

                {invoiceStatus === 'success' && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Factura timbrada exitosamente
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">UUID: 8F2A...9C1D</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => alert('Demostración: Descargando PDF y XML oficiales')}
                        className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" /> Descargar PDF + XML
                      </button>
                      <button
                        onClick={() => setInvoiceStatus('idle')}
                        className="py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Nueva Factura
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
