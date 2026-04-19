import { useState } from 'react';
import {
  Briefcase, DollarSign, Sparkles, Heart, Dumbbell,
  Flame, ChevronDown, ChevronUp, Check, Pencil, Plus, Trash2, X
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import CategoryBadge from '../ui/CategoryBadge';
import HabitHeatmap from './HabitHeatmap';
import XPPopup from '../ui/XPPopup';

const CATEGORY_ICONS = {
  profesional: Briefcase,
  financiero: DollarSign,
  espiritual: Sparkles,
  relaciones: Heart,
  salud: Dumbbell,
};

const FREQ_LABELS = {
  'daily': null,
  '3x-week': '3x semana',
  '2x-week': '2x semana',
  'weekly-saturday': 'Sábados',
};

export default function HabitCard({ habit }) {
  const [expanded, setExpanded] = useState(false);
  const [editingSubtasks, setEditingSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showXP, setShowXP] = useState(false);
  const { toggleHabitToday, updateHabitSubtaskProgress, updateHabitSubtasks, deleteHabit } = useGame();

  const today = new Date().toISOString().split('T')[0];
  const isCheckedToday = !!habit.checkHistory[today];
  const Icon = CATEGORY_ICONS[habit.category] || BookOpen;
  const freqLabel = FREQ_LABELS[habit.frequency];

  const handleCheck = () => {
    toggleHabitToday(habit.id);
    if (!isCheckedToday) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
    }
  };

  const handleAddSubtask = () => {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    const newSubtask = { id: `st-${Date.now()}`, title, progress: 0 };
    updateHabitSubtasks(habit.id, [...(habit.subtasks || []), newSubtask]);
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subtaskId) => {
    updateHabitSubtasks(habit.id, habit.subtasks.filter(st => st.id !== subtaskId));
  };

  const handleDeleteHabit = () => {
    if (window.confirm(`¿Eliminar el hábito "${habit.title}"? Se perderá todo su historial.`)) {
      deleteHabit(habit.id);
    }
  };

  return (
    <div className="bg-[#12121a] border border-white/[0.08] rounded-xl overflow-hidden transition-all duration-300">
      <div className="p-4 flex items-center gap-3">
        {/* Category icon */}
        <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-[#94a3b8]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-[#e2e8f0]">{habit.title}</span>
            {freqLabel && (
              <span className="text-xs text-[#475569] bg-[#1a1a2e] px-1.5 py-0.5 rounded">
                {freqLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <CategoryBadge category={habit.category} />
            <div className="flex items-center gap-1 text-xs">
              <Flame size={11} className={habit.streak > 0 ? 'text-[#f97316]' : 'text-[#475569]'} />
              <span className={habit.streak > 0 ? 'text-[#f97316]' : 'text-[#475569]'}>
                {habit.streak} días
              </span>
            </div>
            <span className="text-xs text-[#475569]">+{habit.xpPerDay} XP</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[#475569] hover:text-[#94a3b8] transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Check button */}
          <div className="relative">
            {showXP && <XPPopup amount={habit.xpPerDay} />}
            <button
              onClick={handleCheck}
              className={`
                w-9 h-9 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 transform active:scale-90
                ${isCheckedToday
                  ? 'bg-[#7c3aed] border-[#7c3aed] text-white scale-105'
                  : 'bg-transparent border-[#2d2d3d] text-[#2d2d3d] hover:border-[#7c3aed]/50 hover:text-[#7c3aed]'
                }
              `}
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">

          {/* Subtasks section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                {habit.subtasks && habit.subtasks.length > 0 ? 'Progreso de ítems' : 'Ítems de seguimiento'}
              </p>
              <button
                onClick={() => setEditingSubtasks(e => !e)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                  editingSubtasks
                    ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30'
                    : 'text-[#475569] hover:text-[#94a3b8] border border-transparent'
                }`}
              >
                <Pencil size={11} />
                {editingSubtasks ? 'Listo' : 'Editar'}
              </button>
            </div>

            {habit.subtasks && habit.subtasks.length > 0 && (
              <div className="space-y-3 mb-3">
                {habit.subtasks.map(st => (
                  <div key={st.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#94a3b8]">{st.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#64748b]">{st.progress}%</span>
                          {editingSubtasks && (
                            <button
                              onClick={() => handleDeleteSubtask(st.id)}
                              className="text-[#ef4444]/60 hover:text-[#ef4444] transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={st.progress}
                        onChange={e => updateHabitSubtaskProgress(habit.id, st.id, Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #7c3aed ${st.progress}%, #1a1a2e ${st.progress}%)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new subtask */}
            {editingSubtasks && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Nuevo ítem (ej: Gramática, Scales...)"
                  className="flex-1 bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#94a3b8] placeholder-[#475569] focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
                />
                <button
                  onClick={handleAddSubtask}
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {/* Delete habit */}
            {editingSubtasks && (
              <button
                onClick={handleDeleteHabit}
                className="flex items-center gap-1.5 text-xs text-[#ef4444]/60 hover:text-[#ef4444] transition-colors mt-1"
              >
                <Trash2 size={12} />
                Eliminar este hábito
              </button>
            )}
          </div>

          <HabitHeatmap habit={habit} />
        </div>
      )}
    </div>
  );
}
