import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Printer, Check, X, ArrowRight, Share2, ReceiptText } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose }) => {
  const { lastSale, settings, setActiveView } = usePOS();

  if (!isOpen || !lastSale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    onClose();
    setActiveView('pos');
  };

  const saleDate = new Date(lastSale.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:shadow-none print:border-none print:max-h-none">
        {/* Top notification bar (hidden during print) */}
        <div className="px-6 py-3 bg-emerald-600 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-wide">¡Venta completada con éxito!</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 print:bg-white print:p-0">
          <div
            id="printable-receipt"
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs font-mono text-xs text-slate-800 space-y-4 print:border-none print:shadow-none print:p-2"
          >
            {/* Header / Store Info */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                {settings.name}
              </h3>
              <p className="text-[11px] text-slate-600">RFC: {settings.rfc}</p>
              <p className="text-[11px] text-slate-600">{settings.address}</p>
              <p className="text-[11px] text-slate-600">Tel: {settings.phone}</p>
              <div className="pt-2 text-[10px] text-slate-500 italic">
                {settings.receiptHeader}
              </div>
            </div>

            {/* Ticket Meta */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">TICKET:</span>
                <span className="font-black text-slate-900">{lastSale.ticketNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FECHA:</span>
                <span>{saleDate.toLocaleDateString('es-MX')} {saleDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CAJERO:</span>
                <span className="truncate max-w-[160px]">{lastSale.cashierName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CLIENTE:</span>
                <span className="truncate max-w-[160px] font-medium">{lastSale.customerName}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between font-bold text-slate-900 text-[10px] uppercase border-b border-slate-200 pb-1">
                <span className="w-8">CANT</span>
                <span className="flex-1 text-left px-1">PRODUCTO</span>
                <span className="w-14 text-right">P.U.</span>
                <span className="w-14 text-right">TOTAL</span>
              </div>

              {lastSale.items.map((item) => (
                <div key={item.id} className="flex justify-between text-[11px] text-slate-700 py-0.5">
                  <span className="w-8 font-bold">{item.quantity}</span>
                  <span className="flex-1 text-left px-1 truncate">{item.productName}</span>
                  <span className="w-14 text-right font-mono">
                    {settings.currencySymbol}{item.unitPrice.toFixed(2)}
                  </span>
                  <span className="w-14 text-right font-mono font-semibold text-slate-900">
                    {settings.currencySymbol}{item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals & Breakdown */}
            <div className="space-y-1 text-right text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between text-slate-600">
                <span>SUBTOTAL:</span>
                <span className="font-mono">{settings.currencySymbol}{lastSale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA ({settings.taxRate}%):</span>
                <span className="font-mono">{settings.currencySymbol}{lastSale.tax.toFixed(2)}</span>
              </div>
              {lastSale.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>DESCUENTO:</span>
                  <span className="font-mono">-{settings.currencySymbol}{lastSale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span className="font-mono text-base">
                  {settings.currencySymbol}{lastSale.total.toFixed(2)} {settings.currencyCode}
                </span>
              </div>
            </div>

            {/* Payment info */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between text-slate-600">
                <span>MÉTODO DE PAGO:</span>
                <span className="uppercase font-semibold text-slate-800">
                  {lastSale.paymentMethod === 'cash'
                    ? 'Efectivo'
                    : lastSale.paymentMethod === 'card'
                    ? 'Tarjeta'
                    : lastSale.paymentMethod === 'transfer'
                    ? 'Transferencia'
                    : 'Mixto'}
                </span>
              </div>
              {lastSale.paymentMethod === 'cash' && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>EFECTIVO RECIBIDO:</span>
                    <span className="font-mono">{settings.currencySymbol}{lastSale.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>SU CAMBIO:</span>
                    <span className="font-mono font-extrabold text-emerald-600">
                      {settings.currencySymbol}{lastSale.changeGiven.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              {lastSale.paymentReference && (
                <div className="flex justify-between text-slate-600">
                  <span>REFERENCIA:</span>
                  <span>{lastSale.paymentReference}</span>
                </div>
              )}
            </div>

            {/* Barcode Graphic & Footer */}
            <div className="text-center space-y-2 pt-2">
              <div className="font-mono text-[9px] tracking-widest text-slate-400">
                ||| | |||| | ||| ||||| || |||| | |||
              </div>
              <p className="text-[10px] text-slate-500 font-sans leading-tight">
                {settings.receiptFooter}
              </p>
              <p className="text-[9px] text-slate-400 font-sans">
                Sistema VentaPro POS - Software Web para Comercios
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions (hidden during print) */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Imprimir Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleNewSale}
            className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Nueva Venta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
