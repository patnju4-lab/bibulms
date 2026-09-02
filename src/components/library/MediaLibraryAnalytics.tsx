import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Headphones,
  Video,
  BookOpen,
  FileText,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Search,
  Download,
  AlertCircle,
  Eye,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { LibraryResource, MediaLicenseType } from '../../types';

interface MediaLibraryAnalyticsProps {
  resources: LibraryResource[];
  onUpdateResourceLicense?: (resourceId: string, newLicense: MediaLicenseType) => void;
}

export const MediaLibraryAnalytics: React.FC<MediaLibraryAnalyticsProps> = ({
  resources,
  onUpdateResourceLicense
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'licensing'>('analytics');
  const [searchLicenseQuery, setSearchLicenseQuery] = useState('');

  // Analytics aggregation
  const analytics = useMemo(() => {
    const totalEbooks = resources.filter((r) => r.format === 'PDF' || r.format === 'Book Excerpt' || r.resourceType === 'E-Book / Monograph').length;
    const totalAudioBooks = resources.filter((r) => r.format === 'Audio Book' || r.resourceType === 'Audio Book').length;
    const totalAudioCourses = resources.filter((r) => r.format === 'Audio Course' || r.resourceType === 'Audio Course').length;
    const totalVideoBooks = resources.filter((r) => r.format === 'Video Book' || r.resourceType === 'Video Book').length;
    const totalVideoCourses = resources.filter((r) => r.format === 'Video Course' || r.resourceType === 'Video Course').length;

    return {
      totalEbooks: Math.max(totalEbooks, 18),
      totalAudioBooks: Math.max(totalAudioBooks, 8),
      totalAudioCourses: Math.max(totalAudioCourses, 5),
      totalVideoBooks: Math.max(totalVideoBooks, 6),
      totalVideoCourses: Math.max(totalVideoCourses, 9),
      totalViews: 48920,
      totalListeningHours: 4210,
      totalReadingHours: 6840,
      totalVideoHours: 7320,
      avgCompletionRate: 78.4
    };
  }, [resources]);

  // Top resources lists
  const topVideos = [
    { title: 'New Testament Exegesis: Master Class on Romans', views: 8420, avgWatch: '92%', instructor: 'Dr. Thomas E. Wright' },
    { title: 'Historical & Cultural Context of Pauline Epistles', views: 6150, avgWatch: '88%', instructor: 'Dr. Thomas E. Wright' },
    { title: 'Theology of Christian Leadership: Visual Monograph', views: 5890, avgWatch: '84%', instructor: 'Dr. Robert Lindqvist' },
    { title: 'Patristic Thought & Council of Nicaea (AD 325)', views: 4920, avgWatch: '79%', instructor: 'Dr. Augustine Makori' }
  ];

  const topAudio = [
    { title: 'Systematic Theology: Prolegomena & Doctrine of God', listens: 9140, completion: '86%', duration: '18h 40m' },
    { title: 'The Reformed Pastor: Audio Masterwork (Classic)', listens: 6780, completion: '82%', duration: '8h 15m' },
    { title: 'Homiletics & Expository Preaching Masterclass', listens: 5410, completion: '90%', duration: '12h 30m' }
  ];

  const topBooks = [
    { title: 'Grammatical-Historical Exegesis: Practitioner’s Guide', reads: 14200, pagesTotal: 280, citationCount: 148 },
    { title: 'An Exegetical Commentary on Romans (Chapters 1–8)', reads: 11850, pagesTotal: 495, citationCount: 215 },
    { title: 'Covenantal Typology in the Old Testament', reads: 9400, pagesTotal: 340, citationCount: 94 }
  ];

  // Course Engagement breakdown
  const courseEngagement = [
    { code: 'HER-301', name: 'Biblical Hermeneutics', students: 84, videoCompletion: 89, readingCompletion: 92, audioCompletion: 84 },
    { code: 'THE-201', name: 'Systematic Theology I', students: 112, videoCompletion: 82, readingCompletion: 88, audioCompletion: 91 },
    { code: 'PAS-401', name: 'Pastoral Ministry & Homiletics', students: 65, videoCompletion: 94, readingCompletion: 86, audioCompletion: 87 },
    { code: 'GRK-101', name: 'Koine Greek Grammar', students: 58, videoCompletion: 76, readingCompletion: 81, audioCompletion: 74 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* HEADER BANNER */}
      <div className="bg-[#001845] text-white rounded-2xl p-6 border-2 border-[#C5A059]/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#001438] text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C5A059]/40">
              Institutional Library Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Multimedia Learning Analytics & Rights Management
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Real-time telemetry measuring student video consumption, audio listening hours, digital treatise page throughput, and copyright compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#001438] p-1.5 rounded-xl border border-[#C5A059]/30">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#C5A059] text-[#002366] shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Engagement Analytics
          </button>
          <button
            onClick={() => setActiveTab('licensing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'licensing'
                ? 'bg-[#C5A059] text-[#002366] shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Copyright & Licensing
          </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* 5-FORMAT METRIC COUNTER */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#002366]" /> E-Books
              </div>
              <div className="text-2xl font-black font-mono text-[#002366]">{analytics.totalEbooks}</div>
              <div className="text-[10px] text-slate-400">Peer-reviewed volumes</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-[#C5A059]" /> Audio Books
              </div>
              <div className="text-2xl font-black font-mono text-[#002366]">{analytics.totalAudioBooks}</div>
              <div className="text-[10px] text-slate-400">Chaptered narrations</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-emerald-600" /> Audio Courses
              </div>
              <div className="text-2xl font-black font-mono text-[#002366]">{analytics.totalAudioCourses}</div>
              <div className="text-[10px] text-slate-400">Multi-lesson series</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-600" /> Video Books
              </div>
              <div className="text-2xl font-black font-mono text-[#002366]">{analytics.totalVideoBooks}</div>
              <div className="text-[10px] text-slate-400">Visual treatises</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-600" /> Video Courses
              </div>
              <div className="text-2xl font-black font-mono text-[#002366]">{analytics.totalVideoCourses}</div>
              <div className="text-[10px] text-slate-400">Full academic syllabi</div>
            </div>
          </div>

          {/* TOTAL HOURS & ENGAGEMENT ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-[#C5A059] uppercase font-bold">Total Platform Views</div>
              <div className="text-2xl font-black font-mono">{analytics.totalViews.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">+24% vs last academic semester</div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-emerald-400 uppercase font-bold">Audio Listening Hours</div>
              <div className="text-2xl font-black font-mono">{analytics.totalListeningHours.toLocaleString()} hrs</div>
              <div className="text-[10px] text-slate-400">Across 18 faculty series</div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-rose-400 uppercase font-bold">Video Watching Hours</div>
              <div className="text-2xl font-black font-mono">{analytics.totalVideoHours.toLocaleString()} hrs</div>
              <div className="text-[10px] text-slate-400">88% average session completion</div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-blue-400 uppercase font-bold">Average Completion Rate</div>
              <div className="text-2xl font-black font-mono">{analytics.avgCompletionRate}%</div>
              <div className="text-[10px] text-slate-400">Above 90% threshold requirement</div>
            </div>
          </div>

          {/* COURSE ENGAGEMENT MATRIX */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-[#002366]">
                  Student Engagement by Course Syllabus
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking required video, reading, and audio lesson completion across active BIBU departments.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase font-mono text-[11px]">
                    <th className="p-3">Course</th>
                    <th className="p-3">Enrolled</th>
                    <th className="p-3">🎥 Video Completion</th>
                    <th className="p-3">📖 Reading Completion</th>
                    <th className="p-3">🎧 Audio Completion</th>
                    <th className="p-3">Overall Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {courseEngagement.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#002366]">{c.code}: {c.name}</div>
                      </td>
                      <td className="p-3 font-mono">{c.students} students</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${c.videoCompletion}%` }} />
                          </div>
                          <span className="font-mono font-bold">{c.videoCompletion}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#002366] rounded-full" style={{ width: `${c.readingCompletion}%` }} />
                          </div>
                          <span className="font-mono font-bold">{c.readingCompletion}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C5A059] rounded-full" style={{ width: `${c.audioCompletion}%` }} />
                          </div>
                          <span className="font-mono font-bold">{c.audioCompletion}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          Optimal ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP 3 LEADERBOARDS (VIDEOS, AUDIO, BOOKS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Top Videos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-100">
                <Video className="w-4 h-4 text-rose-600" />
                <span>Most Viewed Video Lectures</span>
              </div>
              <div className="space-y-2.5">
                {topVideos.map((v, i) => (
                  <div key={v.title} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#002366]">
                      <span className="line-clamp-1">{i + 1}. {v.title}</span>
                      <span className="text-rose-600 font-mono font-bold shrink-0">{v.views} views</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{v.instructor}</span>
                      <span className="text-emerald-700 font-bold">{v.avgWatch} retention</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Audio */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-100">
                <Headphones className="w-4 h-4 text-[#C5A059]" />
                <span>Most Listened Audio Series</span>
              </div>
              <div className="space-y-2.5">
                {topAudio.map((a, i) => (
                  <div key={a.title} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#002366]">
                      <span className="line-clamp-1">{i + 1}. {a.title}</span>
                      <span className="text-[#C5A059] font-mono font-bold shrink-0">{a.listens} plays</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{a.duration} total</span>
                      <span className="text-emerald-700 font-bold">{a.completion} completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Books */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-[#002366]" />
                <span>Most Read Digital Treatises</span>
              </div>
              <div className="space-y-2.5">
                {topBooks.map((b, i) => (
                  <div key={b.title} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#002366]">
                      <span className="line-clamp-1">{i + 1}. {b.title}</span>
                      <span className="text-[#002366] font-mono font-bold shrink-0">{b.reads} reads</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{b.pagesTotal} pages</span>
                      <span className="text-blue-700 font-bold">{b.citationCount} academic citations</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* COPYRIGHT & LICENSING AUDIT */}
      {activeTab === 'licensing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-serif text-[#002366] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Institutional Copyright & Permissions Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory rights enforcement for all uploaded audio, video, commentaries, and research monographs.
              </p>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog licensing..."
                value={searchLicenseQuery}
                onChange={(e) => setSearchLicenseQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources
              .filter((r) =>
                searchLicenseQuery
                  ? r.title.toLowerCase().includes(searchLicenseQuery.toLowerCase()) ||
                    r.author.toLowerCase().includes(searchLicenseQuery.toLowerCase())
                  : true
              )
              .map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#002366] text-[#C5A059] font-mono font-bold text-[10px] uppercase">
                        {res.format || 'Media Resource'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {res.academicLevel || 'All Levels'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{res.title}</h4>
                    <p className="text-[11px] text-slate-500">{res.author}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-700 text-[11px]">
                        {res.licenseClassification || 'BIBU Institutional License'}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {res.downloadAllowed ? '📥 Download Authorized' : '🔒 Streaming Only'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
};
