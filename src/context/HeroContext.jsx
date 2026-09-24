import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { missionService } from '../services/missionService';
import { getHeroClassById } from '../data/heroClasses';
import {
  getRankForLevel,
  INITIAL_ACHIEVEMENTS,
  DEMO_ACHIEVEMENTS,
  INITIAL_SKILL_TREE,
  DEMO_SKILL_TREE
} from '../data/mockData';

const HeroContext = createContext();

const isDemoCodename = (name) =>
  ['novabyte', 'quantumquill', 'ciphersage'].includes(String(name || '').trim().toLowerCase());

export const HeroProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [heroClass, setHeroClass] = useState(null);
  const [dailyMission, setDailyMission] = useState(null);
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [skillTree, setSkillTree] = useState(INITIAL_SKILL_TREE);
  const [xpToasts, setXpToasts] = useState([]);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial profile
  useEffect(() => {
    const loadProfile = async () => {
      const data = await authService.getHeroProfile();
      const normalized = {
        ...data,
        avatarId: data?.avatarId || 'male-1',
        gender: data?.gender || 'male'
      };
      setProfile(normalized);
      setHeroClass(getHeroClassById(normalized.heroClassId));
      if (isDemoCodename(normalized?.superheroName)) {
        setAchievements(DEMO_ACHIEVEMENTS);
        setSkillTree(DEMO_SKILL_TREE);
      } else {
        setAchievements(INITIAL_ACHIEVEMENTS);
        setSkillTree(INITIAL_SKILL_TREE);
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  // Load today's daily mission
  useEffect(() => {
    const loadMission = async () => {
      try {
        const mission = await missionService.getDailyMission();
        if (mission && Array.isArray(mission.tasks) && mission.tasks.length > 0) {
          setDailyMission(mission);
        } else {
          setDailyMission(null);
        }
      } catch {
        setDailyMission(null);
      }
    };
    loadMission();
  }, []);

  // Update hero class whenever profile class ID changes
  useEffect(() => {
    if (profile?.heroClassId) {
      setHeroClass(getHeroClassById(profile.heroClassId));
    }
  }, [profile?.heroClassId]);

  // Add XP with level up check
  const addXp = (amount, reason = 'Action Completed') => {
    if (!profile) return;

    // Trigger floating XP notification
    const toastId = Date.now() + Math.random();
    setXpToasts((prev) => [...prev, { id: toastId, amount, reason }]);
    setTimeout(() => {
      setXpToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 2800);

    setProfile((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextThreshold = prev.nextLevelXp;
      let didLevelUp = false;

      while (newXp >= nextThreshold) {
        newLevel += 1;
        newXp -= nextThreshold;
        nextThreshold = Math.round(nextThreshold * 1.35);
        didLevelUp = true;
      }

      const updated = {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextThreshold,
        rank: getRankForLevel(newLevel).name,
        energyCores: prev.energyCores + (didLevelUp ? 2 : 0)
      };

      authService.saveHeroProfile(updated);

      if (didLevelUp) {
        setLevelUpModal({
          newLevel,
          rank: getRankForLevel(newLevel).name,
          bonusCores: 2
        });
      }

      return updated;
    });
  };

  // Update profile
  const updateProfile = async (updates) => {
    const updated = {
      ...profile,
      ...updates,
      avatarId: updates.avatarId || profile?.avatarId || 'male-1',
      gender: updates.gender || profile?.gender || 'male'
    };
    setProfile(updated);
    if (updates.heroClassId) {
      setHeroClass(getHeroClassById(updates.heroClassId));
    }
    const saved = await authService.saveHeroProfile(updated);
    if (saved) {
      setProfile((prev) => ({ ...prev, ...saved }));
    }
    return updated;
  };

  // Sync a profile returned by login/register into the context
  const applyProfile = (data) => {
    if (!data) return;
    const normalized = {
      ...data,
      avatarId: data.avatarId || 'male-1',
      gender: data.gender || 'male'
    };
    setProfile(normalized);
    if (normalized.heroClassId) {
      setHeroClass(getHeroClassById(normalized.heroClassId));
    }
    if (isDemoCodename(normalized?.superheroName)) {
      setAchievements(DEMO_ACHIEVEMENTS);
      setSkillTree(DEMO_SKILL_TREE);
    } else {
      setAchievements(INITIAL_ACHIEVEMENTS);
      setSkillTree(INITIAL_SKILL_TREE);
    }
  };

  // Toggle Daily Mission task (persists to the backend)
  const toggleMissionTask = (taskId) => {
    const prev = dailyMission;
    if (!prev) return;

    const updatedTasks = prev.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const allDone = updatedTasks.every((t) => t.completed);
    const newlyFinished = allDone && !prev.isCompleted;

    const updated = {
      ...prev,
      tasks: updatedTasks,
      isCompleted: allDone
    };

    setDailyMission(updated);
    missionService.updateDailyMission(updated);

    if (newlyFinished) {
      addXp(prev.rewardXp, 'Daily Mission Complete');
    }
  };

  // Clear Daily Mission (persists removal to backend)
  const clearDailyMission = async () => {
    setDailyMission(null);
    try {
      await missionService.deleteDailyMission();
    } catch {}
  };

  // Refresh Daily Mission from backend
  const refreshDailyMission = async () => {
    try {
      const mission = await missionService.getDailyMission();
      if (mission && Array.isArray(mission.tasks) && mission.tasks.length > 0) {
        setDailyMission(mission);
      } else {
        setDailyMission(null);
      }
    } catch {
      setDailyMission(null);
    }
  };

  // Unlock / Upgrade skill node
  const upgradeSkill = (skillId) => {
    setSkillTree((prev) =>
      prev.map((cat) => ({
        ...cat,
        skills: cat.skills.map((skill) => {
          if (skill.id === skillId) {
            const newLevel = Math.min(skill.level + 1, skill.maxLevel);
            addXp(100, `Skill Upgraded: ${skill.name}`);
            return {
              ...skill,
              level: newLevel,
              status: newLevel > 0 ? 'ACTIVE' : skill.status
            };
          }
          return skill;
        })
      }))
    );
  };

  return (
    <HeroContext.Provider
      value={{
        profile,
        heroClass,
        dailyMission,
        setDailyMission,
        clearDailyMission,
        refreshDailyMission,
        achievements,
        skillTree,
        xpToasts,
        levelUpModal,
        isLoading,
        addXp,
        updateProfile,
        applyProfile,
        toggleMissionTask,
        upgradeSkill,
        closeLevelUpModal: () => setLevelUpModal(null)
      }}
    >
      {children}
    </HeroContext.Provider>
  );
};

export const useHero = () => {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
};
