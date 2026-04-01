import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Flame, BarChart3, Network, Download, Upload, X, Menu, Sword, LogOut } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quests', label: 'Quest Board', icon: Map },
  { to: '/habits', label: 'Hábitos', icon: Flame },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/mindmap', label: 'Mapa Mental', icon: Network },
];

export default function Sidebar({ isOpen, onClose }) {
  const { exportData, importData, resetData, signOut } = useGame();
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = importData(ev.target.result);
      if (!success) alert('Archivo JSON inválido');
      else alert('Datos importados correctamente');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro? Esto borrará todo tu progreso y volverá a los datos iniciales.')) {
      resetData();
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0d0d14] border-r border-white/[0.06]
          flex flex-col z-30 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center">
              <Sword size={16} className="text-[#a78bfa]" />
            </div>
            <span
              className="text-lg font-bold text-[#a78bfa]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Quest Life
            </span>
          </div>
          <button onClick={onClose} className="md:hidden text-[#64748b] hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'bg-[#7c3aed]/15 text-[#a78bfa] border-l-2 border-[#7c3aed]'
                  : 'text-[#94a3b8] hover:bg-white/[0.04] hover:text-[#e2e8f0]'
                }
              `}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Import/Export/Reset */}
        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <button
            onClick={exportData}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-[#64748b] hover:text-[#94a3b8] hover:bg-white/[0.04] transition-all"
          >
            <Download size={14} />
            Exportar datos
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-[#64748b] hover:text-[#94a3b8] hover:bg-white/[0.04] transition-all"
          >
            <Upload size={14} />
            Importar datos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={handleReset}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-red-500/50 hover:text-red-400 hover:bg-red-500/[0.04] transition-all"
          >
            Resetear progreso
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-white/4 transition-all"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
