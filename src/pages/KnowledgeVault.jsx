import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesService } from '../services/notesService';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { ExportDropdown } from '../components/ui/ExportDropdown';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  BookMarked,
  Sparkles,
  Zap,
  Trash2,
  Swords,
  Search,
  Filter,
  AlertTriangle,
  Plus,
  CheckCircle2,
  FileText,
  FileCode
} from 'lucide-react';

export const KnowledgeVault = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      const data = await notesService.getNotes();
      setNotes(data);
    };
    loadNotes();
  }, []);

  const handleDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    if (!target) return;
    await notesService.deleteNote(target.id);
    setNotes((prev) => prev.filter((n) => n.id !== target.id));
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.examAlert && note.examAlert.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'ALL' || note.difficulty === selectedTag || note.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-orbitron font-bold uppercase mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>KNOWLEDGE CRYSTAL ARCHIVES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white uppercase tracking-tight">
            KNOWLEDGE VAULT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1">
            Synthesized digital study cards stored securely with S.A.T.U.R.D.A.Y. exam warnings.
          </p>
        </div>

        <EnergyButton
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => navigate('/knowledge-lab')}
        >
          Synthesize New Topic
        </EnergyButton>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault archives by topic, keyword, or exam warning..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-outfit text-sm outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'HERO', 'SUPERHERO', 'RECRUIT'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
                selectedTag === tag
                  ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <BookMarked className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-orbitron font-bold text-slate-300">
            {notes.length === 0 ? 'NO STUDY NOTES YET' : 'NO KNOWLEDGE CRYSTALS FOUND'}
          </h3>
          <p className="text-xs text-slate-500 font-outfit mt-1 max-w-sm mx-auto mb-4">
            {notes.length === 0
              ? 'No study notes yet. Generate your first study note from Knowledge Hub.'
              : 'No saved notes match your search or filter.'}
          </p>
          {notes.length === 0 && (
            <EnergyButton
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => navigate('/knowledge-lab')}
            >
              Create First Topic Note
            </EnergyButton>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <HolographicCard
              key={note.id}
              glowColor="gold"
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-orbitron font-bold text-white">
                      {note.title || note.topic}
                    </h3>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                      TOPIC · {note.topic}
                    </div>
                  </div>

                  <Badge variant="gold" size="sm">
                    {note.difficulty || 'HERO'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 font-outfit mb-3 leading-relaxed">
                  {note.summary}
                </p>

                {/* Bullet Points */}
                {note.bulletPoints && (
                  <ul className="space-y-1.5 mb-4 text-[11px] text-slate-400 font-outfit">
                    {note.bulletPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* S.A.T.U.R.D.A.Y. Exam Alert Callout */}
                {note.examAlert && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-rajdhani font-semibold leading-relaxed mb-4">
                    <div className="flex items-center gap-1.5 text-amber-400 font-orbitron font-bold text-[10px] uppercase mb-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>S.A.T.U.R.D.A.Y. EXAM ALERT</span>
                    </div>
                    {note.examAlert}
                  </div>
                )}
              </div>

              {/* Card Footer Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {note.createdDate || 'Archived'}
                </span>

                <div className="flex items-center gap-2">
                  <ExportDropdown
                    size="sm"
                    variant="tactical"
                    label="Export"
                    options={[
                      { label: 'PDF Dossier', format: 'pdf', ext: '.pdf', icon: FileText },
                      { label: 'Plain Text', format: 'txt', ext: '.txt', icon: FileCode }
                    ]}
                    onExport={(format) => notesService.exportNote(note.id, format, note)}
                  />

                  <button
                    onClick={() => navigate('/battle-arena', { state: { topic: note.topic } })}
                    title="Launch battle on this topic"
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setPendingDelete(note)}
                    title="Delete note"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </HolographicCard>
          ))}
        </div>
      )}

      {/* Confirm dialog: delete removes the note permanently */}
      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Confirm: Delete Note"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-slate-300 font-outfit">
          Delete this study note from your Knowledge Vault?{' '}
          <span className="text-white font-semibold">"{pendingDelete?.title || pendingDelete?.topic}"</span>
        </p>
        <p className="text-xs text-slate-500 font-outfit mt-2">
          It will be removed permanently and will not reappear after a refresh or re-login.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setPendingDelete(null)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-rajdhani font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
          <EnergyButton onClick={handleDelete} variant="primary" size="md" icon={CheckCircle2}>
            Confirm & Delete
          </EnergyButton>
        </div>
      </Modal>
    </div>
  );
};
