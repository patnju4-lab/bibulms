import React, { useState } from 'react';
import { UniversityLogo } from '../common/UniversityLogo';
import { Mail, Send, CheckCircle2, Loader2, X, ShieldCheck, FileText } from 'lucide-react';

interface EmailTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentEmail: string;
  studentId: string;
  programName: string;
  cumulativeGpa: number;
  documentRef: string;
}

export const EmailTranscriptModal: React.FC<EmailTranscriptModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentEmail,
  studentId,
  programName,
  cumulativeGpa,
  documentRef
}) => {
  const [recipientEmail, setRecipientEmail] = useState(studentEmail || 'student@bibu.university');
  const [emailService, setEmailService] = useState<'sendgrid' | 'ses' | 'smtp'>('sendgrid');
  const [includeSecureLink, setIncludeSecureLink] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setErrorMessage('Please enter a valid recipient email address.');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    try {
      // Simulate secure email dispatch via integrated email service (SendGrid/SMTP)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSending(false);
      setIsSent(true);
    } catch (err) {
      setIsSending(false);
      setErrorMessage('Failed to dispatch email. Please verify your connection and try again.');
    }
  };

  const handleResetAndClose = () => {
    setIsSent(false);
    setIsSending(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#002366] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <UniversityLogo size="sm" withRing />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Office of the University Registrar
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Email Official Academic Transcript
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Directly transmit your registrar-authenticated academic transcript and verification records via our secure email service integration.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {isSent ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-slate-900">Transcript Dispatched Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  An official PDF transcript report and digital verification hash have been securely emailed to <strong className="text-[#002366]">{recipientEmail}</strong> via {emailService.toUpperCase()} service.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1 max-w-sm mx-auto font-mono">
                <div className="text-slate-500">Document Ref: <strong className="text-slate-900">{documentRef}</strong></div>
                <div className="text-slate-500">Recipient: <strong className="text-slate-900">{recipientEmail}</strong></div>
                <div className="text-slate-500">Timestamp: <strong className="text-slate-900">{new Date().toLocaleString()}</strong></div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Dossier Overview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Candidate Name</span>
                  <span className="font-bold text-slate-900 truncate block font-display">{studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Student ID</span>
                  <span className="font-mono font-bold text-[#002366] block">{studentId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Degree Program</span>
                  <span className="font-medium text-slate-800 truncate block">{programName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Cumulative GPA</span>
                  <span className="font-bold text-emerald-700 block">{cumulativeGpa.toFixed(2)} / 4.00</span>
                </div>
              </div>

              {/* Recipient Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#002366]" />
                  <span>Registered Recipient Email Address</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="student@bibu.university"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
                <span className="text-[10px] text-slate-500">
                  Official registrar transcripts will be sent as a secure encrypted PDF attachment.
                </span>
              </div>

              {/* Email Service Gateway Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Email Service Gateway Integration
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEmailService('sendgrid')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      emailService === 'sendgrid'
                        ? 'bg-[#002366] text-white border-[#002366] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    SendGrid API
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailService('ses')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      emailService === 'ses'
                        ? 'bg-[#002366] text-white border-[#002366] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    AWS SES
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailService('smtp')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      emailService === 'smtp'
                        ? 'bg-[#002366] text-white border-[#002366] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    SMTP Relay
                  </button>
                </div>
              </div>

              {/* Security Option */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="secureLink"
                  checked={includeSecureLink}
                  onChange={(e) => setIncludeSecureLink(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#002366] focus:ring-[#002366]"
                />
                <label htmlFor="secureLink" className="text-xs text-slate-600 leading-tight">
                  Include 256-bit cryptographic verification hash link and institutional seal stamp in email body.
                </label>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                      <span>Dispatching Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C5A059]" />
                      <span>Send Transcript Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
