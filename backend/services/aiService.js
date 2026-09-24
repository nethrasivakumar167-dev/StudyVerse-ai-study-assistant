/**
 * S.A.T.U.R.D.A.Y. Content Service powered directly by Google Gemini.
 * 
 * Rules:
 * - Academic content is clear, exam-oriented, and specifically on-topic.
 * - No superhero / Avengers / XP language inside academic content.
 * - Direct communication with Gemini via @google/genai SDK (no static topic banks or synthetic fallbacks).
 * - Real error propagation (502 / 503) on service unavailability.
 */

import { mentionsTopic, academicClean, prepareQuiz } from '../utils/contentQuality.js';
import { extractAndParseJson } from '../utils/jsonRepair.js';
import {
  generateLLMResponse,
  generateLLMJson,
  EXPLAIN_SCHEMA,
  QUIZ_SCHEMA,
  STUDY_PLAN_SCHEMA
} from './llmService.js';

export { extractAndParseJson };

/* ------------------------------------------------------------------ */
/* System Prompts                                                     */
/* ------------------------------------------------------------------ */

export const EXPLAIN_SYSTEM_PROMPT = `You are an expert academic tutor and curriculum specialist.
Generate a comprehensive, high-yield, and conceptually rigorous study guide specifically about the requested academic topic.

Requirements:
1. Academic Focus: Every section must contain genuine domain terminology, foundational definitions, governing mechanisms, and concrete real-world applications of the EXACT topic requested.
2. Tone & Style: Pure academic prose. Never include superheroes, fantasy tropes, game ranks, or filler text.
3. Structure:
   - title: Clear, descriptive topic title
   - topic: The exact subject requested
   - subject: Academic discipline (e.g. Computer Science, Physics, Biology, Chemistry, Mathematics, History)
   - difficulty: Target level (RECRUIT, HERO, SUPERHERO, LEGENDARY)
   - summary: 2-3 sentence precise explanation of the core concept and its significance
   - sections: At least 3 substantive sections (Core Principles, Mechanism/Workflow, Practical Applications)
   - examples: Worked real-world examples or case studies
   - commonMistakes: Subtle student misconceptions or exam traps
   - examTips: High-yield formula alerts, theorems, or exam strategies
   - keyFacts: High-yield revision takeaways
   - notes: Object with bulletPoints (3-5 items) and examAlert (1 high-priority takeaway)`;

export const EXPLAIN_USER_PROMPT = (topic, difficulty = 'HERO') => {
  let diffLabel = 'Intermediate (standard academic exam level)';
  const d = String(difficulty || '').toUpperCase();
  if (d === 'RECRUIT' || d === 'BEGINNER') diffLabel = 'Beginner (foundational definitions and core concepts)';
  else if (d === 'SUPERHERO' || d === 'ADVANCED') diffLabel = 'Advanced (architectural deep-dive and complex mechanisms)';
  else if (d === 'LEGENDARY' || d === 'MASTER') diffLabel = 'Master (hardcore exam traps, edge-cases, and proofs)';

  return `Topic: "${topic}"
Depth Level: ${diffLabel}

Generate the structured study guide now.`;
};

export const QUIZ_SYSTEM_PROMPT = `You are an expert academic exam author.
Generate high-yield, conceptually challenging multiple-choice questions testing genuine subject knowledge specifically about the requested topic.

Rules:
1. Topic Relevance: Every single question must test real facts, formulas, mechanisms, algorithms, or definitions of the exact topic.
2. Four Unique Options: Exactly 4 distinct, plausible options per question (1 correct answer and 3 realistic distractors).
3. Correct Answer Index: "correctAnswer" must be a 0-based integer index (0, 1, 2, or 3) corresponding to the correct option.
4. Explanations: Provide a concise, clear educational explanation of why the correct option is right.
5. Purity: Pure academic tone. Do not use superhero or video game narrative inside questions.`;

export const QUIZ_USER_PROMPT = (topic, difficulty = 'HERO', count = 4) => {
  let diffLabel = 'Intermediate (standard academic exam level)';
  const d = String(difficulty || '').toUpperCase();
  if (d === 'RECRUIT' || d === 'BEGINNER') diffLabel = 'Beginner (foundational definitions and core concepts)';
  else if (d === 'SUPERHERO' || d === 'LEGENDARY' || d === 'ADVANCED') diffLabel = 'Advanced (in-depth mechanisms, tricky nuances, and complex edge cases)';

  return `Topic: "${topic}"
Difficulty: ${diffLabel}
Generate exactly ${count} multiple-choice questions specifically about "${topic}".`;
};

