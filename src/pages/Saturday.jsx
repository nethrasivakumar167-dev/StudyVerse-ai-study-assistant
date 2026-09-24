import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { saturdayService } from '../services/saturdayService';
import { notesService } from '../services/notesService';
import { SaturdayCore } from '../components/saturday/SaturdayCore';
import { ChatMessage } from '../components/saturday/ChatMessage';
import { PromptPills } from '../components/saturday/PromptPills';
import { EnergyButton } from '../components/ui/EnergyButton';
import { HolographicCard } from '../components/ui/HolographicCard';
import { Bot, Send, Sparkles, Terminal, Plus, History } from 'lucide-react';
import { userGet, userSet, userRemove } from '../utils/userStorage';

const CONVO_KEY = 'studyverse_saturday_convo';

const formatConvDate = (iso) => {
  try {
    return new Date(iso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

export const Saturday = () => {
  const { profile, addXp } = useHero();
  const location = useLocation();
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  const [activeTopic, setActiveTopic] = useState(() => location.state?.topic || null);
  const [savedMessageIds, setSavedMessageIds] = useState(() => new Set());

  const buildGreeting = () => ({
    id: 'msg-init',
    sender: 'saturday',
    timestamp: 'ONLINE',
    text: `**S.A.T.U.R.D.A.Y. ONLINE**\n*Student Assistant To Understand, Review, & Deliver Academic Yield*\n\nHello, **${profile?.superheroName || 'Hero'}**! 👋\n\nI am your AI chatbot companion. Feel free to chat with me about anything — whether you want to have a casual conversation, ask general questions, write code, solve problems, or study concepts. What would you like to talk about today?`
  });

  const [messages, setMessages] = useState([buildGreeting()]);
  const [inputText, setInputText] = useState(location.state?.initialPrompt || '');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState(() => userGet(CONVO_KEY) || null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Sync incoming navigation state from Knowledge Lab or elsewhere
  useEffect(() => {
    if (location.state?.topic) {
      setActiveTopic(location.state.topic);
    }
    if (location.state?.initialPrompt) {
      setInputText(location.state.initialPrompt);
    }
  }, [location.state]);

  // Load conversation list, and reopen the last thread like ChatGPT does.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const convos = await saturdayService.getConversations();
      if (cancelled) return;
      setConversations(convos);

      const savedId = userGet(CONVO_KEY);
      if (savedId) {
        const saved = await saturdayService.getMessages(savedId);
        if (cancelled) return;
        if (Array.isArray(saved) && saved.length) {
          setMessages(
            saved.map((m) => ({
              id: m.id,
              sender: m.sender,
              timestamp: m.timestamp,
              text: m.text,
              topic: m.topic || null
            }))
          );
          setConversationId(savedId);
        } else {
          userRemove(CONVO_KEY);
          setConversationId(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const resetInputHeight = () => {
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleSendMessage = async (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query || isThinking) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    resetInputHeight();
    setIsThinking(true);

    try {
      const aiResponse = await saturdayService.sendMessage(
        query,
        {
          superheroName: profile?.superheroName,
          heroClass: profile?.heroClassId,
          topic: activeTopic,
          source: location.state?.source || null
        },
        conversationId
      );

      const formattedAiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'saturday',
        timestamp: aiResponse.timestamp || 'NOW',
        text: aiResponse.text,
        type: aiResponse.type || (aiResponse.topic ? 'study' : 'chat'),
        topic: aiResponse.topic || activeTopic || null
      };

      if (aiResponse.topic) {
        setActiveTopic(aiResponse.topic);
      }

      setMessages((prev) => [...prev, formattedAiMsg]);

      if (aiResponse.conversationId) {
        setConversationId(aiResponse.conversationId);
        userSet(CONVO_KEY, aiResponse.conversationId);
        saturdayService.getConversations().then(setConversations).catch(() => {});
      }

      if (aiResponse.xpAwarded) {
        addXp(aiResponse.xpAwarded, 'S.A.T.U.R.D.A.Y. Intelligence Query');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'saturday',
          timestamp: 'ALERT',
          text: `⚠️ **CONNECTION INTERRUPTED**\n\nThe Intelligence Core couldn't complete the request. Please verify connection and retry.`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    if (isThinking) return;
    setMessages([buildGreeting()]);
    setConversationId(null);
    setActiveTopic(null);
    userRemove(CONVO_KEY);
    setShowHistory(false);
    resetInputHeight();
  };

  const handleSelectConversation = async (convo) => {
    setShowHistory(false);
    if (isThinking || convo.id === conversationId) return;
    const loaded = await saturdayService.getMessages(convo.id);
    if (!Array.isArray(loaded) || !loaded.length) return;
    setMessages(
      loaded.map((m) => ({
        id: m.id,
        sender: m.sender,
        timestamp: m.timestamp,
        text: m.text,
        topic: m.topic || null
      }))
    );
    setConversationId(convo.id);
    userSet(CONVO_KEY, convo.id);
    resetInputHeight();
  };

  const extractTopicFromMsg = (message) => {
    if (message.topic) return message.topic;
    const headerMatch = message.text.match(/###\s+([^\n]+)/);
    if (headerMatch) return headerMatch[1].trim();
    const boldMatch = message.text.match(/\*\*([^*]{3,60})\*\*/);
    if (boldMatch) return boldMatch[1].replace(/#+/g, '').trim();
    return activeTopic || 'Study Topic';
  };

  const handleSaveToVault = async (message) => {
    if (savedMessageIds.has(message.id)) return;

    const topicTitle = extractTopicFromMsg(message);
    const lines = message.text
      .split('\n')
      .map((l) =>
        l
          .replace(/^[#>\s]+/, '')
          .replace(/^[-*•]\s+/, '')
          .replace(/\*\*/g, '')
          .trim()
      )
      .filter((l) => l.length > 25);

    const overviewLine =
      message.text.match(/\*\*OVERVIEW\*\*\s*\n([^\n]+)/i)?.[1] ||
      lines[0] ||
      `Comprehensive study notes on ${topicTitle}.`;

    const bulletLines = lines.filter(
      (l) => !l.toUpperCase().includes('OVERVIEW') && !l.toUpperCase().includes('DETAILED')
    );

    await notesService.saveNote({
      title: topicTitle,
      topic: topicTitle.toUpperCase(),
      difficulty: 'HERO',
      summary: overviewLine.slice(0, 200),
      bulletPoints:
        bulletLines.length > 1
          ? bulletLines.slice(0, 6).map((l) => l.slice(0, 180))
          : [`Core mechanisms, key principles, and exam takeaways for ${topicTitle}.`],
      examAlert:
        lines.find((l) => /exam|trap|mistake|avoid|alert|watch/i.test(l))?.slice(0, 200) ||
        'Review key definitions and edge cases before your next assessment.'
    });

    setSavedMessageIds((prev) => new Set([...prev, message.id]));
    addXp(30, 'Saved to Knowledge Vault');
  };

  const handleContinueInLab = (message) => {
    const topicToPass = extractTopicFromMsg(message);
    navigate('/knowledge-lab', { state: { topic: topicToPass } });
  };

  const handleLaunchBattle = (message) => {
    const topicToPass = extractTopicFromMsg(message);
    navigate('/battle-arena', { state: { topic: topicToPass } });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* AI Header & Core Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-orbitron font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI COMMAND SYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-red-400 uppercase tracking-tight">
            S.A.T.U.R.D.A.Y.
          </h1>

          <p className="text-xs sm:text-sm font-rajdhani font-bold text-amber-400/90 uppercase tracking-widest mt-1">
            Student Assistant To Understand, Review, & Deliver Academic Yield
          </p>

          <p className="text-xs text-slate-400 font-outfit mt-2 max-w-xl">
            Your personalized superhero study companion. Command S.A.T.U.R.D.A.Y. to decode complex syllabus, detect exam traps, and power up your academic reflexes.
          </p>
        </div>

        <div className="lg:col-span-4">
          <SaturdayCore isThinking={isThinking} />
        </div>
      </div>

      {/* Main Terminal Dialogue Container */}
      <HolographicCard glowColor="gold" className="p-4 sm:p-6 flex flex-col min-h-[500px] justify-between">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">S.A.T.U.R.D.A.Y. SECURE TERMINAL [ENCRYPTED]</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:text-emerald-400 text-[11px] sm:flex items-center gap-1 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              99.8% NEURAL SYNC
            </span>

            <button
              onClick={handleNewChat}
              disabled={isThinking}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700 hover:border-amber-400/60 hover:text-amber-300 transition cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border transition cursor-pointer ${
                  showHistory
                    ? 'border-amber-400/60 text-amber-300'
                    : 'border-slate-700 hover:border-amber-400/60 hover:text-amber-300'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">History</span>
              </button>

              {showHistory && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowHistory(false)} />
                  <div className="absolute right-0 top-8 z-20 w-72 max-h-80 overflow-y-auto rounded-xl bg-[#0a0f24] border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-2">
                    <div className="px-2 pt-1 pb-1.5 text-[10px] font-rajdhani font-bold text-slate-400 uppercase tracking-wider">
                      Recent Conversations
                    </div>

                    {conversations.length === 0 && (
                      <div className="px-2 py-3 text-xs text-slate-500 font-outfit">
                        No saved conversations yet. Your threads appear here after your first message.
                      </div>
                    )}

                    {conversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => handleSelectConversation(convo)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg transition cursor-pointer ${
                          convo.id === conversationId
                            ? 'bg-amber-500/10 border border-amber-500/30'
                            : 'hover:bg-slate-800 border border-transparent'
                        }`}
                      >
                        <div className="text-xs text-slate-200 truncate font-outfit">{convo.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {formatConvDate(convo.updatedAt)}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto max-h-[420px] py-4 pr-1 space-y-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isSaved={savedMessageIds.has(msg.id)}
              onSaveToVault={handleSaveToVault}
              onContinueInLab={handleContinueInLab}
              onLaunchBattle={handleLaunchBattle}
            />
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 my-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 max-w-md animate-pulse">
              <Bot className="w-5 h-5 text-amber-400 animate-spin" />
              <div className="text-xs font-orbitron font-bold text-amber-300">
                S.A.T.U.R.D.A.Y. IS ANALYZING SYLLABUS...
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Tactical Quick Prompts */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-[10px] font-rajdhani font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Tactical Prompts
          </div>
          <PromptPills onSelectPrompt={(text) => handleSendMessage(text)} />
        </div>

        {/* Input Form — ChatGPT-style auto-grow textarea */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 flex gap-2.5 items-end"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask S.A.T.U.R.D.A.Y. (Enter to send · Shift+Enter for a new line)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white font-outfit text-sm outline-none transition resize-none max-h-40"
            disabled={isThinking}
          />
          <EnergyButton
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            disabled={!inputText.trim() || isThinking}
          >
            Transmit
          </EnergyButton>
        </form>
      </HolographicCard>
    </div>
  );
};
