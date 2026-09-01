import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Building, Save, CheckCircle2, Globe, Phone, Mail, Award, Sparkles, Megaphone } from 'lucide-react';
import { UniversityInfo } from '../../../types';

export const SiteSettingsTab: React.FC = () => {
  const { universityInfo, updateUniversityInfo } = useApp();
  const [formData, setFormData] = useState<UniversityInfo>(universityInfo);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUniversityInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#C5A059]" />
            <span>University Identity & Global Site Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify institutional branding, public hero headlines, contact details, statistics, and live announcement banners.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Site Settings Updated Live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Urgent Announcement Banner */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
          <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Top Announcement Ticker (Displayed across the site)</span>
          </label>
          <input
            type="text"
            value={formData.announcementTicker || ''}
            onChange={(e) => setFormData({ ...formData, announcementTicker: e.target.value })}
            placeholder="e.g. Fall 2026 Admissions & RPL Applications are now open • Apply online today!"
            className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Core University Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official University Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Acronym / Short Name
            </label>
            <input
              type="text"
              required
              value={formData.shortName}
              onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Institutional Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Latin Motto
            </label>
            <input
              type="text"
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
        </div>

        {/* Public Homepage Hero Headline & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Homepage Hero Headline</span>
            </label>
            <input
              type="text"
              value={formData.heroHeadline || ''}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              placeholder="Equipping Kingdom Leaders, Pastors & Scholars Worldwide"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Homepage Hero Subtitle / Welcome Text
            </label>
            <textarea
              rows={2}
              value={formData.heroSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
        </div>

        {/* Executive Officers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chancellor / President Name
            </label>
            <input
              type="text"
              value={formData.chancellor}
              onChange={(e) => setFormData({ ...formData, chancellor: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chancellor Title
            </label>
            <input
              type="text"
              value={formData.chancellorTitle}
              onChange={(e) => setFormData({ ...formData, chancellorTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              University Registrar Name
            </label>
            <input
              type="text"
              value={formData.registrar}
              onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Campus Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Campus Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admissions Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registrar Email
            </label>
            <input
              type="email"
              value={formData.registrarEmail}
              onChange={(e) => setFormData({ ...formData, registrarEmail: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Headquarters Postal Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
        </div>

        {/* Accreditation Statement & Key Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Accreditation & Institutional Authorization Statement
            </label>
            <textarea
              rows={2}
              value={formData.accreditation}
              onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Established Year
            </label>
            <input
              type="number"
              value={formData.established}
              onChange={(e) => setFormData({ ...formData, established: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Active Nations Count
            </label>
            <input
              type="number"
              value={formData.activeCountries}
              onChange={(e) => setFormData({ ...formData, activeCountries: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Global Alumni Count
            </label>
            <input
              type="number"
              value={formData.alumniCount}
              onChange={(e) => setFormData({ ...formData, alumniCount: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Active Enrollment
            </label>
            <input
              type="number"
              value={formData.currentEnrollment}
              onChange={(e) => setFormData({ ...formData, currentEnrollment: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4 text-[#C5A059]" />
            <span>Save All Global Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
