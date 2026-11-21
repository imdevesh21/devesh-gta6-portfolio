import { ExperienceItem, ProjectItem, SkillWeapon, CertificationItem } from '../types/portfolio';

export const OPERATIVE_PROFILE = {
  name: "Devesh Sharma",
  codename: "The Full-Stack Architect",
  title: "Full Stack Developer",
  wantedLevel: 5,
  bounty: "$1,540,890",
  location: "Jaipur, Rajasthan, India",
  coordinates: "26.9124° N, 75.7873° E",
  contact: {
    phone: "+91-7976063461",
    email: "Deveshsharma.it23@gmail.com",
    linkedin: "https://linkedin.com/in/devesh-sharma",
    github: "https://github.com/imdevesh21",
    portfolio: "https://deveshportfolio.vercel.app"
  },
  education: {
    institution: "Jaipur Engineering College and Research Center",
    degree: "Bachelor of Technology – Information Technology",
    period: "Dec 2020 – Jun 2023",
    cgpa: "7.58 / 10"
  },
  summary: "Full Stack Developer (B.Tech IT) with 1+ year of hands-on experience across an ERP product company, an EdTech startup, and AI/LLM training work. Build end-to-end features using Next.js, Node.js, TypeScript, and SQL, including payment integration, real-time communities, and API performance optimisation (40–60% faster data fetching). Solved 150+ DSA problems, built and deployed multiple live projects, and hold Google Cloud certifications. Open to full-stack, frontend, and software engineering roles.",
  vitals: {
    healthLabel: "HEALTH (UI/UX VELOCITY)",
    healthVal: 98,
    armorLabel: "ARMOR (BACKEND & CLOUD DEFENSE)",
    armorVal: 95
  },
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks & Security",
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Cloud Computing (GCP)"
  ]
};

export const WEAPON_SKILLS: SkillWeapon[] = [
  {
    id: "nextjs",
    name: "NEXT.JS & REACT.JS",
    weaponClass: "Assault Rifle // High DPS Frontend",
    icon: "⚡",
    category: "frontend",
    description: "Architects lightning-fast App Router workflows, Server Components, client hydration, and responsive layouts. Proven in enterprise ERP and real-time medical platforms.",
    fireRate: 98,
    damage: 95,
    accuracy: 94,
    battleground: "Vyn Automation ERP & Simplified Learning"
  },
  {
    id: "nodejs",
    name: "NODE.JS & REST APIS",
    weaponClass: "Heavy Machine Gun // High Throughput",
    icon: "🔥",
    category: "backend",
    description: "High-concurrency micro-services, authenticated session handling, and backend optimization that shaved enterprise API latency by 40-60%.",
    fireRate: 95,
    damage: 96,
    accuracy: 92,
    battleground: "Vyn Automation Services & Stealth EdTech"
  },
  {
    id: "typescript",
    name: "TYPESCRIPT & SQL",
    weaponClass: "Sniper Rifle // Zero Runtime Error",
    icon: "🎯",
    category: "languages",
    description: "Strict compile-time type verification paired with surgical SQL query design across MySQL and PostgreSQL. Eliminates null pointer exceptions and query bottlenecks.",
    fireRate: 94,
    damage: 94,
    accuracy: 99,
    battleground: "Enterprise Relational DBs & Type-Safe APIs"
  },
  {
    id: "socketio",
    name: "SOCKET.IO & CHROME APIS",
    weaponClass: "Stealth Interceptor // Real-Time Streams",
    icon: "📡",
    category: "frontend",
    description: "Bidirectional WebSocket communication for live student communities and low-level browser DOM caching algorithms with zero layout shifts.",
    fireRate: 92,
    damage: 90,
    accuracy: 96,
    battleground: "LinkedIn Dev Filter & EdTech Community"
  },
  {
    id: "ai",
    name: "RLHF & PROMPT FINE-TUNING",
    weaponClass: "Cyber Drone // Neural Intelligence",
    icon: "🧠",
    category: "ai",
    description: "200+ engineered training prompts across reasoning and code generation; 500+ RLHF safety annotations; ~15% benchmark boost via adversarial stress-tests.",
    fireRate: 94,
    damage: 93,
    accuracy: 96,
    battleground: "Outlier.ai Frontier LLM Alignment"
  },
  {
    id: "gcp",
    name: "GCP SECURITY & IAM",
    weaponClass: "Tactical Body Armor // Defense Grid",
    icon: "🛡️",
    category: "cloud",
    description: "Google Cloud Security Challenge Level 1 & 2 recognized. Implements zero-trust IAM privilege boundaries, VPC protection, and encrypted cloud storage.",
    fireRate: 90,
    damage: 97,
    accuracy: 98,
    battleground: "Google Cloud Platform Verified Challenges"
  },
  {
    id: "tailwind",
    name: "TAILWIND CSS & FRAMER MOTION",
    weaponClass: "Holographic Camo // 60FPS Aesthetics",
    icon: "🎨",
    category: "frontend",
    description: "Modular styling, BEM architecture, and spring physics micro-interactions that scored 90+ on Google Lighthouse with zero CLS layout shift.",
    fireRate: 99,
    damage: 91,
    accuracy: 95,
    battleground: "TechBlaz IT SaaS & StafLance Landing"
  },
  {
    id: "dsa",
    name: "C++ & ALGORITHMIC DSA",
    weaponClass: "High-Velocity Katana // 150+ Solved",
    icon: "⚔️",
    category: "algorithmic",
    description: "100+ day unbroken streak across LeetCode, GeeksforGeeks, and Coding Ninjas. High mastery in DP, Graphs, Binary Trees, and Arrays.",
    fireRate: 96,
    damage: 95,
    accuracy: 96,
    battleground: "LeetCode, GeeksforGeeks, Coding Ninjas"
  }
];

