import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Clock,
  DollarSign,
  Maximize,
  Minimize,
  UserCheck,
  ChevronDown,
  Store,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

interface HeaderProps {
  onOpenCashModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCashModal }) => {
  const {
    currentUser,
    users,
    switchUser,
    settings,
    cashSession,
    setActiveView,
  } = usePOS();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const isCashOpen = cashSession.status === 'open';

  const handleCashClick = () => {
    if (onOpenCashModal) {
      onOpenCashModal();
    } else {
      setActiveView('cash');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Left: Business Name & Live Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-slate-800 leading-tight truncate max-w-[180px] md:max-w-[280px]">
              {settings.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {currentTime.toLocaleDateString('es-MX', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                - {currentTime.toLocaleTimeString('es-MX')}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Center / Right: Cash status, quick action, fullscreen, cashier */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick New Sale button */}
        <button
          onClick={() => setActiveView('pos')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Venta Rápida [F1]</span>
        </button>

        {/* Cash Register status pill */}
        <button
          onClick={handleCashClick}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isCashOpen
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
          title="Ver estado de caja y arqueo"
        >
          {isCashOpen ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span className="hidden md:inline">
            {isCashOpen ? 'Caja Abierta:' : 'Caja Cerrada:'}
          </span>
          <span className="font-mono font-bold">
            {settings.currencySymbol}
            {cashSession.expectedAmount.toFixed(2)}
          </span>
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa para caja'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </button>

          {/* Active Cashier dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs ring-1 ring-blue-500">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentUser?.fullName?.charAt(0) || 'A'}</span>
              )}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                {currentUser?.fullName}
              </p>
              <p className="text-[10px] text-blue-600 capitalize font-medium">
                {currentUser?.role === 'admin'
                  ? 'Administrador'
                  : currentUser?.role === 'manager'
                  ? 'Encargado'
                  : 'Cajero en Turno'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User selector dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-400">Cambiar de usuario ARYDALY:</p>
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u);
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${
                      currentUser?.id === u.id ? 'bg-blue-50/70 text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{u.fullName?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold truncate max-w-[120px]">{u.fullName}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{u.role}</p>
                      </div>
                    </div>
                    {currentUser?.id === u.id && <UserCheck className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
