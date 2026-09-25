import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { useSound } from '../context/SoundContext';
import { uploadService } from '../services/uploadService';
import { notesService } from '../services/notesService';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { ChatMessage } from '../components/saturday/ChatMessage';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  FileUp,
  FileText,
  Sparkles,
  Terminal,
  Send,
  Bot,
  AlertCircle,
  CheckCircle2,
  Search,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Swords
} from 'lucide-react';

const formatDocDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Recent';
  }
};

const SUGGESTED_QUESTIONS = [
  'Summarize the core takeaways from this document',
  'What are the key definitions and formulas mentioned?',
  'List high-priority exam topics or critical concepts',
  'What common mistakes or caveats are highlighted?'
];

export const Uploads = () => {
  const { profile, addXp } = useHero();
  const { playSfx } = useSound();
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Uploads state
  const [uploads, setUploads] = useState([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload file interaction state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Q&A Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [savedMessageIds, setSavedMessageIds] = useState(() => new Set());
  const navigate = useNavigate();

  // Load uploaded documents on mount
  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async (autoSelectFirst = false) => {
    setIsLoadingUploads(true);
    try {
      const data = await uploadService.getUploads();
      setUploads(data);
      if (autoSelectFirst && data.length > 0) {
        handleSelectDoc(data[0]);
      } else if (!selectedDoc && data.length > 0) {
        handleSelectDoc(data[0]);
      }
    } catch (err) {
      console.error('[Uploads] Failed to load documents:', err);
    } finally {
      setIsLoadingUploads(false);
    }
  };

  // Switch active document and initialize chat thread
  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setUploadError('');
    setUploadSuccess('');
    setMessages([
      {
        id: `init-${doc.id || doc._id}`,
        sender: 'saturday',
        timestamp: 'ONLINE',
        text: `**DOCUMENT READY FOR NEURAL INTEL**\n\n📄 **Document:** \`${doc.filename}\`\n📊 **Volume:** ${doc.charCount?.toLocaleString() || 0} characters extracted\n🛡️ **Strict Grounding:** Enabled (Answers derived strictly from this document)\n\nHello, **${profile?.superheroName || 'Hero'}**! I have parsed your document. Ask me any question, request a summary, or have me locate key formulas and exam concepts.`
      }
    ]);
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle file upload
  const processFileUpload = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Invalid file format. Please select a valid PDF document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadService.uploadPdf(file, (percent) => {
        setUploadProgress(percent);
      });

      playSfx('success');
      setUploadSuccess(`Successfully extracted ${result.filename} (${result.charCount?.toLocaleString() || 0} chars)`);
      addXp(40, 'PDF Intel Ingestion');

      // Refresh list and select the new document
      await loadUploads();
      handleSelectDoc(result);
    } catch (err) {
      console.error('[Uploads] Upload failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to upload and parse PDF.';
      setUploadError(msg);
      playSfx('error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Handle Q&A send
  const handleSendMessage = async (textToSend = inputText) => {
    const question = textToSend.trim();
    if (!question || !selectedDoc || isThinking) return;

    const docId = selectedDoc.id || selectedDoc._id;
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: question
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsThinking(true);

    try {
      const response = await uploadService.askQuestion(docId, question);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'saturday',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.answer || 'No answer returned.',
        topic: selectedDoc.filename
      };

      setMessages((prev) => [...prev, aiMsg]);
      addXp(20, 'Document Intel Query');
    } catch (err) {
      console.error('[Uploads Q&A Error]:', err);
      const errorMsg = err.response?.data?.message || 'Connection to S.A.T.U.R.D.A.Y. intelligence core failed.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'saturday',
          timestamp: 'ALERT',
          text: `⚠️ **QUERY FAILED**\n\n${errorMsg} Please verify document selection and retry.`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Save AI insight to Knowledge Vault
  const handleSaveToVault = async (message) => {
    if (savedMessageIds.has(message.id)) return;

    const title = selectedDoc?.filename?.replace(/\.pdf$/i, '') || 'Document Study Notes';
    const lines = message.text
      .split('\n')
      .map((l) => l.replace(/^[#*->\s]+/, '').trim())
      .filter((l) => l.length > 20);

    await notesService.saveNote({
      title: `Doc Intel: ${title}`,
      topic: title.toUpperCase(),
      difficulty: 'HERO',
      summary: lines[0] || `Key takeaways and insights extracted from ${selectedDoc?.filename}.`,
      bulletPoints: lines.slice(1, 5).length ? lines.slice(1, 5) : [`Insights from document ${selectedDoc?.filename}`],
      examAlert: 'Directly referenced from uploaded syllabus material.'
    });

    setSavedMessageIds((prev) => new Set([...prev, message.id]));
    addXp(30, 'Saved Intel to Knowledge Vault');
  };

  // Generate Battle Arena Quiz from Document
  const handleGenerateQuiz = async () => {
    if (!selectedDoc || isGeneratingQuiz) return;
    const docId = selectedDoc.id || selectedDoc._id;
    setIsGeneratingQuiz(true);
    setQuizError('');
    playSfx('energy');

    try {
      const quizResult = await uploadService.generateQuiz(docId, 5);
      playSfx('levelup');
      addXp(40, 'Battle Quiz Generated from Document');
      navigate('/battle-arena', { state: { quizData: quizResult } });
    } catch (err) {
      console.error('[Uploads] Quiz generation failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to generate battle quiz from document.';
      setQuizError(msg);
      playSfx('error');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const filteredUploads = uploads.filter((doc) =>
    (doc.filename || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-orbitron font-bold uppercase mb-2">
            <FileUp className="w-3.5 h-3.5" />
            <span>DOCUMENT INTEL CORE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200 uppercase tracking-tight">
            PDF UPLOAD & Q&A
          </h1>

          <p className="text-xs sm:text-sm font-rajdhani font-bold text-amber-400/90 uppercase tracking-widest mt-1">
            Grounded Syllabus Ingestion & Document-Specific Question Answering
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadUploads()}
            title="Refresh documents"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingUploads ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Zone & Document List (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Drop Zone Card */}
          <HolographicCard glowColor="gold" className="p-5">
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800 text-xs font-orbitron font-bold uppercase text-amber-300">
              <div className="flex items-center gap-2">
                <FileUp className="w-4 h-4 text-amber-400" />
                <span>Upload New PDF</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">MAX 10MB</span>
            </div>

            {/* Drag and drop surface */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl border-2 border-dashed transition cursor-pointer ${
                isDragOver
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-slate-700/80 bg-slate-900/50 hover:border-amber-400/60 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <FileText className="w-6 h-6" />
              </div>

              <div className="text-sm font-rajdhani font-bold text-slate-200 uppercase tracking-wide text-center">
                Click to browse or drag & drop PDF
              </div>
              <div className="text-[11px] text-slate-400 font-outfit mt-1 text-center">
                Supports syllabus documents, research notes, and textbook excerpts
              </div>

              <EnergyButton
                variant="primary"
                size="sm"
                icon={FileUp}
                className="mt-4 pointer-events-none"
                disabled={isUploading}
              >
                {isUploading ? 'Extracting Text...' : 'Select PDF Document'}
              </EnergyButton>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4 space-y-2 animate-fade-in">
                <div className="flex justify-between text-xs font-orbitron font-semibold text-amber-300">
                  <span>PARSING PDF STRUCTURE...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar value={uploadProgress} color="gold" size="sm" animated />
              </div>
            )}

            {/* Success / Error Banners */}
            {uploadSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 font-outfit animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 font-outfit animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </HolographicCard>

          {/* Past Uploads Library Card */}
          <HolographicCard glowColor="red" className="p-5">
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800 text-xs font-orbitron font-bold uppercase text-red-400">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Uploaded Documents ({uploads.length})</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">NEWEST FIRST</span>
            </div>

            {/* Search Filter */}
            {uploads.length > 3 && (
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter uploaded documents..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition font-outfit"
                />
              </div>
            )}

            {/* Document Cards List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {isLoadingUploads ? (
                <div className="py-8 text-center text-xs text-slate-500 font-outfit flex flex-col items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-400 animate-spin" />
                  <span>Loading document library...</span>
                </div>
              ) : filteredUploads.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-400 font-rajdhani uppercase">
                    No documents found
                  </div>
                  <p className="text-[11px] text-slate-500 font-outfit mt-1">
                    Upload a syllabus or study guide PDF above to enable AI document Q&A.
                  </p>
                </div>
              ) : (
                filteredUploads.map((doc) => {
                  const docId = doc.id || doc._id;
                  const isSelected = selectedDoc && (selectedDoc.id === docId || selectedDoc._id === docId);

                  return (
                    <div
                      key={docId}
                      onClick={() => handleSelectDoc(doc)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-xs font-bold truncate font-rajdhani uppercase tracking-wide ${
                                isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                              }`}
                            >
                              {doc.filename}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                {doc.charCount?.toLocaleString() || 0} chars
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                {formatDocDate(doc.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[9px] font-orbitron px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </HolographicCard>
        </div>

        {/* Right Column: Q&A Chat Terminal (7 cols) */}
        <div className="lg:col-span-7">
          <HolographicCard glowColor="gold" className="p-4 sm:p-6 flex flex-col h-full min-h-[580px] justify-between">
            {/* Terminal Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  {selectedDoc ? `Q&A TERMINAL: [${selectedDoc.filename}]` : 'S.A.T.U.R.D.A.Y. DOCUMENT Q&A'}
                </span>
              </div>

              {selectedDoc && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz || isThinking}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-rajdhani font-bold text-xs uppercase tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate Battle Arena Quiz from this document"
                  >
                    <Swords className={`w-3.5 h-3.5 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingQuiz ? 'Constructing Quiz...' : 'Generate Quiz'}</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-orbitron font-semibold shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    <span>GROUNDED</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Error Alert */}
            {quizError && (
              <div className="my-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300 font-outfit animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{quizError}</span>
              </div>
            )}

            {/* Terminal Message Stream */}
            <div className="flex-1 overflow-y-auto max-h-[460px] py-4 pr-1 space-y-2">
              {!selectedDoc ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-500">
                  <FileText className="w-12 h-12 text-slate-700 mb-3" />
                  <div className="text-sm font-orbitron font-bold text-slate-400 uppercase">
                    Select a Document to Start Q&A
                  </div>
                  <p className="text-xs text-slate-500 font-outfit max-w-sm mt-1">
                    Upload a PDF on the left panel or select an existing document from your library to interrogate its contents with S.A.T.U.R.D.A.Y.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      isSaved={savedMessageIds.has(msg.id)}
                      onSaveToVault={handleSaveToVault}
                    />
                  ))}

                  {isThinking && (
                    <div className="flex items-center gap-3 my-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 max-w-md animate-pulse">
                      <Bot className="w-5 h-5 text-amber-400 animate-spin" />
                      <div className="text-xs font-orbitron font-bold text-amber-300">
                        S.A.T.U.R.D.A.Y. IS ANALYZING DOCUMENT...
                      </div>
                    </div>
                  )}

                  {isGeneratingQuiz && (
                    <div className="flex items-center gap-3 my-4 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 max-w-md animate-pulse">
                      <Swords className="w-5 h-5 text-red-400 animate-spin" />
                      <div className="text-xs font-orbitron font-bold text-red-300">
                        CONSTRUCTING BATTLE ARENA QUIZ FROM DOCUMENT...
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </>
              )}
            </div>

            {/* Quick Suggested Tactical Questions & Battle Action */}
            {selectedDoc && (
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-[10px] font-rajdhani font-bold text-slate-400 uppercase tracking-wider">
                    Tactical Inquiries & Battle Protocols
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz || isThinking}
                    className="text-[10px] font-orbitron font-bold text-red-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                  >
                    <Swords className="w-3 h-3" />
                    <span>Launch Battle Quiz</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      disabled={isThinking || isGeneratingQuiz}
                      className="text-left px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 hover:bg-amber-500/10 text-slate-300 hover:text-amber-200 text-[11px] font-outfit transition cursor-pointer disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-4 flex gap-2.5 items-end"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                disabled={!selectedDoc || isThinking}
                onChange={(e) => {
                  setInputText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  selectedDoc
                    ? `Ask anything about "${selectedDoc.filename}" (Enter to send)...`
                    : 'Select or upload a document first...'
                }
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white font-outfit text-sm outline-none transition resize-none max-h-36 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <EnergyButton
                type="submit"
                variant="primary"
                size="md"
                icon={Send}
                disabled={!inputText.trim() || !selectedDoc || isThinking}
              >
                Transmit
              </EnergyButton>
            </form>
          </HolographicCard>
        </div>
      </div>
    </div>
  );
};

export default Uploads;
