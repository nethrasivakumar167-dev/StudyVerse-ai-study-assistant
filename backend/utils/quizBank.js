/**
 * Server-side fallback quiz content.
 * All academic content must stay clear and natural — no superhero/theme
 * language inside questions, options, or explanations.
 */

const QUESTION_XP = [50, 75, 75, 100];

// Curated academic banks for the app's demo topics.
const OOP_QUESTIONS = [
  {
    question: 'Which OOP principle means an object exposes only a public interface while hiding its internal state?',
    options: [
      'Encapsulation',
      'Inheritance',
      'Polymorphism',
      'Coupling'
    ],
    correctAnswer: 0,
    explanation:
      'Encapsulation bundles data and methods together and restricts direct access to internal fields (e.g., private fields with getter/setter methods), protecting the object state.'
  },
  {
    question: 'In OOP, what is it called when a child class provides its own implementation of a method already defined in its parent class?',
    options: [
      'Method overriding',
      'Method overloading',
      'Data hiding only',
      'Constructor chaining'
    ],
    correctAnswer: 0,
    explanation:
      'Overriding replaces a parent method implementation in a subclass (same signature, runtime polymorphism). Overloading means several methods with the same name but different parameter lists in one class.'
  },
  {
    question: 'What does "Dog IS-A Animal" model in object-oriented (OOP) design?',
    options: [
      'Inheritance',
      'Aggregation',
      'Composition',
      'Association'
    ],
    correctAnswer: 0,
    explanation:
      'IS-A denotes inheritance (Dog extends Animal). HAS-A relationships model aggregation/association, where one object contains or relates to another.'
  },
  {
    question: 'In OOP, which best describes runtime polymorphism in Java?',
    options: [
      'A reference of parent type calling the overridden method of the actual child object',
      'Deciding at compile time which constructor to call',
      'Sharing one private field across all classes',
      'Calling several constructors with different parameter lists'
    ],
    correctAnswer: 0,
    explanation:
      'Runtime polymorphism works through method overriding: the JVM invokes the child implementation based on the actual object type, even through a parent-type reference.'
  }
];

const BINARY_TREE_QUESTIONS = [
  {
    question: 'What is the maximum number of nodes at depth d in a binary tree (root at depth 0)?',
    options: ['2^d', '2^(d+1) − 1', 'd + 1', '2d'],
    correctAnswer: 0,
    explanation:
      'Each level d holds at most 2^d nodes. The value 2^(d+1) − 1 is the TOTAL nodes in a full tree up to depth d — a classic mix-up.'
  },
  {
    question: 'In a binary search tree, how are the keys arranged with respect to a given node?',
    options: [
      'Left subtree keys < node key < right subtree keys',
      'All keys stored only in the left subtree',
      'Keys ordered by insertion time, not value',
      'Left subtree keys > node key > right subtree keys'
    ],
    correctAnswer: 0,
    explanation:
      'BST ordering: every left descendant is smaller and every right descendant is larger, which is what makes O(log n) search possible on a balanced tree.'
  },
  {
    question: 'What is the height of a balanced BST containing n nodes?',
    options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
    correctAnswer: 0,
    explanation:
      'Balancing keeps height logarithmic — O(log n). An unbalanced BST (sorted insertions) can degenerate to height O(n), behaving like a linked list.'
  },
  {
    question: 'In pre-order traversal, in what order are the nodes visited?',
    options: [
      'Root, left subtree, right subtree',
      'Left subtree, root, right subtree',
      'Left subtree, right subtree, root',
      'Level by level, left to right'
    ],
    correctAnswer: 0,
    explanation:
      'Pre-order = root first; in-order = left-root-right; post-order = left-right-root; level-order uses a queue (BFS).'
  }
];

const BINARY_ADDITION_QUESTIONS = [
  {
    question: 'What is the result of adding the two bits 1 + 1 in binary?',
    options: [
      '10 — write 0 and carry 1 to the next column',
      '11 — write 1 and carry 1 upward',
      '1 — two bits never produce a carry',
      '2 — binary digits may be written as 2'
    ],
    correctAnswer: 0,
    explanation:
      '1 + 1 equals 2 in decimal, and 2 in binary is written 10: the low bit is 0 and a carry of 1 moves into the next column.'
  },
  {
    question: 'In binary addition, when does a carry move to the next column?',
    options: [
      'Whenever a column sums to 2 or more',
      'Only when both bits are 0',
      'Only at the leftmost column',
      'Whenever the column sum reaches 10 in decimal'
    ],
    correctAnswer: 0,
    explanation:
      'A single bit can only hold 0 or 1. A column summing to 2 (binary 10) or 3 (binary 11) cannot fit in one bit, so the excess becomes a carry of 1.'
  },
  {
    question: 'What is 1101 + 1010 in binary?',
    options: ['10111', '11111', '10101', '11011'],
    correctAnswer: 0,
    explanation:
      'Column by column: 1+0=1, 0+1=1, 1+0=1, 1+1=10 (write 0, carry 1), then the final carry gives 10111 — which is 23 in decimal (13 + 10).'
  },
  {
    question: 'A binary addition result sometimes has one more bit than either operand. What causes the extra bit?',
    options: [
      'The final carry-out of the leftmost column',
      'Rounding performed by the processor',
      'Sign extension of the operands',
      'A dropped zero during right-alignment'
    ],
    correctAnswer: 0,
    explanation:
      'The leftmost column can itself generate a carry (for example 11 + 11 = 110). That carry-out becomes a new most-significant bit, so binary sums may be one bit wider than their operands.'
  },
  {
    question: "How is binary subtraction usually performed using the same adder hardware?",
    options: [
      "By adding the 2's complement of the subtrahend",
      'By running binary addition twice',
      'By converting both operands to decimal',
      'By inverting every carry after each column'
    ],
    correctAnswer: 0,
    explanation:
      "A − B is computed as A plus the 2's complement of B (invert B, then add 1) and fed through normal binary addition — the carry-out then shows that no borrow was needed."
  }
];

