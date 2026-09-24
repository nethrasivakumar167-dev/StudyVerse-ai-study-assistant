export const INITIAL_HERO_PROFILE = {
  name: 'Nethra Sivakumar',
  superheroName: 'CyberNova',
  heroClassId: 'tech-titan',
  avatarId: 'male-1',
  gender: 'male',
  level: 12,
  rank: 'HERO',
  xp: 1840,
  nextLevelXp: 2500,
  streakDays: 7,
  missionsCompleted: 42,
  quizAccuracy: 86,
  energyCores: 12,
  joinedDate: '2026-09-01',
  avatarConfig: {
    suitColor: '#ef4444',
    visorGlow: '#eab308',
    emblem: 'lightning'
  }
};

export const LEVEL_RANKS = [
  { minLevel: 1, name: 'ROOKIE', badge: '🌱', color: 'text-slate-400' },
  { minLevel: 5, name: 'RECRUIT', badge: '🛡️', color: 'text-blue-400' },
  { minLevel: 10, name: 'HERO', badge: '⚡', color: 'text-amber-400' },
  { minLevel: 20, name: 'SUPERHERO', badge: '🦸', color: 'text-red-400' },
  { minLevel: 30, name: 'LEGEND', badge: '👑', color: 'text-purple-400' }
];

export const getRankForLevel = (level) => {
  let matched = LEVEL_RANKS[0];
  for (const rank of LEVEL_RANKS) {
    if (level >= rank.minLevel) matched = rank;
  }
  return matched;
};

export const INITIAL_DAILY_MISSION = {
  id: 'mission-01',
  title: 'MASTER PROCESS SCHEDULING',
  topic: 'Process Scheduling & Synchronization',
  rewardXp: 250,
  difficulty: 'HERO',
  isCompleted: false,
  tasks: [
    { id: 't1', label: 'Review Process Scheduling & Context Switching', completed: true },
    { id: 't2', label: 'Ask S.A.T.U.R.D.A.Y. for a Round-Robin deep dive', completed: false },
    { id: 't3', label: 'Complete Battle Quiz on CPU Scheduling', completed: false }
  ]
};

export const SAMPLE_TOPICS = [
  'Process Scheduling',
  'Dynamic Programming & Memoization',
  'TCP/IP 3-Way Handshake',
  'Neural Network Transformers & Attention',
  'Database ACID Properties & Transactions',
  'Quantum Computing & Superposition',
  'Distributed Consensus & Raft',
  'Operating System Deadlocks'
];

export const INITIAL_VAULT_NOTES = [
  {
    id: 'note-1',
    topic: 'PROCESS SCHEDULING',
    createdDate: '2 hours ago',
    tag: 'Core Concept',
    difficulty: 'HERO',
    summary: 'CPU scheduling algorithms, preemptive vs non-preemptive states, and latency trade-offs.',
    bulletPoints: [
      'CPU scheduling selects which process runs next from the ready queue.',
      'FCFS (First-Come, First-Served) follows strict arrival order but suffers from the Convoy Effect.',
      'SJF (Shortest Job First) is mathematically optimal for average waiting time, but requires future CPU burst prediction.',
      'Round Robin (RR) introduces a fixed time quantum for fair time-sharing.'
    ],
    examAlert: 'A very large Round Robin time quantum makes it behave identically to FCFS. A very small quantum causes excessive context-switch overhead.'
  },
  {
    id: 'note-2',
    topic: 'GRAPH TRAVERSAL (BFS vs DFS)',
    createdDate: 'Yesterday',
    tag: 'Algorithms',
    difficulty: 'SUPERHERO',
    summary: 'Breadth-First Search using queues vs Depth-First Search using stacks or recursion.',
    bulletPoints: [
      'BFS explores level-by-level using a FIFO Queue. Optimal for unweighted shortest path search.',
      'DFS explores as deep as possible before backtracking using a LIFO Stack or Call Stack.',
      'Both algorithms run in O(V + E) time complexity with adjacency list representation.',
      'Cycle detection in directed graphs is best handled with DFS and 3-color state tracking.'
    ],
    examAlert: 'Never forget to maintain a "visited" array/set in cyclic graphs; omitting it leads to infinite loops in BFS/DFS.'
  },
  {
    id: 'note-3',
    topic: 'TCP 3-WAY HANDSHAKE',
    createdDate: '3 days ago',
    tag: 'Protocols',
    difficulty: 'RECRUIT',
    summary: 'Connection establishment mechanism ensuring reliable bidirectional communication.',
    bulletPoints: [
      'Step 1: Client sends SYN packet with Initial Sequence Number (ISN_c).',
      'Step 2: Server responds with SYN-ACK, acknowledging ISN_c + 1 and providing ISN_s.',
      'Step 3: Client sends ACK (ISN_s + 1). Socket connection is now ESTABLISHED.'
    ],
    examAlert: 'SYN Flood Attacks exploit the half-open state between Step 1 and Step 2. Mitigated using SYN Cookies.'
  }
];

