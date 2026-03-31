# Quest Life — Plan de Implementación

> Plan paso a paso para construir la app completa. Seguir en orden estricto.
> Cada fase indica los archivos a crear/modificar y el contenido esperado.

---

## FASE 0 — Scaffolding del proyecto

### 0.1 Crear proyecto Vite
```bash
cd c:/Users/jaara/Desktop/Proyects/QuestLife
npm create vite@latest . -- --template react
```
> Si pregunta si quiere sobreescribir el directorio existente, confirmar.

### 0.2 Instalar dependencias
```bash
npm install
npm install react-router-dom recharts lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

### 0.3 Configurar Tailwind CSS con el plugin de Vite

**Archivo: `vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**Archivo: `src/index.css`** — Reemplazar todo el contenido por:
```css
@import "tailwindcss";

/* === Custom Theme === */
@theme {
  --color-bg-primary: #0a0a0f;
  --color-bg-card: #12121a;
  --color-bg-elevated: #1a1a2e;
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-border-active: #7c3aed;

  --color-accent-purple: #7c3aed;
  --color-accent-purple-light: #a78bfa;
  --color-accent-purple-dark: #5b21b6;
  --color-accent-gold: #f59e0b;
  --color-accent-gold-light: #fbbf24;

  --color-text-primary: #e2e8f0;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;

  --color-status-locked: #475569;
  --color-status-active: #7c3aed;
  --color-status-completed: #f59e0b;

  --color-cat-negocio: #3b82f6;
  --color-cat-financiero: #10b981;
  --color-cat-idiomas: #f59e0b;
  --color-cat-ciber: #ef4444;
  --color-cat-fisico: #06b6d4;
  --color-cat-arte: #ec4899;
  --color-cat-licencias: #8b5cf6;
  --color-cat-suenos: #f97316;
  --color-cat-habilidades: #14b8a6;
  --color-cat-estilo-vida: #a855f7;
  --color-cat-conocimiento: #6366f1;
}

/* === Base Styles === */
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

/* === Scrollbar === */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--color-accent-purple-dark);
  border-radius: 3px;
}

/* === XP Bar Animation === */
@keyframes xp-fill {
  from { width: 0%; }
}
.xp-bar-animate {
  animation: xp-fill 1s ease-out;
}

/* === XP Popup Animation === */
@keyframes xp-popup {
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-20px); }
  100% { opacity: 0; transform: translateY(-40px); }
}
.xp-popup {
  animation: xp-popup 1.5s ease-out forwards;
}

/* === Glow pulse para misiones activas === */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(124, 58, 237, 0.3); }
  50% { box-shadow: 0 0 15px rgba(124, 58, 237, 0.6); }
}
.quest-active-glow {
  animation: glow-pulse 3s ease-in-out infinite;
}
```

### 0.4 Configurar Google Fonts

**Archivo: `index.html`** — Añadir en el `<head>` antes del cierre:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

Cambiar el `<title>` a `Quest Life`.

### 0.5 Limpiar archivos innecesarios
- Eliminar `src/App.css`
- Eliminar `src/assets/react.svg` y `public/vite.svg`
- Vaciar `src/App.jsx` (se reescribirá en Fase 3)

### 0.6 Crear estructura de carpetas
```bash
mkdir -p src/components/layout src/components/dashboard src/components/quests src/components/habits src/components/stats src/components/ui src/data src/hooks src/utils src/pages
```

---

## FASE 1 — Datos y lógica de negocio (sin UI)

> Construir primero toda la capa de datos y utilidades.

### 1.1 Datos iniciales — `src/data/initialData.js`

Exportar un objeto `initialData` con esta estructura exacta:

```js
export const initialData = {
  player: {
    name: "Juan Antonio",
    xp: 0,
    level: 1,
    joinDate: "2026-03-30"
  },
  quests: [ /* LAS 27 MISIONES COMPLETAS — copiar del JSON del briefing */ ],
  habits: [ /* LOS 7 HÁBITOS COMPLETOS — copiar del JSON del briefing */ ],
  xpLog: []
};
```

