import { LEARNING_ZONES } from '../data/learningContent';
import { MISSIONS } from '../data/missions';
import { CAREER_TRACKS } from '../data/careers';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/portfolioData';

export interface InAppSearchResult {
  id: string;
  title: string;
  category: 'Lesson' | 'Interactive Tool' | 'Mission Quest' | 'Career Roadmap' | 'Project Blueprint';
  description: string;
  tags: string[];
  targetTab: 'world' | 'missions' | 'assistant' | 'tutor' | 'careers' | 'portfolio' | 'progress';
  actionType: 'open_lesson' | 'open_widget' | 'open_mission' | 'open_career' | 'open_blueprint' | 'switch_tab';
  actionPayload?: string; // lessonId, widgetName, missionId, careerId, blueprintId
  badgeText?: string;
  badgeColor?: string;
}

// Master index of built-in interactive tools & sandboxes
const INTERACTIVE_TOOLS: InAppSearchResult[] = [
  {
    id: 'tool-python-sandbox',
    title: 'Interactive Python Sandbox (Pyodide Runtime)',
    category: 'Interactive Tool',
    description: 'Execute Python 3 in-browser with Pyodide and pandas. Run custom scripts, data analysis, algorithms, and tests with live output.',
    tags: ['python', 'pyodide', 'code editor', 'pandas', 'script', 'data filtering', 'sandbox', 'programming', 'debugging', 'loop', 'for loop', 'while loop', 'functions'],
    targetTab: 'world',
    actionType: 'open_widget',
    actionPayload: 'python_editor',
    badgeText: 'Live Python 3',
    badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40'
  },
  {
    id: 'tool-sql-playground',
    title: 'Interactive SQL Database & Custom Table Playground',
    category: 'Interactive Tool',
    description: 'Full-featured SQL query playground supporting CREATE TABLE, INSERT INTO, SELECT, WHERE, GROUP BY, HAVING, and JOIN.',
    tags: ['sql', 'database', 'queries', 'create table', 'insert into', 'group by', 'relational', 'employees', 'students', 'select', 'where', 'having'],
    targetTab: 'world',
    actionType: 'open_widget',
    actionPayload: 'sql_filter',
    badgeText: 'SQL Engine',
    badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/40'
  },
  {
    id: 'tool-matrix-visualizer',
    title: 'Matrix Multiplication & Neural Activation Visualizer',
    category: 'Interactive Tool',
    description: 'Step-by-step interactive 2D matrix dot product visualizer showing how neural layers transform input vectors into hidden activations.',
    tags: ['matrix', 'linear algebra', 'dot product', 'neural network', 'maths', 'deep learning', 'visualizer'],
    targetTab: 'world',
    actionType: 'open_widget',
    actionPayload: 'matrix_multiply',
    badgeText: 'Math Visualizer',
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-950/40'
  },
  {
    id: 'tool-token-simulator',
    title: 'BPE Tokenizer & Token Counter Simulator',
    category: 'Interactive Tool',
    description: 'Visualize how Large Language Models split English, code, and Indian languages into byte-pair tokens and estimate context window consumption.',
    tags: ['token', 'tokenizer', 'llm', 'genai', 'bpe', 'prompt engineering', 'subwords', 'context window'],
    targetTab: 'world',
    actionType: 'open_widget',
    actionPayload: 'token_simulator',
    badgeText: 'LLM Tool',
    badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-950/40'
  },
  {
    id: 'tool-ai-assistant',
    title: 'AI Multi-Subject Learning Assistant',
    category: 'Interactive Tool',
    description: 'Interactive AI tutor for Python, SQL, Excel, Java, HTML/CSS, Data Analytics, Statistics, and Machine Learning with code examples and debugging.',
    tags: ['assistant', 'ai tutor', 'python', 'sql', 'excel', 'java', 'html', 'css', 'data analytics', 'statistics', 'machine learning', 'debugging'],
    targetTab: 'assistant',
    actionType: 'switch_tab',
    actionPayload: 'assistant',
    badgeText: 'Multi-Subject AI',
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-950/40'
  },
  {
    id: 'tool-bilingual-tutor',
    title: 'Aura Bilingual AI Tutor (Tanglish & Tamil & English)',
    category: 'Interactive Tool',
    description: 'Conversational mentor explaining tech and AI concepts using relatable everyday analogies, Tamil, Tanglish, and English.',
    tags: ['tutor', 'aura', 'tanglish', 'tamil', 'bilingual', 'analogies', 'mentor', 'chat'],
    targetTab: 'tutor',
    actionType: 'switch_tab',
    actionPayload: 'tutor',
    badgeText: 'Bilingual AI',
    badgeColor: 'border-pink-500/30 text-pink-300 bg-pink-950/40'
  }
];

