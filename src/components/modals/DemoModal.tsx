import React, { useState } from 'react';
import { X, Download, Monitor, Apple, Globe, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'windows' | 'mac' | 'web'>('windows');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('Abarrotes y Minisuper');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Prueba Gratuita 30 Días</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Descargar VentaPro POS
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Sin ingresar tarjeta de crédito. Comienza a cobrar y a controlar tu inventario hoy mismo.
            </p>

            {/* Platform Selector */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Selecciona tu plataforma:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPlatform('windows')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    platform === 'windows'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Monitor className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs block">Windows</span>
                  <span className="text-[10px] text-slate-500 font-normal">10 / 11 (64-bit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('mac')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    platform === 'mac'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Apple className="w-5 h-5 mx-auto mb-1 text-slate-800" />
                  <span className="text-xs block">macOS</span>
                  <span className="text-[10px] text-slate-500 font-normal">M1/M2/Intel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('web')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    platform === 'web'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Globe className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                  <span className="text-xs block">Nube Web</span>
                  <span className="text-[10px] text-slate-500 font-normal">Cualquier navegador</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre de tu negocio o tienda:
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej. Abarrotes San Juan"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Correo electrónico para enviarte la licencia demo:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Giro comercial:
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                >
                  <option value="Abarrotes y Minisuper">Abarrotes y Minisuper</option>
                  <option value="Farmacia y Droguería">Farmacia y Droguería</option>
                  <option value="Ferretería y Materiales">Ferretería y Materiales</option>
                  <option value="Boutique y Calzado">Boutique y Calzado</option>
                  <option value="Restaurante y Cafetería">Restaurante y Cafetería</option>
                  <option value="Papelería y Regalos">Papelería y Regalos</option>
                  <option value="Otro Comercio Minorista">Otro Comercio Minorista</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Iniciar descarga de instalador ({platform.toUpperCase()})</span>
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instalador libre de virus y verificado digitalmente.</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              ¡Tu versión de prueba está lista!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-sm mx-auto">
              Hemos preparado el instalador para <strong>{businessName || 'tu negocio'}</strong> en formato <strong>{platform.toUpperCase()}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs mb-6 space-y-1.5 font-mono">
              <div className="text-slate-500">Clave de activación demo:</div>
              <div className="text-sm font-bold text-blue-700 bg-white p-2 rounded-md border border-blue-200">
                VP-DEMO-2026-{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <div className="text-[10px] text-slate-400">
                Válida por 30 días de uso ilimitado. Enviada también a: {email || 'tu correo'}.
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Completado / Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
