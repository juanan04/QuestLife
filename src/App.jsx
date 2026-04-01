import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useGame } from './context/GameContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import QuestBoardPage from './pages/QuestBoard';
import HabitsPage from './pages/Habits';
import StatsPage from './pages/Stats';
import MindMapPage from './pages/MindMap';
import LoginPage from './pages/Login';

function MigrationBanner({ onAceptar, onRechazar }) {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto rounded-xl border p-4 flex flex-col gap-3 shadow-lg"
      style={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(124,58,237,0.4)' }}
    >
      <p className="text-sm text-text-primary">
        Se encontraron datos locales. ¿Deseas sincronizarlos con la nube?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onAceptar}
          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-opacity"
          style={{ backgroundColor: '#7c3aed' }}
        >
          Sí, sincronizar
        </button>
        <button
          onClick={onRechazar}
          className="flex-1 py-2 rounded-lg text-sm text-text-secondary border transition-colors hover:border-white/20"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          No, empezar de cero
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Shield size={32} className="text-accent-purple-light animate-pulse" />
        <span className="text-sm text-text-muted" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Cargando...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const { session, loading, data, pendingLocalData, aceptarMigracion, rechazarMigracion } = useGame();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mientras se resuelve la sesión de Supabase Auth
  if (session === undefined) return <LoadingScreen />;

  // Sin sesión → pantalla de login
  if (!session) return <LoginPage />;

  // Con sesión pero datos aún cargando desde Supabase (o data todavía null)
  if (loading || !data) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quests" element={<QuestBoardPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/mindmap" element={<MindMapPage />} />
          </Routes>
        </main>
      </div>

      {pendingLocalData && (
        <MigrationBanner
          onAceptar={aceptarMigracion}
          onRechazar={rechazarMigracion}
        />
      )}
    </div>
  );
}
