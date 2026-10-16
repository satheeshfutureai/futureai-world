export interface OnboardingChoice {
  id: string;
  label: string;
  description: string;
}

export const EXPERIENCE_LEVELS: OnboardingChoice[] = [
  {
    id: 'complete_beginner',
    label: 'Complete Beginner / Non-Technical',
    description: 'No coding or math background. Want clear, jargon-free explanations.'
  },
  {
    id: 'some_tech',
    label: 'Tech Curious / Basic Knowledge',
    description: 'Know basic spreadsheets or computer concepts; new to AI and programming.'
  },
  {
    id: 'intermediate',
    label: 'Intermediate / STEM Student',
    description: 'Familiar with basic logic, math, or introductory coding; ready to build.'
  },
  {
    id: 'advanced',
    label: 'Working Professional / Developer',
    description: 'Already working in IT or engineering; upskilling in generative AI & LLMs.'
  }
];

export const AGE_GROUPS: OnboardingChoice[] = [
  {
    id: 'student',
    label: 'College or University Student',
    description: 'Preparing for campus placements, IT entry roles, and tech internships.'
  },
  {
    id: 'early_career',
    label: 'Career Switcher / Non-IT Graduate',
    description: 'Transitioning from non-tech, commerce, arts, or support roles into tech.'
  },
  {
    id: 'professional',
    label: 'Working Professional (Upskilling)',
    description: 'Integrating AI tools into existing management, marketing, or tech jobs.'
  },
  {
    id: 'lifelong_learner',
    label: 'Lifelong Learner / All Ages',
    description: 'Curious about how AI is reshaping the world, culture, and society.'
  }
];

export const PRIMARY_GOALS: OnboardingChoice[] = [
  {
    id: 'it_career',
    label: 'Land an Entry-Level IT / AI Job',
    description: 'Prepare an industry-ready portfolio, learn required skills, and clear interviews.'
  },
  {
    id: 'ai_literacy',
    label: 'Understand AI & Use Everyday Tools',
    description: 'Gain practical fluency in ChatGPT, Gemini, Claude, and automation workflows.'
  },
  {
    id: 'work_automation',
    label: 'Automate Tasks & Boost Productivity',
    description: 'Eliminate repetitive manual work with smart prompts, Python, and spreadsheets.'
  },
  {
    id: 'build_apps',
    label: 'Build Real AI Applications & Prototypes',
    description: 'Connect APIs, vector databases, and modern frontends into live apps.'
  }
];

export const INTEREST_TOPICS: { id: string; label: string }[] = [
  { id: 'ai_basics', label: 'AI Literacy & Real-World Impact' },
  { id: 'prompting', label: 'Prompt Engineering & Everyday Tools' },
  { id: 'responsible_ai', label: 'Ethical AI, Safety & Bias' },
  { id: 'python', label: 'Python Programming from Scratch' },
  { id: 'analytics', label: 'Data Analytics, Excel & SQL' },
  { id: 'web_automation', label: 'Automation & Web Foundations' },
  { id: 'modern_ai', label: 'LLMs, Vector Search & AI Agents' }
];

export const DAILY_TIME_COMMITMENTS: OnboardingChoice[] = [
  { id: '15_min', label: '15 Mins / Day', description: 'Bite-sized micro-lessons on the go.' },
  { id: '30_min', label: '30 Mins / Day (Recommended)', description: 'Balanced pace with hands-on practice.' },
  { id: '60_min', label: '1 Hour / Day', description: 'Intensive immersion and rapid project builds.' }
];

export function recommendTrack(
  experience: string,
  goal: string,
  interests: string[]
): { trackId: string; trackName: string; rationale: string } {
  if (experience === 'complete_beginner' && goal === 'ai_literacy') {
    return {
      trackId: 'ai-product-specialist',
      trackName: 'AI Literacy & Practical Productivity',
      rationale: 'Focuses on conceptual clarity, everyday tools, and zero-code prompt engineering without assuming coding background.'
    };
  }

  if (interests.includes('analytics') || goal === 'work_automation') {
    return {
      trackId: 'data-analyst',
      trackName: 'Data Analyst & Business Intelligence',
      rationale: 'Perfect starting ground using spreadsheets, SQL queries, and Python data cleaning to solve business challenges.'
    };
  }

  if (experience === 'intermediate' || experience === 'advanced' || interests.includes('modern_ai')) {
    return {
      trackId: 'ai-engineer',
      trackName: 'AI Engineer & Application Architect',
      rationale: 'Focuses on integrating foundational models, REST APIs, and vector databases into live applications.'
    };
  }

  return {
    trackId: 'software-developer',
    trackName: 'Full-Stack Software & AI Developer',
    rationale: 'Builds versatile end-to-end coding fundamentals with Python, web APIs, and applied AI tools.'
  };
}
