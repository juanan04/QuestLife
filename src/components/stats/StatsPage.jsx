import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useGame } from '../../context/GameContext';
import { CATEGORIES, getCategoryColor } from '../../utils/questHelpers';
import { getLevelTitle } from '../../utils/xpCalculator';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { Shield, Zap, CheckCircle2, Flame, Calendar, Trophy } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#12121a] border border-white/[0.08] rounded-lg px-3 py-2">
        <p className="text-xs text-[#94a3b8]">{label}</p>
        <p className="text-sm font-semibold text-[#a78bfa]">{payload[0].value} XP</p>
      </div>
    );
  }
  return null;
};

export default function StatsPage() {
  const { data, playerStats } = useGame();

  // --- Summary stats ---
  const completedQuests = data.quests.filter(q => q.status === 'completed').length;
  const longestStreak = Math.max(0, ...data.habits.map(h => h.longestStreak || 0));
  const joinDate = new Date(data.player.joinDate);
  const daysActive = Math.max(1, Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24)));

  const summaryStats = [
    { label: 'XP Total', value: playerStats.totalXP.toLocaleString(), icon: Zap, color: '#f59e0b' },
    { label: 'Nivel', value: `${playerStats.level} — ${getLevelTitle(playerStats.level)}`, icon: Shield, color: '#a78bfa' },
    { label: 'Misiones completadas', value: `${completedQuests} / ${data.quests.length}`, icon: CheckCircle2, color: '#10b981' },
    { label: 'Racha más larga', value: `${longestStreak} días`, icon: Flame, color: '#f97316' },
    { label: 'Días activo', value: daysActive, icon: Calendar, color: '#06b6d4' },
    { label: 'Hábitos totales', value: data.habits.length, icon: Trophy, color: '#8b5cf6' },
  ];

  // --- Radar data ---
  const radarData = CATEGORIES.map(cat => {
    const catQuests = data.quests.filter(q => q.category === cat.id);
    const catCompleted = catQuests.filter(q => q.status === 'completed').length;
    const pct = catQuests.length > 0 ? Math.round((catCompleted / catQuests.length) * 100) : 0;
    return { subject: cat.label, value: pct, fullMark: 100 };
  }).filter(d => {
    const catQuests = data.quests.filter(q => {
      const cat = CATEGORIES.find(c => c.label === d.subject);
      return cat && q.category === cat.id;
    });
    return catQuests.length > 0;
  });

  // --- Category progress bars ---
  const catProgress = CATEGORIES.map(cat => {
    const catQuests = data.quests.filter(q => q.category === cat.id);
    const catCompleted = catQuests.filter(q => q.status === 'completed').length;
    return { ...cat, total: catQuests.length, completed: catCompleted };
  }).filter(c => c.total > 0);

  // --- Timeline ---
  const timeline = data.quests
    .filter(q => q.status === 'completed' && q.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // --- XP acumulado por semana (últimas 8 semanas) ---
  const weeklyXP = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - i * 7 - 6);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const xp = data.xpLog
      .filter(e => {
        if (e.amount <= 0) return false;
        const d = new Date(e.date);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const label = `S${8 - i}`;
    weeklyXP.push({ label, xp });
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-[#f59e0b]" />
          Resumen general
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {summaryStats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#0a0a0f] rounded-lg p-3 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color }} />
                <span className="text-xs text-[#64748b]">{label}</span>
              </div>
              <p className="text-sm font-semibold text-[#e2e8f0]">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Radar + Category bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-[#94a3b8] mb-4">Progreso por categoría</h3>
          {radarData.length < 3 ? (
            <p className="text-sm text-[#475569] text-center py-8">
              Completa misiones para ver el radar chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1a1a2e" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar
                  name="Progreso"
                  dataKey="value"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[#94a3b8] mb-4">Misiones por categoría</h3>
          <div className="space-y-3">
            {catProgress.map(cat => (
              <div key={cat.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#94a3b8]">{cat.label}</span>
                  <span className="text-[#64748b]">{cat.completed}/{cat.total}</span>
                </div>
                <ProgressBar
                  value={cat.completed}
                  max={cat.total}
                  color={getCategoryColor(cat.id)}
                  height="h-1.5"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* XP Weekly chart */}
      <Card>
        <h3 className="text-sm font-semibold text-[#94a3b8] mb-4">XP por semana</h3>
        {weeklyXP.every(w => w.xp === 0) ? (
          <p className="text-sm text-[#475569] text-center py-8">
            Completa hábitos y misiones para ver tu progreso.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={weeklyXP}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ fill: '#7c3aed', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: '#f59e0b', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Timeline */}
      <Card>
        <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#f59e0b]" />
          Hitos completados
        </h3>

        {timeline.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#475569]">
              ¡Tu leyenda está por escribirse! Completa tu primera misión para empezar el timeline.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#1a1a2e]" />
            <div className="space-y-4">
              {timeline.map(quest => (
                <div key={quest.id} className="flex items-start gap-4 pl-1">
                  <div className="w-6 h-6 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle2 size={12} className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e2e8f0]">{quest.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-[#475569]">
                        {new Date(quest.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span
                        className="text-xs font-semibold text-[#f59e0b]"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                      >
                        +{quest.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
