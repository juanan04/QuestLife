// XP reward por dificultad
const DIFFICULTY_XP = { 1: 50, 2: 100, 3: 200, 4: 400, 5: 750 };

export function getXPForDifficulty(difficulty) {
  return DIFFICULTY_XP[difficulty] || 100;
}

// Calcular nivel a partir de XP total
// Nivel 1: 0-499 XP, Nivel 2: requiere 500 XP más, Nivel 3: 1000 más...
// XP para pasar de nivel N a N+1 = N * 500
export function calculateLevel(totalXP) {
  let level = 1;
  let xpNeeded = 500; // XP para pasar de nivel 1 a 2
  let xpAccumulated = 0;

  while (xpAccumulated + xpNeeded <= totalXP) {
    xpAccumulated += xpNeeded;
    level++;
    xpNeeded = level * 500;
  }

  return {
    level,
    currentLevelXP: totalXP - xpAccumulated,
    nextLevelXP: xpNeeded,
    totalXP,
    percentage: Math.round(((totalXP - xpAccumulated) / xpNeeded) * 100)
  };
}

// Título RPG según nivel
export function getLevelTitle(level) {
  if (level >= 20) return "Leyenda";
  if (level >= 15) return "Élite";
  if (level >= 10) return "Veterano";
  if (level >= 5) return "Aventurero";
  return "Novato";
}

// Bonus por racha múltiplo de 7
export function getStreakBonus(streak) {
  return streak > 0 && streak % 7 === 0 ? 50 : 0;
}
