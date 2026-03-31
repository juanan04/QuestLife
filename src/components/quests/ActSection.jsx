import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import QuestCard from './QuestCard';

const ACT_NAMES = {
  1: 'Primeros pasos',
  2: 'Expansión',
  3: 'Escala',
  4: 'Élite',
  5: 'Legado',
};

export default function ActSection({ act, quests }) {
  const [collapsed, setCollapsed] = useState(false);

  const completed = quests.filter(q => q.status === 'completed').length;
  const allDone = completed === quests.length && quests.length > 0;

  if (quests.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold text-[#475569] uppercase tracking-widest"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Acto {act}
          </span>
          <span className="text-base font-semibold text-[#94a3b8]">
            {ACT_NAMES[act] || `Acto ${act}`}
          </span>
          {allDone && <CheckCircle2 size={16} className="text-[#f59e0b]" />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#475569]">
            {completed}/{quests.length}
          </span>
          {collapsed
            ? <ChevronDown size={16} className="text-[#475569] group-hover:text-[#94a3b8] transition-colors" />
            : <ChevronUp size={16} className="text-[#475569] group-hover:text-[#94a3b8] transition-colors" />
          }
        </div>
      </button>

      {/* Progress line */}
      <div className="w-full h-px bg-[#1a1a2e] mb-4 relative">
        <div
          className="absolute top-0 left-0 h-px bg-[#7c3aed]/60 transition-all duration-500"
          style={{ width: `${quests.length > 0 ? (completed / quests.length) * 100 : 0}%` }}
        />
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {quests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}
    </div>
  );
}
