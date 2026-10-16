import { PortfolioProject } from '../types';

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Food Delivery Rush Hour & Delay Analyzer',
    category: 'Data Analytics',
    roleTrack: 'Data Analyst',
    difficulty: 'Beginner',
    status: 'completed_verified',
    description: 'Cleaned and visualized 50,000 food delivery records to identify monsoon delivery delay clusters and optimize courier dispatch routes.',
    skillsDemonstrated: ['SQL Queries', 'Pandas Data Wrangling', 'Power BI Dashboards', 'Root Cause Analysis'],
    liveUrl: 'https://github.com/futureai-world/delivery-rush-analytics',
    githubUrl: 'https://github.com/futureai-world/delivery-rush-analytics',
    completedAt: 'October 2026',
    reflectionNotes: 'Learned how to handle missing GPS coordinates and grouped orders by peak dining hours (7 PM - 10 PM) using SQL window functions.'
  },
  {
    id: 'proj-2',
    title: 'Syllabus AI Q&A Assistant with RAG',
    category: 'AI Engineering',
    roleTrack: 'AI Engineer',
    difficulty: 'Intermediate',
    status: 'sample_starter',
    description: 'A semantic search assistant that indexes a 150-page university textbook into ChromaDB vector store and cites exact page numbers when answering student exam questions.',
    skillsDemonstrated: ['Vector Embeddings', 'ChromaDB', 'Python FastAPI', 'Prompt Grounding'],
    liveUrl: '',
    githubUrl: '',
    reflectionNotes: 'Starter Blueprint: Ready to build and deploy. Connect your PDF reader with an embedding model.'
  },
  {
    id: 'proj-3',
    title: 'Automated IT Resume Keyword Matcher',
    category: 'Software & Automation',
    roleTrack: 'Full-Stack Developer',
    difficulty: 'Beginner',
    status: 'sample_starter',
    description: 'A Python web application that parses tech job descriptions and provides a percentage match score with targeted bullet improvement suggestions.',
    skillsDemonstrated: ['Python', 'Regular Expressions', 'Streamlit / React', 'Text Extraction'],
    liveUrl: '',
    githubUrl: '',
    reflectionNotes: 'Starter Blueprint: High-signal project for junior developer resumes.'
  },
  {
    id: 'proj-4',
    title: 'Agricultural Leaf Disease Classifier',
    category: 'Machine Learning',
    roleTrack: 'Machine Learning Engineer',
    difficulty: 'Advanced',
    status: 'sample_starter',
    description: 'Trained a Convolutional Neural Network (CNN) in PyTorch on 10,000 crop leaf photos to diagnose tomato and rice blights with 94.6% validation accuracy.',
    skillsDemonstrated: ['PyTorch', 'Data Augmentation', 'CNNs', 'Model Evaluation & Metrics'],
    liveUrl: '',
    githubUrl: '',
    reflectionNotes: 'Starter Blueprint: Demonstrates computer vision and transfer learning fundamentals.'
  },
  {
    id: 'proj-excel',
    title: '12-Month Student Budget & Expense Forecaster',
    category: 'Data Analytics',
    roleTrack: 'Data Analyst',
    difficulty: 'Beginner',
    status: 'sample_starter',
    description: 'An automated 12-month student budget and expense forecasting model in Excel with XLOOKUP formulas, conditional variance formatting, and executive KPI dashboards.',
    skillsDemonstrated: ['Excel Formulas', 'XLOOKUP', 'Pivot Tables', 'Financial Forecasting', 'KPI Dashboards'],
    liveUrl: '',
    githubUrl: '',
    reflectionNotes: 'Starter Blueprint: Features monthly budget spreadsheets, expense breakdown dashboards, and a 12-month savings forecast model.'
  }
];
