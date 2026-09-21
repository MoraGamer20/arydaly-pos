import React, { useState } from 'react';
import {
  X,
  ScanBarcode,
  CreditCard,
  Printer,
  Boxes,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

export const TourModal: React.FC<TourModalProps> = ({ isOpen, onClose, onOpenDemo }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Paso 1: Escaneo instantáneo de productos',
      desc: 'Pasa el código de barras por el lector o escribe el nombre. El sistema busca en milisegundos en tu catálogo sin congelar la pantalla.',
      icon: ScanBarcode,
      badge: 'Menos de 1 segundo',
      preview: (
        <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
          <div className="text-emerald-400">» Lector escaneó: 7501055312345</div>
          <div className="bg-slate-800 p-2 rounded-lg flex justify-between">
            <span>Refresco Cola 600ml (x2)</span>
            <span className="font-bold text-emerald-400">$36.00</span>
          </div>
          <div className="text-slate-400 text-[10px]">Inventario actualizado: 48 restantes</div>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Paso 2: Cobro flexible con cualquier método',
      desc: 'Presiona [F12] para cobrar. Elige efectivo, tarjeta bancaria, transferencia o pago mixto con cálculo automático del cambio.',
      icon: CreditCard,
      badge: 'Cálculo de cambio automático',
      preview: (
        <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-2">
          <div className="flex justify-between font-bold text-sm">
            <span>Total a pagar:</span>
            <span className="text-blue-400 font-mono">$177.50</span>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg flex justify-between font-mono">
            <span>Efectivo recibido:</span>
            <span className="text-white">$200.00</span>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-2 rounded-lg flex justify-between font-mono font-bold text-emerald-400">
            <span>Cambio a devolver:</span>
            <span>$22.50</span>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Paso 3: Impresión de ticket y timbrado fiscal',
      desc: 'Imprime el comprobante en tu impresora térmica y emite la factura CFDI 4.0 con un solo clic si el cliente la solicita.',
      icon: Printer,
      badge: 'Impresión en 2 segundos',
      preview: (
        <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 text-xs shadow-xs space-y-1 text-center font-mono">
          <div className="font-bold">*** ABARROTES SAN JUAN ***</div>
          <div className="text-[10px] text-slate-500">Ticket #004893 • 21/09/2026 14:35</div>
          <div className="border-t border-b border-dashed border-slate-300 py-1 my-1 text-left">
            <div>2x Refresco Cola ... $36.00</div>
            <div>1x Pan Blanco ... $43.50</div>
            <div>1x Café Gourmet ... $98.00</div>
          </div>
          <div className="font-bold flex justify-between">
            <span>TOTAL:</span>
            <span>$177.50 MXN</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">¡GRACIAS POR SU COMPRA!</div>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Paso 4: Ganancia registrada en tus reportes',
      desc: 'La venta se refleja de inmediato en tu corte de caja y balance del día, descontando existencias y acumulando utilidades.',
      icon: Boxes,
      badge: 'Información en tiempo real',
      preview: (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-700">
            <span>Ventas del día:</span>
            <strong className="font-mono text-slate-900">$18,450.00</strong>
          </div>
          <div className="flex justify-between items-center text-emerald-700">
            <span>Ganancia neta acumulada:</span>
            <strong className="font-mono">$6,320.00 (34.2%)</strong>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-800 text-[11px] font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            Inventario sincronizado y balance cuadrado al centavo.
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step - 1];
  const Icon = current.icon;

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

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
            Recorrido Interactivo • {step} de 4
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          {current.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {current.desc}
        </p>

        {/* Visual Mockup */}
        <div className="mb-6">{current.preview}</div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              step === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((dot) => (
              <button
                key={dot}
                onClick={() => setStep(dot)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  step === dot ? 'w-6 bg-blue-600' : 'bg-slate-200'
                }`}
                aria-label={`Ir al paso ${dot}`}
              />
            ))}
          </div>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenDemo();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Probar gratis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
