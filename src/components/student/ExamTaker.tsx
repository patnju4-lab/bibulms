import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ShieldAlert,
  Sparkles,
  FileCheck2,
  AlertCircle,
  Zap,
  Volume2
} from 'lucide-react';
import { ExamAttempt } from '../../types';

export const ExamTaker: React.FC = () => {
  const { selectedExamId, examinations, submitExamAttempt, setCurrentView, currentUser } = useApp();

  const currentExam = examinations.find((e) => e.id === selectedExamId) || examinations[0];
  const totalDurationSeconds = (currentExam.durationMinutes || 45) * 60;

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({
    'q-1': 'Exegesis',
    'q-2': 'Verbal Plenary Inspiration',
    'q-3': 'Greek',
    'q-4': 'Grammatical-Historical-Theological Method'
  });
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(totalDurationSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<ExamAttempt | null>(null);

  // 5-Minute Warning & Auto-Submission States
  const [hasTriggered5MinWarning, setHasTriggered5MinWarning] = useState(false);
  const [show5MinWarningModal, setShow5MinWarningModal] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false);

  // Ref to prevent duplicate submissions
  const hasSubmittedRef = useRef(false);

  // Audio warning chime using Web Audio API
  const playAlertChime = (freq: number = 880, duration: number = 0.35) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Automated Countdown Timer
  useEffect(() => {
    if (isCompleted || hasSubmittedRef.current) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        // 5-Minute Warning trigger (300 seconds)
        if (prev === 300 || (prev <= 300 && prev > 298 && !hasTriggered5MinWarning)) {
          setHasTriggered5MinWarning(true);
          setShow5MinWarningModal(true);
          playAlertChime(880, 0.4);
        }

        // Time Expiration trigger (<= 1 second remaining)
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasSubmittedRef.current) {
            hasSubmittedRef.current = true;
            setIsAutoSubmitting(true);
            setWasAutoSubmitted(true);
            playAlertChime(440, 0.6);
            setTimeout(() => {
              handleFinishExam(true);
            }, 1200);
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, hasTriggered5MinWarning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const toggleFlag = (qId: string) => {
    if (flaggedQuestions.includes(qId)) {
      setFlaggedQuestions(flaggedQuestions.filter((id) => id !== qId));
    } else {
      setFlaggedQuestions([...flaggedQuestions, qId]);
    }
  };

  const calculateScore = () => {
    let score = 0;
    currentExam.questions.forEach((q) => {
      const userAns = answers[q.id];
      const correct =
        q.correctAnswer ||
        (q.options && q.correctAnswerIndex !== undefined
          ? q.options[q.correctAnswerIndex]
          : q.correctAnswerText);
      if (
        userAns &&
        correct &&
        userAns.toString().trim().toLowerCase() === correct.toString().trim().toLowerCase()
      ) {
        score += q.points || 10;
      }
    });

    const totalPoints =
      currentExam.questions.reduce((acc, q) => acc + (q.points || 10), 0) ||
      currentExam.totalMarks ||
      100;
    const percentage = Math.round((score / totalPoints) * 100);
    const letter =
      percentage >= 90
        ? 'A'
        : percentage >= 85
        ? 'A-'
        : percentage >= 80
        ? 'B+'
        : percentage >= 75
        ? 'B'
        : percentage >= 70
        ? 'C+'
        : 'F';

    return { score, totalPoints, percentage, letter, passed: percentage >= (currentExam.passMarks || 70) };
  };

  const handleFinishExam = (isAutoSubmit = false) => {
    hasSubmittedRef.current = true;
    const { score, totalPoints, percentage, letter, passed } = calculateScore();

    submitExamAttempt(currentExam.id, answers, score, percentage, letter);

    const result: ExamAttempt = {
      id: `att-${Date.now()}`,
      examId: currentExam.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      startedAt: new Date(Date.now() - (totalDurationSeconds - timeLeftSeconds) * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      score,
      percentage,
      grade: letter,
      answers,
      status: 'Graded',
      examinerComments: isAutoSubmit
        ? 'Automatically submitted upon expiration of the examination countdown timer. Graded by BIBU Central Examination System.'
        : 'Manually finalized and submitted by candidate. Graded by BIBU Central Examination System.'
    };

    setAttemptResult(result);
    setIsAutoSubmitting(false);
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion = currentExam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentExam.questions.length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const timeProgressPercent = Math.max(0, Math.min(100, (timeLeftSeconds / totalDurationSeconds) * 100));

  const isWarningState = timeLeftSeconds <= 300 && timeLeftSeconds > 60;
  const isCriticalState = timeLeftSeconds <= 60;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Proctored Exam Header with Automated Timer */}
      <div
        className={`rounded-2xl p-5 sm:p-6 shadow-md transition-all border ${
          isCriticalState && !isCompleted
            ? 'bg-rose-950 text-white border-rose-600 ring-2 ring-rose-500 animate-pulse'
            : isWarningState && !isCompleted
            ? 'bg-[#001f5c] text-white border-amber-500 ring-2 ring-amber-400/40'
            : 'bg-[#002366] text-white border-[#002366]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366]">
                Proctored Examination
              </span>
              <span className="text-xs font-mono text-[#C5A059]">Code: {currentExam.courseCode}</span>
              {isWarningState && !isCompleted && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center gap-1 animate-bounce">
                  <AlertTriangle className="w-3 h-3" />
                  <span>5-Minute Warning Active</span>
                </span>
              )}
              {isCriticalState && !isCompleted && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  <span>Critical: Final Minute</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              {currentExam.title}
            </h1>
            <div className="text-xs text-slate-300">
              Total Points: {currentExam.totalMarks || 100} • Required Pass Mark: {currentExam.passMarks}% • Chief Examiner: {currentExam.chiefExaminer || 'Office of Academic Affairs'}
            </div>
          </div>

          {/* Automated Timer Display */}
          {!isCompleted && (
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`p-3.5 rounded-xl text-center min-w-[150px] border shadow-inner transition-all ${
                  isCriticalState
                    ? 'bg-rose-900/90 border-rose-500 text-white'
                    : isWarningState
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                    : 'bg-[#001A4D] border-[#002366]/60 text-white'
                }`}
              >
                <div className="text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-1.5 opacity-90">
                  <Clock className={`w-3.5 h-3.5 ${isCriticalState ? 'text-rose-400 animate-spin' : 'text-[#C5A059]'}`} />
                  <span>Time Remaining</span>
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-black font-mono tracking-wider mt-0.5 ${
                    isCriticalState
                      ? 'text-white drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      : isWarningState
                      ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                      : 'text-[#C5A059]'
                  }`}
                >
                  {formatTime(timeLeftSeconds)}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      isCriticalState
                        ? 'bg-rose-500'
                        : isWarningState
                        ? 'bg-amber-400'
                        : 'bg-[#C5A059]'
                    }`}
                    style={{ width: `${timeProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persistent 5-Minute Warning Bar */}
        {isWarningState && !isCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Attention:</strong> Less than 5 minutes remain. Review all flagged items. Answers will auto-submit when the countdown reaches 00:00.
              </span>
            </div>
            <span className="font-mono font-bold text-amber-300 shrink-0">
              {formatTime(timeLeftSeconds)} left
            </span>
          </div>
        )}

        {/* Critical Final Minute Warning Bar */}
        {isCriticalState && !isCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-rose-600/30 border border-rose-500 flex items-center justify-between gap-3 text-xs text-rose-200 animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>FINAL COUNTDOWN:</strong> Less than 60 seconds remaining! System is preparing auto-submission.
              </span>
            </div>
            <span className="font-mono font-bold text-white shrink-0">
              {formatTime(timeLeftSeconds)}
            </span>
          </div>
        )}
      </div>

      {/* Quick Proctoring Testing Simulator Toolbar */}
      {!isCompleted && (
        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Zap className="w-4 h-4 text-[#C5A059]" />
            <span className="font-bold">Proctoring Timer Simulator:</span>
            <span className="text-slate-500">(Test 5-min warning chime & automatic submit expiration)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTimeLeftSeconds(305);
                setHasTriggered5MinWarning(false);
              }}
              className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold font-mono text-[11px] border border-amber-300"
            >
              Jump to 5:05 (Test 5-Min Warning)
            </button>
            <button
              onClick={() => {
                setTimeLeftSeconds(6);
              }}
              className="px-2.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold font-mono text-[11px] border border-rose-300"
            >
              Jump to 0:06 (Test Auto-Submit)
            </button>
            <button
              onClick={() => {
                setTimeLeftSeconds(totalDurationSeconds);
                setHasTriggered5MinWarning(false);
              }}
              className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px]"
            >
              Reset {currentExam.durationMinutes || 45}:00
            </button>
          </div>
        </div>
      )}

      {/* 5-MINUTE WARNING MODAL POPUP */}
      {show5MinWarningModal && !isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-400 max-w-md w-full p-6 sm:p-7 space-y-5 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center border-2 border-amber-300 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                Automated Proctoring Alert
              </div>
              <h2 className="text-xl font-bold font-display text-[#002366]">
                5 Minutes Remaining in Examination!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have reached the 5-minute countdown threshold for <strong>{currentExam.courseCode}: {currentExam.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Total Answered:</span>
                <strong className="font-mono text-[#002366]">{answeredCount} of {totalQuestions}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Unanswered Questions:</span>
                <strong className="font-mono text-rose-600">{unansweredCount}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Flagged for Review:</span>
                <strong className="font-mono text-amber-700">{flaggedQuestions.length}</strong>
              </div>
              <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-900 font-semibold">
                ⚠️ When the countdown timer reaches 00:00, all current answers will be automatically finalized and submitted to the Academic Registrar.
              </div>
            </div>

            <button
              onClick={() => setShow5MinWarningModal(false)}
              className="w-full py-3 bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102"
            >
              I Understand — Return to Examination
            </button>
          </div>
        </div>
      )}

      {/* AUTO-SUBMITTING OVERLAY (when 00:00 hits) */}
      {isAutoSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#C5A059] max-w-md w-full p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-700">
                Time Expired
              </div>
              <h2 className="text-xl font-bold font-display text-[#002366]">
                Automatically Submitting Examination...
              </h2>
              <p className="text-xs text-slate-600">
                The examination time limit has ended. Your responses are being compiled, scored, and registered with the Registrar.
              </p>
            </div>
            <div className="w-8 h-8 border-4 border-[#002366] border-t-[#C5A059] rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

      {isCompleted && attemptResult ? (
        /* Result Screen */
        <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 sm:p-8 shadow-md space-y-8 animate-in zoom-in-95">
          {wasAutoSubmitted && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Notice of Automated Submission:</strong> This examination was automatically submitted and recorded upon expiration of the countdown timer (00:00).
              </div>
            </div>
          )}

          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
              Examination Graded & Confirmed
            </div>
            <h2 className="text-3xl font-bold font-display text-[#002366]">
              {attemptResult.percentage && attemptResult.percentage >= (currentExam.passMarks || 70)
                ? 'Examination Passed With Honors!'
                : 'Examination Graded & Recorded'}
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your examination responses have been evaluated and registered to your academic record at Breakthrough International Bible University.
            </p>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[#F8F9FB] rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 uppercase font-black tracking-wider">Total Score Awarded</div>
              <div className="text-3xl font-black font-display text-[#002366] mt-1">
                {attemptResult.score} / {currentExam.totalMarks || 100}
              </div>
            </div>

            <div className="p-4 bg-[#F8F9FB] rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 uppercase font-black tracking-wider">Percentage Mark</div>
              <div className="text-3xl font-black font-display text-emerald-700 mt-1">
                {attemptResult.percentage}%
              </div>
            </div>

            <div className="p-4 bg-[#F8F9FB] rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 uppercase font-black tracking-wider">Academic Result</div>
              <div className="text-3xl font-black font-display text-[#C5A059] mt-1">
                GRADE: {attemptResult.grade || 'A'}
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold font-display text-[#002366]">
              Question-by-Question Theological Review & Feedback
            </h3>

            <div className="space-y-4">
              {currentExam.questions.map((q, idx) => {
                const userAns = answers[q.id];
                const correct =
                  q.correctAnswer ||
                  (q.options && q.correctAnswerIndex !== undefined
                    ? q.options[q.correctAnswerIndex]
                    : q.correctAnswerText);
                const isCorrect =
                  userAns &&
                  correct &&
                  userAns.toString().trim().toLowerCase() === correct.toString().trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {idx + 1}. {q.prompt || (q as unknown as { questionText?: string }).questionText}
                      </span>
                      <span className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                        isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isCorrect ? `+${q.points || 10} pts (Correct)` : '0 pts'}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      <strong>Your Answer:</strong> {userAns || '(No Answer Provided)'}
                    </div>

                    <div className="text-[#002366] font-semibold">
                      <strong>Standard Theological Answer:</strong> {correct || 'Verified'}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-600 italic">
                        <strong>Exegesis:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('transcript')}
              className="px-6 py-2.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold uppercase tracking-wider text-xs shadow"
            >
              View Updated Academic Transcript →
            </button>

            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider text-xs"
            >
              Return to Student Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Active Exam Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Palette Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Question Matrix</span>
              <span className="text-slate-500 font-medium">
                {answeredCount} of {totalQuestions} answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {currentExam.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = flaggedQuestions.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all relative ${
                      isCurrent
                        ? 'bg-[#002366] text-white ring-2 ring-[#C5A059]'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-1 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Flagged for Review ({flaggedQuestions.length})</span>
              </div>
            </div>

            {/* Finish Exam Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (
                    unansweredCount > 0 &&
                    !window.confirm(
                      `You have ${unansweredCount} unanswered questions. Are you sure you want to finalize and submit?`
                    )
                  ) {
                    return;
                  }
                  handleFinishExam(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Submit Examination Now</span>
              </button>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            {currentQuestion && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                      Question {currentQuestionIndex + 1} of {totalQuestions} • {currentQuestion.topic || 'Hermeneutics'}
                    </span>
                    <div className="text-xs text-slate-500">
                      Points: {currentQuestion.points || 10} • Difficulty: {currentQuestion.difficulty || 'Standard'}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      flaggedQuestions.includes(currentQuestion.id)
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions.includes(currentQuestion.id) ? 'Flagged' : 'Flag Question'}</span>
                  </button>
                </div>

                <div className="text-base font-bold font-display text-[#002366] leading-relaxed">
                  {currentQuestion.prompt || (currentQuestion as unknown as { questionText?: string }).questionText}
                </div>

                {/* Multiple Choice Options */}
                {(currentQuestion.type === 'multiple_choice' || !currentQuestion.type) && currentQuestion.options && (
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = answers[currentQuestion.id] === opt;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectOption(currentQuestion.id, opt)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-[#002366]/5 border-[#002366] text-[#002366] font-bold shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-[#F8F9FB] text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#002366] bg-[#002366] text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* True/False Options */}
                {currentQuestion.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['True', 'False'].map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectOption(currentQuestion.id, opt)}
                          className={`py-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                            isSelected
                              ? 'bg-[#002366] text-white border-[#002366] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-[#F8F9FB]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Short Essay / Open Answer */}
                {(currentQuestion.type === 'short_essay' || (currentQuestion as unknown as { type: string }).type === 'essay') && (
                  <textarea
                    rows={5}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                    placeholder="Provide your theological essay response with exegetical citations..."
                    className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-[#F8F9FB]"
                  />
                )}

                {/* Scripture Match / Other */}
                {currentQuestion.type === 'scripture_match' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
                      placeholder="Enter the corresponding Scripture reference..."
                      className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Prev / Next Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                  className="px-6 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold uppercase tracking-wider shadow hover:bg-[#001A4D] flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => handleFinishExam(false)}
                  className="px-6 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow hover:bg-emerald-800 flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
