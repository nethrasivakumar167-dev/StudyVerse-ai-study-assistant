/**
 * Centralized XP / level / rank calculations.
 * Mirrors the frontend HeroContext curve so both sides always agree.
 */

// Level-up threshold grows by 35% each level (same formula as HeroContext.addXp)
export const STARTING_NEXT_LEVEL_XP = 500;
export const nextThreshold = (currentThreshold) => Math.round(currentThreshold * 1.35);

export const LEVEL_RANKS = [
  { minLevel: 1, name: 'ROOKIE' },
  { minLevel: 5, name: 'RECRUIT' },
  { minLevel: 10, name: 'HERO' },
  { minLevel: 20, name: 'SUPERHERO' },
  { minLevel: 30, name: 'LEGEND' }
];

export const getRankForLevel = (level = 1) => {
  let matched = LEVEL_RANKS[0];
  for (const rank of LEVEL_RANKS) {
    if (level >= rank.minLevel) matched = rank;
  }
  return matched.name;
};

/** Applies XP to a plain stats object (used whenever the server awards XP). */
export const applyXp = (stats, amount) => {
  stats.xp += amount;
  let leveledUp = false;
  while (stats.xp >= stats.nextLevelXp) {
    stats.xp -= stats.nextLevelXp;
    stats.level += 1;
    stats.nextLevelXp = nextThreshold(stats.nextLevelXp);
    stats.energyCores += 2;
    leveledUp = true;
  }
  stats.rank = getRankForLevel(stats.level);
  return leveledUp;
};

/** Victory-screen rank from quiz accuracy (same thresholds as the frontend). */
export const rankForAccuracy = (accuracy) => {
  if (accuracy >= 90) return 'LEGENDARY';
  if (accuracy >= 75) return 'SUPERHERO';
  if (accuracy >= 50) return 'HERO';
  return 'RECRUIT';
};

/** Shape returned to the frontend for every profile response. */
export const formatProfile = (user) => ({
  id: user._id.toString(),
  name: user.name,
  superheroName: user.superheroName,
  heroClassId: user.heroClassId,
  avatarId: user.avatarId || 'male-1',
  gender: user.gender || 'male',
  level: user.level,
  rank: user.rank || getRankForLevel(user.level),
  xp: user.xp,
  nextLevelXp: user.nextLevelXp,
  streakDays: user.streakDays,
  missionsCompleted: user.missionsCompleted,
  quizAccuracy: user.quizAccuracy,
  energyCores: user.energyCores,
  joinedDate: user.joinedDate
});