const DEADLOCK_QUESTIONS = [
  {
    question: 'Which of the following is one of the four Coffman conditions required for a deadlock?',
    options: ['Hold and wait', 'Preemption of resources at any time', 'An unlimited number of processes', 'Absence of shared resources'],
    correctAnswer: 0,
    explanation:
      'The four Coffman conditions are mutual exclusion, hold and wait, no preemption, and circular wait — a deadlock can arise only when all four hold at the same time.'
  },
  {
    question: 'Which approach prevents deadlock by making a process request all needed resources in one atomic step?',
    options: [
      'All-or-nothing allocation: acquire every resource at once, or none',
      'Allowing a process to add resources while it is already holding some',
      'Releasing resources only when the process terminates',
      'Waiting for the deadlock to appear and ignoring it'
    ],
    correctAnswer: 0,
    explanation:
      'The atomic all-or-nothing request removes the hold-and-wait condition entirely: a process either receives everything it needs or waits while holding nothing — one of the classic deadlock prevention strategies.'
  },
  {
    question: "Banker's algorithm avoids deadlock by only granting requests that keep the system in what kind of state?",
    options: [
      'A safe state — some ordering lets every process finish',
      'A state where every resource is fully used at all times',
      'A state with no free resources and long waiting queues',
      'A circular-wait state that resolves itself automatically'
    ],
    correctAnswer: 0,
    explanation:
      'Avoidance keeps the system in a safe state where at least one completion sequence exists for all processes. An unsafe state MAY lead to deadlock but is not one yet — that distinction is a favourite exam trap.'
  },
  {
    question: 'What does a cycle in a resource-allocation graph tell you about deadlock?',
    options: [
      'With single-instance resources it proves deadlock; with multiple instances it only suggests a possibility',
      'It always proves deadlock regardless of resource instances',
      'It proves the system is completely deadlock-free',
      'It only indicates CPU starvation, never deadlock'
    ],
    correctAnswer: 0,
    explanation:
      'For single-instance resources a cycle is necessary AND sufficient for deadlock. With multiple-instance resources a cycle is only necessary, so deadlock may or may not actually exist — detection must check further.'
  },
  {
    question: 'How does the "no preemption" condition relate to a deadlock being able to form?',
    options: [
      'Resources cannot be forcibly taken — if they could, the deadlock would be broken',
      'It guarantees that a deadlock will always occur',
      'It removes the need for mutual exclusion',
      'It allows the kernel to steal resources at any moment'
    ],
    correctAnswer: 0,
    explanation:
      'No preemption means a resource can only be released voluntarily by the holding process. If the OS could preempt resources, deadlocks could always be broken — so this condition must hold for a deadlock to persist.'
  }
];

const JAVA_INHERITANCE_QUESTIONS = [
  {
    question: 'In Java, what does a subclass inherit from its superclass?',
    options: [
      'All non-private fields and methods, subject to visibility rules',
      'Only the fields declared private',
      'Nothing unless the members are copied manually',
      'Constructors, exactly as declared'
    ],
    correctAnswer: 0,
    explanation:
      'A subclass inherits every non-private member. Private members still exist inside the object but are not directly accessible, and constructors are never inherited — they are chained through super().'
  },
  {
    question: 'What is the difference between method overriding and method overloading in Java?',
    options: [
      'Overriding redefines a parent method with the same signature (resolved at runtime); overloading uses the same name with different parameters (resolved at compile time)',
      'Overriding changes the parameter list; overloading only changes the return type',
      'Both mechanisms are resolved entirely at compile time',
      'Overloading works across classes while overriding stays inside one class'
    ],
    correctAnswer: 0,
    explanation:
      'Overriding = same signature in a subclass, selected at runtime from the actual object type. Overloading = several methods sharing a name but with different parameter lists in the same class, selected at compile time.'
  },
  {
    question: 'Which keyword calls the superclass constructor from a subclass constructor in Java?',
    options: ['super()', 'this()', 'extends()', 'base()'],
    correctAnswer: 0,
    explanation:
      'super() invokes the parent constructor and must be the first statement of the constructor. this() instead calls another constructor of the same class. Java has single class inheritance, so super() always targets exactly one parent.'
  },
  {
    question: "Why can't a Java class inherit from two classes directly?",
    options: [
      'Java keeps single class inheritance; multiple inheritance of behavior comes from interfaces',
      'The JVM would run out of memory with two parents',
      'It is only a style guideline, not an actual language rule',
      'Interfaces are forbidden from containing any methods'
    ],
    correctAnswer: 0,
    explanation:
      'Java uses single inheritance for classes to avoid the diamond problem. Multiple inheritance of implementations is achieved with interfaces, which may provide default methods since Java 8.'
  },
  {
    question: 'What happens when a parent-type reference points to a child-type object in Java?',
    options: [
      "The child's overridden method runs at runtime",
      "The parent's method always runs instead",
      'The program fails to compile',
      'Parent fields automatically shadow all child methods'
    ],
    correctAnswer: 0,
    explanation:
      'Dynamic method dispatch selects the implementation based on the real object, not the reference type — this is the foundation of runtime polymorphism in Java inheritance.'
  }
];

