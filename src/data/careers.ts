import { CareerTrack } from '../types';

export const CAREER_DISCLAIMER =
  'Important Notice: Compensation ranges represent typical industry benchmarks in India (INR LPA) and Global markets (USD) based on public compensation aggregator reports for entry-level to 3 YOE. FutureAI World does not promise guaranteed placement or compensation; individual outcomes depend strictly on market conditions, company hiring policies, portfolio depth, and demonstrated skills.';

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'ai-product-specialist',
    role: 'AI Product Specialist',
    tagline: 'Bridge business requirements with generative AI tools, prompt workflows, and client solutions.',
    salaryIndia: '₹6.0 - 15.0 LPA (Benchmark Range)',
    salaryGlobal: '$75,000 - $125,000 / year (Benchmark Range)',
    marketDemand: 'Emerging & High (Ideal for non-technical graduates & managers)',
    suitableFor: 'Non-coders, commerce/arts graduates, project coordinators, and business managers wanting to lead AI initiatives.',
    overview: 'AI Product Specialists identify high-value AI opportunities within businesses. They do not write raw neural network code; instead, they design prompt pipelines, test LLM solutions, evaluate AI tool vendors, and translate client needs into technical specifications.',
    dailyTasks: [
      'Evaluate third-party AI models (Gemini, Claude, GPT) for business use cases',
      'Design and audit corporate system prompt guidelines and brand guardrails',
      'Train internal sales, support, and marketing teams on AI productivity tools',
      'Collaborate with developers to establish model evaluation and human-in-the-loop review'
    ],
    interviewTips: [
      'Demonstrate deep familiarity with prompt architectures (RCTC, few-shot, structured JSON outputs).',
      'Showcase a case study where you audited an AI tool for safety, cost, and hallucination reduction.',
      'Explain how you would measure ROI on an AI customer support automation initiative.'
    ],
    coreSkills: [
      {
        id: 'ps-literacy',
        name: 'AI Capabilities & Strategic Evaluation',
        level: 'Beginner',
        estimatedTime: '2 weeks',
        tools: ['Gemini', 'ChatGPT Plus', 'Perplexity', 'Claude'],
        description: 'Knowing which foundation model fits specific tasks: summarization, multimodal vision, coding, or math.',
        projectIdea: 'Create an AI Tool ROI Matrix comparing cost, latency, and capabilities across top foundation models for a retail company.'
      },
      {
        id: 'ps-prompting',
        name: 'Advanced Prompt Engineering & Workflows',
        level: 'Beginner',
        estimatedTime: '2 weeks',
        tools: ['Prompt Engineering', 'Few-shot Templates', 'JSON Schemas'],
        description: 'Writing reproducible, bulletproof system instructions with edge-case guardrails.',
        projectIdea: 'Build an automated Customer Email Classifier that parses user complaints and generates categorized JSON payloads.'
      },
      {
        id: 'ps-ethics',
        name: 'AI Governance, Safety & Compliance',
        level: 'Intermediate',
        estimatedTime: '2 - 3 weeks',
        tools: ['Red Teaming', 'Bias Auditing', 'Data Privacy (GDPR/DPDP)'],
        description: 'Ensuring models do not leak PII (personally identifiable information) or exhibit harmful bias.',
        projectIdea: 'Publish a company-wide AI Usage Policy Document detailing approved data flows, citation rules, and risk mitigations.'
      }
    ]
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst',
    tagline: 'Translate unstructured business data into executive growth decisions, SQL reports, and dashboards.',
    salaryIndia: '₹4.5 - 12.0 LPA (Benchmark Range)',
    salaryGlobal: '$65,000 - $95,000 / year (Benchmark Range)',
    marketDemand: 'High (Over 45,000+ open IT positions globally)',
    suitableFor: 'Beginners with good analytical thinking, spreadsheet lovers, and STEM/Commerce graduates.',
    overview: 'Data Analysts work at the crossroads of business and technology. They gather data from SQL databases, clean missing entries in Python or Excel, build executive KPI dashboards in PowerBI or Tableau, and present findings to department leaders.',
    dailyTasks: [
      'Write complex SQL queries to pull weekly customer churn and revenue numbers',
      'Design interactive PowerBI / Tableau dashboards for product managers',
      'Clean messy customer feedback forms and CSV logs with Python Pandas',
      'Communicate statistical outliers and opportunities to business stakeholders'
    ],
    interviewTips: [
      'Be prepared for a live SQL test with JOIN, GROUP BY, and window functions (e.g., RANK, DENSE_RANK).',
      'Always structure behavioral answers using the STAR method (Situation, Task, Action, Result) with quantitative metrics.',
      'Showcase one real-world dashboard on GitHub or NovyPro analyzing public datasets like Airbnb, Swiggy, or IPL matches.'
    ],
    coreSkills: [
      {
        id: 'da-excel',
        name: 'Advanced Excel & Spreadsheets',
        level: 'Beginner',
        estimatedTime: '1 - 2 weeks',
        tools: ['Excel', 'Google Sheets', 'XLOOKUP', 'Pivot Tables'],
        description: 'The ubiquitous foundation of business logic. Master Pivot Tables, nested formulas, XLOOKUP, and conditional formatting.',
        projectIdea: 'Build an automated 12-month student budget & expense forecaster with scenario analysis and dynamic charts.'
      },
      {
        id: 'da-sql',
        name: 'Relational Databases & SQL',
        level: 'Beginner',
        estimatedTime: '3 - 4 weeks',
        tools: ['PostgreSQL', 'MySQL', 'DBeaver', 'BigQuery'],
        description: 'Writing queries to slice, dice, join, and aggregate million-row database tables without lag.',
        projectIdea: 'Write SQL queries to analyze 50,000 food delivery orders to find peak ordering hours and top delivery bottlenecks.'
      },
      {
        id: 'da-python',
        name: 'Python for Data Wrangling (Pandas & NumPy)',
        level: 'Intermediate',
        estimatedTime: '3 - 4 weeks',
        tools: ['Python', 'Pandas', 'NumPy', 'Jupyter Notebooks'],
        description: 'Automate data cleaning, handle missing nulls, transform date formats, and perform statistical correlation.',
        projectIdea: 'Clean and merge multi-city Airbnb listing datasets to find underpriced vacation rentals with high review scores.'
      },
      {
        id: 'da-bi',
        name: 'Business Intelligence Dashboards (Power BI / Tableau)',
        level: 'Intermediate',
        estimatedTime: '2 - 3 weeks',
        tools: ['Power BI', 'Tableau Public', 'DAX Formulas'],
        description: 'Crafting visually compelling, interactive executive dashboards with drill-downs and real-time filters.',
        projectIdea: 'Create an interactive Cricket League Performance Dashboard tracking player strike rates and winning margins.'
      }
    ]
  },
  {
    id: 'ai-engineer',
    role: 'AI Engineer',
    tagline: 'Architect intelligent software by connecting LLMs, vector search, and agentic workflows.',
    salaryIndia: '₹8.0 - 22.0 LPA (Benchmark Range)',
    salaryGlobal: '$95,000 - $160,000 / year (Benchmark Range)',
    marketDemand: 'Hyper-Growth (Fastest growing engineering job category)',
    suitableFor: 'Learners with basic Python/JavaScript skills eager to build modern AI-powered applications.',
    overview: 'AI Engineers build user-facing products powered by state-of-the-art foundation models. Instead of training multi-billion parameter models from scratch, they connect LLMs (Gemini, Claude, GPT), vector databases, Retrieval-Augmented Generation (RAG) pipelines, and autonomous agents into production web and mobile apps.',
    dailyTasks: [
      'Design and benchmark multi-turn system prompts and few-shot templates',
      'Build Retrieval-Augmented Generation (RAG) pipelines over company PDF document vaults',
      'Optimize API latency and token cost using model routing, caching, and embeddings',
      'Integrate AI tool calling / function calling to connect models with external APIs and databases'
    ],
    interviewTips: [
      'Be ready to explain how RAG works end-to-end: chunking, embedding generation, vector similarity search, and synthesized response.',
      'Know the differences between fine-tuning vs prompt engineering vs RAG, including cost and use cases.',
      'Deploy at least one full-stack AI app (FastAPI/Express + React + LLM API) with a live public URL.'
    ],
    coreSkills: [
      {
        id: 'ai-python-api',
        name: 'Python, Async Programming & REST APIs',
        level: 'Beginner',
        estimatedTime: '3 weeks',
        tools: ['Python 3.11+', 'FastAPI', 'Pydantic', 'AsyncIO'],
        description: 'Building ultra-fast asynchronous REST APIs to serve AI endpoints with strict schema validation.',
        projectIdea: 'Build an API that accepts college lecture notes in PDF and returns structured study flashcards and MCQ quizzes.'
      },
      {
        id: 'ai-llm-sdks',
        name: 'Foundation Model SDKs & Prompt Design',
        level: 'Intermediate',
        estimatedTime: '2 weeks',
        tools: ['@google/genai', 'OpenAI SDK', 'Structured Outputs', 'Function Calling'],
        description: 'Mastering model parameters, JSON schema enforcement, multi-modal vision inputs, and tool invocation.',
        projectIdea: 'Develop a multimodal receipt auditor that extracts line items from smartphone photos directly into JSON.'
      },
      {
        id: 'ai-rag',
        name: 'Vector Databases & RAG Architecture',
        level: 'Intermediate',
        estimatedTime: '3 - 4 weeks',
        tools: ['Pinecone', 'ChromaDB', 'LangChain', 'LlamaIndex'],
        description: 'Chunking long documents, generating dense embeddings, and executing semantic cosine-similarity search.',
        projectIdea: 'Create a "Chat with College Syllabus" AI assistant that cites exact syllabus page numbers when answering exam doubts.'
      },
      {
        id: 'ai-agents',
        name: 'AI Agents & Multi-Step Reasoning',
        level: 'Advanced',
        estimatedTime: '3 weeks',
        tools: ['LangGraph', 'CrewAI', 'Tool Calling'],
        description: 'Designing autonomous agents capable of planning, executing sequential tool calls, verifying output, and self-correcting.',
        projectIdea: 'Build an automated IT Job Application Researcher that searches open postings, scrapes job descriptions, and tailors your resume bullets.'
      }
    ]
  },
  {
    id: 'software-developer',
    role: 'Full-Stack Software Developer',
    tagline: 'Build scalable web applications, REST APIs, and modern responsive user experiences.',
    salaryIndia: '₹5.5 - 16.0 LPA (Benchmark Range)',
    salaryGlobal: '$80,000 - $135,000 / year (Benchmark Range)',
    marketDemand: 'Steady & High (Universal need across all digital industries)',
    suitableFor: 'Learners who love building web apps, mobile interfaces, and clean coding architectures.',
    overview: 'Full-Stack Software Developers create the applications people interact with daily. They build responsive client interfaces using React/TypeScript and write robust backend services with Node.js or Python to manage databases, authentication, and payments.',
    dailyTasks: [
      'Build responsive frontend components with React, Tailwind CSS, and TypeScript',
      'Create and test secure server-side REST/GraphQL API endpoints',
      'Design relational database schemas and manage migrations',
      'Deploy applications to cloud platforms (Docker, Cloud Run, Vercel)'
    ],
    interviewTips: [
      'Expect coding rounds focused on Data Structures & Algorithms (arrays, strings, hash maps).',
      'Understand how frontend state management, browser rendering, and HTTP protocols operate.',
      'Showcase at least one full-stack project with user authentication and database persistence.'
    ],
    coreSkills: [
      {
        id: 'dev-frontend',
        name: 'Modern React & TypeScript',
        level: 'Beginner',
        estimatedTime: '3 - 4 weeks',
        tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        description: 'Component architecture, reactive hooks (useState, useEffect), and clean type-safe UI patterns.',
        projectIdea: 'Build an interactive Task & Study Planner with local persistence and keyboard shortcuts.'
      },
      {
        id: 'dev-backend',
        name: 'Node.js & Express REST APIs',
        level: 'Intermediate',
        estimatedTime: '3 weeks',
        tools: ['Node.js', 'Express', 'JWT Auth', 'PostgreSQL'],
        description: 'Server routing, middleware, authentication flows, and error handling protocols.',
        projectIdea: 'Create a secured User Management API with JWT tokens and password hashing.'
      },
      {
        id: 'dev-deployment',
        name: 'Cloud Deployment & DevOps Basics',
        level: 'Intermediate',
        estimatedTime: '2 weeks',
        tools: ['Git', 'GitHub Actions', 'Docker', 'Vercel / Cloud Run'],
        description: 'Version control workflows, CI/CD pipeline basics, containerization, and public hosting.',
        projectIdea: 'Set up an automated GitHub Actions workflow that lints, builds, and deploys your web app upon every git push.'
      }
    ]
  },
  {
    id: 'ml-engineer',
    role: 'Machine Learning Engineer',
    tagline: 'Train, fine-tune, optimize, and deploy mathematical models at planetary scale.',
    salaryIndia: '₹9.0 - 25.0 LPA (Benchmark Range)',
    salaryGlobal: '$110,000 - $175,000 / year (Benchmark Range)',
    marketDemand: 'Specialized (Requires strong math and model lifecycle understanding)',
    suitableFor: 'Learners with strong mathematical inclination, CS/Engineering backgrounds, or research passion.',
    overview: 'Machine Learning Engineers focus on the mathematical algorithms, data pipelines, model training loops, and production inference systems. They understand loss functions, gradient descent, feature engineering, and MLOps infrastructure needed to keep models accurate over time.',
    dailyTasks: [
      'Clean, normalize, and construct training and validation datasets',
      'Train baseline Scikit-Learn models and deep neural networks in PyTorch',
      'Evaluate model metrics: Precision, Recall, F1-Score, ROC-AUC, and Loss Curves',
      'Containerize models with Docker and serve them via high-throughput inference engines'
    ],
    interviewTips: [
      'Expect mathematical questions on gradient descent, bias-variance tradeoff, and regularizers (L1/L2).',
      'Practice writing PyTorch custom dataset loaders, training loops, and backward pass code by hand.',
      'Show understanding of model drift and how to monitor model degradation in production.'
    ],
    coreSkills: [
      {
        id: 'ml-math',
        name: 'Applied Math: Linear Algebra & Calculus',
        level: 'Beginner',
        estimatedTime: '3 weeks',
        tools: ['NumPy', 'Matrix Math', 'Derivatives', 'Statistics'],
        description: 'Understanding vectors, dot products, eigenvalues, gradients, and probability density functions.',
        projectIdea: 'Implement a linear regression and logistic regression algorithm from scratch in raw NumPy without Scikit-learn.'
      },
      {
        id: 'ml-scikit',
        name: 'Classical Machine Learning (Scikit-Learn)',
        level: 'Intermediate',
        estimatedTime: '3 - 4 weeks',
        tools: ['Scikit-Learn', 'XGBoost', 'LightGBM', 'Hyperopt'],
        description: 'Supervised and unsupervised algorithms: Random Forests, Gradient Boosted Trees, K-Means, and PCA.',
        projectIdea: 'Predict student placement outcomes using college test scores, attendance, and branch records with 92%+ F1-Score.'
      },
      {
        id: 'ml-deeplearning',
        name: 'Deep Learning with PyTorch',
        level: 'Advanced',
        estimatedTime: '4 - 5 weeks',
        tools: ['PyTorch', 'TorchVision', 'Transformers (Hugging Face)'],
        description: 'Convolutional neural networks (CNNs), Recurrent networks (RNNs/LSTMs), and Transformer attention blocks.',
        projectIdea: 'Train a custom PyTorch model to detect plant diseases from agricultural leaf photos with 95% accuracy.'
      },
      {
        id: 'ml-mlops',
        name: 'MLOps, Docker & Model Deployment',
        level: 'Advanced',
        estimatedTime: '3 weeks',
        tools: ['Docker', 'MLflow', 'ONNX', 'AWS / GCP / HuggingFace Spaces'],
        description: 'Packaging trained model weights into lightweight containers, tracking experiments, and serving predictions.',
        projectIdea: 'Deploy a fine-tuned sentiment classifier inside a Docker container with automated health checks on HuggingFace Spaces.'
      }
    ]
  }
];
