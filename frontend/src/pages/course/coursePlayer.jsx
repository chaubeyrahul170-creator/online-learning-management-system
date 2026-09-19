import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, CheckCircle2, Clock, Play, ChevronRight,
  FileText, PlayCircle, Award, Menu, X,
  ChevronDown, ChevronUp, AlignLeft, Paperclip, HelpCircle, Globe, Circle, Sparkles, Lock
} from 'lucide-react';
import { getAllCourses, getCourseDetails, updateCourseProgress } from '../../services/courseService';

const mockResources = [
  { id: 1, title: 'Course Source Code on GitHub', type: 'link', url: 'https://github.com', icon: Globe },
  { id: 2, title: 'Architecture & CheatSheet.pdf', type: 'pdf', size: '1.4 MB', icon: FileText },
  { id: 3, title: 'Lecture Notes & Documentation.pdf', type: 'pdf', size: '920 KB', icon: FileText },
];

export default function CoursePlayer() {
  const { id } = useParams();

  // 1. Current Logged-in Student Identity
  const currentUser = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edulearn_user'));
      return {
        name: stored?.name || 'Student',
        email: stored?.email || 'student@edulearn.com',
      };
    } catch {
      return { name: 'Student', email: 'student@edulearn.com' };
    }
  })();

  // State
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeLectureId, setActiveLectureId] = useState(null);
  const [doneLectures, setDoneLectures] = useState(new Set());
  const [openModules, setOpenModules] = useState(new Set([0, 1]));
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notes, setNotes] = useState([
    { id: 1, time: 'Lecture Note', text: 'Important concepts discussed in this module.' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // 2. Fetch Real Course from MongoDB Atlas & Load THIS Student's Progress
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        let foundCourse = null;

        if (id && id.length === 24) {
          foundCourse = await getCourseDetails(id);
        }

        if (!foundCourse) {
          const all = await getAllCourses();
          if (all && all.length > 0) {
            foundCourse = all.find((c) => c._id === id || String(c.id) === id) || all[0];
          }
        }

        if (foundCourse) {
          setCourse(foundCourse);
          if (foundCourse.modules && foundCourse.modules.length > 0) {
            setModules(foundCourse.modules);
            const firstLec = foundCourse.modules[0]?.lectures?.[0];
            if (firstLec) setActiveLectureId(firstLec._id || firstLec.id);
          }

          // 🚀 REAL DYNAMIC LMS LOGIC: Load strictly THIS student's completed lectures
          const studentStorageKey = `edulearn_progress_${currentUser.email}`;
          const savedData = JSON.parse(localStorage.getItem(studentStorageKey)) || {};
          const thisCourseData = savedData[foundCourse._id || id];

          if (thisCourseData && thisCourseData.doneLectureIds) {
            setDoneLectures(new Set(thisCourseData.doneLectureIds));
          } else if (currentUser.email === 'student@edulearn.com' && foundCourse.completedLessons > 0) {
            // Only seeded demo student (Rahul) has pre-seeded progress
            const allLecs = (foundCourse.modules || []).flatMap((m) => m.lectures);
            setDoneLectures(new Set(allLecs.slice(0, foundCourse.completedLessons).map((l) => l._id || l.id)));
          } else {
            // NAYA STUDENT = 0 COMPLETED LESSONS!
            setDoneLectures(new Set());
          }
        }
      } catch (err) {
        console.log('Error loading course:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, currentUser.email]);

  // All lectures
  const allLectures = modules.flatMap((m) => m.lectures || []);
  const activeLecture = allLectures.find((l) => (l._id || l.id) === activeLectureId) || allLectures[0] || {
    title: 'Welcome to the Course',
    duration: '15 min',
    videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
  };

  const currentIndex = allLectures.findIndex((l) => (l._id || l.id) === (activeLecture._id || activeLecture.id));
  const prevLecture = allLectures[currentIndex - 1];
  const nextLecture = allLectures[currentIndex + 1];

  const totalDone = doneLectures.size;
  const totalCount = allLectures.length || 1;
  const progressPct = Math.min(100, Math.round((totalDone / totalCount) * 100));

  const toggleModule = (idx) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // 🚀 TOGGLE DONE: Save strictly for THIS Student
  const toggleDone = async () => {
    const currentLecId = activeLecture._id || activeLecture.id;
    const newDone = new Set(doneLectures);

    if (newDone.has(currentLecId)) {
      newDone.delete(currentLecId);
    } else {
      newDone.add(currentLecId);
    }

    setDoneLectures(newDone);

    const newCompletedCount = newDone.size;
    const newProgress = Math.min(100, Math.round((newCompletedCount / totalCount) * 100));

    // Save to THIS student's storage
    try {
      const studentStorageKey = `edulearn_progress_${currentUser.email}`;
      const savedData = JSON.parse(localStorage.getItem(studentStorageKey)) || {};
      const courseKey = course?._id || id || '1';

      savedData[courseKey] = {
        completedLessons: newCompletedCount,
        progress: newProgress,
        doneLectureIds: Array.from(newDone),
      };

      localStorage.setItem(studentStorageKey, JSON.stringify(savedData));
      setToastMsg(`Progress Saved: ${newProgress}% Completed`);
      setTimeout(() => setToastMsg(''), 3000);

      // Backend sync
      if (course && course._id) {
        updateCourseProgress(course._id, {
          completedLessons: newCompletedCount,
          progress: newProgress,
        }).catch(() => {});
      }
    } catch (err) {
      console.log('Error saving student progress:', err);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Date.now(), time: 'Lecture Note', text: newNote }]);
    setNewNote('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading curriculum from MongoDB Atlas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/student-dashboard"
            className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
            {course?.title || 'Course Player'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400">Progress:</span>
            <span className="text-xs font-mono font-black text-blue-400">{progressPct}%</span>
            <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {progressPct >= 100 && (
            <Link
              to="/certificate"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Get Certificate</span>
            </Link>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 md:hidden"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Video Player & Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Container */}
          <div className="bg-black aspect-video w-full max-h-[520px] flex items-center justify-center relative">
            {activeLecture.videoUrl.includes('youtube.com') || activeLecture.videoUrl.includes('youtu.be') ? (
              <iframe
                src={activeLecture.videoUrl}
                title={activeLecture.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={activeLecture._id || activeLecture.id}
                src={activeLecture.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>

          {/* Action Bar */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800/40">
                Lecture {currentIndex + 1} of {allLectures.length} · {activeLecture.duration}
              </span>
              <h2 className="text-base sm:text-lg font-black text-white mt-2">{activeLecture.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Instructor: {course?.instructor || 'Faculty'}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDone}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  doneLectures.has(activeLecture._id || activeLecture.id)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {doneLectures.has(activeLecture._id || activeLecture.id) ? 'Completed ✓' : 'Mark Lesson Complete'}
                </span>
              </button>

              {nextLecture && (
                <button
                  onClick={() => setActiveLectureId(nextLecture._id || nextLecture.id)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              {['overview', 'notes', 'resources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-sm font-bold text-white">About this Lecture</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {course?.description ||
                    'In this lesson, you will master the fundamental concepts with real-world implementation and syntax breakdown.'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Category</span>
                    <span className="text-xs font-bold text-slate-300 mt-0.5 block">{course?.category}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Curriculum</span>
                    <span className="text-xs font-bold text-slate-300 mt-0.5 block">{allLectures.length} Video Lessons</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Certificate Status</span>
                    <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                      {progressPct >= 100 ? 'Unlocked ✓' : `${progressPct}% (Locked)`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a personal note for this lecture..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <button onClick={handleAddNote} className="px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold">
                    Add Note
                  </button>
                </div>

                <div className="space-y-2">
                  {notes.map((n) => (
                    <div key={n.id} className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-mono text-blue-400 font-bold">{n.time}</span>
                      <p className="text-slate-300">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3 max-w-xl">
                {mockResources.map((r) => {
                  const Icon = r.icon;
                  return (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="font-bold text-white">{r.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{r.size || 'External Link'}</span>
                        </div>
                      </div>
                      <span className="text-blue-400 text-xs font-bold">Access →</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Course Curriculum Playlist */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:block w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0`}
        >
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Course Curriculum</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {totalDone} of {allLectures.length} lessons completed
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {modules.map((mod, mIdx) => {
              const isOpen = openModules.has(mIdx);
              return (
                <div key={mIdx} className="bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden">
                  <button
                    onClick={() => toggleModule(mIdx)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/40"
                  >
                    <span className="truncate pr-2">{mod.title}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-2 pt-0 space-y-1">
                      {mod.lectures.map((lec) => {
                        const lecId = lec._id || lec.id;
                        const isPlaying = (activeLecture._id || activeLecture.id) === lecId;
                        const isDone = doneLectures.has(lecId);

                        return (
                          <button
                            key={lecId}
                            onClick={() => setActiveLectureId(lecId)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                              isPlaying
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              {isDone ? (
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-white' : 'text-emerald-400'}`} />
                              ) : (
                                <Circle className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-white' : 'text-slate-600'}`} />
                              )}
                              <span className="truncate">{lec.title}</span>
                            </div>
                            <span className={`text-[10px] font-mono shrink-0 ${isPlaying ? 'text-blue-100' : 'text-slate-500'}`}>
                              {lec.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

