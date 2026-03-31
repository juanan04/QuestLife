import { useNavigate } from 'react-router-dom';
import { Swords, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getActiveQuests, getQuestProgress } from '../../utils/questHelpers';
import Card from '../ui/Card';
import CategoryBadge from '../ui/CategoryBadge';
import DifficultyStars from '../ui/DifficultyStars';
import ProgressBar from '../ui/ProgressBar';

export default function ActiveQuests() {
  const { data } = useGame();
  const navigate = useNavigate();
  const active = getActiveQuests(data.quests).slice(0, 6);

  if (active.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-[#94a3b8] mb-4 flex items-center gap-2">
          <Swords size={16} className="text-[#7c3aed]" />
          Misiones activas
        </h3>
        <p className="text-sm text-[#475569] text-center py-4">
          No hay misiones en progreso. Ve al Quest Board para empezar una.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#94a3b8] flex items-center gap-2">
          <Swords size={16} className="text-[#7c3aed]" />
          Misiones activas
        </h3>
        <button
          onClick={() => navigate('/quests')}
          className="text-xs text-[#7c3aed] hover:text-[#a78bfa] flex items-center gap-1 transition-colors"
        >
          Ver todas <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {active.map(quest => {
          const progress = getQuestProgress(quest);
          return (
            <div
              key={quest.id}
              onClick={() => navigate('/quests')}
              className="p-3 bg-[#0a0a0f] rounded-lg border border-white/[0.05] hover:border-[#7c3aed]/30 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-[#e2e8f0] leading-tight">{quest.title}</span>
                <DifficultyStars difficulty={quest.difficulty} size={10} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge category={quest.category} />
                <span className="text-xs text-[#475569]">{quest.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar value={progress} className="flex-1" height="h-1.5" />
                <span className="text-xs text-[#64748b] whitespace-nowrap">{progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
