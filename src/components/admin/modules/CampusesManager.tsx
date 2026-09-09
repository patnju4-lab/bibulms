import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  X,
  Search,
  Globe,
  FileSpreadsheet,
  Edit2,
  Trash2
} from 'lucide-react';
import { AdminCampus } from '../../../types/admin';

interface CampusesManagerProps {
  campuses: AdminCampus[];
  onAddCampus: (campus: AdminCampus) => void;
  onUpdateCampus: (id: string, updates: Partial<AdminCampus>) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const CampusesManager: React.FC<CampusesManagerProps> = ({
  campuses,
  onAddCampus,
  onUpdateCampus,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<AdminCampus | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [countyOrState, setCountyOrState] = useState('');
  const [city, setCity] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [director, setDirector] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [examinationCenter, setExaminationCenter] = useState(true);
  const [studyModes, setStudyModes] = useState<('On-Campus' | 'Online' | 'Hybrid')[]>(['On-Campus', 'Hybrid']);
  const [status, setStatus] = useState<'Active' | 'Under Development' | 'Affiliated'>('Active');

  const filteredCampuses = campuses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.director.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startCreate = () => {
    setEditingCampus(null);
    setName('');
    setCode(`BIBU-CAMP-${Date.now().toString().slice(-3)}`);
    setCountry('United States');
    setCountyOrState('Arizona');
    setCity('Phoenix');
    setPhysicalAddress('');
    setDirector('');
    setTelephone('');
    setEmail('');
    setExaminationCenter(true);
    setStudyModes(['On-Campus', 'Hybrid']);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const startEdit = (c: AdminCampus) => {
    setEditingCampus(c);
    setName(c.name);
    setCode(c.code);
    setCountry(c.country);
    setCountyOrState(c.countyOrState);
    setCity(c.city);
    setPhysicalAddress(c.physicalAddress);
    setDirector(c.director);
    setTelephone(c.telephone);
    setEmail(c.email);
    setExaminationCenter(c.examinationCenter);
    setStudyModes(c.studyMode);
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampus) {
      onUpdateCampus(editingCampus.id, {
        name,
        code,
        country,
        countyOrState,
        city,
        physicalAddress,
        director,
        telephone,
        email,
        examinationCenter,
        studyMode: studyModes,
        status
      });
      onLogAudit('Updated Campus Details', `${name} (${code})`);
      setNotification(`Campus "${name}" updated successfully.`);
    } else {
      const newC: AdminCampus = {
        id: `camp-${Date.now()}`,
        name,
        code,
        country,
        countyOrState,
        city,
        physicalAddress,
        director,
        telephone,
        email,
        examinationCenter,
        studyMode: studyModes,
        status,
        studentCount: 120
      };
      onAddCampus(newC);
      onLogAudit('Established New Campus / Center', `${name} (${code})`);
      setNotification(`Campus "${name}" added to international directory.`);
    }
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleStudyMode = (mode: 'On-Campus' | 'Online' | 'Hybrid') => {
    if (studyModes.includes(mode)) {
      setStudyModes(studyModes.filter(m => m !== mode));
    } else {
      setStudyModes([...studyModes, mode]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Global Campuses & National Examination Centers</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Campus & Regional Center Directory ({campuses.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical hubs, examination centers, appointed directors, and approved delivery study modes across nations.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add Regional Campus</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search campuses by name, code, nation, city, or director..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        />
      </div>

      {/* Campuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCampuses.map((campus) => (
          <div
            key={campus.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#002366] text-[#C5A059]">
                  {campus.code}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    campus.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {campus.status}
                  </span>
                  <button
                    onClick={() => startEdit(campus)}
                    className="p-1 text-slate-400 hover:text-[#002366]"
                    title="Edit Campus"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#002366] leading-tight">
                {campus.name}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">
                    {campus.physicalAddress}, {campus.city}, {campus.countyOrState}, <strong>{campus.country}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-800 truncate">
                    Director: {campus.director}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-mono text-slate-600">
                    {campus.telephone}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-mono text-slate-600 truncate">
                    {campus.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {campus.studyMode.map(mode => (
                  <span key={mode} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                    {mode}
                  </span>
                ))}
              </div>

              {campus.examinationCenter && (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                  Exam Center
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                {editingCampus ? 'Edit Campus Details' : 'Register New Campus Hub'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kigali Rwanda East Africa Center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Development">Under Development</option>
                    <option value="Affiliated">Affiliated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">County / State</label>
                  <input
                    type="text"
                    value={countyOrState}
                    onChange={(e) => setCountyOrState(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street, Building, Floor..."
                  value={physicalAddress}
                  onChange={(e) => setPhysicalAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Director *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rev. Dr. ..."
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telephone *</label>
                  <input
                    type="text"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={examinationCenter}
                    onChange={(e) => setExaminationCenter(e.target.checked)}
                    className="rounded border-slate-300 text-[#002366]"
                  />
                  <span>Designated Examination Center</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Authorized Study Modes:</label>
                <div className="flex gap-4">
                  {(['On-Campus', 'Online', 'Hybrid'] as const).map(mode => (
                    <label key={mode} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={studyModes.includes(mode)}
                        onChange={() => toggleStudyMode(mode)}
                        className="rounded text-[#002366]"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#002366] text-[#C5A059] font-bold uppercase tracking-wider"
                >
                  {editingCampus ? 'Save Updates' : 'Add Campus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
