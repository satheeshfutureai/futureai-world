import { useState, useEffect, useCallback } from 'react';
import { UserProgress, UserProfile, PortfolioProject, LessonDifficulty } from '../types';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/portfolioData';

const STORAGE_KEY = 'futureai_world_progress_v2';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Future Innovator',
  experienceLevel: 'complete_beginner',
  ageGroup: 'student',
  primaryGoal: 'it_career',
  interests: ['ai_basics', 'prompting', 'python', 'analytics'],
  preferredLanguage: 'tanglish',
  dailyTime: '30_min',
  recommendedTrackId: 'data-analyst',
  onboardingCompleted: false
};

const INITIAL_PROGRESS: UserProgress = {
  userProfile: DEFAULT_PROFILE,
  xp: 150,
  level: 1,
  streakDays: 3,
  completedLessons: [],
  completedMissions: [],
  unlockedBadges: ['cyber-initiate'],
  quizScores: {},
  checklistSkills: {
    'da-excel': true,
    'da-sql': false,
    'ai-python-api': false
  },
  portfolioProjects: INITIAL_PORTFOLIO_PROJECTS
};

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  progressPercent: number;
  currentLevelXp: number;
  neededLevelXp: number;
}

export function calculateLevel(xp: number): LevelInfo {
  const levels = [
    { level: 1, title: 'Novice Explorer', minXp: 0, maxXp: 250 },
    { level: 2, title: 'Byte Apprentice', minXp: 250, maxXp: 600 },
    { level: 3, title: 'Syntax Knight', minXp: 600, maxXp: 1100 },
    { level: 4, title: 'Neural Pioneer', minXp: 1100, maxXp: 1800 },
    { level: 5, title: 'Master Architect', minXp: 1800, maxXp: 3000 }
  ];

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    if (xp >= l.minXp && (xp < l.maxXp || i === levels.length - 1)) {
      const currentLevelXp = xp - l.minXp;
      const neededLevelXp = l.maxXp - l.minXp;
      const progressPercent = Math.min(100, Math.round((currentLevelXp / neededLevelXp) * 100));
      return {
        level: l.level,
        title: l.title,
        minXp: l.minXp,
        maxXp: l.maxXp,
        progressPercent,
        currentLevelXp,
        neededLevelXp
      };
    }
  }

  return {
    level: 5,
    title: 'Master Architect',
    minXp: 1800,
    maxXp: 3000,
    progressPercent: 100,
    currentLevelXp: 1200,
    neededLevelXp: 1200
  };
}

