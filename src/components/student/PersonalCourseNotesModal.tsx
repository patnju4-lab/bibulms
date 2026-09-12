import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Trash2,
  X,
  Lock,
  Calendar,
  Sparkles,
  Check,
  StickyNote
} from 'lucide-react';

export interface StudentCourseNote {
  courseCode: string;
  courseTitle: string;
  semester: string;
  noteText: string;
  category?: 'Exegesis' | 'Ministry Reflection' | 'Textbooks & Resources' | 'Graduation Requirement' | 'General';
  updatedAt: string;
}

interface PersonalCourseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    code: string;
    title: string;
    semester: string;
    grade?: string;
    credits?: number;
    instructor?: string;
  } | null;
  existingNote?: StudentCourseNote | null;
  onSaveNote: (note: StudentCourseNote) => void;
  onDeleteNote: (courseCode: string) => void;
}

const CATEGORIES: ('Exegesis' | 'Ministry Reflection' | 'Textbooks & Resources' | 'Graduation Requirement' | 'General')[] = [
  'General',
  'Exegesis',
  'Ministry Reflection',
  'Textbooks & Resources',
  'Graduation Requirement'
];

export const PersonalCourseNotesModal: React.FC<PersonalCourseNotesModalProps> = ({
  isOpen,
  onClose,
  course,
  existingNote,
  onSaveNote,
  onDeleteNote
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'Exegesis' | 'Ministry Reflection' | 'Textbooks & Resources' | 'Graduation Requirement' | 'General'>('General');
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (course) {
      if (existingNote) {
        setText(existingNote.noteText);
        setCategory(existingNote.category || 'General');
      } else {
        setText('');
        setCategory('General');
      }
    }
  }, [course, existingNote, isOpen]);

  if (!isOpen || !course) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNote: StudentCourseNote = {
      courseCode: course.code,
      courseTitle: course.title,
      semester: course.semester,
      noteText: text.trim(),
      category,
      updatedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    onSaveNote(updatedNote);
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    onDeleteNote(course.code);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#002366]/10 text-[#002366] flex items-center justify-center font-bold">
              <StickyNote className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Personal Course Notes & Reflections
                </h3>
                <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  <Lock className="w-2.5 h-2.5" />
                  Private • Student Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved locally on your device for personal study, sermon prep, or degree audit.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Course Overview Strip */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-mono font-bold text-[#002366]">{course.code}</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="font-semibold text-slate-800">{course.title}</span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {course.semester} • {course.credits || 3} Credit Hours • Grade: <strong className="text-slate-800">{course.grade || 'A'}</strong>
              {course.instructor && ` • ${course.instructor}`}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Note Category
              </label>
              {existingNote?.updatedAt && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Last updated: {existingNote.updatedAt}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    category === cat
                      ? 'bg-[#002366] text-white border-[#002366] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Private Note / Key Learnings / Ministry Applications
            </label>
            <textarea
              required
              rows={5}
              placeholder="e.g. Mastered Hebrew prefix verbal paradigms; recommended bibliography for doctoral thesis: Dr. Wright's commentary on Romans 8; useful sermon illustrations for pastoral practicum..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-1 focus:ring-[#002366] focus:border-[#002366] leading-relaxed resize-y placeholder:text-slate-400"
            />
          </div>

          <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2 text-[11px] text-blue-900">
            <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>
              Private notes never appear on official signed transcripts or employer-verified PDF copies.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {existingNote ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Note</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!text.trim()}
                className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
