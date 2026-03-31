import { describe, it, expect } from 'vitest';
import { getXPForDifficulty, calculateLevel, getLevelTitle, getStreakBonus } from './xpCalculator';

describe('getXPForDifficulty', () => {
  it('devuelve 50 XP para dificultad 1', () => {
    expect(getXPForDifficulty(1)).toBe(50);
  });
  it('devuelve 100 XP para dificultad 2', () => {
    expect(getXPForDifficulty(2)).toBe(100);
  });
  it('devuelve 200 XP para dificultad 3', () => {
    expect(getXPForDifficulty(3)).toBe(200);
  });
  it('devuelve 400 XP para dificultad 4', () => {
    expect(getXPForDifficulty(4)).toBe(400);
  });
  it('devuelve 750 XP para dificultad 5', () => {
    expect(getXPForDifficulty(5)).toBe(750);
  });
  it('devuelve 100 XP por defecto para dificultad desconocida', () => {
    expect(getXPForDifficulty(99)).toBe(100);
    expect(getXPForDifficulty(0)).toBe(100);
  });
});

describe('calculateLevel', () => {
  it('nivel 1 con 0 XP', () => {
    const result = calculateLevel(0);
    expect(result.level).toBe(1);
    expect(result.currentLevelXP).toBe(0);
    expect(result.nextLevelXP).toBe(500);
    expect(result.percentage).toBe(0);
  });

  it('nivel 1 con 499 XP (justo antes de subir)', () => {
    const result = calculateLevel(499);
    expect(result.level).toBe(1);
    expect(result.currentLevelXP).toBe(499);
    expect(result.nextLevelXP).toBe(500);
  });

  it('nivel 2 con exactamente 500 XP', () => {
    const result = calculateLevel(500);
    expect(result.level).toBe(2);
    expect(result.currentLevelXP).toBe(0);
    expect(result.nextLevelXP).toBe(1000); // nivel 2 * 500
  });

  it('nivel 2 con 1000 XP (399 de 1000 para nivel 3)', () => {
    // Nivel 2 necesita 1000 XP para pasar a nivel 3 (2*500)
    // Con 900 XP: nivel 2 (xp acumulado para entrar nivel 2 = 500, para nivel 3 = 500+1000=1500)
    const result = calculateLevel(900);
    expect(result.level).toBe(2);
    expect(result.currentLevelXP).toBe(400);
    expect(result.nextLevelXP).toBe(1000);
  });

  it('nivel 3 con 1500 XP', () => {
    // Nivel 3: necesita 500 + 1000 = 1500 XP acumulados
    const result = calculateLevel(1500);
    expect(result.level).toBe(3);
    expect(result.currentLevelXP).toBe(0);
    expect(result.nextLevelXP).toBe(1500); // nivel 3 * 500
  });

  it('porcentaje calculado correctamente', () => {
    // En nivel 1, con 250 XP de 500 necesarios → 50%
    const result = calculateLevel(250);
    expect(result.level).toBe(1);
    expect(result.percentage).toBe(50);
  });

  it('porcentaje 100% justo al alcanzar el siguiente nivel', () => {
    // Con exactamente 500 XP empieza nivel 2 con 0% progreso
    const result = calculateLevel(500);
    expect(result.percentage).toBe(0);
  });

  it('totalXP se conserva', () => {
    const xp = 1234;
    const result = calculateLevel(xp);
    expect(result.totalXP).toBe(xp);
  });
});

describe('getLevelTitle', () => {
  it('Novato para niveles 1-4', () => {
    expect(getLevelTitle(1)).toBe('Novato');
    expect(getLevelTitle(4)).toBe('Novato');
  });
  it('Aventurero para niveles 5-9', () => {
    expect(getLevelTitle(5)).toBe('Aventurero');
    expect(getLevelTitle(9)).toBe('Aventurero');
  });
  it('Veterano para niveles 10-14', () => {
    expect(getLevelTitle(10)).toBe('Veterano');
    expect(getLevelTitle(14)).toBe('Veterano');
  });
  it('Élite para niveles 15-19', () => {
    expect(getLevelTitle(15)).toBe('Élite');
    expect(getLevelTitle(19)).toBe('Élite');
  });
  it('Leyenda para nivel 20+', () => {
    expect(getLevelTitle(20)).toBe('Leyenda');
    expect(getLevelTitle(50)).toBe('Leyenda');
  });
});

describe('getStreakBonus', () => {
  it('0 para racha 0', () => {
    expect(getStreakBonus(0)).toBe(0);
  });
  it('0 para rachas que no son múltiplo de 7', () => {
    expect(getStreakBonus(1)).toBe(0);
    expect(getStreakBonus(6)).toBe(0);
    expect(getStreakBonus(8)).toBe(0);
    expect(getStreakBonus(13)).toBe(0);
  });
  it('50 XP de bonus para múltiplos de 7', () => {
    expect(getStreakBonus(7)).toBe(50);
    expect(getStreakBonus(14)).toBe(50);
    expect(getStreakBonus(21)).toBe(50);
    expect(getStreakBonus(28)).toBe(50);
  });
});
