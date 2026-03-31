import { Lock } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getUpcomingQuests } from '../../utils/questHelpers';
import Card from '../ui/Card';
import CategoryBadge from '../ui/CategoryBadge';

export default function UpcomingQuests() {
  const { data } = useGame();
  const upcoming = getUpcomingQuests(data.quests);

  if (upcoming.length === 0) return null;

  return (
    <Card className="mt-6">
      <h3 className="text-sm font-semibold text-[#94a3b8] flex items-center gap-2 mb-4">
        <Lock size={16} className="text-[#64748b]" />
        Próximas a desbloquearse
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {upcoming.map(quest => {
          const pendingPrereq = quest.prerequisites.find(prereqId => {
            const prereq = data.quests.find(q => q.id === prereqId);
            return !prereq || prereq.status !== 'completed';
          });
          const prereqQuest = data.quests.find(q => q.id === pendingPrereq);

          return (
            <div
              key={quest.id}
              className="p-3 bg-[#0a0a0f] rounded-lg border border-white/[0.05] opacity-70"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock size={12} className="text-[#475569] flex-shrink-0" />
                <span className="text-sm font-medium text-[#94a3b8] leading-tight">{quest.title}</span>
              </div>
              <CategoryBadge category={quest.category} className="mb-2" />
              {prereqQuest && (
                <p className="text-xs text-[#475569]">
                  Falta: <span className="text-[#64748b]">{prereqQuest.title}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
