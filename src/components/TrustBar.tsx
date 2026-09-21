import React from 'react';
import { Zap, Boxes, TrendingUp, FileCheck, Shield, Award, Users } from 'lucide-react';
import { TRUST_BAR_ITEMS } from '../data/content';

export const TrustBar: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-blue-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-blue-600" />;
      default:
        return <Zap className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="barra-confianza" className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
            Plataforma Integral Todo en Uno
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Todo lo que necesitas para administrar tu negocio
          </h2>
        </div>

        {/* 4 Trust Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BAR_ITEMS.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100/70 group-hover:bg-blue-600 flex items-center justify-center shrink-0 transition-colors">
                <div className="group-hover:text-white transition-colors">
                  {getIcon(item.iconName)}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Más de <strong>18,000 negocios</strong> activos</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Datos 100% seguros y respaldados</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Calificación <strong>4.9/5</strong> de satisfacción</span>
          </div>
        </div>
      </div>
    </section>
  );
};
