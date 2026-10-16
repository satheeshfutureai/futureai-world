import { QuizQuestion } from '../types';

export interface TutorResponse {
  keywords: string[];
  title: string;
  en: string;
  tanglish: string;
  ta: string;
  analogy: string;
  quickQuiz: QuizQuestion;
  guidedPractice?: {
    goal: string;
    starterText: string;
    solutionHint: string;
  };
}

export interface ErrorHelpItem {
  id: string;
  errorName: string;
  category: 'Python' | 'SQL' | 'AI APIs' | 'General';
  sampleErrorMessage: string;
  explanationEng: string;
  explanationTanglish: string;
  explanationTamil: string;
  fixSolution: string;
}

export const COMMON_ERRORS_DATABASE: ErrorHelpItem[] = [
  {
    id: 'err-indent',
    errorName: 'IndentationError: unexpected indent',
    category: 'Python',
    sampleErrorMessage: 'IndentationError: expected an indented block after "if" statement on line 4',
    explanationEng: 'Python uses spaces (indentation) instead of curly braces {} to know which lines belong inside a function, loop, or if-statement. If the spacing is uneven or missing, Python stops immediately.',
    explanationTanglish: 'Python-la curly braces {} kidayathu boss! Spacing thaan block structure. "if" or "for" loop-ku apram 4 spaces (oru tab) thalli code ezhuthanum. Line align aagala-na indha error varum.',
    explanationTamil: 'பைத்தானில் அடைப்புக்குறிகளுக்கு (brackets) பதிலாக இடைவெளி (indentation) பயன்படுகிறது. இடைவெளிகள் சீரற்ற முறையில் இருந்தால் இந்த பிழை தோன்றும்.',
    fixSolution: `def check_score(mark):
    # Ensure exactly 4 spaces indentation here:
    if mark >= 50:
        print("Pass")
    else:
        print("Need Practice")`
  },
  {
    id: 'err-name',
    errorName: "NameError: name 'df' is not defined",
    category: 'Python',
    sampleErrorMessage: "NameError: name 'df' is not defined",
    explanationEng: 'You tried to use a variable or library before defining or importing it. Usually happens when you forget "import pandas as pd" or did not run the previous cell.',
    explanationTanglish: 'Oru variable-ah create panrathuku munnadiye adha use panna try panreenga! Pandas use panna munnadi "import pandas as pd" potoma nu check pannunga.',
    explanationTamil: 'ஒரு மாறியை (variable) அல்லது லைப்ரரியை வரையறுப்பதற்கு முன்பே பயன்படுத்தும்போது இந்தப் பிழை ஏற்படுகிறது.',
    fixSolution: `import pandas as pd

# Define df first before calling it:
df = pd.read_csv('students.csv')
print(df.head())`
  },
  {
    id: 'err-type',
    errorName: 'TypeError: can only concatenate str (not "int") to str',
    category: 'Python',
    sampleErrorMessage: 'TypeError: can only concatenate str (not "int") to str',
    explanationEng: 'You are attempting to add text (string) and a raw number together using "+". Python requires you to convert numbers to strings using str(number) or use f-strings.',
    explanationTanglish: 'Text-um Number-um direct-ah "+" panna mudiyathu! Python confuse aagidum. f-string use pannunga: f"Score is {score}" or str(score) use pannunga.',
    explanationTamil: 'எழுத்துக்களையும் (String) எண்களையும் (Integer) நேரடியாக "+" குறியீடு கொண்டு சேர்க்க முடியாது; str() மூலம் மாற்ற வேண்டும்.',
    fixSolution: `age = 22
# Correct way with f-string:
print(f"Candidate age is: {age}")
# Or using str():
print("Candidate age is: " + str(age))`
  },
  {
    id: 'err-key',
    errorName: "KeyError: 'salary'",
    category: 'SQL',
    sampleErrorMessage: "KeyError: 'salary' not found in DataFrame columns",
    explanationEng: 'You asked for a column name that does not exist or has a slight typo (like a trailing space or wrong capitalization).',
    explanationTanglish: 'Table or Dictionary-la neenga keta column name illa! Spelling mistake irukkalam (eg: "Salary" with capital S, or "salary "). print(df.columns) panni verify pannunga.',
    explanationTamil: 'அட்டவணையில் நீங்கள் குறிப்பிட்ட பெயர் கொண்ட காலம் (column) இல்லை அல்லது எழுத்துப் பிழை உள்ளது.',
    fixSolution: `# Check existing columns first:
print(df.columns.tolist())
# Access with exact matching string:
df['Salary']`
  },
  {
    id: 'err-ratelimit',
    errorName: 'API RateLimitError: 429 Quota Exceeded',
    category: 'AI APIs',
    sampleErrorMessage: 'ResourceExhausted: 429 You exceeded your current quota, please check your plan.',
    explanationEng: 'You sent too many AI requests within a minute, or reached the free tier token threshold. Handled in production with exponential backoff or caching.',
    explanationTanglish: 'Oru nimishathula romba fast-ah AI-ku requests anupitteenga! Free tier quota mudinjuruchu. Production-la exponential backoff retry logic or request caching use pannuvom.',
    explanationTamil: 'குறுகிய காலத்தில் அதிகமான கோரிக்கைகள் அனுப்பப்படும்போது ஏபிஐ ஒதுக்கீடு (Quota) முடிந்து இந்த பிழை வரும்.',
    fixSolution: `import time

def call_ai_with_retry(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.models.generate_content(...)
        except Exception as e:
            time.sleep(2 ** attempt)  # Wait 1s, 2s, 4s...`
  }
];

