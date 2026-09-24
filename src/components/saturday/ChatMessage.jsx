import React from 'react';
import { Bot, BookmarkPlus, Swords, Copy, Check, FlaskConical } from 'lucide-react';
import { HeroAvatar } from '../hero/HeroAvatar';
import { useHero } from '../../context/HeroContext';

/* ------------------------------------------------------------------ */
/* Lightweight markdown renderer (bold, italic, code, headings,        */
/* bullet/numbered lists, blockquotes) — keeps ChatGPT-style replies   */
/* readable without adding any dependency.                             */
/* ------------------------------------------------------------------ */

const inlineFormat = (text, keyBase) => {
  const parts = [];
  const regex = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <React.Fragment key={`${keyBase}-t${i++}`}>{text.slice(lastIndex, match.index)}</React.Fragment>
      );
    }
    const token = match[0];
    const key = `${keyBase}-m${i++}`;
    if (token.startsWith('**')) {
      parts.push(
        <strong key={key} className="font-semibold text-amber-200">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-slate-800/90 text-emerald-300 font-mono text-[13px]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      parts.push(
        <em key={key} className="italic text-slate-300">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<React.Fragment key={`${keyBase}-t${i++}`}>{text.slice(lastIndex)}</React.Fragment>);
  }
  return parts;
};

const renderMarkdown = (text) => {
  const lines = (text || '').split('\n');
  const blocks = [];
  let list = null; // { type: 'ul' | 'ol', items: [] }
  let para = [];
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, idx) => (
      <li key={idx}>{inlineFormat(item, `${key}-li${idx}`)}</li>
    ));
    blocks.push(
      list.type === 'ul' ? (
        <ul key={key++} className="list-disc pl-5 space-y-1 marker:text-amber-400">
          {items}
        </ul>
      ) : (
        <ol key={key++} className="list-decimal pl-5 space-y-1 marker:text-amber-400">
          {items}
        </ol>
      )
    );
    list = null;
  };

  const flushPara = () => {
    if (!para.length) return;
    const linesInPara = para;
    para = [];
    blocks.push(
      <p key={key++}>
        {linesInPara.map((line, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {inlineFormat(line, `${key}-p${idx}`)}
          </React.Fragment>
        ))}
      </p>
    );
  };

  lines.forEach((raw) => {
    const line = raw.trim();

    if (!line) {
      flushList();
      flushPara();
      return;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    const quote = line.match(/^>\s?(.*)$/);

    if (heading) {
      flushList();
      flushPara();
      const level = heading[1].length;
      const content = inlineFormat(heading[2], `h${key}`);
      blocks.push(
        level <= 2 ? (
          <h3
            key={key++}
            className="font-orbitron text-[13px] font-bold uppercase tracking-wide text-amber-300 mt-1"
          >
            {content}
          </h3>
        ) : (
          <h4 key={key++} className="text-sm font-bold text-amber-200 mt-1">
            {content}
          </h4>
        )
      );
      return;
    }

    if (quote) {
      flushList();
      flushPara();
      blocks.push(
        <blockquote
          key={key++}
          className="border-l-2 border-amber-400/60 pl-3 py-0.5 text-slate-300 italic bg-amber-500/5 rounded-r"
        >
          {inlineFormat(quote[1], `q${key}`)}
        </blockquote>
      );
      return;
    }

    if (bullet || numbered) {
      flushPara();
      const type = bullet ? 'ul' : 'ol';
      const item = bullet ? bullet[1] : numbered[2];
      if (list && list.type === type) {
        list.items.push(item);
      } else {
        flushList();
        list = { type, items: [item] };
      }
      return;
    }

    // Plain paragraph line — a list ends when non-list text follows it.
    flushList();
    para.push(raw.trim());
  });

  flushList();
  flushPara();
  return blocks;
};

const cleanMessageText = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw.trim();

  // Strip code fences if the entire message is wrapped in ```
  if (str.startsWith('```') && str.endsWith('```')) {
    str = str.replace(/^```(?:json|markdown|text)?\s*/i, '').replace(/\s*```$/i).trim();
  }

  // Detect and unwrap JSON structures like { "output": [ ... ] } or { "text": ... }
  if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed.output)) {
        return parsed.output
          .filter(Boolean)
          .map((item) => `• ${typeof item === 'object' ? JSON.stringify(item) : String(item).trim()}`)
          .join('\n\n');
      }
      if (typeof parsed.text === 'string') return parsed.text.trim();
      if (typeof parsed.response === 'string') return parsed.response.trim();
      if (typeof parsed.message === 'string') return parsed.message.trim();
      if (typeof parsed.content === 'string') return parsed.content.trim();
      if (Array.isArray(parsed)) {
        return parsed
          .filter(Boolean)
          .map((item) => `• ${typeof item === 'object' ? JSON.stringify(item) : String(item).trim()}`)
          .join('\n\n');
      }
    } catch {
      // Keep as is if not valid JSON
    }
  }
  return str;
};

export const ChatMessage = ({
  message,
  isSaved = false,
  onSaveToVault,
  onContinueInLab,
  onLaunchBattle
}) => {
  const { profile } = useHero();
  const [copied, setCopied] = React.useState(false);

  const isAI = message.sender === 'saturday';
  const displayText = cleanMessageText(message.text);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3.5 my-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-amber-300/50">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 border transition ${
          isAI
            ? 'bg-[#0a0f24]/90 border-amber-500/30 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            : 'bg-gradient-to-r from-red-600/90 to-red-700 text-white border-red-500/40 shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-white/10 text-xs font-rajdhani">
          <span className="font-bold tracking-wider uppercase font-orbitron text-[11px] text-amber-300">
            {isAI ? 'S.A.T.U.R.D.A.Y. INTEL CORE' : profile?.superheroName || 'YOU'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{message.timestamp}</span>
        </div>

        {/* Message Content — rendered markdown */}
        <div className={`text-sm font-outfit leading-relaxed space-y-2 ${!isAI ? 'text-white' : ''}`}>
          {renderMarkdown(displayText)}
        </div>

        {/* Action Controls for AI Messages */}
        {isAI && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onSaveToVault && (
              <button
                onClick={() => !isSaved && onSaveToVault(message)}
                disabled={isSaved}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                  isSaved
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved to Vault' : 'Save to Vault'}</span>
              </button>
            )}

            {onContinueInLab && (
              <button
                onClick={() => onContinueInLab(message)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Continue in Knowledge Lab</span>
              </button>
            )}

            {onLaunchBattle && (
              <button
                onClick={() => onLaunchBattle(message)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Battle on this Topic</span>
              </button>
            )}
          </div>
        )}
      </div>

      {!isAI && (
        <HeroAvatar
          avatarId={profile?.avatarId}
          heroClassId={profile?.heroClassId || 'tech-titan'}
          size="sm"
          className="shrink-0 mt-1"
        />
      )}
    </div>
  );
};
