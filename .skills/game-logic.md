# Game Logic

## Sistema XP
- Dificultad 1→50 XP, 2→100 XP, 3→200 XP, 4→400 XP, 5→750 XP por quest
- Hábitos diarios: +10-25 XP por día según hábito
- Bonus +50 XP por racha de 7 días en hábitos
- Niveles: cada nivel N requiere N×500 XP para avanzar al siguiente

## Estado global
- React Context (`GameContext`) en `src/context/GameContext.jsx` — proveedor global
- Hook principal: `useGameData` en `src/hooks/useGameData.js`
- Hook XP: `useXP` en `src/hooks/useXP.js`
- Utilidades: `src/utils/xpCalculator.js`, `src/utils/questHelpers.js`

## Datos iniciales
- `src/data/initialData.js` — 27 quests, 7 hábitos
- Al primer arranque con localStorage vacío se cargan los datos de `initialData.js`