export const TUTOR_KNOWLEDGE_BASE: TutorResponse[] = [
  {
    keywords: ['neural network', 'deep learning', 'brain', 'layers', 'neuron'],
    title: 'Neural Networks & Deep Learning',
    en: 'An Artificial Neural Network (ANN) is a computational model inspired by the biological neurons in the human brain. It consists of an input layer, one or more hidden layers, and an output layer. As data flows through nodes, weights and biases adjust to minimize prediction errors.',
    tanglish: 'Neural Network-na oru periya team mathiri! Namma moolai-la irukkura neurons mathiri layers irukkum (Input layer -> Hidden layers -> Output layer). Oru photo-la cat irukka nu kandupidikka, ovvoru layer-um lines, shapes, ears nu step-by-step-ah identify pannum. Thappana answer vantha weights-ah adjust panni improve aagum!',
    ta: 'செயற்கை நரம்பியல் வலையமைப்பு (Artificial Neural Network) என்பது மனித மூளையின் நியூரான்களைப் போன்று செயல்படும் கணினி அமைப்பாகும். இதில் உள்ளீட்டு அடுக்கு (Input), மறைக்கப்பட்ட அடுக்குகள் (Hidden layers) மற்றும் வெளியீட்டு அடுக்கு (Output) இருக்கும். கணக்கீட்டுப் பிழைகளைக் குறைத்து இது துல்லியமான முடிவுகளை எடுக்கிறது.',
    analogy: '🏏 Cricket Field Analogy: Just like 11 cricket players adjust their positions based on the batsman’s shot direction, neural network layers adjust their mathematical weights after each ball to stop boundaries!',
    quickQuiz: {
      id: 'quiz-tutor-nn',
      question: 'In a neural network, what role do "hidden layers" play?',
      options: [
        'They hide confidential user passwords from hackers',
        'They extract intermediate features like edges, shapes, and patterns',
        'They delete empty rows from the database',
        'They slow down the computer to save electricity'
      ],
      correctIndex: 1,
      explanationEng: 'Hidden layers perform mathematical transformations to extract abstract features and hierarchical patterns from raw data.',
      explanationTamil: 'Hidden layers என்பது தரவுகளில் உள்ள வடிவங்கள் (patterns) மற்றும் சிறப்பம்சங்களை பிரித்தெடுக்கின்றன.'
    },
    guidedPractice: {
      goal: 'Identify the layers of an image classifier',
      starterText: 'If you want an AI to distinguish photos of dogs from cats, what would be the input layer and output layer?',
      solutionHint: 'Input layer = Image pixel values (width x height x RGB). Output layer = Probability score (e.g. 92% Cat, 8% Dog).'
    }
  },
  {
    keywords: ['overfitting', 'underfitting', 'memorize', 'generalize', 'bias variance'],
    title: 'Overfitting vs Underfitting',
    en: 'Overfitting occurs when an ML model memorizes the training data too closely, including random noise, causing it to fail on new real-world data. Underfitting is when the model is too simple to capture even the basic underlying trends.',
    tanglish: 'Overfitting-na romba simple! Oru student exam-ku textbook-la irukura previous year questions mattum answer-oda "mana-paadam" (rote memorization) pannitu poran. Question konjam maathi keta complete blank aagiduvan! Adhu thaan Overfitting. Training data-la 100% score varum, aana new data-la fail aagidum.',
    ta: 'ஓவர்ஃபிட்டிங் (Overfitting) என்பது ஒரு மாதிரி முந்தைய பயிற்சித் தரவுகளை அப்படியே மனப்பாடம் செய்து, புதிய தரவுகளில் தவறான முடிவுகளைத் தரும் நிலையாகும். அண்டர்ஃபிட்டிங் (Underfitting) என்பது மாதிரி மிக எளிமையாக இருந்து அடிப்படை போக்கையே புரிந்துகொள்ளாமல் இருப்பது.',
    analogy: '📚 Exam Analogy: Memorizing past question papers word-for-word vs actually understanding the concepts so you can solve any twisted question.',
    quickQuiz: {
      id: 'quiz-tutor-overfit',
      question: 'How do engineers prevent overfitting in Machine Learning models?',
      options: [
        'By deleting all test data completely',
        'By using regularization (L1/L2), dropout, and cross-validation',
        'By always keeping the model training indefinitely for weeks',
        'By converting all numbers into text strings'
      ],
      correctIndex: 1,
      explanationEng: 'Regularization, cross-validation, and pruning help prevent the model from memorizing noise and encourage generalization.',
      explanationTamil: 'Regularization மற்றும் cross-validation மூலமாக ஓவர்ஃபிட்டிங்கை தடுத்து புதிய தரவுகளிலும் துல்லியமாக செயல்பட வைக்கலாம்.'
    }
  },
  {
    keywords: ['python', 'language', 'why python', 'coding', 'syntax'],
    title: 'Why Python is King of AI',
    en: 'Python dominates AI because of its clean, readable syntax and unparalleled library ecosystem. High-performance C/C++ engines (like PyTorch and TensorFlow) run under the hood while providing a simple, expressive Python interface for developers.',
    tanglish: 'Yen ellarum Python use panranga? First reason: Romba simple syntax, English padikira maariye irukkum. Second reason: Ulagathula irukura best AI libraries (NumPy, Pandas, PyTorch, Scikit-learn) ellame Python-ku ready-made-ah kedaikkum. Neenga scratch-la irunthu code ezhutha theva illa!',
    ta: 'பைதான் (Python) எளிமையான ஆங்கிலம் போன்ற அமைப்பைக் கொண்டுள்ளதால் தொடக்கநிலையாளர்கள் எளிதில் கற்கலாம். மேலும் PyTorch, TensorFlow போன்ற உலகத்தரம் வாய்ந்த AI நூலகங்கள் பைதானில் மிகச் சிறப்பாக இயங்குகின்றன.',
    analogy: '🧩 Lego Analogy: Writing raw C++ is like melting plastic to mold each brick. Python is getting a box of pre-made magnetic Lego blocks where you snap together a rocket in minutes!',
    quickQuiz: {
      id: 'quiz-tutor-py',
      question: 'Which Python library is most widely used for working with tabular DataFrames?',
      options: ['Django', 'Pandas', 'Flask', 'Pygame'],
      correctIndex: 1,
      explanationEng: 'Pandas is the industry standard Python library for data manipulation and tabular DataFrame analysis.',
      explanationTamil: 'அட்டவணை தரவுகளைக் கையாள Pandas லைப்ரரி அதிகம் பயன்படுகிறது.'
    }
  },
  {
    keywords: ['data analyst vs ai engineer', 'difference', 'salary', 'compare', 'role'],
    title: 'Data Analyst vs AI Engineer',
    en: 'A Data Analyst focuses on historical data to answer "What happened and why?", using SQL, Excel, and PowerBI. An AI Engineer builds production software that leverages generative AI models, APIs, vector databases, and agentic pipelines to automate future actions.',
    tanglish: 'Data Analyst-na company-oda past sales, customer churn-ah analyze panni reports & dashboards ready pannuvanga (Tools: SQL, Power BI, Excel). AI Engineer-na ChatGPT / Gemini model-galai connect panni, real-time products, chatbot, automation software build pannuvanga. Rendu-me super demand field!',
    ta: 'டேட்டா அனலிஸ்ட் (Data Analyst) என்பவர் ஏற்கனவே உள்ள வணிகத் தரவுகளை ஆராய்ந்து முடிவுகளை எடுக்க உதவுகிறார் (SQL, Power BI). AI இன்ஜினியர் (AI Engineer) என்பவர் செயற்கை நுண்ணறிவு மாதிரிகளை மென்பொருள்களோடு இணைத்து உருவாக்குகிறார்.',
    analogy: '🧭 Navigator vs Engine Builder: A Data Analyst is like the ship navigator looking at the sea charts and wind history. The AI Engineer installs an autopilot turbine that steers through storms automatically!',
    quickQuiz: {
      id: 'quiz-tutor-da-ai',
      question: 'Which tool is essential for almost every Data Analyst interview?',
      options: ['Unreal Engine', 'SQL (Structured Query Language)', 'Blender 3D', 'Kubernetes'],
      correctIndex: 1,
      explanationEng: 'SQL is the foundation for extracting, filtering, and aggregating relational database records in analyst interviews.',
      explanationTamil: 'டேட்டா அனலிஸ்ட் நேர்முகத் தேர்வுகளில் SQL மிக முக்கியமானதாகும்.'
    }
  },
  {
    keywords: ['fresher', 'job', 'it job', 'career', 'college', 'resume', 'interview', 'get job'],
    title: 'How Anyone Can Break Into Tech',
    en: 'To bypass the experience trap, build proof of work: deploy 2 to 3 live web apps with documented GitHub README files, contribute to open source or build local problem solvers, and practice live SQL/coding tests rather than collecting paper certificates.',
    tanglish: 'College freshers and career switchers panra common mistake: வெறும் resume-la "Java, Python, C++" nu list pottu veppanga, aana single project kooda run aagathu! Neenga enna pannanum theriyuma? 2 nalla project-ah live URL-oda host pannunga. GitHub link kudunga. Interviewer-kitta code explain panna kathukonga. Offer guarantee!',
    ta: 'கல்லூரி மாணவர்கள் மற்றும் புதியவர்கள் சான்றிதழ்களை மட்டும் சேகரிக்காமல், நேரலையில் இயங்கும் 2 அல்லது 3 மென்பொருள் திட்டங்களை (Projects) உருவாக்கி GitHub-ல் பதிவேற்றம் செய்ய வேண்டும். இதுவே தேர்வாளர்களிடையே உங்கள் மதிப்பை உயர்த்தும்.',
    analogy: '🏏 Cricket Nets Analogy: A batsman who hits sixes in live practice matches gets selected faster than someone holding a book on cricket rules!',
    quickQuiz: {
      id: 'quiz-tutor-job',
      question: 'What gives a candidate the highest advantage during technical screening?',
      options: [
        'A 5-page resume listing 30 programming languages without links',
        'A clean GitHub repository with a live deployed project and clear README',
        'Paying money for 10 generic online completion certificates',
        'Waiting until after graduation before touching any project'
      ],
      correctIndex: 1,
      explanationEng: 'A live project with documented code provides tangible proof of engineering capability and initiative.',
      explanationTamil: 'நேரலையில் இயங்கும் ப்ராஜெக்ட் மற்றும் GitHub கோப்புகள் தேர்வாளர்களுக்கு நேரடி நம்பிக்கையைத் தரும்.'
    }
  },
  {
    keywords: ['rag', 'fine tuning', 'llm', 'retrieval', 'vector', 'documents'],
    title: 'RAG vs Fine-Tuning Explained',
    en: 'RAG (Retrieval-Augmented Generation) gives an LLM an open textbook: it searches your specific documents and feeds the excerpts into the prompt. Fine-tuning is training the model on thousands of examples to change its style, vocabulary, or internal tone.',
    tanglish: 'RAG-na "Open Book Exam" mathiri! Model-kitta namma company PDF files-ah thedi answer panna solrom. Fine-tuning-na "Intense Training" mathiri, model-oda style or tone-ah permanent-ah change panrom. 90% college & startup projects-ku RAG thaan best & cheaper!',
    ta: 'RAG என்பது ஒரு திறந்த புத்தகத் தேர்வு போன்றது; அது உங்கள் சொந்த ஆவணங்களைத் தேடி சரியான விடையைத் தரும். ஃபைன்-டியூனிங் (Fine-tuning) என்பது மாதிரியின் இயல்பையே புதிய தரவுகள் மூலம் மாற்றுவதாகும்.',
    analogy: '📖 Open Book Exam vs Medical Residency: RAG is looking up the exact medical formula in a textbook when needed. Fine-tuning is going through 5 years of medical school to speak like a surgeon.',
    quickQuiz: {
      id: 'quiz-tutor-rag',
      question: 'Why do most companies choose RAG over fine-tuning for document search?',
      options: [
        'Because RAG is completely illegal in corporate IT',
        'RAG is faster to update, cheaper, and prevents outdated model hallucinations by citing exact source chunks',
        'Fine-tuning requires zero computing power',
        'RAG only works in the year 2024'
      ],
      correctIndex: 1,
      explanationEng: 'RAG connects models directly to verifiable private documentation without expensive re-training cycles.',
      explanationTamil: 'RAG முறை குறைந்த செலவிலும், ஆவணங்களை எளிதாக மாற்றியமைக்கும் வகையிலும் அமைகிறது.'
    }
  }
];

export const STARTER_QUESTIONS = [
  'Explain Neural Networks like Filter Coffee',
  'What is Overfitting in Tamil / Tanglish?',
  'Why is Python King of AI?',
  'Data Analyst vs AI Engineer salary',
  'How can a fresher get an IT job?',
  'What is RAG vs Fine-tuning?'
];
