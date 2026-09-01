import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Globe, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { universityInfo } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    subject: 'Admissions Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-amber-500" />
          <span>Global Institutional Communication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          Contact Breakthrough International Bible University
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our administrative offices in Phoenix, Arizona, along with international study coordinators worldwide, are ready to assist with admissions, transcripts, and faculty inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-white">University Headquarters</h3>
            <p className="text-xs text-slate-300">
              Breakthrough International Bible University (BIBU)
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Physical & Mailing Address</div>
                <div className="text-slate-300 mt-0.5">{universityInfo.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Telephone & Admissions Hotline</div>
                <div className="text-slate-300 mt-0.5">{universityInfo.phone}</div>
                <div className="text-[11px] text-slate-400">Monday – Friday: 8:00 AM – 5:00 PM (MST)</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Direct Email Inquiries</div>
                <div className="text-slate-300 mt-0.5">Admissions: {universityInfo.email}</div>
                <div className="text-slate-300">Registrar: {universityInfo.registrarEmail}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Online LMS Availability</div>
                <div className="text-slate-300 mt-0.5">24 Hours / 7 Days a week across all 64 active countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting Breakthrough International Bible University. An Admissions or Academic Advisor will respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-lg bg-blue-950 text-white text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 border-b border-slate-100 pb-2">
                Send an Inquiry to the Academic Registry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Pastor / Minister Name"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Country of Ministry *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United States, Kenya, UK"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Inquiry Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  >
                    <option value="Admissions Inquiry">Admissions Inquiry</option>
                    <option value="Recognition of Prior Learning (RPL)">Recognition of Prior Learning (RPL)</option>
                    <option value="Academic Transcripts & Verification">Academic Transcripts & Verification</option>
                    <option value="Faculty / Dean Appointment">Faculty / Dean Appointment</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Your Message / Request *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can Breakthrough International Bible University assist your ministry calling?..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit University Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
