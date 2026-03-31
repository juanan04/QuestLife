# Persistence

## Almacenamiento
- Sin backend. Solo localStorage
- Clave localStorage: `quest-life-data`
- Archivo placeholder para futuro backend: `src/data/supabaseClient.js`

## Flujo de datos
- Al iniciar: si localStorage vacío → cargar `initialData.js`
- Todos los cambios de estado se persisten en localStorage automáticamente via `useGameData`
