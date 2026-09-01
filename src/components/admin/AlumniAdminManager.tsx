import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Alumni } from '../../types/alumni';
import { COUNTRIES_50_PLUS, GRADUATION_YEARS_10, OFFICIAL_BIBU_PROGRAMS } from '../../data/alumniData';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Download,
  Search,
  Filter,
  Users,
  Building,
  GraduationCap,
  Save,
  RotateCcw,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { AlumniStatistics } from './AlumniStatistics';

export const AlumniAdminManager: React.FC = () => {
  const { alumniList, addAlumni, updateAlumni, deleteAlumni, importAlumniRecords } = useApp();

  const [activeTab, setActiveTab] = useState<'manage' | 'stats' | 'add' | 'import'>('manage');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<number | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    country: 'Kenya',
    city: 'Nairobi',
    email: '',
    phone: '',
    graduation_year: 2024,
    graduation_date: '2024-08-15',
    program_name: 'Bachelor of Theology (B.Th)',
    qualification_level: 'Bachelor',
    campus: 'Online Global Center',
    study_mode: 'Distance Learning',
    current_position: 'Senior Pastor',
    organization: 'Christ Faith Tabernacle',
    profession: 'Pastoral Ministry & Theological Leadership',
    ministry: 'Pastoral Ministry & Outreach',
    biography: '',
    achievements: '',
    verification_status: 'Verified Alumni',
    privacy_status: 'Public Directory',
  });

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [importResult, setImportResult] = useState<{ successCount: number; errors: string[] } | null>(null);

  // Filtered List
  const filteredAlumni = alumniList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.full_name.toLowerCase().includes(q) ||
      item.alumni_id.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q) ||
      item.program_name.toLowerCase().includes(q);

    const matchesYear = filterYear === 'All' || item.graduation_year === filterYear;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Verified' && item.verification_status === 'Verified Alumni') ||
      (filterStatus === 'Demo' && (item.verification_status === 'Demo Record' || item.is_demo));

    return matchesSearch && matchesYear && matchesStatus;
  });

  // Handle Form Submit
  const handleSaveAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    const achievementsArray = formData.achievements
      ? formData.achievements.split('\n').map((s) => s.trim()).filter(Boolean)
      : ['BIBU Academic Credential'];

    const fullName = `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}`;

    if (editingAlumni) {
      updateAlumni(editingAlumni.id, {
        ...formData,
        full_name: fullName,
        achievements: achievementsArray,
      });
      setEditingAlumni(null);
    } else {
      addAlumni({
        alumni_id: `BIBU-ALM-${formData.graduation_year}-${Math.floor(1000 + Math.random() * 9000)}`,
        student_id: `STD-${formData.graduation_year}-${Math.floor(1000 + Math.random() * 9000)}`,
        certificate_number: `BIBU-CRT-${formData.graduation_year}-${Math.floor(10000 + Math.random() * 90000)}`,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        full_name: fullName,
        country: formData.country,
        country_code: COUNTRIES_50_PLUS.find((c) => c.name === formData.country)?.code || 'XX',
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        graduation_year: formData.graduation_year,
        graduation_date: formData.graduation_date,
        program_id: `prog-${Date.now()}`,
        program_name: formData.program_name,
        qualification_level: formData.qualification_level,
        campus: formData.campus,
        study_mode: formData.study_mode,
        current_position: formData.current_position,
        organization: formData.organization,
        profession: formData.profession,
        ministry: formData.ministry,
        biography: formData.biography || `Verified graduate of Breakthrough International Bible University, Class of ${formData.graduation_year}.`,
        achievements: achievementsArray,
        verification_status: formData.verification_status as any,
        privacy_status: formData.privacy_status as any,
        is_demo: false,
      });
    }

    setActiveTab('manage');
    // Reset Form
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      country: 'Kenya',
      city: 'Nairobi',
      email: '',
      phone: '',
      graduation_year: 2024,
      graduation_date: '2024-08-15',
      program_name: 'Bachelor of Theology (B.Th)',
      qualification_level: 'Bachelor',
      campus: 'Online Global Center',
      study_mode: 'Distance Learning',
      current_position: 'Senior Pastor',
      organization: 'Christ Faith Tabernacle',
      profession: 'Pastoral Ministry & Theological Leadership',
      ministry: 'Pastoral Ministry & Outreach',
      biography: '',
      achievements: '',
      verification_status: 'Verified Alumni',
      privacy_status: 'Public Directory',
    });
  };

  // Handle CSV Import
  const handleCsvImport = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setImportResult({ successCount: 0, errors: ['CSV must have a header row and at least 1 data row.'] });
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
    const records: Partial<Alumni>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle simple CSV parsing
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const obj: any = {};

      headers.forEach((h, index) => {
        const val = values[index];
        if (h === 'first_name' || h === 'firstname') obj.first_name = val;
        else if (h === 'middle_name' || h === 'middlename') obj.middle_name = val;
        else if (h === 'last_name' || h === 'lastname') obj.last_name = val;
        else if (h === 'country') obj.country = val;
        else if (h === 'city') obj.city = val;
        else if (h === 'email') obj.email = val;
        else if (h === 'phone') obj.phone = val;
        else if (h === 'graduation_year' || h === 'year') obj.graduation_year = Number(val);
        else if (h === 'program_name' || h === 'program') obj.program_name = val;
        else if (h === 'qualification_level' || h === 'level') obj.qualification_level = val;
        else if (h === 'current_position' || h === 'position') obj.current_position = val;
        else if (h === 'organization') obj.organization = val;
        else if (h === 'ministry') obj.ministry = val;
        else if (h === 'certificate_number' || h === 'certificate') obj.certificate_number = val;
        else if (h === 'alumni_id' || h === 'id') obj.alumni_id = val;
      });

      records.push(obj);
    }

    const result = importAlumniRecords(records);
    setImportResult(result);
    if (result.successCount > 0) {
      setCsvText('');
    }
  };

  // Sample CSV Template
  const sampleCsvContent = `first_name,last_name,country,city,graduation_year,program_name,qualification_level,current_position,organization,certificate_number
Samuel,Osei,Ghana,Accra,2023,Doctor of Ministry (D.Min) in Christian Leadership,Doctorate,Senior Pastor,Grace Harvest Chapel,BIBU-CRT-2023-88210
Grace,Mwangi,Kenya,Nairobi,2024,Master of Divinity (M.Div),Master,Director of Pastoral Care,Nairobi Christian Centre,BIBU-CRT-2024-91420
Marcus,Johnson,United States,Atlanta,2022,Bachelor of Theology (B.Th),Bachelor,Lead Evangelist,Redeemed Covenant Church,BIBU-CRT-2022-77190`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Registrar & Academic Secretariat</span>
          </div>
          <h2 className="text-2xl font-display font-black text-[#002366]">
            Alumni Database Management & Import
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain official graduation records (2017–2026), import verified cohorts, and replace development demo records.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'manage'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Records ({alumniList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Real-Time Statistics</span>
          </button>
          <button
            onClick={() => {
              setEditingAlumni(null);
              setActiveTab('add');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'add'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Graduate</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'import'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>CSV Batch Import</span>
          </button>
        </div>
      </div>

      {/* TAB: STATS */}
      {activeTab === 'stats' && <AlumniStatistics />}

      {/* TAB 1: MANAGE RECORDS */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, country, or program..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
            >
              <option value="All">All Years (2017–2026)</option>
              {GRADUATION_YEARS_10.map((yr) => (
                <option key={yr} value={yr}>
                  Class of {yr}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
            >
              <option value="All">All Verification Statuses</option>
              <option value="Verified">Verified Official Records</option>
              <option value="Demo">Demo Records (To Replace)</option>
            </select>
          </div>

          {/* Records Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#002366] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Alumni ID & Name</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Program & Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAlumni.map((alum) => (
                    <tr key={alum.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#002366]">{alum.full_name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{alum.alumni_id}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {alum.country} ({alum.city})
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#002366]">
                        {alum.graduation_year}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{alum.program_name}</div>
                        <span className="text-[9px] font-bold text-[#C5A059] bg-[#002366]/10 px-1 py-0.5 rounded">
                          {alum.qualification_level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {alum.verification_status === 'Verified Alumni' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">
                            Demo Record
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingAlumni(alum);
                            setFormData({
                              first_name: alum.first_name,
                              middle_name: alum.middle_name || '',
                              last_name: alum.last_name,
                              country: alum.country,
                              city: alum.city,
                              email: alum.email,
                              phone: alum.phone || '',
                              graduation_year: alum.graduation_year,
                              graduation_date: alum.graduation_date,
                              program_name: alum.program_name,
                              qualification_level: alum.qualification_level,
                              campus: alum.campus || 'Online Global Center',
                              study_mode: alum.study_mode || 'Distance Learning',
                              current_position: alum.current_position,
                              organization: alum.organization,
                              profession: alum.profession || '',
                              ministry: alum.ministry || '',
                              biography: alum.biography,
                              achievements: (alum.achievements || []).join('\n'),
                              verification_status: alum.verification_status,
                              privacy_status: alum.privacy_status,
                            });
                            setActiveTab('add');
                          }}
                          className="p-1.5 rounded-lg text-[#002366] hover:bg-slate-100"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${alum.full_name}?`)) {
                              deleteAlumni(alum.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD / EDIT GRADUATE */}
      {activeTab === 'add' && (
        <form onSubmit={handleSaveAlumni} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-[#002366]">
              {editingAlumni ? `Editing ${editingAlumni.full_name}` : 'Register New BIBU Graduate'}
            </h3>
            {editingAlumni && (
              <span className="text-xs font-mono text-slate-400">ID: {editingAlumni.alumni_id}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Middle Name</label>
              <input
                type="text"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Country * (50+ Nations)</label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
              >
                {COUNTRIES_50_PLUS.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Region *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Graduation Year * (2017–2026)</label>
              <select
                required
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
              >
                {GRADUATION_YEARS_10.map((yr) => (
                  <option key={yr} value={yr}>
                    Class of {yr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Program *</label>
              <select
                required
                value={formData.program_name}
                onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
              >
                {OFFICIAL_BIBU_PROGRAMS.map((prog, idx) => (
                  <option key={idx} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Qualification Level *</label>
              <select
                required
                value={formData.qualification_level}
                onChange={(e) => setFormData({ ...formData, qualification_level: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="Doctorate">Doctorate (PhD / DMin / ThD)</option>
                <option value="Master">Master's (MDiv / MA / MTS)</option>
                <option value="Bachelor">Bachelor's (BTh / BBS / BA)</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Position / Title</label>
              <input
                type="text"
                value={formData.current_position}
                onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization / Church</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Verification Status</label>
              <select
                value={formData.verification_status}
                onChange={(e) => setFormData({ ...formData, verification_status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-emerald-800"
              >
                <option value="Verified Alumni">✓ Verified Alumni (Official)</option>
                <option value="Demo Record">Demo Record (Development)</option>
                <option value="Pending Verification">Pending Verification</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Biography / Testimony</label>
              <textarea
                rows={3}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
                placeholder="Brief summary of ministry, leadership impact, and calling..."
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Key Achievements (One per line)</label>
              <textarea
                rows={2}
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                placeholder="Planted 5 churches&#10;Author of Christian Leadership book"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider hover:bg-[#001A4D] flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingAlumni ? 'Update Graduate' : 'Save & Publish Graduate'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: BATCH CSV IMPORT */}
      {activeTab === 'import' && (
        <div className="space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#002366] font-bold text-sm">
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>Bulk Verified Alumni Data Import</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste CSV data below to import official cohorts from graduation lists. The system will automatically generate official Alumni IDs, verify country codes, and integrate records into the global search.
            </p>
            <button
              type="button"
              onClick={() => setCsvText(sampleCsvContent)}
              className="text-xs font-bold text-[#002366] hover:underline inline-flex items-center gap-1"
            >
              <Download className="w-3 h-3 text-[#C5A059]" />
              <span>Load Sample CSV Template</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Paste CSV Content:
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="first_name,last_name,country,city,graduation_year,program_name,qualification_level,current_position,organization,certificate_number..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>

          {importResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                importResult.successCount > 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {importResult.successCount > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>
                  Successfully imported {importResult.successCount} verified alumni record(s).
                </span>
              </div>
              {importResult.errors.length > 0 && (
                <ul className="list-disc pl-5 text-red-700 space-y-1">
                  {importResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCsvImport}
              disabled={!csvText.trim()}
              className="px-6 py-2.5 bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#001A4D] disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Import Records Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
