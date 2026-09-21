import React, { useState, useEffect } from 'react';
import { Menu, X, Store, ArrowRight, ShieldCheck, Download, LogIn, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onOpenLoginModal: () => void;
  onOpenBuyModal: (planId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDemoModal,
  onOpenLoginModal,
  onOpenBuyModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Funciones', href: '#funciones' },
    { label: 'Sistema en vivo', href: '#dashboard-demo' },
    { label: 'Inventario', href: '#inventario' },
    { label: 'Facturación', href: '#facturacion' },
    { label: 'Precios', href: '#precios' },
    { label: 'Soporte', href: '#preguntas-frecuentes' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
          : 'bg-white/80 backdrop-blur-xs border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            id="brand-logo-link"
            href="#"
            className="flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
                VentaPro <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">POS</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight">
                Software de Punto de Venta
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              id="nav-login-btn"
              onClick={onOpenLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Iniciar sesión</span>
            </button>

            <button
              id="nav-download-demo-btn"
              onClick={onOpenDemoModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Probar gratis</span>
            </button>

            <button
              id="nav-buy-plan-btn"
              onClick={() => onOpenBuyModal('pro')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-sm rounded-lg transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Comprar</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              id="nav-mobile-demo-btn"
              onClick={onOpenDemoModal}
              className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md"
            >
              Probar
            </button>
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <LogIn className="w-4 h-4" /> Iniciar sesión
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemoModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg"
              >
                <Download className="w-4 h-4" /> Probar gratis por 30 días
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBuyModal('pro');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                <ShoppingCart className="w-4 h-4" /> Comprar licencia
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
