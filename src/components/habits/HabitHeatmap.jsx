const INTENSITY = [
  'bg-[#1a1a2e]',
  'bg-[#5b21b6]/40',
  'bg-[#7c3aed]/60',
  'bg-[#a78bfa]/80',
  'bg-[#a78bfa]',
];

function getIntensityClass(habit, dateStr) {
  if (!habit.checkHistory[dateStr]) return INTENSITY[0];
  // Color según el valor de la racha acumulada — simplificado: siempre completado
  return INTENSITY[3];
}

export default function HabitHeatmap({ habit }) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  return (
    <div className="mt-3">
      <p className="text-xs text-[#475569] mb-2">Últimos 30 días</p>
      <div className="flex gap-1 flex-wrap">
        {days.map(dateStr => {
          const done = !!habit.checkHistory[dateStr];
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          return (
            <div
              key={dateStr}
              title={`${dateStr} — ${done ? 'Completado' : 'No completado'}`}
              className={`
                w-4 h-4 rounded-sm transition-colors
                ${done ? 'bg-[#7c3aed]' : 'bg-[#1a1a2e]'}
                ${isToday ? 'ring-1 ring-[#f59e0b]/50' : ''}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