**IMPORTANTE para cada quest:** Añadir estos campos por defecto si no están en el JSON:
- `notes: ""`
- `completedAt: null`
- `description: ""` (texto descriptivo breve del objetivo)
- `howTo: []` (array de strings con pasos sugeridos)
- `rewards: []` (array de strings con lo que desbloquea conceptualmente)
- `unlocks: []` (si no está definido)

**IMPORTANTE para cada habit:** Añadir estos campos por defecto:
- `frequency: "daily"` (si no está definido)
- `streak: 0`
- `longestStreak: 0`
- `checkHistory: {}` (objeto con claves fecha "YYYY-MM-DD" y valor booleano)
- `subtasks: []` (si no está definido)

Para las subtasks de cada quest, añadir campo `completedAt: null`.

### 1.2 Utilidades XP — `src/utils/xpCalculator.js`

Exportar las siguientes funciones:

```js
// Mapa de dificultad a XP
// 1→50, 2→100, 3→200, 4→400, 5→750

export function getXPForDifficulty(difficulty) { ... }

// Calcular nivel a partir de XP total
// Nivel 1: 0-499, Nivel 2: 500-1499, Nivel 3: 1500-2999...
// Fórmula: cada nivel N requiere N*500 XP acumulados desde el nivel anterior
// Simplificado: XP para llegar a nivel N = sum(i*500) para i=1..N-1 = 500 * N*(N-1)/2
export function calculateLevel(totalXP) {
  let level = 1;
  let xpNeeded = 500; // XP para pasar de nivel 1 a 2
  let xpAccumulated = 0;
  while (xpAccumulated + xpNeeded <= totalXP) {
    xpAccumulated += xpNeeded;
    level++;
    xpNeeded = level * 500;
  }
  return {
    level,
    currentLevelXP: totalXP - xpAccumulated,
    nextLevelXP: xpNeeded,
    totalXP
  };
}

// Nombre RPG del nivel
export function getLevelTitle(level) {
  if (level >= 20) return "Leyenda";
  if (level >= 15) return "Élite";
  if (level >= 10) return "Veterano";
  if (level >= 5) return "Aventurero";
  return "Novato";
}

// Verificar bonus de racha: si streak es múltiplo de 7, retorna 50 XP bonus
export function getStreakBonus(streak) {
  return streak > 0 && streak % 7 === 0 ? 50 : 0;
}
```

### 1.3 Utilidades de quests — `src/utils/questHelpers.js`

```js
// Verificar si una quest puede desbloquearse
// Recibe la quest y el array completo de quests
// Retorna true si TODOS los prerequisites tienen status "completed"
export function canUnlockQuest(quest, allQuests) { ... }

// Obtener quests por acto
export function getQuestsByAct(quests, act) { ... }

// Obtener quests activas (status === "in_progress")
export function getActiveQuests(quests) { ... }

// Obtener quests próximas a desbloquearse
// Son quests con status "locked" donde solo falta 1 prerequisite por completar
export function getUpcomingQuests(quests) { ... }

// Calcular porcentaje de subtareas completadas de una quest
export function getQuestProgress(quest) { ... }

// Obtener color CSS de categoría
export function getCategoryColor(category) {
  const colors = {
    negocio: 'var(--color-cat-negocio)',
    financiero: 'var(--color-cat-financiero)',
    idiomas: 'var(--color-cat-idiomas)',
    ciber: 'var(--color-cat-ciber)',
    fisico: 'var(--color-cat-fisico)',
    arte: 'var(--color-cat-arte)',
    licencias: 'var(--color-cat-licencias)',
    suenos: 'var(--color-cat-suenos)',
    habilidades: 'var(--color-cat-habilidades)',
    'estilo-vida': 'var(--color-cat-estilo-vida)',
    conocimiento: 'var(--color-cat-conocimiento)',
  };
  return colors[category] || '#94a3b8';
}

// Obtener el icono de estado
export function getStatusIcon(status) {
  // "locked" → "Lock", "in_progress" → "Swords", "completed" → "CheckCircle2"
}

// Categorías disponibles (para filtros)
export const CATEGORIES = [
  { id: 'negocio', label: 'Negocio' },
  { id: 'financiero', label: 'Financiero' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'ciber', label: 'Ciberseguridad' },
  { id: 'fisico', label: 'Físico' },
  { id: 'arte', label: 'Arte' },
  { id: 'licencias', label: 'Licencias' },
  { id: 'suenos', label: 'Sueños' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'estilo-vida', label: 'Estilo de vida' },
  { id: 'conocimiento', label: 'Conocimiento' },
];
```