export const HEIST_CAMPAIGNS: ExperienceItem[] = [
  {
    id: "vyn-automation",
    role: "Full Stack Developer",
    company: "Vyn Automation Pvt Ltd",
    location: "Jaipur, Rajasthan (Onsite)",
    period: "Sep 2026 – Present",
    status: "IN PROGRESS",
    missionTitle: "HEIST #1: THE ENTERPRISE ERP SYNDICATE",
    briefing: "Infiltrate enterprise ERP workflows, rebuild frontend modules, and optimize core data pipelines.",
    achievements: [
      "Core development operative engineering ERP module pages and backend microservices using Next.js, Node.js, TypeScript, JavaScript, and SQL.",
      "Optimised API performance by stripping redundant query logic and unnecessary hops, accelerating data fetching by 40–60% over legacy baselines.",
      "Maintain and patch live high-availability services across both frontend and backend clusters, resolving production defects with zero downtime."
    ],
    keyMetric: "40–60% Faster API Data Fetching",
    techStack: ["Next.js", "Node.js", "TypeScript", "SQL", "ERP Architecture", "API Optimization"]
  },
  {
    id: "simplified-learning",
    role: "Full Stack Developer",
    company: "Simplified Learning (Stealth-Mode EdTech)",
    location: "Ajmer, Rajasthan (Onsite)",
    period: "Jan 2026 – Sep 2026",
    status: "ACCOMPLISHED",
    missionTitle: "HEIST #2: OPERATION STEALTH MEDIC",
    briefing: "Build an end-to-end medical education portal for PG aspirants with real-time peer communications and financial payment escrows.",
    achievements: [
      "Engineered an EdTech platform for Post-Graduate medical students, owning frontend and backend architecture end to end.",
      "Integrated seamless payment gateways and interactive session booking, enabling students to book 1-on-1 mentorship sessions with senior doctors.",
      "Designed and launched a custom PG preparation module tailored to medical students' rigorous curriculum.",
      "Co-developed a real-time student community powered by Next.js, Node.js, and Socket.io for low-latency live engagement."
    ],
    keyMetric: "Full Platform Ownership & 1-on-1 Payment Escrow",
    techStack: ["Next.js", "Node.js", "Socket.io", "Payment Gateway", "Full Stack Development"]
  },
  {
    id: "outlier-ai",
    role: "Freelance AI Contributor",
    company: "Outlier.ai",
    location: "Remote (Global Async)",
    period: "Jun 2025 – Dec 2025",
    status: "ACCOMPLISHED",
    missionTitle: "HEIST #3: THE NEURAL INFILTRATION",
    briefing: "Execute prompt engineering, safety audits, and adversarial stress tests for frontier LLM fine-tuning.",
    achievements: [
      "Engineered 200+ specialized training prompts for LLM fine-tuning across complex instruction-following, multi-step reasoning, and code generation.",
      "Audited and annotated 500+ AI-generated responses for factual accuracy, safety, and strict RLHF (Reinforcement Learning from Human Feedback) compliance.",
      "Designed adversarial edge-case prompts targeting model failure modes, contributing to a ~15% boost in contextual understanding on internal benchmarks.",
      "Collaborated asynchronously with a global squad of 20+ contributors, enforcing rigorous annotation quality standards."
    ],
    keyMetric: "~15% Improvement in Model Benchmarks",
    techStack: ["RLHF", "LLM Fine-Tuning", "Prompt Engineering", "Adversarial Testing", "Code Generation"]
  },
  {
    id: "zentek-infosoft",
    role: "Data Analytics Training / Intern",
    company: "Zentek Infosoft",
    location: "Jaipur, Rajasthan",
    period: "Dec 2025 – Jan 2026",
    status: "TRAINING COMPLETED",
    missionTitle: "OPERATION #4: DATA EXTRACTION UNIT",
    briefing: "Automate large-scale data cleansing and extract executive intelligence from unstructured datasets.",
    achievements: [
      "Completed intensive 45-day industry training program centered on applied Python data analytics in a production business environment.",
      "Authored Python scripts to clean, transform, and aggregate datasets from disparate CSV and Excel sources, drastically reducing manual preparation time.",
      "Built interactive executive dashboards using VLOOKUP, pivot tables, and conditional formatting, reviewed weekly by senior analysts."
    ],
    keyMetric: "Automated Multi-source Python ETL Pipeline",
    techStack: ["Python", "Excel Automation", "Data Cleaning", "ETL", "VLOOKUP", "Pivot Tables"]
  }
];

