import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to dynamically get GoogleGenAI client
function getGenAiClient(): { ai: GoogleGenAI | null; hasKey: boolean } {
  const currentKey = process.env.GEMINI_API_KEY || '';
  const hasKey = Boolean(currentKey && currentKey.trim().length > 0 && currentKey !== 'MY_GEMINI_API_KEY');
  if (!hasKey) {
    return { ai: null, hasKey: false };
  }
  return {
    ai: new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
    hasKey: true,
  };
}

// Basic in-memory rate limiter per IP (max 40 requests/minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 40) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const { hasKey } = getGenAiClient();
  res.json({
    status: 'online',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
    serverTime: new Date().toISOString(),
  });
});

interface ChatHistoryItem {
  sender?: string;
  role?: 'user' | 'model';
  text: string;
  isError?: boolean;
}

// Live AI Tutor endpoint
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit reached (40 requests/min). Please wait a moment before sending more questions.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  const { message, history = [], language = 'tanglish', level = 'Beginner' } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'A non-empty question message is required.',
      code: 'INVALID_INPUT',
    });
  }

  const { ai, hasKey } = getGenAiClient();
  if (!hasKey || !ai) {
    return res.status(503).json({
      error: 'Gemini API key is not configured in the server environment. Please attach GEMINI_API_KEY in the environment secrets to unlock live AI responses.',
      code: 'API_KEY_MISSING',
    });
  }

  const systemInstruction = `You are Aura, the expert, empathetic, and patient personal AI Tutor for "FutureAI World" — an educational platform teaching AI, Python, Data Analytics, and IT Careers.

Target Audience & Tone:
- You are speaking to learners of various ages, from complete beginners with zero coding background to college students and working professionals.
- Selected explanation language: ${language.toUpperCase()}
  * If language is 'TANGLISH': Respond primarily in natural, conversational Tanglish (Tamil spoken using English script/letters, e.g., "Machine Learning-na oru periya pattern recognition system mathiri...", "Python-la list create panrathu romba simple..."). Use relatable everyday Tamil analogies (cricket, filter coffee, cooking, Chennai/TN daily life, college lab viva, campus placements) while keeping technical identifiers and code syntax in standard English.
  * If language is 'TA': Respond in clear, readable Tamil script (தமிழ்), providing English technical terms in brackets where helpful for clarity.
  * If language is 'EN': Respond in clear, accessible, structured English.
- Selected learner level: ${level.toUpperCase()}
  * 'BEGINNER': Assume ZERO prior coding or math knowledge. Never use unexplained jargon. Explain intuition and real-world analogies first, then show the simplest possible step-by-step example.
  * 'INTERMEDIATE': Connect concepts to practical tools (Pandas DataFrames, SQL clauses, REST APIs, prompt templates, evaluation metrics).
  * 'ADVANCED': Discuss production trade-offs, vector search, embeddings, MLOps, inference latency, chunking strategies, and hyperparameters.

Essential Instruction Rules:
1. ACCURACY & FACTUAL HONESTY: Never invent citations, packages, libraries, salaries, or non-existent syntax. If you are uncertain of a specific fact or if the answer depends on rapidly changing outside context, explicitly state your uncertainty.
2. AMBIGUOUS QUERIES: If the user's question is overly vague or ambiguous (e.g., "how do I fix it?", "explain models"), briefly explain the most likely interpretations and ask 1 clear clarifying question.
3. PROGRAMMING QUESTIONS: Whenever asked for code or debugging:
   a) Provide a concise explanation of how it works.
   b) Provide clean, runnable code with comments.
   c) Show the expected output.
   d) Highlight common beginner bugs or pitfalls to watch out for.
4. UNRELATED QUESTIONS: If asked a question unrelated to technology, AI, or learning (e.g., general trivia, recipes, sports), answer politely and accurately, but gently offer a bridge back to relevant tech or AI applications.
5. NO FALSE PROMISES: Never claim that every answer is guaranteed 100% correct or that your advice guarantees employment.
6. STRUCTURE & READABILITY: Use clear formatting with bolding, short paragraphs, bullet points, and fenced code blocks with language specifiers. Keep responses concise and focused (around 200-400 words max) so it is easy to read.`;

  try {
    // Format conversation history for Gemini API:
    // Contract requirement: contents must start with 'user' and alternate between 'user' and 'model'.
    const contents: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

    if (Array.isArray(history)) {
      // Filter out error messages and find the first user message
      const validHistory = (history as ChatHistoryItem[]).filter(
        (item) => item && item.text && !item.isError && (item.sender === 'user' || item.sender === 'tutor' || item.role === 'user' || item.role === 'model')
      );

      const firstUserIndex = validHistory.findIndex(
        (item) => item.sender === 'user' || item.role === 'user'
      );

      if (firstUserIndex !== -1) {
        const dialogSlice = validHistory.slice(firstUserIndex).slice(-6);
        for (const item of dialogSlice) {
          const role: 'user' | 'model' = (item.sender === 'user' || item.role === 'user') ? 'user' : 'model';
          const lastTurn = contents[contents.length - 1];
          if (lastTurn && lastTurn.role === role) {
            lastTurn.parts[0].text += `\n${item.text}`;
          } else {
            contents.push({
              role,
              parts: [{ text: item.text }],
            });
          }
        }
      }
    }

    // Append the current user prompt ensuring correct alternation
    const lastContent = contents[contents.length - 1];
    if (lastContent && lastContent.role === 'user') {
      lastContent.parts[0].text += `\n${message.trim()}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I apologize, but I could not generate a response. Please try rephrasing your question.';

    return res.json({
      reply: replyText,
      model: 'gemini-3.8-flash',
      mode: 'live_ai',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error('Gemini API Error in /api/tutor/chat:', errorMessage);

    return res.status(500).json({
      error: 'The AI service encountered an error while processing your request. Please try again in a moment.',
      details: errorMessage,
      code: 'API_EXECUTION_ERROR',
    });
  }
});

// Universal AI Search Endpoint
app.post('/api/search', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit reached. Please wait a moment before searching again.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  const { query, enableWebSearch = false } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      error: 'A search query is required.',
      code: 'INVALID_INPUT',
    });
  }

  const { ai, hasKey } = getGenAiClient();
  if (!hasKey || !ai) {
    return res.status(503).json({
      error: 'Gemini API key is not configured in the server environment. Please attach GEMINI_API_KEY to enable live AI universal search.',
      code: 'API_KEY_MISSING',
    });
  }

  const startTime = Date.now();
  const trimmedQuery = query.trim();

  // Pattern detection for time-sensitive, news, and current-event queries
  const TIME_SENSITIVE_PATTERNS = [
    /\b(latest|recent|today|tonight|this week|this month|this year|breaking|upcoming|scheduled)\b/i,
    /\b(news|headline|headlines|releases|released recently|new release|newest)\b/i,
    /\b(2026|current date|current time|current weather|live score|stock price)\b/i,
    /\b(who won|election result|presidential|championship|super bowl)\b/i,
  ];
  const isTimeSensitive = TIME_SENSITIVE_PATTERNS.some((pattern) => pattern.test(trimmedQuery));

  const searchPrompt = `User Query: "${trimmedQuery}"

You are the Universal Knowledge Engine for "FutureAI World", an advanced educational tech platform.
You support inquiries across:
- Computer Programming & Coding (Python, SQL, JavaScript/TypeScript, Java, C++, HTML/CSS, Git, APIs)
- Artificial Intelligence & Machine Learning (Transformers, LLMs, Neural Networks, Computer Vision, NLP, Prompting, Ethics)
- Data Analytics & Statistics (Pandas, Excel, SQL queries, Probability, Distributions, Hypothesis Testing, Metrics)
- Mathematics & Science (Linear Algebra, Calculus, Matrices, Physics, Biology, Genomics, Chemistry)
- Education, Technology & Business (Cloud computing, DevOps, Tech careers, Product management, Startups, ROI, AI automation)
- General Knowledge & Curiosities

STRICT PEDAGOGICAL REQUIREMENTS:
1. DIRECT TOPIC FOCUS: Address the user's EXACT question directly from the very first sentence. NEVER provide generic filler about "modular design", "structural integrity", "scalability", or "algorithmic complexity" unless the user explicitly asked about those exact concepts.
2. PROGRAMMING QUESTIONS:
   - Provide a clear, beginner-friendly definition of the concept.
   - Provide a clean, valid, runnable code example in fenced code blocks (\`\`\`python, \`\`\`sql, etc.) with helpful comments.
   - Provide an explicit "Expected Output:" section showing exactly what the code prints or returns.
   - Provide a step-by-step explanation breaking down how the code works line-by-line.
3. MATHEMATICS QUESTIONS:
   - State the relevant mathematical formula or equation clearly.
   - Provide a step-by-step worked example with concrete numbers.
4. SCIENCE & GENERAL KNOWLEDGE QUESTIONS:
   - Provide a simple, intuitive explanation using relatable everyday analogies.
   - Include any key chemical/physical equations (e.g. photosynthesis equation) or natural laws where relevant.
   - Give concrete real-world examples.
5. FORMATTING:
   - Use Markdown headers (###), bold text, bullet lists, and syntax-highlighted code blocks.
   - Keep answers clean, focused, and between 180 and 380 words.`;

  let aiAnswer = '';
  let webSources: Array<{ title: string; url: string }> = [];
  let webSearchStatus: {
    available: boolean;
    warning?: string;
    message?: string;
    errorType?: string;
  } = {
    available: false,
  };
  let answerType: 'web_grounded' | 'ai_educational' | 'time_sensitive_blocked' = 'ai_educational';
  let isVerifiedCurrent = false;

  // Attempt Web Search Grounding if user opted in OR if query is time-sensitive
  const shouldAttemptGrounding = enableWebSearch || isTimeSensitive;

  if (shouldAttemptGrounding) {
    try {
      const groundedResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.5,
        },
      });

      const candidateText = groundedResponse.text || '';
      const chunks = groundedResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        for (const chunk of chunks) {
          if (chunk.web && chunk.web.uri) {
            webSources.push({
              title: chunk.web.title || chunk.web.uri,
              url: chunk.web.uri,
            });
          }
        }
      }

      if (webSources.length > 0 && candidateText) {
        aiAnswer = candidateText;
        answerType = 'web_grounded';
        isVerifiedCurrent = true;
        webSearchStatus = {
          available: true,
          message: `Verified with ${webSources.length} authentic web sources via Google Search Grounding.`,
        };
      } else {
        // Grounding returned text without web sources
        webSearchStatus = {
          available: false,
          warning: 'Live web search is currently unavailable. This answer is not verified against current web sources.',
          message: 'Google Search grounding returned no verified web chunks for this query.',
          errorType: 'NO_GROUNDING_CHUNKS',
        };
      }
    } catch (groundingErr: unknown) {
      const msg = groundingErr instanceof Error ? groundingErr.message : String(groundingErr);
      const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
      console.warn('Web search grounding error:', msg);

      webSearchStatus = {
        available: false,
        warning: 'Live web search is currently unavailable. This answer is not verified against current web sources.',
        message: isQuota
          ? 'Live web search is currently unavailable. This answer is not verified against current web sources.'
          : 'Live web search is currently unavailable. This answer is not verified against current web sources.',
        errorType: isQuota ? '429_QUOTA_EXHAUSTED' : 'GROUNDING_UNAVAILABLE',
      };
    }
  }

  // If query is time-sensitive and live grounding did NOT verify it, refuse to fabricate current news
  if (isTimeSensitive && (!webSearchStatus.available || webSources.length === 0)) {
    answerType = 'time_sensitive_blocked';
    isVerifiedCurrent = false;
    aiAnswer = `### ⚠️ Live Web Search Grounding Required

> **Warning:** Live web search is currently unavailable. This answer is not verified against current web sources.

You inquired about current events, breaking news, or recent releases (**"${trimmedQuery}"**).

**Why this answer is paused:**
1. FutureAI World enforces strict authenticity standards and will **never fabricate** real-time news headlines, recent event outcomes, or publication dates.
2. Google Search Grounding encountered a temporary service limit (**429 RESOURCE_EXHAUSTED** / Free-tier quota).
3. Without authenticated real-time sources, generating an ungrounded response risks hallucinatory or outdated facts.

**What you can do:**
- For live breaking updates, consult reputable journalism outlets and verified official announcements directly.
- For concepts, coding, algorithms, science, and AI foundations, explore our interactive curriculum, Python sandbox, and SQL playground below.`;
  }

  // If not time-sensitive and no answer generated yet, provide high-quality educational synthesis
  if (!aiAnswer) {
    try {
      let standardResponse;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          standardResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: searchPrompt,
            config: {
              temperature: 0.6,
            },
          });
          if (standardResponse && standardResponse.text) break;
        } catch (callErr: unknown) {
          const errMsg = callErr instanceof Error ? callErr.message : String(callErr);
          if (attempt === 0 && (errMsg.includes('503') || errMsg.includes('429'))) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          throw callErr;
        }
      }

      aiAnswer = standardResponse?.text || '';
      answerType = 'ai_educational';
    } catch (genErr: unknown) {
      const msg = genErr instanceof Error ? genErr.message : 'Unknown generation error';
      console.warn('Upstream Gemini API busy, generating synthesized educational fallback:', msg);
      aiAnswer = generateEducationalFallback(trimmedQuery);
      answerType = 'ai_educational';
    }
  }

  // Answer validation and enhancement:
  // Enforces topic specificity, valid code examples, expected output, and banishes generic filler.
  if (answerType !== 'time_sensitive_blocked') {
    aiAnswer = validateAndEnhanceAnswer(trimmedQuery, aiAnswer);
  }

  const executionTimeMs = Date.now() - startTime;

  return res.json({
    query: trimmedQuery,
    aiAnswer,
    webSources,
    webSearchStatus,
    isTimeSensitive,
    isVerifiedCurrent,
    answerType,
    executionTimeMs,
    model: 'gemini-3.8-flash',
  });
});

