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
    negocio: '#3b82f6',
    financiero: '#10b981',
    idiomas: '#f59e0b',
    ciber: '#ef4444',
    fisico: '#06b6d4',
    arte: '#ec4899',
    licencias: '#8b5cf6',
    suenos: '#f97316',
    habilidades: '#14b8a6',
    'estilo-vida': '#a855f7',
    conocimiento: '#6366f1',
  };
  return colors[category] || '#94a3b8';
}

export function getCategoryLabel(category) {
  const labels = {
    negocio: 'Negocio',
    financiero: 'Financiero',
    idiomas: 'Idiomas',
    ciber: 'Ciberseguridad',
    fisico: 'Físico',
    arte: 'Arte',
    licencias: 'Licencias',
    suenos: 'Sueños',
    habilidades: 'Habilidades',
    'estilo-vida': 'Estilo de vida',
    conocimiento: 'Conocimiento',
  };
  return labels[category] || category;
}

export const CATEGORIES = [
  { id: 'negocio', label: 'Negocio' },
  { id: 'financiero', label: 'Financiero' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'ciber', label: 'Ciberseguridad' },
  { id: 'fisico', label: 'Físico' },
  { id: 'arte', label: 'Arte' },
  { id: 'licencias', label: 'Licencias' },
  { id: 'suenos', label: 'Sueños' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'estilo-vida', label: 'Estilo de vida' },
  { id: 'conocimiento', label: 'Conocimiento' },
];
