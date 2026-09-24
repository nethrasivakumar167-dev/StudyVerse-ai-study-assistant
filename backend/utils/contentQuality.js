/**
 * Shared quality gates for generated academic content.
 *
 * - topicStems / mentionsTopic: is this text actually about the requested topic?
 * - academicClean: does it avoid the site's superhero/game narrative?
 * - shuffleQuestion / validateQuiz / prepareQuiz: option shuffling, correct-
 *   answer position distribution, and structural validation for Battle Arena.
 */

/* ------------------------------------------------------------------ */
/* Topic relevance                                                     */
/* ------------------------------------------------------------------ */

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this', 'your', 'are', 'was', 'were',
  'how', 'what', 'why', 'when', 'who', 'its', 'not', 'any', 'can', 'could', 'should', 'would',
  'use', 'uses', 'using', 'about', 'between', 'during', 'under', 'over', 'than', 'then', 'them',
  'they', 'their', 'have', 'has', 'had', 'you', 'some', 'all', 'one', 'two', 'three', 'both',
  'each', 'every', 'per', 'via', 'make', 'makes', 'more', 'most', 'best', 'good', 'new', 'get',
  'got', 'does', 'did', 'been', 'being', 'but', 'or', 'if', 'as', 'at', 'be', 'by', 'in', 'is',
  'it', 'of', 'on', 'to', 'a', 'an', 'no', 'up', 'we', 'he', 'she', 'do', 'so'
]);

/** Tiny stemmer so "scheduling" / "scheduler" / "schedule" all match "schedule". */
const stem = (word) => {
  let w = word.toLowerCase();
  if (w === 'series' || w === 'species') return w;
  if (w.endsWith('ies') && w.length > 4) return `${w.slice(0, -3)}y`;
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('er') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
};

/** Meaningful, stemmed keywords for a topic (e.g. "Binary Addition" -> [binary, addition]). */
export const topicStems = (topic) => {
  const words = String(topic || '')
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter(Boolean);
  const stems = [];
  for (const w of words) {
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    stems.push(w);
    const s = stem(w);
    if (s.length >= 3) stems.push(s);
  }
  return [...new Set(stems)];
};

/** True when `text` mentions at least one keyword of `topic` (or topic has none). */
export const mentionsTopic = (text, topic) => {
  const stems = topicStems(topic);
  if (!stems.length) return true;
  const lower = String(text || '').toLowerCase();
  return stems.some((s) => lower.includes(s));
};

/* ------------------------------------------------------------------ */
/* Academic content rule: no superhero/game narrative                  */
/* ------------------------------------------------------------------ */

const THEME_TERMS =
  /superhero|superheroes|villain|sidekick|\bcapes?\b|spider-?man|batman|studyverse|\bXP\b|battle arena|as a hero|s\.a\.t\.u\.r\.d\.a\.y/i;

/** True when the text contains no website-theme language (pure academic text). */
export const academicClean = (text) => !THEME_TERMS.test(String(text || ''));

/* ------------------------------------------------------------------ */
/* Quiz shuffling + validation                                          */
/* ------------------------------------------------------------------ */

const XP_TABLE = [50, 75, 75, 100];

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Shuffles one question's options and remaps correctAnswer so it still
 * points at the same answer text after the shuffle.
 */
export const shuffleQuestion = (q) => {
  const options = shuffleArray(q.options);
  const correctAnswer = options.indexOf(q.options[q.correctAnswer]);
  return { ...q, options, correctAnswer };
};

export const shuffleQuiz = (questions) => questions.map(shuffleQuestion);

const normalizeText = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const GENERIC_QUIZ_PATTERNS = [
  /which statement best describes the core purpose/i,
  /it provides a systematic, well-defined way to solve/i,
  /what is the core primary objective when mastering/i,
  /when optimizing or analyzing .* which factor is most crucial/i,
  /what is the most common exam trap or misconception regarding/i,
  /what is the most common exam mistake when answering questions on/i,
  /what is the best approach when solving a difficult problem involving/i,
  /how does a superhero-level student best apply/i,
  /which real-world example best illustrates an application of/i,
  /which key term of .* must be defined precisely/i,
  /removes the need to understand any underlying assumptions/i,
  /guarantees correct results without validating inputs/i,
  /only applies when all relevant data is missing/i,
  /which statement best captures the core purpose/i,
  /what problem it solves, what assumptions it relies on/i
];

