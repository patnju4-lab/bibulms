import React, { useState, useEffect } from 'react';
import { MediaVideo } from '../../types/media';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Code,
  Link,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
  Clock,
  User,
  BookOpen,
  Eye,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

interface VideoShareModalProps {
  video: MediaVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoShareModal: React.FC<VideoShareModalProps> = ({ video, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [activeTab, setActiveTab] = useState<'social' | 'embed'>('social');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const startSeconds = video.startTimeSeconds;
  const hasTimestamp = typeof startSeconds === 'number' && startSeconds > 0;
  const formattedMinutes = hasTimestamp ? Math.floor(startSeconds / 60) : 0;
  const formattedSecs = hasTimestamp ? (startSeconds % 60).toString().padStart(2, '0') : '00';
  const timestampText = `${formattedMinutes}:${formattedSecs}`;

  // Direct YouTube URL formatted with or without timestamp
  const youtubeBaseUrl = video.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${video.youtubeVideoId}`
    : (video.youtubeUrl || 'https://www.youtube.com/@Bibuniversity');

  const youtubeShareUrl = hasTimestamp && includeTimestamp
    ? `${youtubeBaseUrl}${youtubeBaseUrl.includes('?') ? '&' : '?'}t=${startSeconds}s`
    : youtubeBaseUrl;

  // University app link deep-linking to the video
  const portalShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?tab=media&view=tv&videoId=${video.id}${hasTimestamp && includeTimestamp ? `&start=${startSeconds}` : ''}`
    : youtubeShareUrl;

  const presenterName = video.presenter || video.speakerName || 'BIBU Faculty & Chaplaincy';
  const shareTitle = `${video.title} – BIBU TV`;
  const shareText = `Watch "${video.title}" by ${presenterName} on Breakthrough International Bible University (BIBU TV). Christian education, expository preaching & theological leadership.`;

  // Pre-formatted full message for sharing
  const fullFormattedMessage = `${shareText}\n\n🎥 Watch here: ${youtubeShareUrl}\n🏛️ Learn more at Breakthrough International Bible University (BIBU TV)`;

  // Social share links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullFormattedMessage)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeShareUrl)}&quote=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeShareUrl)}&text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeShareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(youtubeShareUrl)}&text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(fullFormattedMessage)}`;

  // Responsive HTML Embed code
  const embedCode = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
  <iframe src="https://www.youtube.com/embed/${video.youtubeVideoId || ''}?rel=0&modestbranding=1${hasTimestamp && includeTimestamp ? `&start=${startSeconds}` : ''}" title="${video.title.replace(/"/g, '&quot;')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
</div>
<p style="font-family:sans-serif;font-size:12px;color:#64748b;margin-top:8px;">Broadcast by <a href="${portalShareUrl}" target="_blank" style="color:#002366;font-weight:bold;">Breakthrough International Bible University</a></p>`;

  const copyToClipboard = async (text: string, type: 'link' | 'message' | 'embed') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } else if (type === 'message') {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2500);
      } else if (type === 'embed') {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: youtubeShareUrl
        });
      } catch (err) {
        // Ignored or user cancelled
      }
    } else {
      copyToClipboard(youtubeShareUrl, 'link');
    }
  };

  return (
    <div
      id="video-share-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        id="video-share-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B1530] text-slate-100 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#001744] via-[#002366] to-[#0B1530] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-inner">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <span>Share Sermon Video</span>
                <span className="bg-[#C5A059] text-[#002366] text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  BIBU TV
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Pre-formatted links and social sharing for university lectures & sermons
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Video Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700/60">
              <img
                src={video.thumbnail || video.thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=300'}
                alt={video.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 bg-black/85 text-[9px] font-mono text-white px-1.5 py-0.2 rounded font-bold">
                {video.duration}
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#002366] text-[#C5A059] text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#C5A059]/30 truncate max-w-[140px]">
                  {video.category}
                </span>
                {hasTimestamp && (
                  <span className="text-[9px] font-mono text-amber-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>Starts @ {timestampText}</span>
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                {video.title}
              </h4>
              <p className="text-[11px] text-slate-300 truncate flex items-center gap-1">
                <User className="w-3 h-3 text-[#C5A059] shrink-0" />
                <span>{presenterName}</span>
              </p>
            </div>
          </div>

          {/* Timestamp Switcher if video has start seconds */}
          {hasTimestamp && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#001744]/70 border border-[#C5A059]/30 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <div>
                  <span className="font-bold text-white">Start at specific timestamp: </span>
                  <span className="font-mono text-amber-300 font-bold">{timestampText}</span>
                  <span className="text-slate-400 text-[11px] ml-1">({startSeconds}s)</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
              </label>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'social'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Share Link & Social</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('embed')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'embed'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Embed Video (HTML)</span>
            </button>
          </div>

          {activeTab === 'social' ? (
            <div className="space-y-4">
              {/* 1. Pre-formatted Link Input & Copy Button */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Direct YouTube Video Link</span>
                  {hasTimestamp && includeTimestamp && (
                    <span className="text-[10px] font-mono text-[#C5A059]">Timestamp included (&t={startSeconds}s)</span>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={youtubeShareUrl}
                      className="w-full pl-3 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white select-all focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(youtubeShareUrl, 'link')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#C5A059] hover:bg-[#b08d4b] text-[#002366]'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Enhanced Social Sharing Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Share directly to social platforms</span>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="text-[11px] text-[#C5A059] hover:underline font-bold flex items-center gap-1"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Device Share Sheet</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[11px]">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/60 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">
                      f
                    </div>
                    <span className="text-[11px]">Facebook</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                      𝕏
                    </div>
                    <span className="text-[11px]">X (Twitter)</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/60 text-sky-400 hover:text-sky-300 text-xs font-bold transition-all hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                      in
                    </div>
                    <span className="text-[11px]">LinkedIn</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px]">Telegram</span>
                  </a>

                  {/* Email */}
                  <a
                    href={emailUrl}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px]">Email</span>
                  </a>
                </div>
              </div>

              {/* 3. Pre-formatted Announcement Message */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Pre-formatted Sermon Message (for bulletins & group chats)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fullFormattedMessage, 'message')}
                    className="text-[11px] text-[#C5A059] hover:underline font-bold flex items-center gap-1"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Message Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {fullFormattedMessage}
                </div>
              </div>
            </div>
          ) : (
            /* Embed Code Tab */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    HTML Embed Code (for Church & Ministry Websites)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(embedCode, 'embed')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      copiedEmbed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#C5A059] text-[#002366] hover:bg-[#b08d4b]'
                    }`}
                  >
                    {copiedEmbed ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied HTML!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Embed Code</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={embedCode}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-[11px] font-mono text-amber-200 select-all focus:outline-none focus:border-[#C5A059] leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  This responsive 16:9 iframe snippet can be pasted into WordPress, church portals, blog posts, or Christian educational portals. It automatically respects the university branding and starting playback timestamp.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <a
            href={youtubeShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium text-[11px]"
          >
            <span>Open in YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
