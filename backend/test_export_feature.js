import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const BASE_URL = 'http://localhost:5000/api';

const runExportTests = async () => {
  console.log('=== STARTING COMPLETE EXPORT FEATURE VERIFICATION TESTS ===\n');

  // 1. Health check
  console.log('1. Checking backend health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  if (healthData.status !== 'ok') {
    throw new Error('Backend health check failed');
  }
  console.log('Backend is online.\n');

  // 2. Register two test users
  const rand = Math.floor(Math.random() * 1000000);
  console.log('2. Registering User A and User B...');
  const userARes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Agent Alpha',
      superheroName: `Alpha_${rand}`,
      heroClassId: 'tech-titan',
      password: 'password123'
    })
  });
  const userAData = await userARes.json();
  const tokenA = userAData.token;

  const userBRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Agent Beta',
      superheroName: `Beta_${rand}`,
      heroClassId: 'cyber-ninja',
      password: 'password123'
    })
  });
  const userBData = await userBRes.json();
  const tokenB = userBData.token;

  console.log(`User A token obtained (${userAData.profile?.superheroName})`);
  console.log(`User B token obtained (${userBData.profile?.superheroName})\n`);

  // 3. Create Complete Multi-Section Note for User A
  console.log('3. Creating Complete Multi-Section Note for User A...');
  const noteRes = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      title: 'Process Scheduling & Context Switching',
      topic: 'OPERATING SYSTEMS',
      subject: 'Computer Science',
      difficulty: 'SUPERHERO',
      summary: 'Process scheduling determines which thread or process executes on CPU cores across multi-level priority queues.',
      sections: [
        {
          title: 'Fundamentals of Process State Transitions',
          content: 'Processes transition between NEW, READY, RUNNING, WAITING, and TERMINATED states managed by the PCB. Context switches save program counter and CPU registers.'
        },
        {
          title: 'CPU Scheduling Algorithms (CFS vs MLFQ)',
          content: 'Completely Fair Scheduler (CFS) utilizes red-black trees keyed on vruntime to balance CPU time dynamically. Multi-Level Feedback Queues prioritize short interactive bursts.'
        },
        {
          title: 'Context Switching Latency & Cache Invalidation',
          content: 'Switching context involves saving registers, updating the MMU page table root pointer (CR3 on x86), and invalidating TLB entries, introducing measurable CPU overhead.'
        }
      ],
      examples: [
        {
          title: 'Linux CFS Runtime Calculation',
          content: 'Given 2 threads with priority 0 and 5, CFS computes proportional timeslices using decay weighting factors.'
        }
      ],
      bulletPoints: [
        'Preemptive scheduling enables responsive user interactive tasks',
        'Starvation is mitigated via priority aging mechanisms',
        'TLB shootdowns occur during multi-core context changes'
      ],
      commonMistakes: [
        'Confusing CPU utilization with throughput (throughput is finished processes per unit time)',
        'Assuming non-preemptive algorithms can prevent indefinite blocking'
      ],
      examTips: [
        'Always draw Gantt charts for preemptive SRTF and round-robin with quantum q before computing turnaround time',
        'Turnaround Time = Completion Time - Arrival Time'
      ],
      keyFacts: [
        'Context switch overhead is pure system waste / lost compute time',
        'Shortest Job First is provably optimal for minimizing average waiting time'
      ],
      examAlert: 'Watch out for convoy effects in First-Come First-Served scheduling with I/O-bound processes!'
    })
  });
  const noteData = await noteRes.json();
  const noteId = noteData.id;
  console.log(`Note created with ID: ${noteId}, Title: "${noteData.title}"`);
  console.log(`Stored Sections Count: ${noteData.sections?.length}, Examples Count: ${noteData.examples?.length}\n`);

  if (!noteData.sections || noteData.sections.length !== 3) {
    throw new Error('Note creation failed to persist full sections array');
  }

  // 4. Test Note Export as PDF
  console.log('4. Testing GET /api/notes/:id/export?format=pdf ...');
  const notePdfRes = await fetch(`${BASE_URL}/notes/${noteId}/export?format=pdf`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  console.log(`Status: ${notePdfRes.status}`);
  const notePdfContentType = notePdfRes.headers.get('content-type');
  const notePdfContentDisposition = notePdfRes.headers.get('content-disposition');
  console.log(`Content-Type: ${notePdfContentType}`);
  console.log(`Content-Disposition: ${notePdfContentDisposition}`);

  if (notePdfRes.status !== 200) {
    throw new Error(`Expected status 200, got ${notePdfRes.status}`);
  }
  if (!notePdfContentType?.includes('application/pdf')) {
    throw new Error(`Expected application/pdf, got ${notePdfContentType}`);
  }
  if (!notePdfContentDisposition?.includes('attachment; filename=') || !notePdfContentDisposition?.includes('.pdf')) {
    throw new Error(`Invalid Content-Disposition: ${notePdfContentDisposition}`);
  }
  const notePdfBuffer = Buffer.from(await notePdfRes.arrayBuffer());
  const notePdfHeader = notePdfBuffer.slice(0, 5).toString('ascii');
  console.log(`PDF Magic Bytes: "${notePdfHeader}" (Length: ${notePdfBuffer.length} bytes)`);
  if (notePdfHeader !== '%PDF-') {
    throw new Error(`Invalid PDF header: ${notePdfHeader}`);
  }
  if (notePdfBuffer.length < 3000) {
    throw new Error(`PDF size (${notePdfBuffer.length} bytes) is too small to contain complete multi-section dossier`);
  }
  const notePdfText = notePdfBuffer.toString('latin1');
  const notePageMatches = notePdfText.match(/\/Type\s*\/Page\b/g);
  const notePageCount = notePageMatches ? notePageMatches.length : 0;
  console.log(`Note PDF Page Count: ${notePageCount}`);
  if (notePageCount !== 1) {
    throw new Error(`Expected exactly 1 page for standard multi-section note, got ${notePageCount}`);
  }
  console.log('✅ Complete Note PDF export verified successfully (1 compact page, no blank pages)!\n');

  // 5. Test Note Export as TXT
  console.log('5. Testing GET /api/notes/:id/export?format=txt ...');
  const noteTxtRes = await fetch(`${BASE_URL}/notes/${noteId}/export?format=txt`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  console.log(`Status: ${noteTxtRes.status}`);
  const noteTxtContentType = noteTxtRes.headers.get('content-type');
  const noteTxtContentDisposition = noteTxtRes.headers.get('content-disposition');
  console.log(`Content-Type: ${noteTxtContentType}`);
  console.log(`Content-Disposition: ${noteTxtContentDisposition}`);

  if (noteTxtRes.status !== 200) {
    throw new Error(`Expected status 200, got ${noteTxtRes.status}`);
  }
  if (!noteTxtContentType?.includes('text/plain')) {
    throw new Error(`Expected text/plain, got ${noteTxtContentType}`);
  }
  const noteTxtBody = await noteTxtRes.text();

  // Verify all sections exist in full in TXT output
  const expectedSnippets = [
    'Fundamentals of Process State Transitions',
    'Completely Fair Scheduler (CFS)',
    'Context Switching Latency & Cache Invalidation',
    'Linux CFS Runtime Calculation',
    'Preemptive scheduling enables responsive user interactive tasks',
    'Confusing CPU utilization with throughput',
    'Always draw Gantt charts for preemptive SRTF',
    'Watch out for convoy effects'
  ];

  for (const snippet of expectedSnippets) {
    if (!noteTxtBody.includes(snippet)) {
      throw new Error(`Note TXT export missing expected content section: "${snippet}"`);
    }
  }
  console.log('✅ Note TXT full multi-section content verified successfully!\n');

  // 6. Test User Data Isolation on Note Export
  console.log('6. Testing Note export isolation (User B trying to export User A note)...');
  const noteCrossRes = await fetch(`${BASE_URL}/notes/${noteId}/export?format=pdf`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  console.log(`Status when User B accesses User A note: ${noteCrossRes.status}`);
  if (noteCrossRes.status !== 404) {
    throw new Error(`Expected 404 for cross-user note export, got ${noteCrossRes.status}`);
  }
  console.log('✅ Note scoping and user isolation verified.\n');

  // 7. Generate Quiz for User A
  console.log('7. Generating Quiz for User A via /api/quiz/generate...');
  const quizRes = await fetch(`${BASE_URL}/quiz/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      topic: 'Operating System Semaphores',
      difficulty: 'HERO',
      count: 2,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary function of a counting semaphore in operating systems?',
          options: [
            'To control access to a finite number of shared resource instances',
            'To encrypt memory pages during context switching',
            'To allocate CPU cycles dynamically to real-time threads',
            'To serialize all incoming network packets synchronously'
          ],
          correctAnswer: 0,
          explanation: 'Counting semaphores maintain a non-negative integer count to coordinate access across multiple resource instances.',
          xp: 50
        },
        {
          id: 'q2',
          question: 'Which operation on a semaphore decrements its value and may cause the calling thread to block?',
          options: ['signal() / V()', 'wait() / P()', 'post()', 'notify()'],
          correctAnswer: 1,
          explanation: 'The wait() (or P()) operation decrements the semaphore counter, blocking if the counter is <= 0.',
          xp: 75
        }
      ]
    })
  });
  const quizData = await quizRes.json();
  if (!quizRes.ok || !quizData.quizId) {
    throw new Error(`Quiz generation failed: ${JSON.stringify(quizData)}`);
  }
  const quizId = quizData.quizId;
  console.log(`Quiz generated with ID: ${quizId}, Topic: "${quizData.topic}", Total Questions: ${quizData.totalQuestions}\n`);

  // 8. Test Quiz Export as PDF
  console.log('8. Testing GET /api/quizzes/:id/export?format=pdf ...');
  const quizPdfRes = await fetch(`${BASE_URL}/quizzes/${quizId}/export?format=pdf`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  console.log(`Status: ${quizPdfRes.status}`);
  const quizPdfContentType = quizPdfRes.headers.get('content-type');
  const quizPdfContentDisposition = quizPdfRes.headers.get('content-disposition');
  console.log(`Content-Type: ${quizPdfContentType}`);
  console.log(`Content-Disposition: ${quizPdfContentDisposition}`);

  if (quizPdfRes.status !== 200) {
    throw new Error(`Expected status 200, got ${quizPdfRes.status}`);
  }
  if (!quizPdfContentType?.includes('application/pdf')) {
    throw new Error(`Expected application/pdf, got ${quizPdfContentType}`);
  }
  const quizPdfBuffer = Buffer.from(await quizPdfRes.arrayBuffer());
  const quizPdfHeader = quizPdfBuffer.slice(0, 5).toString('ascii');
  console.log(`Quiz PDF Magic Bytes: "${quizPdfHeader}" (Length: ${quizPdfBuffer.length} bytes)`);
  if (quizPdfHeader !== '%PDF-') {
    throw new Error(`Invalid Quiz PDF header: ${quizPdfHeader}`);
  }
  const quizPdfText = quizPdfBuffer.toString('latin1');
  const quizPageMatches = quizPdfText.match(/\/Type\s*\/Page\b/g);
  const quizPageCount = quizPageMatches ? quizPageMatches.length : 0;
  console.log(`Quiz PDF Page Count: ${quizPageCount}`);
  if (quizPageCount !== 1) {
    throw new Error(`Expected exactly 1 page for 2-question quiz, got ${quizPageCount}`);
  }
  console.log('✅ Quiz PDF export verified successfully (1 compact page, no blank pages)!\n');

  // 9. Test Quiz Export as JSON
  console.log('9. Testing GET /api/quizzes/:id/export?format=json ...');
  const quizJsonRes = await fetch(`${BASE_URL}/quizzes/${quizId}/export?format=json`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  console.log(`Status: ${quizJsonRes.status}`);
  const quizJsonContentType = quizJsonRes.headers.get('content-type');
  const quizJsonContentDisposition = quizJsonRes.headers.get('content-disposition');
  console.log(`Content-Type: ${quizJsonContentType}`);
  console.log(`Content-Disposition: ${quizJsonContentDisposition}`);

  if (quizJsonRes.status !== 200) {
    throw new Error(`Expected status 200, got ${quizJsonRes.status}`);
  }
  const quizJsonObj = await quizJsonRes.json();
  console.log(`Quiz JSON Topic: "${quizJsonObj.topic}", Questions Count: ${quizJsonObj.questions?.length}`);
  console.log(`Question 1: "${quizJsonObj.questions?.[0]?.question}"`);
  console.log(`Correct Answer Index: ${quizJsonObj.questions?.[0]?.correctAnswer}`);
  if (!quizJsonObj.questions || quizJsonObj.questions.length !== 2) {
    throw new Error('Exported Quiz JSON question count mismatch');
  }
  console.log('✅ Quiz JSON export verified successfully!\n');

  // 10. Test User Data Isolation on Quiz Export
  console.log('10. Testing Quiz export isolation (User B trying to export User A quiz)...');
  const quizCrossRes = await fetch(`${BASE_URL}/quizzes/${quizId}/export?format=json`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  console.log(`Status when User B accesses User A quiz: ${quizCrossRes.status}`);
  if (quizCrossRes.status !== 404) {
    throw new Error(`Expected 404 for cross-user quiz export, got ${quizCrossRes.status}`);
  }
  console.log('✅ Quiz scoping and user isolation verified.\n');

  console.log('====================================================');
  console.log('🎉 ALL EXPORT ENDPOINTS & FULL CONTENT FLOWS VERIFIED 100%');
  console.log('====================================================');
};

runExportTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
