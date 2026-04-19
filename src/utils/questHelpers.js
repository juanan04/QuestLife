export function canUnlockQuest(quest, allQuests) {
  if (!quest.prerequisites || quest.prerequisites.length === 0) return true;
  return quest.prerequisites.every(prereqId => {
    const prereq = allQuests.find(q => q.id === prereqId);
    return prereq && prereq.status === 'completed';
  });
}

export function getQuestsByAct(quests, act) {
  return quests.filter(q => q.act === act);
}

export function getActiveQuests(quests) {
  return quests.filter(q => q.status === 'in_progress');
}

// Quests locked donde exactamente 1 prerequisite no está completado
export function getUpcomingQuests(quests) {
  return quests.filter(q => {
    if (q.status !== 'locked') return false;
    if (!q.prerequisites || q.prerequisites.length === 0) return false;
    const pendingPrereqs = q.prerequisites.filter(prereqId => {
      const prereq = quests.find(p => p.id === prereqId);
      return !prereq || prereq.status !== 'completed';
    });
    return pendingPrereqs.length === 1;
  }).slice(0, 3);
}

export function getQuestProgress(quest) {
  if (!quest.subtasks || quest.subtasks.length === 0) return 0;
  const completed = quest.subtasks.filter(st => st.completed).length;
  return Math.round((completed / quest.subtasks.length) * 100);
}

export function getCategoryColor(category) {
  const colors = {
    profesional: '#3b82f6',
    financiero: '#10b981',
    espiritual: '#a78bfa',
    relaciones: '#ec4899',
    salud: '#06b6d4',
  };
  return colors[category] || '#94a3b8';
}

export function getCategoryLabel(category) {
  const labels = {
    profesional: 'Profesional',
    financiero: 'Financiero',
    espiritual: 'Espiritual',
    relaciones: 'Relaciones',
    salud: 'Salud',
  };
  return labels[category] || category;
}

export const CATEGORIES = [
  { id: 'profesional', label: 'Profesional' },
  { id: 'financiero', label: 'Financiero' },
  { id: 'espiritual', label: 'Espiritual' },
  { id: 'relaciones', label: 'Relaciones' },
  { id: 'salud', label: 'Salud' },
];