const INTERRUPT_8086_QUESTIONS = [
  {
    question: 'On the 8086, where is the Interrupt Vector Table stored?',
    options: [
      'At 0000:0000 — 256 entries of 4 bytes each (IP + CS)',
      'In the last 1 KB of the code segment',
      'Inside the 8086 instruction pipeline',
      'At the top of the stack segment'
    ],
    correctAnswer: 0,
    explanation:
      "The IVT occupies the first 1 KB of memory: interrupt type n points to address n × 4, holding the handler's IP in the first two bytes and CS in the next two."
  },
  {
    question: 'Which 8086 interrupt cannot be disabled by clearing the IF flag?',
    options: [
      'NMI — the non-maskable interrupt (type 2)',
      'INTR — the maskable hardware interrupt',
      'Software interrupts of the form INT n',
      'Any interrupt while IF = 1'
    ],
    correctAnswer: 0,
    explanation:
      'NMI arrives on a dedicated pin and is always accepted. INTR is maskable through the IF flag (STI enables, CLI disables), and software INT n instructions ignore IF entirely.'
  },
  {
    question: 'What does the 8086 push onto the stack when servicing an interrupt?',
    options: ['FLAGS, then CS, then IP', 'IP, then CS, then FLAGS', 'Only CS and IP', 'Registers AX, BX and CX'],
    correctAnswer: 0,
    explanation:
      'The processor finishes the current instruction, pushes FLAGS, CS and IP in that order, clears IF and TF, then jumps to the handler read from the IVT — IRET later pops all three back.'
  },
  {
    question: 'Which instruction ends an interrupt service routine on the 8086?',
    options: ['IRET', 'RET 2', 'HLT', 'NOP'],
    correctAnswer: 0,
    explanation:
      'IRET pops IP, CS and FLAGS, restoring the interrupted program completely. A plain near return would leave FLAGS unrestored and break the saved flags.'
  },
  {
    question: 'What kind of interrupt is INT 21h in 8086 / DOS programming?',
    options: [
      'A software interrupt providing DOS system calls',
      'The maskable hardware interrupt from the keyboard',
      'A non-maskable power-failure alert',
      'The timer interrupt used by the CPU scheduler'
    ],
    correctAnswer: 0,
    explanation:
      'INT 21h is a software interrupt (type 33): the AH register selects the DOS function — for example 09h to print a string, 4Ch to terminate — and executing INT 21h transfers control to the DOS service routine.'
  }
];

const DATA_STRUCTURE_QUESTIONS = [
  {
    question: 'Which data structure works on the LIFO (last-in-first-out) principle?',
    options: ['Stack', 'Queue', 'Priority queue', 'Circular buffer'],
    correctAnswer: 0,
    explanation:
      'A stack is LIFO: the most recently pushed item is popped first. Queues are FIFO, and a priority queue dequeues by priority rather than arrival order.'
  },
  {
    question: 'In data structures, how does array indexing compare to linked list access?',
    options: [
      'Array indexing is O(1); linked list access is O(n)',
      'Array indexing is O(n); linked list access is O(1)',
      'Both provide O(1) access',
      'Both require O(n) traversal'
    ],
    correctAnswer: 0,
    explanation:
      'Arrays use contiguous memory, so an index maps straight to an address (O(1)). A linked list must be walked node by node to reach position k (O(n)) — but insert/delete at a known node is O(1), which is the classic trade-off.'
  },
  {
    question: 'Which data structure suits a printer spooler that must serve tasks in arrival order?',
    options: ['Queue (FIFO)', 'Stack (LIFO)', 'Binary search tree', 'Hash table'],
    correctAnswer: 0,
    explanation:
      "A spooler serves jobs first-come first-served, which is exactly a queue's FIFO discipline. A stack would reverse the order, and trees or hashes do not preserve arrival sequence."
  },
  {
    question: 'When is a linked list preferred over an array as a data structure?',
    options: [
      'When insertions and deletions are frequent and the size is unpredictable',
      'When O(1) random access by index is the top priority',
      'When the elements must occupy contiguous memory',
      'When the data never changes after creation'
    ],
    correctAnswer: 0,
    explanation:
      'Linked structures grow and shrink without shifting elements — insertion at a known node is O(1). Arrays win when fast indexed access over contiguous memory matters more than dynamic resizing.'
  },
  {
    question: 'What is the average-case lookup complexity of a hash table, a key data structure for dictionaries?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 0,
    explanation:
      'A good hash function with a controlled load factor gives constant-time average lookup. The worst case is still O(n) when every key collides, which is why rehashing and a good hash function matter.'
  }
];