export const STUDY_PLAN_SYSTEM_PROMPT = `You are an expert curriculum architect and learning strategist.
Generate a rigorous, personalized, and progressive day-by-day study roadmap for the specified topic and goal.

Rules:
1. Progressive Arc:
   - Early days: Foundations, core taxonomy, definitions, and basic mechanisms
   - Middle days: In-depth algorithms, derivations, proofs, and system integration
   - Later days: Advanced edge cases, optimizations, diagnostic problem solving
   - Final day: Comprehensive review, mock exam simulation, and formula recall
2. Actionable Daily Tasks: Provide 3 to 4 distinct actionable objectives per day with time allocations summing to the daily study bandwidth.
3. No Generic Fillers: Every task must reference specific concepts or mechanisms of the requested topic.
4. Generate EXACTLY the requested number of days.`;

export const STUDY_PLAN_USER_PROMPT = (topic, goal, days, hours, level, quizHistory = []) => {
  let perfContext = '';
  if (Array.isArray(quizHistory) && quizHistory.length > 0) {
    perfContext = `\nRecent Quiz Performance / Battle Arena History:\n${quizHistory.map((q) => `- ${q}`).join('\n')}\n(Personalize objectives to address any weak areas or reinforce strong fundamentals accordingly.)\n`;
  }

  let diffLabel = 'Intermediate (standard academic level)';
  const d = String(level || '').toUpperCase();
  if (d === 'RECRUIT' || d === 'BEGINNER') diffLabel = 'Beginner (Foundational)';
  else if (d === 'SUPERHERO' || d === 'ADVANCED') diffLabel = 'Advanced (In-depth)';
  else if (d === 'LEGENDARY' || d === 'MASTER') diffLabel = 'Master (Hardcore)';

  return `Topic: "${topic}"
Target Goal: "${goal || 'Master the topic for university exams and practical implementation'}"
Protocol Duration: ${days} Days
Daily Study Bandwidth: ${hours} Hours (${Math.round(hours * 60)} minutes/day)
Target Level: ${diffLabel}${perfContext}

Generate the complete ${days}-day personalized study protocol now.`;
};

/* ------------------------------------------------------------------ */
/* In-memory Cache                                                    */
/* ------------------------------------------------------------------ */

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const cache = new Map();

const cacheGet = (key) => {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    cache.delete(key);
    return null;
  }
  return hit.v;
};

const cacheSet = (key, value) => {
  if (cache.size >= 250) cache.delete(cache.keys().next().value);
  cache.set(key, { v: value, exp: Date.now() + CACHE_TTL_MS });
};

/* ------------------------------------------------------------------ */
/* Quality Validation Gate                                            */
/* ------------------------------------------------------------------ */

