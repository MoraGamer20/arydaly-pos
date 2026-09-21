import React from 'react';
import { usePOS } from '../../context/POSContext';
import { NavView } from '../../types/pos';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Truck,
  ShoppingBag,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  BarChart3,
  CalendarCheck2,
  ShieldCheck,
  Settings,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, products, currentUser, logout, settings } = usePOS();

  // Low stock products alert
  const lowStockCount = products.filter((p) => p.stock <= p.minStock && p.isActive).length;

  const navItems: {
    id: NavView;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    adminOnly?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'pos',
      label: 'Punto de venta',
      icon: ShoppingCart,
    },
    {
      id: 'products',
      label: 'Productos',
      icon: Package,
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'customers',
      label: 'Clientes',
      icon: Users,
    },
    {
      id: 'suppliers',
      label: 'Proveedores',
      icon: Truck,
    },
    {
      id: 'purchases',
      label: 'Compras',
      icon: ShoppingBag,
    },
    {
      id: 'cash',
      label: 'Caja',
      icon: DollarSign,
    },
    {
      id: 'ingresos',
      label: 'Ingresos',
      icon: ArrowDownLeft,
    },
    {
      id: 'egresos',
      label: 'Egresos',
      icon: ArrowUpRight,
    },
    {
      id: 'finanzas',
      label: 'Finanzas',
      icon: BookOpen,
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
    },
    {
      id: 'rendicion-bimestral',
      label: 'Rendición bimestral',
      icon: CalendarCheck2,
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: ShieldCheck,
      adminOnly: true,
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800">
      {/* Brand Header ARYDALY */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80 bg-slate-950/50">
        {settings.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={settings.name || 'ARYDALY'}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-500/30"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-md shadow-blue-500/20">
            AD
          </div>
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-lg tracking-tight">
              {settings.name || 'ARYDALY'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Sistema Administrativo
          </span>
        </div>
      </div>

      {/* Navigation List in exact order */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
        {navItems.map((item) => {
          if (item.adminOnly && currentUser?.role === 'cashier') return null;

          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="tracking-wide text-left">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                    item.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-2.5 h-2.5 inline" />
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="mx-3 mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold">{lowStockCount} producto(s)</span> con stock bajo.
            </div>
          </div>
          <button
            onClick={() => setActiveView('inventory')}
            className="mt-1.5 w-full text-center text-[10px] font-bold text-amber-400 hover:underline"
          >
            Ver inventario &rarr;
          </button>
        </div>
      )}

      {/* Bottom User Info & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-blue-500/40 shrink-0 flex items-center justify-center text-blue-400 font-bold text-xs">
              {currentUser?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.fullName || 'Administrador'}</p>
              <p className="text-[10px] text-slate-400 capitalize">{currentUser?.role || 'admin'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
