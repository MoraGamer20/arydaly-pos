import React, { useState } from 'react';
import { X, ShoppingCart, CheckCircle2, ShieldCheck, CreditCard, Landmark, Store } from 'lucide-react';
import { PRICING_PLANS } from '../../data/content';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
}

export const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose, initialPlanId = 'pro' }) => {
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'spei' | 'oxxo'>('card');
  const [businessName, setBusinessName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];
  const unitPrice = cycle === 'annual' ? selectedPlan.priceAnnualMonthly : selectedPlan.priceMonthly;
  const totalPrice = cycle === 'annual' ? unitPrice * 12 : unitPrice;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Contratación Comercial</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Adquirir Licencia VentaPro
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Activación inmediata de tu software de punto de venta e inventario.
            </p>

            {/* Plan Selector */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-700 block">Selecciona tu plan:</label>
              <div className="grid grid-cols-3 gap-2">
                {PRICING_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPlanId === plan.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span className="text-xs block font-bold">{plan.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ${cycle === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly}/m
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cycle toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs">
              <span className="text-slate-700 font-semibold">Ciclo de facturación:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCycle('monthly')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] cursor-pointer ${
                    cycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setCycle('annual')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] cursor-pointer ${
                    cycle === 'annual' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Anual (-20%)
                </button>
              </div>
            </div>

            {/* Total Price Summary */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-900 font-bold block">{selectedPlan.name}</span>
                <span className="text-[10px] text-blue-700">
                  {cycle === 'annual' ? 'Licencia anual con 2 meses gratis' : 'Suscripción mensual'}
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-2xl font-black text-blue-700">${totalPrice}</span>
                <span className="text-xs text-blue-600 font-sans font-bold"> MXN</span>
              </div>
            </div>

            <form onSubmit={handlePurchase} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre del comercio / titular:
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej. Tienda Doña Lupe"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Método de pago (simulado para demostración):
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Tarjeta
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('spei')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'spei'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Landmark className="w-4 h-4" /> SPEI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('oxxo')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'oxxo'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Store className="w-4 h-4" /> OXXO / Efectivo
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                Confirmar y Activar Licencia (${totalPrice} MXN)
              </button>
            </form>

            <div className="mt-4 text-center text-[10px] text-slate-400">
              * Entorno de evaluación comercial. No se realiza ningún cobro bancario real.
            </div>
          </div>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              ¡Licencia activada con éxito!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              Gracias por elegir VentaPro para <strong>{businessName || 'tu negocio'}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs mb-6 space-y-1.5 font-mono">
              <div className="text-slate-500">Número de Licencia Oficial:</div>
              <div className="text-sm font-bold text-emerald-700 bg-white p-2 rounded-md border border-emerald-200">
                VP-PRO-2026-{Math.floor(100000 + Math.random() * 900000)}
              </div>
              <div className="text-[10px] text-slate-400">
                Plan {selectedPlan.name} activo. Factura fiscal generada y enviada a tu correo.
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Cerrar y Volver a la Página
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
