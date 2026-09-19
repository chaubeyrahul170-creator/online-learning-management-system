import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import { getAllCourses } from '../../services/courseService';
import { ArrowRight, ShieldCheck, BookOpen, Clock } from 'lucide-react';

function Home() {
  const { courses: fallbackCourses } = useLMS();
  const [courses, setCourses] = useState(fallbackCourses || []);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('edulearn_role'));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const liveCourses = await getAllCourses();
        if (liveCourses && liveCourses.length > 0) {
          setCourses(liveCourses);
        }
      } catch (err) {
        console.log('Using fallback courses for home:', err);
      }
    };
    fetchCourses();
    setUserRole(localStorage.getItem('edulearn_role'));
  }, []);

  const dashboardPath =
    userRole === 'instructor'
      ? '/instructor-dashboard'
      : userRole === 'admin'
      ? '/admin-dashboard'
      : '/student-dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-800 dark:text-slate-100 antialiased transition-colors">
      
      {/* 1. Hero Banner */}
      <section className="bg-gradient-to-b from-white via-blue-50/40 to-slate-50 dark:from-[#0B0F19] dark:via-[#0E1322] dark:to-[#070A12] border-b border-slate-200/80 dark:border-slate-800 pt-12 pb-16 px-6 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Academic Year 2026 • Official LMS Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Academic Coursework, Lecture Delivery <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400">& Semester Assessments</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Centralized institutional platform to stream faculty lectures, access structured syllabus notes, and complete evaluated assignments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={userRole ? dashboardPath : '/login'}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>{userRole ? 'Go to My Dashboard' : 'Access Student & Faculty Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="#courses"
              className="px-6 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 rounded-xl shadow-xs transition-all"
            >
              Browse Active Syllabus
            </a>
          </div>

          {/* Institutional Regulation Callout */}
          <div className="max-w-xl mx-auto bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800 p-3.5 rounded-2xl flex items-center gap-3 text-left shadow-xs mt-4">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold shrink-0 text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 dark:text-amber-300">Institutional Access Policy</h4>
              <p className="text-[11px] text-amber-800 dark:text-amber-400/90 mt-0.5 leading-snug">
                Self-registration is restricted. Student credentials and faculty access are provisioned and governed by the Super Administrator.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Key Metrics Strip */}
      <section className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none">
          <div className="p-3 text-center md:text-left">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{courses.length * 12}+</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Curriculum Modules</p>
          </div>
          <div className="p-3 text-center md:text-left border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">3 Portals</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Student, Faculty, Admin</p>
          </div>
          <div className="p-3 text-center md:text-left border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">100%</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Verified Cohorts</p>
          </div>
          <div className="p-3 text-center md:text-left border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">HD Cloud</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Video Streaming</p>
          </div>
        </div>
      </section>

      {/* 3. Course Catalog Section */}
      <section id="courses" className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Active Semester Curriculums</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Access video playlists and downloadable faculty notes for your cohort.</p>
          </div>
          <Link to="/login" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Sign In to View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Visual Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => {
            const courseId = c._id || c.id;
            const courseTarget =
              userRole === 'student'
                ? `/course/${courseId}`
                : userRole === 'instructor'
                ? '/instructor-dashboard'
                : userRole === 'admin'
                ? '/admin-dashboard'
                : '/login';

            const moduleCountText = Array.isArray(c.modules)
              ? `${c.modules.length} Modules`
              : typeof c.modules === 'string'
              ? c.modules
              : `${c.totalLessons || 4} Lessons`;

            return (
              <div
                key={courseId}
                className="bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 group"
              >
                <div>
                  {/* Visual Header Banner */}
                  <div className={`h-28 bg-gradient-to-r ${c.gradient || c.accentColor || 'from-blue-600 to-indigo-700'} p-4 flex items-center justify-between text-white relative overflow-hidden`}>
                    <div className="space-y-1 relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                        {c.category}
                      </span>
                      <p className="text-xs text-blue-100 font-medium">{c.level || 'Semester Cohort'}</p>
                    </div>
                    <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform select-none">
                      {c.icon || '📚'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {c.subtitle || c.description || 'Comprehensive syllabus covered with recorded lectures, interactive unit quizzes, and evaluated assignments.'}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 pt-1">
                      Faculty: <span className="text-slate-900 dark:text-white font-semibold">{c.instructor}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.hours || '40 hrs'}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {moduleCountText}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-5 pt-0">
                  <Link
                    to={courseTarget}
                    className="block text-center w-full bg-slate-900 dark:bg-blue-600 group-hover:bg-blue-600 dark:group-hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-xs"
                  >
                    {userRole === 'student' ? 'Start Learning →' : userRole ? 'Open Portal →' : 'Access Lectures & Notes →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}

export default Home;