export const INITIAL_ACHIEVEMENTS = [
  { id: 'ach-1', title: 'FIRST MISSION', desc: 'Complete your first study battle.', icon: '🏆', unlocked: false, progress: '0/1' },
  { id: 'ach-2', title: '7 DAY STREAK', desc: 'Maintain relentless study consistency for 7 days.', icon: '⚡', unlocked: false, progress: '0/7' },
  { id: 'ach-3', title: 'QUIZ MASTER', desc: 'Achieve 100% accuracy in a Legendary Battle Arena.', icon: '🧠', unlocked: false, progress: '0/1' },
  { id: 'ach-4', title: '1000 XP MILESTONE', desc: 'Earn over 1,000 superhero experience points.', icon: '🔥', unlocked: false, progress: '0/1000' },
  { id: 'ach-5', title: 'KNOWLEDGE SEEKER', desc: 'Save 10+ synthesized notes into the Knowledge Vault.', icon: '📚', unlocked: false, progress: '0/10' },
  { id: 'ach-6', title: '50 MISSIONS ACCOMPLISHED', desc: 'Finish 50 full academic missions.', icon: '💥', unlocked: false, progress: '0/50' }
];

export const DEMO_ACHIEVEMENTS = [
  { id: 'ach-1', title: 'FIRST MISSION', desc: 'Completed your first study battle.', icon: '🏆', unlocked: true, date: '2026-09-02' },
  { id: 'ach-2', title: '7 DAY STREAK', desc: 'Maintained relentless study consistency for 7 days.', icon: '⚡', unlocked: true, date: 'Today' },
  { id: 'ach-3', title: 'QUIZ MASTER', desc: 'Achieved 100% accuracy in a Legendary Battle Arena.', icon: '🧠', unlocked: true, date: '2026-09-18' },
  { id: 'ach-4', title: '1000 XP MILESTONE', desc: 'Earned over 1,000 superhero experience points.', icon: '🔥', unlocked: true, date: '2026-09-10' },
  { id: 'ach-5', title: 'KNOWLEDGE SEEKER', desc: 'Saved 10+ synthesized notes into the Knowledge Vault.', icon: '📚', unlocked: false, progress: '3/10' },
  { id: 'ach-6', title: '50 MISSIONS ACCOMPLISHED', desc: 'Finish 50 full academic missions.', icon: '💥', unlocked: false, progress: '42/50' }
];

export const INITIAL_SKILL_TREE = [
  {
    category: 'CORE KNOWLEDGE MATRIX',
    skills: [
      { id: 'sk-theory', name: 'Theoretical Foundations', status: 'ACTIVE', level: 0, maxLevel: 5, icon: 'BookOpen', desc: 'Mastery of fundamental computer science concepts and architectural theorems.' },
      { id: 'sk-code', name: 'Algorithmic Mastery', status: 'ACTIVE', level: 0, maxLevel: 5, icon: 'Terminal', desc: 'High-speed problem analysis, complexity reduction, and runtime optimization.' },
      { id: 'sk-prob', name: 'Problem Solving Matrix', status: 'LOCKED', level: 0, maxLevel: 5, requiredXp: 2500, icon: 'Puzzle', desc: 'Advanced heuristics, dynamic programming, and systems design decomposition.' },
      { id: 'sk-sys', name: 'Systems Architecture', status: 'LOCKED', level: 0, maxLevel: 5, requiredXp: 3500, icon: 'Layers', desc: 'Distributed topologies, fault-tolerant patterns, and low-level kernel abstractions.' }
    ]
  }
];

