# Quest Life

## Comandos
- `npm run dev` — Arranca el servidor de desarrollo
- `npm run build` — Build de producción
- `npm run preview` — Preview del build

## Estructura
```
src/
  components/
    layout/     Sidebar, Header
    dashboard/  PlayerStats, XPBar, ActiveQuests, WeeklyChart, UpcomingQuests
    quests/     QuestBoard, QuestCard, ActSection
    habits/     HabitTracker, HabitCard, HabitHeatmap
    stats/      StatsPage
    ui/         Card, Badge, CategoryBadge, ProgressBar, DifficultyStars, XPPopup
  context/      GameContext.jsx — proveedor global
  data/         initialData.js (27 quests, 7 hábitos), supabaseClient.js
  hooks/        useGameData.js, useXP.js
  utils/        xpCalculator.js, questHelpers.js
  pages/        Dashboard, QuestBoard, Habits, Stats
```

## Documentos de referencia

| Archivo | Propósito |
|---------|-----------|
| `imp.md` | **Diario de progreso** — registra todo lo implementado, decisiones tomadas y cambios realizados |
| `spec.md` | **Requerimientos nuevos** — la IA lo lee antes de implementar cualquier feature nuevo |

## Skills disponibles

Leer solo la skill indicada según la tarea en curso:

| Skill | Cuándo usarla |
|-------|---------------|
| `.skills/ui-rules.md` | Crear o modificar componentes, estilos, fuentes, animaciones, Tailwind |
| `.skills/game-logic.md` | Tocar XP, niveles, hábitos, quests, estado global, hooks, utils |
| `.skills/persistence.md` | Cambios en localStorage, flujo de datos, integración con backend futuro |