export function searchInAppContent(rawQuery: string): InAppSearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const terms = query.split(/\s+/).filter(t => t.length > 0);
  const results: InAppSearchResult[] = [];

  // 1. Search Interactive Tools
  for (const tool of INTERACTIVE_TOOLS) {
    if (matchesQuery(tool.title, tool.description, tool.tags, terms)) {
      results.push(tool);
    }
  }

  // 2. Search Lessons in LEARNING_ZONES
  for (const zone of LEARNING_ZONES) {
    for (const lesson of zone.lessons) {
      const lessonTags = [
        zone.title.toLowerCase(),
        lesson.difficulty.toLowerCase(),
        ...(lesson.prerequisites || []).map(p => p.toLowerCase()),
        ...(lesson.learningObjectives || []).map(o => o.toLowerCase()),
        ...(lesson.sections || []).map(s => s.title.toLowerCase())
      ];

      if (matchesQuery(lesson.title, `${zone.title} - ${lesson.summary}`, lessonTags, terms)) {
        results.push({
          id: `lesson-${lesson.id}`,
          title: lesson.title,
          category: 'Lesson',
          description: `${zone.title}: ${lesson.summary}`,
          tags: lessonTags,
          targetTab: 'world',
          actionType: 'open_lesson',
          actionPayload: lesson.id,
          badgeText: `${lesson.difficulty} (${lesson.readTime})`,
          badgeColor: 'border-blue-500/30 text-blue-300 bg-blue-950/40'
        });
      }
    }
  }

  // 3. Search Missions
  for (const mission of MISSIONS) {
    const missionTags = [
      mission.tierLabel.toLowerCase(),
      mission.badgeTitle.toLowerCase(),
      mission.difficulty.toLowerCase(),
      mission.taskType.toLowerCase(),
      mission.objective.toLowerCase()
    ];

    if (matchesQuery(mission.title, `${mission.description} ${mission.objective}`, missionTags, terms)) {
      results.push({
        id: `mission-${mission.id}`,
        title: mission.title,
        category: 'Mission Quest',
        description: `Quest (${mission.tierLabel}): ${mission.description}`,
        tags: missionTags,
        targetTab: 'missions',
        actionType: 'open_mission',
        actionPayload: mission.id,
        badgeText: `+${mission.xpReward} XP`,
        badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-950/40'
      });
    }
  }

  // 4. Search Career Tracks
  for (const career of CAREER_TRACKS) {
    const careerTags = [
      career.role.toLowerCase(),
      career.marketDemand.toLowerCase(),
      ...career.coreSkills.map(s => s.name.toLowerCase()),
      ...career.coreSkills.flatMap(s => s.tools.map(t => t.toLowerCase()))
    ];

    if (matchesQuery(career.role, `${career.tagline} ${career.overview}`, careerTags, terms)) {
      results.push({
        id: `career-${career.id}`,
        title: `${career.role} Career Roadmap`,
        category: 'Career Roadmap',
        description: `${career.tagline} Salary benchmark: ${career.salaryIndia}.`,
        tags: careerTags,
        targetTab: 'careers',
        actionType: 'open_career',
        actionPayload: career.id,
        badgeText: 'Career Path',
        badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-950/40'
      });
    }
  }

  // 5. Search Project Blueprints
  for (const project of INITIAL_PORTFOLIO_PROJECTS) {
    const projTags = [
      project.category.toLowerCase(),
      project.roleTrack.toLowerCase(),
      ...project.skillsDemonstrated.map(s => s.toLowerCase())
    ];

    if (matchesQuery(project.title, project.description, projTags, terms)) {
      results.push({
        id: `blueprint-${project.id}`,
        title: `${project.title} (Blueprint)`,
        category: 'Project Blueprint',
        description: `Track: ${project.roleTrack} | Skills: ${project.skillsDemonstrated.join(', ')}. ${project.description}`,
        tags: projTags,
        targetTab: 'portfolio',
        actionType: 'open_blueprint',
        actionPayload: project.id,
        badgeText: project.difficulty,
        badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40'
      });
    }
  }

  // Rank results by relevance: exact query matches first, then multi-term score
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(query) ? 10 : 0;
    const bTitleMatch = b.title.toLowerCase().includes(query) ? 10 : 0;
    return bTitleMatch - aTitleMatch;
  });

  return results.slice(0, 15);
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'in', 'at', 'of', 'on', 'with', 'and', 'or', 'to',
  'from', 'by', 'show', 'explain', 'me', 'what', 'how', 'does', 'do', 'can',
  'about', 'simple', 'please', 'give', 'using', 'tell'
]);

function matchesQuery(title: string, description: string, tags: string[], terms: string[]): boolean {
  const combined = `${title.toLowerCase()} ${description.toLowerCase()} ${tags.join(' ')}`;
  
  // Filter out stop words unless all words are stop words
  const meaningfulTerms = terms.filter(t => !STOP_WORDS.has(t) && t.length >= 2);
  const termsToCheck = meaningfulTerms.length > 0 ? meaningfulTerms : terms.filter(t => t.length >= 2);
  
  if (termsToCheck.length === 0) return false;

  // If query has multiple terms like "python loop" or "sql group", require high relevance
  const matchCount = termsToCheck.filter(term => combined.includes(term)).length;
  
  // If there are multiple meaningful terms, require at least 1 strong match (or >= half of terms if > 2)
  if (termsToCheck.length >= 3) {
    return matchCount >= 2;
  }
  
  return matchCount > 0;
}
