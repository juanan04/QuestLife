import { useState } from 'react';
import { Lock, Swords, CheckCircle2, ChevronDown, ChevronUp, Clock, FileText, Trash2, Pencil } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getQuestProgress } from '../../utils/questHelpers';
import CategoryBadge from '../ui/CategoryBadge';
import DifficultyStars from '../ui/DifficultyStars';
import ProgressBar from '../ui/ProgressBar';
import { canUnlockQuest } from '../../utils/questHelpers';
import QuestEditModal from './QuestEditModal';

const STATUS_ICONS = {
  locked: Lock,
  in_progress: Swords,
  completed: CheckCircle2,
};

const STATUS_COLORS = {
  locked: '#475569',
  in_progress: '#a78bfa',
  completed: '#f59e0b',
};

export default function QuestCard({ quest }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(quest.notes || '');
  const [editing, setEditing] = useState(false);
  const { data, updateQuestStatus, toggleQuestSubtask, updateQuestNotes, deleteQuest, updateQuest } = useGame();

  const StatusIcon = STATUS_ICONS[quest.status];
  const statusColor = STATUS_COLORS[quest.status];
  const progress = getQuestProgress(quest);
  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';
  const isActive = quest.status === 'in_progress';
  const unlockable = isLocked && canUnlockQuest(quest, data.quests);

  const handleStart = () => {
    if (window.confirm(`¿Empezar la quest "${quest.title}"?`)) {
      updateQuestStatus(quest.id, 'in_progress');
    }
  };

  const handleComplete = () => {
    if (window.confirm(`¿Completar "${quest.title}"? Ganarás ${quest.xpReward} XP.`)) {
      updateQuestStatus(quest.id, 'completed');
    }
  };

  const handleNotesBlur = () => {
    updateQuestNotes(quest.id, notes);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar la quest "${quest.title}"?`)) {
      deleteQuest(quest.id);
    }
  };

  const handleSaveEdit = (formData) => {
    // Si cambia a completed, añadir XP vía updateQuestStatus y luego aplicar el resto de cambios
    if (formData.status === 'completed' && quest.status !== 'completed') {
      const { status, xpReward, ...rest } = formData;
      updateQuest(quest.id, { ...rest, xpReward });
      updateQuestStatus(quest.id, 'completed');
    } else {
      updateQuest(quest.id, formData);
    }
    setEditing(false);
  };

  return (
    <>
      {editing && (
        <QuestEditModal
          quest={quest}
          onClose={() => setEditing(false)}
          onSave={handleSaveEdit}
        />
      )}

      <div
        className={`
          rounded-xl border transition-all duration-300
          ${isLocked && !unlockable ? 'opacity-50' : ''}
          ${isActive ? 'border-[#7c3aed]/50 quest-active-glow bg-[#12121a]' : ''}
          ${isCompleted ? 'border-[#f59e0b]/20 bg-[#12121a]' : ''}
          ${isLocked ? 'border-white/[0.06] bg-[#0e0e18]' : ''}
        `}
      >
        {/* Header — siempre visible */}
        <div
          className="p-4 cursor-pointer flex items-start gap-3"
          onClick={() => setExpanded(e => !e)}
        >
          {/* Status icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}30` }}
          >
            <StatusIcon size={16} style={{ color: statusColor }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className={`font-medium text-sm leading-tight ${isCompleted ? 'text-[#f59e0b]' : isLocked ? 'text-[#64748b]' : 'text-[#e2e8f0]'}`}>
                {quest.title}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <DifficultyStars difficulty={quest.difficulty} size={10} />
                {expanded ? <ChevronUp size={14} className="text-[#475569]" /> : <ChevronDown size={14} className="text-[#475569]" />}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <CategoryBadge category={quest.category} />
              <span className="flex items-center gap-1 text-xs text-[#475569]">
                <Clock size={10} />
                {quest.estimatedTime}
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: '#f59e0b', fontFamily: "'Orbitron', sans-serif" }}
              >
                +{quest.xpReward} XP
              </span>
            </div>

            {quest.subtasks && quest.subtasks.length > 0 && (
              <div className="flex items-center gap-2">
                <ProgressBar value={progress} height="h-1" className="flex-1" />
                <span className="text-xs text-[#475569] whitespace-nowrap">{progress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-4">

            {/* Description */}
            {quest.description && (
              <p className="text-sm text-[#94a3b8] leading-relaxed">{quest.description}</p>
            )}

            {/* How to */}
            {quest.howTo && quest.howTo.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Cómo hacerlo</p>
                <ul className="space-y-1">
                  {quest.howTo.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                      <span className="text-[#7c3aed] font-bold text-xs mt-0.5">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {quest.prerequisites && quest.prerequisites.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Requisitos</p>
                <div className="flex flex-wrap gap-2">
                  {quest.prerequisites.map(prereqId => {
                    const prereq = data.quests.find(q => q.id === prereqId);
                    const done = prereq?.status === 'completed';
                    return (
                      <span
                        key={prereqId}
                        className="text-xs px-2 py-1 rounded-full border"
                        style={{
                          borderColor: done ? '#10b98140' : '#47556940',
                          color: done ? '#10b981' : '#64748b',
                          backgroundColor: done ? '#10b98110' : '#47556910'
                        }}
                      >
                        {done ? '✓' : '○'} {prereq?.title || prereqId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unlocks */}
            {quest.unlocks && quest.unlocks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Desbloquea</p>
                <div className="flex flex-wrap gap-2">
                  {quest.unlocks.map(unlockId => {
                    const unlock = data.quests.find(q => q.id === unlockId);
                    if (!unlock) return null;
                    return (
                      <span
                        key={unlockId}
                        className="text-xs px-2 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa]"
                      >
                        → {unlock.title}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subtasks */}
            {quest.subtasks && quest.subtasks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                  Subtareas ({quest.subtasks.filter(s => s.completed).length}/{quest.subtasks.length})
                </p>
                <div className="space-y-2">
                  {quest.subtasks.map(subtask => (
                    <label
                      key={subtask.id}
                      className={`flex items-start gap-3 cursor-pointer group ${isCompleted ? 'cursor-default' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        disabled={isCompleted || isLocked}
                        onChange={() => toggleQuestSubtask(quest.id, subtask.id)}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-transparent accent-[#7c3aed] cursor-pointer flex-shrink-0"
                      />
                      <span className={`text-sm leading-tight transition-colors ${
                        subtask.completed
                          ? 'line-through text-[#475569]'
                          : 'text-[#94a3b8] group-hover:text-[#e2e8f0]'
                      }`}>
                        {subtask.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {!isLocked && (
              <div>
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileText size={10} />
                  Notas
                </p>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  disabled={isCompleted}
                  placeholder="Añade notas personales..."
                  rows={3}
                  className="w-full bg-[#0a0a0f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#94a3b8] placeholder-[#475569] resize-none focus:outline-none focus:border-[#7c3aed]/40 transition-colors"
                />
              </div>
            )}

            {/* Completed date */}
            {isCompleted && quest.completedAt && (
              <p className="text-xs text-[#475569]">
                Completada el {new Date(quest.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              {unlockable && !isActive && (
                <button
                  onClick={handleStart}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/30 transition-all"
                >
                  Empezar quest
                </button>
              )}
              {isActive && (
                <button
                  onClick={handleComplete}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/25 hover:bg-[#f59e0b]/25 transition-all"
                >
                  Completar quest (+{quest.xpReward} XP)
                </button>
              )}
              {isCompleted && (
                <span className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-center bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                  ✓ Quest completada
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                className="p-2 rounded-lg text-[#64748b] hover:text-[#a78bfa] hover:bg-[#7c3aed]/10 border border-transparent hover:border-[#7c3aed]/20 transition-all"
                title="Editar quest"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg text-[#ef4444]/40 hover:text-[#ef4444] hover:bg-[#ef4444]/10 border border-transparent hover:border-[#ef4444]/20 transition-all"
                title="Eliminar quest"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
