import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  Share2,
  Bookmark,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  X,
  FileText,
  HelpCircle,
  Copy
} from 'lucide-react';
import { BiblicalWordEntry } from '../../types';
import { BIBLICAL_WORD_STUDIES } from '../../data/theologicalLibraryData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialStrongs?: string;
  onSelectPassage?: (verse: string) => void;
}

export const BiblicalWordStudyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialStrongs,
  onSelectPassage
}) => {
  const [searchQuery, setSearchQuery] = useState(initialStrongs || '');
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | 'Greek' | 'Hebrew'>('All');
  const [selectedWord, setSelectedWord] = useState<BiblicalWordEntry>(
    BIBLICAL_WORD_STUDIES.find((w) => w.strongsNumber === initialStrongs) || BIBLICAL_WORD_STUDIES[0]
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredWords = BIBLICAL_WORD_STUDIES.filter((w) => {
    if (selectedLanguage !== 'All' && w.language !== selectedLanguage) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.strongsNumber.toLowerCase().includes(q) ||
      w.transliteration.toLowerCase().includes(q) ||
      w.originalWord.includes(q) ||
      w.shortDefinition.toLowerCase().includes(q) ||
      w.theologicalSignificance.toLowerCase().includes(q)
    );
  });

  const handleCopyCitation = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#002366]/30 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#002366] text-white p-4 sm:p-6 flex items-center justify-between shrink-0 border-b-2 border-[#C5A059]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001A4D] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-bold shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#001438] text-[#C5A059] border border-[#C5A059]/30">
                  Biblical Languages Research Portal
                </span>
                <span className="text-[10px] text-slate-300 hidden sm:inline font-mono">
                  Strong's Greek & Hebrew Exegetical Lexicon
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black font-serif text-white tracking-tight mt-0.5">
                Biblical Word Study & Morphological Analysis
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Word Study"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Main Body: Two-Column Exegetical Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Word Search & Lexicon List */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
            
            {/* Search and Language Filter */}
            <div className="p-3 sm:p-4 border-b border-slate-200 space-y-2.5 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Strong's (G26, H7307) or English..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-slate-50/70"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['All', 'Greek', 'Hebrew'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLanguage === lang
                        ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Lexical Entries */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredWords.length > 0 ? (
                filteredWords.map((entry) => {
                  const isSelected = selectedWord.id === entry.id;
                  return (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedWord(entry)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#002366] text-white border-[#002366] shadow-sm'
                          : 'bg-white hover:bg-slate-100/80 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-[#C5A059]' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {entry.strongsNumber} • {entry.language}
                        </span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {entry.occurrenceCount}x NT/OT
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className={`text-base font-serif font-bold ${isSelected ? 'text-[#C5A059]' : 'text-[#002366]'}`}>
                          {entry.originalWord}
                        </span>
                        <span className={`text-xs italic font-medium ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                          ({entry.transliteration})
                        </span>
                      </div>

                      <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {entry.shortDefinition}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No lexical entries matched your search.
                </div>
              )}
            </div>

            {/* Quick Helper Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{filteredWords.length} lexicon entries</span>
              <span className="text-[#002366] font-bold">BIBU Linguistics</span>
            </div>
          </div>

          {/* Right Column: Detailed Exegetical Exposition */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">
            
            {/* Header / Term Highlight Card */}
            <div className="bg-gradient-to-br from-[#002366]/5 via-white to-amber-50/40 p-5 rounded-2xl border-2 border-[#002366]/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#002366] text-[#C5A059] font-mono font-bold text-xs">
                    Strong's {selectedWord.strongsNumber}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                    {selectedWord.language} • {selectedWord.testament}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {selectedWord.partOfSpeech}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyCitation(`${selectedWord.originalWord} (${selectedWord.transliteration}, Strong's ${selectedWord.strongsNumber}): ${selectedWord.shortDefinition}`, 'head')}
                  className="text-xs text-[#002366] hover:text-[#C5A059] font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'head' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'head' ? 'Copied' : 'Copy Lemma'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#002366]">
                    {selectedWord.originalWord}
                  </h3>
                  <div className="text-sm font-semibold text-[#C5A059] italic mt-0.5">
                    Transliteration: <strong className="text-slate-800 not-italic font-mono">{selectedWord.transliteration}</strong> • Pronunciation: <span className="text-slate-600 font-mono">[{selectedWord.pronunciation}]</span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Canonical Frequency</div>
                  <div className="text-2xl font-black font-serif text-[#002366]">{selectedWord.occurrenceCount} <span className="text-xs font-normal text-slate-500">occurrences</span></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Lexical Definition</div>
                <div className="text-sm font-bold text-slate-800">
                  {selectedWord.shortDefinition}
                </div>
                {selectedWord.rootWord && (
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    Root Etymology: <strong>{selectedWord.rootWord}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Theological Significance & Exegesis */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002366] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Theological Significance & Redemptive Meaning</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {selectedWord.theologicalSignificance}
              </div>
            </div>

            {/* Key Scripture Passages */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-[#002366] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Key Canonical Passages ({selectedWord.keyPassages.length})</span>
                </span>
                <span className="text-slate-400 font-normal text-[11px]">Click passage to search commentaries</span>
              </div>

              <div className="space-y-2.5">
                {selectedWord.keyPassages.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#002366] transition-all space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#002366] font-serif group-hover:text-[#C5A059] transition-colors flex items-center gap-1">
                        <span>{p.verse}</span>
                        {onSelectPassage && (
                          <button
                            onClick={() => onSelectPassage(p.verse)}
                            className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                          >
                            Explore Passage
                          </button>
                        )}
                      </span>
                      <button
                        onClick={() => handleCopyCitation(`${p.verse}: "${p.excerpt}" — ${p.context}`, `v-${idx}`)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
                      >
                        {copiedKey === `v-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === `v-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="font-serif text-sm font-semibold text-[#002366] bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {p.excerpt}
                    </div>

                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-800">Exegetical Context:</strong> {p.context}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Nuances & Related Strong's Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Semantic Nuances</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {selectedWord.semanticNuances.map((nuance, i) => (
                    <li key={i} className="leading-snug">{nuance}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Related Strong's References</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWord.relatedStrongs.map((rel) => (
                    <button
                      key={rel}
                      onClick={() => {
                        const sNum = rel.split(' ')[0];
                        const found = BIBLICAL_WORD_STUDIES.find((w) => w.strongsNumber === sNum);
                        if (found) setSelectedWord(found);
                      }}
                      className="px-2 py-1 rounded bg-white hover:bg-[#002366] hover:text-[#C5A059] border border-slate-300 text-xs font-mono font-bold transition-colors"
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Scholarly & Patristic Note */}
            <div className="p-4 bg-[#002366]/5 rounded-xl border border-[#002366]/20 space-y-1">
              <div className="text-[11px] font-bold text-[#002366] uppercase tracking-wider">
                Scholarly Academic Annotation
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
                "{selectedWord.scholarlyNotes}"
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px]">
            BIBU Digital Theological Library • Biblical Languages Research Desk
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#002366] text-[#C5A059] hover:bg-[#001A4D] font-bold transition-colors shadow-xs"
          >
            Close Word Study
          </button>
        </div>

      </div>
    </div>
  );
};
