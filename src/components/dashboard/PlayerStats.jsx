import { User, Shield, Zap, CheckCircle2, Flame } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getLevelTitle } from '../../utils/xpCalculator';
import Card from '../ui/Card';

export default function PlayerStats() {
  const { data, playerStats } = useGame();
  const completedQuests = data.quests.filter(q => q.status === 'completed').length;
  const longestStreak = Math.max(0, ...data.habits.map(h => h.longestStreak || 0));

  const stats = [
    {
      label: 'Nivel',
      value: playerStats.level,
      sub: getLevelTitle(playerStats.level),
      icon: Shield,
      color: '#a78bfa'
    },
    {
      label: 'XP Total',
      value: playerStats.totalXP.toLocaleString(),
      sub: 'puntos de experiencia',
      icon: Zap,
      color: '#f59e0b'
    },
    {
      label: 'Misiones',
      value: `${completedQuests}/${data.quests.length}`,
      sub: 'completadas',
      icon: CheckCircle2,
      color: '#10b981'
    },
    {
      label: 'Racha',
      value: longestStreak,
      sub: 'días máximos',
      icon: Flame,
      color: '#f97316'
    },
  ];

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 flex items-center justify-center flex-shrink-0">
          <User size={24} className="text-[#a78bfa]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#e2e8f0]">{data.player.name}</h2>
          <p
            className="text-sm text-[#a78bfa]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Nivel {playerStats.level} — {getLevelTitle(playerStats.level)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[#0a0a0f] rounded-lg p-3 border border-white/[0.05]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon size={14} style={{ color }} />
              <span className="text-xs text-[#64748b]">{label}</span>
            </div>
            <p
              className="text-lg font-bold"
              style={{ color, fontFamily: "'Orbitron', sans-serif" }}
            >
              {value}
            </p>
            <p className="text-xs text-[#475569] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
