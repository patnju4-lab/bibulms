import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Bulletin, BulletinCategory, BulletinPriority, BulletinStatus } from '../../../types';
import { BulletinDetailModal } from '../../public/BulletinDetailModal';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Paperclip,
  Download,
  Calendar,
  Layers,
  Settings,
  Sparkles,
  ShieldCheck,
  X,
  ChevronDown,
  History,
  Send,
  Building
} from 'lucide-react';

export const BulletinsManagementTab: React.FC = () => {
  const {
    bulletins,
    bulletinCategories,
    bulletinDepartments,
    createBulletin,
    updateBulletin,
    approveBulletin,
    publishBulletin,
    unpublishBulletin,
    archiveBulletin,
    duplicateBulletin,
    deleteBulletin,
    addBulletinCategory,
    addBulletinDepartment,
    currentUser,
    universityInfo
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  // Modals
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingBulletin, setEditingBulletin] = useState<Bulletin | null>(null);
  const [previewBulletin, setPreviewBulletin] = useState<Bulletin | null>(null);
  const [auditModalBulletin, setAuditModalBulletin] = useState<Bulletin | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // New Category / Dept Inline Inputs
  const [newCatInput, setNewCatInput] = useState('');
  const [newDeptInput, setNewDeptInput] = useState('');

  // Form State for Composer
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    category: BulletinCategory;
    department: string;
    priority: BulletinPriority;
    targetAudience: Bulletin['targetAudience'];
    status: BulletinStatus;
    publishDate: string;
    scheduledDate: string;
    expiryDate: string;
    featuredImage: string;
    summary: string;
    content: string;
    importantDates: { label: string; date: string; description?: string }[];
    instructions: string[];
    attachments: { name: string; size: string; type: string; url?: string }[];
    eventEnabled: boolean;
    eventDetails: {
      title: string;
      date: string;
      time: string;
      location: string;
      isOnline: boolean;
      registrationUrl?: string;
      contactEmail?: string;
      contactPhone?: string;
    };
    signatoryName: string;
    signatoryTitle: string;
    signatorySignature: string;
  }>({
    title: '',
    subtitle: '',
    category: 'University News',
    department: "Registrar's Office",
    priority: 'Normal',
    targetAudience: 'Everyone',
    status: 'Published',
    publishDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    scheduledDate: '',
    expiryDate: '',
    featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    content: '',
    importantDates: [],
    instructions: [],
    attachments: [],
    eventEnabled: false,
    eventDetails: {
      title: '',
      date: '',
      time: '',
      location: '',
      isOnline: true,
      registrationUrl: '',
      contactEmail: 'events@bibu-edu.org',
      contactPhone: '+1 (602) 845-9200'
    },
    signatoryName: universityInfo.registrar || 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    signatoryTitle: 'University Academic Registrar',
    signatorySignature: 'S. M. Jenkins, Th.D.'
  });

  // Open Composer in Create Mode
  const handleOpenCreate = () => {
    setEditingBulletin(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'University News',
      department: "Registrar's Office",
      priority: 'Normal',
      targetAudience: 'Everyone',
      status: 'Published',
      publishDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      scheduledDate: '',
      expiryDate: '',
      featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      summary: '',
      content: '### 1. General Executive Statement\n\nThe University Senate and Office of the Academic Registrar hereby issue this official bulletin for immediate circulation.\n\n### 2. Academic & Administrative Scope\n\n* **Compliance Period**: Immediate effect for the 2026/2027 Academic Session.\n* **Designated Body**: All biblical faculties, degree cohorts, and research fellows.\n\n### 3. Procedural Guidelines\n\nAll registered students and ministerial candidates must verify their course enrollment and ensure compliance with university standards.',
      importantDates: [
        { label: 'Effective Commencement', date: 'September 1, 2026', description: 'Mandatory start date' }
      ],
      instructions: [
        'Review the full bulletin text and download associated PDF attachments.',
        'Contact your academic advisor for departmental clarification.'
      ],
      attachments: [
        { name: 'Official_Senate_Gazette_Directive.pdf', size: '1.4 MB', type: 'PDF' }
      ],
      eventEnabled: false,
      eventDetails: {
        title: '',
        date: '',
        time: '',
        location: '',
        isOnline: true,
        registrationUrl: '',
        contactEmail: 'events@bibu-edu.org',
        contactPhone: '+1 (602) 845-9200'
      },
      signatoryName: universityInfo.registrar || 'Rev. Dr. Sarah M. Jenkins, Th.D.',
      signatoryTitle: 'University Academic Registrar',
      signatorySignature: 'S. M. Jenkins, Th.D.'
    });
    setComposerOpen(true);
  };

  // Open Composer in Edit Mode
  const handleOpenEdit = (bulletin: Bulletin) => {
    setEditingBulletin(bulletin);
    setFormData({
      title: bulletin.title,
      subtitle: bulletin.subtitle || '',
      category: bulletin.category,
      department: bulletin.department,
      priority: bulletin.priority,
      targetAudience: bulletin.targetAudience,
      status: bulletin.status,
      publishDate: bulletin.publishDate,
      scheduledDate: bulletin.scheduledDate || '',
      expiryDate: bulletin.expiryDate || '',
      featuredImage: bulletin.featuredImage || '',
      summary: bulletin.summary,
      content: bulletin.content,
      importantDates: bulletin.importantDates || [],
      instructions: bulletin.instructions || [],
      attachments: bulletin.attachments || [],
      eventEnabled: !!bulletin.eventDetails,
      eventDetails: bulletin.eventDetails || {
        title: '',
        date: '',
        time: '',
        location: '',
        isOnline: true,
        registrationUrl: '',
        contactEmail: 'events@bibu-edu.org',
        contactPhone: '+1 (602) 845-9200'
      },
      signatoryName: bulletin.authorizedSignatory?.name || 'Rev. Dr. Sarah M. Jenkins, Th.D.',
      signatoryTitle: bulletin.authorizedSignatory?.title || 'University Academic Registrar',
      signatorySignature: bulletin.authorizedSignatory?.signatureText || 'S. M. Jenkins, Th.D.'
    });
    setComposerOpen(true);
  };

  // Save Composer Form
  const handleSaveBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please provide an official bulletin title.');
      return;
    }

    const payload: Partial<Bulletin> = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category,
      department: formData.department,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      status: formData.status,
      publishDate: formData.publishDate,
      scheduledDate: formData.scheduledDate || undefined,
      expiryDate: formData.expiryDate || undefined,
      featuredImage: formData.featuredImage.trim() || undefined,
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      importantDates: formData.importantDates,
      instructions: formData.instructions,
      attachments: formData.attachments,
      eventDetails: formData.eventEnabled && formData.eventDetails.title.trim() ? formData.eventDetails : undefined,
      authorizedSignatory: {
        name: formData.signatoryName,
        title: formData.signatoryTitle,
        signatureText: formData.signatorySignature
      }
    };

    if (editingBulletin) {
      updateBulletin(editingBulletin.id, payload);
    } else {
      createBulletin(payload);
    }

    setComposerOpen(false);
  };

  // Add Date Row
  const handleAddDateRow = () => {
    setFormData(prev => ({
      ...prev,
      importantDates: [...prev.importantDates, { label: 'New Milestone', date: 'TBD', description: '' }]
    }));
  };

  const handleRemoveDateRow = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      importantDates: prev.importantDates.filter((_, i) => i !== idx)
    }));
  };

  // Add Instruction Step
  const handleAddInstructionStep = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, 'Step description here']
    }));
  };

  const handleRemoveInstructionStep = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== idx)
    }));
  };

  // Add Attachment Row
  const handleAddAttachment = () => {
    const name = prompt('Enter PDF Document Name:', 'Academic_Circular_Directive.pdf');
    if (!name) return;
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name, size: '1.2 MB', type: 'PDF' }]
    }));
  };

  const handleRemoveAttachment = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx)
    }));
  };

  // Filtering
  const filteredBulletins = bulletins.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (filterCategory !== 'All' && b.category !== filterCategory) return false;
    if (filterPriority !== 'All' && b.priority !== filterPriority) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.bulletinNumber.toLowerCase().includes(q) ||
        b.verificationCode.toLowerCase().includes(q) ||
        b.department.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Metrics
  const totalPublished = bulletins.filter(b => b.status === 'Published').length;
  const totalDrafts = bulletins.filter(b => b.status === 'Draft').length;
  const totalArchived = bulletins.filter(b => b.status === 'Archived').length;
  const totalViews = bulletins.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalDownloads = bulletins.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-[#002366] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C5A059]" />
            <span>University Bulletins & Gazette CMS</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish official decrees, academic notices, registrar circulars, and manage verification codes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#002366] text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Categories & Depts</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001438] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Compose Gazette Notice</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Published</div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{totalPublished}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Drafts / In Review</div>
          <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">{totalDrafts}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Archived</div>
          <div className="text-2xl font-black text-slate-600 font-mono mt-0.5">{totalArchived}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Total Gazette Views</div>
          <div className="text-2xl font-black text-[#002366] font-mono mt-0.5">{totalViews}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Downloads</div>
          <div className="text-2xl font-black text-[#C5A059] font-mono mt-0.5">{totalDownloads}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, number, code, dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium text-slate-700"
          >
            <option value="All">All Categories</option>
            {bulletinCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Bulletins Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#002366] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3.5">Bulletin / Verification</th>
                <th className="p-3.5">Title & Category</th>
                <th className="p-3.5">Audience & Dept</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Stats</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBulletins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No bulletins found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBulletins.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Number & Code */}
                    <td className="p-3.5 align-top">
                      <div className="font-mono font-bold text-[#002366] text-[11px]">{b.bulletinNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{b.verificationCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{b.publishDate}</div>
                    </td>

                    {/* Title & Category */}
                    <td className="p-3.5 align-top max-w-xs">
                      <div className="font-bold text-slate-900 text-xs line-clamp-1">{b.title}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{b.summary}</div>
                      <div className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#002366]">
                        {b.category}
                      </div>
                    </td>

                    {/* Audience & Dept */}
                    <td className="p-3.5 align-top">
                      <div className="text-slate-800 font-medium text-xs">{b.department}</div>
                      <div className="text-[10px] text-slate-500">For: <strong className="text-slate-700">{b.targetAudience}</strong></div>
                    </td>

                    {/* Priority */}
                    <td className="p-3.5 align-top">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        b.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                        b.priority === 'Urgent' ? 'bg-amber-100 text-amber-900' :
                        b.priority === 'Important' ? 'bg-blue-100 text-[#002366]' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {b.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 align-top">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        b.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                        b.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="p-3.5 align-top text-[10px] text-slate-500 font-mono">
                      <div>Views: <strong className="text-slate-800">{b.viewsCount}</strong></div>
                      <div>DLs: <strong className="text-slate-800">{b.downloadsCount}</strong></div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewBulletin(b)}
                          title="Preview Gazette"
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Bulletin"
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Publish / Unpublish */}
                        {b.status === 'Published' ? (
                          <button
                            onClick={() => unpublishBulletin(b.id)}
                            title="Unpublish to Draft"
                            className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-700 transition-colors"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => publishBulletin(b.id)}
                            title="Publish Immediately"
                            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          onClick={() => duplicateBulletin(b.id)}
                          title="Duplicate Bulletin"
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Audit Logs */}
                        <button
                          onClick={() => setAuditModalBulletin(b)}
                          title="View Audit Trail"
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete bulletin "${b.bulletinNumber}: ${b.title}"?`)) {
                              deleteBulletin(b.id);
                            }
                          }}
                          title="Delete Bulletin"
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RICH BULLETIN COMPOSER MODAL */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in">
            
            {/* Composer Header */}
            <div className="bg-[#002366] text-white px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
              <div>
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C5A059]" />
                  <span>{editingBulletin ? 'Edit University Gazette Bulletin' : 'Compose New Official Bulletin'}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Fill in decree content, verification tags, target audience, and authorized signatories.
                </p>
              </div>
              <button
                onClick={() => setComposerOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Composer Form Body */}
            <form onSubmit={handleSaveBulletin} className="overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
              
              {/* Row 1: Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Bulletin Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026/2027 Academic Session Convocation & Matriculation Schedule"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gazette Subtitle / Header Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Executive directive on student residency, physical capstone assembly, and live stream channels"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>
              </div>

              {/* Row 2: Category, Department, Priority, Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as BulletinCategory })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-[#002366]"
                  >
                    {bulletinCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Issuing Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    {bulletinDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as BulletinPriority })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Students">Students</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Administrators">Administrators</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Prospective Students">Prospective Students</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Status, Publish Date, Featured Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BulletinStatus })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="Published">Published (Live in Gazette)</option>
                    <option value="Draft">Draft (Internal Review)</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Featured Banner Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Executive Summary / Notice Overview *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise summary that appears in bulletin previews and student feeds..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              {/* Structured Rich Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Gazette Content & Decree Text (Markdown Supported) *
                  </label>
                  <span className="text-[10px] text-slate-400">Use ### for headings, * for bullets, **bold** for emphasis</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              {/* Important Dates Manager */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#002366] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span>Important Deadlines & Academic Milestones</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddDateRow}
                    className="px-2.5 py-1 rounded bg-[#002366] text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Date Row
                  </button>
                </div>

                {formData.importantDates.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      placeholder="Label (e.g. Exam Start)"
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...formData.importantDates];
                        updated[idx].label = e.target.value;
                        setFormData({ ...formData, importantDates: updated });
                      }}
                      className="w-1/3 p-1.5 rounded border border-slate-200 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g. Nov 15, 2026)"
                      value={item.date}
                      onChange={(e) => {
                        const updated = [...formData.importantDates];
                        updated[idx].date = e.target.value;
                        setFormData({ ...formData, importantDates: updated });
                      }}
                      className="w-1/3 p-1.5 rounded border border-slate-200 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description || ''}
                      onChange={(e) => {
                        const updated = [...formData.importantDates];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, importantDates: updated });
                      }}
                      className="flex-1 p-1.5 rounded border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDateRow(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Instructions / Compliance Action Steps */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#002366] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Step-by-Step Action Instructions</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddInstructionStep}
                    className="px-2.5 py-1 rounded bg-[#002366] text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Step
                  </button>
                </div>

                {formData.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const updated = [...formData.instructions];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, instructions: updated });
                      }}
                      className="flex-1 p-1.5 rounded border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInstructionStep(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Attachments Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#002366] flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-[#C5A059]" />
                    <span>Official PDF Documents & Circular Attachments</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-2.5 py-1 rounded bg-[#002366] text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add PDF Attachment
                  </button>
                </div>

                {formData.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">PDF</span>
                      <span className="font-bold text-slate-800">{att.name}</span>
                      <span className="text-slate-400">({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Signatory Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Authorized Signatory Name
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryName}
                    onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Official Signatory Title
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryTitle}
                    onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Digital Signature Text
                  </label>
                  <input
                    type="text"
                    value={formData.signatorySignature}
                    onChange={(e) => setFormData({ ...formData, signatorySignature: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-serif italic"
                  />
                </div>
              </div>

              {/* Submit / Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001438] text-white font-black uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#C5A059]" />
                    <span>{editingBulletin ? 'Update & Record in Gazette' : 'Authorize & Publish Bulletin'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CATEGORIES & DEPARTMENTS MANAGER MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="bg-[#002366] text-white p-4 flex items-center justify-between">
              <h4 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#C5A059]" />
                <span>Bulletin Categories & Departments Manager</span>
              </h4>
              <button onClick={() => setCategoryModalOpen(false)} className="p-1 rounded bg-white/10 hover:bg-rose-600 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-800">
              {/* Categories */}
              <div className="space-y-2">
                <div className="font-bold uppercase text-[#002366] text-xs">Categories ({bulletinCategories.length})</div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {bulletinCategories.map(cat => (
                    <span key={cat} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold">
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="New Category Name..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCatInput.trim()) {
                        addBulletinCategory(newCatInput.trim());
                        setNewCatInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Departments */}
              <div className="space-y-2">
                <div className="font-bold uppercase text-[#002366] text-xs">Departments ({bulletinDepartments.length})</div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {bulletinDepartments.map(dept => (
                    <span key={dept} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold">
                      {dept}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="New Department..."
                    value={newDeptInput}
                    onChange={(e) => setNewDeptInput(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDeptInput.trim()) {
                        addBulletinDepartment(newDeptInput.trim());
                        setNewDeptInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold"
                  >
                    Add Department
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG MODAL */}
      {auditModalBulletin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="bg-[#002366] text-white p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#C5A059]" />
                  <span>Audit Trail: {auditModalBulletin.bulletinNumber}</span>
                </h4>
                <div className="text-[11px] text-slate-300 truncate max-w-xs">{auditModalBulletin.title}</div>
              </div>
              <button onClick={() => setAuditModalBulletin(null)} className="p-1 rounded bg-white/10 hover:bg-rose-600 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {auditModalBulletin.auditLogs && auditModalBulletin.auditLogs.length > 0 ? (
                <div className="space-y-3">
                  {auditModalBulletin.auditLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#002366] uppercase text-[10px] bg-[#C5A059]/20 text-[#002366] px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                      <div className="text-slate-800 font-medium">
                        By: <strong>{log.user}</strong> ({log.userRole || 'Admin'})
                      </div>
                      {log.notes && <div className="text-slate-600 text-[11px] italic">{log.notes}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 text-xs py-4">No audit logs recorded yet.</div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setAuditModalBulletin(null)}
                className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewBulletin && (
        <BulletinDetailModal
          bulletin={previewBulletin}
          onClose={() => setPreviewBulletin(null)}
        />
      )}

    </div>
  );
};