/**
 * Structural validation (shuffle-independent unless checkPositions is set):
 * exact count, 4 unique options, one valid correct index, non-empty
 * explanation, no duplicate questions, no generic template filler, and topic relevance.
 */
export const validateQuiz = (questions, topic, count, { checkPositions = false } = {}) => {
  const problems = [];
  const minRequired = Math.min(count, 3);
  if (!Array.isArray(questions) || questions.length < minRequired) {
    problems.push(`expected at least ${minRequired} questions, got ${Array.isArray(questions) ? questions.length : 'none'}`);
    return { ok: false, problems };
  }

  const stems = topicStems(topic);
  const seenQuestions = new Set();
  let relevant = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const at = `q${i + 1}`;
    if (!q || typeof q.question !== 'string' || !q.question.trim()) {
      problems.push(`${at}: missing question`);
      continue;
    }

    const fullQuestionText = `${q.question} ${(q.options || []).join(' ')} ${q.explanation || ''}`;

    // Reject generic template questions
    if (GENERIC_QUIZ_PATTERNS.some((p) => p.test(fullQuestionText))) {
      problems.push(`${at}: generic template question rejected`);
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      problems.push(`${at}: needs exactly 4 options`);
    } else {
      const norm = q.options.map((o) => String(o || '').trim().toLowerCase());
      if (norm.some((o) => !o)) problems.push(`${at}: empty option`);
      if (new Set(norm).size !== 4) problems.push(`${at}: duplicate options`);
    }

    // Normalize correctAnswer if returned as string (e.g. "A", "0", or matching text)
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
      if (typeof q.correctAnswer === 'string') {
        const cLower = q.correctAnswer.trim().toLowerCase();
        if (cLower === 'a' || cLower === 'option a' || cLower === '0') q.correctAnswer = 0;
        else if (cLower === 'b' || cLower === 'option b' || cLower === '1') q.correctAnswer = 1;
        else if (cLower === 'c' || cLower === 'option c' || cLower === '2') q.correctAnswer = 2;
        else if (cLower === 'd' || cLower === 'option d' || cLower === '3') q.correctAnswer = 3;
        else if (Array.isArray(q.options)) {
          const matchedIdx = q.options.findIndex(
            (opt) => String(opt).trim().toLowerCase() === cLower
          );
          if (matchedIdx !== -1) q.correctAnswer = matchedIdx;
        }
      }
    }

    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
      problems.push(`${at}: correctAnswer must be 0-3`);
    }
    if (typeof q.explanation !== 'string' || !q.explanation.trim()) {
      problems.push(`${at}: missing explanation`);
    }

    const normQ = normalizeText(q.question);
    if (seenQuestions.has(normQ)) problems.push(`${at}: duplicate question`);
    seenQuestions.add(normQ);

    if (stems.length) {
      const text = `${q.question} ${(q.options || []).join(' ')} ${q.explanation || ''}`.toLowerCase();
      if (stems.some((s) => text.includes(s))) relevant += 1;
    }
  }

  if (stems.length && relevant < 1) {
    problems.push(`none of the questions mention keywords for topic "${topic}"`);
  }

  if (checkPositions && questions.length > 1 && new Set(questions.map((q) => q?.correctAnswer)).size === 1) {
    problems.push('all correct answers sit in the same option position');
  }

  return { ok: problems.length === 0, problems };
};

const allSamePosition = (questions) =>
  questions.length > 1 && new Set(questions.map((q) => q.correctAnswer)).size === 1;

/**
 * The single exit gate for quiz generation:
 *   1. structural validation of the raw questions,
 *   2. option shuffle with correctAnswer remapped,
 *   3. re-shuffle until correct answers are distributed (never all the same position across the quiz),
 *   4. id + xp mapping.
 * Returns null when the source cannot pass.
 */
export const prepareQuiz = (rawQuestions, topic, count) => {
  const structural = validateQuiz(rawQuestions, topic, count);
  if (!structural.ok) return null;

  let shuffled = shuffleQuiz(rawQuestions);
  for (let attempt = 0; attempt < 8 && allSamePosition(shuffled); attempt++) {
    shuffled = shuffleQuiz(rawQuestions);
  }
  if (allSamePosition(shuffled)) return null;

  return shuffled.slice(0, count).map((q, i) => ({
    id: `q${i + 1}`,
    question: q.question.trim(),
    options: q.options.map((o) => String(o).trim()),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation.trim(),
    xp: Number.isFinite(q.xp) ? q.xp : XP_TABLE[i % XP_TABLE.length]
  }));
};