### 1.4 Hook principal — `src/hooks/useGameData.js`

Hook central que gestiona TODO el estado de la app con localStorage.

```js
import { useState, useEffect, useCallback } from 'react';
import { initialData } from '../data/initialData';
import { calculateLevel, getStreakBonus } from '../utils/xpCalculator';
import { canUnlockQuest } from '../utils/questHelpers';

const STORAGE_KEY = 'quest-life-data';

export function useGameData() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); }
      catch { /* fall through */ }
    }
    return structuredClone(initialData);
  });

  // Persistir en localStorage cada vez que cambia data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // --- Funciones de player ---
  const playerStats = calculateLevel(data.player.xp);

  // --- Funciones de XP ---
  const addXP = useCallback((amount, reason) => {
    setData(prev => {
      const newXP = prev.player.xp + amount;
      const newLevel = calculateLevel(newXP);
      return {
        ...prev,
        player: { ...prev.player, xp: newXP, level: newLevel.level },
        xpLog: [...prev.xpLog, {
          date: new Date().toISOString().split('T')[0],
          amount,
          reason
        }]
      };
    });
  }, []);

  // --- Funciones de Quests ---

  // Cambiar estado de quest (locked → in_progress → completed)
  const updateQuestStatus = useCallback((questId, newStatus) => {
    setData(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id !== questId) return q;
        const updated = { ...q, status: newStatus };
        if (newStatus === 'completed') {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      });

      // Si se completa, auto-desbloquear quests que dependen de esta
      if (newStatus === 'completed') {
        const completedQuest = newQuests.find(q => q.id === questId);
        if (completedQuest?.unlocks) {
          completedQuest.unlocks.forEach(unlockId => {
            const target = newQuests.find(q => q.id === unlockId);
            if (target && target.status === 'locked' && canUnlockQuest(target, newQuests)) {
              target.status = 'in_progress'; // O dejarlo locked pero "desbloqueable"
              // NOTA: no auto-cambiar a in_progress, solo verificar que se PUEDE desbloquear.
              // El usuario elige cuándo empezarla.
            }
          });
        }
      }

      // Calcular XP si se completa
      let newPlayerXP = prev.player.xp;
      let newXPLog = [...prev.xpLog];
      if (newStatus === 'completed') {
        const quest = prev.quests.find(q => q.id === questId);
        if (quest) {
          newPlayerXP += quest.xpReward;
          newXPLog.push({
            date: new Date().toISOString().split('T')[0],
            amount: quest.xpReward,
            reason: `Quest completada: ${quest.title}`
          });
        }
      }

      return {
        ...prev,
        quests: newQuests,
        player: {
          ...prev.player,
          xp: newPlayerXP,
          level: calculateLevel(newPlayerXP).level
        },
        xpLog: newXPLog
      };
    });
  }, []);

  // Toggle subtarea de quest
  const toggleQuestSubtask = useCallback((questId, subtaskId) => {
    setData(prev => ({
      ...prev,
      quests: prev.quests.map(q => {
        if (q.id !== questId) return q;
        return {
          ...q,
          subtasks: q.subtasks.map(st => {
            if (st.id !== subtaskId) return st;
            return {
              ...st,
              completed: !st.completed,
              completedAt: !st.completed ? new Date().toISOString() : null
            };
          })
        };
      })
    }));
  }, []);

  // Actualizar notas de quest
  const updateQuestNotes = useCallback((questId, notes) => {
    setData(prev => ({
      ...prev,
      quests: prev.quests.map(q =>
        q.id === questId ? { ...q, notes } : q
      )
    }));
  }, []);

  // --- Funciones de Hábitos ---

  // Marcar hábito como completado hoy
  const toggleHabitToday = useCallback((habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      let xpToAdd = 0;
      let xpReason = '';
      const newHabits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const wasChecked = h.checkHistory[today];
        const newHistory = { ...h.checkHistory, [today]: !wasChecked };

        // Calcular racha
        let streak = 0;
        if (!wasChecked) {
          // Está marcando como completado → calcular racha
          const dates = Object.keys(newHistory).filter(d => newHistory[d]).sort().reverse();
          streak = 1;
          for (let i = 1; i < dates.length; i++) {
            const curr = new Date(dates[i - 1]);
            const prev = new Date(dates[i]);
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diff === 1) streak++;
            else break;
          }
          xpToAdd = h.xpPerDay || 10;
          xpReason = `${h.title} completado`;

          // Bonus racha de 7
          const streakBonus = getStreakBonus(streak);
          if (streakBonus > 0) {
            xpToAdd += streakBonus;
            xpReason += ` + bonus racha ${streak} días`;
          }
        } else {
          // Está desmarcando → recalcular racha sin hoy
          delete newHistory[today];
          // XP negativo: restar lo ganado
          xpToAdd = -(h.xpPerDay || 10);
          xpReason = `${h.title} desmarcado`;
        }

        return {
          ...h,
          checkHistory: newHistory,
          streak: !wasChecked ? streak : Math.max(0, h.streak - 1),
          longestStreak: !wasChecked ? Math.max(h.longestStreak, streak) : h.longestStreak
        };
      });

      const newXP = Math.max(0, prev.player.xp + xpToAdd);
      return {
        ...prev,
        habits: newHabits,
        player: { ...prev.player, xp: newXP, level: calculateLevel(newXP).level },
        xpLog: [...prev.xpLog, {
          date: today,
          amount: xpToAdd,
          reason: xpReason
        }]
      };
    });
  }, []);

  // Actualizar progreso de subtarea de hábito (ej: progreso de partitura de piano)
  const updateHabitSubtaskProgress = useCallback((habitId, subtaskId, progress) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== habitId) return h;
        return {
          ...h,
          subtasks: h.subtasks.map(st =>
            st.id === subtaskId ? { ...st, progress: Math.min(100, Math.max(0, progress)) } : st
          )
        };
      })
    }));
  }, []);

  // --- Import / Export ---
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quest-life-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.player && parsed.quests && parsed.habits) {
        setData(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Reset a datos iniciales
  const resetData = useCallback(() => {
    setData(structuredClone(initialData));
  }, []);

  return {
    data,
    playerStats,
    // Quest actions
    updateQuestStatus,
    toggleQuestSubtask,
    updateQuestNotes,
    // Habit actions
    toggleHabitToday,
    updateHabitSubtaskProgress,
    // XP
    addXP,
    // Import/Export
    exportData,
    importData,
    resetData
  };
}
```

