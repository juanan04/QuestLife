import { useState, useEffect, useCallback, useRef } from 'react';
import { initialData } from '../data/initialData';
import { calculateLevel, getStreakBonus } from '../utils/xpCalculator';
import { canUnlockQuest } from '../utils/questHelpers';
import { supabase } from '../data/supabaseClient';

const STORAGE_KEY = 'quest-life-data';

// ── Helpers de sync con Supabase ─────────────────────────────────────────────

async function cargarDesdeSupabase(userId) {
  const [{ data: profile }, { data: quests }, { data: habits }, { data: xpLog }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('quests').select('data').eq('user_id', userId),
      supabase.from('habits').select('data').eq('user_id', userId),
      supabase.from('xp_log').select('date, amount, reason').eq('user_id', userId).order('created_at'),
    ]);

  if (!profile) return null;

  return {
    player: {
      name: profile.name,
      xp: profile.xp,
      level: profile.level,
      joinDate: profile.join_date,
    },
    quests: (quests ?? []).map(r => r.data),
    habits: (habits ?? []).map(r => r.data),
    xpLog: xpLog ?? [],
  };
}

async function sincronizarConSupabase(userId, data) {
  const questUpserts = data.quests.map(q => ({
    user_id: userId,
    quest_id: q.id,
    data: q,
    updated_at: new Date().toISOString(),
  }));

  const habitUpserts = data.habits.map(h => ({
    user_id: userId,
    habit_id: h.id,
    data: h,
    updated_at: new Date().toISOString(),
  }));

  await Promise.all([
    supabase.from('profiles').upsert({
      id: userId,
      name: data.player.name,
      xp: data.player.xp,
      level: data.player.level,
      join_date: data.player.joinDate,
      updated_at: new Date().toISOString(),
    }),
    questUpserts.length > 0 &&
      supabase.from('quests').upsert(questUpserts, { onConflict: 'user_id,quest_id' }),
    habitUpserts.length > 0 &&
      supabase.from('habits').upsert(habitUpserts, { onConflict: 'user_id,habit_id' }),
  ]);
}

async function upsertProfile(userId, player) {
  await supabase.from('profiles').upsert({
    id: userId,
    name: player.name,
    xp: player.xp,
    level: player.level,
    join_date: player.joinDate,
    updated_at: new Date().toISOString(),
  });
}

