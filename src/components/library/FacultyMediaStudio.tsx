import React, { useState } from 'react';
import {
  Video,
  Headphones,
  BookOpen,
  FileText,
  Upload,
  Plus,
  Layers,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Check,
  FolderPlus,
  Trash2
} from 'lucide-react';
import { LibraryResource, MediaLicenseType } from '../../types';

interface FacultyMediaStudioProps {
  resources: LibraryResource[];
  onAddResource?: (newResource: Partial<LibraryResource>) => void;
}

interface AtRiskStudentAlert {
  id: string;
  studentName: string;
  studentId: string;
  courseCode: string;
  courseTitle: string;
  missingResourceTitle: string;
  resourceFormat: 'Video' | 'Audio' | 'E-Book' | 'Research Paper';
  daysInactive: number;
  lastReminderSent?: string;
}

export const FacultyMediaStudio: React.FC<FacultyMediaStudioProps> = ({
  resources,
  onAddResource
}) => {
  const [activeTab, setActiveTab] = useState<'create_course' | 'upload_media' | 'at_risk_alerts' | 'my_uploads'>('create_course');
  
  // Media creation form state
  const [mediaTitle, setMediaTitle] = useState('');
  const [authorName, setAuthorName] = useState('Dr. Thomas E. Wright, Ph.D.');
  const [targetCourse, setTargetCourse] = useState('THE-201');
  const [formatType, setFormatType] = useState<'Video Course' | 'Audio Course' | 'Video Book' | 'Audio Book' | 'PDF'>('Video Course');
  const [academicLevel, setAcademicLevel] = useState<'Bachelor' | 'Master' | 'Doctorate'>('Master');
  const [licenseType, setLicenseType] = useState<MediaLicenseType>('Faculty-created');
  const [scriptureRefs, setScriptureRefs] = useState('Romans 8:1-17, Galatians 5:16-26');
  const [description, setDescription] = useState('');
  const [modulesCount, setModulesCount] = useState(3);
  const [lessonsPerModule, setLessonsPerModule] = useState(4);
  const [completionThreshold, setCompletionThreshold] = useState(90);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // At-Risk Learner Alerts
  const [atRiskAlerts, setAtRiskAlerts] = useState<AtRiskStudentAlert[]>([
    {
      id: 'alert-1',
      studentName: 'Gabriel Mwangi',
      studentId: 'BIBU-STU-2026-088',
      courseCode: 'HER-301',
      courseTitle: 'Biblical Hermeneutics & Exegetical Method',
      missingResourceTitle: 'Lesson 3: Greek Syntactic Clause Analysis',
      resourceFormat: 'Video',
      daysInactive: 16
    },
    {
      id: 'alert-2',
      studentName: 'Sarah Jenkins',
      studentId: 'BIBU-STU-2026-042',
      courseCode: 'THE-201',
      courseTitle: 'Systematic Theology I: Doctrine of God',
      missingResourceTitle: 'Systematic Theology Audio Chapter 2',
      resourceFormat: 'Audio',
      daysInactive: 14
    },
    {
      id: 'alert-3',
      studentName: 'Emmanuel Adebayo',
      studentId: 'BIBU-STU-2026-115',
      courseCode: 'PAS-401',
      courseTitle: 'Pastoral Ministry & Expository Homiletics',
      missingResourceTitle: 'Pastoral Protocol: Bereavement Liturgy SOP',
      resourceFormat: 'E-Book',
      daysInactive: 18
    }
  ]);

  const [reminderStatus, setReminderStatus] = useState<Record<string, boolean>>({});

  const handleSendReminder = (alertId: string) => {
    setReminderStatus((prev) => ({ ...prev, [alertId]: true }));
    setTimeout(() => {
      setAtRiskAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, lastReminderSent: 'Just now' } : a))
      );
    }, 1200);
  };

  const handleCreateMediaCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;

    if (onAddResource) {
      onAddResource({
        id: `lib-fac-${Date.now()}`,
        title: mediaTitle.trim(),
        author: authorName.trim(),
        publisher: 'BIBU Faculty Media Studio (Phoenix, AZ)',
        category: 'Theology',
        format: formatType as any,
        pagesOrDuration: formatType.includes('Course') ? `${modulesCount} Modules (${modulesCount * lessonsPerModule} Lessons)` : '45 mins',
        year: 2026,
        academicLevel,
        description: description.trim() || 'Comprehensive faculty media presentation for student theological preparation.',
        assignedCourseCodes: [targetCourse],
        licenseClassification: licenseType,
        licenseType: 'BIBU Institutional License',
        coverColor: 'bg-[#002366]',
        peerReviewed: true,
        isFeatured: true,
        completionThresholdPercent: completionThreshold,
        scriptureReferences: scriptureRefs.split(',').map((s) => s.trim()).filter(Boolean)
      });
    }

    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setMediaTitle('');
      setDescription('');
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* HEADER BANNER */}
      <div className="bg-[#001845] text-white rounded-2xl p-6 border-2 border-[#C5A059]/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#001438] text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C5A059]/40">
              Faculty Media Studio & Course Builder
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Professor Multimedia Publishing Desk
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Design video courses, record audio lectures, author peer-reviewed study monographs, and monitor student multimedia engagement and at-risk reading alerts.
          </p>
        </div>

        {/* AT-RISK BADGE */}
        <div className="flex items-center gap-3 bg-rose-950/60 border border-rose-600/40 p-3 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
          <div>
            <div className="text-[10px] font-mono text-rose-300 uppercase font-bold">At-Risk Alerts</div>
            <div className="text-xs font-bold text-white">
              {atRiskAlerts.length} students inactive &gt;14 days
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('create_course')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'create_course'
              ? 'bg-[#002366] text-[#C5A059] shadow-xs'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create Multimedia Course</span>
        </button>

        <button
          onClick={() => setActiveTab('at_risk_alerts')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'at_risk_alerts'
              ? 'bg-[#002366] text-[#C5A059] shadow-xs'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>At-Risk Learner Alerts ({atRiskAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload_media')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'upload_media'
              ? 'bg-[#002366] text-[#C5A059] shadow-xs'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Audio/Video Master</span>
        </button>
      </div>

      {/* TAB 1: CREATE MULTIMEDIA COURSE */}
      {activeTab === 'create_course' && (
        <form onSubmit={handleCreateMediaCourse} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold font-serif text-[#002366]">
              1. Course & Module Structure Builder
            </h3>
            <p className="text-xs text-slate-500">
              Structure learning resources hierarchically: Course → Modules → Lessons → Transcripts & Reading Material.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Course / Resource Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Masterclass: Pauline Soteriology and Greek Exegesis"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Lead Professor / Faculty Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Target Format
              </label>
              <select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none bg-white"
              >
                <option value="Video Course">🎥 Video Course (Multi-Module)</option>
                <option value="Audio Course">🎧 Audio Course (Multi-Lesson)</option>
                <option value="Video Book">🎥 Video Book (Slides & Narration)</option>
                <option value="Audio Book">🎧 Audio Book (Chaptered)</option>
                <option value="PDF">📚 E-Book Monograph / Treatise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Linked Course Code
              </label>
              <select
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none bg-white"
              >
                <option value="THE-201">THE-201: Systematic Theology I</option>
                <option value="HER-301">HER-301: Biblical Hermeneutics</option>
                <option value="PAS-401">PAS-401: Pastoral Ministry & Homiletics</option>
                <option value="GRK-101">GRK-101: Biblical Greek Grammar</option>
                <option value="HEB-101">HEB-101: Classical Hebrew Syntax</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Scripture Cross-References (Comma Separated)
              </label>
              <input
                type="text"
                value={scriptureRefs}
                onChange={(e) => setScriptureRefs(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mandatory Completion Threshold
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={completionThreshold}
                  onChange={(e) => setCompletionThreshold(parseInt(e.target.value, 10))}
                  className="w-full accent-[#002366] cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#002366] whitespace-nowrap">
                  {completionThreshold}% Required
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Course Abstract & Theological Description
            </label>
            <textarea
              rows={3}
              placeholder="Outline the pedagogical objectives, exegetical methodology, and required competencies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {createdSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Course successfully published to the BIBU Multimedia Library!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Publish Course to Library Catalog</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: AT-RISK LEARNER ALERTS */}
      {activeTab === 'at_risk_alerts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-serif text-[#002366] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                At-Risk Student Engagement Monitor
              </h3>
              <p className="text-xs text-slate-500">
                Automated alerts triggered when enrolled students have not accessed required multimedia course materials for 14+ consecutive days.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {atRiskAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono font-bold text-[10px] uppercase">
                      ⚠️ {alert.daysInactive} Days Inactive
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">{alert.courseCode}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#002366]">
                    {alert.studentName} <span className="text-xs font-normal text-slate-500">({alert.studentId})</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Has not opened required {alert.resourceFormat}: <strong className="text-slate-800">{alert.missingResourceTitle}</strong>
                  </p>
                  {alert.lastReminderSent && (
                    <div className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Reminder dispatched ({alert.lastReminderSent})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSendReminder(alert.id)}
                  disabled={reminderStatus[alert.id]}
                  className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] disabled:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>
                    {reminderStatus[alert.id] ? 'Reminder Dispatched' : 'Send Academic Nudge'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UPLOAD MEDIA FILE */}
      {activeTab === 'upload_media' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold font-serif text-[#002366]">
              2. Faculty Media File Ingestion
            </h3>
            <p className="text-xs text-slate-500">
              Upload web-compatible video (MP4, WebM), audio (MP3, M4A, WAV), transcripts (VTT, SRT, JSON), or e-book manuscripts (PDF, EPUB).
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3 hover:border-[#C5A059] transition-colors cursor-pointer bg-slate-50">
            <Upload className="w-10 h-10 mx-auto text-[#002366]" />
            <div className="text-sm font-bold text-slate-800">
              Drag & Drop Master Video / Audio / PDF files here
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Supports MP4, WebM, MP3, WAV, PDF. Maximum single lecture file size: 2.5 GB.
            </p>
            <button className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold hover:bg-[#001845] transition-colors cursor-pointer">
              Browse Local Files
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
