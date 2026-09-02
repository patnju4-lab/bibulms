import React, { useState } from 'react';
import {
  LibraryResource,
  AcademicLevel,
  LibraryResourceType,
  LibraryCollectionCategory
} from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  Download,
  Filter,
  Eye,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface Props {
  resources: LibraryResource[];
  onAddResource: (resource: Omit<LibraryResource, 'id'>) => void;
  onUpdateResource: (id: string, updates: Partial<LibraryResource>) => void;
  onDeleteResource: (id: string) => void;
}

export const AdminLibraryManager: React.FC<Props> = ({
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LibraryResource | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('BIBU Academic Press');
  const [category, setCategory] = useState<LibraryResource['category']>('Biblical Studies');
  const [collectionCategory, setCollectionCategory] = useState<LibraryCollectionCategory>('Bible Studies');
  const [resourceType, setResourceType] = useState<LibraryResourceType>('Systematic Treatise');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('Master');
  const [format, setFormat] = useState<LibraryResource['format']>('PDF');
  const [pagesOrDuration, setPagesOrDuration] = useState('250 pages');
  const [year, setYear] = useState(2026);
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [abstract, setAbstract] = useState('');
  const [isbnOrDoi, setIsbnOrDoi] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [peerReviewed, setPeerReviewed] = useState(true);
  const [licenseType, setLicenseType] = useState<LibraryResource['licenseType']>('BIBU Institutional License');

  const filteredResources = resources.filter((r) => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.keywords && r.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  const handleOpenAddModal = () => {
    setEditingResource(null);
    setTitle('');
    setAuthor('');
    setPublisher('BIBU Academic Press');
    setCategory('Biblical Studies');
    setCollectionCategory('Bible Studies');
    setResourceType('Systematic Treatise');
    setAcademicLevel('Master');
    setFormat('PDF');
    setPagesOrDuration('250 pages');
    setYear(2026);
    setLanguage('English');
    setDescription('');
    setAbstract('');
    setIsbnOrDoi('');
    setIsPopular(false);
    setIsFeatured(false);
    setIsRecommended(false);
    setPeerReviewed(true);
    setLicenseType('BIBU Institutional License');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (r: LibraryResource) => {
    setEditingResource(r);
    setTitle(r.title);
    setAuthor(r.author);
    setPublisher(r.publisher || 'BIBU Academic Press');
    setCategory(r.category);
    setCollectionCategory(r.collectionCategory || 'Bible Studies');
    setResourceType(r.resourceType || 'Systematic Treatise');
    setAcademicLevel(r.academicLevel || 'Master');
    setFormat(r.format);
    setPagesOrDuration(r.pagesOrDuration);
    setYear(r.year);
    setLanguage(r.language || 'English');
    setDescription(r.description);
    setAbstract(r.abstract || '');
    setIsbnOrDoi(r.isbnOrDoi || '');
    setIsPopular(!!r.isPopular);
    setIsFeatured(!!r.isFeatured);
    setIsRecommended(!!r.isRecommended);
    setPeerReviewed(r.peerReviewed ?? true);
    setLicenseType(r.licenseType || 'BIBU Institutional License');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const resourceData: Omit<LibraryResource, 'id'> = {
      title,
      author,
      publisher,
      category,
      collectionCategory,
      resourceType,
      academicLevel,
      format,
      pagesOrDuration,
      year,
      language,
      description,
      abstract,
      isbnOrDoi,
      coverColor: 'bg-[#002366]',
      isPopular,
      isFeatured,
      isRecommended,
      peerReviewed,
      licenseType,
      assignedCourseCodes: ['HER-301', 'THE-201'],
      citationApa: `${author}. (${year}). ${title}. ${publisher}.`
    };

    if (editingResource) {
      onUpdateResource(editingResource.id, resourceData);
    } else {
      onAddResource(resourceData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Total Catalog Resources</span>
            <BookOpen className="w-4 h-4 text-[#002366]" />
          </div>
          <div className="text-2xl font-black font-serif text-[#002366]">{resources.length} items</div>
          <div className="text-[11px] text-emerald-600 font-medium">100% Licensed & Open-Access</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Active Student Readers</span>
            <Users className="w-4 h-4 text-[#002366]" />
          </div>
          <div className="text-2xl font-black font-serif text-[#002366]">1,280 scholars</div>
          <div className="text-[11px] text-emerald-600 font-medium">+14% activity this semester</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Avg. Daily Research Time</span>
            <Clock className="w-4 h-4 text-[#002366]" />
          </div>
          <div className="text-2xl font-black font-serif text-[#002366]">48 mins</div>
          <div className="text-[11px] text-slate-500">Per enrolled theological student</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Peer-Reviewed Monographs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-serif text-[#002366]">
            {resources.filter((r) => r.peerReviewed).length} volumes
          </div>
          <div className="text-[11px] text-[#C5A059] font-bold">BIBU Academic Press</div>
        </div>

      </div>

      {/* Control Bar: Search, Category Filter, and Add Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library resources by title, author, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-slate-50"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Biblical Studies">Biblical Studies</option>
            <option value="Theology">Theology</option>
            <option value="Church History">Church History</option>
            <option value="Leadership">Pastoral Leadership</option>
            <option value="Christian Counseling">Christian Counseling</option>
            <option value="Pastoral Protocols">Pastoral Protocols</option>
            <option value="Biblical Languages">Biblical Languages</option>
            <option value="Research">Research & Theses</option>
          </select>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] hover:bg-[#001A4D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Library Resource</span>
        </button>

      </div>

      {/* Resource Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#002366] text-[#C5A059] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Title & Author</th>
                <th className="p-3.5">Collection & Type</th>
                <th className="p-3.5">Level</th>
                <th className="p-3.5">Format & Year</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-[#002366] font-serif line-clamp-1">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {r.author} • {r.publisher || 'BIBU Academic Press'}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-700">{r.category}</div>
                    <div className="text-[10px] text-slate-400">{r.resourceType || 'Treatise'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold font-mono text-[10px]">
                      {r.academicLevel || 'Master'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium">{r.format}</span> • <span className="text-slate-400">{r.year}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1">
                      {r.peerReviewed && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                          Peer-Reviewed
                        </span>
                      )}
                      {r.isPopular && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(r)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Edit Resource"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteResource(r.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Resource"
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

      {/* Add / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="p-4 bg-[#002366] text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-[#C5A059]">
                {editingResource ? 'Edit Library Resource' : 'Add New Theological Library Resource'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grammatical-Historical Exegesis: A Practitioner’s Guide"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Author / Scholar</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Dr. Thomas E. Wright, Ph.D."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Publisher</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                  >
                    <option value="Biblical Studies">Biblical Studies</option>
                    <option value="Theology">Theology</option>
                    <option value="Church History">Church History</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Christian Counseling">Christian Counseling</option>
                    <option value="Pastoral Protocols">Pastoral Protocols</option>
                    <option value="Biblical Languages">Biblical Languages</option>
                    <option value="Research">Research</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Academic Level</label>
                  <select
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="All">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Format & Duration</label>
                  <input
                    type="text"
                    value={pagesOrDuration}
                    onChange={(e) => setPagesOrDuration(e.target.value)}
                    placeholder="e.g. 320 pages"
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Academic Abstract & Thesis Statement</label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={peerReviewed}
                    onChange={(e) => setPeerReviewed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#002366]"
                  />
                  <span>Peer-Reviewed Academic Work</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#002366]"
                  />
                  <span>Featured in Popular Reading</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold hover:bg-[#001A4D]"
                >
                  {editingResource ? 'Save Changes' : 'Add Resource'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
