import { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { CATEGORIES } from '../../utils/questHelpers';
import { useGame } from '../../context/GameContext';

const DIFFICULTIES = [1, 2, 3, 4, 5];
const XP_BY_DIFF = { 1: 50, 2: 100, 3: 200, 4: 400, 5: 750 };
const ACTS = [1, 2, 3, 4, 5];

function toForm(quest) {
  return {
    title: quest?.title || '',
    description: quest?.description || '',
    act: quest?.act ?? 1,
    category: quest?.category || 'negocio',
    difficulty: quest?.difficulty ?? 2,
    estimatedTime: quest?.estimatedTime || '',
    status: quest?.status || 'in_progress',
    subtasks: quest?.subtasks ? quest.subtasks.map(st => ({ ...st })) : [],
    howTo: quest?.howTo ? [...quest.howTo] : [],
    prerequisites: quest?.prerequisites ? [...quest.prerequisites] : [],
    unlocks: quest?.unlocks ? [...quest.unlocks] : [],
  };
}

export default function QuestEditModal({ quest, onClose, onSave }) {
  const { data } = useGame();
  const isNew = !quest;
  const [form, setForm] = useState(() => toForm(quest));
  const [newSubtask, setNewSubtask] = useState('');
  const [newHowTo, setNewHowTo] = useState('');

  // Reset if quest changes
  useEffect(() => { setForm(toForm(quest)); }, [quest?.id]);

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Subtasks
  const addSubtask = () => {
    const t = newSubtask.trim();
    if (!t) return;
    setForm(f => ({
      ...f,
      subtasks: [...f.subtasks, { id: `st-${Date.now()}`, title: t, completed: false, completedAt: null }]
    }));
    setNewSubtask('');
  };
  const removeSubtask = (id) => setForm(f => ({ ...f, subtasks: f.subtasks.filter(s => s.id !== id) }));
  const renameSubtask = (id, title) => setForm(f => ({
    ...f,
    subtasks: f.subtasks.map(s => s.id === id ? { ...s, title } : s)
  }));

  // How to steps
  const addHowTo = () => {
    const t = newHowTo.trim();
    if (!t) return;
    setForm(f => ({ ...f, howTo: [...f.howTo, t] }));
    setNewHowTo('');
  };
  const removeHowTo = (i) => setForm(f => ({ ...f, howTo: f.howTo.filter((_, idx) => idx !== i) }));
  const editHowTo = (i, val) => setForm(f => ({
    ...f,
    howTo: f.howTo.map((s, idx) => idx === i ? val : s)
  }));

  // Prerequisites / unlocks — multi-select via toggles
  const togglePrereq = (id) => setForm(f => ({
    ...f,
    prerequisites: f.prerequisites.includes(id)
      ? f.prerequisites.filter(p => p !== id)
      : [...f.prerequisites, id]
  }));
  const toggleUnlock = (id) => setForm(f => ({
    ...f,
    unlocks: f.unlocks.includes(id)
      ? f.unlocks.filter(u => u !== id)
      : [...f.unlocks, id]
  }));

  // Other quests (exclude self)
  const otherQuests = data.quests.filter(q => q.id !== quest?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      act: Number(form.act),
      difficulty: Number(form.difficulty),
      xpReward: XP_BY_DIFF[Number(form.difficulty)],
      estimatedTime: form.estimatedTime.trim() || '—',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2
            className="text-sm font-bold text-[#e2e8f0] uppercase tracking-widest"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {isNew ? 'Nueva quest' : 'Editar quest'}
          </h2>
          <button onClick={onClose} className="text-[#475569] hover:text-[#94a3b8] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Título */}
          <div>
            <label className="text-xs text-[#64748b] mb-1.5 block">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => field('title', e.target.value)}
              placeholder="Título de la quest..."
              autoFocus
              required
              className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#475569] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs text-[#64748b] mb-1.5 block">Descripción</label>
            <textarea
              value={form.description}
              onChange={e => field('description', e.target.value)}
              placeholder="Describe el objetivo de esta quest..."
              rows={2}
              className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] placeholder-[#475569] resize-none focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
            />
          </div>

          {/* Fila: Acto, Categoría, Dificultad, Estado */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="text-xs text-[#64748b] mb-1.5 block">Acto</label>
              <select
                value={form.act}
                onChange={e => field('act', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              >
                {ACTS.map(a => <option key={a} value={a}>Acto {a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#64748b] mb-1.5 block">Categoría</label>
              <select
                value={form.category}
                onChange={e => field('category', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#64748b] mb-1.5 block">Dificultad</label>
              <select
                value={form.difficulty}
                onChange={e => field('difficulty', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{'★'.repeat(d)} — {XP_BY_DIFF[d]} XP</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#64748b] mb-1.5 block">Estado</label>
              <select
                value={form.status}
                onChange={e => field('status', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              >
                <option value="in_progress">Activa</option>
                <option value="locked">Bloqueada</option>
                <option value="completed">Completada</option>
              </select>
            </div>
          </div>

          {/* Tiempo estimado */}
          <div>
            <label className="text-xs text-[#64748b] mb-1.5 block">Tiempo estimado</label>
            <input
              type="text"
              value={form.estimatedTime}
              onChange={e => field('estimatedTime', e.target.value)}
              placeholder="ej: 2 semanas, 1 mes..."
              className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] placeholder-[#475569] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
            />
          </div>

          {/* Subtareas */}
          <div>
            <label className="text-xs text-[#64748b] mb-2 block">
              Subtareas <span className="text-[#475569]">({form.subtasks.length})</span>
            </label>
            <div className="space-y-2 mb-2">
              {form.subtasks.map(st => (
                <div key={st.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={st.title}
                    onChange={e => renameSubtask(st.id, e.target.value)}
                    className="flex-1 bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-1.5 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubtask(st.id)}
                    className="text-[#ef4444]/40 hover:text-[#ef4444] transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Nueva subtarea..."
                className="flex-1 bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-1.5 text-sm text-[#94a3b8] placeholder-[#475569] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              />
              <button
                type="button"
                onClick={addSubtask}
                disabled={!newSubtask.trim()}
                className="px-3 py-1.5 rounded-lg bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Cómo hacerlo */}
          <div>
            <label className="text-xs text-[#64748b] mb-2 block">
              Cómo hacerlo <span className="text-[#475569]">(pasos)</span>
            </label>
            <div className="space-y-2 mb-2">
              {form.howTo.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#7c3aed] text-xs font-bold w-4 text-center flex-shrink-0">{i + 1}.</span>
                  <input
                    type="text"
                    value={step}
                    onChange={e => editHowTo(i, e.target.value)}
                    className="flex-1 bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-1.5 text-sm text-[#94a3b8] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeHowTo(i)}
                    className="text-[#ef4444]/40 hover:text-[#ef4444] transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHowTo}
                onChange={e => setNewHowTo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHowTo())}
                placeholder="Añadir paso..."
                className="flex-1 bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-1.5 text-sm text-[#94a3b8] placeholder-[#475569] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
              />
              <button
                type="button"
                onClick={addHowTo}
                disabled={!newHowTo.trim()}
                className="px-3 py-1.5 rounded-lg bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Prerequisitos */}
          {otherQuests.length > 0 && (
            <div>
              <label className="text-xs text-[#64748b] mb-2 block">
                Requiere completar antes <span className="text-[#475569]">(prerequisitos)</span>
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {otherQuests.map(q => {
                  const selected = form.prerequisites.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => togglePrereq(q.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all text-left ${
                        selected
                          ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                          : 'bg-transparent border-white/[0.08] text-[#64748b] hover:text-[#94a3b8] hover:border-white/20'
                      }`}
                    >
                      {selected ? '✓ ' : ''}{q.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Desbloquea */}
          {otherQuests.length > 0 && (
            <div>
              <label className="text-xs text-[#64748b] mb-2 block">
                Desbloquea al completar
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {otherQuests.map(q => {
                  const selected = form.unlocks.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => toggleUnlock(q.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all text-left ${
                        selected
                          ? 'bg-[#7c3aed]/15 border-[#7c3aed]/40 text-[#a78bfa]'
                          : 'bg-transparent border-white/[0.08] text-[#64748b] hover:text-[#94a3b8] hover:border-white/20'
                      }`}
                    >
                      {selected ? '→ ' : ''}{q.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.title.trim()}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isNew ? 'Crear quest' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