### 1.5 Hook de XP con animación — `src/hooks/useXP.js`

```js
// Hook simple para mostrar animaciones de XP ganado
// Mantiene un estado con { amount, id } de XP recién ganado
// Se limpia después de 1.5s (duración de la animación)

export function useXPAnimation() {
  const [xpPopups, setXpPopups] = useState([]);

  const showXPGain = useCallback((amount) => {
    const id = Date.now();
    setXpPopups(prev => [...prev, { id, amount }]);
    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== id));
    }, 1500);
  }, []);

  return { xpPopups, showXPGain };
}
```

### 1.6 Archivo de conexión futura — `src/data/supabaseClient.js`

```js
// Placeholder para futura conexión con Supabase
// import { createClient } from '@supabase/supabase-js'
//
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabase = null;
```

---

## FASE 2 — Componentes UI base

### 2.1 Componentes UI reutilizables — `src/components/ui/`

**`src/components/ui/Card.jsx`**
- Wrapper div con clases: `bg-bg-card border border-border-subtle rounded-xl p-4 transition-all duration-300`
- Props: `children`, `className` (para extender), `glowing` (boolean para añadir clase `quest-active-glow`)

**`src/components/ui/Badge.jsx`**
- Span con padding pequeño, rounded-full, texto xs
- Props: `children`, `color` (color de fondo), `variant` ("solid" | "outline")