async function upsertQuest(userId, quest) {
  await supabase.from('quests').upsert(
    { user_id: userId, quest_id: quest.id, data: quest, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,quest_id' }
  );
}

async function deleteQuestRemote(userId, questId) {
  await supabase.from('quests').delete().eq('user_id', userId).eq('quest_id', questId);
}

async function upsertHabit(userId, habit) {
  await supabase.from('habits').upsert(
    { user_id: userId, habit_id: habit.id, data: habit, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,habit_id' }
  );
}

async function deleteHabitRemote(userId, habitId) {
  await supabase.from('habits').delete().eq('user_id', userId).eq('habit_id', habitId);
}

async function insertXPLog(userId, entry) {
  await supabase.from('xp_log').insert({ user_id: userId, ...entry });
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function useGameData(session) {
  const userId = session?.user?.id ?? null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Propuesta de migración de datos locales a la nube
  const [pendingLocalData, setPendingLocalData] = useState(null);

  // Ref para evitar upserts duplicados en StrictMode
  const syncedRef = useRef(false);

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    // session === undefined significa que auth aún no se resolvió
    if (session === undefined) return;

    if (!userId) {
      setData(null);
      setPendingLocalData(null);
      setLoading(false);
      return;
    }

    syncedRef.current = false;
    setData(null);
    setPendingLocalData(null);
    setLoading(true);

    cargarDesdeSupabase(userId).then(remoto => {
      const local = (() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          return saved ? JSON.parse(saved) : null;
        } catch { return null; }
      })();

      if (remoto && (remoto.quests.length > 0 || remoto.habits.length > 0)) {
        // Hay datos en la nube → usarlos
        setData(remoto);
        setLoading(false);
        return;
      }

      if (local && (local.quests?.length > 0 || local.habits?.length > 0)) {
        // Hay datos locales pero no en la nube → preguntar al usuario
        setPendingLocalData(local);
        setData(local); // Mostrar app mientras se decide
        setLoading(false);
        return;
      }

      // Usuario nuevo sin datos → datos iniciales genéricos + sincronizar perfil
      const fresh = structuredClone(initialData);
      // Preservar el nombre del perfil de Supabase si existe
      if (remoto?.player?.name && remoto.player.name !== 'Aventurero') {
        fresh.player.name = remoto.player.name;
      }
      setData(fresh);
      // Subir datos iniciales a Supabase para que próximos logins carguen desde la nube
      sincronizarConSupabase(userId, fresh);
      setLoading(false);
    });
  }, [session, userId]);

  // ── Persistencia local (respaldo) ─────────────────────────────────────────
  useEffect(() => {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ── Migración de datos locales a la nube ───────────────────────────────────
  const aceptarMigracion = useCallback(async () => {
    if (!userId || !pendingLocalData) return;
    await sincronizarConSupabase(userId, pendingLocalData);
    setPendingLocalData(null);
  }, [userId, pendingLocalData]);

  const rechazarMigracion = useCallback(async () => {
    if (!userId) return;
    // Usar datos iniciales limpios en la nube
    const fresh = structuredClone(initialData);
    await sincronizarConSupabase(userId, fresh);
    setData(fresh);
    setPendingLocalData(null);
  }, [userId]);

  // ── playerStats ────────────────────────────────────────────────────────────
  const playerStats = data ? calculateLevel(data.player.xp) : { level: 1, totalXP: 0, currentXP: 0, xpToNext: 500 };

  // ── Mutaciones ─────────────────────────────────────────────────────────────

  const addXP = useCallback((amount, reason) => {
    setData(prev => {
      const newXP = Math.max(0, prev.player.xp + amount);
      const newLevelData = calculateLevel(newXP);
      const newPlayer = { ...prev.player, xp: newXP, level: newLevelData.level };
      const entry = { date: new Date().toISOString().split('T')[0], amount, reason };
      const next = { ...prev, player: newPlayer, xpLog: [...prev.xpLog, entry] };
      if (userId) { upsertProfile(userId, newPlayer); insertXPLog(userId, entry); }
      return next;
    });
  }, [userId]);

  const updateQuestStatus = useCallback((questId, newStatus) => {
    setData(prev => {
      let xpToAdd = 0;
      let xpReason = '';
      const newQuests = prev.quests.map(q => {
        if (q.id !== questId) return q;
        const updated = { ...q, status: newStatus };
        if (newStatus === 'completed') {
          updated.completedAt = new Date().toISOString();
          xpToAdd = q.xpReward || 0;
          xpReason = `Quest completada: ${q.title}`;
        }
        if (userId) upsertQuest(userId, updated);
        return updated;
      });
      const newXP = Math.max(0, prev.player.xp + xpToAdd);
      const newLevelData = calculateLevel(newXP);
      const newPlayer = { ...prev.player, xp: newXP, level: newLevelData.level };
      const newXPLog = xpToAdd > 0
        ? [...prev.xpLog, { date: new Date().toISOString().split('T')[0], amount: xpToAdd, reason: xpReason }]
        : prev.xpLog;
      if (userId && xpToAdd > 0) {
        upsertProfile(userId, newPlayer);
        insertXPLog(userId, newXPLog[newXPLog.length - 1]);
      }
      return { ...prev, quests: newQuests, player: newPlayer, xpLog: newXPLog };
    });
  }, [userId]);

  const toggleQuestSubtask = useCallback((questId, subtaskId) => {
    setData(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id !== questId) return q;
        const updated = {
          ...q,
          subtasks: q.subtasks.map(st => {
            if (st.id !== subtaskId) return st;
            return { ...st, completed: !st.completed, completedAt: !st.completed ? new Date().toISOString() : null };
          })
        };
        if (userId) upsertQuest(userId, updated);
        return updated;
      });
      return { ...prev, quests: newQuests };
    });
  }, [userId]);

  const updateQuestNotes = useCallback((questId, notes) => {
    setData(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id !== questId) return q;
        const updated = { ...q, notes };
        if (userId) upsertQuest(userId, updated);
        return updated;
      });
      return { ...prev, quests: newQuests };
    });
  }, [userId]);

  const toggleHabitToday = useCallback((habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      let xpDelta = 0;
      let xpReason = '';
      const newHabits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const wasChecked = !!h.checkHistory[today];
        const newHistory = { ...h.checkHistory };
        if (!wasChecked) {
          newHistory[today] = true;
          const sortedDates = Object.keys(newHistory).filter(d => newHistory[d]).sort().reverse();
          let streak = 1;
          for (let i = 1; i < sortedDates.length; i++) {
            const diff = (new Date(sortedDates[i - 1]) - new Date(sortedDates[i])) / 86400000;
            if (diff === 1) streak++; else break;
          }
          xpDelta = h.xpPerDay || 10;
          xpReason = `${h.title} completado`;
          const bonus = getStreakBonus(streak);
          if (bonus > 0) { xpDelta += bonus; xpReason += ` + bonus racha ${streak} días`; }
          const updated = { ...h, checkHistory: newHistory, streak, longestStreak: Math.max(h.longestStreak, streak) };
          if (userId) upsertHabit(userId, updated);
          return updated;
        } else {
          delete newHistory[today];
          xpDelta = -(h.xpPerDay || 10);
          xpReason = `${h.title} desmarcado`;
          const sortedDates = Object.keys(newHistory).filter(d => newHistory[d]).sort().reverse();
          let streak = 0;
          if (sortedDates.length > 0) {
            streak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
              const diff = (new Date(sortedDates[i - 1]) - new Date(sortedDates[i])) / 86400000;
              if (diff === 1) streak++; else break;
            }
          }
          const updated = { ...h, checkHistory: newHistory, streak };
          if (userId) upsertHabit(userId, updated);
          return updated;
        }
      });
      const newXP = Math.max(0, prev.player.xp + xpDelta);
      const newLevelData = calculateLevel(newXP);
      const newPlayer = { ...prev.player, xp: newXP, level: newLevelData.level };
      const entry = { date: today, amount: xpDelta, reason: xpReason };
      if (userId) { upsertProfile(userId, newPlayer); insertXPLog(userId, entry); }
      return { ...prev, habits: newHabits, player: newPlayer, xpLog: [...prev.xpLog, entry] };
    });
  }, [userId]);

  const updateHabitSubtaskProgress = useCallback((habitId, subtaskId, progress) => {
    setData(prev => {
      const newHabits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const updated = {
          ...h,
          subtasks: h.subtasks.map(st =>
            st.id === subtaskId ? { ...st, progress: Math.min(100, Math.max(0, progress)) } : st
          )
        };
        if (userId) upsertHabit(userId, updated);
        return updated;
      });
      return { ...prev, habits: newHabits };
    });
  }, [userId]);

  const updateHabitSubtasks = useCallback((habitId, subtasks) => {
    setData(prev => {
      const newHabits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const updated = { ...h, subtasks };
        if (userId) upsertHabit(userId, updated);
        return updated;
      });
      return { ...prev, habits: newHabits };
    });
  }, [userId]);

  const addHabit = useCallback((habitData) => {
    const newHabit = { id: `habit-${Date.now()}`, streak: 0, longestStreak: 0, checkHistory: {}, subtasks: [], ...habitData };
    setData(prev => {
      if (userId) upsertHabit(userId, newHabit);
      return { ...prev, habits: [...prev.habits, newHabit] };
    });
  }, [userId]);

  const deleteHabit = useCallback((habitId) => {
    if (userId) deleteHabitRemote(userId, habitId);
    setData(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== habitId) }));
  }, [userId]);

  const updateHabit = useCallback((habitId, updates) => {
    setData(prev => {
      const newHabits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const updated = { ...h, ...updates };
        if (userId) upsertHabit(userId, updated);
        return updated;
      });
      return { ...prev, habits: newHabits };
    });
  }, [userId]);

  const addQuest = useCallback((questData) => {
    const newQuest = {
      id: `quest-custom-${Date.now()}`,
      status: 'in_progress',
      prerequisites: [],
      unlocks: [],
      rewards: [],
      notes: '',
      completedAt: null,
      subtasks: [],
      howTo: [],
      ...questData
    };
    setData(prev => {
      if (userId) upsertQuest(userId, newQuest);
      return { ...prev, quests: [...prev.quests, newQuest] };
    });
  }, [userId]);

  const deleteQuest = useCallback((questId) => {
    if (userId) deleteQuestRemote(userId, questId);
    setData(prev => ({
      ...prev,
      quests: prev.quests
        .filter(q => q.id !== questId)
        .map(q => ({
          ...q,
          prerequisites: q.prerequisites?.filter(id => id !== questId) ?? [],
          unlocks: q.unlocks?.filter(id => id !== questId) ?? []
        }))
    }));
  }, [userId]);

  const updateQuest = useCallback((questId, updates) => {
    setData(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id !== questId) return q;
        const updated = { ...q, ...updates };
        if (userId) upsertQuest(userId, updated);
        return updated;
      });
      return { ...prev, quests: newQuests };
    });
  }, [userId]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quest-life-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback(async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.player && parsed.quests && parsed.habits) {
        setData(parsed);
        if (userId) await sincronizarConSupabase(userId, parsed);
        return true;
      }
      return false;
    } catch { return false; }
  }, [userId]);

  const resetData = useCallback(async () => {
    const fresh = structuredClone(initialData);
    setData(fresh);
    if (userId) await sincronizarConSupabase(userId, fresh);
  }, [userId]);

  const getUnlockableQuests = useCallback(() => {
    if (!data) return [];
    return data.quests.filter(q => q.status === 'locked' && canUnlockQuest(q, data.quests));
  }, [data]);

  return {
    data,
    loading,
    playerStats,
    pendingLocalData,
    aceptarMigracion,
    rechazarMigracion,
    updateQuestStatus,
    toggleQuestSubtask,
    updateQuestNotes,
    toggleHabitToday,
    updateHabitSubtaskProgress,
    addXP,
    exportData,
    importData,
    resetData,
    getUnlockableQuests,
    updateHabitSubtasks,
    addHabit,
    deleteHabit,
    updateHabit,
    addQuest,
    deleteQuest,
    updateQuest,
  };
}
