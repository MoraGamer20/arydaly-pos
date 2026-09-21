import React from 'react';
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  FileText,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { BENEFITS } from '../data/content';

interface BenefitsProps {
  onSelectFeature?: (id: string) => void;
}

export const Benefits: React.FC<BenefitsProps> = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShoppingCart':
        return <ShoppingCart className="w-6 h-6 text-blue-600" />;
      case 'Package':
        return <Package className="w-6 h-6 text-emerald-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-purple-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-amber-600" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-indigo-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-rose-600" />;
      default:
        return <ShoppingCart className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBadgeColor = (name: string) => {
    switch (name) {
      case 'ShoppingCart':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Package':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Users':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'BarChart3':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'FileText':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'ShieldCheck':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
    }
  };

  return (
    <section id="beneficios" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Beneficios Principales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Todo tu negocio bajo control
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Elimina el desorden de libretas y cuentas manuales. Diseñado para que cualquier persona en tu tienda comience a operar en menos de 15 minutos sin complicaciones.
          </p>
        </div>

        {/* 6 Benefit Cards Grid with Subtle Hover Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {getIcon(benefit.iconName)}
                  </div>
                  {benefit.badge && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getBadgeColor(
                        benefit.iconName
                      )}`}
                    >
                      {benefit.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                <span>Ver detalles de módulo</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
