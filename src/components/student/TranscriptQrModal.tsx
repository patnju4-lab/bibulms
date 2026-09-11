import React, { useState } from 'react';
import { QrCode, ShieldCheck, Copy, Check, Download, ExternalLink, X, Smartphone, Sparkles, AlertCircle } from 'lucide-react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

interface TranscriptQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  documentRef: string;
  verificationHash: string;
  onLogActivity: (action: any, details: string) => void;
}

export const TranscriptQrModal: React.FC<TranscriptQrModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  documentRef,
  verificationHash,
  onLogActivity
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const verificationUrl = `https://bibu.university/verify/transcript?serial=${documentRef}&hash=${verificationHash.substring(0, 16)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    onLogActivity('Verified Document', `Copied cryptographic verification QR URL for ${documentRef}.`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQr = () => {
    const canvas = document.getElementById('transcript-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `BIBU-Transcript-QR-${documentRef}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      onLogActivity('Generated PDF', `Downloaded official verification QR code graphic for serial ${documentRef}.`);
    }
  };

  const handleRunScanSimulation = () => {
    setIsSimulatingScan(true);
    setScanResult(null);
    setTimeout(() => {
      setIsSimulatingScan(false);
      setScanResult({
        status: 'AUTHENTIC & VERIFIED',
        issuer: 'Breakthrough International Bible University Registrar',
        student: studentName,
        id: studentId,
        serial: documentRef,
        gpa: '3.88 / 4.00 (Summa Cum Laude Track)',
        timestamp: new Date().toLocaleString()
      });
      onLogActivity('Verified Document', `Simulated third-party mobile QR code scan & cryptographic validation for ${documentRef}.`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
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
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Cryptographic Authentication
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Official Transcript Verification QR Code
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Scan this QR code with any mobile device or camera to instantly validate academic credentials against the immutable university registrar ledger.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* QR Code Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-xs">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-slate-200 relative group">
              <QRCodeCanvas
                id="transcript-qr-canvas"
                value={verificationUrl}
                size={180}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              <div className="absolute inset-0 bg-[#002366]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="bg-[#002366] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">BIBU Verified</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 font-display">Instant Verification Link</h3>
              <div className="flex items-center justify-center gap-2 max-w-md mx-auto bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-[11px] font-mono text-slate-600 truncate">{verificationUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition-colors"
                  title="Copy Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Download QR PNG</span>
              </button>

              <button
                type="button"
                onClick={handleRunScanSimulation}
                disabled={isSimulatingScan}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isSimulatingScan ? 'Scanning...' : 'Test Mobile Scan'}</span>
              </button>
            </div>
          </div>

          {/* Simulation Result Box */}
          {(isSimulatingScan || scanResult) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Third-Party Mobile Scanner Result</span>
                </div>
                {isSimulatingScan && (
                  <span className="text-[10px] text-emerald-700 animate-pulse font-mono">Decoding cryptographic hash...</span>
                )}
              </div>

              {scanResult && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-200">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <strong className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono text-[11px]">{scanResult.status}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-emerald-200">
                    <div><span className="text-slate-500">Student:</span> <strong className="text-slate-900">{scanResult.student}</strong></div>
                    <div><span className="text-slate-500">ID:</span> <strong className="text-slate-900">{scanResult.id}</strong></div>
                    <div><span className="text-slate-500">Serial:</span> <strong className="text-slate-900">{scanResult.serial}</strong></div>
                    <div><span className="text-slate-500">Academic Standing:</span> <strong className="text-slate-900">{scanResult.gpa}</strong></div>
                  </div>
                  <p className="text-[10px] text-emerald-800 italic">
                    Validated against Breakthrough International Bible University secure ledger at {scanResult.timestamp}. No tampering detected.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#002366] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Embedded on Official Transcript:</strong> This QR code is automatically generated and embedded in the lower corner of official printed and PDF transcript exports to ensure foolproof authenticity verification by employers and graduate boards.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close QR Authenticator
          </button>
        </div>

      </div>
    </div>
  );
};