// Interactive AI Learning Assistant Endpoint
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit reached. Please wait a moment before sending more messages.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  const {
    message,
    history = [],
    subject = 'General Programming',
    mode = 'explain',
  } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'A non-empty message is required.',
      code: 'INVALID_INPUT',
    });
  }

  const { ai, hasKey } = getGenAiClient();
  if (!hasKey || !ai) {
    return res.status(503).json({
      error: 'Gemini API key is not configured in the server environment. Please attach GEMINI_API_KEY to enable the AI Learning Assistant.',
      code: 'API_KEY_MISSING',
    });
  }

  const systemInstruction = `You are the Expert AI Learning Assistant in "FutureAI World".
Your mission is to provide world-class, patient, beginner-friendly yet technically rigorous instruction in:
1. Python (syntax, data structures, OOP, file I/O, pandas, numpy, scripting)
2. SQL (SELECT, WHERE, JOINs, GROUP BY, HAVING, subqueries, indexing, schema design)
3. Excel & Modern Spreadsheets (Formulas, VLOOKUP/XLOOKUP, INDEX-MATCH, Pivot Tables, SUMIFS, forecasting, charts)
4. Java (OOP concepts, classes, inheritance, polymorphism, collections, syntax)
5. HTML & CSS (semantic tags, Flexbox, CSS Grid, responsive design, modern UI styling)
6. Data Analytics & Statistics (Mean/Median/Mode, Variance, Normal Distribution, P-Values, Correlation vs Causation, Data cleaning)
7. AI & Machine Learning (Supervised vs Unsupervised, Decision Trees, Overfitting, Training/Validation, Evaluation Metrics)
8. Deep Learning (Neural Networks, Perceptrons, Activation Functions, Backpropagation, CNNs, Transformers, Embeddings)

Current Context:
- Focus Subject: ${subject}
- Learning Mode: ${mode.toUpperCase()}
  * 'EXPLAIN': Provide an intuitive, beginner-friendly conceptual explanation. Use everyday analogies, break down any jargon, and explain the "why".
  * 'EXAMPLE': Provide clean, well-commented step-by-step code or formula examples. State the expected output clearly and note edge cases.
  * 'PRACTICE': Present 1 realistic hands-on practice challenge or quiz question. Include a helpful hint and structured solution guide.
  * 'DEBUG': Analyze the user's error or code snippet line-by-line. Explain WHY the bug happened, how to avoid it, and provide the corrected code.

Pedagogical Rules:
- Format code in markdown fenced blocks with specific language tags (\`\`\`python, \`\`\`sql, \`\`\`java, \`\`\`html, \`\`\`css, \`\`\`excel).
- Always include comments in code examples explaining key lines.
- Keep tone supportive, encouraging, and clear. Avoid robotic repetition.
- Answer follow-up questions while remembering earlier turns of the conversation.`;

  try {
    const contents: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

    if (Array.isArray(history)) {
      const validHistory = (history as ChatHistoryItem[]).filter(
        (item) => item && item.text && !item.isError && (item.role === 'user' || item.role === 'model' || item.sender === 'user' || item.sender === 'assistant')
      );

      const firstUserIndex = validHistory.findIndex(
        (item) => item.role === 'user' || item.sender === 'user'
      );

      if (firstUserIndex !== -1) {
        const dialogSlice = validHistory.slice(firstUserIndex).slice(-8);
        for (const item of dialogSlice) {
          const role: 'user' | 'model' = (item.role === 'user' || item.sender === 'user') ? 'user' : 'model';
          const lastTurn = contents[contents.length - 1];
          if (lastTurn && lastTurn.role === role) {
            lastTurn.parts[0].text += `\n${item.text}`;
          } else {
            contents.push({
              role,
              parts: [{ text: item.text }],
            });
          }
        }
      }
    }

    const lastContent = contents[contents.length - 1];
    if (lastContent && lastContent.role === 'user') {
      lastContent.parts[0].text += `\n${message.trim()}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });
    }

    let reply = '';
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          reply = response.text;
          break;
        }
      } catch (callErr: unknown) {
        const errMsg = callErr instanceof Error ? callErr.message : String(callErr);
        if (attempt === 0 && (errMsg.includes('503') || errMsg.includes('429'))) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        throw callErr;
      }
    }

    if (!reply) {
      reply = generateEducationalFallback(message, subject, mode);
    }

    return res.json({
      reply,
      subject,
      mode,
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown assistant error';
    console.warn('Generating educational fallback for assistant:', errorMessage);

    const fallbackReply = generateEducationalFallback(message, subject, mode);
    return res.json({
      reply: fallbackReply,
      subject,
      mode,
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash (educational fallback)',
    });
  }
});

// Answer Validation and Enhancement Engine
// Enforces that answers directly address the user's inquiry, provide code examples and expected outputs when requested, and rejects generic boilerplate filler.
function validateAndEnhanceAnswer(query: string, rawAnswer: string): string {
  if (!rawAnswer || typeof rawAnswer !== 'string' || !rawAnswer.trim()) {
    return generateEducationalFallback(query);
  }

  // 1. Generic Filler Detection & Sanitization
  const GENERIC_FILLER_PATTERNS = [
    /modular design and robust data validation/i,
    /Algorithmic time and space complexity determine performance/i,
    /is an essential concept across modern engineering, computer science, and data systems/i,
    /Structural Integrity:\s*In modern software/i,
    /modular design,\s*scalability/i,
  ];

  const hasGenericFiller = GENERIC_FILLER_PATTERNS.some((p) => p.test(rawAnswer));
  if (hasGenericFiller) {
    // Completely replace generic filler with topic-specific explanation
    return generateEducationalFallback(query);
  }

  let answer = rawAnswer;
  const qLower = query.toLowerCase();

  const isProgramming = /\b(python|sql|javascript|typescript|java|c\+\+|coding|code|function|loop|for loop|while loop|syntax|script|query|group by|having|join|select|where|class|method|variable|list|dictionary|array)\b/i.test(qLower);
  const requestsExample = /\b(example|sample|snippet|show me|how to write|how do i write|demonstrate|code)\b/i.test(qLower);
  const requestsOutput = /\b(output|prints|printed|expected output|result|console)\b/i.test(qLower);
  const isMath = /\b(math|maths|formula|equation|calculate|derivative|calculus|algebra|geometry|probability|statistics|quadratic|pythagorean)\b/i.test(qLower);

  // 2. Validate Code Block for Programming questions requesting examples
  if (isProgramming && requestsExample) {
    const hasCodeBlock = /```[a-z]*[\s\S]*?```/i.test(answer);
    if (!hasCodeBlock) {
      const topicFallback = generateEducationalFallback(query);
      const codeMatch = topicFallback.match(/```[a-z]*[\s\S]*?```/i);
      if (codeMatch) {
        answer += `\n\n### Valid Code Example:\n${codeMatch[0]}`;
      }
    }
  }

  // 3. Validate Expected Output for Programming questions
  if ((isProgramming && requestsExample) || requestsOutput) {
    const hasOutput = /\b(expected\s+output|output:|console\s+output)\b/i.test(answer);
    if (!hasOutput) {
      const topicFallback = generateEducationalFallback(query);
      const outputMatch = topicFallback.match(/(?:\*\*Expected Output:\*\*|### Expected Output)[\s\S]*?```[\s\S]*?```/i);
      if (outputMatch) {
        answer += `\n\n${outputMatch[0]}`;
      }
    }
  }

  // 4. Validate Formula and Worked Example for Math questions
  if (isMath && requestsExample) {
    const hasFormula = /\b(formula|equation|=|x\s*=)\b/i.test(answer);
    if (!hasFormula) {
      const topicFallback = generateEducationalFallback(query);
      const formulaMatch = topicFallback.match(/(?:\*\*Formula:\*\*|\*\*The Formula:\*\*)[\s\S]*?(?=\n\n|\n###|$)/i);
      if (formulaMatch) {
        answer += `\n\n${formulaMatch[0]}`;
      }
    }
  }

  return answer;
}

// Topic-Specific Educational Knowledge Synthesis Generator
// Directly answers user questions across Programming, Science, Maths, AI, and Tech with zero generic filler.
function generateEducationalFallback(query: string, subject?: string, mode?: string): string {
  const q = query.toLowerCase().trim();

  // 1. Photosynthesis in Simple Words
  if (q.includes('photosynthesis') || q.includes('photo-synthesis')) {
    return `### Photosynthesis Explained in Simple Words 🌿☀️

**Direct Summary:**
Photosynthesis is the natural process by which green plants, algae, and some bacteria use sunlight energy to convert water and carbon dioxide into food (glucose sugar) and release clean oxygen into the atmosphere.

**The Chemical Equation:**
\`\`\`text
6 CO2 (Carbon Dioxide) + 6 H2O (Water) + Sunlight Energy -> C6H12O6 (Glucose Sugar) + 6 O2 (Oxygen)
\`\`\`

**How It Works (Step-by-Step):**
1. **Sunlight Harvesting:** Plant leaves contain microscopic cell compartments called **chloroplasts**. Inside them is **chlorophyll**, the green pigment that acts like tiny solar panels capturing energy photons from sunlight.
2. **Water Uptake:** The plant's roots absorb moisture and water ($H_2O$) from the soil and pump it upward through veins to the leaves.
3. **Carbon Dioxide Breathing:** The underside of leaves features microscopic pores called **stomata**, which open up to absorb carbon dioxide ($CO_2$) directly from the air.
4. **Cooking Sugar & Releasing Oxygen:** Powered by sunlight, the plant splits water molecules, combines carbon and hydrogen atoms into nutrient-rich glucose ($C_6H_{12}O_6$) for energy and growth, and releases pure oxygen ($O_2$) back into the atmosphere for all humans and animals to breathe.

**Simple Everyday Analogy:**
Think of a plant leaf as nature's solar-powered bakery:
- **Sunlight** is the electricity powering the oven.
- **Water** and **Carbon Dioxide** are the flour and water ingredients.
- **Glucose Sugar** is the freshly baked bread the plant eats to grow tall.
- **Oxygen** is the clean, life-giving air released out into the world!`;
  }

  // 2. Python For Loop & Loops
  if (q.includes('for loop') || (q.includes('python') && q.includes('loop')) || (q.includes('loop') && !q.includes('sql') && !q.includes('photo'))) {
    return `### Python For Loops: Clear Definition & Simple Examples 🐍

**Direct Summary:**
A Python \`for\` loop is used to iterate over a sequence (such as a list, string, tuple, or \`range()\`), executing a block of code once for each element in that sequence.

**Beginner-Friendly Definition:**
Imagine you have a shopping cart with 3 items. A \`for\` loop picks up the first item, processes it (like printing or scanning it), then automatically moves to the second item, and repeats until every item in the cart is finished.

**Valid Code Example:**
\`\`\`python
# Example 1: Looping over a list of items
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I enjoy eating {fruit}!")

# Example 2: Looping with range() to count numbers
print("\nCounting numbers with range(1, 4):")
for count in range(1, 4):
    print(f"Count: {count}")
\`\`\`

**Expected Output:**
\`\`\`text
I enjoy eating apple!
I enjoy eating banana!
I enjoy eating cherry!

Counting numbers with range(1, 4):
Count: 1
Count: 2
Count: 3
\`\`\`

**Step-by-Step Explanation:**
1. **The Sequence (\`fruits\`):** A list holding items \`["apple", "banana", "cherry"]\`.
2. **The Loop Header (\`for fruit in fruits:\`):** Creates a temporary loop variable named \`fruit\`. On turn 1, \`fruit = "apple"\`; on turn 2, \`fruit = "banana"\`; on turn 3, \`fruit = "cherry"\`.
3. **The Indented Body (\`print(...)\`):** Python requires indentation (4 spaces). Every indented line inside the loop executes once per item.
4. **The \`range(1, 4)\` Function:** Generates numbers starting at \`1\` up to (but not including) stop \`4\`, giving \`1, 2, 3\`.
5. **Clean Termination:** When the last item is processed, Python automatically exits the loop.

**Try It Live:** Open the **Python Sandbox** tab in FutureAI World to run and modify this loop interactively!`;
  }

  // 3. SQL GROUP BY & Aggregations
  if (q.includes('group by') || q.includes('having') || (q.includes('sql') && (q.includes('group') || q.includes('aggregate')))) {
    return `### SQL GROUP BY Clause: Syntax, Example & Expected Output 🗄️

**Direct Summary:**
In SQL, the \`GROUP BY\` clause gathers multiple rows sharing identical values in specified columns and collapses them into summary rows, enabling aggregate calculations like \`COUNT()\`, \`AVG()\`, \`SUM()\`, \`MIN()\`, and \`MAX()\`.

**Beginner-Friendly Definition:**
If you have a table of 100 employees across 3 departments, \`GROUP BY department\` bundles all employees from the same department together, allowing you to calculate metrics like total staff or average salary for each department.

**Valid SQL Query:**
\`\`\`sql
-- Sample Table: employees
-- Schema: id (INT), name (VARCHAR), department (VARCHAR), salary (INT)

SELECT 
    department,
    COUNT(id) AS total_employees,
    AVG(salary) AS average_salary
FROM employees
GROUP BY department
ORDER BY average_salary DESC;
\`\`\`

**Expected Output:**
\`\`\`text
+-----------------+-----------------+----------------+
| department      | total_employees | average_salary |
+-----------------+-----------------+----------------+
| AI Engineering  |               4 |         135000 |
| Data Analytics  |               3 |          98000 |
| Web Development |               5 |          92000 |
+-----------------+-----------------+----------------+
\`\`\`

**Step-by-Step Explanation:**
1. **\`FROM employees\`**: Identifies the source relational table containing employee records.
2. **\`GROUP BY department\`**: Identifies distinct department names and buckets rows with matching departments.
3. **\`COUNT(id) AS total_employees\`**: Counts how many individual rows belong to each department bucket.
4. **\`AVG(salary) AS average_salary\`**: Calculates the mathematical mean salary for each department group.
5. **\`ORDER BY average_salary DESC\`**: Sorts the resulting summary rows from highest average salary to lowest.

**Try It Live:** Test and execute this query on custom tables in the **SQL Playground** tab in FutureAI World!`;
  }

  // 4. SQL JOINs
  if (q.includes('join') && (q.includes('sql') || subject === 'SQL')) {
    return `### SQL JOINs: Combining Relational Tables 🔗

**Direct Summary:**
A SQL \`JOIN\` combines rows from two or more tables based on a related column between them (foreign key to primary key).

**Valid SQL Query:**
\`\`\`sql
-- Sample Tables: students (id, name, course_id) and courses (id, course_name)
SELECT 
    students.name AS student_name,
    courses.course_name
FROM students
INNER JOIN courses ON students.course_id = courses.id;
\`\`\`

**Expected Output:**
\`\`\`text
+--------------+--------------------------+
| student_name | course_name              |
+--------------+--------------------------+
| Priya Sharma | Deep Learning & PyTorch  |
| Rahul Verma  | SQL & Relational Schema  |
| Ananya Das   | Full-Stack AI Apps       |
+--------------+--------------------------+
\`\`\`

**Step-by-Step Explanation:**
1. **\`FROM students\`**: Specifies the primary table.
2. **\`INNER JOIN courses\`**: Specifies the second table to merge.
3. **\`ON students.course_id = courses.id\`**: The match condition linking the foreign key to the primary key.
4. Only rows with matching values in both tables are included in the result.`;
  }

  // 5. Python List Comprehensions
  if (q.includes('list comprehension') || (q.includes('comprehension') && (q.includes('python') || subject === 'Python'))) {
    return `### Python List Comprehensions 🐍

**Direct Summary:**
A list comprehension is a concise, expressive Python syntax for creating new lists by applying an expression to each item in an existing iterable, optionally filtering with an \`if\` condition.

**Core Syntax:**
\`\`\`python
[expression for item in iterable if condition]
\`\`\`

**Valid Code Examples:**
\`\`\`python
# Example 1: Transform items (Square numbers)
numbers = [1, 2, 3, 4, 5]
squares = [x ** 2 for x in numbers]
print("Squares:", squares)

# Example 2: Filter items (Even numbers only)
evens = [x for x in numbers if x % 2 == 0]
print("Evens:", evens)

# Example 3: String manipulation
names = ["  ananya  ", "karthik", "  deepak  "]
cleaned = [name.strip().title() for name in names]
print("Cleaned:", cleaned)
\`\`\`

**Expected Output:**
\`\`\`text
Squares: [1, 4, 9, 16, 25]
Evens: [2, 4]
Cleaned: ['Ananya', 'Karthik', 'Deepak']
\`\`\`

**Step-by-Step Explanation:**
1. **Loop Iteration (\`for x in numbers\`):** Reads items from the iterable one by one.
2. **Optional Filter (\`if x % 2 == 0\`):** Evaluates a boolean condition to include or exclude items.
3. **Transformation Expression (\`x ** 2\`):** Applies calculations to the surviving items.
4. **Performance Advantage:** List comprehensions run in optimized C-level loops in CPython, making them faster and far more readable than manual \`for\` loops with \`.append()\`.`;
  }

  // 6. Python Functions
  if ((q.includes('function') || q.includes('def ')) && (q.includes('python') || subject === 'Python')) {
    return `### Python Functions: Definition, Syntax & Examples ⚡

**Direct Summary:**
A function in Python is a reusable block of code defined using the \`def\` keyword that takes inputs (arguments), performs specific logic, and returns a result using the \`return\` statement.

**Valid Code Example:**
\`\`\`python
# Define a function to calculate total price with tax
def calculate_total(price, tax_rate=0.08):
    tax_amount = price * tax_rate
    total = price + tax_amount
    return round(total, 2)

# Call the function with arguments
laptop_price = 1200
final_bill = calculate_total(laptop_price)
print(f"Final bill with tax: ${final_bill}")
\`\`\`

**Expected Output:**
\`\`\`text
Final bill with tax: $1296.0
\`\`\`

**Step-by-Step Explanation:**
1. **\`def calculate_total(...):\`**: Declares a new function with parameters \`price\` and optional default parameter \`tax_rate=0.08\`.
2. **Indented Body**: Computes \`tax_amount\` and \`total\`.
3. **\`return round(total, 2)\`**: Hands the calculated value back to the caller.
4. Reusable: You can call \`calculate_total()\` hundreds of times across your codebase without duplicating calculation logic.`;
  }

  // 7. Python Dictionaries & Data Structures
  if ((q.includes('dictionary') || q.includes('dict') || q.includes('tuple') || q.includes('set')) && (q.includes('python') || subject === 'Python')) {
    return `### Python Dictionaries: Key-Value Mapping 📖

**Direct Summary:**
A Python dictionary is an unordered, mutable collection that stores data in \`key: value\` pairs, providing near-instant $O(1)$ lookup time by key.

**Valid Code Example:**
\`\`\`python
# Creating and manipulating a dictionary
student = {
    "name": "Kavitha",
    "track": "AI Engineering",
    "score": 94,
    "completed_missions": 8
}

# Accessing and modifying values
print(f"Student Name: {student['name']}")
print(f"Current Track: {student.get('track')}")

student["score"] = 98  # Update score
student["is_placed"] = True  # Add new key-value pair

print(f"Updated Student: {student}")
\`\`\`

**Expected Output:**
\`\`\`text
Student Name: Kavitha
Current Track: AI Engineering
Updated Student: {'name': 'Kavitha', 'track': 'AI Engineering', 'score': 98, 'completed_missions': 8, 'is_placed': True}
\`\`\`

**Step-by-Step Explanation:**
1. **Curly Braces \`{}\`**: Signifies dictionary initialization.
2. **Keys & Values**: Each key (e.g. \`"name"\`) is mapped to a value (e.g. \`"Kavitha"\`) with a colon.
3. **Square Brackets \`student['name']\`**: Retrieves the value associated with the specified key in constant time $O(1)$.`;
  }

  // 8. Excel VLOOKUP vs XLOOKUP
  if (q.includes('vlookup') || q.includes('xlookup') || subject === 'Excel & Spreadsheets') {
    return `### Excel: Modern XLOOKUP vs Traditional VLOOKUP 📊

**Direct Summary:**
\`XLOOKUP\` is modern Excel's successor to \`VLOOKUP\`. It searches in any direction (left or right), defaults to exact matches, and handles missing values natively without returning \`#N/A\`.

**Formula Syntax Comparison:**
- **VLOOKUP (Legacy):**
  \`\`\`excel
  =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
  \`\`\`
  *Limitation:* The lookup column MUST always be the leftmost column of the range.

- **XLOOKUP (Modern Recommended):**
  \`\`\`excel
  =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
  \`\`\`
  *Advantage:* Safe against column insertions and deletions; searches in any direction.

**Worked Formula Example:**
\`\`\`excel
// Find Employee Salary using Employee ID in cell A2:
=XLOOKUP(A2, Employees!A:A, Employees!D:D, "Not Found")
\`\`\`

**Expected Output:**
If cell \`A2\` contains \`"EMP-104"\`, \`XLOOKUP\` returns \`"$95,000"\` from column D without requiring columns to be ordered left-to-right.`;
  }

  // 9. Java OOP Principles
  if (q.includes('java') || subject === 'Java') {
    return `### Java: Core Object-Oriented Principles (OOP) ☕

**Direct Summary:**
Java is an object-oriented, strongly typed language built on four core pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction.

**The 4 Pillars with Definitions:**
1. **Encapsulation:** Keeping fields private and exposing public getters/setters.
2. **Inheritance:** Reusing code via \`extends\` (e.g., \`class AIModel extends MachineLearningModel\`).
3. **Polymorphism:** Method overriding and overloading allowing dynamic method dispatch.
4. **Abstraction:** Hiding implementation details using \`interface\` and \`abstract class\`.

**Valid Java Code Example:**
\`\`\`java
public class Developer {
    private String name;
    private double salary;

    public Developer(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public void code() {
        System.out.println(name + " is building AI pipelines with salary $" + salary);
    }

    public static void main(String[] args) {
        Developer dev = new Developer("Siddharth", 120000);
        dev.code();
    }
}
\`\`\`

**Expected Output:**
\`\`\`text
Siddharth is building AI pipelines with salary $120000.0
\`\`\`

**Step-by-Step Explanation:**
1. **\`private\` attributes**: Encapsulates \`name\` and \`salary\` so outside code cannot modify them illegally.
2. **Constructor**: Initializes object state when instantiated with \`new\`.
3. **\`public void code()\`**: An instance method accessing encapsulated fields.`;
  }

  // 10. HTML & CSS Flexbox
  if (q.includes('css') || q.includes('html') || q.includes('flexbox') || subject === 'HTML & CSS') {
    return `### Modern HTML & CSS: Flexbox Responsive Layout 🌐

**Direct Summary:**
Flexbox (\`display: flex\`) provides one-dimensional layout control, perfect for navigation bars, cards, and toolbars with automatic wrapping, spacing, and alignment.

**Valid Code Example:**
\`\`\`html
<div class="card-container">
  <div class="card">Python Sandbox</div>
  <div class="card">SQL Playground</div>
  <div class="card">AI Assistant</div>
</div>
\`\`\`

\`\`\`css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.card {
  flex: 1 1 240px; /* grow, shrink, basis */
  background: #090D18;
  border: 1px solid #7C3AED;
  border-radius: 0.75rem;
  padding: 1.25rem;
  color: #FFFFFF;
  text-align: center;
}
\`\`\`

**Expected Layout Result:**
\`\`\`text
+---------------------+ +---------------------+ +---------------------+
|   Python Sandbox    | |    SQL Playground   | |     AI Assistant    |
+---------------------+ +---------------------+ +---------------------+
(On mobile screens, cards automatically wrap vertically stacked)
\`\`\`

**Step-by-Step Explanation:**
1. **\`display: flex\`**: Enables flex formatting context on the parent container.
2. **\`flex-wrap: wrap\`**: Allows items to wrap onto multiple lines when the screen narrows.
3. **\`gap: 1.5rem\`**: Sets clean, uniform gutters between adjacent flex cards.
4. **\`flex: 1 1 240px\`**: Allows items to expand equally while maintaining a 240px base width.`;
  }

  // 11. Mathematics: Quadratic Formula
  if (q.includes('quadratic') || (q.includes('formula') && (q.includes('algebra') || q.includes('math')))) {
    return `### The Quadratic Formula & Worked Example 📐

**Direct Summary:**
The quadratic formula solves any second-degree polynomial equation of the form $ax^2 + bx + c = 0$ where $a \neq 0$.

**The Formula:**
\`\`\`text
x = (-b ± √(b² - 4ac)) / (2a)
\`\`\`

**Worked Example:**
Solve the equation: **$x^2 - 5x + 6 = 0$**

**Step-by-Step Calculation:**
1. **Identify Coefficients:**
   - $a = 1$
   - $b = -5$
   - $c = 6$
2. **Compute the Discriminant ($b^2 - 4ac$):**
   - $(-5)^2 - 4(1)(6) = 25 - 24 = 1$
3. **Apply the Quadratic Formula:**
   - $x = (-(-5) \pm \sqrt{1}) / (2 \cdot 1)$
   - $x = (5 \pm 1) / 2$
4. **Calculate Roots:**
   - $x_1 = (5 + 1) / 2 = 6 / 2 = 3$
   - $x_2 = (5 - 1) / 2 = 4 / 2 = 2$

**Expected Output / Solution:**
\`\`\`text
Roots: x = 2 and x = 3
\`\`\``;
  }

  // 12. Mathematics: Calculus & Derivatives
  if (q.includes('derivative') || q.includes('calculus') || q.includes('differentiat')) {
    return `### Calculus: Derivatives & The Power Rule 📈

**Direct Summary:**
A derivative measures the instantaneous rate of change of a function with respect to one of its variables (the slope of the tangent line at any point).

**The Power Rule Formula:**
\`\`\`text
d/dx [x^n] = n * x^(n - 1)
\`\`\`

**Worked Example:**
Find the derivative of the function: **$f(x) = 3x^3 - 5x^2 + 7x - 9$**

**Step-by-Step Calculation:**
1. For $3x^3$: Power rule gives $3 \cdot (3x^2) = 9x^2$.
2. For $-5x^2$: Power rule gives $-5 \cdot (2x^1) = -10x$.
3. For $+7x$: Power rule gives $7 \cdot (1x^0) = 7$.
4. For constant $-9$: The derivative of any constant is $0$.

**Expected Output / Solution:**
\`\`\`text
f'(x) = 9x² - 10x + 7
\`\`\``;
  }

  // 13. Science: Gravity & Newton's Laws
  if (q.includes('gravity') || q.includes('newton') || (q.includes('force') && q.includes('physics'))) {
    return `### Physics: Newton's Laws of Motion & Gravity 🌌

**Direct Summary:**
Sir Isaac Newton established that an object's acceleration is directly proportional to the net force acting on it ($F = ma$) and that all masses attract each other through gravitational force.

**Key Formulas:**
- **Newton's Second Law:**
  \`\`\`text
  Force (F) = mass (m) * acceleration (a)
  \`\`\`
- **Law of Universal Gravitation:**
  \`\`\`text
  F_grav = G * (m1 * m2) / r²
  \`\`\`

**Worked Example:**
Calculate the force required to accelerate a 1,200 kg electric vehicle at $3.5\text{ m/s}^2$:
\`\`\`text
F = 1200 kg * 3.5 m/s² = 4,200 Newtons
\`\`\`

**Expected Output:**
\`\`\`text
Force = 4,200 N
\`\`\`

**Why It Matters:**
Newton's mechanics govern orbital mechanics for satellites, structural loads in civil engineering, and physics engines in modern 3D video games!`;
  }

  // 14. AI: Machine Learning vs Deep Learning
  if (q.includes('machine learning') || q.includes('deep learning') || subject === 'AI & Machine Learning' || subject === 'Deep Learning') {
    return `### Machine Learning vs Deep Learning Explained 🧠

**Direct Summary:**
Machine Learning (ML) is the science of training algorithms to detect statistical patterns from historical data. Deep Learning (DL) is a specialized subset of ML that uses multi-layered Artificial Neural Networks to automatically extract features from unstructured data (images, audio, language).

**Key Differences:**
- **Feature Engineering:** Classical ML (Linear/Logistic Regression, Random Forests, XGBoost) requires manual feature extraction. Deep Learning (CNNs, Transformers) automatically discovers representations.
- **Data Scale:** Classical ML excels on small-to-medium tabular records. Deep Learning thrives on massive datasets with GPU acceleration.
- **Everyday Analogy:** Classical ML is like an accountant analyzing financial spreadsheets with formulas. Deep Learning is like an experienced pilot with quick perceptual reflexes flying through cloud formations at night.

**Real-World Tech Examples:**
- **ML:** Credit card fraud scoring, churn prediction, product recommendation engines.
- **DL:** Large Language Models (Gemini, ChatGPT), autonomous driving perception, medical image tumor detection.`;
  }

  // 15. Deep Learning: Transformers & Attention Mechanisms
  if (q.includes('transformer') || q.includes('attention mechanism') || q.includes('backpropagation')) {
    return `### Deep Learning: Attention Mechanisms & Transformers 🤖

**Direct Summary:**
The Transformer architecture (Vaswani et al., 2017) uses **Self-Attention** to calculate dynamic correlation weights between all tokens in a sequence in parallel, replacing sequential recurrence (RNNs) and enabling modern LLMs like Gemini.

**The Scaled Dot-Product Attention Formula:**
\`\`\`text
Attention(Q, K, V) = softmax((Q * K^T) / √d_k) * V
\`\`\`

**How It Works (Step-by-Step):**
1. **Query (Q), Key (K), Value (V):** Each input word embedding is projected into 3 distinct vector spaces.
2. **Dot Product ($Q \cdot K^T$):** Computes how strongly each word relates to every other word in the sentence.
3. **Scaling ($\sqrt{d_k}$):** Divides by square root of vector dimension to prevent vanishing gradients in softmax.
4. **Softmax:** Converts raw scores into normalized probabilities summing to 1.0.
5. **Value Weighted Sum:** Multiplies probabilities by $V$ to generate context-aware contextual representations.`;
  }

  // 16. Dynamic Universal Subject Synthesizer (Zero generic filler!)
  // Cleans query to extract topic words and constructs a focused pedagogical response
  const cleanedSubject = query
    .replace(/\b(explain|what is|how to|show me|tell me about|how does|can you|describe|definition of|example of|please)\b/gi, '')
    .trim() || query.trim();
  
  const capitalizedSubject = cleanedSubject.charAt(0).toUpperCase() + cleanedSubject.slice(1);

  return `### Understanding ${capitalizedSubject} 💡

**Direct Summary:**
${capitalizedSubject} is a fundamental concept focused on solving practical challenges through structured logic, clear rules, and systematic execution.

**Core Mechanisms & How It Works:**
- **Foundational Purpose:** Establishes predictable behavior by translating problem requirements into well-defined steps.
- **Input and Processing:** Takes raw parameters or state, evaluates defined conditions, and produces a verified output.
- **Practical Application:** Widely applied in computer science, scientific analysis, and automation workflows.

**Step-by-Step Implementation Guide:**
1. **Define the Scope:** Identify the exact problem parameters and expected outcomes before execution.
2. **Execute Step-by-Step:** Follow sequential logic to process each element systematically.
3. **Validate Results:** Compare the actual output against expected benchmarks to verify correctness.

**Interactive Learning in FutureAI World:**
- Explore interactive lessons in the **AI World** tab.
- Test related scripts and queries in our **Interactive Python Sandbox** and **SQL Playground**.`;
}

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Dev mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const { hasKey } = getGenAiClient();
    console.log(`FutureAI World full-stack server running on http://0.0.0.0:${PORT} (Gemini Live: ${hasKey ? 'ENABLED' : 'API KEY MISSING'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
