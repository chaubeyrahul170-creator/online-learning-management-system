import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, PlusCircle, Video, FolderKanban,
  Users, ShieldCheck, CheckCircle2, Clock, UploadCloud,
  Check, ExternalLink, PlayCircle, LogOut, ChevronRight,
  BarChart3, FileText, Search, AlertCircle, Sparkles,
  Layers, Award, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { getAllCourses, createNewCourse, addLectureToCourse } from '../../services/courseService';
import { getAssignments, createAssignment, gradeStudentSubmission } from '../../services/assignmentService';
import { logout } from '../../services/authService';

const navItems = [
  { id: 'overview', label: 'Studio Overview', icon: LayoutDashboard },
  { id: 'courses', label: 'Course Catalog', icon: BookOpen },
  { id: 'create_course', label: 'Create New Course', icon: PlusCircle },
  { id: 'curriculum', label: 'Curriculum & Lectures', icon: Video },
  { id: 'assignments', label: 'Assignments & Grading', icon: FolderKanban },
  { id: 'students', label: 'Learner Analytics', icon: Users },
  { id: 'governance', label: 'Platform Governance', icon: ShieldCheck },
];

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');

  // Instructor User from LocalStorage (Supports both flat and nested session objects)
  const [currentInstructor] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edulearn_user'));
      const u = stored?.user || stored;
      return {
        name: u?.name || 'Dr. Rahul Sharma',
        email: u?.email || 'instructor@edulearn.com',
        role: u?.role || 'instructor',
        facultyId: u?.studentId || 'FAC-201',
        department: 'Department of Computer Science & Engineering',
      };
    } catch {
      return {
        name: 'Dr. Rahul Sharma',
        email: 'instructor@edulearn.com',
        role: 'instructor',
        facultyId: 'FAC-201',
        department: 'Department of Computer Science & Engineering',
      };
    }
  });

  // Live Data from MongoDB
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Course Creation Form State
  const [newCourse, setNewCourse] = useState({
    title: '',
    subtitle: '',
    category: 'Web Dev',
    hours: '36 hrs',
    level: 'Intermediate',
    description: '',
    firstLectureTitle: '',
    firstLectureVideo: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
    firstLectureDuration: '28 min',
  });

  // Lecture Creation Form State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [moduleTitle, setModuleTitle] = useState('Module 1: Foundations & Architecture');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('https://www.youtube.com/embed/pKd0Rpw7O48');
  const [lectureDuration, setLectureDuration] = useState('32 min');

  // Assignment Creation Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    deadline: '10 Sep 2026',
    totalMarks: 50,
    description: '',
  });

  // Grading Modal State
  const [activeGradingSub, setActiveGradingSub] = useState(null);
  const [gradingState, setGradingState] = useState({ marks: '', feedback: '' });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, assignmentsData] = await Promise.all([
        getAllCourses(),
        getAssignments(),
      ]);
      if (coursesData) {
        setCourses(coursesData);
        if (coursesData.length > 0 && !selectedCourseId) {
          setSelectedCourseId(coursesData[0]._id);
          setNewAssignment((prev) => ({ ...prev, course: coursesData[0].title }));
        }
      }
      if (assignmentsData) setAssignments(assignmentsData);
    } catch (err) {
      console.log('Error loading data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // 1. Create New Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newCourse.title,
        subtitle: newCourse.subtitle || 'Foundations & Architecture',
        description: newCourse.description,
        instructor: currentInstructor.name,
        category: newCourse.category,
        hours: newCourse.hours,
        level: newCourse.level,
        gradient: 'from-blue-600 to-indigo-700',
        totalLessons: 1,
        completedLessons: 0,
        progress: 0,
        modules: [
          {
            title: 'Module 1: Getting Started',
            lectures: [
              {
                title: newCourse.firstLectureTitle || 'Course Overview & Setup',
                duration: newCourse.firstLectureDuration || '25 min',
                videoUrl: newCourse.firstLectureVideo || 'https://www.youtube.com/embed/fBNz5xF-Kx4',
                type: 'video',
                isFree: true,
              },
            ],
          },
        ],
      };

      await createNewCourse(payload);
      await loadData();
      triggerToast(`Course "${newCourse.title}" published successfully to MongoDB!`);
      setNewCourse({
        title: '',
        subtitle: '',
        category: 'Web Dev',
        hours: '36 hrs',
        level: 'Intermediate',
        description: '',
        firstLectureTitle: '',
        firstLectureVideo: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
        firstLectureDuration: '28 min',
      });
      setActiveNav('courses');
    } catch (err) {
      alert('Error creating course: ' + err.message);
    }
  };

  // 2. Add Lecture
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    try {
      const payload = {
        moduleTitle,
        lecture: {
          title: lectureTitle,
          duration: lectureDuration,
          videoUrl: lectureVideoUrl,
          type: 'video',
          isFree: false,
        },
      };

      await addLectureToCourse(selectedCourseId, payload);
      await loadData();
      triggerToast(`Lecture "${lectureTitle}" added to curriculum!`);
      setLectureTitle('');
    } catch (err) {
      alert('Error adding lecture: ' + err.message);
    }
  };

  // 3. Create Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await createAssignment({
        title: newAssignment.title,
        course: newAssignment.course || courses[0]?.title,
        instructor: currentInstructor.name,
        deadline: newAssignment.deadline,
        totalMarks: Number(newAssignment.totalMarks),
        description: newAssignment.description,
      });
      await loadData();
      triggerToast(`Assignment "${newAssignment.title}" published for students!`);
      setNewAssignment({
        title: '',
        course: courses[0]?.title || '',
        deadline: '10 Sep 2026',
        totalMarks: 50,
        description: '',
      });
    } catch (err) {
      alert('Error publishing assignment: ' + err.message);
    }
  };

  // 4. Grade Submission
  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!activeGradingSub) return;
    try {
      await gradeStudentSubmission(
        activeGradingSub.assignmentId,
        activeGradingSub.subId,
        {
          marksObtained: Number(gradingState.marks),
          feedback: gradingState.feedback,
        }
      );
      await loadData();
      triggerToast(`Marks awarded for ${activeGradingSub.studentName}!`);
      setActiveGradingSub(null);
      setGradingState({ marks: '', feedback: '' });
    } catch (err) {
      alert('Error grading submission: ' + err.message);
    }
  };

  const totalLectures = courses.reduce(
    (acc, c) => acc + (c.modules ? c.modules.flatMap((m) => m.lectures).length : c.totalLessons || 0),
    0
  );

  const allSubmissions = assignments.flatMap((a) =>
    (a.submissions || []).map((s) => ({
      ...s,
      assignmentTitle: a.title,
      assignmentId: a._id,
      maxMarks: a.totalMarks,
    }))
  );

  const initials = currentInstructor.name
    ? currentInstructor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'RS';

  const selectedCourseObj = courses.find((c) => c._id === selectedCourseId) || courses[0];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION (MATCHING STUDENT & ADMIN DASHBOARD) */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-200">
              E
            </div>
            <div>
              <p className="font-black text-slate-900 leading-tight">EduLearn LMS</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Instructor Studio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Faculty Profile Card & Logout at Bottom */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{currentInstructor.name}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{currentInstructor.facultyId}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 space-y-6 overflow-y-auto">
        {/* SUPER ADMIN GOVERNANCE BANNER */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl px-5 py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] leading-relaxed">
              <b>Academic Oversight Active:</b> All published curriculums, video lectures, and student grades are synchronized with MongoDB Atlas and subject to Super Administrator audit.
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800 shrink-0">
            Faculty Status: Active
          </span>
        </div>

        {/* ==================== 1. STUDIO OVERVIEW ==================== */}
        {activeNav === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Faculty Dashboard · {currentInstructor.name}</h1>
                <p className="text-xs text-slate-500 mt-1">{currentInstructor.department} · Academic Year 2026</p>
              </div>
              <button
                onClick={() => setActiveNav('create_course')}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Create New Course
              </button>
            </div>

            {/* 4 Performance Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Published Tracks', value: `${courses.length}`, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Video Lessons', value: `${totalLectures}`, icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Assignments', value: `${assignments.length}`, icon: FolderKanban, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Submissions Received', value: `${allSubmissions.length}`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900">{value}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Grid: Courses List & Pending Tasks */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Courses Breakdown */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Active Teaching Tracks
                  </h2>
                  <button onClick={() => setActiveNav('courses')} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                    Manage all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <div key={course._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                        {course.category?.slice(0, 2).toUpperCase() || 'CS'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{course.title}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {course.hours} · {course.modules?.length || 1} Modules · {course.totalLessons || 1} Lessons
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCourseId(course._id);
                          setActiveNav('curriculum');
                        }}
                        className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" /> Curriculum
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submissions Action Queue */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-purple-600" />
                      Pending Evaluations
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      {allSubmissions.filter((s) => s.status !== 'Graded').length} Pending
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {allSubmissions.slice(0, 3).map((sub) => (
                      <div key={sub._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <p className="text-xs font-bold text-slate-900">{sub.studentName}</p>
                        <p className="text-[11px] text-indigo-600 truncate">{sub.assignmentTitle}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{sub.studentId}</span>
                          <span className="text-[10px] font-bold text-amber-600">Pending Review</span>
                        </div>
                      </div>
                    ))}
                    {allSubmissions.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-6">All submissions evaluated.</p>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveNav('assignments')}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold rounded-xl transition-all text-center"
                  >
                    Open Grading Queue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. COURSE CATALOG ==================== */}
        {activeNav === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Your Course Catalog</h1>
                <p className="text-xs text-slate-500 mt-1">Live curriculum tracks available to enrolled learners.</p>
              </div>
              <button
                onClick={() => setActiveNav('create_course')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> New Course
              </button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div key={course._id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {course.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{course.hours}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-3">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs flex justify-between">
                      <span className="text-slate-500">Modules: <b>{course.modules?.length || 1}</b></span>
                      <span className="text-slate-500">Video Lessons: <b>{course.totalLessons || 1}</b></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setActiveNav('curriculum');
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" /> Manage Lectures
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 3. CREATE NEW COURSE ==================== */}
        {activeNav === 'create_course' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Publish New Course</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter syllabus details and opening lesson. Real course will be immediately committed to MongoDB Atlas.
              </p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 14 & Server Components Masterclass"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  >
                    <option>Web Dev</option>
                    <option>Core CS</option>
                    <option>Database</option>
                    <option>AI & Machine Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 35 hrs"
                    value={newCourse.hours}
                    onChange={(e) => setNewCourse({ ...newCourse, hours: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Learning Outcomes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe key concepts, tools taught, and practical project deliverables..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none resize-none focus:border-indigo-500"
                />
              </div>

              {/* Opening Lecture Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-bold text-slate-800">Opening Video Lesson (Unit 1)</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Lecture Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Course Architecture & Project Setup"
                      value={newCourse.firstLectureTitle}
                      onChange={(e) => setNewCourse({ ...newCourse, firstLectureTitle: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Streaming Video URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/embed/..."
                      value={newCourse.firstLectureVideo}
                      onChange={(e) => setNewCourse({ ...newCourse, firstLectureVideo: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Publish Course Directly to Platform
              </button>
            </form>
          </div>
        )}

        {/* ==================== 4. CURRICULUM & LECTURES ==================== */}
        {activeNav === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Curriculum Studio</h1>
                <p className="text-xs text-slate-500 mt-1">Manage modules and append video streaming lectures.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Select Track:</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none shadow-xs"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* CURRENT SYLLABUS LECTURES LIST */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{selectedCourseObj?.title}</h2>
                    <p className="text-xs text-slate-500">{selectedCourseObj?.category} · {selectedCourseObj?.hours}</p>
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
                    {selectedCourseObj?.modules?.length || 1} Modules Live
                  </span>
                </div>

                <div className="space-y-4">
                  {(selectedCourseObj?.modules || []).map((mod, mIdx) => (
                    <div key={mIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                      <p className="text-xs font-black text-slate-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        {mod.title}
                      </p>
                      <div className="divide-y divide-slate-200/60">
                        {mod.lectures.map((lec, lIdx) => (
                          <div key={lIdx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-4 h-4 text-slate-400" />
                              <span className="font-bold text-slate-800">{lec.title}</span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">{lec.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FORM TO ADD NEW LECTURE */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Add New Lecture</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Appends to the selected course curriculum.</p>
                </div>

                <form onSubmit={handleAddLecture} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Module Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Module 2: Authentication"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Lecture Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Protected Routes & Middleware"
                      value={lectureTitle}
                      onChange={(e) => setLectureTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 35 min"
                      value={lectureDuration}
                      onChange={(e) => setLectureDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Video Stream URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/embed/..."
                      value={lectureVideoUrl}
                      onChange={(e) => setLectureVideoUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[11px] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Commit Lecture to DB
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. ASSIGNMENTS & GRADING ==================== */}
        {activeNav === 'assignments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Assignments Studio & Evaluation</h1>
              <p className="text-xs text-slate-500 mt-1">
                Publish practical tasks and grade student-submitted GitHub repositories.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* PUBLISH ASSIGNMENT FORM */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Create New Assignment</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Will be visible on student dashboard.</p>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assignment Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Implement JWT Verification Middleware"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assign to Course</label>
                    <select
                      value={newAssignment.course}
                      onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      {courses.map((c) => (
                        <option key={c._id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Marks</label>
                      <input
                        type="number"
                        required
                        value={newAssignment.totalMarks}
                        onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Deadline</label>
                      <input
                        type="text"
                        required
                        value={newAssignment.deadline}
                        onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Requirements & Instructions</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify code requirements, test cases, and expected GitHub repo files..."
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Publish to Students
                  </button>
                </form>
              </div>

              {/* STUDENT SUBMISSIONS EVALUATION QUEUE */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Student Submissions Queue</h3>
                    <p className="text-[11px] text-slate-500">Inspect submitted repositories and assign marks.</p>
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
                    {allSubmissions.length} Submissions
                  </span>
                </div>

                {allSubmissions.length === 0 ? (
                  <div className="text-center py-16 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No student submissions in queue</p>
                    <p className="text-[11px] text-slate-400">When students submit solutions from their dashboard, they will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {allSubmissions.map((sub) => (
                      <div key={sub._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({sub.studentEmail})</span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {sub.status === 'Graded' ? `Graded: ${sub.marksObtained}/${sub.maxMarks}` : 'Pending Evaluation'}
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">{sub.assignmentTitle}</p>
                          <a
                            href={sub.solutionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-600 font-mono mt-1 underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Inspect Repo: {sub.solutionUrl}
                          </a>
                        </div>

                        <div>
                          <button
                            onClick={() =>
                              setActiveGradingSub({
                                assignmentId: sub.assignmentId,
                                subId: sub._id,
                                studentName: sub.studentName,
                                maxMarks: sub.maxMarks,
                              })
                            }
                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-xl text-xs font-bold transition-all border border-indigo-200"
                          >
                            {sub.status === 'Graded' ? 'Update Grade' : 'Award Marks'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. LEARNER ENGAGEMENT ==================== */}
        {activeNav === 'students' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Learner Analytics & Engagement</h1>
              <p className="text-xs text-slate-500 mt-1">Monitor student completion pacing and attendance metrics.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <p className="text-xs text-slate-500">Active Learners</p>
                <p className="text-2xl font-black text-slate-900 mt-1">128 Enrolled</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <p className="text-xs text-slate-500">Course Completion Rate</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">74.2%</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <p className="text-xs text-slate-500">Average Assessment Score</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">88 / 100</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Learner Activity Log</h2>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Rahul Student</span>
                  <span className="text-slate-500">Completed Lesson 2: Express Middleware</span>
                  <span className="text-[11px] font-mono text-emerald-600">Active Today</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Sneha Patel</span>
                  <span className="text-slate-500">Completed Binary Trees Traversals</span>
                  <span className="text-[11px] font-mono text-slate-400">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 7. PLATFORM GOVERNANCE ==================== */}
        {activeNav === 'governance' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl space-y-5">
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                Institutional Governance & Compliance
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Faculty code of conduct and administrative oversight policies.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Super Administrator Master Control</p>
                <p>The Super Administrator reserves the right to review, suspend, or revoke faculty courses and portal access in case of curriculum discrepancies or student grievances.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Course Authenticity & Streaming Standards</p>
                <p>All video units must contain real, verified programming lectures. Dummy animation videos or unauthorized external materials are strictly prohibited.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Transparent Homework Evaluation</p>
                <p>Assignment grading must include constructive feedback. Student submissions are preserved for institutional audit.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* GRADING MODAL */}
      {activeGradingSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Award Marks to {activeGradingSub.studentName}</h3>
              <p className="text-[11px] text-slate-500">Maximum marks: {activeGradingSub.maxMarks}</p>
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Marks Obtained</label>
                <input
                  type="number"
                  required
                  max={activeGradingSub.maxMarks}
                  placeholder={`e.g. ${activeGradingSub.maxMarks - 2}`}
                  value={gradingState.marks}
                  onChange={(e) => setGradingState({ ...gradingState, marks: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Feedback</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Excellent middleware logic and clean error handling."
                  value={gradingState.feedback}
                  onChange={(e) => setGradingState({ ...gradingState, feedback: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGradingSub(null)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