export const CONTRACT_PROJECTS: ProjectItem[] = [
  {
    id: "linkedin-dev-filter",
    title: "LinkedIn Dev Filter",
    codename: "The Noise Silencer",
    type: "Chrome Extension (MV3)",
    bounty: "$500,000",
    description: "An intelligent Chrome extension that purges promotional junk in real time, serving only high-relevance engineering jobs and tech posts.",
    impactHighlight: "80% feed noise reduction with zero layout shift via DOM caching",
    details: [
      "Built a Chrome extension that intelligently filters LinkedIn feeds — removes irrelevant and promotional posts in real time.",
      "Implemented a keyword pre-seeding and DOM-caching algorithm that intercepts and classifies feed posts before render — achieving near-zero layout shift and smooth filtering without page reload.",
      "Designed an intuitive React-based popup UI for keyword management, filter toggles, and mode switching — fully operable inside the active tab.",
      "Result: Reduced developer feed noise by ~80%, significantly improving signal-to-noise ratio for active job seekers."
    ],
    techStack: ["React.js", "TypeScript", "Vite", "Chrome Extensions API", "JavaScript", "DOM Caching"],
    githubUrl: "https://github.com/imdevesh21"
  },
  {
    id: "techblaz",
    title: "TechBlaz — IT SaaS Website",
    codename: "Operation 90+ Lighthouse",
    type: "Enterprise SaaS Web App",
    bounty: "$650,000",
    description: "Production web architecture for an IT SaaS enterprise engineered with advanced React render optimizations and zero CSS framework dependencies.",
    impactHighlight: "90+ Lighthouse Score + 40% Render Cycle Speedup via useMemo/useCallback",
    details: [
      "Developed a complete frontend website for an IT SaaS company — includes a home page, services section, and fully functional contact form with validation.",
      "Architected the UI using advanced React hooks (useCallback, useMemo, useRef) and optimised re-render cycles — achieving a ~40% improvement in component render performance measured via React DevTools.",
      "Styled entirely with SCSS using modular, BEM-structured stylesheets — maintaining design consistency across responsive breakpoints with zero CSS framework dependency.",
      "Result: Achieved 90+ Lighthouse performance score on Vercel deployment with optimized LCP, FID, and CLS scores."
    ],
    techStack: ["React.js", "SCSS / Sass", "Advanced React Hooks", "Lighthouse", "Vercel"],
    githubUrl: "https://github.com/imdevesh21",
    liveUrl: "https://deveshportfolio.vercel.app"
  },
  {
    id: "staflance",
    title: "StafLance — Agency Landing",
    codename: "The Talent Broker",
    type: "Freelance Agency Platform",
    bounty: "$390,000",
    description: "Conversion-optimized recruitment portal with dynamic client-side filtering acting as a lightweight CMS alternative for high-growth agencies.",
    impactHighlight: "Sub-second client-side job filtering & mobile-first conversion UX",
    details: [
      "Built a third-party hiring and freelance agency website as a freelance project — includes an invite-style landing page, live job posting section, and contact form for inquiries.",
      "Implemented a dynamic job listing page where roles can be added and filtered client-side — designed to serve as a lightweight alternative to a full CMS for small agencies.",
      "Focused on conversion-optimised UI/UX: clear CTAs, fast load times, and mobile-first responsive layout across all sections."
    ],
    techStack: ["React.js", "JavaScript", "HTML5", "CSS3", "Responsive UI/UX"],
    githubUrl: "https://github.com/imdevesh21"
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "gcp-security",
    title: "Google Cloud Security Challenge — Level 1 & 2",
    issuer: "Google",
    status: "OFFICIAL GOOGLE RECOGNITION",
    icon: "🛡️",
    description: "Completed both advanced levels covering identity management, IAM role boundaries, perimeter access control, and cloud security best practices."
  },
  {
    id: "gcp-essentials",
    title: "Google Cloud Essentials",
    issuer: "Google Cloud Platform",
    status: "VERIFIED BADGE AWARDED",
    icon: "☁️",
    description: "Completed hands-on labs covering core GCP services, IAM policy enforcement, compute infrastructure, VPC networks, and cloud storage."
  },
  {
    id: "dsa-streak",
    title: "LeetCode & DSA Mastery (150+ Solved)",
    issuer: "LeetCode / GFG / Coding Ninjas",
    status: "100+ DAY ACTIVE STREAK",
    icon: "🔥",
    description: "Maintained a continuous 100+ day streak solving complex algorithmic challenges across arrays, binary trees, dynamic programming, and graph algorithms."
  }
];
