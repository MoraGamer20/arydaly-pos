import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { User, UserRole } from '../../types/pos';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  UserCheck,
  Lock,
  X,
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const {
    users,
    currentUser,
    switchUser,
    saveUser,
    deleteUser,
  } = usePOS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'cashier' as UserRole,
    pinCode: '1234',
    isActive: true,
  });

  const openNewModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'cashier',
      pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      pinCode: u.pinCode || '1234',
      isActive: u.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;

    saveUser({
      id: editingUser?.id,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: formData.role,
      pinCode: formData.pinCode.trim(),
      isActive: formData.isActive,
    });

    setIsModalOpen(false);
  };

  const handleDelete = (u: User) => {
    if (currentUser && u.id === currentUser.id) {
      alert('No puedes eliminar el usuario con la sesión activa actualmente.');
      return;
    }
    if (window.confirm(`¿Eliminar al usuario "${u.fullName}"?`)) {
      deleteUser(u.id);
    }
  };

  const handleSwitchActiveUser = (u: User) => {
    switchUser(u);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Usuarios, Cajeros & Permisos
          </h2>
          <p className="text-xs text-slate-500">
            Administra cuentas de empleados, roles de acceso y PINs de seguridad para terminal
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario / Cajero</span>
        </button>
      </div>

      {/* Role Matrix Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h4 className="font-extrabold text-sm uppercase tracking-wide">Administrador</h4>
          </div>
          <p className="text-xs text-slate-500">
            Acceso absoluto a todas las funciones: reportes financieros, catálogo, usuarios, auditorías y configuración general.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-700">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h4 className="font-extrabold text-sm uppercase tracking-wide">Encargado / Supervisor</h4>
          </div>
          <p className="text-xs text-slate-500">
            Gestión operativa completa: compras a proveedores, ajustes de inventario, arqueos de caja y consulta de ventas.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h4 className="font-extrabold text-sm uppercase tracking-wide">Cajero</h4>
          </div>
          <p className="text-xs text-slate-500">
            Enfocado en la velocidad del punto de venta: registro y cobro de productos, alta básica de clientes y su apertura/cierre de turno.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rol / Nivel</th>
                <th className="py-3 px-4 text-center">PIN Rápido</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Sesión Activa</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = currentUser && u.id === currentUser.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {u.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{u.fullName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">{u.email}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'manager'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role === 'admin'
                          ? 'Administrador'
                          : u.role === 'manager'
                          ? 'Encargado'
                          : 'Cajero'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                      •••• ({u.pinCode || '1234'})
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {u.isActive ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-slate-400" />
                        )}
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isCurrent ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-2xs">
                          En Uso Actual
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitchActiveUser(u)}
                          className="px-2.5 py-1 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Cambiar a este usuario
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {(!currentUser || u.id !== currentUser.id) && (
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario / Empleado'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Sofía Morales"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sofia@tienda.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rol en el Sistema
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="cashier">Cajero</option>
                    <option value="manager">Encargado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIN Numérico (4 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-700">
                  Usuario Activo (Permitir acceso al sistema)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
