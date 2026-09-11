import React, { useState } from 'react';
import { Lock, Key, Copy, Check, ExternalLink, ShieldAlert, Clock, Eye, Trash2, X, Share2, Building2 } from 'lucide-react';

interface SecureShareLink {
  id: string;
  recipientName: string;
  institution: string;
  createdAt: string;
  expiresAt: string;
  password: string;
  url: string;
  viewCount: number;
  isActive: boolean;
}

interface SecureShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  programName: string;
  cumulativeGpa: number;
  onLogActivity: (action: any, details: string) => void;
}

export const SecureShareModal: React.FC<SecureShareModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  programName,
  cumulativeGpa,
  onLogActivity
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [institution, setInstitution] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  const [customPassword, setCustomPassword] = useState('BIBU-' + Math.random().toString(36).slice(-6).toUpperCase());
  
  const [activeShares, setActiveShares] = useState<SecureShareLink[]>([
    {
      id: 'share-1',
      recipientName: 'Dr. Jonathan Edwards',
      institution: 'Westminster Theological Board of Review',
      createdAt: 'Sept 10, 2026',
      expiresAt: 'Sept 17, 2026 (7 days)',
      password: 'THEO-2026-REV',
      url: `https://bibu.university/secure/transcript/view?token=tr-sec-9f8a2b1c`,
      viewCount: 2,
      isActive: true
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPwdId, setCopiedPwdId] = useState<string | null>(null);
  const [simulatedViewShare, setSimulatedViewShare] = useState<SecureShareLink | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  if (!isOpen) return null;

  const handleGenerateShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !institution) return;

    const token = Math.random().toString(36).substring(2, 10);
    const newShare: SecureShareLink = {
      id: `share-${Date.now()}`,
      recipientName,
      institution,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      expiresAt: `${expiryDays} Days from now`,
      password: customPassword || 'BIBU-SECURE',
      url: `https://bibu.university/secure/transcript/view?token=${token}`,
      viewCount: 0,
      isActive: true
    };

    setActiveShares([newShare, ...activeShares]);
    onLogActivity('Verified Document', `Generated password-protected secure share link for ${recipientName} (${institution}).`);

    // Reset form
    setRecipientName('');
    setInstitution('');
    setCustomPassword('BIBU-' + Math.random().toString(36).slice(-6).toUpperCase());
  };

  const handleCopyLink = (share: SecureShareLink) => {
    navigator.clipboard.writeText(share.url);
    setCopiedId(share.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyPassword = (share: SecureShareLink) => {
    navigator.clipboard.writeText(share.password);
    setCopiedPwdId(share.id);
    setTimeout(() => setCopiedPwdId(null), 2500);
  };

  const handleRevokeShare = (id: string) => {
    setActiveShares(activeShares.map(s => s.id === id ? { ...s, isActive: false } : s));
  };

  const handleTestEmployerLogin = (share: SecureShareLink) => {
    setSimulatedViewShare(share);
    setEnteredPassword('');
    setIsUnlocked(false);
    setPasswordError(false);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedViewShare) return;
    if (enteredPassword === simulatedViewShare.password) {
      setIsUnlocked(true);
      setPasswordError(false);
      // Increment view count
      setActiveShares(activeShares.map(s => s.id === simulatedViewShare.id ? { ...s, viewCount: s.viewCount + 1 } : s));
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#002366] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-[#C5A059]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Institutional Privacy & Security
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Secure Transcript Share Link & Password Protection
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Generate temporary, password-protected view-only transcript links for employers, licensing boards, or graduate admissions without exposing raw downloads.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Simulated Employer View Modal Inside */}
          {simulatedViewShare ? (
            <div className="bg-slate-50 border-2 border-[#002366] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#002366]" />
                  <span className="text-xs font-bold text-[#002366]">Employer / External Institution Portal Simulation</span>
                </div>
                <button
                  onClick={() => setSimulatedViewShare(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold underline"
                >
                  ← Return to Share Manager
                </button>
              </div>

              {!isUnlocked ? (
                <div className="py-6 max-w-md mx-auto text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#002366]/10 text-[#002366] flex items-center justify-center mx-auto border border-[#002366]/20">
                    <Key className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">Protected Academic Record</h3>
                    <p className="text-xs text-slate-600">
                      You are accessing an official secure transcript shared by <strong className="text-[#002366]">{studentName}</strong> for <strong className="text-[#002366]">{simulatedViewShare.institution}</strong>. Enter the access password provided by the student.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyPassword} className="space-y-3 pt-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Enter Access Password (e.g. THEO-2026-REV)"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-center font-bold text-slate-900 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                      />
                      {passwordError && (
                        <p className="text-[11px] text-rose-600 font-medium mt-1">Invalid password. Please check the access code provided.</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#002366] hover:bg-[#001A4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Unlock Secure Transcript View
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-400 italic">Hint: The password for this share is <span className="font-mono font-bold text-slate-700">{simulatedViewShare.password}</span></p>
                </div>
              ) : (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Official Transcript Verified & Unlocked</h4>
                        <p className="text-[10px] text-emerald-600 font-medium">Read-Only Secure View • No Local Download Permitted</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold">
                      Viewing as: {simulatedViewShare.recipientName} ({simulatedViewShare.institution})
                    </span>
                  </div>

                  {/* Transcript Header Preview */}
                  <div className="text-center space-y-1 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <h5 className="text-xs font-bold font-display text-[#002366]">BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY</h5>
                    <p className="text-[10px] text-slate-500">Official Secure Academic Transcript Viewer</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div><span className="text-slate-500">Student Name:</span> <strong className="text-slate-900">{studentName}</strong></div>
                    <div><span className="text-slate-500">Student ID:</span> <strong className="text-slate-900">{studentId}</strong></div>
                    <div><span className="text-slate-500">Program:</span> <strong className="text-slate-900">{programName}</strong></div>
                    <div><span className="text-slate-500">Cumulative GPA:</span> <strong className="text-slate-900">{cumulativeGpa.toFixed(2)} / 4.00</strong></div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>This is a secure institutional view. Downloading or printing raw PDF files has been disabled by the student's privacy policy.</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Form to Create New Secure Share */}
              <form onSubmit={handleGenerateShare} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#002366]">
                  <Share2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Create New Secure Share Link</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Recipient Contact Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Director of Human Resources"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Institution / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Global Fellowship"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Link Expiration Period</label>
                    <select
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                    >
                      <option value="1">24 Hours (1 Day)</option>
                      <option value="7">7 Days</option>
                      <option value="30">30 Days</option>
                      <option value="90">90 Days</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Access Password</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomPassword('BIBU-' + Math.random().toString(36).slice(-6).toUpperCase())}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-[10px] font-bold shrink-0"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Generate Secure Share Link</span>
                  </button>
                </div>
              </form>

              {/* Active Shares List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Active Secure Share Links ({activeShares.filter(s => s.isActive).length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Password protected & view-only</span>
                </div>

                <div className="space-y-2.5">
                  {activeShares.map((share) => (
                    <div
                      key={share.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        share.isActive ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-100 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{share.recipientName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#002366] font-bold border border-blue-200">
                              {share.institution}
                            </span>
                            {!share.isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                Revoked
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Key className="w-3 h-3 text-[#C5A059]" />
                              Password: <strong className="text-slate-800">{share.password}</strong>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-slate-400" />
                              Viewed: {share.viewCount} times
                            </span>
                            <span>•</span>
                            <span>Expires: {share.expiresAt}</span>
                          </div>
                        </div>

                        {share.isActive && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleTestEmployerLogin(share)}
                              title="Test Employer View"
                              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors border border-emerald-200"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Test View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(share)}
                              title="Copy Link"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                            >
                              {copiedId === share.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevokeShare(share.id)}
                              title="Revoke Link"
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 truncate">
                        {share.url}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Manager
          </button>
        </div>

      </div>
    </div>
  );
};
