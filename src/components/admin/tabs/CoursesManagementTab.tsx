import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { BookMarked, Plus, Edit2, Trash2, CheckCircle2, X, Play, FileText, ChevronRight } from 'lucide-react';
import { Course, CourseModule, Lesson } from '../../../types';

export const CoursesManagementTab: React.FC = () => {
  const { courses, schools, addCourse, updateCourse, deleteCourse, addModule, addLesson } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState<string | null>(null); // moduleId
  const [notification, setNotification] = useState<string | null>(null);

  // Course Form
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || 'sch-biblical');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState('Fall 2026');
  const [instructor, setInstructor] = useState('Dr. Thomas E. Wright, Ph.D.');
  const [description, setDescription] = useState('');
  const [scriptureReferencesStr, setScriptureReferencesStr] = useState('2 Timothy 2:15, Hebrews 4:12');

  // Module Form
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  // Lesson Form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('45 mins');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [lessonReading, setLessonReading] = useState('');
  const [lessonNotes, setLessonNotes] = useState('');

  const startCreateCourse = () => {
    setEditingCourse(null);
    setCode('');
    setTitle('');
    setSchoolId(schools[0]?.id || 'sch-biblical');
    setCredits(3);
    setSemester('Fall 2026');
    setInstructor('Dr. Thomas E. Wright, Ph.D.');
    setDescription('');
    setScriptureReferencesStr('2 Timothy 2:15, Hebrews 4:12');
    setIsCreatingCourse(true);
  };

  const startEditCourse = (c: Course) => {
    setIsCreatingCourse(false);
    setEditingCourse(c);
    setCode(c.code);
    setTitle(c.title);
    setSchoolId(c.schoolId);
    setCredits(c.credits);
    setSemester(c.semester);
    setInstructor(c.instructor);
    setDescription(c.description);
    setScriptureReferencesStr(c.scriptureReferences?.join(', ') || '');
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const refs = scriptureReferencesStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (isCreatingCourse) {
      addCourse({
        code,
        title,
        schoolId,
        credits,
        semester,
        instructor,
        description,
        scriptureReferences: refs,
        modules: []
      });
      setNotification(`Course "${code}: ${title}" registered successfully!`);
      setIsCreatingCourse(false);
    } else if (editingCourse) {
      updateCourse(editingCourse.id, {
        code,
        title,
        schoolId,
        credits,
        semester,
        instructor,
        description,
        scriptureReferences: refs
      });
      setNotification(`Course "${code}" updated successfully!`);
      setEditingCourse(null);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    addModule(selectedCourse.id, {
      title: moduleTitle,
      description: moduleDescription,
      lessons: []
    });

    setNotification(`Module "${moduleTitle}" added to ${selectedCourse.code}!`);
    setModuleTitle('');
    setModuleDescription('');
    setIsAddingModule(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddLesson = (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    if (!selectedCourse) return;

    addLesson(selectedCourse.id, moduleId, {
      title: lessonTitle,
      duration: lessonDuration,
      videoUrl: lessonVideoUrl,
      readingText: lessonReading,
      notes: lessonNotes,
      completed: false
    });

    setNotification(`Lesson "${lessonTitle}" added successfully!`);
    setLessonTitle('');
    setLessonReading('');
    setLessonNotes('');
    setIsAddingLesson(null);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#C5A059]" />
            <span>Curriculum & LMS Courses Management ({courses.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add theological courses, create syllabus modules, and upload video lectures, notes, and scripture readings.
          </p>
        </div>

        <button
          onClick={startCreateCourse}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add Course</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Create / Edit Course Modal */}
      {(isCreatingCourse || editingCourse) && (
        <div className="bg-white rounded-xl border-2 border-[#002366] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#002366] flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#C5A059]" />
              <span>{isCreatingCourse ? 'Register New Course' : `Edit Course: ${editingCourse?.code}`}</span>
            </h3>
            <button
              onClick={() => { setIsCreatingCourse(false); setEditingCourse(null); }}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCourse} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. THEO-301"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Systematic Theology I: God & Revelation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School</label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Credits</label>
                <input
                  type="number"
                  required
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructor / Professor</label>
                <input
                  type="text"
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Scripture References (Comma-separated)
                </label>
                <input
                  type="text"
                  value={scriptureReferencesStr}
                  onChange={(e) => setScriptureReferencesStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsCreatingCourse(false); setEditingCourse(null); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider border border-[#C5A059]"
              >
                {isCreatingCourse ? 'Register Course' : 'Update Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List & Selected Course Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Course to Manage Syllabus & Lessons:
          </div>
          {courses.map((course) => {
            const isSelected = selectedCourse?.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#002366] text-white border-[#C5A059] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#002366]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isSelected ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-100 text-slate-700'}`}>
                    {course.code}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEditCourse(course)}
                      className={`p-1 rounded ${isSelected ? 'text-slate-200 hover:text-white' : 'text-slate-400 hover:text-[#002366]'}`}
                      title="Edit Course Header"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete course ${course.code}?`)) {
                          deleteCourse(course.id);
                          if (selectedCourse?.id === course.id) setSelectedCourse(null);
                        }
                      }}
                      className={`p-1 rounded ${isSelected ? 'text-rose-300 hover:text-rose-100' : 'text-slate-400 hover:text-rose-600'}`}
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-bold text-xs mt-2">{course.title}</div>
                <div className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {course.instructor} • {course.credits} Credits
                </div>
                <div className={`text-[10px] mt-2 flex items-center gap-2 ${isSelected ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                  <span>{course.modules?.length || 0} Modules</span>
                  <span>•</span>
                  <span>{course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} Lessons</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Course Inspector: Modules & Lessons */}
        <div className="lg:col-span-7">
          {selectedCourse ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366] text-xs font-mono font-bold">
                    {selectedCourse.code} • {selectedCourse.credits} Credits
                  </div>
                  <h3 className="text-base font-bold text-[#002366] mt-1">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedCourse.instructor}</p>
                </div>

                <button
                  onClick={() => setIsAddingModule(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add Module</span>
                </button>
              </div>

              {/* Add Module Form Drawer */}
              {isAddingModule && (
                <form onSubmit={handleAddModule} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-[#002366]">New Syllabus Module:</div>
                  <input
                    type="text"
                    required
                    placeholder="Module Title (e.g. Module 1: Foundations of Hermeneutics)"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Module Description / Objectives"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingModule(false)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#002366] text-white rounded-lg text-xs font-bold"
                    >
                      Save Module
                    </button>
                  </div>
                </form>
              )}

              {/* Modules & Lessons Hierarchy */}
              <div className="space-y-4">
                {(!selectedCourse.modules || selectedCourse.modules.length === 0) && (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No modules added to this course yet. Click "Add Module" to build the curriculum.
                  </div>
                )}

                {selectedCourse.modules?.map((mod, modIdx) => (
                  <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100/70 p-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#002366]">{mod.title}</div>
                        {mod.description && <div className="text-[11px] text-slate-500">{mod.description}</div>}
                      </div>
                      <button
                        onClick={() => setIsAddingLesson(mod.id)}
                        className="px-2.5 py-1 rounded bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Lesson</span>
                      </button>
                    </div>

                    {/* Add Lesson Drawer */}
                    {isAddingLesson === mod.id && (
                      <form onSubmit={(e) => handleAddLesson(e, mod.id)} className="p-3 bg-amber-50 border-t border-amber-200 space-y-2.5">
                        <div className="text-xs font-bold text-amber-900">Add Lesson to {mod.title}:</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Lesson Title"
                            value={lessonTitle}
                            onChange={(e) => setLessonTitle(e.target.value)}
                            className="px-2.5 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 45 mins)"
                            value={lessonDuration}
                            onChange={(e) => setLessonDuration(e.target.value)}
                            className="px-2.5 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Video Lecture URL (YouTube embed or MP4)"
                            value={lessonVideoUrl}
                            onChange={(e) => setLessonVideoUrl(e.target.value)}
                            className="col-span-2 px-2.5 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          />
                          <textarea
                            rows={2}
                            placeholder="Reading Texts / Biblical Chapters"
                            value={lessonReading}
                            onChange={(e) => setLessonReading(e.target.value)}
                            className="col-span-2 px-2.5 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          />
                          <textarea
                            rows={2}
                            placeholder="Lecture Summary Notes & Exegesis Outline"
                            value={lessonNotes}
                            onChange={(e) => setLessonNotes(e.target.value)}
                            className="col-span-2 px-2.5 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingLesson(null)}
                            className="px-2 py-1 text-xs text-slate-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-bold"
                          >
                            Save Lesson
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Lessons list */}
                    <div className="divide-y divide-slate-100 p-2 space-y-1">
                      {(!mod.lessons || mod.lessons.length === 0) && (
                        <div className="text-[11px] text-slate-400 p-2">No lessons in this module yet.</div>
                      )}
                      {mod.lessons?.map((lesson, lIdx) => (
                        <div key={lesson.id} className="p-2 flex items-center justify-between text-xs hover:bg-slate-50 rounded">
                          <div className="flex items-center gap-2">
                            <Play className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span className="font-bold text-slate-800">{lesson.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({lesson.duration})</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Lesson {lIdx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <BookMarked className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-600">Select a course on the left to edit its modules & lectures</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Or click "Add Course" above to establish a new accredited theological class.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
