import { useGame } from '../../context/GameContext';
import { getLevelTitle } from '../../utils/xpCalculator';
import Card from '../ui/Card';

export default function XPBar() {
  const { playerStats } = useGame();
  const { level, currentLevelXP, nextLevelXP, percentage } = playerStats;

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-sm font-semibold text-[#a78bfa]"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Nivel {level} — {getLevelTitle(level)}
        </span>
        <span className="text-xs text-[#64748b]">
          {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
        </span>
      </div>

      <div className="w-full bg-[#1a1a2e] rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full xp-bar-animate transition-all duration-700"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #7c3aed, #f59e0b)'
          }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-[#475569]">Nivel {level}</span>
        <span className="text-xs text-[#475569]">Nivel {level + 1}</span>
      </div>
    </Card>
  );
}
