import React, { useState, useMemo } from 'react';
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
  BarChart3,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  FileSpreadsheet,
  Check,
  Globe,
  Award
} from 'lucide-react';
import { AlumniStatistics } from './AlumniStatistics';
import {
  RAW_NAKURU_2022_GRADUATES,
  RawNakuruGraduateRecord,
  MigrationReport
} from '../../utils/nakuruGraduatesMigration';
import {
  RAW_2020_GRADUATES,
  Raw2020GraduateRecord,
  Migration2020Report,
  export2020GraduatesToCsv
} from '../../utils/graduates2020Migration';

export const AlumniAdminManager: React.FC = () => {
  const {
    alumniList,
    addAlumni,
    updateAlumni,
    deleteAlumni,
    importAlumniRecords,
    runNakuru2022Migration,
    run2020GraduatesMigration,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'manage' | 'stats' | 'add' | 'import'>('manage');
  const [cohortTab, setCohortTab] = useState<'2020' | '2022' | 'generic'>('2020');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<number | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  // 2020 Convocation Global Migration States
  const [migration2020Report, setMigration2020Report] = useState<Migration2020Report | null>(null);
  const [show2020Preview, setShow2020Preview] = useState<boolean>(false);
  const [is2020Migrating, setIs2020Migrating] = useState<boolean>(false);
  const [preview2020Search, setPreview2020Search] = useState<string>('');
  const [preview2020Country, setPreview2020Country] = useState<string>('All');
  const [preview2020Level, setPreview2020Level] = useState<string>('All');

  // 2022 Nakuru Mother's Chapter Migration States
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);
  const [showNakuruPreview, setShowNakuruPreview] = useState<boolean>(false);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

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

  // Handle 2020 Global Convocation Migration
  const handleRun2020Migration = () => {
    setIs2020Migrating(true);
    setTimeout(() => {
      try {
        const report = run2020GraduatesMigration();
        setMigration2020Report(report);
      } finally {
        setIs2020Migrating(false);
      }
    }, 300);
  };

  const load2020Csv = () => {
    const csv = export2020GraduatesToCsv();
    setCsvText(csv);
    setCohortTab('generic');
  };

  const download2020CsvFile = () => {
    const csv = export2020GraduatesToCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BIBU_2020_Convocation_Graduates_669.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered2020Preview = useMemo(() => {
    return RAW_2020_GRADUATES.filter((g) => {
      if (preview2020Country !== 'All' && g.country !== preview2020Country) return false;
      if (
        preview2020Level !== 'All' &&
        !g.qualificationLevel.toLowerCase().includes(preview2020Level.toLowerCase())
      )
        return false;
      if (preview2020Search.trim()) {
        const q = preview2020Search.toLowerCase();
        const matchName = g.name.toLowerCase().includes(q);
        const matchReg = g.regNo.toLowerCase().includes(q);
        const matchCampus = g.campus.toLowerCase().includes(q);
        const matchEmail = g.email.toLowerCase().includes(q);
        const matchMobile = g.mobile.toLowerCase().includes(q);
        const matchProg = g.programName.toLowerCase().includes(q);
        if (
          !matchName &&
          !matchReg &&
          !matchCampus &&
          !matchEmail &&
          !matchMobile &&
          !matchProg
        )
          return false;
      }
      return true;
    });
  }, [preview2020Country, preview2020Level, preview2020Search]);

  // Handle 2022 Nakuru Mother's Chapter Migration
  const handleRunNakuruMigration = () => {
    setIsMigrating(true);
    setTimeout(() => {
      try {
        const report = runNakuru2022Migration();
        setMigrationReport(report);
      } finally {
        setIsMigrating(false);
      }
    }, 250);
  };

  const loadNakuruCsv = () => {
    const csvHeader = 'name,mobile,email,reg_no,graduation_year,program_name,qualification_level,campus';
    const csvRows = RAW_NAKURU_2022_GRADUATES.map(
      (g) => `"${g.name}","${g.mobile}","${g.email}","${g.regNo}",2022,"Honorary Doctorate of Divinity (D.Div. Honoris Causa)","Honorary Doctorate","Nakuru Mother's Chapter / Central Rift"`
    );
    setCsvText([csvHeader, ...csvRows].join('\n'));
  };

  // Handle CSV Import
  const handleCsvImport = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setImportResult({ successCount: 0, errors: ['CSV must have a header row and at least 1 data row.'] });
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    const records: Partial<Alumni>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle simple CSV parsing
      const values = line.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const obj: any = {};

      headers.forEach((h, index) => {
        const val = values[index];
        if (!val) return;
        if (h === 'first_name' || h === 'firstname') obj.first_name = val;
        else if (h === 'middle_name' || h === 'middlename') obj.middle_name = val;
        else if (h === 'last_name' || h === 'lastname') obj.last_name = val;
        else if (h === 'name' || h === 'full_name' || h === 'fullname') obj.full_name = val;
        else if (h === 'country') obj.country = val;
        else if (h === 'city') obj.city = val;
        else if (h === 'email') obj.email = val.trim().toLowerCase();
        else if (h === 'phone' || h === 'mobile' || h === 'telephone' || h === 'contact') obj.phone = val.trim();
        else if (h === 'student_id' || h === 'reg_no' || h === 'regno' || h === 'registration_number' || h === 'reg no') obj.student_id = val.trim();
        else if (h === 'graduation_year' || h === 'year' || h === 'grad_year') obj.graduation_year = Number(val);
        else if (h === 'program_name' || h === 'program' || h === 'degree') obj.program_name = val;
        else if (h === 'qualification_level' || h === 'level') obj.qualification_level = val;
        else if (h === 'campus') obj.campus = val;
        else if (h === 'current_position' || h === 'position' || h === 'role') obj.current_position = val;
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
            <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Data Migration & Import</span>
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

      {/* TAB 3: BATCH CSV IMPORT & MIGRATION */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Cohort Selector Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setCohortTab('2020')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                cohortTab === '2020'
                  ? 'bg-[#002366] text-[#C5A059] shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>2020 Global Convocation (669)</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#C5A059]/20 text-[#C5A059]">Official</span>
            </button>

            <button
              type="button"
              onClick={() => setCohortTab('2022')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                cohortTab === '2022'
                  ? 'bg-[#002366] text-[#C5A059] shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>2022 Nakuru Chapter (32)</span>
            </button>

            <button
              type="button"
              onClick={() => setCohortTab('generic')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                cohortTab === 'generic'
                  ? 'bg-[#002366] text-[#C5A059] shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Custom Batch CSV Importer</span>
            </button>
          </div>

          {/* 1. DEDICATED 2020 CONVOCATION GLOBAL COHORT DATA MIGRATION ENGINE */}
          {cohortTab === '2020' && (
            <div className="bg-gradient-to-br from-[#002366] via-[#001f5c] to-[#001740] rounded-3xl p-6 text-white border border-[#C5A059]/40 shadow-xl space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Global Convocation Roll • Friday, 4th December 2020</span>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white">
                    2020 Global Convocation Data Migration Engine
                  </h3>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    Bulk-import and verify all 669 conferred graduates from the Breakthrough International Bible University 2020 Convocation into the permanent alumni database with 100% field mapping fidelity across Kenya (12+ Counties), Tanzania, Zimbabwe, Ethiopia, and Haiti.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleRun2020Migration}
                    disabled={is2020Migrating}
                    className="px-5 py-3 rounded-2xl bg-[#C5A059] text-[#002366] font-black text-xs uppercase tracking-wider hover:bg-[#D4AF37] transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 active:scale-95"
                  >
                    {is2020Migrating ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#002366]" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#002366]" />
                    )}
                    <span>{is2020Migrating ? 'Migrating 669 Records...' : 'Execute Data Migration (669)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={download2020CsvFile}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/15"
                    title="Download 2020 Cohort as CSV"
                  >
                    <Download className="w-4 h-4 text-[#C5A059]" />
                    <span className="hidden sm:inline">Download CSV</span>
                  </button>
                </div>
              </div>

              {/* 5 Required Field Mapping Verification Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-bold text-[#C5A059] uppercase tracking-wider">Required Field Mapping Verification Matrix</span>
                  <span className="text-slate-400">Strict Schema Fidelity Guarantee</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 1: Name</div>
                    <div className="font-bold text-white">Full Conferred Name</div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Honorifics (`Apostle`, `Bishop Dr.`, `Rev. Dr.`, `Pastor Dr.`) + First, Middle, Last
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 2: Mobile</div>
                    <div className="font-bold text-white">International Mobile</div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Standardized to `+254` (KE), `+255` (TZ), `+263` (ZW), `+251` (ET), `+509` (HT)
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 3: Email</div>
                    <div className="font-bold text-white">Verified Alumni Email</div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Institutional sanitized unique contacts (`@alumni.bibu.university`)
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 4: Reg No</div>
                    <div className="font-bold text-white">Registration Number</div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Permanent Student IDs (`BIBU/2020/HON/...`, `BIBU/2020/NBI/...`, `BIBU/2020/ZIM/...`)
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 5: Grad Year</div>
                    <div className="font-bold text-white">Class of 2020</div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      Year: `2020` • Conferred: `2020-12-04` (Convocation Assembly)
                    </div>
                  </div>
                </div>
              </div>

              {/* Cohort Breakdown Statistics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-center text-xs">
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Cohort</div>
                  <div className="text-base font-black text-white">669</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-[#C5A059] font-bold uppercase">Hon. Doctorate</div>
                  <div className="text-base font-black text-[#C5A059]">33</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-purple-300 font-bold uppercase">Doctorate (Ph.D.)</div>
                  <div className="text-base font-black text-purple-300">13</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-blue-300 font-bold uppercase">Master's</div>
                  <div className="text-base font-black text-blue-300">61</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Bachelor's</div>
                  <div className="text-base font-black text-emerald-300">198</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-amber-300 font-bold uppercase">Diplomas</div>
                  <div className="text-base font-black text-amber-300">195</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                  <div className="text-[10px] text-rose-300 font-bold uppercase">Certificates</div>
                  <div className="text-base font-black text-rose-300">169</div>
                </div>
              </div>

              {/* Quick Actions & Preview Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShow2020Preview(!show2020Preview)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {show2020Preview ? <EyeOff className="w-3.5 h-3.5 text-[#C5A059]" /> : <Eye className="w-3.5 h-3.5 text-[#C5A059]" />}
                    <span>{show2020Preview ? 'Hide Raw Dataset Preview' : 'Preview 669 Raw Graduand Records'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={load2020Csv}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Load 669 Records into CSV Scratchpad</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-300">
                  Nations: <span className="text-[#C5A059] font-semibold">Kenya (12+ Counties) • Tanzania • Zimbabwe • Ethiopia • Haiti</span>
                </div>
              </div>

              {/* EXPANDABLE 2020 RAW DATA PREVIEW TABLE */}
              {show2020Preview && (
                <div className="bg-slate-900/90 rounded-2xl border border-white/15 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs">
                    <div className="font-bold text-[#C5A059] flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Conferred Convocation Roll (Class of 2020)</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={preview2020Search}
                          onChange={(e) => setPreview2020Search(e.target.value)}
                          placeholder="Search name, reg no, campus..."
                          className="pl-8 pr-3 py-1.5 bg-white/10 rounded-lg text-white placeholder-slate-400 text-xs border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#C5A059] w-48 sm:w-56"
                        />
                      </div>

                      {/* Country Filter */}
                      <select
                        value={preview2020Country}
                        onChange={(e) => setPreview2020Country(e.target.value)}
                        className="bg-white/10 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="All" className="bg-slate-900 text-white">All Countries</option>
                        <option value="Kenya" className="bg-slate-900 text-white">Kenya</option>
                        <option value="Tanzania" className="bg-slate-900 text-white">Tanzania</option>
                        <option value="Zimbabwe" className="bg-slate-900 text-white">Zimbabwe</option>
                        <option value="Ethiopia" className="bg-slate-900 text-white">Ethiopia</option>
                        <option value="Haiti" className="bg-slate-900 text-white">Haiti</option>
                      </select>

                      {/* Qualification Filter */}
                      <select
                        value={preview2020Level}
                        onChange={(e) => setPreview2020Level(e.target.value)}
                        className="bg-white/10 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="All" className="bg-slate-900 text-white">All Levels</option>
                        <option value="Honorary" className="bg-slate-900 text-white">Honorary Doctorate</option>
                        <option value="Doctor" className="bg-slate-900 text-white">Doctorate (Ph.D.)</option>
                        <option value="Master" className="bg-slate-900 text-white">Master's</option>
                        <option value="Bachelor" className="bg-slate-900 text-white">Bachelor's</option>
                        <option value="Diploma" className="bg-slate-900 text-white">Diploma</option>
                        <option value="Certificate" className="bg-slate-900 text-white">Certificate</option>
                      </select>

                      <span className="text-slate-400 font-mono text-[11px]">
                        Showing {filtered2020Preview.length} of {RAW_2020_GRADUATES.length}
                      </span>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10 text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-white/10 text-[#C5A059] uppercase text-[9px] tracking-wider sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Reg No</th>
                          <th className="py-2 px-3">Mobile</th>
                          <th className="py-2 px-3">Email</th>
                          <th className="py-2 px-3">Program / Degree</th>
                          <th className="py-2 px-3">Campus / County</th>
                          <th className="py-2 px-3">Country</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {filtered2020Preview.slice(0, 100).map((g, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-1.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-bold text-white whitespace-nowrap">{g.name}</td>
                            <td className="py-1.5 px-3 font-mono text-[#C5A059] whitespace-nowrap">{g.regNo}</td>
                            <td className="py-1.5 px-3 font-mono text-emerald-300 whitespace-nowrap">{g.mobile}</td>
                            <td className="py-1.5 px-3 text-slate-300 whitespace-nowrap">{g.email}</td>
                            <td className="py-1.5 px-3 text-slate-200">{g.programName}</td>
                            <td className="py-1.5 px-3 text-slate-400 whitespace-nowrap">{g.campus}</td>
                            <td className="py-1.5 px-3 whitespace-nowrap">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white font-semibold">
                                {g.country}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filtered2020Preview.length > 100 && (
                      <div className="p-2.5 bg-white/5 text-center text-xs text-slate-400">
                        Showing first 100 records of {filtered2020Preview.length}. Execute migration or use filters to refine.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2020 MIGRATION EXECUTION REPORT & AUDIT TRAIL */}
              {migration2020Report && (
                <div className="bg-white rounded-2xl p-5 text-slate-900 border border-emerald-300 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002366] text-sm">
                          2020 Convocation Data Migration Completed Successfully
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          All {migration2020Report.totalProvided} graduands processed & verified into the permanent alumni database at {new Date(migration2020Report.timestamp).toLocaleTimeString()}.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('manage');
                          setFilterYear(2020);
                          setSearchQuery('');
                        }}
                        className="px-3.5 py-2 bg-[#002366] text-[#C5A059] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#001740] shadow-sm transition-all"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View 2020 Cohort in Registry</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Total Processed</div>
                      <div className="text-xl font-black text-[#002366]">{migration2020Report.totalProvided}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                      <div className="text-[10px] uppercase font-bold text-emerald-700">New Insertions</div>
                      <div className="text-xl font-black text-emerald-700">{migration2020Report.migratedCount}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <div className="text-[10px] uppercase font-bold text-blue-700">Updated / Synced</div>
                      <div className="text-xl font-black text-blue-700">{migration2020Report.updatedCount}</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <div className="text-[10px] uppercase font-bold text-amber-700">Nations Represented</div>
                      <div className="text-xl font-black text-amber-900">5 Nations</div>
                    </div>
                  </div>

                  {/* Detailed Audit Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Audit Trail of Conferred 2020 Graduates:</span>
                      <span className="font-mono text-slate-500">{migration2020Report.auditTrail.length} Logged Entries</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Reg No</th>
                            <th className="py-2 px-3">Full Conferred Name</th>
                            <th className="py-2 px-3">Mobile Contact</th>
                            <th className="py-2 px-3">Email</th>
                            <th className="py-2 px-3">Program</th>
                            <th className="py-2 px-3">Campus / Country</th>
                            <th className="py-2 px-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {migration2020Report.auditTrail.slice(0, 150).map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-1.5 px-3 font-bold text-[#002366] whitespace-nowrap">{item.regNo}</td>
                              <td className="py-1.5 px-3 font-sans font-bold text-slate-800 whitespace-nowrap">{item.fullName}</td>
                              <td className="py-1.5 px-3 text-emerald-700 whitespace-nowrap">{item.mobile}</td>
                              <td className="py-1.5 px-3 text-slate-600 font-sans whitespace-nowrap">{item.email}</td>
                              <td className="py-1.5 px-3 font-sans text-slate-700">{item.programName}</td>
                              <td className="py-1.5 px-3 font-sans text-slate-500 whitespace-nowrap">{item.campus} ({item.country})</td>
                              <td className="py-1.5 px-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                                  item.action === 'inserted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {item.action === 'inserted' ? 'Conferred & Verified' : 'Synchronized'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {migration2020Report.auditTrail.length > 150 && (
                        <div className="p-2 text-center text-xs text-slate-500 bg-slate-50">
                          Showing first 150 audit entries of {migration2020Report.auditTrail.length}. All records successfully written to registry.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. DEDICATED 2022 NAKURU MOTHER'S CHAPTER DATA MIGRATION ENGINE */}
          {cohortTab === '2022' && (
            <div className="bg-gradient-to-br from-[#002366] to-[#001740] rounded-3xl p-6 text-white border border-[#C5A059]/30 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Cohort Migration Tool</span>
                  </div>
                  <h3 className="text-xl font-display font-black text-white">
                    2022 Nakuru Mother's Chapter Data Migration
                  </h3>
                  <p className="text-xs text-slate-300">
                    Bulk-import all 32 verified graduates from the April 8, 2022 Convocation Ceremony into the permanent alumni database with 100% field mapping fidelity.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRunNakuruMigration}
                    disabled={isMigrating}
                    className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-[#002366] font-black text-xs uppercase tracking-wider hover:bg-[#D4AF37] transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isMigrating ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#002366]" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#002366]" />
                    )}
                    <span>{isMigrating ? 'Migrating Cohort...' : 'Execute Data Migration (32)'}</span>
                  </button>
                </div>
              </div>

              {/* Field Mapping Verification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 1: Name</div>
                  <div className="font-bold text-white mt-1">Full Conferred Name</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Parsed to First, Middle, Last & Title (`Dr.`)</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 2: Mobile</div>
                  <div className="font-bold text-white mt-1">Phone Number</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Normalized to International `+254 7...` format</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 3: Email</div>
                  <div className="font-bold text-white mt-1">Verified Email</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Sanitized & mapped to unique alumni contact</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 4: Reg No</div>
                  <div className="font-bold text-white mt-1">Student Reg ID</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Mapped to `BTS/20394/2021` - `BTS/20425/2021`</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">Field 5: Grad Year</div>
                  <div className="font-bold text-white mt-1">Class of 2022</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Year 2022 • Ceremony Date 2022-04-08</div>
                </div>
              </div>

              {/* Quick Actions & Preview Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNakuruPreview(!showNakuruPreview)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {showNakuruPreview ? <EyeOff className="w-3.5 h-3.5 text-[#C5A059]" /> : <Eye className="w-3.5 h-3.5 text-[#C5A059]" />}
                    <span>{showNakuruPreview ? 'Hide Raw Dataset Preview' : 'Preview 32 Raw Graduand Records'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadNakuruCsv}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Load Cohort into CSV Scratchpad</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-300">
                  Conferred: <span className="text-[#C5A059] font-semibold">Honorary Doctorate of Divinity (D.Div.)</span>
                </div>
              </div>

              {/* EXPANDABLE RAW DATA PREVIEW TABLE */}
              {showNakuruPreview && (
                <div className="bg-slate-900/80 rounded-2xl border border-white/15 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                    <div className="font-bold text-[#C5A059] flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Raw Input Dataset: Nakuru Mother's Chapter (Class of 2022)</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">Total: {RAW_NAKURU_2022_GRADUATES.length} Graduates</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto rounded-xl border border-white/10 text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-white/10 text-[#C5A059] uppercase text-[9px] tracking-wider sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Mobile</th>
                          <th className="py-2 px-3">Email</th>
                          <th className="py-2 px-3">Reg No</th>
                          <th className="py-2 px-3">Grad Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {RAW_NAKURU_2022_GRADUATES.map((g, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-1.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-bold text-white">{g.name}</td>
                            <td className="py-1.5 px-3 font-mono text-emerald-300">{g.mobile}</td>
                            <td className="py-1.5 px-3 text-slate-300">{g.email}</td>
                            <td className="py-1.5 px-3 font-mono text-[#C5A059]">{g.regNo}</td>
                            <td className="py-1.5 px-3 font-mono">{g.graduationYear || 2022}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MIGRATION EXECUTION REPORT & AUDIT TRAIL */}
              {migrationReport && (
                <div className="bg-white rounded-2xl p-5 text-slate-900 border border-emerald-300 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002366] text-sm">
                          Data Migration Completed Successfully
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          All {migrationReport.totalProvided} graduands processed & verified into the official database at {new Date(migrationReport.timestamp).toLocaleTimeString()}.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('manage');
                          setFilterYear(2022);
                          setSearchQuery('Nakuru');
                        }}
                        className="px-3 py-1.5 bg-[#002366] text-[#C5A059] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#001740]"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Migrated Records in Registry</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Total Processed</div>
                      <div className="text-lg font-black text-[#002366]">{migrationReport.totalProvided}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200">
                      <div className="text-[10px] uppercase font-bold text-emerald-700">New Insertions</div>
                      <div className="text-lg font-black text-emerald-700">{migrationReport.migratedCount}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-200">
                      <div className="text-[10px] uppercase font-bold text-blue-700">Updated / Synced</div>
                      <div className="text-lg font-black text-blue-700">{migrationReport.updatedCount}</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                      <div className="text-[10px] uppercase font-bold text-amber-700">Conferred Degree</div>
                      <div className="text-xs font-bold text-amber-900 mt-1">D.Div. Honoris Causa</div>
                    </div>
                  </div>

                  {/* Detailed Audit Table */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      Audit Trail of Conferred Graduates:
                    </div>
                    <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-xl text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Reg No</th>
                            <th className="py-2 px-3">Full Conferred Name</th>
                            <th className="py-2 px-3">Mobile Contact</th>
                            <th className="py-2 px-3">Verified Email</th>
                            <th className="py-2 px-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {migrationReport.auditTrail.map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-1.5 px-3 font-bold text-[#002366]">{item.regNo}</td>
                              <td className="py-1.5 px-3 font-sans font-bold text-slate-800">{item.fullName}</td>
                              <td className="py-1.5 px-3 text-emerald-700">{item.mobile}</td>
                              <td className="py-1.5 px-3 text-slate-600 font-sans">{item.email}</td>
                              <td className="py-1.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                                  item.action === 'inserted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {item.action === 'inserted' ? 'Inserted' : 'Synchronized'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. GENERIC BATCH CSV IMPORT */}
          {cohortTab === 'generic' && (
            <div className="space-y-4">

          {/* GENERIC BATCH CSV IMPORT */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#002366] font-bold text-sm">
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>Generic CSV Batch Alumni Importer</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste CSV data below to import arbitrary cohorts from graduation lists. The system maps fields dynamically: Name (or first_name, last_name), Mobile (phone), Email, Reg No (student_id), and Graduation Year.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCsvText(sampleCsvContent)}
                className="text-xs font-bold text-[#002366] hover:underline inline-flex items-center gap-1"
              >
                <Download className="w-3 h-3 text-[#C5A059]" />
                <span>Load Sample Generic CSV</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Paste CSV Content:
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="name,mobile,email,reg_no,graduation_year,program_name,qualification_level,campus..."
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
      )}
    </div>
  );
};
