import React from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { ShieldCheck, BookOpen, GraduationCap, Award, MapPin, Globe, CheckCircle2, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView, universityInfo } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <UniversityLogo size="xl" withRing className="shadow-lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>Institutional Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#002366]">
          About Breakthrough International Bible University
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto font-normal">
          Founded on uncompromised scripture, academic excellence, and the supernatural empowerment of the Holy Spirit to prepare ministers for world evangelization.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-950 text-white rounded-2xl p-8 border border-blue-900 shadow-md space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Our Sacred Mission</div>
          <h3 className="text-xl font-bold font-serif text-white">To Train, Ordain, and Equip Kingdom Servants</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            "To provide biblically sound, culturally adaptable, and academically rigorous theological education that empowers pastors, missionaries, church planters, educators, and Christian workers to preach the unadulterated gospel of Jesus Christ with power and moral integrity."
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl p-8 shadow-md space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Our Global Vision</div>
          <h3 className="text-xl font-bold font-serif text-slate-950">A World Transformed by Sound Doctrine</h3>
          <p className="text-xs text-slate-900/90 leading-relaxed font-medium">
            "To be a premier global theological institution raising hundreds of thousands of anointed ministers and scholars who establish flourishing, self-reproducing churches in every nation, tribe, and tongue before the glorious return of our Lord Jesus Christ."
          </p>
        </div>
      </div>

      {/* Doctrinal Statement / Statement of Faith */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Theological Foundation</div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">Statement of Faith & Doctrinal Beliefs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-sm text-blue-950">1. The Holy Scriptures</h4>
            <p>
              We believe the Holy Bible, consisting of the 66 canonical books of the Old and New Testaments, to be the verbally inspired Word of God, inerrant in the original autographs, and the supreme and final authority in all matters of faith and conduct.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-sm text-blue-950">2. The Triune Godhead</h4>
            <p>
              We believe in one God, eternally existing in three co-equal persons: Father, Son, and Holy Spirit; identical in essence, equal in power and glory, and having the same divine attributes.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-sm text-blue-950">3. The Person & Work of Jesus Christ</h4>
            <p>
              We believe in the virgin birth, sinless life, substitutionary atoning death on the cross, bodily resurrection, ascension to the right hand of the Father, and imminent bodily return of our Lord Jesus Christ.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-sm text-blue-950">4. The Ministry of the Holy Spirit</h4>
            <p>
              We believe in the baptism in the Holy Spirit with spiritual gifts for ministry empowerment, divine healing, signs and wonders, and the ongoing sanctifying work in the believer’s daily life.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-sm text-blue-950">5. Salvation by Grace Through Faith</h4>
            <p>
              We believe that salvation is the free gift of God offered to humanity by grace alone through faith in Jesus Christ, whose precious blood was shed for the forgiveness of sins.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-sm text-blue-950">6. The Great Commission</h4>
            <p>
              We affirm the sacred obligation of every believer and church to engage passionately in world evangelism, discipleship, church planting, and caring for the impoverished.
            </p>
          </div>
        </div>
      </div>

      {/* University Campus & Accreditation */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Institutional Governance</div>
            <h3 className="text-xl font-bold font-serif text-white">Phoenix, Arizona Campus & Global Online Centers</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Located at {universityInfo.address}, Breakthrough International Bible University operates state-of-the-art broadcast studios, administrative headquarters, and coordination centers supporting over 64 nations.
            </p>
            <div className="text-xs text-amber-300 font-semibold pt-1">
              ✓ {universityInfo.accreditation}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <button
              onClick={() => setCurrentView('admissions')}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all"
            >
              Enroll for Upcoming Term
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              Contact University Admissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
