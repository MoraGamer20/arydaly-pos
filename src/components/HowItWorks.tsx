import React from 'react';
import { UserPlus, Settings, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/content';

interface HowItWorksProps {
  onOpenDemoModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenDemoModal }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'UserPlus':
        return <UserPlus className="w-6 h-6 text-blue-600" />;
      case 'Settings':
        return <Settings className="w-6 h-6 text-indigo-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      default:
        return <UserPlus className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="asi-de-facil" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Puesta en Marcha Inmediata
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Así de fácil es comenzar a vender
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Sin configuraciones técnicas complejas ni semanas de capacitación. En tres sencillos pasos tendrás tu caja operando.
          </p>
        </div>

        {/* 3 Steps Pipeline with Connecting Line */}
        <div className="relative">
          {/* Connecting Line behind the steps (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-center relative group"
              >
                {/* Step Number Top Badge */}
                <div className="mx-auto -mt-12 mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md border-4 border-white group-hover:scale-110 transition-transform">
                  0{step.step}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mb-3">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Tiempo aprox: {step.duration}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Paso {step.step} completado</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner under steps */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Crear mi cuenta y comenzar ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
