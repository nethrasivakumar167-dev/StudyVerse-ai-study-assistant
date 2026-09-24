/**
 * Robust JSON extraction & Auto-Repairing Sanitizer
 */

export const stripFences = (text) =>
  String(text || '')
    .replace(/^```(?:json|markdown|text)?\s*/im, '')
    .replace(/\s*```\s*$/im)
    .trim();

export const extractAndParseJson = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return null;
  let text = stripFences(rawText);

  // Remove potential <think>...</think> reasoning blocks from reasoning models
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) return null;
  text = text.substring(firstBrace);

  // 1. Direct parse attempt
  try {
    return JSON.parse(text);
  } catch {}

  // 2. Fix unescaped backslashes commonly emitted in LaTeX formulas (\frac, \sum, \pi, etc.)
  try {
    const sanitized = text
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
      .replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(sanitized);
  } catch {}

  // 3. Truncated JSON Repair: Scan and auto-close unclosed quotes, brackets, and braces
  let inString = false;
  let isEscaped = false;
  const stack = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}' || char === ']') {
        if (stack.length) stack.pop();
      }
    }
  }

  let repaired = text;
  if (inString) repaired += '"';
  while (stack.length) {
    const openChar = stack.pop();
    if (openChar === '{') repaired += '}';
    else if (openChar === '[') repaired += ']';
  }

  try {
    const sanitized = repaired
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
    return JSON.parse(sanitized);
  } catch {}

  // 4. Backtracking recovery: find last clean comma boundary and close
  let cut = text;
  while (cut.length > 50) {
    const lastComma = cut.lastIndexOf(',');
    if (lastComma === -1) break;
    cut = cut.substring(0, lastComma);
    let temp = cut;
    let s = [];
    let inS = false;
    let esc = false;
    for (let i = 0; i < temp.length; i++) {
      const c = temp[i];
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') { inS = !inS; continue; }
      if (!inS) {
        if (c === '{' || c === '[') s.push(c);
        else if (c === '}' || c === ']') if (s.length) s.pop();
      }
    }
    if (inS) temp += '"';
    while (s.length) {
      const o = s.pop();
      temp += o === '{' ? '}' : ']';
    }
    try {
      const sanitized = temp
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
      return JSON.parse(sanitized);
    } catch {}
  }

  return null;
};