const POLLINATION_QUESTIONS = [
  {
    question: 'In flowering plants (angiosperms), what is the definition of pollination?',
    options: [
      'Transfer of pollen grains from the male anther to the female stigma',
      'Fusion of the male sperm nucleus with the female egg cell inside the ovule',
      'Development of the fertilized ovule into a mature seed',
      'Germination of pollen grains into root hairs inside the soil'
    ],
    correctAnswer: 0,
    explanation:
      'Pollination is the mechanical or biological transfer of pollen from the anther to the receptive stigma. Fertilization is the subsequent biochemical union of gametes.'
  },
  {
    question: 'What is geitonogamy in botanical reproduction?',
    options: [
      'Transfer of pollen from an anther to the stigma of another flower on the same plant',
      'Transfer of pollen between flowers of two completely separate plants of the same species',
      'Transfer of pollen within the very same bisexual flower',
      'Pollination facilitated exclusively by subterranean water currents'
    ],
    correctAnswer: 0,
    explanation:
      'Geitonogamy is functionally cross-pollination (involving a pollinator) but genetically equivalent to self-pollination since both flowers share identical parent genetics.'
  },
  {
    question: 'Which set of characteristics is typical of wind-pollinated (anemophilous) flowers?',
    options: [
      'Light non-sticky pollen, feathery stigmas, and absent nectar/petals',
      'Brightly colored petals, fragrant nectar glands, and heavy sticky pollen',
      'Nocturnal scent emission and thick tubular corollas adapted for bats',
      'Waterproof mucilage-covered pollen grains designed to float on rivers'
    ],
    correctAnswer: 0,
    explanation:
      'Anemophilous flowers do not need to attract animal vectors, so they produce vast quantities of light, dry pollen and exert feathery stigmas to catch airborne grains.'
  },
  {
    question: 'In the double fertilization of angiosperms, what product results from triple fusion?',
    options: [
      'Triploid (3n) Primary Endosperm Nucleus',
      'Diploid (2n) Zygote that forms the plant embryo',
      'Haploid (n) seed coat covering the cotyledon',
      'Tetraploid (4n) pericarp that forms the fruit flesh'
    ],
    correctAnswer: 0,
    explanation:
      'Triple fusion occurs when one haploid sperm nucleus fuses with the two haploid polar nuclei in the central cell, forming the nutritive triploid (3n) endosperm.'
  }
];

const CHEMICAL_WASTE_QUESTIONS = [
  {
    question: 'Under standard environmental regulations (such as RCRA), which property defines ignitable hazardous chemical waste?',
    options: [
      'Liquids with a flashpoint below 60°C (140°F)',
      'Aqueous solutions with pH below 2.0 or above 12.5',
      'Substances that undergo explosive reactions upon heating under confinement',
      'Compounds that leach toxic heavy metals exceeding standard TCLP thresholds'
    ],
    correctAnswer: 0,
    explanation:
      'Ignitability is characterized by liquids having a flashpoint below 60°C (140°F) or non-liquids capable of causing fire through friction or absorption of moisture.'
  },
  {
    question: 'Why must cyanide-bearing chemical wastes be strictly maintained at alkaline pH (> 10) during storage and treatment?',
    options: [
      'To prevent the dangerous evolution of lethal hydrogen cyanide (HCN) gas',
      'To accelerate the thermal oxidation of insoluble heavy metal hydroxides',
      'To avoid spontaneous precipitation of explosive perchlorate salts',
      'To enable direct discharge into municipal wastewater systems without filtration'
    ],
    correctAnswer: 0,
    explanation:
      'In acidic or neutral conditions, cyanide ions rapidly protonate into volatile, highly lethal hydrogen cyanide ($HCN$) gas. Alkaline conditions keep cyanide dissolved for alkaline chlorination.'
  },
  {
    question: 'In laboratory and industrial waste management, why must halogenated (chlorinated) solvents never be mixed with non-halogenated organic solvents?',
    options: [
      'Because halogenated waste requires specialized high-temperature incineration to avoid dioxin formation and has much higher disposal costs',
      'Because non-halogenated solvents spontaneously neutralize the toxicity of halogenated compounds',
      'Because halogenated solvents can only be treated via biological aerobic composting',
      'Because the mixture forms an impenetrable polymeric gel that cannot be pumped'
    ],
    correctAnswer: 0,
    explanation:
      'Halogenated solvents (like chloroform or dichloromethane) generate hydrochloric acid and potential dioxins during combustion, requiring costly scrubbers and separate handling streams.'
  },
  {
    question: 'What is the primary mechanism of heavy metal waste treatment via chemical precipitation?',
    options: [
      'Converting soluble toxic metal ions into insoluble metal hydroxides by adjusting pH with lime or sodium hydroxide',
      'Stripping metal atoms out of solution using high-pressure volatile organic solvents',
      'Acidifying the solution below pH 1 to vaporize metal atoms as gaseous oxides',
      'Passing current to thermally decompose metal cations into non-toxic gases'
    ],
    correctAnswer: 0,
    explanation:
      'Adjusting the pH using an alkali (such as $Ca(OH)_2$ or $NaOH$) causes heavy metals like $Pb^{2+}$, $Cu^{2+}$, and $Cd^{2+}$ to precipitate out as solid insoluble metal hydroxides for filtration.'
  }
];