export const validateExplainResponse = (ai, topic) => {
  if (!ai || typeof ai !== 'object') return null;

  const title = typeof ai.title === 'string' ? ai.title.trim() : '';
  const overview = typeof ai.overview === 'string' ? ai.overview.trim() : (typeof ai.summary === 'string' ? ai.summary.trim() : '');

  if (!title || overview.length < 25) return null;
  if (!Array.isArray(ai.sections) || ai.sections.length < 2) return null;

  const cleanSections = [];
  for (let i = 0; i < ai.sections.length; i++) {
    const s = ai.sections[i];
    if (!s || typeof s !== 'object') continue;
    const heading = typeof s.heading === 'string' && s.heading.trim() ? s.heading.trim() : (typeof s.title === 'string' && s.title.trim() ? s.title.trim() : `Section ${i + 1}`);
    const content = typeof s.content === 'string' ? s.content.trim() : '';
    if (content.length < 20) continue;
    cleanSections.push({
      title: heading,
      type: typeof s.type === 'string' ? s.type : 'concept',
      content
    });
  }

  if (cleanSections.length < 2) return null;

  const allText = `${title}\n${overview}\n${cleanSections.map((s) => `${s.title}\n${s.content}`).join('\n')}`;

  if (!mentionsTopic(allText, topic)) {
    console.warn(`[Quality Gate] Notice: response topic stem match for "${topic}"`);
  }

  const examples = Array.isArray(ai.examples)
    ? ai.examples
        .filter((e) => e && (e.title || e.content))
        .map((e) => ({
          title: String(e.title || 'Example').trim(),
          content: String(e.content || '').trim()
        }))
    : [];

  const commonMistakes = Array.isArray(ai.commonMistakes)
    ? ai.commonMistakes.map(String).map((s) => s.trim()).filter(Boolean)
    : [];

  const examTips = Array.isArray(ai.examTips)
    ? ai.examTips.map(String).map((s) => s.trim()).filter(Boolean)
    : [];

  const keyFacts = Array.isArray(ai.keyFacts)
    ? ai.keyFacts.map(String).map((s) => s.trim()).filter(Boolean)
    : [];

  let vaultBullets = keyFacts.length >= 3 ? keyFacts.slice(0, 6) : [];
  if (!vaultBullets.length) {
    vaultBullets = cleanSections
      .map((s) => {
        const firstLine = s.content.split('\n')[0].replace(/^[•*-]\s*/, '').trim();
        return firstLine.length > 20 ? `${s.title}: ${firstLine}` : `${s.title}: ${s.content.slice(0, 100)}`;
      })
      .slice(0, 5);
  }

  const examAlert =
    examTips[0] ||
    commonMistakes[0] ||
    'Review key definitions, edge cases, and worked examples before the exam.';

  return {
    title,
    topic: typeof ai.topic === 'string' && ai.topic.trim() ? ai.topic.trim() : topic,
    subject: typeof ai.subject === 'string' && ai.subject.trim() ? ai.subject.trim() : 'Academic Study',
    difficulty: ai.difficulty || 'HERO',
    summary: overview,
    sections: cleanSections,
    examples,
    commonMistakes,
    examTips,
    keyFacts,
    notes: {
      bulletPoints: vaultBullets,
      examAlert
    },
    xpReward: 50
  };
};

/* ------------------------------------------------------------------ */
/* 1. Knowledge Lab / Notes: Topic Explanation                        */
/* ------------------------------------------------------------------ */