export function useProgressStore() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure backwards compatibility with older stored shapes
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          userProfile: { ...DEFAULT_PROFILE, ...(parsed.userProfile || {}) },
          portfolioProjects: parsed.portfolioProjects || INITIAL_PORTFOLIO_PROJECTS
        };
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_PROGRESS;
  });

  const [notification, setNotification] = useState<{ message: string; xp?: number; badge?: string } | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | LessonDifficulty>('All');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Clear toast after 3.5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addXp = useCallback((amount: number, reason?: string) => {
    setProgress((prev) => {
      const newXp = prev.xp + amount;
      const levelInfo = calculateLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level: levelInfo.level
      };
    });
    setNotification({
      message: reason || `Earned +${amount} XP!`,
      xp: amount
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, xpReward: number, scorePercent: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      const newCompleted = [...prev.completedLessons, lessonId];
      const newXp = prev.xp + xpReward;
      const levelInfo = calculateLevel(newXp);
      const newBadges = [...prev.unlockedBadges];

      // Auto-unlock cyber initiate on first lesson
      if (!newBadges.includes('cyber-initiate')) {
        newBadges.push('cyber-initiate');
      }

      return {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        completedLessons: newCompleted,
        unlockedBadges: newBadges,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: scorePercent
        }
      };
    });

    setNotification({
      message: `Lesson Completed! (+${xpReward} XP)`,
      xp: xpReward
    });
  }, []);

  const completeMission = useCallback((missionId: string, xpReward: number, badgeId: string, badgeTitle: string) => {
    setProgress((prev) => {
      if (prev.completedMissions.includes(missionId)) {
        return prev;
      }
      const newMissions = [...prev.completedMissions, missionId];
      const newXp = prev.xp + xpReward;
      const levelInfo = calculateLevel(newXp);
      const newBadges = prev.unlockedBadges.includes(badgeId)
        ? prev.unlockedBadges
        : [...prev.unlockedBadges, badgeId];

      return {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        completedMissions: newMissions,
        unlockedBadges: newBadges
      };
    });

    setNotification({
      message: `Mission Accomplished: ${badgeTitle}!`,
      xp: xpReward,
      badge: badgeTitle
    });
  }, []);

  const unlockBadge = useCallback((badgeId: string, badgeTitle: string) => {
    setProgress((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId]
      };
    });
    setNotification({
      message: `Badge Unlocked: ${badgeTitle}!`,
      badge: badgeTitle
    });
  }, []);

  const toggleSkill = useCallback((skillId: string) => {
    setProgress((prev) => {
      const currentState = !!prev.checklistSkills[skillId];
      const nextSkills = {
        ...prev.checklistSkills,
        [skillId]: !currentState
      };
      // Check if user has checked 3 skills
      const checkedCount = Object.values(nextSkills).filter(Boolean).length;
      let newMissions = prev.completedMissions;
      let newBadges = prev.unlockedBadges;
      let addedXp = 0;

      if (checkedCount >= 3 && !prev.completedMissions.includes('mission-6')) {
        newMissions = [...prev.completedMissions, 'mission-6'];
        newBadges = newBadges.includes('future-architect') ? newBadges : [...newBadges, 'future-architect'];
        addedXp = 200;
      }

      const newXp = prev.xp + addedXp;
      const levelInfo = calculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        checklistSkills: nextSkills,
        completedMissions: newMissions,
        unlockedBadges: newBadges
      };
    });
  }, []);

  const updateProfile = useCallback((profileUpdates: Partial<UserProfile>) => {
    setProgress((prev) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profileUpdates
      }
    }));
    setNotification({ message: 'Personalized Learning Profile Updated!' });
  }, []);

  const addPortfolioProject = useCallback((project: PortfolioProject) => {
    setProgress((prev) => {
      const exists = prev.portfolioProjects.some((p) => p.id === project.id);
      let updatedList = exists
        ? prev.portfolioProjects.map((p) => (p.id === project.id ? project : p))
        : [project, ...prev.portfolioProjects];

      let newBadges = prev.unlockedBadges;
      let newMissions = prev.completedMissions;
      let addedXp = 0;

      if (project.status === 'completed_verified') {
        if (!newBadges.includes('portfolio-builder')) {
          newBadges = [...newBadges, 'portfolio-builder'];
        }
        if (!newMissions.includes('mission-portfolio')) {
          newMissions = [...newMissions, 'mission-portfolio'];
          addedXp = 175;
        }
      }

      const newXp = prev.xp + addedXp;
      const levelInfo = calculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        level: levelInfo.level,
        portfolioProjects: updatedList,
        unlockedBadges: newBadges,
        completedMissions: newMissions
      };
    });

    setNotification({
      message: 'Project Verified & Added to Skill Portfolio! (+175 XP)',
      xp: 175,
      badge: 'Portfolio Pioneer'
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
    setNotification({ message: 'Progress has been reset to default state.' });
  }, []);

  const levelInfo = calculateLevel(progress.xp);

  return {
    progress,
    levelInfo,
    notification,
    difficultyFilter,
    setDifficultyFilter,
    addXp,
    completeLesson,
    completeMission,
    unlockBadge,
    toggleSkill,
    updateProfile,
    addPortfolioProject,
    resetProgress
  };
}