const DYNAMIC_PROGRAMMING_QUESTIONS = [
  {
    question: 'Which two fundamental properties must a computational problem exhibit for Dynamic Programming to be applicable?',
    options: [
      'Optimal substructure and overlapping subproblems',
      'Greedy choice property and divide-and-conquer independence',
      'Asymptotic linearity and strictly deterministic branching',
      'Markov property and polynomial-time reduction'
    ],
    correctAnswer: 0,
    explanation:
      'Dynamic Programming requires optimal substructure (the global optimal solution contains optimal subproblem solutions) and overlapping subproblems (the same subproblems are solved repeatedly).'
  },
  {
    question: 'What is the primary difference between top-down memoization and bottom-up tabulation?',
    options: [
      'Memoization is recursive and computes only necessary states on demand, while tabulation is iterative and fills a table systematically',
      'Memoization guarantees O(1) space, while tabulation always requires exponential O(2^n) auxiliary space',
      'Memoization works only for greedy algorithms, whereas tabulation is designed for divide-and-conquer',
      'Tabulation uses recursion call stacks, whereas memoization avoids all function calls'
    ],
    correctAnswer: 0,
    explanation:
      'Memoization is top-down recursion augmented by a lookup cache; tabulation is bottom-up iterative table filling in dependency order without recursion stack overhead.'
  },
  {
    question: 'In the 0/1 Knapsack problem with n items and maximum capacity W, what is the time complexity of the dynamic programming approach?',
    options: [
      'O(n * W)',
      'O(2^n)',
      'O(n log n)',
      'O(W^2)'
    ],
    correctAnswer: 0,
    explanation:
      'The DP table has dimensions (n + 1) x (W + 1), and each cell takes O(1) computation, leading to a pseudo-polynomial time complexity of O(n * W).'
  },
  {
    question: 'Why does a simple greedy approach fail for the 0/1 Knapsack problem while succeeding for the Fractional Knapsack problem?',
    options: [
      'Because items cannot be subdivided in 0/1 Knapsack, picking highest value-to-weight items can leave wasted capacity',
      'Because the 0/1 Knapsack problem lacks optimal substructure',
      'Because the Fractional Knapsack problem requires exponential time complexity',
      'Because memoization cannot be applied to sorting operations'
    ],
    correctAnswer: 0,
    explanation:
      'In 0/1 knapsack, taking a high ratio item might prevent fitting a better combination of other items. In fractional knapsack, you can take fractional portions of the highest ratio items until capacity is filled.'
  }
];

const TCP_HANDSHAKE_QUESTIONS = [
  {
    question: 'What is the correct sequence of packets in the TCP 3-Way Handshake used to establish a reliable connection?',
    options: [
      'SYN (Client -> Server) -> SYN-ACK (Server -> Client) -> ACK (Client -> Server)',
      'ACK (Client -> Server) -> SYN (Server -> Client) -> FIN (Client -> Server)',
      'SYN (Client -> Server) -> ACK (Server -> Client) -> DATA (Client -> Server)',
      'HELLO (Client -> Server) -> ACCEPT (Server -> Client) -> CONNECT (Client -> Server)'
    ],
    correctAnswer: 0,
    explanation:
      'The client initiates with SYN, the server acknowledges and sends its own synchronize with SYN-ACK, and the client completes the handshake with ACK.'
  },
  {
    question: 'In the second step of the TCP handshake, if the client sends SYN with ISN = 1000, what acknowledgment number (ACK) will the server return in its SYN-ACK?',
    options: [
      '1001',
      '1000',
      '2000',
      '0'
    ],
    correctAnswer: 0,
    explanation:
      'The acknowledgment number specifies the next expected sequence number. Because SYN consumes 1 sequence number, ACK = client_ISN + 1 = 1001.'
  },
  {
    question: 'What type of network attack exploits the half-open state created between step 1 and step 2 of the TCP 3-way handshake?',
    options: [
      'SYN Flood attack',
      'Man-in-the-Middle DNS spoofing',
      'SQL Injection attack',
      'Cross-Site Scripting (XSS)'
    ],
    correctAnswer: 0,
    explanation:
      'A SYN Flood sends a torrent of SYN packets without replying with the final ACK, filling the server connection backlog queue and causing denial of service.'
  },
  {
    question: 'How many packet exchanges are required for standard graceful TCP connection termination (teardown)?',
    options: [
      '4 packets (FIN -> ACK, FIN -> ACK)',
      '3 packets (FIN -> FIN-ACK -> ACK)',
      '2 packets (RESET -> ACK)',
      '1 packet (DISCONNECT broadcast)'
    ],
    correctAnswer: 0,
    explanation:
      'TCP teardown is a 4-way handshake because TCP is full-duplex: each direction of data flow must be closed independently with its own FIN and matching ACK.'
  }
];

const TRANSFORMER_QUESTIONS = [
  {
    question: 'What is the core mathematical formula for Scaled Dot-Product Attention in Transformer architectures?',
    options: [
      'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V',
      'Attention(Q, K, V) = sigmoid(Q * K + V) / d_k',
      'Attention(Q, K, V) = ReLU(Q * V^T) * K',
      'Attention(Q, K, V) = tanh(W_q * Q + W_k * K) * V'
    ],
    correctAnswer: 0,
    explanation:
      'Scaled Dot-Product Attention calculates dot products of queries with keys, scales by 1/sqrt(d_k) to prevent vanishing gradients in softmax, and multiplies by values.'
  },
  {
    question: 'Why is Positional Encoding necessary in Transformer models unlike Recurrent Neural Networks (RNNs)?',
    options: [
      'Because self-attention is permutation-invariant and has no inherent sense of word order',
      'Because positional encodings compress the vocabulary size into binary vectors',
      'Because positional encodings are required to normalize hidden activation layers',
      'Because multi-head attention cannot process tokens with odd sequence lengths'
    ],
    correctAnswer: 0,
    explanation:
      'Self-attention processes all tokens in parallel without sequential recurrent steps. Without adding positional encodings to token embeddings, the model treats the input as an unordered bag of words.'
  },
  {
    question: 'What is the computational complexity of standard Self-Attention with respect to sequence length n?',
    options: [
      'O(n^2) time and memory complexity',
      'O(n log n) time complexity',
      'O(n) linear complexity',
      'O(1) constant complexity'
    ],
    correctAnswer: 0,
    explanation:
      'Every token computes dot products with every other token in the sequence of length n, forming an n x n attention matrix that requires O(n^2) computation and memory.'
  },
  {
    question: 'What is the role of Masked Multi-Head Attention in the decoder of an autoregressive Transformer (like GPT)?',
    options: [
      'To prevent earlier tokens from attending to future tokens during next-token prediction',
      'To mask out padding tokens in the encoder input sequence',
      'To randomly drop weights during backward propagation to prevent overfitting',
      'To quantize floating point weights into 8-bit integers for inference speed'
    ],
    correctAnswer: 0,
    explanation:
      'Causal/Masked attention sets attention weights to future token positions to -infinity before softmax, ensuring predictions at position i depend only on known outputs up to position i.'
  }
];

