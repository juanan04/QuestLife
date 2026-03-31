# UI Rules

## Stack visual
- React + Vite + Tailwind CSS v4
- Colores custom definidos en `src/index.css` con `@theme` de Tailwind v4
- Fuente títulos: Orbitron. Fuente UI: Inter

## Convenciones de componentes
- Componentes en JSX (no TSX)
- Un componente por archivo, nombrado en PascalCase
- Todo en español (UI, datos, comentarios)
- Animaciones solo con Tailwind transitions + clases CSS custom (sin librerías extra)

## Componentes UI disponibles
- `src/components/ui/` — Card, Badge, CategoryBadge, ProgressBar, DifficultyStars, XPPopup
- `src/components/layout/` — Sidebar, Header
