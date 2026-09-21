import React from 'react';
import {
  CreditCard,
  Printer,
  ScanBarcode,
  Scale,
  Lock,
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { INTEGRATIONS } from '../data/content';

export const Integrations: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'Printer':
        return <Printer className="w-6 h-6 text-indigo-600" />;
      case 'ScanBarcode':
        return <ScanBarcode className="w-6 h-6 text-emerald-600" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-amber-600" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-slate-700" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-700" />;
      default:
        return <Cpu className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="integraciones" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Ecosistema de Hardware & Software
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Conecta las herramientas que ya utilizas
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Sin necesidad de renovar tus dispositivos. VentaPro es compatible con la mayoría de periféricos estándar de punto de venta por USB, Bluetooth o Red.
          </p>
        </div>

        {/* 6 Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Compatibilidad general
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {item.compatibility}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Clarification Disclaimer */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-slate-200 max-w-2xl mx-auto text-center">
          <p className="text-xs text-slate-500">
            * Compatibilidad basada en protocolos de hardware estándar (HID, ESC/POS, RS-232 y emulación de teclado). Las marcas mencionadas son propiedad de sus respectivos titulares y se citan únicamente con fines de referencia de interoperabilidad.
          </p>
        </div>
      </div>
    </section>
  );
};
