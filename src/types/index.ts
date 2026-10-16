export type LessonDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanationEng: string;
  explanationTamil: string;
}

export interface LessonSection {
  title: string;
  content: string;
  codeSnippet?: string;
  tanglishAnalogy?: string;
  plainEnglishSummary?: string;
}

export interface WorkedExample {
  title: string;
  scenario: string;
  steps: string[];
  codeOrCalculation?: string;
  expectedOutput?: string;
}

export interface PracticeTask {
  task: string;
  hint: string;
  solutionSnippet?: string;
}

export interface Lesson {
  id: string;
  zoneId: string;
  title: string;
  difficulty: LessonDifficulty;
  readTime: string;
  xpReward: number;
  summary: string;
  prerequisites: string[];
  learningObjectives: string[];
  sections: LessonSection[];
  workedExample?: WorkedExample;
  practiceTask?: PracticeTask;
  interactiveWidget?: 'token_simulator' | 'matrix_multiply' | 'sql_filter' | 'python_tester' | 'prompt_tester';
  quiz: QuizQuestion[];
  requiresCoding?: boolean;
}

export interface LearningZone {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  color: string;
  bgGlow: string;
  difficultyLevel: 'All Levels' | 'Beginner Friendly' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
}

export interface Mission {
  id: string;
  tier: number;
  tierLabel: string;
  title: string;
  description: string;
  objective: string;
  xpReward: number;
  badgeId: string;
  badgeTitle: string;
  badgeIcon: string;
  difficulty: LessonDifficulty;
  taskType: 'quiz' | 'code' | 'explore' | 'roadmap' | 'portfolio';
  relatedLessonId?: string;
  relatedZoneId?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  level: LessonDifficulty;
  estimatedTime: string;
  tools: string[];
  description: string;
  projectIdea: string;
}

export interface CareerTrack {
  id: string;
  role: string;
  tagline: string;
  salaryIndia: string;
  salaryGlobal: string;
  marketDemand: string;
  overview: string;
  coreSkills: SkillNode[];
  interviewTips: string[];
  dailyTasks: string[];
  suitableFor: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  language: 'en' | 'ta' | 'tanglish';
  timestamp: string;
  isLiveAI?: boolean;
  modelName?: string;
  isError?: boolean;
  retryable?: boolean;
  originalQuery?: string;
  quiz?: QuizQuestion;
  guidedStep?: {
    stepNumber: number;
    title: string;
    instructions: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  experienceLevel: 'complete_beginner' | 'some_tech' | 'intermediate' | 'advanced';
  ageGroup: 'student' | 'early_career' | 'professional' | 'lifelong_learner';
  primaryGoal: 'ai_literacy' | 'it_career' | 'work_automation' | 'build_apps';
  interests: string[];
  preferredLanguage: 'tanglish' | 'ta' | 'en';
  dailyTime: '15_min' | '30_min' | '60_min';
  recommendedTrackId: string;
  onboardingCompleted: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  roleTrack: string;
  description: string;
  skillsDemonstrated: string[];
  difficulty: LessonDifficulty;
  status: 'sample_starter' | 'completed_verified';
  liveUrl?: string;
  githubUrl?: string;
  completedAt?: string;
  reflectionNotes?: string;
}

export interface UserProgress {
  userProfile: UserProfile;
  xp: number;
  level: number;
  streakDays: number;
  completedLessons: string[];
  completedMissions: string[];
  unlockedBadges: string[];
  quizScores: Record<string, number>;
  checklistSkills: Record<string, boolean>;
  portfolioProjects: PortfolioProject[];
}