**`src/components/ui/ProgressBar.jsx`**
- Barra de progreso genérica
- Props: `value` (0-100), `max` (default 100), `color` (default purple), `animated` (boolean), `height` (default "h-2"), `showLabel` (boolean)
- Estructura: div contenedor con bg-bg-elevated, div interior con ancho porcentual y bg del color

**`src/components/ui/DifficultyStars.jsx`**
- Renderiza estrellas de dificultad (1-5) usando el icono `Star` de Lucide
- Props: `difficulty` (número 1-5)
- Estrellas llenas en color amber/gold, vacías en gris

**`src/components/ui/XPPopup.jsx`**
- Componente flotante que muestra "+X XP" con la animación `xp-popup`
- Props: `amount`
- Color dorado, fuente Orbitron, posición absolute

**`src/components/ui/CategoryBadge.jsx`**
- Badge específico para categorías de quests/hábitos
- Usa `getCategoryColor()` para el color dinámico
- Muestra el label de la categoría con primera letra en mayúscula

---

## FASE 3 — Layout y navegación

### 3.1 Sidebar — `src/components/layout/Sidebar.jsx`

- Sidebar fijo a la izquierda (w-64 en desktop, colapsable en mobile)
- Logo "Quest Life" arriba con fuente Orbitron, color púrpura
- Links de navegación con iconos de Lucide:
  - Dashboard → `LayoutDashboard`
  - Quest Board → `Map`
  - Hábitos → `Flame`
  - Stats → `BarChart3`
- El link activo tiene fondo `bg-accent-purple/10` y borde izquierdo púrpura
- En mobile: hamburger menu que abre sidebar como overlay
- Abajo del sidebar: botones de Import/Export (iconos `Download` y `Upload`)
- Usar `NavLink` de react-router-dom para los links

### 3.2 Header — `src/components/layout/Header.jsx`

- Header superior con:
  - Título de la página actual (dinámico según ruta)
  - Mini stats del jugador a la derecha: Nivel + icono `Shield`, XP total + icono `Zap`
  - Botón hamburger en mobile (para toggle sidebar)

### 3.3 App.jsx — Layout principal

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGameData } from './hooks/useGameData';
import { useXPAnimation } from './hooks/useXP';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import QuestBoardPage from './pages/QuestBoard';
import HabitsPage from './pages/Habits';
import StatsPage from './pages/Stats';

// Layout: sidebar fijo izquierda + contenido principal con header
// Pasar useGameData y useXPAnimation como props o usar Context