const ACID_PROPERTIES_QUESTIONS = [
  {
    question: 'In database management systems, what does the "Atomicity" property of ACID guarantee?',
    options: [
      'All operations within a transaction execute completely or none are applied at all (all-or-nothing)',
      'Concurrent transactions execute in complete isolation without interference',
      'Committed data persists permanently even in the event of power loss or crash',
      'Every transaction preserves all declarative database constraints and foreign keys'
    ],
    correctAnswer: 0,
    explanation:
      'Atomicity ensures that if any part of a multi-statement transaction fails, the entire transaction is rolled back via undo logs so the database is never left in a partial state.'
  },
  {
    question: 'Which concurrency anomaly occurs when a transaction reads uncommitted changes written by another concurrent transaction that later rolls back?',
    options: [
      'Dirty Read',
      'Non-repeatable Read',
      'Phantom Read',
      'Lost Update'
    ],
    correctAnswer: 0,
    explanation:
      'A dirty read occurs when Transaction A reads data modified by Transaction B before B commits; if B aborts, A has based its computation on invalid phantom data.'
  },
  {
    question: 'How do relational DBMSs typically guarantee Durability in the ACID model?',
    options: [
      'Using Write-Ahead Logging (WAL) and synchronous disk flushing (fsync) before reporting commit success',
      'By keeping all data purely in high-speed volatile RAM cache without disk writes',
      'By executing every transaction sequentially on a single thread',
      'By using optimistic concurrency control with two-phase locking'
    ],
    correctAnswer: 0,
    explanation:
      'Durability requires that once a transaction commits, its modifications are permanently recorded in non-volatile storage (WAL/redo logs) before the client receives confirmation.'
  },
  {
    question: 'Which transaction isolation level is the strictest and guarantees protection against dirty reads, non-repeatable reads, and phantom reads?',
    options: [
      'Serializable',
      'Repeatable Read',
      'Read Committed',
      'Read Uncommitted'
    ],
    correctAnswer: 0,
    explanation:
      'Serializable isolation ensures concurrent transactions yield identical results to some serial (one-by-one) execution, eliminating all read anomalies at the expense of lower concurrency.'
  }
];

const CRITICAL_SECTION_QUESTIONS = [
  {
    question: 'What are the three mandatory requirements that any valid solution to the Critical Section Problem must satisfy?',
    options: [
      'Mutual Exclusion, Progress, and Bounded Waiting',
      'Atomicity, Consistency, and Durability',
      'Deadlock avoidance, Preemption, and Starvation',
      'Throughput maximization, Round Robin scheduling, and Fairness'
    ],
    correctAnswer: 0,
    explanation:
      'The three classical synchronization requirements are Mutual Exclusion (at most 1 inside), Progress (no indefinite delay in choosing who enters next), and Bounded Waiting (no starvation).'
  },
  {
    question: 'Why does the naive strict alternation algorithm (turn = 1 - turn) fail as a general synchronization solution?',
    options: [
      'It satisfies Mutual Exclusion but violates Progress when a process halts or is slow in its remainder section',
      'It violates Mutual Exclusion by allowing both processes to enter simultaneously',
      'It requires dedicated hardware test-and-set instructions',
      'It causes an immediate kernel stack overflow on multi-core systems'
    ],
    correctAnswer: 0,
    explanation:
      'Strict alternation forces processes to alternate turns. If process 0 stays in its remainder section, process 1 cannot re-enter even though the critical section is completely empty, violating Progress.'
  },
  {
    question: 'In Dijkstra\'s semaphore abstraction, what does the atomic wait() (also known as P operation) do?',
    options: [
      'Decrements the semaphore value; if negative, the calling process is blocked',
      'Increments the semaphore value and wakes up a blocked process',
      'Sets the semaphore value directly to 1 without testing',
      'Swaps the process state between running and zombie'
    ],
    correctAnswer: 0,
    explanation:
      'The wait() / P operation decrements the semaphore counter. If the counter becomes less than 0, the invoking thread is placed into a waiting queue until a signal() / V occurs.'
  },
  {
    question: 'What is a race condition in concurrent programming?',
    options: [
      'A condition where multiple threads access and manipulate shared data concurrently and the outcome depends on the execution timing',
      'A situation where two processes wait indefinitely for resources held by each other',
      'A failure where CPU clock speed exceeds motherboard bus capabilities',
      'A memory leak where allocated heap blocks are never garbage collected'
    ],
    correctAnswer: 0,
    explanation:
      'A race condition occurs when concurrent threads access shared state without proper synchronization, making the final result nondeterministic based on CPU scheduling order.'
  }
];

