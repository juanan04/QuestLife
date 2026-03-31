import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGame } from '../../context/GameContext';
import Card from '../ui/Card';
import { TrendingUp } from 'lucide-react';

function getLast7Days() {
  const days = [];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: dayNames[d.getDay()],
      xp: 0
    });
  }
  return days;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#12121a] border border-white/[0.08] rounded-lg px-3 py-2">
        <p className="text-xs text-[#94a3b8]">{label}</p>
        <p className="text-sm font-semibold text-[#a78bfa]">+{payload[0].value} XP</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyChart() {
  const { data } = useGame();
  const days = getLast7Days();

  data.xpLog.forEach(entry => {
    if (entry.amount > 0) {
      const day = days.find(d => d.date === entry.date);
      if (day) day.xp += entry.amount;
    }
  });

  const hasData = days.some(d => d.xp > 0);
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-[#94a3b8] flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-[#7c3aed]" />
        Actividad semanal
      </h3>

      {!hasData ? (
        <div className="flex items-center justify-center h-32 text-sm text-[#475569]">
          Completa misiones y hábitos para ver tu actividad
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={days} barSize={20}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
            <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
              {days.map(entry => (
                <Cell
                  key={entry.date}
                  fill={entry.date === today ? '#f59e0b' : '#7c3aed'}
                  fillOpacity={entry.xp === 0 ? 0.2 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
