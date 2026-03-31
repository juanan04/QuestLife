import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CATEGORIES } from '../../utils/questHelpers';
import ActSection from './ActSection';
import QuestEditModal from './QuestEditModal';
import { Filter, Plus } from 'lucide-react';

const STATUS_FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'in_progress', label: 'Activas' },
  { id: 'locked', label: 'Bloqueadas' },
  { id: 'completed', label: 'Completadas' },
];

export default function QuestBoard() {
  const { data, addQuest } = useGame();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const completed = data.quests.filter(q => q.status === 'completed').length;

  const filtered = data.quests.filter(q => {
    const catMatch = activeCategory === 'all' || q.category === activeCategory;
    const statusMatch = activeStatus === 'all' || q.status === activeStatus;
    return catMatch && statusMatch;
  });

  const allActs = [...new Set([1, 2, 3, 4, 5, ...data.quests.map(q => q.act)])].sort((a, b) => a - b);

  const handleCreate = (formData) => {
    addQuest(formData);
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <QuestEditModal
          quest={null}
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#64748b]">
          <span className="text-[#f59e0b] font-semibold">{completed}</span>
          <span className="text-[#475569]"> / {data.quests.length} misiones completadas</span>
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#475569]">
            <Filter size={12} />
            Filtros activos
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-[#7c3aed]/15 text-[#a78bfa] border-[#7c3aed]/30 hover:bg-[#7c3aed]/25 transition-all"
          >
            <Plus size={13} />
            Nueva quest
          </button>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveStatus(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeStatus === f.id
                ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30'
                : 'bg-[#12121a] text-[#64748b] border border-white/[0.05] hover:text-[#94a3b8]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-[#12121a] text-[#64748b] border border-white/[0.05] hover:text-[#94a3b8]'
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-[#12121a] text-[#64748b] border border-white/[0.05] hover:text-[#94a3b8]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Quest list por actos */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#475569]">
          No hay misiones en esta categoría / estado.
        </div>
      ) : (
        allActs.map(act => {
          const questsInAct = filtered.filter(q => q.act === act);
          return (
            <ActSection
              key={act}
              act={act}
              quests={questsInAct}
            />
          );
        })
      )}
    </div>
  );
}