const FOURIER_SERIES_QUESTIONS = [
  {
    question: 'What is the mathematical purpose of a Fourier Series for a periodic function f(x)?',
    options: [
      'Decomposing the periodic function into an infinite sum of simple harmonically related sines and cosines',
      'Converting continuous analog voltages into quantized discrete binary integers',
      'Computing the derivative of a non-differentiable step function at infinity',
      'Solving polynomial roots through iterative Newton-Raphson approximation'
    ],
    correctAnswer: 0,
    explanation:
      'A Fourier Series decomposes any periodic function with period T into a fundamental frequency and integer harmonic sinusoidal components (sines and cosines).'
  },
  {
    question: 'If a periodic function f(x) defined on [-L, L] is strictly an ODD function (f(-x) = -f(x)), what are its Fourier coefficients?',
    options: [
      'a_0 = 0 and a_n = 0 (the Fourier series contains only sine terms b_n)',
      'b_n = 0 (the Fourier series contains only cosine terms a_n)',
      'All coefficients a_0, a_n, and b_n equal zero',
      'a_0 is non-zero but all higher harmonics a_n and b_n vanish'
    ],
    correctAnswer: 0,
    explanation:
      'For odd functions, symmetry around the origin means the average value a_0 and all cosine terms a_n integrate to zero, yielding a pure Fourier Sine Series.'
  },
  {
    question: 'According to Dirichlet conditions, to what value does a Fourier series converge at a point of jump discontinuity x = c?',
    options: [
      'The arithmetic mean of the left and right hand limits: (f(c+) + f(c-)) / 2',
      'Zero',
      'Positive infinity',
      'The maximum value between f(c+) and f(c-)'
    ],
    correctAnswer: 0,
    explanation:
      'At a jump discontinuity, the Fourier series converges to the midpoint (average) between the left-hand limit f(c-) and the right-hand limit f(c+).'
  },
  {
    question: 'What is the coefficient a_0 in the standard Fourier series formula f(x) = a_0/2 + sum(a_n cos + b_n sin)?',
    options: [
      'Twice the average (DC) value of the function over one full period',
      'The amplitude of the fundamental first harmonic frequency',
      'The phase angle shift between sine and cosine waves',
      'The total root-mean-square energy of the signal'
    ],
    correctAnswer: 0,
    explanation:
      'In the standard formulation with a_0/2 as the constant term, a_0/2 represents the exact DC component (average value) of the function over the period [-L, L].'
  }
];

const WORLD_WAR_2_QUESTIONS = [
  {
    question: 'Which historical event on September 1, 1939 directly triggered Britain and France declaring war on Germany, marking the start of World War II in Europe?',
    options: [
      'Nazi Germany\'s invasion of Poland',
      'The Japanese attack on Pearl Harbor',
      'The signing of the Molotov-Ribbentrop Non-Aggression Pact',
      'The German occupation of the Sudetenland in Czechoslovakia'
    ],
    correctAnswer: 0,
    explanation:
      'Germany\'s blitzkrieg invasion of Poland on Sept 1, 1939 broke international guarantees, prompting Britain and France to declare war on Sept 3, 1939.'
  },
  {
    question: 'Which major confrontation (1942–1943) is widely regarded by military historians as the decisive turning point on the Eastern Front in Europe?',
    options: [
      'The Battle of Stalingrad',
      'The Battle of Britain',
      'The Battle of the Bulge',
      'The Siege of Leningrad'
    ],
    correctAnswer: 0,
    explanation:
      'The Battle of Stalingrad resulted in the destruction and surrender of the German Sixth Army, halting Nazi expansion and putting the Soviet Red Army on the strategic offensive.'
  },
  {
    question: 'What was the code name and date for the massive Allied amphibious invasion of Normandy to liberate Western Europe?',
    options: [
      'Operation Overlord on June 6, 1944 (D-Day)',
      'Operation Barbarossa on June 22, 1941',
      'Operation Market Garden on September 17, 1944',
      'Operation Torch on November 8, 1942'
    ],
    correctAnswer: 0,
    explanation:
      'Operation Overlord launched on D-Day (June 6, 1944), landing over 150,000 Allied troops across Normandy beaches to liberate Nazi-occupied France.'
  },
  {
    question: 'Which international organization was founded in 1945 following the conclusion of World War II to foster global cooperation and prevent future worldwide conflicts?',
    options: [
      'The United Nations (UN)',
      'The League of Nations',
      'The North Atlantic Treaty Organization (NATO)',
      'The Warsaw Pact'
    ],
    correctAnswer: 0,
    explanation:
      'The United Nations (UN) was established in 1945 by 51 nations at the San Francisco Conference to replace the defunct League of Nations and prevent world war.'
  }
];