export const DEMO_SKILL_TREE = [
  {
    category: 'CORE KNOWLEDGE MATRIX',
    skills: [
      { id: 'sk-theory', name: 'Theoretical Foundations', status: 'ACTIVE', level: 4, maxLevel: 5, icon: 'BookOpen', desc: 'Mastery of fundamental computer science concepts and architectural theorems.' },
      { id: 'sk-code', name: 'Algorithmic Mastery', status: 'ACTIVE', level: 3, maxLevel: 5, icon: 'Terminal', desc: 'High-speed problem analysis, complexity reduction, and runtime optimization.' },
      { id: 'sk-prob', name: 'Problem Solving Matrix', status: 'LOCKED', level: 0, maxLevel: 5, requiredXp: 2500, icon: 'Puzzle', desc: 'Advanced heuristics, dynamic programming, and systems design decomposition.' },
      { id: 'sk-sys', name: 'Systems Architecture', status: 'LOCKED', level: 0, maxLevel: 5, requiredXp: 3500, icon: 'Layers', desc: 'Distributed topologies, fault-tolerant patterns, and low-level kernel abstractions.' }
    ]
  }
];

export const MOCK_QUIZZES = {
  'Process Scheduling': [
    {
      id: 'q1',
      question: 'What does a CPU scheduler fundamentally determine in an operating system?',
      options: [
        'Which process runs next on the allocated CPU core',
        'Which disk sector is deleted during garbage collection',
        'Which physical ethernet port receives network packets',
        'Which authenticated user is allowed to modify root credentials'
      ],
      correctAnswer: 0,
      explanation: 'The CPU scheduler (short-term scheduler) selects from among the processes that are in the ready state and allocates a CPU core to one of them.',
      xp: 50
    },
    {
      id: 'q2',
      question: 'In Round Robin scheduling, what happens if the time quantum is set arbitrarily large (infinite)?',
      options: [
        'It degrades into First-Come First-Served (FCFS) scheduling',
        'It causes an immediate system deadlock',
        'It prioritizes the shortest I/O bound jobs first',
        'It minimizes average waiting time down to zero'
      ],
      correctAnswer: 0,
      explanation: 'When the time slice is larger than the longest CPU burst, no process is preempted before completion, making it identical to FCFS.',
      xp: 50
    },
    {
      id: 'q3',
      question: 'Which of the following conditions is NOT one of the 4 Coffman conditions required for a Deadlock?',
      options: [
        'Preemption permitted by the kernel',
        'Mutual Exclusion',
        'Hold and Wait',
        'Circular Wait'
      ],
      correctAnswer: 0,
      explanation: 'The Coffman condition is "No Preemption" (resources cannot be forcibly taken from a process holding them). If preemption is permitted, deadlocks can be prevented.',
      xp: 75
    },
    {
      id: 'q4',
      question: 'What is the "Convoy Effect" in CPU scheduling?',
      options: [
        'Short processes waiting behind a CPU-intensive long process in FCFS',
        'Multiple threads accessing a shared database index simultaneously',
        'A queue of packets overloading a network switch buffer',
        'Virtual memory swapping thrashing the hard disk'
      ],
      correctAnswer: 0,
      explanation: 'The convoy effect occurs in FCFS when a CPU-bound process holds the CPU while many I/O-bound processes wait behind it, resulting in poor CPU and device utilization.',
      xp: 75
    }
  ],
  'Dynamic Programming': [
    {
      id: 'qd1',
      question: 'Which key property must a problem possess to be solvable using Dynamic Programming?',
      options: [
        'Overlapping Subproblems and Optimal Substructure',
        'Linear execution with zero state transitions',
        'Unbounded randomized trial loops',
        'Greedy local choice independence'
      ],
      correctAnswer: 0,
      explanation: 'Dynamic Programming applies when a problem has optimal substructure (optimal solutions to subproblems form optimal overall solution) and overlapping subproblems (recomputed states can be memoized).',
      xp: 75
    }
  ]
};
