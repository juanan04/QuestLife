import { describe, it, expect } from 'vitest';
import {
  canUnlockQuest,
  getQuestsByAct,
  getActiveQuests,
  getUpcomingQuests,
  getQuestProgress,
  getCategoryColor,
  getCategoryLabel,
} from './questHelpers';

// Datos de ejemplo reutilizables
const makeQuest = (id, status, act = 1, prerequisites = []) => ({
  id,
  status,
  act,
  prerequisites,
  subtasks: [],
});

describe('canUnlockQuest', () => {
  it('puede desbloquear si no tiene prerequisites', () => {
    const quest = makeQuest('q1', 'locked');
    expect(canUnlockQuest(quest, [])).toBe(true);
  });

  it('puede desbloquear si todos los prerequisites están completados', () => {
    const prereq = makeQuest('q1', 'completed');
    const quest = makeQuest('q2', 'locked', 1, ['q1']);
    expect(canUnlockQuest(quest, [prereq, quest])).toBe(true);
  });

  it('no puede desbloquear si algún prerequisite no está completado', () => {
    const prereq = makeQuest('q1', 'in_progress');
    const quest = makeQuest('q2', 'locked', 1, ['q1']);
    expect(canUnlockQuest(quest, [prereq, quest])).toBe(false);
  });

  it('no puede desbloquear si el prerequisite no existe', () => {
    const quest = makeQuest('q2', 'locked', 1, ['q99']);
    expect(canUnlockQuest(quest, [quest])).toBe(false);
  });

  it('requiere que TODOS los prerequisites estén completados', () => {
    const prereq1 = makeQuest('q1', 'completed');
    const prereq2 = makeQuest('q2', 'locked');
    const quest = makeQuest('q3', 'locked', 1, ['q1', 'q2']);
    expect(canUnlockQuest(quest, [prereq1, prereq2, quest])).toBe(false);
  });
});

describe('getQuestsByAct', () => {
  const quests = [
    makeQuest('q1', 'completed', 1),
    makeQuest('q2', 'in_progress', 1),
    makeQuest('q3', 'locked', 2),
    makeQuest('q4', 'completed', 2),
  ];

  it('filtra quests por acto 1', () => {
    const result = getQuestsByAct(quests, 1);
    expect(result).toHaveLength(2);
    expect(result.map(q => q.id)).toEqual(['q1', 'q2']);
  });

  it('filtra quests por acto 2', () => {
    const result = getQuestsByAct(quests, 2);
    expect(result).toHaveLength(2);
    expect(result.map(q => q.id)).toEqual(['q3', 'q4']);
  });

  it('devuelve array vacío si no hay quests del acto', () => {
    expect(getQuestsByAct(quests, 99)).toHaveLength(0);
  });
});

describe('getActiveQuests', () => {
  const quests = [
    makeQuest('q1', 'completed'),
    makeQuest('q2', 'in_progress'),
    makeQuest('q3', 'locked'),
    makeQuest('q4', 'in_progress'),
  ];

  it('devuelve solo las quests en progreso', () => {
    const result = getActiveQuests(quests);
    expect(result).toHaveLength(2);
    expect(result.map(q => q.id)).toEqual(['q2', 'q4']);
  });

  it('devuelve array vacío si no hay quests activas', () => {
    expect(getActiveQuests([makeQuest('q1', 'completed')])).toHaveLength(0);
  });
});

describe('getUpcomingQuests', () => {
  it('devuelve quests bloqueadas con exactamente 1 prerequisite pendiente', () => {
    const completed = makeQuest('q1', 'completed');
    const locked = makeQuest('q2', 'locked');
    const upcoming = { ...makeQuest('q3', 'locked'), prerequisites: ['q1', 'q2'] };
    const allQuests = [completed, locked, upcoming];
    const result = getUpcomingQuests(allQuests);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('q3');
  });

  it('no incluye quests sin prerequisites', () => {
    const quest = makeQuest('q1', 'locked');
    expect(getUpcomingQuests([quest])).toHaveLength(0);
  });

  it('no incluye quests con más de 1 prerequisite pendiente', () => {
    const locked1 = makeQuest('q1', 'locked');
    const locked2 = makeQuest('q2', 'locked');
    const quest = { ...makeQuest('q3', 'locked'), prerequisites: ['q1', 'q2'] };
    expect(getUpcomingQuests([locked1, locked2, quest])).toHaveLength(0);
  });

  it('no incluye quests que no están bloqueadas', () => {
    const completed = makeQuest('q1', 'completed');
    const active = { ...makeQuest('q2', 'in_progress'), prerequisites: ['q1'] };
    expect(getUpcomingQuests([completed, active])).toHaveLength(0);
  });

  it('limita a 3 quests upcoming', () => {
    // Para que una quest aparezca como "upcoming": bloqueada con exactamente 1 prerequisite pendiente
    // Cada quest tiene 2 prerequisites: uno completado y uno bloqueado
    const completed = makeQuest('c1', 'completed');
    const blocked = makeQuest('b1', 'locked');
    const upcomings = Array.from({ length: 5 }, (_, i) => ({
      ...makeQuest(`q${i}`, 'locked'),
      prerequisites: ['c1', 'b1'],
    }));
    const result = getUpcomingQuests([completed, blocked, ...upcomings]);
    expect(result).toHaveLength(3);
  });
});

describe('getQuestProgress', () => {
  it('devuelve 0 si no hay subtareas', () => {
    const quest = { subtasks: [] };
    expect(getQuestProgress(quest)).toBe(0);
  });

  it('devuelve 0 si subtasks es undefined', () => {
    const quest = {};
    expect(getQuestProgress(quest)).toBe(0);
  });

  it('devuelve 100 si todas las subtareas están completadas', () => {
    const quest = {
      subtasks: [
        { completed: true },
        { completed: true },
      ],
    };
    expect(getQuestProgress(quest)).toBe(100);
  });

  it('devuelve 50 si la mitad están completadas', () => {
    const quest = {
      subtasks: [
        { completed: true },
        { completed: false },
      ],
    };
    expect(getQuestProgress(quest)).toBe(50);
  });

  it('redondea el porcentaje', () => {
    const quest = {
      subtasks: [
        { completed: true },
        { completed: false },
        { completed: false },
      ],
    };
    // 1/3 = 33.33... → redondeado a 33
    expect(getQuestProgress(quest)).toBe(33);
  });
});

describe('getCategoryColor', () => {
  it('devuelve color correcto para categorías conocidas', () => {
    expect(getCategoryColor('negocio')).toBe('#3b82f6');
    expect(getCategoryColor('financiero')).toBe('#10b981');
    expect(getCategoryColor('ciber')).toBe('#ef4444');
  });

  it('devuelve color por defecto para categoría desconocida', () => {
    expect(getCategoryColor('desconocida')).toBe('#94a3b8');
  });
});

describe('getCategoryLabel', () => {
  it('devuelve etiqueta correcta para categorías conocidas', () => {
    expect(getCategoryLabel('negocio')).toBe('Negocio');
    expect(getCategoryLabel('ciber')).toBe('Ciberseguridad');
    expect(getCategoryLabel('estilo-vida')).toBe('Estilo de vida');
  });

  it('devuelve la categoría sin traducir para categoría desconocida', () => {
    expect(getCategoryLabel('custom-category')).toBe('custom-category');
  });
});