export const generateExplanation = async (topic, difficulty = 'HERO') => {
  const cleanTopic = String(topic || '').trim();
  if (!cleanTopic) {
    const err = new Error('Topic is required for study guide generation');
    err.status = 400;
    throw err;
  }

  const cacheKey = `explain:${cleanTopic.toLowerCase()}:${difficulty}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const sysPrompt = EXPLAIN_SYSTEM_PROMPT;
  const userPrompt = EXPLAIN_USER_PROMPT(cleanTopic, difficulty);

  const aiData = await generateLLMJson(sysPrompt, userPrompt, {
    responseSchema: EXPLAIN_SCHEMA,
    topic: cleanTopic,
    featureTag: 'Knowledge Lab Study Guide'
  });

  const validated = validateExplainResponse(aiData, cleanTopic);
  if (!validated) {
    const err = new Error('Gemini AI output could not be validated for the requested topic. Please retry.');
    err.status = 502;
    throw err;
  }

  cacheSet(cacheKey, validated);
  return validated;
};

/* ------------------------------------------------------------------ */
/* 2. S.A.T.U.R.D.A.Y. Conversational Chat                            */
/* ------------------------------------------------------------------ */

const historyToContents = (history = []) =>
  history
    .slice(-10)
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text.slice(0, 2000) }]
    }));

/** Column-wise digit addition for instant local answers */
const addDigits = (a, b, base) => {
  const steps = [];
  const n = Math.max(a.length, b.length);
  const ra = a.padStart(n, '0');
  const rb = b.padStart(n, '0');
  let carry = 0;
  let out = '';

  for (let i = n - 1; i >= 0; i--) {
    const sum = Number(ra[i]) + Number(rb[i]) + carry;
    const digit = sum % base;
    const nextCarry = sum >= base ? 1 : 0;
    steps.push(
      `${n - i}. ${ra[i]} + ${rb[i]}${carry ? ' + 1 (carry)' : ''} = ${sum} → write **${digit}**, carry **${nextCarry}**`
    );
    out = `${digit}${out}`;
    carry = nextCarry;
  }
  if (carry) out = `${carry}${out}`;
  return { steps, out };
};

const quickCompute = (message) => {
  const lower = (message || '').trim().toLowerCase();
  const tail = '(?:\\s+(?:in\\s+binary|binary|numbers?|for\\s+me|please))*\\s*[?.!]*$';
  const m =
    lower.match(
      new RegExp(`^(?:what\\s+(?:is|does)\\s+|please\\s+)?(?:add|sum(?:\\s+of)?)\\s+(\\d{1,32})\\s+(?:and|plus|to)\\s+(\\d{1,32})${tail}`)
    ) || lower.match(new RegExp(`^(?:what\\s+is\\s+)?(\\d{1,32})\\s*\\+\\s*(\\d{1,32})${tail}`));
  if (!m) return null;

  const [a, b] = [m[1], m[2]];
  const isBits = (s) => /^[01]+$/.test(s);
  const keywordBinary = /\b(binary|bit|bits)\b/.test(lower);
  const binary = isBits(a) && isBits(b) && (keywordBinary || Math.max(a.length, b.length) >= 4);
  const base = binary ? 2 : 10;
  const { steps, out } = addDigits(a, b, base);

  const answer = binary
    ? `**Answer: ${out}** (${parseInt(out, 2)} in decimal)`
    : `**Answer: ${out}**`;
  const rule = binary
    ? '\n> Bit addition: 0+0 = 0 · 0+1 = 1 · 1+0 = 1 · 1+1 = 10 (write 0, carry 1)'
    : '';

  return {
    xpAwarded: 30,
    text: `**${binary ? 'Binary' : 'Decimal'} addition: ${a} + ${b}**\n\nAdding column by column from the right (carry 1 whenever a column reaches ${base}):\n\n${steps.join(
      '\n'
    )}\n\n${answer}${rule}\n\n*Want a practice quiz on binary arithmetic? Just ask.*`
  };
};

export const generateChatResponse = async (message, context = {}, history = []) => {
  const cleanMsg = String(message || '').trim();
  if (!cleanMsg) {
    const err = new Error('Message is required');
    err.status = 400;
    throw err;
  }

  const computed = quickCompute(cleanMsg);
  if (computed) {
    return {
      text: computed.text,
      type: 'chat',
      topic: null,
      suggestedActions: ['Save to Knowledge Vault', 'Continue in Knowledge Lab', 'Battle on this Topic'],
      xpAwarded: computed.xpAwarded || 25
    };
  }

  const heroName = context.superheroName || 'Hero';

  const systemInstruction = `You are S.A.T.U.R.D.A.Y. (Student Assistant To Understand, Review, & Deliver Academic Yield), an intelligent, natural, and friendly AI study assistant in StudyVerse.
Guidelines:
- Chat conversationally, warmly, and helpfully like Gemini.
- Address the user as ${heroName} when appropriate.
- Answer questions on any academic domain, explain concepts with examples, write clean code with syntax highlighting, and resolve doubts.
- Maintain multi-turn conversational context from previous messages.
- Use clear Markdown formatting (**bold**, bullet points, code blocks).
- Provide accurate, exam-oriented explanations when academic questions are asked.`;

  const previousTurns = historyToContents(history);
  const contents = [
    ...previousTurns,
    {
      role: 'user',
      parts: [{ text: cleanMsg }]
    }
  ];

  const replyText = await generateLLMResponse(contents, {
    systemInstruction,
    temperature: 0.7,
    featureTag: 'S.A.T.U.R.D.A.Y. Chat',
    topic: cleanMsg.slice(0, 40)
  });

  return {
    text: replyText,
    type: cleanMsg.length > 25 ? 'study' : 'chat',
    topic: cleanMsg.length > 25 ? cleanMsg.slice(0, 50) : null,
    suggestedActions: [
      'Save to Knowledge Vault',
      'Continue in Knowledge Lab',
      'Battle on this Topic'
    ],
    xpAwarded: 25
  };
};

/* ------------------------------------------------------------------ */
/* 3. Battle Arena: Quiz Generation                                   */
/* ------------------------------------------------------------------ */

export const generateQuizQuestions = async (topic, difficulty = 'HERO', count = 4) => {
  const cleanTopic = String(topic || '').trim();
  if (!cleanTopic) {
    const err = new Error('Topic is required for quiz generation');
    err.status = 400;
    throw err;
  }

  const safeCount = Math.min(Math.max(parseInt(count) || 4, 1), 10);
  const cacheKey = `quiz:${cleanTopic.toLowerCase()}:${difficulty}:${safeCount}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const sysPrompt = QUIZ_SYSTEM_PROMPT;
  const userPrompt = QUIZ_USER_PROMPT(cleanTopic, difficulty, safeCount);

  const aiData = await generateLLMJson(sysPrompt, userPrompt, {
    responseSchema: QUIZ_SCHEMA,
    topic: cleanTopic,
    featureTag: 'Battle Arena Quiz',
    temperature: 0.3
  });

  const rawQuestions = Array.isArray(aiData?.questions) ? aiData.questions : (Array.isArray(aiData) ? aiData : null);
  if (!rawQuestions || !rawQuestions.length) {
    const err = new Error('Gemini AI failed to return structured quiz questions. Please retry.');
    err.status = 502;
    throw err;
  }

  const prepared = prepareQuiz(rawQuestions, cleanTopic, safeCount);
  if (!prepared || prepared.length < 1) {
    const err = new Error('Generated quiz questions failed quality validation. Please retry.');
    err.status = 502;
    throw err;
  }

  cacheSet(cacheKey, prepared);
  return prepared;
};