// DECISIÓN: Usar React Context para evitar prop drilling
// Crear GameContext.jsx en src/context/GameContext.jsx
```

### 3.4 Contexto global — `src/context/GameContext.jsx`

```jsx
import { createContext, useContext } from 'react';
import { useGameData } from '../hooks/useGameData';
import { useXPAnimation } from '../hooks/useXP';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const gameData = useGameData();
  const xpAnimation = useXPAnimation();
  return (
    <GameContext.Provider value={{ ...gameData, ...xpAnimation }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
```

### 3.5 main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GameProvider>
        <App />
      </GameProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 3.6 App.jsx completo

```jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import QuestBoardPage from './pages/QuestBoard';
import HabitsPage from './pages/Habits';
import StatsPage from './pages/Stats';

export default function App() {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quests" element={<QuestBoardPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
```

---

## FASE 4 — Dashboard

### 4.1 PlayerStats — `src/components/dashboard/PlayerStats.jsx`

- Card superior con stats del personaje
- Mostrar: avatar placeholder (icono `User` en círculo púrpura), nombre, nivel (con título RPG), XP total
- Usar fuente Orbitron para el nivel y título
- Layout en grid: 4 columnas en desktop, 2 en mobile
- Stats cards mini: Nivel, XP Total, Misiones completadas (count), Racha más larga

### 4.2 XPBar — `src/components/dashboard/XPBar.jsx`

- Barra de XP grande, estilizada tipo RPG
- Muestra: "Nivel {N} — {título}" a la izquierda, "{currentXP} / {nextLevelXP} XP" a la derecha
- Barra con gradiente púrpura-a-dorado, clase `xp-bar-animate`
- Usar el componente `ProgressBar` internamente

### 4.3 ActiveQuests — `src/components/dashboard/ActiveQuests.jsx`

- Muestra las quests con status "in_progress" (máximo 6)
- Cada quest: mini card con título, categoría badge, barra de progreso de subtareas, dificultad en estrellas
- Click en una quest → navegar a `/quests` (o abrir modal, decidir en Fase 6)

### 4.4 WeeklyChart — `src/components/dashboard/WeeklyChart.jsx`

- Gráfica de barras con Recharts
- Datos: agrupar xpLog por los últimos 7 días, sumar XP ganado por día
- Eje X: días de la semana (Lun, Mar, ...)
- Eje Y: XP ganado
- Barras en color púrpura con border-radius
- Tooltip personalizado con fondo oscuro
- Si no hay datos, mostrar mensaje "Empieza a completar misiones y hábitos"

### 4.5 UpcomingQuests — `src/components/dashboard/UpcomingQuests.jsx`

- Sección "Próximas a desbloquear"
- Muestra 2-3 quests locked que están a 1 prerequisite de desbloquearse
- Cada una: card con opacity-70, icono candado, nombre, y "Falta: {nombre de quest prerequisite pendiente}"

### 4.6 Página Dashboard — `src/pages/Dashboard.jsx`

Composición:
```
<PlayerStats />
<XPBar />
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ActiveQuests />
  <WeeklyChart />
</div>
<UpcomingQuests />
```

---

## FASE 5 — Quest Board

### 5.1 ActSection — `src/components/quests/ActSection.jsx`

- Sección colapsable por acto (Acto I, II, III, IV, V)
- Header: "Acto {N}" con fuente Orbitron, número de quests completadas/total
- Al hacer click se expande/colapsa la lista de quests del acto
- Actos con todas las quests completadas: icono checkmark dorado

### 5.2 QuestCard — `src/components/quests/QuestCard.jsx`

- Card expandible para cada quest
- **Estado cerrado (cabecera):**
  - Icono de estado: Lock (gris) / Swords (púrpura) / CheckCircle2 (dorado)
  - Título
  - CategoryBadge
  - DifficultyStars
  - Tiempo estimado (texto secundario)
  - Barra de progreso mini (subtareas)
- **Estado expandido (al click):**
  - Descripción
  - Cómo hacerlo (lista)
  - Prerequisites: lista con links visuales (badges con nombre de quest requerida, verde si completada, gris si no)
  - Recompensas / Unlocks: lista de quests que desbloquea
  - Subtareas: checklist interactivo (checkboxes)
  - Notas: textarea editable
  - Botones de acción:
    - Si locked y prerequisites cumplidos: "Empezar quest" → cambia a in_progress
    - Si in_progress: "Completar quest" → cambia a completed (solo si todas subtareas hechas, o confirmación)
    - Si completed: badge "Completada" + fecha
- **Estilos por estado:**
  - `locked`: opacity-60, cursor-not-allowed en la card
  - `in_progress`: border-accent-purple, clase quest-active-glow
  - `completed`: border-accent-gold/30, fondo ligeramente dorado

### 5.3 QuestBoard — `src/components/quests/QuestBoard.jsx`

- Filtros superiores: botones por categoría (usando CATEGORIES), botón "Todas"
- Filtro por estado: "Todas", "Activas", "Bloqueadas", "Completadas"
- Contador: "X de Y misiones completadas"
- Renderiza ActSection por cada acto (1-5), pasando quests filtradas

### 5.4 Página QuestBoard — `src/pages/QuestBoard.jsx`

```jsx
// Importar QuestBoard component y renderizarlo
// Título: "Quest Board"
```

---

## FASE 6 — Hábitos

### 6.1 HabitCard — `src/components/habits/HabitCard.jsx`

- Card por cada hábito
- Mostrar:
  - Icono según categoría (mapear categoría a icono Lucide: arte→Music, fisico→Dumbbell, idiomas→Languages, negocio→Briefcase, ciber→Shield, conocimiento→BookOpen)
  - Título del hábito
  - CategoryBadge
  - Frecuencia (si no es daily, mostrar "3x semana", "sábados", etc.)
  - Botón check para hoy: círculo que se llena al marcar, con animación
  - Al marcar: mostrar XPPopup con "+{xpPerDay} XP"
  - Streak: icono `Flame` + número de días + "días"
  - Si tiene subtasks (ej: piano): mostrar lista expandible con slider de progreso (0-100%) por subtask
- Si el hábito ya está marcado hoy: check en verde/dorado
- Color de fondo del check según si hoy está marcado o no

### 6.2 HabitHeatmap — `src/components/habits/HabitHeatmap.jsx`

- Heatmap tipo GitHub contributions para un hábito
- Datos: checkHistory del hábito, últimos 30 días
- Grid de 30 cuadraditos (5 filas x 6 columnas o 1 fila x 30)
- Color: sin completar → bg-bg-elevated, completado → gradiente de púrpura según streak
- Tooltip al hover: fecha + "Completado" / "No completado"
- Implementar con divs puros (no necesita Recharts)

### 6.3 HabitTracker — `src/components/habits/HabitTracker.jsx`

- Vista principal de hábitos
- Resumen superior: "Hoy: X de Y hábitos completados", XP ganado hoy
- Lista de HabitCards
- Sección inferior: HabitHeatmap para cada hábito (colapsable)
- Separar hábitos diarios vs no-diarios (sección "Hoy" vs "Esta semana")

### 6.4 Página Habits — `src/pages/Habits.jsx`

```jsx
// Renderizar HabitTracker
// Título: "Hábitos Diarios"
```

---

## FASE 7 — Stats / Perfil

### 7.1 RadarChart — `src/components/stats/RadarChart.jsx`

- Radar chart con Recharts (`RadarChart`, `PolarGrid`, `PolarAngleAxis`, `Radar`)
- Datos: por cada categoría, calcular % de quests completadas en esa categoría
- Colores: púrpura para el fill, con opacity
- Responsive

### 7.2 StatsPage — `src/components/stats/StatsPage.jsx`

- **Sección 1 — Resumen general:**
  - Grid de stats cards: XP total, Nivel, Misiones completadas, Misiones totales, Racha más larga (de cualquier hábito), Días activo (desde joinDate)
- **Sección 2 — Progreso por categoría:**
  - RadarChart
  - Barras horizontales por categoría: "{categoría}: X/Y completadas" con barra de progreso
- **Sección 3 — Timeline de hitos:**
  - Lista cronológica de quests completadas (ordenadas por completedAt)
  - Cada entrada: fecha, título de quest, XP ganado
  - Estilizado como timeline vertical con línea y dots
  - Si no hay quests completadas: mensaje motivacional
- **Sección 4 — Actividad de XP:**
  - Gráfica de línea (Recharts LineChart) con XP acumulado por semana en los últimos 3 meses

### 7.3 Página Stats — `src/pages/Stats.jsx`

```jsx
// Renderizar StatsPage
// Título: "Stats & Perfil"
```

---

## FASE 8 — Pulido y responsive

### 8.1 Responsive

Revisar TODOS los componentes y asegurar:
- Sidebar: colapsable en mobile (hidden por defecto, toggle con hamburger)
- Cards: full width en mobile, grid en desktop
- Tablas/listas: scroll horizontal si es necesario
- Fuentes: tamaños ajustados para mobile
- Padding: más compacto en mobile (p-3 vs p-6)

### 8.2 Transiciones y animaciones

- Expandir/colapsar quest cards: `transition-all duration-300 ease-in-out` con max-height
- Check de hábito: scale animation al marcar (`transform scale-110` por 200ms)
- Sidebar toggle: `transition-transform duration-300`
- Hover en cards: `hover:border-accent-purple/30 transition-colors`
- XP bar fill: animación al cargar página

### 8.3 Estados vacíos

- Dashboard sin actividad: mensaje "¡Tu aventura comienza hoy! Completa tu primer hábito para ganar XP."
- Quest Board sin resultados de filtro: "No hay misiones en esta categoría."
- Stats sin datos: "Completa misiones y hábitos para ver tus estadísticas."

### 8.4 Confirmaciones

- Al completar una quest: modal/dialog de confirmación "¿Completar quest {nombre}? Ganarás {xp} XP"
- Al resetear datos: dialog "¿Estás seguro? Esto borrará todo tu progreso."
- Al importar datos: dialog "Esto reemplazará todos tus datos actuales. ¿Continuar?"

Usar `window.confirm()` para simplificar (no crear componente modal custom).

### 8.5 Import/Export UI

- En Sidebar: botones de Export (descarga JSON) e Import (input file)
- Import: leer archivo con FileReader, parsear JSON, validar estructura, llamar a `importData`

---

## FASE 9 — Testing manual y QA

### 9.1 Verificar flujo completo
1. Primer arranque: localStorage vacío → se cargan datos iniciales ✓
2. Dashboard muestra stats correctos ✓
3. Quest Board muestra 27 quests organizadas en 5 actos ✓
4. Quests locked tienen opacity reducida ✓
5. Quests in_progress tienen borde púrpura ✓
6. Marcar subtareas actualiza progreso ✓
7. Completar quest otorga XP y actualiza nivel ✓
8. Completar quest desbloquea dependientes ✓
9. Hábitos: marcar hoy da XP ✓
10. Hábitos: streak se calcula correctamente ✓
11. Hábitos: heatmap muestra últimos 30 días ✓
12. Stats: radar chart refleja progreso real ✓
13. Export: descarga JSON válido ✓
14. Import: carga JSON y refresca toda la UI ✓
15. Responsive: todo funciona en 375px width ✓

### 9.2 Edge cases
- Desmarcar un hábito ya completado hoy (resta XP correctamente)
- Quest sin subtareas: se puede completar directamente
- Quest con prerequisites no cumplidos: no se puede empezar
- XP nunca baja de 0
- Nivel nunca baja de 1
- localStorage lleno: manejar error gracefully

---

## FASE 10 — CLAUDE.md y documentación interna

### 10.1 Crear `CLAUDE.md` en la raíz del proyecto

```markdown
# Quest Life

## Comandos
- `npm run dev` — Arranca el servidor de desarrollo
- `npm run build` — Build de producción
- `npm run preview` — Preview del build

## Arquitectura
- React + Vite + Tailwind CSS
- Estado global: React Context (`GameContext`) + `useGameData` hook
- Persistencia: localStorage (clave: `quest-life-data`)
- Sin backend. Archivo placeholder en `src/data/supabaseClient.js`

## Convenciones
- Componentes en JSX (no TSX)
- Un componente por archivo
- Nombrar archivos igual que el componente (PascalCase)
- Colores custom definidos en `src/index.css` con @theme de Tailwind
- Fuente títulos gamificados: Orbitron. Fuente UI: Inter.
- Todo en español (UI, datos, comentarios)
```

---

## Orden de ejecución resumido

| # | Fase | Archivos clave | Dependencias |
|---|------|----------------|--------------|
| 0 | Scaffolding | vite.config, index.css, index.html | Ninguna |
| 1 | Datos y lógica | initialData.js, xpCalculator.js, questHelpers.js, useGameData.js, useXP.js | Fase 0 |
| 2 | UI base | Card, Badge, ProgressBar, DifficultyStars, XPPopup, CategoryBadge | Fase 0 |
| 3 | Layout + routing | Sidebar, Header, App.jsx, GameContext, main.jsx | Fases 1, 2 |
| 4 | Dashboard | PlayerStats, XPBar, ActiveQuests, WeeklyChart, UpcomingQuests, Dashboard page | Fase 3 |
| 5 | Quest Board | ActSection, QuestCard, QuestBoard, QuestBoard page | Fase 3 |
| 6 | Hábitos | HabitCard, HabitHeatmap, HabitTracker, Habits page | Fase 3 |
| 7 | Stats | RadarChart, StatsPage, Stats page | Fases 4-6 |
| 8 | Pulido | Responsive, animaciones, estados vacíos, confirmaciones, import/export UI | Fases 4-7 |
| 9 | QA | Testing manual completo | Fase 8 |
| 10 | Docs | CLAUDE.md | Fase 9 |

---

> **NOTA:** No crear componente de MCP ni funcionalidad de IA en este plan. Eso será un proyecto separado o una fase futura.
