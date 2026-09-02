import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Send,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Bookmark,
  Layers,
  FileText,
  X
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  biblicalSource?: string;
  scholarlyConsensus?: string;
  pastoralApplication?: string;
}

export const TheologicalAiAssistant: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTopic
}) => {
  const [inputQuery, setInputQuery] = useState(initialTopic || '');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Welcome to the BIBU Theological Research AI Desk. I am calibrated on sound historical-grammatical hermeneutics, classical orthodox patristic theology, and the BIBU Academic Standards. How can I assist your theological inquiry or exegesis today?',
      biblicalSource: '2 Timothy 2:15 — "Do your best to present yourself to God as one approved, a worker who has no need to be ashamed, rightly handling the word of truth."',
      scholarlyConsensus: 'Adheres to orthodox Nicene-Chalcedonian Christology, Sola Scriptura, and peer-reviewed evangelical scholarship.',
      pastoralApplication: 'Use these insights to nourish your personal walk with Christ, sermon preparation, or academic thesis drafting.'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePrompts = [
    'Explain the Greek term "hilasterion" (propitiation) in Romans 3:25',
    'Compare the Council of Nicaea (325) vs Chalcedon (451)',
    'Synthesize Justification in Paul (Romans 4) vs Works in James 2',
    'Generate an Expository Sermon Outline for Romans 8:31-39',
    'What is the biblical distinction between Covenant Theology and Dispensationalism?',
    'What are the mandatory safeguarding protocols for hospital ICU visitation?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      // Generate structured scholarly response
      let bibSource = 'Romans 3:21-26; 2 Timothy 3:16-17; John 1:1-14';
      let scholarly = 'Historical-grammatical exegesis and classical patristic orthodoxy (Athanasius, Augustine, Calvin).';
      let pastApp = 'Proclaim Christ’s unshakeable grace and cultivate holy devotion in local church discipleship.';
      let mainResp = '';

      const q = query.toLowerCase();

      if (q.includes('hilasterion') || q.includes('propitiation') || q.includes('romans 3')) {
        bibSource = 'Romans 3:25; Hebrews 9:5; 1 John 2:2, 4:10';
        scholarly = 'C.H. Dodd argued for "expiation" (removal of sin), but Leon Morris and modern exegesis conclusively established that hilasterion entails "propitiation"—the satisfaction and turning away of divine holy wrath through Christ’s blood.';
        pastApp = 'Assures the believer that zero residual wrath remains from God; Christ bore our full penalty.';
        mainResp = `1. Lexical Exegesis:
The Greek term "hilasterion" refers to the mercy seat (Hebrew: kapporeth) in the Old Testament Tabernacle, where the high priest sprinkled blood on the Day of Atonement (Yom Kippur).

2. Theological Definition:
In Romans 3:25, Paul declares that God publicly set forth Jesus Christ as the hilasterion in His blood, received through faith. It accomplishes both expiation (cleansing our guilt) and propitiation (satisfying God's righteous holy wrath).`;
      } else if (q.includes('nicaea') || q.includes('chalcedon')) {
        bibSource = 'John 1:1, 1:14; Colossians 2:9; Philippians 2:5-11';
        scholarly = 'Nicaea (A.D. 325) affirmed the Son is homoousios (same substance) with the Father against Arius. Chalcedon (A.D. 451) affirmed Christ is one Person in two unconfused, immutable, indivisible natures (vere Deus, vere homo).';
        pastApp = 'Guards the church against Christological heresies and anchors our salvation in a divine Savior who truly became man to redeem man.';
        mainResp = `1. The Council of Nicaea (A.D. 325):
Convened to refute Arianism (which claimed "there was a time when the Son was not"). The Council established the Nicene Creed, affirming that Jesus Christ is "true God from true God, begotten not made, of one Being (homoousios) with the Father."

2. The Council of Chalcedon (A.D. 451):
Addressed the union of Christ’s divine and human natures (the Hypostatic Union). It formulated the Chalcedonian Definition: Christ is acknowledged in two natures, without confusion (asynkytōs), without change (atreptōs), without division (adiairetōs), without separation (achōristōs).`;
      } else if (q.includes('sermon outline') || q.includes('romans 8:31')) {
        bibSource = 'Romans 8:31-39; Isaiah 50:7-9; Psalm 118:6';
        scholarly = 'Exegetical climax of Romans 8: Paul utilizes rhetorical questions of legal courtroom challenge to proclaim absolute eternal security.';
        pastApp = 'Encourage believers facing affliction, persecution, or despair that nothing can sever them from Christ’s love.';
        mainResp = `SERMON TITLE: "Unshakeable Assurance: If God Is for Us" (Romans 8:31–39)

I. The Divine Defender (v. 31–32)
   - The Sovereign Proposition: "If God is for us, who can be against us?"
   - The Greater-to-Lesser Argument: He who gave His own Son will graciously give us all things.

II. The Divine Acquitment (v. 33–34)
   - No Legal Accusation Can Stand: "It is God who justifies."
   - The Fourfold Intercession of Christ: Died, Risen, Enthroned, and Interceding for us.

III. The Indomitable Love of Christ (v. 35–39)
   - Present Tribulation Cannot Separate Us (v. 35–36).
   - More Than Conquerors (hypernikōmen) through Him who loved us (v. 37).
   - Cosmic Victory: Neither death, nor life, nor angelic powers can sever God's covenant love.`;
      } else {
        mainResp = `In response to your inquiry regarding "${query}":

1. Canonical Perspective:
The canonical witness presents a coherent redemptive-historical narrative centered on God's covenantal promises fulfilled in Jesus Christ.

2. Scholarly Analysis:
Standard academic exegesis requires examining the historical background of the original audience, lexical morphology of the Hebrew/Greek terms, and the immediate literary context.

3. Institutional Reference:
Please consult the BIBU Digital Theological Library resources for full monographs and peer-reviewed journal articles.`;
      }

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: mainResp,
        biblicalSource: bibSource,
        scholarlyConsensus: scholarly,
        pastoralApplication: pastApp
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border-2 border-[#002366]/30 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#002366] text-white p-4 flex items-center justify-between shrink-0 border-b-2 border-[#C5A059]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001438] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#001438] text-[#C5A059] border border-[#C5A059]/30">
                  AI Theological Research Assistant
                </span>
                <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                  Hermeneutical & Exegetical Synthesis
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-white tracking-tight">
                BIBU Exegetical & Research Desk
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          
          {/* Quick Starter Prompts */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-[11px] font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Recommended Theological & Exegetical Inquiries</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#002366] hover:text-[#C5A059] text-[11px] text-slate-700 transition-colors text-left font-medium"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl p-4 sm:p-5 space-y-3 ${
                    isUser
                      ? 'bg-[#002366] text-white shadow-md rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] border-b border-current/10 pb-2">
                    <span className="font-bold uppercase tracking-wider font-mono">
                      {isUser ? 'Student / Researcher' : 'BIBU Theological Research Assistant'}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(`${m.content}\n\nScripture: ${m.biblicalSource}\nScholarship: ${m.scholarlyConsensus}`, m.id)}
                        className="opacity-70 hover:opacity-100 flex items-center gap-1 text-[10px]"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy Response'}</span>
                      </button>
                    )}
                  </div>

                  {/* Main content */}
                  <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">
                    {m.content}
                  </div>

                  {/* Tripartite Breakdown for Scholarly Clarity */}
                  {!isUser && m.biblicalSource && (
                    <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                      
                      {/* 1. Biblical Source Grounding */}
                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-950 space-y-0.5">
                        <div className="font-bold font-mono text-[10px] text-blue-800 uppercase flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>1. Primary Biblical Source Content</span>
                        </div>
                        <p className="font-serif italic">{m.biblicalSource}</p>
                      </div>

                      {/* 2. Scholarly Consensus */}
                      {m.scholarlyConsensus && (
                        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-950 space-y-0.5">
                          <div className="font-bold font-mono text-[10px] text-amber-800 uppercase flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>2. Academic & Patristic Consensus</span>
                          </div>
                          <p>{m.scholarlyConsensus}</p>
                        </div>
                      )}

                      {/* 3. Pastoral Application */}
                      {m.pastoralApplication && (
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-0.5">
                          <div className="font-bold font-mono text-[10px] text-emerald-800 uppercase flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>3. Pastoral Application & Ministry Synthesis</span>
                          </div>
                          <p>{m.pastoralApplication}</p>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 max-w-xs animate-pulse">
              <Sparkles className="w-4 h-4 text-[#C5A059] animate-spin" />
              <span>Analyzing Greek/Hebrew syntax & scholarly canons...</span>
            </div>
          )}

        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a theological, Greek/Hebrew, or pastoral research question..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#002366] bg-slate-50"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] hover:bg-[#001438] font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
          <div className="text-[10px] text-slate-400 text-center mt-1.5">
            Strict Academic Protocol: Distinguishes between Canonical Scripture, Scholarly Consensus, and Pastoral Application.
          </div>
        </div>

      </div>
    </div>
  );
};
