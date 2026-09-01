import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  Users,
  Flame,
  Globe2,
  Calendar,
  MessageSquare,
  Send,
  Lock,
  UserPlus,
  LogIn,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Shield,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { MinistryFellowshipGroup } from '../../types';

export const GlobalFellowshipsPortal: React.FC = () => {
  const { currentUser, openAuthModal } = useApp();
  const isGuest = currentUser.role === 'guest';

  const [selectedGroup, setSelectedGroup] = useState<string>('fel-pastoral');
  const [activeTab, setActiveTab] = useState<'groups' | 'prayer' | 'discussions'>('groups');
  const [newPrayerRequest, setNewPrayerRequest] = useState('');
  const [prayerName, setPrayerName] = useState(isGuest ? '' : currentUser.name);
  const [prayerCountry, setPrayerCountry] = useState(isGuest ? 'United States' : currentUser.country || 'United States');
  const [prayerSuccess, setPrayerSuccess] = useState(false);

  const [prayerRequests, setPrayerRequests] = useState([
    {
      id: 'pr-1',
      author: 'Pastor Samuel K. Appiah',
      country: 'Ghana',
      date: '2 hours ago',
      title: 'Grace for 3-Day Evangelistic Crusade in Rural Volta Region',
      details: 'Pray for open doors, unhindered preaching of the cross, salvations, and healing among the unreached villages.',
      agreedCount: 48,
      hasAgreed: false
    },
    {
      id: 'pr-2',
      author: 'Rev. Maria Elena Santos',
      country: 'Philippines',
      date: '5 hours ago',
      title: 'Church Plant Building Project & Pastoral Team in Manila',
      details: 'Please intercede for municipal permits, financial provision for sound equipment, and strength for our youth leaders.',
      agreedCount: 34,
      hasAgreed: true
    },
    {
      id: 'pr-3',
      author: 'Chaplain David Sterling',
      country: 'United States',
      date: '1 day ago',
      title: 'Trauma Counseling for Emergency First Responders',
      details: 'Praying for wisdom and divine unction during critical debriefing sessions with firefighter and police personnel.',
      agreedCount: 62,
      hasAgreed: false
    }
  ]);

  const fellowshipGroups: MinistryFellowshipGroup[] = [
    {
      id: 'fel-pastoral',
      title: "Pastoral Leadership & Shepherd's Fellowship",
      code: 'FEL-PST-01',
      category: 'Pastoral',
      description: 'A confidential, sacred forum for senior pastors, associate ministers, and elders to share ministerial wisdom, discuss congregation care, prevent burnout, and sharpen pastoral counseling.',
      coordinator: 'Dr. Thomas E. Wright, Ph.D.',
      coordinatorRole: 'Dean of Biblical Studies • 30+ Years Pastoral Ministry',
      activeMembersCount: 1420,
      meetingSchedule: 'Every Tuesday • 11:00 AM MST / 6:00 PM GMT',
      primaryScripture: '1 Peter 5:2 - "Shepherd the flock of God that is among you..."',
      regions: ['North America', 'West Africa', 'Europe', 'East Africa'],
      topics: ['Expository Preaching', 'Church Governance', 'Ministerial Ethics', 'Pastoral Longevity'],
      bannerGradient: 'from-[#002366] to-[#001A4D]'
    },
    {
      id: 'fel-missions',
      title: 'Global Missions & Cross-Cultural Evangelism',
      code: 'FEL-MIS-02',
      category: 'Missions',
      description: 'Connecting pioneer evangelists, missionary sending organizations, and field workers reaching unreached people groups (UPGs) with cross-cultural strategy and logistical support.',
      coordinator: 'Bishop Arthur T. Ndlovu',
      coordinatorRole: 'Presiding Bishop & Missions Director',
      activeMembersCount: 980,
      meetingSchedule: 'First & Third Thursday • 1:00 PM MST / 8:00 PM GMT',
      primaryScripture: 'Matthew 28:19 - "Go therefore and make disciples of all nations..."',
      regions: ['Global Frontier Belts', 'Asia-Pacific', 'Latin America', 'Africa'],
      topics: ['Frontier Missions', 'Indigenous Church Planting', 'Bible Translation', 'Medical Outreach'],
      bannerGradient: 'from-emerald-900 to-[#002366]'
    },
    {
      id: 'fel-prayer',
      title: '24/7 Global Intercessory Prayer Network',
      code: 'FEL-PRY-03',
      category: 'Prayer',
      description: 'An unbroken global prayer chain covering nations, persecuted churches, theological students, church planting movements, and global spiritual revival around the clock.',
      coordinator: 'Rev. Dr. Sarah M. Jenkins',
      coordinatorRole: 'Academic Registrar & Chapel Director',
      activeMembersCount: 2350,
      meetingSchedule: '24/7 Perpetual Prayer Chain • Daily Morning Devotion 6:00 AM MST',
      primaryScripture: '1 Thessalonians 5:17 - "Pray without ceasing."',
      regions: ['Worldwide Coverage (24 Time Zones)'],
      topics: ['Global Revival', 'Persecuted Church', 'Kingdom Provision', 'Student Anointing'],
      bannerGradient: 'from-purple-900 to-[#002366]'
    },
    {
      id: 'fel-planting',
      title: 'Church Planting & Apostolic Multiplication Incubator',
      code: 'FEL-PLT-04',
      category: 'Leadership',
      description: 'Practical mentorship and strategic peer review for church planters from initial demographical assessment to launch Sunday, team discipleship, and self-sustaining growth.',
      coordinator: 'Rev. Dr. Emmanuel Mensah',
      coordinatorRole: 'General Overseer & Church Multiplication Coach',
      activeMembersCount: 760,
      meetingSchedule: 'Second & Fourth Saturday • 8:00 AM MST / 3:00 PM GMT',
      primaryScripture: 'Acts 14:23 - "And when they had appointed elders for them in every church..."',
      regions: ['Urban Centers', 'Rural Frontiers', 'Suburban Belts'],
      topics: ['Launch Strategy', 'Core Team Building', 'Facility Acquisition', 'Discipleship Systems'],
      bannerGradient: 'from-amber-900 to-[#002366]'
    },
    {
      id: 'fel-chaplaincy',
      title: 'Christian Counseling & Chaplaincy Alliance',
      code: 'FEL-CHP-05',
      category: 'Chaplaincy',
      description: 'Specialized cohort for military, hospital, police, hospice, prison, and corporate chaplains providing crisis intervention, grief support, and biblically grounded clinical pastoral education.',
      coordinator: 'Chaplain Sarah Grace Thornton',
      coordinatorRole: 'Senior Healthcare & Metropolitan Chaplain',
      activeMembersCount: 640,
      meetingSchedule: 'Monthly Last Friday • 2:00 PM MST / 9:00 PM GMT',
      primaryScripture: '2 Corinthians 1:4 - "Who comforts us in all our affliction..."',
      regions: ['Global Institutional Chaplaincies'],
      topics: ['Crisis De-escalation', 'Grief & Bereavement', 'Institutional Ethics', 'Trauma Care'],
      bannerGradient: 'from-teal-900 to-[#002366]'
    }
  ];

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerRequest.trim()) return;

    const newPr = {
      id: `pr-${Date.now()}`,
      author: isGuest ? (prayerName || 'Anonymous Intercessor') : currentUser.name,
      country: prayerCountry,
      date: 'Just now',
      title: newPrayerRequest.slice(0, 50) + (newPrayerRequest.length > 50 ? '...' : ''),
      details: newPrayerRequest,
      agreedCount: 1,
      hasAgreed: true
    };

    setPrayerRequests([newPr, ...prayerRequests]);
    setNewPrayerRequest('');
    setPrayerSuccess(true);
    setTimeout(() => setPrayerSuccess(false), 4000);
  };

  const handleAgreeInPrayer = (id: string) => {
    setPrayerRequests(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            agreedCount: p.hasAgreed ? p.agreedCount - 1 : p.agreedCount + 1,
            hasAgreed: !p.hasAgreed
          };
        }
        return p;
      })
    );
  };

  const currentGroupData = fellowshipGroups.find(g => g.id === selectedGroup) || fellowshipGroups[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="relative bg-[#002366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C5A059] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.2),transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001A4D] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
                <HeartHandshake className="w-4 h-4 text-[#C5A059]" />
                <span>Global Ministerial Coalitions & Prayer Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                Global Ministry Fellowships
              </h1>
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                Uniting pastors, evangelists, church planters, chaplains, and prayer intercessors across 112+ nations for peer encouragement, apostolic strategy, and uninterrupted prayer.
              </p>
            </div>

            <div className="bg-[#001A4D] border-2 border-[#C5A059] p-5 rounded-2xl shadow-xl text-center shrink-0">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#C5A059]">
                5 Active Fellowships
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-300 mt-1">
                6,150+ Global Ministers Connected
              </div>
              <div className="text-[10px] text-[#C5A059] font-mono mt-0.5">
                24/7 Digital Chapel Access
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'groups'
                  ? 'bg-[#C5A059] text-[#002366] font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Ministry Fellowship Cohorts (5)</span>
            </button>

            <button
              onClick={() => setActiveTab('prayer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'prayer'
                  ? 'bg-[#C5A059] text-[#002366] font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>24/7 Global Intercessory Prayer Wall</span>
            </button>
          </div>
        </div>
      </section>

      {/* Guest Lock Callout if Unauthenticated */}
      {isGuest && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-amber-950">
                  Authentication Required to Join Live Zoom Chapels & Discussion Boards
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                  You are browsing fellowship schedules as a visitor. Sign into your institutional account or register to receive direct video links and join the private discussion cohorts.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => openAuthModal('register', 'fellowships', 'Create an account to join the Global Ministry Fellowships.')}
                className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider hover:bg-[#001A4D] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
              <button
                onClick={() => openAuthModal('login', 'fellowships', 'Sign into your account to access live digital chapels.')}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#002366]" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. TAB: FELLOWSHIP COHORTS */}
      {activeTab === 'groups' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Fellowship Selector List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-black uppercase tracking-widest text-[#002366] pb-1">
                Select a Ministry Fellowship:
              </div>

              {fellowshipGroups.map((group) => {
                const isSelected = selectedGroup === group.id;
                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#002366] bg-white shadow-md ring-2 ring-[#002366]/10'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366]">
                        {group.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1 font-mono">
                        <Users className="w-3 h-3 text-[#C5A059]" />
                        {group.activeMembersCount.toLocaleString()} Ministers
                      </span>
                    </div>

                    <h4 className="text-sm font-display font-bold text-[#002366] mt-2 leading-snug">
                      {group.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {group.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{group.meetingSchedule.split('•')[0]}</span>
                      <span className="text-[#002366] font-bold">View Schedule →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Detailed Group Overview */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border-2 border-[#002366] p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#002366] px-2.5 py-0.5 rounded">
                      {currentGroupData.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Active Worldwide Cohort
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-[#002366]">
                    {currentGroupData.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentGroupData.description}
                  </p>
                </div>

                {/* Guiding Scripture */}
                <div className="p-4 bg-[#F8F9FB] rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                    Scriptural Anchor
                  </div>
                  <div className="text-xs font-serif italic text-[#002366] font-bold">
                    {currentGroupData.primaryScripture}
                  </div>
                </div>

                {/* Meeting Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Meeting Schedule & Times
                    </div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{currentGroupData.meetingSchedule}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Coordinator & Overseer
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {currentGroupData.coordinator}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {currentGroupData.coordinatorRole}
                    </div>
                  </div>
                </div>

                {/* Core Discussion Topics */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#002366]">
                    Regular Ministerial Discussion Streams:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentGroupData.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-[#002366]/5 text-[#002366] text-xs font-bold border border-[#002366]/10"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {isGuest ? (
                    <>
                      <div className="text-xs text-slate-500">
                        Create an account to join this cohort's next session.
                      </div>
                      <button
                        onClick={() => openAuthModal('register', 'fellowships', `Join the ${currentGroupData.title}.`)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider hover:bg-[#001A4D] transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Account & Join</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You are registered for {currentGroupData.title}</span>
                      </div>
                      <button
                        onClick={() => alert(`Launching Digital Chapel for ${currentGroupData.title}. Room link sent to ${currentUser.email}.`)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider hover:bg-[#001A4D] transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Enter Digital Chapel Room</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. TAB: 24/7 GLOBAL PRAYER WALL */}
      {activeTab === 'prayer' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                  Intercessory Ministry
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#002366]">
                  24/7 Global Intercessory Prayer Requests
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Post prayer requests for your church, mission field, or family. Thousands of intercessors worldwide agree with you in prayer.
              </p>
            </div>

            {/* Submit Prayer Request Form */}
            <form onSubmit={handlePrayerSubmit} className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C5A059]" />
                <span>Submit a Prayer Request to the Global Intercessory Wall</span>
              </div>

              {isGuest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Your Name / Ministry Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor David Emmanuel"
                      value={prayerName}
                      onChange={(e) => setPrayerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Country / Region
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenya, Ghana, USA"
                      value={prayerCountry}
                      onChange={(e) => setPrayerCountry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Prayer Petition / Kingdom Need:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPrayerRequest}
                  onChange={(e) => setNewPrayerRequest(e.target.value)}
                  placeholder="Share your prayer burden, church need, or healing request..."
                  className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500">
                  "Again I say to you, if two of you agree on earth about anything they ask, it will be done for them..." — Matt 18:19
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Petition</span>
                </button>
              </div>

              {prayerSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your petition has been posted to the global prayer wall. Intercessors are joining in faith.</span>
                </div>
              )}
            </form>

            {/* List of Prayer Requests */}
            <div className="space-y-4 pt-2">
              {prayerRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-[#002366] bg-white space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#002366]">{pr.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {pr.country}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[10px]">{pr.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {pr.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pr.details}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      <strong>{pr.agreedCount}</strong> ministers standing in agreement
                    </span>

                    <button
                      onClick={() => handleAgreeInPrayer(pr.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        pr.hasAgreed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-[#002366] text-[#C5A059] hover:bg-[#001A4D]'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{pr.hasAgreed ? 'Standing in Agreement ✓' : 'Agree in Prayer'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
