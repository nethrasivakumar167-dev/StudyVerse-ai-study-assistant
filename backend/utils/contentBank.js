/**
 * Curated, academically genuine content for demo seed data and reference.
 *
 * Each entry: summary, 4 explanation sections, and ready-to-save study notes.
 */

const makeEntry = (keys, title, data) => ({ keys, title, ...data });

export const CONTENT_BANK = [
  makeEntry(
    ['process scheduling', 'cpu scheduling', 'round robin', 'convoy effect', 'shortest job first', 'scheduling algorithms'],
    'Process Scheduling',
    {
      summary:
        'CPU scheduling decides which ready process runs next, trading off waiting time, throughput, and fairness across algorithms like FCFS, SJF, and Round Robin.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Think of a single restaurant kitchen (the CPU) with a queue of orders (ready processes). A seating-order rule (FCFS) is fair but one huge order stalls everyone; serving the shortest orders first (SJF) minimizes total wait but needs to know order sizes; giving each order a fixed 5-minute slot (Round Robin) keeps everyone moving. Scheduling algorithms are exactly these queue disciplines applied to CPU time.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• The short-term scheduler picks from the ready queue; context switching saves and restores process state between runs.\n• FCFS is simple but suffers the convoy effect; SJF is provably optimal for average waiting time but requires future burst-length estimates.\n• Round Robin uses a fixed time quantum — too large degrades to FCFS, too small wastes time on context switches.\n• Key metrics: waiting time, turnaround time, response time, throughput, and CPU utilization.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• An infinite Round Robin quantum is identical to FCFS — a favorite exam trap.\n• SJF can starve long processes; preemptive SJF (SRTF) can starve them indefinitely.\n• Higher-priority scheduling needs a starvation remedy (aging), or it is incomplete.\n• Average waiting time calculations assume arrival/burst times given in the question — never estimate them.'
        },
        {
          title: '4. Exam Tip',
          content:
            'For scheduling numericals, draw the Gantt chart first, then compute waiting = turnaround − burst for each process; state the algorithm\'s assumption (preemptive or not) before you start.'
        }
      ],
      notes: {
        bulletPoints: [
          'Short-term (CPU) scheduler chooses the next process from the ready queue; context switch = save state out, restore state in.',
          'FCFS is non-preemptive and prone to the convoy effect: one CPU-bound job blocks many short I/O-bound jobs.',
          'SJF gives the minimum average waiting time but needs future burst knowledge; SRTF is its preemptive form.',
          'Round Robin quantum too large → behaves like FCFS; too large context-switch overhead when too small (typical q = 10–100 ms).',
          'Priority scheduling can starve low-priority jobs; aging (gradually raising priority) is the standard fix.',
          'Aging, starvation, and turnaround = turnaround − burst are high-frequency one-mark questions.'
        ],
        examAlert:
          'An exam favourite: "Infinite time quantum in Round Robin" = FCFS, and always distinguish preemptive vs non-preemptive before computing average waiting time.'
      }
    }
  ),
  makeEntry(
    ['dynamic programming', 'memoization', 'tabulation', 'overlapping subproblems', 'optimal substructure'],
    'Dynamic Programming & Memoization',
    {
      summary:
        'Dynamic programming solves problems with overlapping subproblems and optimal substructure by caching subproblem answers instead of recomputing them, via top-down memoization or bottom-up tabulation.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Like keeping a spreadsheet of previously computed cells: every time a formula repeats, you reuse the stored result instead of recalculating it. Dynamic programming identifies the small repeating subproblems in a hard question, solves each once, stores the answer, and builds the final solution from those stored pieces.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Two required properties: optimal substructure (optimal solution is built from optimal sub-solutions) and overlapping subproblems (the same subproblem appears many times).\n• Top-down (memoization): recursive, computes only needed states, uses call stack.\n• Bottom-up (tabulation): iterative over subproblem order, no recursion overhead, can be space-optimized.\n• Classic examples: Fibonacci, 0/1 knapsack, LCS, edit distance, matrix chain multiplication.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Greedy algorithms also need optimal substructure but NOT overlapping subproblems — confusing greedy with DP is a common error.\n• Forgetting the base case or the recurrence derivation and jumping straight to code.\n• Memoizing the wrong state variable (e.g., omitting remaining capacity in knapsack).\n• Not realizing tabulation can drop to O(1) or O(n) space when only the previous row is needed.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Exams reward the process: define the state, write the recurrence with base cases, state the complexity, and only then sketch the algorithm — marks are often given for each step even if the code is incomplete.'
        }
      ],
      notes: {
        bulletPoints: [
          'DP applies only with BOTH optimal substructure AND overlapping subproblems.',
          'Memoization = top-down recursion + cache; tabulation = bottom-up table fill (usually faster, iterative).',
          'Fibonacci naive recursion is O(2ⁿ); memoized it is O(n) time and O(n) space.',
          '0/1 knapsack recurrence: dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]]) — O(nW) time.',
          'Space optimization works when a state depends only on the previous row/column (drop the full table).'
        ],
        examAlert:
          'Always state the recurrence and base cases before coding, and watch for questions where a greedy choice fails — that is the signal the intended solution is DP.'
      }
    }
  ),
  makeEntry(
    ['tcp handshake', '3-way handshake', 'three way handshake', 'tcp', 'connection establishment', 'syn flood'],
    'TCP/IP 3-Way Handshake',
    {
      summary:
        'TCP establishes a reliable connection with a three-way handshake — SYN, SYN-ACK, ACK — so both sides agree on initial sequence numbers and ready their send/receive buffers before data flows.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Like confirming a phone call before talking: "Can you hear me?" (SYN), "Yes, can you hear me?" (SYN-ACK), "Loud and clear, let\'s start" (ACK). Both sides verify two-way communication and agree to begin — TCP does this so both endpoints simultaneously confirm sequence numbers and window sizes before sending data.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Step 1: client sends SYN with its initial sequence number ISN_c → client state SYN-SENT.\n• Step 2: server replies SYN-ACK acknowledging ISN_c + 1 and supplying ISN_s → server state SYN-RECEIVED.\n• Step 3: client sends ACK acknowledging ISN_s + 1 → both sides reach ESTABLISHED.\n• Sequence numbers enable in-order reassembly, duplicate detection, and retransmission.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• It is three messages but only two parties "handshaking" — SYN, SYN-ACK, ACK are the three segments.\n• SYN Flood attacks fill the server\'s half-open queue between steps 1 and 2; mitigated with SYN cookies.\n• Connection teardown is a separate FOUR-step handshake (FIN/ACK each direction) — do not mix them up.\n• ISNs are chosen unpredictably (not 0) to prevent sequence prediction attacks.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Be able to draw the sequence diagram with client/server states (SYN-SENT, ESTABLISHED, etc.) and explain what each acknowledgment number refers to — that is where exam marks concentrate.'
        }
      ],
      notes: {
        bulletPoints: [
          'Three segments: SYN → SYN-ACK → ACK; both sides confirm two-way reachability before data transfer.',
          'Acknowledgment number = peer\'s ISN + 1, proving the next expected sequence byte.',
          'After establishment both sides advertise window sizes for flow control.',
          'Half-open state between SYN and SYN-ACK is exploited by SYN floods; SYN cookies remove server state.',
          'Teardown needs four steps (each side sends FIN and ACKs the other\'s FIN).'
        ],
        examAlert:
          'Do not confuse the 3-way establishment with the 4-way teardown, and remember ACK numbers are ISN+1 — a classic one-mark trap.'
      }
    }
  ),
  makeEntry(
    ['transformer', 'self-attention', 'attention mechanism', 'positional encoding', 'neural network attention', 'multi-head attention'],
    'Neural Network Transformers & Attention',
    {
      summary:
        'Transformers process sequences entirely through self-attention — every token scores every other token to decide what to focus on — replacing recurrence with parallel computation plus positional encoding to retain order.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Reading a long sentence where you may glance back at any earlier word to resolve "it" or a pronoun: self-attention does exactly this for every token at once. Instead of processing words strictly left-to-right like RNNs, the transformer lets each word directly consult every other word, then combines those weighted views.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Self-attention computes Query, Key, Value vectors per token: Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V.\n• The √dₖ scaling keeps softmax inputs from saturating as dimensions grow.\n• Multi-head attention runs several attention operations in parallel, capturing different relationships (syntactic, semantic, positional).\n• Positional encoding (sinusoidal or learned) injects word-order information, since attention alone is permutation-invariant.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Attention is order-blind without positional encoding — the "bag of words" failure is the classic misconception question.\n• Self-attention costs O(n²) in sequence length — the standard reason transformers are expensive on long inputs.\n• Encoder-only (BERT) vs decoder-only (GPT) vs full encoder-decoder (original translation transformer) — know which masks which.\n• Masked attention prevents a token from attending to future tokens in autoregressive generation.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Be able to write the attention formula, explain why √dₖ appears, and state one advantage over RNNs (parallel training) and one disadvantage (quadratic memory) — that trio appears constantly.'
        }
      ],
      notes: {
        bulletPoints: [
          'Self-attention lets each token attend to all tokens: Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V.',
          'Scaling by √dₖ keeps dot products in a range where softmax does not saturate.',
          'Multi-head attention = several attention heads in parallel; outputs are concatenated and linearly projected.',
          'Positional encoding is mandatory — raw attention is permutation-invariant.',
          'Training is fully parallel (unlike RNNs) at the cost of O(n²) time/memory in sequence length.'
        ],
        examAlert:
          'Three guaranteed questions: write the attention formula, justify the √dₖ scaling, and explain why positional encoding is needed.'
      }
    }
  ),
  makeEntry(
    ['acid', 'acid properties', 'database transaction', 'transactions in dbms', 'isolation level', 'concurrency control'],
    'Database ACID Properties & Transactions',
    {
      summary:
        'ACID defines what a reliable DBMS transaction guarantees: Atomicity (all-or-nothing), Consistency (valid states only), Isolation (concurrent transactions do not interfere), and Durability (committed data survives crashes).',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'A bank transfer: either both accounts update or neither does (atomicity); total money never changes (consistency); your transfer never mixes with a concurrent withdrawal\'s partial results (isolation); once the receipt prints, a power cut cannot undo it (durability). ACID is the contract that makes such operations trustworthy.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Atomicity via undo logs/rollback; Durability via write-ahead logging (WAL) and fsync on commit.\n• Isolation via locking (2PL) or MVCC; anomaly levels: dirty read, non-repeatable read, phantom read.\n• Standard isolation ladder: Read Uncommitted → Read Committed → Repeatable Read → Serializable (strictly fewer anomalies, less concurrency).\n• Schedule conflict-serializability is checked with a precedence graph — acyclic means equivalent to a serial schedule.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Consistency means the DB\'s own integrity constraints hold — not "data is up to date".\n• Higher isolation reduces concurrency; Serializable may use strict 2PL and can deadlock (wound-wait / wait-die prevent it).\n• Phantoms are new rows appearing between reads — Repeatable Read does not always prevent them.\n• Cascadeless (recoverable) schedules avoid dirty reads cascading rollbacks — a frequent short-answer topic.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Define each letter in one precise sentence, give one banking example, then map isolation levels to the specific anomaly each prevents — that structure scores full marks in most ACID questions.'
        }
      ],
      notes: {
        bulletPoints: [
          'Atomicity: all operations of the transaction commit or none do (undo log provides rollback).',
          'Consistency: transaction takes the DB from one valid state to another, preserving all constraints.',
          'Isolation: concurrent transactions produce a result equal to some serial order (conflict-serializability).',
          'Durability: once committed, changes survive failures — implemented with write-ahead logging + fsync.',
          'Anomaly ladder: dirty read (Read Uncommitted) → non-repeatable read (Read Committed) → phantom (Repeatable Read).'
        ],
        examAlert:
          'Map each isolation level to exactly which anomaly it prevents — "higher level = fewer anomalies but lower concurrency" is the sentence examiners look for.'
      }
    }
  ),
  makeEntry(
    ['quantum computing', 'superposition', 'qubit', 'entanglement', 'decoherence', 'bloch sphere'],
    'Quantum Computing & Superposition',
    {
      summary:
        'Quantum computers store information in qubits that hold a weighted superposition of |0⟩ and |1⟩; interference amplifies correct answers and measurement collapses the state to a single classical value.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'A coin spinning in the air is neither heads nor tails until it lands — that "in-between" is superposition. A qubit is described by amplitudes for |0⟩ and |1⟩ (complex numbers whose squared magnitudes sum to 1), and algorithms are choreographed so wrong answers\' amplitudes cancel while right answers reinforce, then the qubit "lands" when measured.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• State: |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1; measurement yields 0 w.p. |α|², 1 w.p. |β|².\n• The Bloch sphere represents a single qubit as a point on a unit sphere; X/Y/Z gates rotate it.\n• Entanglement links qubits so joint states cannot be factored into separate qubits — key to teleportation and error correction.\n• Superposition + interference + entanglement are the three resources; algorithms: Deutsch-Jozsa, Grover (quadratic speedup), Shor (exponential for factoring).'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Superposition is NOT "0 and 1 at once in the classical sense" — it is a probabilistic amplitude vector; measurement destroys it (collapse).\n• n qubits represent 2ⁿ amplitudes, but you extract only n classical bits per measurement — no free parallel readout.\n• Decoherence: interaction with the environment destroys superposition — why qubits need cooling/shielding and error correction.\n• Cloning an arbitrary unknown quantum state is impossible (no-cloning theorem).'
        },
        {
          title: '4. Exam Tip',
          content:
            'For numericals, normalize the state (squared magnitudes sum to 1) and compute measurement probabilities from the amplitudes; conceptually, be ready to contrast one algorithm\'s speedup against its classical baseline.'
        }
      ],
      notes: {
        bulletPoints: [
          'Qubit state |ψ⟩ = α|0⟩ + β|1⟩; measurement returns 0 or 1 with probabilities |α|², |β|² and collapses the state.',
          'Bloch sphere: geometric picture of a single qubit; gates are rotations on the sphere.',
          'Superposition, interference, and entanglement are the three computational resources of quantum algorithms.',
          'Decoherence from environmental interaction destroys fragile superpositions — the main engineering obstacle.',
          'Grover search: O(√N) vs O(N); Shor factoring: exponential speedup over the best known classical factoring.'
        ],
        examAlert:
          'Watch two traps: measurement yields only n bits from n qubits (no free parallelism), and the no-cloning theorem forbids copying unknown quantum states.'
      }
    }
  ),
  makeEntry(
    ['raft', 'consensus', 'distributed consensus', 'leader election', 'paxos'],
    'Distributed Consensus & Raft',
    {
      summary:
        'Distributed consensus lets a set of nodes agree on one shared value/order of operations despite failures; Raft achieves this with leader election by majority vote, replicated logs, and heartbeats in terms.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'A committee that must approve one meeting time: without a chair (leader) people propose in parallel and reach nothing; elect a chair by majority vote, everyone sends proposals through them, and once a majority confirms, the decision is final even if some members drop off. Raft institutionalizes exactly this: elect a leader per term, replicate entries, commit on majority.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Three roles: leader, follower, candidate; a follower times out → starts an election with a term number → majority grants vote → leader.\n• Terms increase monotonically; at most one leader per term — stale leaders are detected and deposed.\n• Log replication: client commands go to the leader, appended, then replicated; an entry commits once a majority stores it.\n• Safety: elections only succeed with up-to-date logs (election restriction), ensuring committed entries never disappear.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Split vote (two candidates tie) → election timeout restarts with randomized backoff — randomness is the cure, not a flaw.\n• Majority = ⌊n/2⌋+1 nodes; a 3-node cluster tolerates 1 failure, a 5-node cluster tolerates 2 — minority partitions must stop serving writes.\n• Consensus requires a majority of nodes to be LIVE — unlike simple replication, availability drops during partitions.\n• Raft was designed for understandability; Paxos is older and harder — a common comparison question.'
        },
        {
          title: '4. Exam Tip',
          content:
            'For Raft questions, always narrate the mechanism in order — randomized timeout → term-based election → majority → log replication → majority commit — and be able to justify why majority quorums prevent two conflicting committed entries.'
        }
      ],
      notes: {
        bulletPoints: [
          'Leader elected by majority vote; candidates request votes with (term, lastLogIndex, lastLogTerm).',
          'At most one leader per term; higher term numbers force old leaders to step down.',
          'An entry commits after replication to a majority; committed entries are durable and never overwritten.',
          'Randomized election timeouts resolve split votes (two candidates with equal votes).',
          'n nodes tolerate ⌊(n−1)/2⌋ failures; minority side of a partition cannot commit.'
        ],
        examAlert:
          'Quorum math is the favourite: "How many failures does a 5-node Raft cluster tolerate?" — and remember split votes are resolved by randomized timeouts, not by priority.'
      }
    }
  ),
  makeEntry(
    ['deadlock', 'deadlocks', 'coffman', "banker's algorithm", 'resource allocation graph', 'starvation'],
    'Operating System Deadlocks',
    {
      summary:
        'A deadlock is a permanent wait cycle where processes hold resources others need; it requires four Coffman conditions simultaneously, and is handled by prevention, avoidance (Banker\'s algorithm), detection plus recovery, or ignorance.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Four drivers meeting nose-to-nose at a narrow crossroads: each holds their lane (mutual exclusion), refuses to reverse (no preemption), waits for the space ahead (hold and wait), and everyone\'s needed space belongs to the next driver (circular wait). Remove any one condition — someone backs up — and traffic flows again.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Four Coffman conditions: mutual exclusion, hold and wait, no preemption, circular wait — ALL four must hold.\n• Prevention breaks one condition by design (e.g., ordered resource acquisition kills circular wait).\n• Avoidance uses Banker\'s algorithm: grant only if the resulting state is safe (some finish order exists).\n• Detection + recovery: allow deadlocks, find cycles in the wait-for graph, then kill/rollback a victim.\n• Resource Allocation Graph: with single instances, a cycle IMPLIES deadlock; with multi-instance resources, a cycle is only necessary, not sufficient.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• "No preemption" is a Coffman condition — preemption is NOT permitted in deadlock; confusing this with "preemption prevents deadlock" is common.\n• Safe state ≠ no deadlock; safe state guarantees deadlock absence, unsafe does NOT mean deadlock exists.\n• Starvation (indefinite denial of a resource) is different from deadlock (cyclic waiting) — remedies differ (aging vs breaking the cycle).\n• In a multi-instance RAG, cycle ≠ deadlock — single-instance RAG: cycle ⇔ deadlock.'
        },
        {
          title: '4. Exam Tip',
          content:
            'For Banker\'s algorithm questions, show the Need matrix (Max − Allocation), then test each process against Available in some order — an existing finish sequence is the proof of safety the marks require.'
        }
      ],
      notes: {
        bulletPoints: [
          'Four Coffman conditions: mutual exclusion, hold and wait, no preemption, circular wait — all four are necessary.',
          'Prevention = break one condition (e.g., impose total resource order to break circular wait).',
          'Avoidance (Banker\'s): grant only from safe states where some process finish order exists.',
          'Safe state ⇒ no deadlock; unsafe state ⇏ deadlock (it only means deadlock is possible).',
          'RAG: single-instance cycle ⇔ deadlock; multi-instance cycle is necessary but not sufficient.'
        ],
        examAlert:
          'Two exam magnets: "no preemption" IS a Coffman condition (preemption is not allowed during deadlock), and safe/unsafe state definitions are strictly one-directional implications.'
      }
    }
  ),
  makeEntry(
    ['graph traversal', 'breadth first search', 'depth first search', 'bfs', 'dfs', 'traversal'],
    'Graph Traversal: BFS vs DFS',
    {
      summary:
        'BFS explores a graph level by level using a FIFO queue (shortest path in unweighted graphs), while DFS dives along one path using a LIFO stack/recursion (cycle detection, topological order) — both run in O(V + E) with adjacency lists.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'BFS is like ripples spreading from a stone dropped in water — every point at distance 1 is visited before distance 2. DFS is like exploring a maze by walking as deep as possible and backtracking only at dead ends. Both visit every vertex and edge exactly once, so both cost O(V + E).'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• BFS uses a FIFO queue → visits in non-decreasing edge distance → shortest path in UNWEIGHTED graphs; also level-order and bipartiteness checks.\n• DFS uses a stack/recursion with discovery and finish times → topological sort, cycle detection (back edges), strongly connected components.\n• Both require a visited structure; in cyclic graphs omitting it causes infinite loops.\n• Memory: BFS can hold an entire frontier (O(w) width), DFS holds O(depth) — space trade-off depends on graph shape.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• BFS does NOT give shortest paths in weighted graphs (that is Dijkstra/Bellman-Ford).\n• Mark visited on ENQUEUE for BFS (not dequeue) or duplicates flood the queue.\n• Recursion depth of DFS can hit V in a deep graph — iterative DFS with an explicit stack avoids stack overflow.\n• Directed-graph cycle detection uses the 3-color (white/gray/black) scheme; a back edge to a GRAY node signals a cycle.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Given a small graph, be ready to output BOTH traversal sequences from a specified start node — draw the queue/stack beside the graph; traversal order questions are nearly guaranteed marks.'
        }
      ],
      notes: {
        bulletPoints: [
          'BFS = FIFO queue, level-order, shortest path in unweighted graphs; DFS = LIFO stack/recursion, deep-first with backtracking.',
          'Both are O(V + E) time with adjacency lists; BFS uses O(width) space, DFS O(depth).',
          'DFS yields topological order (reverse finish times) and detects cycles via back edges to gray nodes.',
          'Mark visited when enqueuing in BFS to avoid duplicate queue entries.',
          'BFS fails for shortest paths only when edge weights exist — use Dijkstra instead.'
        ],
        examAlert:
          'Two classic traps: BFS shortest path is valid only for unweighted graphs, and forgetting the visited set in a cyclic graph causes infinite loops.'
      }
    }
  ),
  makeEntry(
    ['normalization', '1nf', '2nf', '3nf', 'functional dependency', 'boyce codd'],
    'Database Normalization (1NF–3NF)',
    {
      summary:
        'Normalization decomposes tables to remove redundancy and update anomalies: 1NF removes multi-valued attributes, 2NF removes partial dependencies, and 3NF removes transitive dependencies on the key.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Like splitting a cluttered spreadsheet where one column repeats whole clusters of unrelated data: each fact should live in exactly one place, keyed correctly. Every normal form removes one specific kind of bad dependency, trading extra joins for update safety.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• 1NF: atomic attribute values; no repeating groups or arrays in a cell.\n• 2NF: 1NF + no partial dependency of a non-prime attribute on part of a composite key.\n• 3NF: 2NF + no transitive dependency (non-key → non-key); equivalently every non-key attribute depends directly on the key.\n• Functional dependency X → Y means Y is uniquely determined by X; candidate keys, prime/non-prime attributes drive all tests.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• 2NF/3NF only matter for COMPOSITE keys — a single-attribute key automatically satisfies 2NF and 3NF regarding partial/transitive dependency.\n• BCNF is stricter: every determinant must be a candidate key (3NF allows a determinant that is a proper subset of a candidate key in some cases).\n• Normalization reduces redundancy but can hurt read performance — denormalization is sometimes chosen deliberately.\n• Decomposition must be lossless-join and dependency-preserving — always verify before accepting a split.'
        },
        {
          title: '4. Exam Tip',
          content:
            'For FD questions, compute candidate keys first (attributes not on any RHS + closure test), then classify each FD: partial (→ not 2NF), transitive (→ not 3NF), determinant non-key (→ not BCNF).'
        }
      ],
      notes: {
        bulletPoints: [
          '1NF: all values atomic; no repeating groups inside a cell.',
          '2NF: eliminate partial dependency of non-prime attributes on part of a composite key.',
          '3NF: eliminate transitive dependencies — every non-key attribute depends on the key, the whole key, and nothing but the key.',
          'BCNF: every determinant is a candidate key (stricter than 3NF).',
          'Lossless join + dependency preservation are required for a correct decomposition.'
        ],
        examAlert:
          'Compute candidate keys BEFORE judging normal form, and remember 2NF partial dependencies require a composite key — the most common calculation mistake.'
      }
    }
  ),
  makeEntry(
    ['hashing', 'hash table', 'collision resolution', 'open addressing', 'chaining'],
    'Hashing & Collision Resolution',
    {
      summary:
        'Hashing maps keys to table slots via a hash function for O(1) average lookup; collisions (two keys hashing alike) are resolved by chaining or open addressing (linear/quadratic probing, double hashing).',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'A locker room where your roll number directly names your locker: no searching, walk straight there. Two students assigned the same locker is a collision — resolved by attaching a chain (chaining) or trying the next free locker in a fixed pattern (open addressing).'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Good hash functions: deterministic, uniform distribution, fast to compute; division method h(k) = k mod m; multiplication h(k) = ⌊m(kA mod 1)⌋.\n• Load factor α = n/m controls performance; chaining degrades to O(1+α); rehashing keeps α low.\n• Chaining: each slot holds a list — simple, tolerant of deletions, extra pointer memory.\n• Open addressing: probe sequence continues in-table — linear probing (cluster), quadratic probing, double hashing; deletions need tombstones.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Linear probing suffers primary clustering; quadratic probing reduces it but cannot guarantee all slots are probed without a prime table size.\n• Successful search in linear probing ≈ (1 + 1/(1−α))/2; know how α drives cost.\n• Deletion in open addressing is NOT simple removal — it breaks probe chains (use tombstones).\n• Worst case for any hash table is O(n) (all keys collide) — balanced trees guarantee O(log n) instead.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Collision numericals want the exact probe sequence: state the table size and formula first, show each probe, and stop when the slot is free or the table is full — partial sequences rarely earn marks.'
        }
      ],
      notes: {
        bulletPoints: [
          'Average-case operations are O(1); worst case O(n) when collisions cluster.',
          'Load factor α = n/m; chaining cost O(1+α), so rehash when α grows.',
          'Linear probing = primary clustering; quadratic probing reduces clustering; double hashing uses a second hash for step size.',
          'Open addressing requires tombstones for deletion to keep probe chains intact.',
          'h(k) = k mod m works best when m is prime and keys have no small common factor.'
        ],
        examAlert:
          'Probe-sequence numericals must show table size and probing formula explicitly, and remember: deletion in open addressing needs tombstones — plain removal corrupts searches.'
      }
    }
  ),
  makeEntry(
    ['binary addition', 'binary arithmetic', 'adding binary', 'binary numbers'],
    'Binary Addition',
    {
      summary:
        'Binary addition combines two binary numbers one column at a time using four single-bit rules, propagating a carry whenever a column sums to 2 or more — the primitive operation behind every arithmetic instruction a CPU executes.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Adding binary numbers works exactly like the column addition you learned in school, with one change: instead of carrying over when a column reaches 10, you carry the moment a column reaches 2. A bit has only two states, so every sum must be forced back into {0, 1} and the overflow walks leftward as a carry chain. That is the whole algorithm — decimal carrying with the threshold halved.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Four single-bit rules: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (sum 0, carry 1), and 1+1+1=11 when an incoming carry is included.\n• Columns are added from right (least significant bit) to left; the carry-out of each column becomes a carry-in for the next, so one carry can ripple through several positions.\n• A full adder implements a single column: inputs A, B and carry-in produce Sum and carry-out — chains of full adders build multi-bit adders.\n• Worked example: 1101 + 1010 → column sums 1, 1, 1, 10, then the final carry give 10111 (13 + 10 = 23 in decimal).\n• The leftmost carry-out adds a new bit, so a binary sum can be one bit wider than both operands (this same mechanism underlies overflow in fixed-width registers).\n• Subtraction reuses the same hardware: A − B is computed as A + (2\'s complement of B), which is why adders and subtractors are one ALU unit.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Dropping the final carry-out: 11 + 11 is 110 (six), not 10 — forgetting the last carry is the single most common error.\n• Writing "2" as a binary digit: a column that sums to 2 must be recorded as 0 with a carry, never as the symbol 2.\n• Aligning operands from the left instead of the right — always pad on the left so least-significant bits line up.\n• Reading the result 10 as decimal ten while still in binary (10₂ = two).\n• Ignoring sign: with signed 2\'s-complement numbers the same hardware wraps around, so a positive result can appear negative when the carry-out disagrees with the sign bit.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Show the carry explicitly above each column, then verify by converting both operands and your result to decimal (13 + 10 = 23 confirms 10111). Examiners award method marks for the carry row — never do binary addition mentally on paper.'
        }
      ],
      notes: {
        bulletPoints: [
          'Single-bit rules: 0+0=0 · 0+1=1 · 1+0=1 · 1+1=10 (sum 0, carry 1) · 1+1+1=11 (sum 1, carry 1).',
          'A full adder computes one column from A, B and carry-in, emitting Sum and carry-out; chained full adders form a ripple-carry adder.',
          '1101 + 1010 = 10111 — thirteen plus ten equals twenty-three, confirmed by decimal conversion.',
          'The carry-out of the most-significant column creates a new bit, so sums may be wider than the operands.',
          "Binary subtraction uses the same adder by adding the 2's complement of the subtrahend (invert, add 1)."
        ],
        examAlert:
          'Binary arithmetic numericals must show the carry row and end with a decimal cross-check — a dropped final carry is the most frequently penalized mistake.'
      }
    }
  ),
  makeEntry(
    ['java inheritance', 'inheritance', 'method overriding', 'superclass'],
    'Java Inheritance',
    {
      summary:
        'Java inheritance lets a class reuse and extend another class through the extends keyword, forming an IS-A hierarchy in which subclasses inherit accessible members and may override them to enable runtime polymorphism.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'A child inherits traits from a parent and then adds abilities of their own — that is inheritance in one sentence. In Java, a subclass starts with everything its superclass already provides (fields and methods it can see) and specializes by overriding methods it needs to change. The superclass is the general template; the subclass is the specialized version, and any parent-type reference can stand in for a child object.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• extends establishes the relationship: class Child extends Parent. Java allows single class inheritance only, and every class ultimately extends java.lang.Object.\n• Inherited members: all non-private fields and methods with their visibility (default, protected, public). Private members exist in the object but are unreachable from the subclass; constructors are not inherited — they chain through super().\n• Method overriding: same name, same signature (and compatible return type) in the subclass, usually marked @Override. This enables dynamic method dispatch — a Parent reference calling the Child implementation at runtime.\n• Method overloading: same name, different parameter list, resolved at compile time — a completely different mechanism from overriding.\n• super() must be the first statement of a constructor and invokes the parent constructor; super.method() calls the overridden parent version explicitly.\n• Access ladder: private < default < protected < public; protected members are visible to subclasses and classes in the same package.\n• IS-A (inheritance) versus HAS-A (aggregation/composition): Dog IS-A Animal, Car HAS-A Engine — exam questions test telling them apart.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Overloading is not overriding: a changed parameter list means overload (compile time); only an identical signature overrides (runtime).\n• Private and static members are not overridden — private methods are invisible to subclasses and static methods are hidden, not overridden.\n• Field hiding: a subclass field with the same name hides the parent field; fields are never polymorphic — only methods dispatch dynamically.\n• Forgetting super(): if the parent has no no-arg constructor, the subclass must call an existing super(...) explicitly or compilation fails.\n• Trying to extend two classes — Java forbids it by design (diamond problem); use interfaces for multiple inheritance of behavior.\n• Assuming the reference type picks the method: the reference decides which methods are CALLABLE, the runtime object type decides which implementation RUNS.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Draw the reference-type versus object-type table for every dispatch question, and annotate each code snippet with "overload (compile time)" or "override (runtime)". Signature comparison plus @Override is the examiner\'s favourite way to test Java inheritance in one mark.'
        }
      ],
      notes: {
        bulletPoints: [
          'Java supports single inheritance for classes; multiple inheritance of behavior comes from interfaces (with default methods since Java 8).',
          'Overriding = same signature in a subclass, chosen at runtime by the actual object; overloading = same name, different parameters, chosen at compile time.',
          'super() invokes the superclass constructor and must be the first statement; constructors themselves are never inherited.',
          'private members and static methods are not overridden — they are inaccessible or hidden respectively.',
          'A Parent-typed reference holding a Child object runs the Child\'s overridden method — the core of runtime polymorphism.'
        ],
        examAlert:
          'Inheritance questions hinge on signature comparison: same signature = override (runtime), different parameters = overload (compile time) — and fields are hidden, never overridden.'
      }
    }
  ),
  makeEntry(
    ['8086 interrupt', 'interrupt', 'intr', 'nmi', 'interrupt vector'],
    '8086 Interrupts',
    {
      summary:
        'An interrupt suspends the currently executing 8086 program so an urgent routine can run: the processor pushes FLAGS, CS and IP, reads the handler address from the Interrupt Vector Table, and returns with IRET once the service routine finishes.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'You are writing an essay when the phone rings — you note exactly where you stopped, answer the call, then return to that precise sentence. An 8086 interrupt does the same: it finishes the current instruction, marks its place by pushing FLAGS, CS and IP onto the stack, handles the urgent event through a service routine, then resumes with IRET. The Interrupt Vector Table is the directory that maps each interrupt number to its handler.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Two sources: hardware interrupts (INTR, maskable, and NMI, non-maskable) and software interrupts (the INT n instruction executed by the program itself).\n• The Interrupt Vector Table (IVT) sits at 0000:0000 — 256 entries × 4 bytes (handler IP then CS). Interrupt type n points to address n × 4.\n• Fixed types: type 2 = NMI, type 3 = single-step trap, type 4 = overflow; INT 21h (type 33) is the DOS service gateway — AH selects the function.\n• Response sequence: finish the current instruction → push FLAGS, CS, IP → clear IF and TF → fetch IP and CS from the IVT entry → jump to the handler.\n• Masking: INTR is acknowledged only when IF = 1 (STI sets it, CLI clears it); NMI ignores IF entirely. Software INT n also ignores IF.\n• IRET pops IP, CS and FLAGS, restoring both the execution point and the prior mask state — a plain RET is never enough.\n• Polling versus interrupts: polling wastes cycles checking a condition; interrupts let the CPU work until the device signals via the INTR pin and the INTA cycle acknowledges it.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Confusing INTR with NMI: INTR is maskable through IF; NMI (type 2) is always accepted, which is why it handles critical events like power failure.\n• Wrong IVT arithmetic: the entry address is type × 4 — IP at type×4, CS at type×4+2; forgetting the 4-byte entry size misplaces the handler.\n• Returning with RET instead of IRET — IP and CS would restore but FLAGS (including the interrupt-enable state) would stay wrong.\n• Assuming FLAGS survive unchanged: the processor clears IF and TF on entry, so a nested interrupt cannot occur until the handler re-enables IF with STI.\n• Treating INT 21h as hardware: it is a software interrupt used for DOS system calls (09h print, 4Ch terminate).'
        },
        {
          title: '4. Exam Tip',
          content:
            'Be able to draw the stack right after an interrupt — FLAGS on top, then CS, then IP — and compute IVT addresses (type × 4) in seconds. Numericals on NMI versus INTR and the push/pop order are standard one-mark questions.'
        }
      ],
      notes: {
        bulletPoints: [
          'IVT lives at 0000:0000 with 256 four-byte entries: handler IP at type×4, CS at type×4+2.',
          'INTR is maskable via the IF flag (STI/CLI); NMI — interrupt type 2 — cannot be masked.',
          'On entry the 8086 pushes FLAGS, then CS, then IP, and clears IF and TF before jumping to the handler.',
          'INT n is a software interrupt; INT 21h (type 33) provides DOS system calls selected by AH.',
          'IRET ends a service routine by popping IP, CS and FLAGS back into place.'
        ],
        examAlert:
          'Interrupt numericals almost always ask for the IVT entry address of a type or the exact push order — remember FLAGS, CS, IP on the way in and IRET on the way out.'
      }
    }
  ),
  makeEntry(
    ['data structure', 'stack', 'queue', 'linked list'],
    'Data Structures',
    {
      summary:
        'Data structures organize data so the right operations run efficiently: linear forms like arrays, linked lists, stacks and queues trade access for flexibility differently than non-linear trees, graphs and hash tables, and each is chosen by the pattern of operations a problem needs.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Choosing a data structure is choosing a container: numbered shelves (array) give instant retrieval but fixed size; a chain of labelled boxes (linked list) grows freely but you must walk it to reach box k; a pile of plates (stack) serves the last placed first; a checkout line (queue) serves first come first served. The operations your problem performs — random access, frequent insertion, last-in-first-out, arrival order — decide which container fits.'
        },
        {
          title: '2. Core Principles & Key Concepts',
          content:
            '• Classification: primitive vs composite, static (array) vs dynamic (linked list), linear (stack, queue, list) vs non-linear (tree, graph).\n• Array: contiguous memory, O(1) index access, fixed size; inserting in the middle costs O(n) because every later element shifts.\n• Linked list: dynamic size, O(1) insertion/deletion at a known node, but O(n) access since positions require traversal; each node wastes pointer space.\n• Stack — LIFO with push/pop/peek: backs recursion, expression evaluation, undo history, and function calls.\n• Queue — FIFO with enqueue/dequeue: models printers, CPU scheduling queues and BFS; variants are circular queue (reuses empty slots) and priority queue (dequeues by priority, not arrival).\n• Trees: hierarchical nodes — an in-order walk of a BST yields sorted keys; balanced trees search in O(log n).\n• Graphs: vertices and edges, directed or weighted; traversed with BFS (level by level, queue-based) or DFS (stack/recursion-based).\n• Hashing: a hash function maps a key to a slot for average O(1) lookup, degrading toward O(n) as the load factor and collisions grow.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Swapping the acronyms: stack is LIFO, queue is FIFO — an instant one-mark loss if reversed.\n• Assuming linked lists allow fast random access — they do not; reaching index k needs k steps.\n• Circular queue ambiguity: front == rear can mean empty OR full — keep one slot vacant (or maintain a count) to tell them apart.\n• Treating a priority queue as a fully sorted list — only the extreme element is removed each time, the rest need not be ordered.\n• Wrong structure for the workload: arrays for frequent middle insertions (O(n) shifts) or lists for heavy indexed reads (O(n) traversal) both waste time.\n• Confusing a tree with a graph: a tree is a connected acyclic graph; graphs may contain cycles and multiple paths.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Answer "which data structure" questions in three moves: name the structure, justify it from the operation pattern (random access → array, frequent insert/delete → list, last-in request → stack, arrival order → queue, key-value lookup → hash, hierarchy → tree), and quote the average and worst-case complexities of each operation you rely on.'
        }
      ],
      notes: {
        bulletPoints: [
          'Stack = LIFO (push/pop/peek); Queue = FIFO (enqueue/dequeue); a priority queue removes by priority, not arrival order.',
          'Array access is O(1) but middle insertion costs O(n); linked-list insertion at a known node is O(1) but access costs O(n).',
          'Circular queues reuse emptied slots — size = (rear − front + n) mod n, with one slot kept vacant to distinguish full from empty.',
          'Trees are hierarchical (BST in-order traversal returns sorted keys); graphs are traversed with BFS (queue) or DFS (stack).',
          'Hash-table lookup averages O(1) with a good hash function and controlled load factor; worst case is O(n) on total collision.'
        ],
        examAlert:
          'Structure-choice questions expect three parts — the structure, the operation-based justification, and the complexities (average AND worst case) of the operations you cite.'
      }
    }
  ),
  makeEntry(
    ['critical section', 'critical section problem', 'race condition', 'peterson', "peterson's algorithm", 'semaphore', 'mutex', 'process synchronization'],
    'Critical Section Problem & Synchronization',
    {
      summary:
        'The critical section problem is the challenge of designing a protocol where concurrent processes access shared resources without race conditions, satisfying Mutual Exclusion, Progress, and Bounded Waiting.',
      sections: [
        {
          title: '1. The Big Picture (Real-World Analogy)',
          content:
            'Imagine a single-occupancy fitting room in a clothing store (the Critical Section) shared by multiple shoppers (concurrent processes). If two people enter at once, chaos ensues (race condition). The lock on the door ensures only one person enters at a time (Mutual Exclusion), nobody waiting outside is unfairly blocked if the room is empty (Progress), and no customer waits indefinitely while others cut the queue (Bounded Waiting).'
        },
        {
          title: '2. Core Requirements & Key Concepts',
          content:
            '• A critical section is the code segment where shared variables/files/tables are updated.\n• 1. Mutual Exclusion: If process Pᵢ is executing in its critical section, no other processes can be executing in their critical sections.\n• 2. Progress: If no process is in its critical section and some wish to enter, only those not in their remainder section can participate in deciding who enters next, and selection cannot be postponed indefinitely.\n• 3. Bounded Waiting: A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request and before that request is granted.\n• Classic Software Solutions: Peterson\'s Algorithm (2-process software solution using `flag` array and `turn` variable).\n• Hardware Support: Atomic test-and-set instructions (`TestAndSet`, `CompareAndSwap`).\n• OS/Language Primitives: Mutex locks, Counting Semaphores (wait/P and signal/V operations), and Monitors.'
        },
        {
          title: '3. Common Traps & Misconceptions',
          content:
            '• Assuming strict alternation (`turn = 1 - turn`) satisfies all 3 conditions: it guarantees Mutual Exclusion but VIOLATES Progress if one process dies or is slower in its remainder section.\n• Confusing binary semaphores with counting semaphores: binary semaphores range only between 0 and 1 (acting like a mutex), while counting semaphores track an arbitrary finite number of available resource instances.\n• Busy waiting (spinlocks): `while(flag)` consumes CPU cycles in user-level loops; OS blocking queues (sleep & wakeup) avoid CPU wastage.\n• Peterson\'s algorithm assumes sequentially consistent memory architectures; modern multi-core out-of-order execution CPUs require memory barriers/fences.'
        },
        {
          title: '4. Exam Tip',
          content:
            'Whenever an exam asks to prove a synchronization algorithm (like Peterson\'s algorithm or strict alternation), structure your answer around the three mandatory criteria in exact order: 1. Mutual Exclusion, 2. Progress, 3. Bounded Waiting. Always state clearly which condition fails if analyzing a flawed algorithm.'
        }
      ],
      notes: {
        bulletPoints: [
          'Critical Section requires three criteria: Mutual Exclusion (at most 1 process inside), Progress (no deadlock on entry), and Bounded Waiting (no starvation).',
          'Race Condition: Outcome depends on the uncontrollable execution order/timing of concurrent threads/processes.',
          "Peterson's Algorithm solves the 2-process problem using `boolean flag[2]` (intent) and `int turn` (politeness).",
          'Semaphores are synchronization tools defined with atomic `wait()` (P / decrement) and `signal()` (V / increment) operations.',
          'Strict alternation satisfies Mutual Exclusion but fails Progress when one process stays in its remainder section.'
        ],
        examAlert:
          'Classic exam question: "Why does strict alternation fail as a synchronization solution?" — Answer: It violates the Progress condition because a process in its remainder section can block the other process from entering.'
      }
    }
  ),
  makeEntry(
    ['oops in java', 'oop in java', 'object oriented programming', 'oops concepts', 'encapsulation', 'polymorphism', 'abstraction', 'java oop'],
    'Object-Oriented Programming (OOP) in Java',
    {
      summary:
        'Object-Oriented Programming in Java models real-world entities through four core pillars: Encapsulation (data hiding), Abstraction (hiding implementation details), Inheritance (code reuse), and Polymorphism (one interface, many implementations).',
      sections: [
        {
          title: '1. The Four Pillars of OOP',
          content:
            '• **Encapsulation**: Bundling fields and methods into a single unit (class) and making fields `private` with public getters/setters to protect state integrity.\n• **Abstraction**: Exposing only essential features while hiding background details using `abstract` classes and `interface` declarations.\n• **Inheritance**: Extending an existing class (`class Child extends Parent`) to inherit attributes and methods, establishing an IS-A relationship.\n• **Polymorphism**: Compile-time (Method Overloading: same name, different parameters) vs Runtime (Method Overriding: dynamic method dispatch via superclass references).'
        },
        {
          title: '2. Java Implementation Walkthrough',
          content:
            '```java\n// Interface providing Abstraction\ninterface Drawable {\n    void draw();\n}\n\n// Base class showcasing Encapsulation & Inheritance\nabstract class Shape implements Drawable {\n    private String color;\n    public Shape(String color) { this.color = color; }\n    public String getColor() { return color; }\n}\n\n// Subclass with Runtime Polymorphism (Overriding)\nclass Circle extends Shape {\n    private double radius;\n    public Circle(String color, double radius) {\n        super(color);\n        this.radius = radius;\n    }\n    @Override\n    public void draw() {\n        System.out.println("Drawing " + getColor() + " circle with area: " + (Math.PI * radius * radius));\n    }\n}\n```'
        },
        {
          title: '3. Common Traps & Exam Pitfalls',
          content:
            '• Java supports single class inheritance only (`extends`), but multiple interface inheritance (`implements`).\n• Private methods, static methods, and fields cannot be overridden — they are hidden, not dynamically dispatched.\n• Abstract classes can have state (constructors, fields), whereas interfaces traditionally define pure behavioral contracts.\n• `super()` must always be the first line of a subclass constructor.'
        },
        {
          title: '4. High-Yield Exam Takeaway',
          content:
            'When asked for polymorphism, always distinguish Method Overloading (static binding resolved at compile time by signature) from Method Overriding (dynamic binding resolved at runtime by object instance type).'
        }
      ],
      notes: {
        bulletPoints: [
          'The 4 pillars: Encapsulation (data hiding), Abstraction (interfaces/abstract classes), Inheritance (`extends`), and Polymorphism (overload/override).',
          'Method Overriding = dynamic binding at runtime; Method Overloading = static binding at compile time.',
          'Java forbids multiple class inheritance to avoid the diamond problem, using interfaces instead.',
          'Constructors are chained with `super()` and are not inherited.',
          'Private and static members cannot be overridden.'
        ],
        examAlert:
          'Differentiate Method Overloading vs Overriding: Overloading changes argument lists at compile time; Overriding keeps the exact signature and resolves at runtime.'
      }
    }
  ),
  makeEntry(
    ['fourier series', 'fourier coefficients', 'fourier transform', 'dirichlet conditions', 'euler formulas', 'harmonics'],
    'Fourier Series & Coefficients',
    {
      summary:
        'A Fourier Series decomposes any periodic function f(t) with period T = 2L into an infinite sum of simple sinusoidal harmonics (sines and cosines) using Euler formulas for the coefficients a₀, aₙ, and bₙ.',
      sections: [
        {
          title: '1. The Big Picture (Harmonic Decomposition)',
          content:
            'Just as white light breaks into a rainbow of pure colors through a prism, a complex periodic sound wave or electrical signal can be decomposed into a fundamental frequency plus an infinite series of integer harmonic frequencies (cosines and sines). Fourier series converts complex time-domain waveforms into algebraic harmonic components.'
        },
        {
          title: '2. Mathematical Formulation & Coefficient Calculation',
          content:
            'For a periodic function f(x) with period 2L on [-L, L]:\n$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left[ a_n \\cos\\left(\\frac{n\\pi x}{L}\\right) + b_n \\sin\\left(\\frac{n\\pi x}{L}\\right) \\right]$$\n\n**Euler Formulas for Coefficients:**\n• **DC Component (Average value)**:\n$$a_0 = \\frac{1}{L} \\int_{-L}^{L} f(x) \\, dx$$\n• **Cosine Coefficients (Even harmonics)**:\n$$a_n = \\frac{1}{L} \\int_{-L}^{L} f(x) \\cos\\left(\\frac{n\\pi x}{L}\\right) \\, dx$$\n• **Sine Coefficients (Odd harmonics)**:\n$$b_n = \\frac{1}{L} \\int_{-L}^{L} f(x) \\sin\\left(\\frac{n\\pi x}{L}\\right) \\, dx$$'
        },
        {
          title: '3. Symmetry Shortcuts (Odd & Even Functions)',
          content:
            '• **Even Functions** ($f(-x) = f(x)$, e.g., $\\cos(x), x^2$): Symmetric about y-axis → $b_n = 0$ (Cosine series only; $a_n = \\frac{2}{L}\\int_0^L f(x)\\cos(n\\pi x/L)dx$).\n• **Odd Functions** ($f(-x) = -f(x)$, e.g., $\\sin(x), x$): Anti-symmetric about origin → $a_0 = 0, a_n = 0$ (Sine series only; $b_n = \\frac{2}{L}\\int_0^L f(x)\\sin(n\\pi x/L)dx$).'
        },
        {
          title: '4. Dirichlet Conditions & Exam Traps',
          content:
            '• **Dirichlet Conditions**: f(x) must be single-valued, have a finite number of discontinuities, and have a finite number of extrema in any period.\n• **Jump Discontinuity Convergence**: At a point of discontinuity $x = c$, the Fourier series converges to the midpoint average: $\\frac{f(c^+) + f(c^-)}{2}$.'
        }
      ],
      notes: {
        bulletPoints: [
          'Fourier Series: $f(x) = \\frac{a_0}{2} + \\sum (a_n \\cos(n\\pi x/L) + b_n \\sin(n\\pi x/L))$.',
          'Even functions ($f(-x) = f(x)$) have only cosine terms ($b_n = 0$).',
          'Odd functions ($f(-x) = -f(x)$) have only sine terms ($a_0 = 0, a_n = 0$).',
          'At jump discontinuities, the series converges to the arithmetic mean of left and right limits: $(f(x^+) + f(x^-))/2$.',
          'Dirichlet conditions guarantee convergence for piecewise continuous functions with bounded variation.'
        ],
        examAlert:
          'High-frequency exam check: Always test if $f(x)$ is even or odd before integrating! If odd, immediately set $a_0 = a_n = 0$; if even, set $b_n = 0$ to save half your computation time.'
      }
    }
  ),
  makeEntry(
    ['pollination', 'plant reproduction', 'cross pollination', 'self pollination', 'anther stigma', 'pollinators', 'flower anatomy'],
    'Pollination & Plant Reproduction',
    {
      summary:
        'Pollination is the biological process of transferring pollen grains from the male anther to the female stigma of a flower, initiating pollen tube germination and double fertilization in angiosperms.',
      sections: [
        {
          title: '1. Biological Mechanism & Anatomy',
          content:
            '• **Flower Reproductive Structures**:\n  - **Stamen (Male)**: Anther (produces microspores/pollen grains) + Filament.\n  - **Carpel / Pistil (Female)**: Stigma (sticky receptive surface) + Style (stalk) + Ovary (houses ovules).\n• **Process Flow**: Pollen lands on stigma → absorbs moisture & germinates → pollen tube grows down the style into the ovary micropyle → releases two sperm nuclei.'
        },
        {
          title: '2. Classification: Self vs Cross Pollination',
          content:
            '• **Self-Pollination (Autogamy & Geitonogamy)**: Pollen transferred within the same flower or same plant. Ensures reproduction without external agents but reduces genetic diversity.\n• **Cross-Pollination (Xenogamy / Allogamy)**: Pollen transferred between distinct plants of the same species. Increases genetic variation and vigor.\n• **Vectors/Agents**:\n  - **Biotic (Zoophily)**: Insects (Entomophily), Birds (Ornithophily), Bats (Chiropterophily).\n  - **Abiotic**: Wind (Anemophily: light, non-sticky pollen), Water (Hydrophily).'
        },
        {
          title: '3. Double Fertilization in Angiosperms',
          content:
            '• **Syngamy**: 1st sperm nucleus (n) + Egg cell (n) → Zygote (2n), developing into the plant embryo.\n• **Triple Fusion**: 2nd sperm nucleus (n) + 2 Polar nuclei (2n) → Primary Endosperm Nucleus (3n), forming nutritive endosperm tissue.'
        },
        {
          title: '4. Exam Takeaway & Common Traps',
          content:
            '• Do not confuse pollination with fertilization: Pollination is the physical transfer of pollen to the stigma; Fertilization is the biochemical fusion of gamete nuclei inside the ovule.\n• Anemophilous (wind-pollinated) flowers lack petals, nectar, and scent, but produce immense quantities of dry, aerodynamic pollen.'
        }
      ],
      notes: {
        bulletPoints: [
          'Pollination = transfer of pollen from anther to stigma; Fertilization = fusion of male and female gametes.',
          'Autogamy (same flower) vs Geitonogamy (different flower on same plant) vs Xenogamy (different plant).',
          'Biotic agents: insects (entomophily), birds (ornithophily); Abiotic agents: wind (anemophily), water (hydrophily).',
          'Double fertilization produces a diploid zygote (2n) and a triploid endosperm (3n).',
          'Wind-pollinated flowers have exposed stamens and feathery stigmas without colorful petals or nectar.'
        ],
        examAlert:
          'Exam distinction: "Pollination" ends at the stigma; "Fertilization" happens inside the embryo sac via double fertilization (Zygote 2n + Endosperm 3n).'
      }
    }
  ),
  makeEntry(
    ['world war 2', 'world war ii', 'ww2', 'wwii', 'axis powers', 'allied powers', 'holocaust', 'pearl harbor', 'treaty of versailles'],
    'World War II (1939–1945)',
    {
      summary:
        'World War II was a global conflict fought between the Allied Powers (USA, USSR, UK, China, France) and Axis Powers (Germany, Japan, Italy), triggered by fascist expansionism, the failure of the League of Nations, and unresolved tensions from the Treaty of Versailles.',
      sections: [
        {
          title: '1. Causes & The Outbreak (1939)',
          content:
            '• **Primary Causes**: Harsh reparations of the 1919 Treaty of Versailles, rise of totalitarian fascism/Nazism under Hitler and Mussolini, Japanese militarism in Asia, and failed policy of appeasement.\n• **Outbreak**: Nazi Germany\'s blitzkrieg invasion of Poland on September 1, 1939 prompted Britain and France to declare war.'
        },
        {
          title: '2. Major Turning Points (1941–1944)',
          content:
            '• **Operation Barbarossa (1941)**: Germany\'s invasion of the Soviet Union opens the brutal Eastern Front.\n• **Pearl Harbor (Dec 7, 1941)**: Japan\'s surprise attack on the US naval base brings the United States into the war.\n• **Battle of Stalingrad (1942–1943)**: Catastrophic German defeat marking the turning point on the Eastern Front.\n• **Battle of Midway (1942)**: US Navy halts Japanese expansion in the Pacific.\n• **D-Day Normandy Landings (June 6, 1944)**: Allied invasion opens Western Front to liberate occupied Europe.'
        },
        {
          title: '3. Conclusion & Global Impact (1945)',
          content:
            '• **Fall of Berlin (May 1945)**: Soviet capture of Berlin and Hitler\'s suicide lead to V-E Day (May 8, 1945).\n• **Atomic Bombings (Aug 1945)**: US drops atomic bombs on Hiroshima and Nagasaki, leading to Japan\'s unconditional surrender (V-J Day).\n• **Global Aftermath**: Collapse of European colonial empires, division of Germany, onset of the Cold War (US vs USSR superpower rivalry), and creation of the United Nations (UN) to replace the League of Nations.'
        },
        {
          title: '4. Exam Takeaway & Traps',
          content:
            '• Sequence of entry: Britain/France in 1939, USSR and USA in 1941.\n• Distinguish the Axis (Germany, Italy, Japan) from the Allies (UK, USSR, USA, China, France).'
        }
      ],
      notes: {
        bulletPoints: [
          'WWII lasted 1939–1945: Allied Powers (US, UK, USSR, China) defeated Axis Powers (Germany, Japan, Italy).',
          'Trigger: German invasion of Poland on September 1, 1939.',
          'Key turning points: Battle of Stalingrad (East), Battle of Midway (Pacific), D-Day Normandy (West).',
          'War ended in 1945 with the fall of Berlin and atomic bombings of Hiroshima and Nagasaki.',
          'Aftermath established the United Nations and initiated the Cold War.'
        ],
        examAlert:
          'High-frequency exam topic: Contrast the causes of WWII (Versailles failure, appeasement, fascism) with its outcomes (United Nations creation, decolonization, Cold War bipolar division).'
      }
    }
  ),
  makeEntry(
    ['chemical waste', 'hazardous waste', 'toxic waste', 'chemical disposal', 'effluent treatment', 'waste management'],
    'Chemical Waste Management & Treatment',
    {
      summary:
        'Chemical waste comprises hazardous substances from industrial, laboratory, and agricultural activities characterized by toxicity, reactivity, ignitability, or corrosivity, requiring strict categorization, neutralisation, and specialized disposal protocols.',
      sections: [
        {
          title: '1. Classification & Hazardous Characteristics (RCRA Standard)',
          content:
            '• **Ignitability**: Flammable liquids with flashpoint < 60°C (e.g., acetone, organic solvents).\n• **Corrosivity**: Aqueous solutions with pH ≤ 2 (strong acids) or pH ≥ 12.5 (strong bases).\n• **Reactivity**: Unstable compounds that react violently with water or release toxic gases (e.g., sodium metal, cyanides, sulfides).\n• **Toxicity**: Substances that leach harmful concentrations of heavy metals (lead, mercury, cadmium) or hazardous organics.'
        },
        {
          title: '2. Waste Treatment & Neutralization Technologies',
          content:
            '• **Physicochemical Treatment**: Acid-base neutralization (adjusting pH to 6.5–8.5), precipitation of toxic heavy metal ions as insoluble hydroxides, and oxidation-reduction (e.g., alkaline chlorination of cyanides).\n• **High-Temperature Incineration**: Thermal destruction of non-recyclable halogenated and non-halogenated organic wastes at > 1100°C with flue gas scrubbing.\n• **Solidification / Stabilization**: Encapsulation in cement or pozzolanic matrices to prevent leaching before secure landfilling.'
        },
        {
          title: '3. Storage, Segregation & Safety Protocols',
          content:
            '• **Incompatible Chemical Segregation**: Never store strong oxidizers (e.g., nitric acid, perchlorates) near organic solvents or flammables.\n• **Secondary Containment**: All chemical waste drums must sit in spill trays with capacity to hold at least 110% of the single largest container.\n• **Cradle-to-Grave Manifest**: Tracking hazardous waste from initial generation through transit to licensed disposal facilities.'
        },
        {
          title: '4. High-Yield Exam Points & Traps',
          content:
            '• Do not mix chlorinated solvents (chloroform, dichloromethane) with non-chlorinated solvents due to disposal cost and violent reaction hazards.\n• Cyanide waste must strictly be maintained in alkaline conditions (pH > 10) to prevent the lethal release of hydrogen cyanide gas ($HCN$).'
        }
      ],
      notes: {
        bulletPoints: [
          '4 RCRA hazard characteristics: Ignitability (flashpoint < 60°C), Corrosivity (pH ≤ 2 or ≥ 12.5), Reactivity, and Toxicity.',
          'Heavy metal precipitation converts soluble toxic ions (Pb²⁺, Cd²⁺) into insoluble hydroxides/sulfides.',
          'Incompatible chemical segregation: Keep oxidizers separate from organics/reducers at all times.',
          'Cyanide destruction requires alkaline chlorination at pH > 10 to avoid deadly hydrogen cyanide gas evolution.',
          'High-temperature incineration (> 1100°C) destructs toxic organic contaminants.'
        ],
        examAlert:
          'High-frequency exam trap: Acidifying cyanide solutions releases deadly toxic hydrogen cyanide ($HCN$) gas — cyanide detoxification must always occur in alkaline pH (> 10).'
      }
    }
  )
];

const normalize = (str) => (str || '').toLowerCase();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Finds the best content-bank entry for a topic/message.
 * Matches whole words (with optional plural) in either direction.
 */
export const matchContentBank = (topic) => {
  if (!topic) return null;
  const text = normalize(topic);

  for (const entry of CONTENT_BANK) {
    for (const key of entry.keys) {
      const k = escapeRegex(normalize(key));
      // text contains key (optionally plural), or key contains the whole text
      if (new RegExp(`\\b${k}s?\\b`).test(text)) return entry;
      if (new RegExp(`\\b${escapeRegex(normalize(topic))}\\b`).test(normalize(key))) return entry;
    }
  }
  return null;
};

/** Builds the Knowledge-Lab-compatible payload from a bank entry. */
export const bankExplanation = (entry) => ({
  summary: entry.summary,
  sections: entry.sections,
  notes: entry.notes
});
