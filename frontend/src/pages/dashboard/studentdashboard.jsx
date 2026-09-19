import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, FileCheck2, FolderKanban, Award, PlayCircle,
  Clock, CheckCircle2, Globe, Zap, Database,
  MessageSquareWarning, Send, ShieldAlert, Star, X,
  LayoutDashboard, Bell, TrendingUp, ChevronRight,
  Target, Calendar, BarChart2, User, Flame, Trophy,
  AlertCircle, BookMarked, Mail, MapPin,
  ExternalLink, Edit2, Shield, UploadCloud, FileText, Check,
  Sparkles, Lock, GraduationCap, Share2, Code, CheckCircle, ShieldCheck,
  LogOut
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { getAllCourses } from '../../services/courseService';
import { getAssignments, submitAssignmentSolution } from '../../services/assignmentService';
import { logout } from '../../services/authService';

const defaultCourses = [
  {
    _id: '1',
    id: 1,
    title: 'Full Stack Web Development (MERN)',
    subtitle: 'Express Middleware & Protected Routes',
    instructor: 'Dr. Rahul Sharma',
    totalLessons: 4,
    hours: '42 hrs',
    category: 'Web Dev',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    _id: '2',
    id: 2,
    title: 'Data Structures & Algorithms in Java',
    subtitle: 'Binary Trees & Tree Traversals',
    instructor: 'Prof. Anjali Verma',
    totalLessons: 2,
    hours: '56 hrs',
    category: 'Core CS',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    _id: '3',
    id: 3,
    title: 'Database Management Systems',
    subtitle: 'Indexing & MongoDB Aggregations',
    instructor: 'Dr. Rahul Sharma',
    totalLessons: 4,
    hours: '30 hrs',
    category: 'Database',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

const fallbackAssignments = [
  {
    _id: '1',
    title: 'MERN Stack Authentication & Protected Routes',
    course: 'Full Stack Web Development (MERN)',
    deadline: 'Tomorrow, 11:59 PM',
    totalMarks: 50,
    description: 'Build Express middleware to verify JWT tokens and restrict unapproved student login.',
    submissions: [],
  },
  {
    _id: '2',
    title: 'Binary Search Tree Depth & Traversals',
    course: 'Data Structures & Algorithms in Java',
    deadline: '08 Sep 2026',
    totalMarks: 50,
    description: 'Implement iterative and recursive traversals for binary trees in Java.',
    submissions: [],
  },
];

const initialQuizzes = [
  {
    id: 1,
    title: 'Express & RESTful Architecture Unit Quiz',
    course: 'Full Stack Web Development (MERN)',
    duration: '10 Mins',
    questions: 5,
    due: 'Flexible',
    status: 'Ready to Start',
    path: '/quiz/1',
  },
  {
    id: 2,
    title: 'Java Binary Trees & Recursion Test',
    course: 'Data Structures & Algorithms in Java',
    duration: '10 Mins',
    questions: 5,
    due: 'Flexible',
    status: 'Ready to Start',
    path: '/quiz/2',
  },
  {
    id: 3,
    title: 'SQL Normalization & Indexing Assessment',
    course: 'Database Management Systems',
    duration: '10 Mins',
    questions: 5,
    due: 'Flexible',
    status: 'Ready to Start',
    path: '/quiz/3',
  },
];

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: FolderKanban },
  { id: 'quizzes', label: 'Tests & Quizzes', icon: FileCheck2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'progress', label: 'My Progress', icon: BarChart2 },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'grievance', label: 'Grievance', icon: MessageSquareWarning },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { submitFeedback } = useLMS();
  const [activeNav, setActiveNav] = useState('overview');

  // Grievance modal states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [targetFaculty, setTargetFaculty] = useState('Dr. Rahul Sharma');
  const [targetCourse, setTargetCourse] = useState('Full Stack Web Development (MERN)');
  const [feedbackType, setFeedbackType] = useState('Lecture Quality & Pace Issue');
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');

  // Assignment modal states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentSolution, setAssignmentSolution] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignmentToast, setAssignmentToast] = useState('');
  const [assignmentsList, setAssignmentsList] = useState([]);

  // 1. Current Student Identity (Supports both flat and nested formats instantly!)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edulearn_user'));
      const u = stored?.user || stored;
      return {
        name: u?.name || 'Student',
        email: u?.email || 'student@edulearn.com',
        studentId: u?.studentId || 'STU-101',
      };
    } catch {
      return { name: 'Student', email: 'student@edulearn.com', studentId: 'STU-101' };
    }
  });

  // Profile Details
  const [profileExtra, setProfileExtra] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`edulearn_profile_${currentUser.email}`));
      return saved || {
        headline: 'Aspiring Full Stack Engineer & Computer Science Student',
        location: 'India',
        bio: 'Passionate computer science learner pursuing active coursework in Web Development, Scalable Backend Systems, and Data Structures.',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      };
    } catch {
      return {
        headline: 'Aspiring Full Stack Engineer & Computer Science Student',
        location: 'India',
        bio: 'Passionate computer science learner pursuing active coursework in Web Development, Scalable Backend Systems, and Data Structures.',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      };
    }
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: currentUser?.name || '',
    headline: profileExtra?.headline || '',
    location: profileExtra?.location || '',
    bio: profileExtra?.bio || '',
    github: profileExtra?.github || '',
    linkedin: profileExtra?.linkedin || '',
  });

  // 2. USER-SPECIFIC PROGRESS (0% for any new student!)
  const [studentProgress, setStudentProgress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`edulearn_progress_${currentUser.email}`));
      if (saved) return saved;

      // Only default seeded demo student has pre-seeded progress
      if (currentUser.email === 'student@edulearn.com') {
        return {
          '1': { completedLessons: 1, progress: 25 },
          '2': { completedLessons: 2, progress: 100 },
          '3': { completedLessons: 0, progress: 0 },
        };
      }

      // New student starts with 0%
      return {};
    } catch {
      return {};
    }
  });

  const [courses, setCourses] = useState(defaultCourses);
  const [loading, setLoading] = useState(true);

  const fetchLiveAssignments = async () => {
    try {
      const data = await getAssignments();
      if (data && data.length > 0) {
        setAssignmentsList(data);
      } else {
        setAssignmentsList(fallbackAssignments);
      }
    } catch (err) {
      setAssignmentsList(fallbackAssignments);
    }
  };

  useEffect(() => {
    const fetchCoursesFromAPI = async () => {
      try {
        const data = await getAllCourses();
        if (data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {
        console.log('Using fallback courses:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesFromAPI();
    fetchLiveAssignments();
  }, []);

  // Compute student-specific stats
  const studentCourses = courses.map((c) => {
    const cid = c._id || String(c.id);
    const userP = studentProgress[cid] || { completedLessons: 0, progress: 0 };
    return {
      ...c,
      completedLessons: userP.completedLessons || 0,
      progress: userP.progress || 0,
    };
  });

  const totalLessonsDone = studentCourses.reduce((acc, c) => acc + (c.completedLessons || 0), 0);
  const totalLessonsAll = studentCourses.reduce((acc, c) => acc + (c.totalLessons || 4), 0);
  const overallProgress = totalLessonsAll > 0 ? Math.round((totalLessonsDone / totalLessonsAll) * 100) : 0;

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  const getCourseIcon = (category) => {
    switch (category) {
      case 'Web Dev':
        return <Globe className="w-5 h-5 text-white" />;
      case 'Core CS':
        return <Zap className="w-5 h-5 text-white" />;
      case 'Database':
        return <Database className="w-5 h-5 text-white" />;
      default:
        return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    submitFeedback({
      facultyName: targetFaculty,
      courseName: targetCourse,
      feedbackType,
      rating,
      message,
    });
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setMessage('');
    }, 2000);
  };

  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentSolution('');
    setAssignmentNotes('');
  };

  const handleSubmitAssignmentForm = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !assignmentSolution.trim()) return;

    try {
      await submitAssignmentSolution(selectedAssignment._id, {
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        solutionUrl: assignmentSolution.trim(),
        notes: assignmentNotes.trim(),
      });

      setAssignmentToast('Assignment submitted to Faculty grading queue!');
      setTimeout(() => setAssignmentToast(''), 4000);
      setSelectedAssignment(null);
      fetchLiveAssignments();
    } catch (err) {
      setAssignmentToast('Submission recorded in student profile');
      setTimeout(() => setAssignmentToast(''), 4000);
      setSelectedAssignment(null);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, name: editFormData.name };
    const updatedExtra = {
      headline: editFormData.headline,
      location: editFormData.location,
      bio: editFormData.bio,
      github: editFormData.github,
      linkedin: editFormData.linkedin,
    };

    localStorage.setItem('edulearn_user', JSON.stringify(updatedUser));
    localStorage.setItem(`edulearn_profile_${currentUser.email}`, JSON.stringify(updatedExtra));
    setCurrentUser(updatedUser);
    setProfileExtra(updatedExtra);
    setShowEditProfileModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {assignmentToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{assignmentToast}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              E
            </div>
            <div>
              <h2 className="font-black text-sm text-slate-900 leading-tight">EduLearn LMS</h2>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Student Portal</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at Bottom with 1-Click Logout */}
        <div className="p-4 m-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{currentUser.studentId}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Logout from LMS"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Welcome back, {currentUser.name}!</h1>
            <p className="text-xs text-slate-500 mt-1">Here is an overview of your enrolled courses and upcoming tasks.</p>
          </div>
          <Link
            to={`/course/${courses[0]?._id || '1'}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{overallProgress > 0 ? 'Resume Learning' : 'Start Learning'}</span>
          </Link>
        </div>

        {/* ================= SECTION: OVERVIEW ================= */}
        {activeNav === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{studentCourses.length}</div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{totalLessonsDone}</div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lessons Completed</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{overallProgress}%</div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{assignmentsList.length}</div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Assignments</span>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-blue-600" />
                    <span>Continue Learning</span>
                  </h3>
                  <button onClick={() => setActiveNav('courses')} className="text-xs font-bold text-blue-600 hover:underline">
                    View all &gt;
                  </button>
                </div>

                <div className="space-y-3">
                  {studentCourses.map((c) => (
                    <div key={c._id || c.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${c.gradient || 'from-blue-600 to-indigo-600'} flex items-center justify-center shrink-0`}>
                          {getCourseIcon(c.category)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{c.title}</h4>
                          <p className="text-[11px] text-slate-400">Instructor: {c.instructor}</p>
                          <div className="w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-bold text-slate-500 font-mono">{c.progress}%</span>
                        <Link
                          to={`/course/${c._id || c.id}`}
                          className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center gap-1.5"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{c.progress > 0 ? 'Resume' : 'Start'}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span>Due Assignments</span>
                </h3>

                {assignmentsList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No pending assignments</p>
                ) : (
                  <div className="space-y-3">
                    {assignmentsList.slice(0, 3).map((a) => (
                      <div key={a._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{a.title}</h5>
                        <p className="text-[11px] text-slate-500 truncate">{a.course}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {a.totalMarks} MARKS
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{a.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: MY COURSES ================= */}
        {activeNav === 'courses' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Enrolled Course Tracks</h2>
              <p className="text-xs text-slate-500">Curriculum units and streaming video lectures.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentCourses.map((c) => (
                <div key={c._id || c.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {c.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {c.hours}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.subtitle || c.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Completion Progress</span>
                      <span className="font-bold text-slate-900 font-mono">{c.progress}%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                    </div>

                    <Link
                      to={`/course/${c._id || c.id}`}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{c.progress > 0 ? 'Resume Lessons' : 'Start Course'}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: ASSIGNMENTS ================= */}
        {activeNav === 'assignments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Assignments & Evaluation Portal</h2>
              <p className="text-xs text-slate-500">Submit homework solutions via GitHub repository links to your course faculty.</p>
            </div>

            <div className="space-y-4">
              {assignmentsList.map((a) => {
                const mySub = (a.submissions || []).find((s) => s.studentEmail === currentUser.email);
                return (
                  <div key={a._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {a.course}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                          {a.totalMarks} MARKS
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Deadline: {a.deadline}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{a.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{a.description}</p>

                      {mySub && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700">Your Submission:</span>
                            <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${mySub.status === 'Graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {mySub.status === 'Graded' ? `Graded: ${mySub.marksObtained}/${a.totalMarks}` : 'Submitted (Awaiting Grade)'}
                            </span>
                          </div>
                          <a href={mySub.solutionUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> {mySub.solutionUrl}
                          </a>
                          {mySub.feedback && <p className="text-slate-500 italic mt-1 font-sans">Faculty Feedback: "{mySub.feedback}"</p>}
                        </div>
                      )}
                    </div>

                    <div>
                      {mySub ? (
                        <button disabled className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">
                          Work Submitted ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmitModal(a)}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all shrink-0"
                        >
                          <UploadCloud className="w-4 h-4" /> Submit Work
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: TESTS & QUIZZES ================= */}
        {activeNav === 'quizzes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Timed Assessment Quizzes</h2>
              <p className="text-xs text-slate-500">10-minute evaluations per unit.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {initialQuizzes.map((q) => (
                <div key={q.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase">
                      {q.course}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-2">{q.title}</h3>
                    <p className="text-xs text-slate-400">Duration: {q.duration} · {q.questions} Questions</p>
                  </div>

                  <Link
                    to={q.path}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" /> Start Quiz
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: CERTIFICATES ================= */}
        {activeNav === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Official Certificates & Credentials</h2>
              <p className="text-xs text-slate-500">Verified credentials unlock automatically upon 100% course completion.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentCourses.map((c) => {
                const isUnlocked = c.progress >= 100;
                return (
                  <div key={c._id || c.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {c.category}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked ({c.progress}%)
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-slate-900">{c.title}</h3>
                      <p className="text-xs text-slate-500">
                        {isUnlocked
                          ? 'Congratulations! You have completed all syllabus lectures.'
                          : 'Complete 100% of curriculum lectures to unlock your official verification certificate.'}
                      </p>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <Link
                          to="/certificate"
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                        >
                          <Award className="w-4 h-4" /> View & Print Certificate
                        </Link>
                      ) : (
                        <button disabled className="w-full py-2.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Certificate Locked
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: MY PROGRESS ================= */}
        {activeNav === 'progress' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Academic Progress & Metrics</h2>
              <p className="text-xs text-slate-500">Track your completed lecture hours and syllabus coverage.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400">Total Lessons Completed</span>
                <div className="text-3xl font-black text-slate-900">{totalLessonsDone} / {totalLessonsAll}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400">Overall Completion</span>
                <div className="text-3xl font-black text-blue-600">{overallProgress}%</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400">Unlocked Certificates</span>
                <div className="text-3xl font-black text-emerald-600">
                  {studentCourses.filter((c) => c.progress >= 100).length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: MY PROFILE ================= */}
        {activeNav === 'profile' && (
          <div className="space-y-6 max-w-5xl">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative">
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/20">
                  <GraduationCap className="w-3.5 h-3.5" /> Academic Year 2026
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-xl shrink-0">
                      {initials}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-2xl font-black text-slate-900 capitalize">{currentUser?.name || 'Student'}</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Student
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600">{profileExtra?.headline || 'Learner'}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Student ID: <span className="font-bold text-slate-600">{currentUser?.studentId || 'STU-101'}</span> · {currentUser?.email || ''}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditFormData({
                        name: currentUser?.name || '',
                        headline: profileExtra?.headline || '',
                        location: profileExtra?.location || '',
                        bio: profileExtra?.bio || '',
                        github: profileExtra?.github || '',
                        linkedin: profileExtra?.linkedin || '',
                      });
                      setShowEditProfileModal(true);
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Enrolled Courses</span>
                    <span className="text-base font-black text-slate-900 mt-0.5 block">{studentCourses.length} Tracks</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Completed Lessons</span>
                    <span className="text-base font-black text-emerald-600 mt-0.5 block">{totalLessonsDone} Lessons</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overall Progress</span>
                    <span className="text-base font-black text-blue-600 mt-0.5 block">{overallProgress}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Portal Status</span>
                    <span className="text-base font-black text-slate-900 mt-0.5 block">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About & Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>About Learner</span>
                  </h3>
                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {profileExtra?.bio || 'Enrolled in academic curriculum. Pursuing coursework.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    <span>Skills & Coursework Stack</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Java', 'Data Structures', 'REST APIs', 'Git & GitHub'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/60 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Institutional Credentials</span>
                  </h3>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Department</span>
                      <span className="font-bold text-slate-900">Computer Science & Engg</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Location</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {profileExtra?.location || 'India'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Account Type</span>
                      <span className="font-bold text-blue-600 font-mono">Student Account</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Professional Profiles</span>
                  </h3>

                  <div className="space-y-2">
                    <a
                      href={profileExtra?.github || 'https://github.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/60 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-slate-700" />
                        <div>
                          <p className="font-bold text-slate-900">GitHub Profile</p>
                          <span className="text-[10px] text-slate-400">{profileExtra?.github || 'https://github.com'}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={profileExtra?.linkedin || 'https://linkedin.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/60 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Share2 className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-900">LinkedIn Profile</p>
                          <span className="text-[10px] text-slate-400">{profileExtra?.linkedin || 'https://linkedin.com'}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: GRIEVANCE ================= */}
        {activeNav === 'grievance' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 max-w-3xl shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900">Institutional Grievance Portal</h2>
              <p className="text-xs text-slate-500">Report curriculum or faculty concerns directly to the Super Administrator.</p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Faculty</label>
                <select value={targetFaculty} onChange={(e) => setTargetFaculty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold">
                  <option value="Dr. Rahul Sharma">Dr. Rahul Sharma</option>
                  <option value="Prof. Anjali Verma">Prof. Anjali Verma</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issue Category</label>
                <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold">
                  <option value="Lecture Quality & Pace Issue">Lecture Quality & Pace Issue</option>
                  <option value="Unexplained Curriculum Skipped">Unexplained Curriculum Skipped</option>
                  <option value="Doubt Clearing Not Responded">Doubt Clearing Not Responded</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Grievance Note</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the institutional issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-normal"
                />
              </div>

              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <Send className="w-3.5 h-3.5" /> Submit Grievance to Administrator
              </button>

              {feedbackSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Grievance logged with Administrator for investigation.
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Submit Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Submit Assignment Solution</h3>
              <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">{selectedAssignment.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{selectedAssignment.course} · {selectedAssignment.totalMarks} Marks</p>
            </div>

            <form onSubmit={handleSubmitAssignmentForm} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">GitHub Repository Solution URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project-repo"
                  value={assignmentSolution}
                  onChange={(e) => setAssignmentSolution(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes for Faculty (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Mention instructions to run code, test cases passed..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-normal"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedAssignment(null)} className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-xs">
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Learner Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  value={editFormData.headline}
                  onChange={(e) => setEditFormData({ ...editFormData, headline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bio</label>
                <textarea
                  rows="3"
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
