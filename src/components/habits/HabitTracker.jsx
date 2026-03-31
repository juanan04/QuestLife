import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import HabitCard from './HabitCard';
import { Flame, Zap, Plus, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'arte', label: 'Arte' },
  { id: 'fisico', label: 'Físico' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'negocio', label: 'Negocio' },
  { id: 'ciber', label: 'Ciber' },
  { id: 'conocimiento', label: 'Conocimiento' },
];

const FREQUENCIES = [
  { id: 'daily', label: 'Diario' },
  { id: '3x-week', label: '3x semana' },
  { id: '2x-week', label: '2x semana' },
  { id: 'weekly-saturday', label: 'Sábados' },
];

const EMPTY_FORM = { title: '', category: 'conocimiento', frequency: 'daily', xpPerDay: 10 };

export default function HabitTracker() {
  const { data, addHabit } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const today = new Date().toISOString().split('T')[0];

  const dailyHabits = data.habits.filter(h => h.frequency === 'daily');
  const otherHabits = data.habits.filter(h => h.frequency !== 'daily');

  const checkedToday = data.habits.filter(h => !!h.checkHistory[today]).length;
  const xpToday = data.xpLog
    .filter(e => e.date === today && e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addHabit({ ...form, title: form.title.trim(), xpPerDay: Number(form.xpPerDay) });
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-[#12121a] border border-white/[0.08] rounded-xl">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-[#f97316]" />
          <span className="text-sm text-[#94a3b8]">Hoy:</span>
          <span className="text-sm font-semibold text-[#e2e8f0]">
            {checkedToday} / {data.habits.length} hábitos
          </span>
        </div>
        <div className="w-px h-4 bg-white/[0.08]" />
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[#f59e0b]" />
          <span className="text-sm font-semibold text-[#f59e0b]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            +{xpToday} XP
          </span>
          <span className="text-xs text-[#475569]">ganados hoy</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setShowForm(f => !f)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              showForm
                ? 'bg-[#1a1a2e] text-[#94a3b8] border-white/[0.08]'
                : 'bg-[#7c3aed]/15 text-[#a78bfa] border-[#7c3aed]/30 hover:bg-[#7c3aed]/25'
            }`}
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Cancelar' : 'Nuevo hábito'}
          </button>
        </div>
      </div>

      {/* New habit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#12121a] border border-[#7c3aed]/20 rounded-xl space-y-3">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Nuevo hábito</p>

          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Nombre del hábito..."
            autoFocus
            required
            className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#475569] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#64748b] mb-1 block">Categoría</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#64748b] mb-1 block">Frecuencia</label>
              <select
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              >
                {FREQUENCIES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </div>
            <div className="w-24">
              <label className="text-xs text-[#64748b] mb-1 block">XP / día</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.xpPerDay}
                onChange={e => setForm(f => ({ ...f, xpPerDay: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!form.title.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Añadir hábito
            </button>
          </div>
        </form>
      )}

      {/* Daily habits */}
      {dailyHabits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
            Hábitos diarios
          </h3>
          <div className="space-y-3">
            {dailyHabits.map(h => <HabitCard key={h.id} habit={h} />)}
          </div>
        </div>
      )}

      {/* Non-daily habits */}
      {otherHabits.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
            Hábitos semanales
          </h3>
          <div className="space-y-3">
            {otherHabits.map(h => <HabitCard key={h.id} habit={h} />)}
          </div>
        </div>
      )}
    </div>
  );
}
