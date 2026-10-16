import { LearningZone, Badge } from '../types';

export const LEARNING_ZONES: LearningZone[] = [
  {
    id: 'ai-literacy',
    title: 'AI Literacy, Ethics & Everyday Tools',
    tagline: 'Understand core AI concepts, everyday tools, and essential ethics & safety.',
    iconName: 'Sparkles',
    color: 'from-purple-500 to-indigo-500',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    difficultyLevel: 'Beginner Friendly',
    lessons: [
      {
        id: 'ai-intro',
        zoneId: 'ai-literacy',
        title: 'Demystifying AI, Machine Learning & Deep Learning',
        difficulty: 'Beginner',
        readTime: '6 min read',
        xpReward: 100,
        requiresCoding: false,
        summary: 'Demystify the concentric hierarchy of AI: from rules-based engines to machine learning and neural networks.',
        prerequisites: ['No prior technical or coding experience required.'],
        learningObjectives: [
          'Differentiate Artificial Intelligence, Machine Learning, and Deep Learning.',
          'Identify real-world examples of AI in everyday consumer software.',
          'Understand how training from data replaces manual if-else rule writing.'
        ],
        sections: [
          {
            title: 'The Concentric Circles of Modern Tech',
            content: 'Artificial Intelligence (AI) is the broad umbrella covering any system that simulates human problem-solving. Machine Learning (ML) is a subset where computers learn patterns directly from past data rather than human-coded if-else logic. Deep Learning (DL) uses multi-layered artificial neural networks inspired by human brain connections to process unstructured data like images, audio, and language.',
            tanglishAnalogy: 'Think of driving a car. Traditional coding is like a train with fixed tracks (it can only go where tracks exist). Machine Learning is like teaching a student driver by showing them 1,000 driving videos. Deep Learning is like having experienced drivers with sharp reflexes navigating foggy mountain roads at night.',
            plainEnglishSummary: 'Traditional code follows rigid human-written rules. Machine Learning finds rules automatically from historical data. Deep Learning uses deep neural networks for vision and language.'
          },
          {
            title: 'Everyday AI You Already Use',
            content: 'AI is already present in daily routines: Spotify recommending songs based on listening patterns, Google Maps predicting traffic using phone velocity clusters, smartphone cameras isolating portrait backgrounds, and Gmail filtering spam messages.'
          }
        ],
        workedExample: {
          title: 'Spam Filter: Rule-Based vs Machine Learning',
          scenario: 'A company wants to block spam emails offering fraudulent lottery prizes.',
          steps: [
            'Rule-Based approach: Developer hardcodes: if email contains "FREE MONEY", flag as spam. Problem: Spammers quickly bypass it by writing "F-R-E-E M-O-N-E-Y".',
            'Machine Learning approach: Feed 50,000 spam and non-spam emails into a classifier. The algorithm learns weighted token probabilities across all words.',
            'Outcome: The ML filter adapts dynamically to new spelling mutations without requiring developers to write new if-statements every day.'
          ],
          codeOrCalculation: '# Concept: P(Spam | Words) calculated from historical frequency distributions',
          expectedOutput: 'Accuracy: 99.2% on unseen emails'
        },
        practiceTask: {
          task: 'Think of one manual task you do each week (e.g., sorting bills, scheduling meetings). How would rule-based coding vs machine learning solve it?',
          hint: 'Ask yourself: Are there fixed clear rules, or does it require learning subjective patterns from historical examples?'
        },
        interactiveWidget: 'matrix_multiply',
        quiz: [
          {
            id: 'q-ai-1',
            question: 'Which of the following correctly describes the relationship between AI, ML, and Deep Learning?',
            options: [
              'AI is inside Deep Learning, which is inside Machine Learning',
              'Deep Learning is a subset of Machine Learning, which is a subset of AI',
              'Machine Learning and Deep Learning are completely unrelated to AI',
              'They are all identical terms for regular database software'
            ],
            correctIndex: 1,
            explanationEng: 'Deep Learning is a specialized branch of Machine Learning using deep neural networks, and ML itself is a subset of the broader field of Artificial Intelligence.',
            explanationTamil: 'Deep Learning என்பது Machine Learning-ன் ஒரு பகுதி. Machine Learning என்பது AI-ன் ஒரு பகுதியாகும்.'
          },
          {
            id: 'q-ai-2',
            question: 'What differentiates Machine Learning from traditional rule-based coding?',
            options: [
              'ML requires writing million lines of if-else conditions manually',
              'ML learns rules and patterns automatically from historic data',
              'ML only works on supercomputers with quantum chips',
              'ML does not use any mathematical formulas'
            ],
            correctIndex: 1,
            explanationEng: 'In traditional software, developers write rules. In ML, algorithms discover patterns and create rules by analyzing historical data.',
            explanationTamil: 'பாரம்பரிய நிரலாக்கத்தில் நாம் விதிகளை எழுதுகிறோம். ML-ல் தரவுகளை பார்த்து கணினியே விதிகளை கற்றுக்கொள்கிறது.'
          }
        ]
      },
      {
        id: 'responsible-ai',
        zoneId: 'ai-literacy',
        title: 'Responsible AI: Ethics, Hallucinations & Bias',
        difficulty: 'Beginner',
        readTime: '6 min read',
        xpReward: 110,
        requiresCoding: false,
        summary: 'Learn why AI models make mistakes, how dataset bias affects outcomes, and how to verify AI information.',
        prerequisites: ['Basic understanding of what Machine Learning is.'],
        learningObjectives: [
          'Define AI hallucination and explain why language models produce them.',
          'Understand algorithmic bias and how training data historical skew causes unfairness.',
          'Apply practical verification habits when using AI tools for academic or professional work.'
        ],
        sections: [
          {
            title: 'Why Do Models "Hallucinate"?',
            content: 'Generative AI models are statistical probability calculators, not omniscient knowledge databases. If a model lacks verified grounding context, it may confidently output false dates, non-existent research papers, or flawed math. Responsible practitioners always double-check critical facts against authoritative primary sources.',
            tanglishAnalogy: 'Imagine a confident student in a viva exam. Even when they do not remember an exact historical year, they state a fake year with total confidence! That is hallucination. Confident presentation, but factually untrue.'
          },
          {
            title: 'Algorithmic Bias & Real-World Impact',
            content: 'If training data contains historical skews (e.g., past hiring records where certain colleges were overrepresented), an algorithm trained on that data will perpetuate that bias unless explicitly audited and re-balanced.'
          }
        ],
        workedExample: {
          title: 'Fact-Checking an AI Output',
          scenario: 'A student asks an LLM: "Cite 3 peer-reviewed 2023 papers on Tamil NLP benchmarks."',
          steps: [
            'Step 1: The model outputs 3 believable paper titles and authors.',
            'Step 2: The student searches Google Scholar for the exact titles.',
            'Step 3: Finding that 2 of the papers do not exist, the student recognizes hallucination.',
            'Step 4: The student re-prompts using grounding: "Only summarize papers found in this provided PDF list."'
          ],
          expectedOutput: 'Zero hallucinations when grounded in verified reference documents.'
        },
        practiceTask: {
          task: 'Identify two risks of using generative AI tools for medical diagnosis or legal contract drafting without human expert review.',
          hint: 'Think about accountability, confidence without factual verification, and privacy regulations.'
        },
        quiz: [
          {
            id: 'q-resp-1',
            question: 'What is an AI "hallucination"?',
            options: [
              'When the computer screen flickers with colorful lights',
              'When an AI model generates factually incorrect or fabricated information with high confidence',
              'When an AI model downloads unauthorized software updates',
              'When a model runs out of electricity'
            ],
            correctIndex: 1,
            explanationEng: 'Hallucination refers to plausible-sounding but completely fabricated or inaccurate statements generated by language models.',
            explanationTamil: 'ஹாலுசினேஷன் என்பது AI மாடல் உண்மை இல்லாத தகவல்களை முழு நம்பிக்கையுடன் உருவாக்கும் பிழையாகும்.'
          }
        ]
      }
    ]
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering & Generative AI',
    tagline: 'Master clear instructions, structured outputs, and practical generative workflows.',
    iconName: 'Cpu',
    color: 'from-indigo-500 to-purple-600',
    bgGlow: 'rgba(99, 102, 241, 0.15)',
    difficultyLevel: 'Beginner Friendly',
    lessons: [
      {
        id: 'prompt-101',
        zoneId: 'prompt-engineering',
        title: 'Prompt Engineering 101: The 4-Pillar RCTC Formula',
        difficulty: 'Beginner',
        readTime: '6 min read',
        xpReward: 110,
        requiresCoding: false,
        summary: 'Transform vague one-sentence questions into high-precision, production-grade instructions.',
        prerequisites: ['Basic familiarization with ChatGPT, Gemini, or search engines.'],
        learningObjectives: [
          'Deconstruct prompts into Role, Context, Task, and Constraints (RCTC).',
          'Understand zero-shot vs few-shot prompting.',
          'Format AI output for business reports, JSON, and study planners.'
        ],
        sections: [
          {
            title: 'Role, Context, Task, and Constraints (RCTC)',
            content: 'High-performing prompts follow the RCTC framework:\n1. Role: Define the persona and expertise level.\n2. Context: Provide background facts, datasets, or constraints.\n3. Task: State the exact objective clearly.\n4. Constraints: Specify length, format (bullet points, markdown table, JSON), and forbidden topics.',
            tanglishAnalogy: 'A vague prompt is like telling an auto driver: "Go somewhere nice". You will end up somewhere you did not want to be! An RCTC prompt gives exact street directions, landmarks, meter fare, and route.'
          }
        ],
        workedExample: {
          title: 'Transforming a Vague Prompt to Production RCTC',
          scenario: 'A student wants help preparing for a campus interview.',
          steps: [
            'Bad prompt: "Help me prepare for an interview."',
            'Applying RCTC:\n- Role: "Act as a technical hiring manager at an IT services company."\n- Context: "I am a 3rd-year CS student with basic Python and SQL skills."\n- Task: "Generate 3 common behavioral questions and 3 technical SQL questions."\n- Constraints: "Format each with what good answers look like. Max 300 words."'
          ],
          codeOrCalculation: 'RCTC = Role + Context + Task + Constraints',
          expectedOutput: 'Targeted, highly relevant interview practice set formatted in clear sections.'
        },
        practiceTask: {
          task: 'Rewrite this prompt using RCTC: "Write an email to my professor asking for an assignment deadline extension."',
          hint: 'Include your course name, assignment title, medical or family reason, requested new date, and polite respectful tone.'
        },
        quiz: [
          {
            id: 'q-prompt-1',
            question: 'Which component is missing from this prompt: "Write an email to my manager asking for leave"?',
            options: [
              'Role, reason/context, dates, and tone constraints',
              'A credit card number',
              'A Python script',
              'Nothing, it is already perfect'
            ],
            correctIndex: 0,
            explanationEng: 'Effective prompts require context (dates, reason, tone) so the AI does not have to guess essential details.',
            explanationTamil: 'தேதி, காரணம் மற்றும் அதிகாரப்பூர்வ தொனி போன்ற விவரங்கள் (Context) இருந்தால் மட்டுமே AI சரியான கடிதத்தை எழுதும்.'
          }
        ]
      },
      {
        id: 'llm-thinking',
        zoneId: 'prompt-engineering',
        title: 'How LLMs Actually Think: Tokens, Attention & Temperature',
        difficulty: 'Intermediate',
        readTime: '7 min read',
        xpReward: 120,
        requiresCoding: false,
        summary: 'Explore tokens, attention mechanisms, and probability distributions that power models like Gemini and ChatGPT.',
        prerequisites: ['Prompt Engineering 101 or basic AI literacy.'],
        learningObjectives: [
          'Explain tokenization and how words are mapped to numerical IDs.',
          'Understand autoregressive next-token prediction.',
          'Use temperature controls to balance determinism vs creativity.'
        ],
        sections: [
          {
            title: 'Tokenization & Probability Matrices',
            content: 'Large Language Models do not store pre-formed sentences. Instead, they break words into smaller chunks called "tokens" (roughly 4 letters or 0.75 words in English). When you ask a question, the model converts your prompt into vectors, calculates self-attention across tokens, and outputs a probability distribution for the single next most likely token.',
            tanglishAnalogy: 'Imagine your phone keyboard autocomplete on super steroids. If you type "Chennai Super...", your keyboard predicts "Kings" with 95% confidence. LLMs do this across billions of parameters with deep context.'
          },
          {
            title: 'Temperature and Creativity',
            content: 'Temperature controls how adventurous the model is when sampling from top candidate tokens. Temperature = 0 picks the single most probable token every step (great for code and math), while Temperature = 0.8 samples from creative alternatives (great for brainstorming and fiction).'
          }
        ],
        workedExample: {
          title: 'Sampling Candidates with Temperature',
          scenario: 'Prompt: "The capital of Tamil Nadu is [?]"',
          steps: [
            'Model evaluates probabilities:\n- "Chennai": 98.7%\n- "Madurai": 0.8%\n- "Coimbatore": 0.3%',
            'At Temperature = 0.0: The model strictly selects "Chennai".',
            'At Temperature = 1.8: Probability is flattened; model might pick "Madurai", introducing factual error!'
          ],
          expectedOutput: 'Set temperature = 0 to 0.2 for factual, math, or programming tasks.'
        },
        practiceTask: {
          task: 'Use the interactive Token Predictor widget below. Slide temperature from 0.2 to 1.4 and observe how candidate probabilities flatten.',
          hint: 'Notice how higher temperature increases the chance of picking lower-probability words.'
        },
        interactiveWidget: 'token_simulator',
        quiz: [
          {
            id: 'q-llm-1',
            question: 'How do LLMs generate responses to user queries?',
            options: [
              'By copying and pasting pre-written articles from Google searches',
              'By predicting the next most probable token step-by-step',
              'By executing hidden Python programs inside the chat window',
              'By storing an encyclopedic database of all human conversations'
            ],
            correctIndex: 1,
            explanationEng: 'LLMs generate text autoregressively: they predict one token at a time based on the preceding context and token probabilities.',
            explanationTamil: 'LLM மாடல்கள் ஒவ்வொன்றாக அடுத்த வரக்கூடிய சாத்தியமான சொல்லை (token) கணித்து பதில்களை உருவாக்குகின்றன.'
          }
        ]
      }
    ]
  },
  {
    id: 'python-coding',
    title: 'Python for Everyone',
    tagline: 'The world’s most friendly and versatile programming language for automation and AI.',
    iconName: 'Terminal',
    color: 'from-cyan-500 to-blue-600',
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    difficultyLevel: 'All Levels',
    lessons: [
      {
        id: 'py-basics',
        zoneId: 'python-coding',
        title: 'Python Core Essentials: Variables, Types & Conditionals',
        difficulty: 'Beginner',
        readTime: '7 min read',
        xpReward: 100,
        requiresCoding: true,
        summary: 'Understand variables, data structures (lists & dictionaries), loops, and clean syntax without getting bogged down in boilerplate.',
        prerequisites: ['Basic computer literacy. No previous programming experience needed.'],
        learningObjectives: [
          'Create variables of type string, integer, float, and boolean.',
          'Store and access collections using Lists and Dictionaries.',
          'Write conditional logic using if, elif, and else statements.'
        ],
        sections: [
          {
            title: 'Why Python Over Other Languages?',
            content: 'Python syntax reads almost like plain English. You do not need semicolons, curly braces, or complex type declarations to get started. Its true superpower is the global ecosystem of pre-built scientific libraries: NumPy, Pandas, Scikit-learn, and PyTorch.',
            codeSnippet: `# Variables in Python
student_name = "Kavitha"
coding_score = 92
is_placed = True

print(f"Student: {student_name}, Score: {coding_score}")`,
            tanglishAnalogy: 'C/C++ or Java is like assembling a bicycle from raw metal pipes and screws. Python is like getting a pre-built sports bike where you just turn the throttle and ride.'
          }
        ],
        workedExample: {
          title: 'Student Grade Evaluator in Python',
          scenario: 'Write a short script to determine if a score qualifies for placement eligibility.',
          steps: [
            'Step 1: Define numeric score variable.',
            'Step 2: Use if/else to check if score >= 75.',
            'Step 3: Print tailored status message.'
          ],
          codeOrCalculation: `score = 82

if score >= 85:
    status = "Direct Interview"
elif score >= 75:
    status = "Screening Qualified"
else:
    status = "Skill Assessment Needed"

print(f"Eligibility: {status}")`,
          expectedOutput: 'Eligibility: Screening Qualified'
        },
        practiceTask: {
          task: 'Open the Python Sandbox below. Create a list of 4 numbers, calculate their sum using sum(), and print the average.',
          hint: 'Remember: average = sum(my_list) / len(my_list).'
        },
        interactiveWidget: 'python_tester',
        quiz: [
          {
            id: 'q-py-1',
            question: 'Which built-in Python data structure stores key-value pairs?',
            options: [
              'List [1, 2, 3]',
              'Tuple (1, 2, 3)',
              'Dictionary {"role": "AI Engineer", "level": 1}',
              'Set {1, 2, 3}'
            ],
            correctIndex: 2,
            explanationEng: 'Dictionaries store data mapped in key-value associations, ideal for representing structured records like JSON or database rows.',
            explanationTamil: 'Dictionary என்பது தகவல்களை key-value ஜோடிகளாக சேமிக்கும் ஓர் பைதான் அமைப்பாகும்.'
          }
        ]
      },
      {
        id: 'py-pandas',
        zoneId: 'python-coding',
        title: 'Pandas & NumPy: Supercharged Tables in Code',
        difficulty: 'Intermediate',
        readTime: '9 min read',
        xpReward: 130,
        requiresCoding: true,
        summary: 'Load CSV files, clean dirty values, filter columns, and aggregate business metrics in seconds.',
        prerequisites: ['Python Core Essentials (lists, variables, loops).'],
        learningObjectives: [
          'Understand Series vs DataFrame structures in Pandas.',
          'Inspect missing (null) values and calculate summary statistics.',
          'Filter rows using boolean indexing.'
        ],
        sections: [
          {
            title: 'What is a DataFrame?',
            content: 'A Pandas DataFrame is a 2D tabular data structure with labeled axes (rows and columns)—essentially Excel inside Python code, but able to process millions of records in milliseconds with vectorized C-speed operations.',
            codeSnippet: `import pandas as pd

df = pd.DataFrame({
    'Candidate': ['Ramesh', 'Divya', 'Arjun', 'Sneha'],
    'Skills': ['SQL, Python', 'Excel, Tableau', 'PyTorch, Python', 'PowerBI'],
    'Score': [85, 92, 78, 90]
})

# Filter applicants with score >= 80
qualified = df[df['Score'] >= 80]
print(qualified)`
          }
        ],
        workedExample: {
          title: 'Detecting and Handling Null Values',
          scenario: 'A dataset has missing salaries.',
          steps: [
            'Step 1: Check count of nulls: df.isnull().sum()',
            'Step 2: Impute missing values with median: df["Salary"].fillna(df["Salary"].median(), inplace=True)',
            'Step 3: Verify zero remaining nulls.'
          ],
          codeOrCalculation: `df['Salary'] = df['Salary'].fillna(df['Salary'].median())`,
          expectedOutput: 'All missing rows populated without dropping candidate records.'
        },
        practiceTask: {
          task: 'In the Python Sandbox, run the Pandas template and check how many candidates match Python skills.',
          hint: 'Look for the str.contains("Python") filter logic.'
        },
        interactiveWidget: 'python_tester',
        quiz: [
          {
            id: 'q-pandas-1',
            question: 'What does `df.isnull().sum()` do in Pandas?',
            options: [
              'Deletes all empty columns immediately without warning',
              'Calculates the count of missing (NaN) values in each column',
              'Converts strings into numeric values',
              'Sorts the DataFrame in ascending order'
            ],
            correctIndex: 1,
            explanationEng: '`df.isnull().sum()` identifies and tallies the total missing or null values per column, an essential first step in data sanitization.',
            explanationTamil: 'இந்த கமாண்ட் ஒவ்வொரு காலமிலும் எத்தனை விடுபட்ட (null/missing) மதிப்புகள் உள்ளன என்பதை கணக்கிடும்.'
          }
        ]
      }
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics, Excel & SQL',
    tagline: 'Transform raw numbers, spreadsheets, and databases into business insights.',
    iconName: 'Database',
    color: 'from-emerald-500 to-teal-500',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    difficultyLevel: 'All Levels',
    lessons: [
      {
        id: 'data-lifecycle',
        zoneId: 'data-analytics',
        title: 'The Analytics Value Chain: Descriptive to Prescriptive',
        difficulty: 'Beginner',
        readTime: '6 min read',
        xpReward: 100,
        requiresCoding: false,
        summary: 'Learn the difference between Descriptive, Diagnostic, Predictive, and Prescriptive analytics.',
        prerequisites: ['Basic familiarity with tables and business metrics.'],
        learningObjectives: [
          'Differentiate the 4 stages of business data maturity.',
          'Connect key performance indicators (KPIs) to business decisions.',
          'Identify when statistical modeling is needed vs simple aggregations.'
        ],
        sections: [
          {
            title: 'The 4 Questions Every Company Asks',
            content: 'Analytics progresses across four mature tiers:\n1. Descriptive: What happened? (e.g., total sales last month).\n2. Diagnostic: Why did it happen? (e.g., website conversion dipped due to checkout bugs).\n3. Predictive: What will happen next? (e.g., forecast next month demand based on trends).\n4. Prescriptive: What should we do about it? (e.g., reallocate warehouse inventory to Chennai).'
          }
        ],
        workedExample: {
          title: 'Food Delivery Analytics Case Study',
          scenario: 'An app notices orders drop by 25% on rainy evenings.',
          steps: [
            'Descriptive: Orders dropped by 25% across Chennai.',
            'Diagnostic: Rider availability dropped 40% due to flooded streets.',
            'Predictive: Weather forecast predicts heavy rain next Tuesday 6 PM.',
            'Prescriptive: Pre-announce surge delivery bonuses to riders in advance.'
          ],
          expectedOutput: 'Rider shortages prevented, preserving ₹15 Lakhs in daily revenue.'
        },
        practiceTask: {
          task: 'Pick an app you use daily (e.g., Instagram, YouTube, Swiggy). Identify one Descriptive metric and one Predictive feature.',
          hint: 'Descriptive: Video view count. Predictive: Recommended next videos tailored to your watch history.'
        },
        quiz: [
          {
            id: 'q-data-1',
            question: 'Which analytics branch answers the question: "What should our business do about this trend?"',
            options: [
              'Descriptive Analytics',
              'Prescriptive Analytics',
              'Retrospective Analytics',
              'Decorative Analytics'
            ],
            correctIndex: 1,
            explanationEng: 'Prescriptive analytics recommends optimal actions and intervention strategies to capitalize on opportunities or mitigate risks.',
            explanationTamil: 'Prescriptive Analytics என்பது அடுத்து நிறுவனம் என்ன முடிவு எடுக்க வேண்டும் என்று வழிகாட்டுகிறது.'
          }
        ]
      },
      {
        id: 'sql-essentials',
        zoneId: 'data-analytics',
        title: 'SQL Fundamentals for IT Job Interviews',
        difficulty: 'Intermediate',
        readTime: '8 min read',
        xpReward: 140,
        requiresCoding: true,
        summary: 'Master SELECT, WHERE, GROUP BY, and JOIN statements tested in 90% of Data Analyst interviews.',
        prerequisites: ['Basic understanding of relational tables (rows and columns).'],
        learningObjectives: [
          'Write queries with SELECT, FROM, WHERE, ORDER BY, and LIMIT.',
          'Aggregate data with GROUP BY, COUNT, and AVG.',
          'Understand the difference between WHERE and HAVING filters.'
        ],
        sections: [
          {
            title: 'Querying Relational Tables with Precision',
            content: 'Structured Query Language (SQL) is the standard interface for retrieving records from database tables. Almost every tech company stores business transactions in SQL databases (PostgreSQL, MySQL, BigQuery).',
            codeSnippet: `SELECT 
    department, 
    COUNT(employee_id) AS total_staff,
    AVG(salary) AS avg_salary
FROM employees
WHERE performance_rating >= 4.0
GROUP BY department
HAVING COUNT(employee_id) > 2
ORDER BY avg_salary DESC;`
          }
        ],
        workedExample: {
          title: 'Finding High-Performing Engineering Staff',
          scenario: 'HR wants to find all employees with rating >= 4.5 earning above ₹10 LPA.',
          steps: [
            'Step 1: SELECT name, salary, rating FROM employees',
            'Step 2: Add WHERE rating >= 4.5 AND salary >= 1000000',
            'Step 3: Add ORDER BY salary DESC'
          ],
          codeOrCalculation: `SELECT name, dept, salary FROM employees WHERE rating >= 4.5 AND salary >= 1000000 ORDER BY salary DESC;`,
          expectedOutput: 'Clean tabular list sorted by highest compensation.'
        },
        practiceTask: {
          task: 'Use the interactive SQL Database Playground below. Select different query filters and see the live result table update.',
          hint: 'Observe how WHERE filters individual employee records before they are displayed.'
        },
        interactiveWidget: 'sql_filter',
        quiz: [
          {
            id: 'q-sql-1',
            question: 'What is the key difference between WHERE and HAVING in SQL?',
            options: [
              'WHERE is for numbers; HAVING is for text strings only',
              'WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY',
              'WHERE can only be used once a week on test databases',
              'There is no difference; they are exact aliases'
            ],
            correctIndex: 1,
            explanationEng: '`WHERE` filters records before aggregation occurs; `HAVING` filters the summary rows produced by `GROUP BY`.',
            explanationTamil: 'WHERE என்பது குரூப் செய்வதற்கு முன் வரிகளை வடிகட்டுகிறது. HAVING என்பது GROUP BY செய்த பிறகு வரும் தொகைகளை வடிகட்டுகிறது.'
          }
        ]
      }
    ]
  },
  {
    id: 'advanced-ai',
    title: 'Advanced AI & Modern Engineering',
    tagline: 'Build real production architectures: RAG pipelines, vector search, and AI agents.',
    iconName: 'Brain',
    color: 'from-pink-500 to-rose-600',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
    difficultyLevel: 'Advanced',
    lessons: [
      {
        id: 'rag-deep-dive',
        zoneId: 'advanced-ai',
        title: 'Retrieval-Augmented Generation (RAG) Architecture',
        difficulty: 'Advanced',
        readTime: '9 min read',
        xpReward: 150,
        requiresCoding: true,
        summary: 'Connect foundation models to private enterprise PDF repositories and databases with semantic search.',
        prerequisites: ['Prompt Engineering 101, basic Python APIs, and vector concepts.'],
        learningObjectives: [
          'Explain the 4 stages of RAG: Ingestion, Chunking, Embedding, and Retrieval.',
          'Compare RAG vs Model Fine-Tuning across latency, cost, and maintenance.',
          'Understand vector similarity search using Cosine Similarity.'
        ],
        sections: [
          {
            title: 'The 4 Stages of a Production RAG System',
            content: '1. Ingestion & Chunking: Long documents are divided into manageable chunks (e.g., 500 tokens).\n2. Embedding: Chunks are transformed into dense mathematical vectors.\n3. Vector Indexing: Embeddings are indexed in vector databases (Chroma, Pinecone).\n4. Semantic Retrieval: User query is embedded; cosine similarity finds the top-k nearest chunks and injects them into the LLM prompt as context.',
            tanglishAnalogy: 'RAG is like an Open Book Exam. Instead of forcing the student to memorize a 2,000-page medical encyclopedia, the student has a laser index that flips immediately to page 84 to quote the exact dosage formula.'
          }
        ],
        workedExample: {
          title: 'Chat with College Syllabus Pipeline',
          scenario: 'A college creates an AI bot to answer: "What is the penalty for missing Lab 3?"',
          steps: [
            'Step 1: Chunk college handbook PDF into 400-token sections.',
            'Step 2: Generate embeddings with text-embedding-004.',
            'Step 3: User query: "Lab 3 absence penalty". Vector search finds chunk with cosine score 0.89.',
            'Step 4: LLM receives: Context: [Section 4.2: Lab attendance rules...] + Query. Generates response citing Section 4.2.'
          ],
          expectedOutput: 'Accurate, hallucination-free answer with citation of Section 4.2.'
        },
        practiceTask: {
          task: 'Why is RAG preferred over fine-tuning when an organization’s internal policies change weekly?',
          hint: 'Consider how fast updating a database index is compared to retraining a multi-billion parameter model.'
        },
        quiz: [
          {
            id: 'q-rag-1',
            question: 'What is the role of an "Embedding" in vector databases?',
            options: [
              'It encrypts passwords with biometric signatures',
              'It converts textual meaning into a mathematical list of coordinates in semantic space',
              'It compresses video files for Instagram Reels',
              'It restarts the computer server'
            ],
            correctIndex: 1,
            explanationEng: 'Embeddings convert text into dense mathematical vectors where concepts with similar meanings sit physically close together.',
            explanationTamil: 'Embedding என்பது சொற்களின் அர்த்தத்தை கணித ஆயத்தொலைவுகளாக (coordinates) மாற்றி தேடுதலை எளிதாக்குகிறது.'
          }
        ]
      }
    ]
  },
  {
    id: 'careers-it',
    title: 'Global Career Launchpad',
    tagline: 'Bridge learning into high-growth tech offers with real proof-of-work tactics.',
    iconName: 'Compass',
    color: 'from-amber-500 to-orange-500',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    difficultyLevel: 'All Levels',
    lessons: [
      {
        id: 'career-breaking-in',
        zoneId: 'careers-it',
        title: 'Bypassing the "0-2 Years Experience" Fresher Trap',
        difficulty: 'Beginner',
        readTime: '6 min read',
        xpReward: 100,
        requiresCoding: false,
        summary: 'Proven strategies for students and career switchers to showcase real capability over college pedigree.',
        prerequisites: ['Desire to enter modern digital and tech careers.'],
        learningObjectives: [
          'Build high-signal proof-of-work projects that capture recruiter attention.',
          'Structure GitHub repositories with documented README files and live demo links.',
          'Communicate technical problem-solving during campus and off-campus interviews.'
        ],
        sections: [
          {
            title: 'Proof of Work > Degree Tier',
            content: 'Tech recruiters do not want to see generic college projects like "ATM Simulation in C++" or "Library Management System". What catches their attention are live deployed web applications, clean GitHub repositories with documented README files, and tangible datasets cleaned and visualized on Tableau or Hugging Face.',
            tanglishAnalogy: 'If you want to hire a cricket batsman for your team, will you look at his certificate saying he studied cricket history, or will you watch him hit sixes in the nets? Your GitHub and projects are your batting highlights in the nets!'
          }
        ],
        workedExample: {
          title: 'High-Signal Project Showcase Formula',
          scenario: 'A fresher wants their resume to stand out among 500 applicants.',
          steps: [
            'Pick a localized, realistic problem (e.g., Chennai transit bus delays).',
            'Collect or scrape open public data, clean it in Pandas, and build an interactive dashboard.',
            'Deploy on a free public URL (Cloud Run, Vercel, HuggingFace Spaces).',
            'Record a 45-second screen demo walkthrough and pin it to LinkedIn and GitHub.'
          ],
          expectedOutput: '4x higher recruiter interview callback rate.'
        },
        practiceTask: {
          task: 'Visit the Skill Portfolio tab. Review the starter project blueprints and select one project you want to build this month.',
          hint: 'Aim for a project that solves a problem you personally find interesting.'
        },
        quiz: [
          {
            id: 'q-career-1',
            question: 'Which of the following projects creates the strongest signal for an AI/Data fresher resume?',
            options: [
              'Copy-pasted Titanic survival predictor without any custom analysis or live demo',
              'End-to-end deployed web app analyzing local city transit data with interactive filters and a GitHub README',
              'A screenshot of a certificate with no accompanying code repository',
              'A blank PDF resume with 20 listed programming languages'
            ],
            correctIndex: 1,
            explanationEng: 'End-to-end deployed projects that solve realistic or localized problems demonstrate initiative, full lifecycle competency, and real engineering aptitude.',
            explanationTamil: 'உண்மையான தரவுகளை எடுத்து, அதை நேரலையில் இயங்கும் செயலியாக மாற்றி GitHub-ல் காட்டுவதே தேர்வாளர்களை அதிகம் ஈர்க்கும்.'
          }
        ]
      }
    ]
  }
];

export const BADGES: Badge[] = [
  {
    id: 'cyber-initiate',
    title: 'Cyber Initiate',
    description: 'Completed your first AI Basics lesson and stepped into FutureAI World.',
    icon: 'Sparkles',
    category: 'Core'
  },
  {
    id: 'prompt-architect',
    title: 'Prompt Architect',
    description: 'Mastered structured RCTC prompt formulas and zero-shot guidance.',
    icon: 'Cpu',
    category: 'AI Tools'
  },
  {
    id: 'syntax-knight',
    title: 'Syntax Knight',
    description: 'Executed and debugged Python code in the interactive sandbox.',
    icon: 'Terminal',
    category: 'Coding'
  },
  {
    id: 'token-whisperer',
    title: 'Token Whisperer',
    description: 'Mastered LLM probability distributions in the token simulator.',
    icon: 'Brain',
    category: 'AI'
  },
  {
    id: 'query-specialist',
    title: 'Query Specialist',
    description: 'Successfully filtered corporate records using SQL database queries.',
    icon: 'Database',
    category: 'Analytics'
  },
  {
    id: 'bilingual-sage',
    title: 'Bilingual Sage',
    description: 'Consulted the AI Tutor in Tamil/Tanglish and aced an inline quiz.',
    icon: 'Languages',
    category: 'Tutor'
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Pioneer',
    description: 'Registered or verified your first real-world project in the Skill Portfolio.',
    icon: 'FolderGit2',
    category: 'Portfolio'
  },
  {
    id: 'future-architect',
    title: 'Future Architect',
    description: 'Built a customized career readiness plan across 3 IT skill nodes.',
    icon: 'Compass',
    category: 'Career'
  }
];
