import React from 'react';
import {
  Store,
  Shield,
  Heart,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
} from 'lucide-react';

interface FooterProps {
  onOpenDemoModal: () => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemoModal, onOpenLoginModal }) => {
  return (
    <footer id="footer-principal" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                VentaPro <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-950 text-blue-400 font-bold border border-blue-900">POS</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              El software de punto de venta e inventario preferido por pequeños y medianos comercios. Rápido, seguro y diseñado para hacer crecer tu negocio.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Todos los servicios y timbrado SAT operativos (99.99%)</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Producto */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Producto
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#funciones" className="hover:text-white transition-colors">
                  Funciones de Venta
                </a>
              </li>
              <li>
                <a href="#inventario" className="hover:text-white transition-colors">
                  Control de Inventario
                </a>
              </li>
              <li>
                <a href="#facturacion" className="hover:text-white transition-colors">
                  Facturación CFDI 4.0
                </a>
              </li>
              <li>
                <a href="#reportes" className="hover:text-white transition-colors">
                  Reportes Financieros
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-white transition-colors">
                  Planes y Precios
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDemoModal}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Descargar Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Recursos */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Recursos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#preguntas-frecuentes" className="hover:text-white transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#asi-de-facil" className="hover:text-white transition-colors">
                  Guía de Inicio Rápido
                </a>
              </li>
              <li>
                <a href="#integraciones" className="hover:text-white transition-colors">
                  Hardware Compatible
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Plantilla Excel de Catálogo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tutoriales en Video
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog para Comerciantes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Empresa */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contacto Comercial
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bolsa de Trabajo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Soporte por WhatsApp
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenLoginModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Acceso a Clientes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Aviso de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Garantía de Devolución
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Seguridad de Datos
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 VentaPro POS. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Diseñado con pasión para el comercio independiente</span>
            <span>•</span>
            <span>Español (Latinoamérica)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
