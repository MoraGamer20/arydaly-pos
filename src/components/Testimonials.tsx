import React from 'react';
import { Star, Quote, MapPin, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/content';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Casos de Éxito en Tiendas Reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Miles de comerciantes y administradores han transformado su operación diaria con un software rápido, confiable y sin enredos.
          </p>
        </div>

        {/* 4 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Metric Highlight Badge */}
                <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-bold mb-3">
                  {t.metricHighlight}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info with Initial Avatar */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}
                >
                  {t.initials}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{t.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{t.businessName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Internal Disclaimer Notice as Requested */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            * Los testimonios y nombres presentados son perfiles demostrativos diseñados para ejemplificar los casos de uso comunes en comercios minoristas.
          </p>
        </div>
      </div>
    </section>
  );
};
