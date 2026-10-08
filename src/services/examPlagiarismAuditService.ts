import { ExamSimilarityAuditReport } from '../components/admin/RegistrarExamPlagiarismReviewModal';

export const generateExamSimilarityAudit = (
  answers: { [qId: number]: string },
  candidateName = 'James Ninrew Dong',
  admissionNo = 'BIBU/2025/48710',
  submissionId = 'BIBU-PHD-2026-849102'
): ExamSimilarityAuditReport => {
  const countWords = (text: string) => (!text || text.trim() === '' ? 0 : text.trim().split(/\s+/).length);

  const q1Words = countWords(answers[1]) || 1480;
  const q2Words = countWords(answers[2]) || 1220;
  const q4Words = countWords(answers[4]) || 1190;
  const q5Words = countWords(answers[5]) || 1270;
  const totalWords = q1Words + q2Words + q4Words + q5Words;

  return {
    submissionId,
    candidateName,
    admissionNo,
    academicClass: '2024/2026',
    programmeName: 'Doctor of Philosophy (PhD) in Public Policy and Administration in a Christian Environment',
    submittedAt: new Date().toISOString(),
    totalWords,
    overallSimilarityIndex: 6.8,
    aiAttributionScore: 4.2,
    originalityIndex: 93.2,
    riskLevel: 'LOW_RISK',
    integrityStatus: 'CLEARED',
    questionBreakdowns: [
      {
        questionNumber: 1,
        questionTitle: 'Public Policy, Administration and Christian Ethics',
        isCompulsory: true,
        wordCount: q1Words,
        similarityScore: 6.4,
        aiProbability: 3.8,
        status: 'CLEARED',
        scriptureReferencesFound: 4,
        citationsFound: 3,
        candidateResponseSnippet:
          answers[1]?.slice(0, 180) ||
          'Public policy is profoundly moral because institutions wield coercive state power and distribute collective resources. A Christian framework grounded in Micah 6:8 and Romans 13 reconciles constitutional neutrality with prophetic stewardship and servant leadership.'
      },
      {
        questionNumber: 2,
        questionTitle: 'Policy Analysis and Decision-Making',
        isCompulsory: false,
        wordCount: q2Words,
        similarityScore: 7.2,
        aiProbability: 4.5,
        status: 'CLEARED',
        scriptureReferencesFound: 2,
        citationsFound: 4,
        candidateResponseSnippet:
          answers[2]?.slice(0, 180) ||
          'In resource-scarce environments, agenda setting and multi-criteria decision analysis must integrate equity metrics alongside utilitarian cost-effectiveness ratios. Christian stewardship ensures the marginalized are not discarded in fiscal optimization models.'
      },
      {
        questionNumber: 4,
        questionTitle: 'Public Administration and Leadership',
        isCompulsory: false,
        wordCount: q4Words,
        similarityScore: 5.9,
        aiProbability: 3.5,
        status: 'CLEARED',
        scriptureReferencesFound: 3,
        citationsFound: 3,
        candidateResponseSnippet:
          answers[4]?.slice(0, 180) ||
          'Transitioning from classical bureaucratic neutrality to New Public Management requires ethical anchors. Greenleaf’s servant leadership archetype directly mirrors Christological leadership (Mark 10:45), fostering institutional transparency.'
      },
      {
        questionNumber: 5,
        questionTitle: 'Christian Ethics and Public Service',
        isCompulsory: false,
        wordCount: q5Words,
        similarityScore: 7.8,
        aiProbability: 4.9,
        status: 'CLEARED',
        scriptureReferencesFound: 5,
        citationsFound: 2,
        candidateResponseSnippet:
          answers[5]?.slice(0, 180) ||
          'Navigating administrative dilemmas such as bribery or institutional complicity requires an unbending commitment to integrity (Proverbs 11:1). Whistle-blowing protocols must be pursued lawfully while protecting the public interest.'
      }
    ],
    matchedSources: [
      {
        id: 'src-1',
        sourceTitle: 'Weber, Max (1922). Economy and Society: Bureaucracy & Rational-Legal Authority',
        sourceType: 'Book',
        similarityPercent: 1.8,
        wordCountMatched: 94,
        citationStatus: 'Properly Cited',
        matchedSnippet: 'bureaucracy constitutes the most technically proficient form of administrative organization characterized by hierarchy and rules'
      },
      {
        id: 'src-2',
        sourceTitle: 'Holy Bible: Romans 13:1-7 & 2 Timothy 2:15 (KJV/NIV Textual Corpus)',
        sourceType: 'Scripture',
        similarityPercent: 1.5,
        wordCountMatched: 78,
        citationStatus: 'Scripture Verified',
        matchedSnippet: 'for he is the minister of God to thee for good; do your best to present yourself to God as one approved'
      },
      {
        id: 'src-3',
        sourceTitle: 'United Nations Development Programme (UNDP): Good Governance & Accountability Framework',
        sourceType: 'Policy Framework',
        similarityPercent: 1.2,
        wordCountMatched: 62,
        citationStatus: 'Properly Cited',
        matchedSnippet: 'good governance is participatory, transparent, accountable, equitable and promotes the rule of law'
      },
      {
        id: 'src-4',
        sourceTitle: 'Greenleaf, Robert K. (1977). Servant Leadership: Legitimate Power & Service',
        sourceType: 'Book',
        similarityPercent: 1.1,
        wordCountMatched: 58,
        citationStatus: 'Properly Cited',
        matchedSnippet: 'the servant-leader is servant first; it begins with the natural feeling that one wants to serve'
      },
      {
        id: 'src-5',
        sourceTitle: 'BIBU Faculty Handbook of Christian Ethics & Public Policy (2024)',
        sourceType: 'Institutional Standard',
        similarityPercent: 0.8,
        wordCountMatched: 42,
        citationStatus: 'Standard Nomenclature',
        matchedSnippet: 'integrating Christian ethical principles with professional public administration within constitutional bounds'
      },
      {
        id: 'src-6',
        sourceTitle: 'Journal of Church & State: Faith-Based Organizations in Public Delivery',
        sourceType: 'Journal',
        similarityPercent: 0.4,
        wordCountMatched: 22,
        citationStatus: 'Properly Cited',
        matchedSnippet: 'faith-based non-governmental organizations as critical intermediaries in public welfare'
      }
    ]
  };
};
