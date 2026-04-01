import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Shield, Zap, Braces } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getLevelTitle } from '../../utils/xpCalculator';
import JsonExportPopup from '../ui/JsonExportPopup';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/quests': 'Quest Board',
  '/habits': 'Hábitos',
  '/stats': 'Stats & Perfil',
  '/mindmap': 'Mapa Mental',
};

export default function Header({ onMenuToggle }) {
  const { pathname } = useLocation();
  const { data, playerStats } = useGame();
  const title = PAGE_TITLES[pathname] || 'Quest Life';
  const [mostrarJson, setMostrarJson] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/[0.06] px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-[#64748b] hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1
          className="text-base font-semibold text-[#e2e8f0]"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setMostrarJson(true)}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors text-text-muted hover:text-accent-purple-light hover:border-[#7c3aed]/50"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          title="Exportar JSON para LLM"
        >
          <Braces size={13} />
          <span className="hidden sm:inline">JSON</span>
        </button>
        <div className="flex items-center gap-1.5 text-sm">
          <Shield size={14} className="text-[#a78bfa]" />
          <span className="text-[#94a3b8]">Nv.</span>
          <span className="text-[#a78bfa] font-semibold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {playerStats.level}
          </span>
          <span className="text-[#64748b] hidden sm:inline">
            — {getLevelTitle(playerStats.level)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Zap size={14} className="text-[#f59e0b]" />
          <span
            className="text-[#f59e0b] font-semibold"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {playerStats.totalXP.toLocaleString()}
          </span>
          <span className="text-[#64748b] hidden sm:inline">XP</span>
        </div>
      </div>
    </header>

    {mostrarJson && <JsonExportPopup onClose={() => setMostrarJson(false)} />}
    </>
  );
}
