export default function ProgressBar({
  value = 0,
  max = 100,
  color = '#7c3aed',
  animated = false,
  height = 'h-2',
  showLabel = false,
  className = ''
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={`w-full bg-[#1a1a2e] rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${animated ? 'xp-bar-animate' : ''}`}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