const BANKS = {
  'process scheduling': [
    {
      question: 'What does a CPU scheduler fundamentally determine in an operating system?',
      options: [
        'Which process runs next on the allocated CPU core',
        'Which disk sector is deleted during garbage collection',
        'Which physical ethernet port receives network packets',
        'Which user account is allowed to modify root credentials'
      ],
      correctAnswer: 0,
      explanation:
        'The CPU scheduler (short-term scheduler) selects from among the processes in the ready state and allocates a CPU core to one of them.'
    },
    {
      question: 'In Round Robin scheduling, what happens if the time quantum is set arbitrarily large (infinite)?',
      options: [
        'It degrades into First-Come First-Served (FCFS) scheduling',
        'It causes an immediate system deadlock',
        'It prioritizes the shortest I/O-bound jobs first',
        'It minimizes average waiting time down to zero'
      ],
      correctAnswer: 0,
      explanation:
        'When the time slice is larger than the longest CPU burst, no process is preempted before completion, making it identical to FCFS.'
    },
    {
      question: 'Which of the following is NOT one of the four Coffman conditions required for a deadlock?',
      options: [
        'Preemption permitted by the kernel',
        'Mutual exclusion',
        'Hold and wait',
        'Circular wait'
      ],
      correctAnswer: 0,
      explanation:
        'The fourth Coffman condition is "no preemption" — resources cannot be forcibly taken from a process holding them. If preemption is permitted, deadlock can be prevented.'
    },
    {
      question: 'What is the "convoy effect" in CPU scheduling?',
      options: [
        'Short processes waiting behind a CPU-intensive long process in FCFS',
        'Multiple threads accessing a shared database index simultaneously',
        'A queue of packets overloading a network switch buffer',
        'Virtual memory swapping thrashing the hard disk'
      ],
      correctAnswer: 0,
      explanation:
        'The convoy effect occurs in FCFS when a CPU-bound process holds the CPU while many I/O-bound processes wait behind it, resulting in poor CPU and device utilization.'
    }
  ],
  // Aliased banks — several topic spellings map to the same curated set.
  'pollination': POLLINATION_QUESTIONS,
  'pollinate': POLLINATION_QUESTIONS,
  'plant reproduction': POLLINATION_QUESTIONS,
  'chemical waste': CHEMICAL_WASTE_QUESTIONS,
  'hazardous waste': CHEMICAL_WASTE_QUESTIONS,
  'toxic waste': CHEMICAL_WASTE_QUESTIONS,
  'waste management': CHEMICAL_WASTE_QUESTIONS,
  'dynamic programming': DYNAMIC_PROGRAMMING_QUESTIONS,
  'memoization': DYNAMIC_PROGRAMMING_QUESTIONS,
  'dp': DYNAMIC_PROGRAMMING_QUESTIONS,
  'dynamic programming & memoization': DYNAMIC_PROGRAMMING_QUESTIONS,
  'tcp': TCP_HANDSHAKE_QUESTIONS,
  'tcp handshake': TCP_HANDSHAKE_QUESTIONS,
  '3-way handshake': TCP_HANDSHAKE_QUESTIONS,
  'tcp/ip 3-way handshake': TCP_HANDSHAKE_QUESTIONS,
  'three way handshake': TCP_HANDSHAKE_QUESTIONS,
  'transformer': TRANSFORMER_QUESTIONS,
  'transformers': TRANSFORMER_QUESTIONS,
  'self-attention': TRANSFORMER_QUESTIONS,
  'attention mechanism': TRANSFORMER_QUESTIONS,
  'neural network transformers & attention': TRANSFORMER_QUESTIONS,
  'acid': ACID_PROPERTIES_QUESTIONS,
  'acid properties': ACID_PROPERTIES_QUESTIONS,
  'database acid properties & transactions': ACID_PROPERTIES_QUESTIONS,
  'critical section': CRITICAL_SECTION_QUESTIONS,
  'critical section problem': CRITICAL_SECTION_QUESTIONS,
  'process synchronization': CRITICAL_SECTION_QUESTIONS,
  'fourier series': FOURIER_SERIES_QUESTIONS,
  'fourier coefficients': FOURIER_SERIES_QUESTIONS,
  'world war 2': WORLD_WAR_2_QUESTIONS,
  'world war ii': WORLD_WAR_2_QUESTIONS,
  'ww2': WORLD_WAR_2_QUESTIONS,
  'wwii': WORLD_WAR_2_QUESTIONS,
  'oops in java': OOP_QUESTIONS,
  'oop in java': OOP_QUESTIONS,
  'oops': OOP_QUESTIONS,
  'oop': OOP_QUESTIONS,
  'object oriented programming': OOP_QUESTIONS,
  'object-oriented programming': OOP_QUESTIONS,
  'binary trees': BINARY_TREE_QUESTIONS,
  'binary tree': BINARY_TREE_QUESTIONS,
  'binary search tree': BINARY_TREE_QUESTIONS,
  'bst': BINARY_TREE_QUESTIONS,
  'binary addition': BINARY_ADDITION_QUESTIONS,
  'binary arithmetic': BINARY_ADDITION_QUESTIONS,
  'adding binary': BINARY_ADDITION_QUESTIONS,
  'deadlock': DEADLOCK_QUESTIONS,
  'java inheritance': JAVA_INHERITANCE_QUESTIONS,
  'inheritance': JAVA_INHERITANCE_QUESTIONS,
  'method overriding': JAVA_INHERITANCE_QUESTIONS,
  '8086 interrupts': INTERRUPT_8086_QUESTIONS,
  'interrupt': INTERRUPT_8086_QUESTIONS,
  'intr': INTERRUPT_8086_QUESTIONS,
  'data structure': DATA_STRUCTURE_QUESTIONS,
  'stack': DATA_STRUCTURE_QUESTIONS,
  'queue': DATA_STRUCTURE_QUESTIONS,
  'linked list': DATA_STRUCTURE_QUESTIONS
};

// Curated bank loader: only returns questions if a genuine curated bank matches.
const resolveBank = (topic) => {
  const t = (topic || '').trim().toLowerCase();
  if (BANKS[t]) return BANKS[t];
  const hit = Object.keys(BANKS).find((k) => new RegExp(`\\b${escapeRx(k)}s?\\b`).test(t));
  return hit ? BANKS[hit] : null;
};

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** True when a curated question bank matches this topic. */
export const hasQuizBank = (topic) => Boolean(resolveBank(topic));

/**
 * Returns curated quiz questions when an exact match exists.
 * Returns null if no curated bank is available, ensuring the system
 * uses dynamic general-purpose AI quiz generation rather than fake templates.
 */
export const buildQuizQuestions = (topic, count = 4) => {
  const bank = resolveBank(topic);
  if (!bank || !Array.isArray(bank) || bank.length === 0) {
    return null;
  }
  return bank.slice(0, count).map((q, i) => ({
    id: `q${i + 1}`,
    question: q.question,
    options: [...q.options],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    xp: q.xp || QUESTION_XP[i % QUESTION_XP.length]
  }));
};