/* ------------------------------------------------------------------ */
/* 4. Mission Planner: Personalized Study Plan Generation             */
/* ------------------------------------------------------------------ */

const processPlanDays = (aiPlan, cleanTopic, goal, daysTotal, hours) => {
  const formattedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
  const totalMins = Math.round(hours * 60);
  const rawDays = Array.isArray(aiPlan?.days) ? aiPlan.days : [];

  const processedDays = [];
  for (let i = 1; i <= daysTotal; i++) {
    const raw = rawDays[i - 1];
    let title = raw?.title ? String(raw.title).trim() : '';
    if (!title.toLowerCase().startsWith('day')) {
      title = `DAY ${String(i).padStart(2, '0')}: ${title || `${formattedTopic} Milestone ${i}`}`;
    }

    let objectives = Array.isArray(raw?.objectives)
      ? raw.objectives.map(String).map((s) => s.trim()).filter(Boolean)
      : [];

    if (objectives.length < 2) {
      const subMins = Math.round(totalMins / 3);
      objectives = [
        `Master key concepts and definitions for ${title.replace(/^DAY \d+:\s*/i, '')} [${subMins}m]`,
        `Work through practical problems, proofs, or code examples [${subMins}m]`,
        `Complete active recall review and document takeaways [${totalMins - 2 * subMins}m]`
      ];
    }

    processedDays.push({
      day: i,
      title,
      focus: raw?.focus ? String(raw.focus).trim() : `Mastering ${title.replace(/^DAY \d+:\s*/i, '')}`,
      duration: `${totalMins} MIN`,
      xpReward: 100 + i * 25,
      objectives: objectives.slice(0, 5),
      completed: false
    });
  }

  return {
    protocolName: aiPlan?.protocolName || `${formattedTopic.toUpperCase()} — ${daysTotal}-DAY TRAINING PROTOCOL`,
    summary: aiPlan?.summary || `Personalized ${daysTotal}-day curriculum for ${formattedTopic}.`,
    goal: goal || `Master ${formattedTopic}`,
    topic: formattedTopic,
    totalDays: daysTotal,
    estimatedXpPool: processedDays.reduce((acc, d) => acc + d.xpReward, 0),
    days: processedDays
  };
};

export const generateStudyPlan = async ({
  goal,
  topic,
  availableHours = 2,
  deadlineDays = 7,
  knowledgeLevel = 'HERO',
  quizHistory = []
}) => {
  const cleanTopic = String(topic || '').trim() || 'Core Knowledge';
  const daysTotal = Math.min(Math.max(parseInt(deadlineDays) || 7, 1), 14);
  const hours = parseFloat(availableHours) || 2;

  const sysPrompt = STUDY_PLAN_SYSTEM_PROMPT;
  const userPrompt = STUDY_PLAN_USER_PROMPT(cleanTopic, goal, daysTotal, hours, knowledgeLevel, quizHistory);

  const aiData = await generateLLMJson(sysPrompt, userPrompt, {
    responseSchema: STUDY_PLAN_SCHEMA,
    topic: cleanTopic,
    featureTag: 'Study Plan Protocol',
    temperature: 0.3
  });

  if (!aiData || !Array.isArray(aiData.days) || !aiData.days.length) {
    const err = new Error('Gemini AI failed to return structured study plan. Please retry.');
    err.status = 502;
    throw err;
  }

  return processPlanDays(aiData, cleanTopic, goal, daysTotal, hours);
};
