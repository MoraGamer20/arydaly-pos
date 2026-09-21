import React, { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { PRICING_PLANS, FAQ_ITEMS } from '../data/content';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section id="precios" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            Planes Claros y Transparentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Invierte en el crecimiento y control de tu negocio
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Sin plazos forzosos ni costos ocultos por ticket o usuario. Elige el plan que mejor se adapte a tu tamaño actual y cambia cuando lo necesites.
          </p>

          {/* Monthly / Annual Billing Switch */}
          <div className="inline-flex items-center gap-3 p-1.5 mt-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pago Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pago Anual</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Ahorra 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {PRICING_PLANS.map((plan) => {
            const price =
              billingCycle === 'annual'
                ? plan.priceAnnualMonthly
                : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-white border-2 border-blue-600 shadow-2xl scale-102 lg:-translate-y-2 z-10'
                    : 'bg-white border border-slate-200/90 shadow-xs hover:shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Más Elegido por Negocios
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                        ${price}
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        {price === 0 ? '' : 'MXN / mes'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {price === 0
                        ? 'Gratis para siempre • Sin tarjeta'
                        : billingCycle === 'annual'
                        ? `Facturado anualmente ($${price * 12} MXN al año)`
                        : 'Facturado mensualmente • Cancela cuando quieras'}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Lo que incluye:
                    </span>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}

                    {/* Non-included features for free tier */}
                    {plan.notIncluded &&
                      plan.notIncluded.map((notFeat, nIdx) => (
                        <div
                          key={nIdx}
                          className="flex items-start gap-2.5 text-xs text-slate-400 opacity-60"
                        >
                          <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                          </div>
                          <span className="line-through">{notFeat}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Plan Action Button */}
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Pricing Guarantee */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-600 mb-20 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Garantía de satisfacción de 30 días:</strong> Si el software no cumple con las necesidades de tu comercio, te devolvemos el 100% de tu dinero sin preguntas.
          </span>
        </div>

        {/* Frequently Asked Questions (FAQ) Accordion */}
        <div id="preguntas-frecuentes" className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" /> Preguntas frecuentes
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Resolvemos tus dudas antes de comenzar
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
