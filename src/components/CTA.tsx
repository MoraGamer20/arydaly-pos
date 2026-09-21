import React from 'react';
import { Download, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface CTAProps {
  onOpenDemoModal: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenDemoModal }) => {
  return (
    <section id="cta-final" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-6 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Únete a más de 18,000 negocios que ya crecen con VentaPro</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            Empieza a controlar mejor tu negocio
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
            Prueba todas las herramientas que necesitas para vender, administrar y hacer crecer tu negocio. Descarga la versión de prueba en segundos sin ingresar tarjetas ni compromisos.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-600/40 hover:shadow-blue-600/60 transition-all transform active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Comenzar gratis por 30 días</span>
            </button>

            <a
              href="#precios"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base rounded-xl transition-all cursor-pointer"
            >
              <span>Ver planes y precios</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Instalación en 2 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Soporte en español incluido
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Cancela en cualquier momento
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
