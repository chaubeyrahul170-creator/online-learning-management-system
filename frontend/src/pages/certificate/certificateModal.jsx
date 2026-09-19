import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, LockKeyhole, CheckCircle2, Circle, PlayCircle,
  Download, Share2, ShieldCheck, ExternalLink, Clock3,
  BookOpen, Trophy, FileCheck2, ArrowLeft, GraduationCap,
  Printer, Check, Copy, X, Sparkles
} from 'lucide-react';
import { getAllCourses } from '../../services/courseService';

function CertificateDoc({ course, studentName, studentId }) {
  return (
    <div
      id="certificate-doc"
      style={{
        width: '794px',
        minHeight: '562px',
        background: 'white',
        border: '12px solid #1e293b',
        borderRadius: '16px',
        padding: '44px 52px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Georgia, serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Corner decorations */}
      {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8`}>
          <Award className="w-8 h-8 text-amber-400 opacity-50" />
        </div>
      ))}

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      >
        <Award style={{ width: 320, height: 320, color: '#1e293b' }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <GraduationCap style={{ width: 28, height: 28, color: '#2563eb' }} />
          <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontFamily: 'sans-serif' }}>
            EduLearn Platform
          </span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
          <CheckCircle2 style={{ width: 14, height: 14, color: '#16a34a' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            100% Verified Academic Credential
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
          Certificate of Course Completion
        </h1>
        <div style={{ width: 80, height: 3, background: '#2563eb', borderRadius: 2, margin: '0 auto 8px' }} />
        <p style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'sans-serif', margin: 0 }}>
          This is proudly awarded to
        </p>
      </div>

      {/* Student Name */}
      <div style={{ textAlign: 'center', margin: '0 0 16px' }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, color: '#2563eb', borderBottom: '2px solid #e2e8f0', display: 'inline-block', padding: '0 40px 6px', margin: '0 0 6px' }}>
          {studentName}
        </h2>
        <p style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', margin: 0 }}>
          Learner ID: {studentId}
        </p>
      </div>

      {/* Body text */}
      <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 24px', fontFamily: 'sans-serif' }}>
        For successfully completing 100% course syllabus, lecture modules, and practical assessments for the professional program in{' '}
        <strong style={{ color: '#0f172a' }}>"{course.name}"</strong>{' '}
        with academic grade of{' '}
        <strong style={{ color: '#16a34a' }}>{course.grade}</strong>.
      </p>

      {/* Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: 18, marginTop: 4 }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>{course.issueDate}</p>
          <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontFamily: 'sans-serif' }}>Date of Issue</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fffbeb', border: '2px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
            <Award style={{ width: 26, height: 26, color: '#d97706' }} />
          </div>
          <p style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748b', margin: 0 }}>{course.certificateId}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '0 0 2px' }}>{course.instructor}</p>
          <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontFamily: 'sans-serif' }}>Course Instructor & Dean</p>
        </div>
      </div>

      {/* Certificate ID bottom */}
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '3px 12px' }}>
          <ShieldCheck style={{ width: 12, height: 12, color: '#10b981' }} />
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748b' }}>
            Verification Code: {course.certificateId} · Verified by EduLearn LMS
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CertificateModal() {
  // 1. Get real logged-in student info from Auth Session
  const [currentUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edulearn_user'));
      return {
        name: stored?.name || 'Student',
        email: stored?.email || 'student@edulearn.com',
        studentId: stored?.studentId || 'STU-101',
      };
    } catch {
      return { name: 'Student', email: 'student@edulearn.com', studentId: 'STU-101' };
    }
  });

  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // 2. Fetch Real Courses from MongoDB Backend with Isolated Student Progress
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const dbCourses = await getAllCourses();

        // Real student-isolated progress check:
        let savedProgress = {};
        try {
          savedProgress = JSON.parse(localStorage.getItem(`edulearn_progress_${currentUser.email}`)) || {};
        } catch {
          savedProgress = {};
        }

        // Only default seeded demo student has pre-seeded progress
        if (currentUser.email === 'student@edulearn.com' && Object.keys(savedProgress).length === 0) {
          savedProgress = {
            '1': { completedLessons: 1, progress: 25 },
            '2': { completedLessons: 2, progress: 100 },
            '3': { completedLessons: 0, progress: 0 },
          };
        }

        const formatted = (dbCourses || []).map((c, idx) => {
          const cid = c._id || String(c.id || idx + 1);
          const userP = savedProgress[cid] || { completedLessons: 0, progress: 0 };
          const progressVal = userP.progress || 0;
          const completedCount = userP.completedLessons || 0;
          const totalLessons = c.totalLessons || (c.modules ? c.modules.flatMap((m) => m.lectures).length : 4);
          const isEligible = progressVal >= 100;

          return {
            id: cid,
            name: c.title,
            shortName: c.title.split(' ')[0] + ' ' + (c.title.split(' ')[1] || ''),
            instructor: c.instructor,
            progress: progressVal,
            totalLectures: totalLessons,
            completedLectures: completedCount,
            grade: isEligible ? 'Grade A+ (Distinction)' : 'In Progress',
            category: c.category || 'Web Dev',
            eligible: isEligible,
            certificateId: `CERT-EDU-2026-${(c._id ? c._id.slice(-6).toUpperCase() : '9821')}`,
            issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          };
        });

        setCourses(formatted);
        if (formatted.length > 0) {
          // Select 100% completed course if available, or first course
          const completedOne = formatted.find((x) => x.eligible);
          setSelected(completedOne || formatted[0]);
        }
      } catch (err) {
        console.log('Error fetching courses for certificate:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [currentUser]);

  const handleDownload = () => {
    if (!selected?.eligible) return;
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const printContents = document.getElementById('certificate-doc').outerHTML;
      const win = window.open('', '_blank');
      win.document.write(`
        <html>
          <head>
            <title>Certificate - ${selected.name}</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        setDownloading(false);
        setShowDownloadModal(false);
      }, 500);
    }, 1000);
  };

  const handleCopyId = () => {
    if (selected?.certificateId) {
      navigator.clipboard.writeText(selected.certificateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const steps = (course) => [
    { label: 'Complete all video lectures', done: course.progress === 100, detail: `${course.completedLectures}/${course.totalLectures} lectures completed` },
    { label: 'Complete curriculum evaluations', done: course.eligible, detail: course.eligible ? 'All modules completed' : 'Pending' },
    { label: 'Academic eligibility clearance', done: course.eligible, detail: course.eligible ? 'Cleared by Admin' : 'In Progress' },
    { label: 'Official certificate issuance', done: course.eligible, detail: course.eligible ? 'Ready to download & print' : 'Locked', locked: !course.eligible },
  ];

  const earnedCount = courses.filter((c) => c.eligible).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Checking Course Eligibility...</p>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-sm space-y-3">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Enrolled Courses Found</h2>
          <p className="text-xs text-slate-500">Please enroll in a course to view certificates.</p>
          <Link to="/student-dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Certificate Center</p>
              <p className="text-[10px] text-slate-400">Verified LMS Credentials</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-emerald-700">{earnedCount}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Earned</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-slate-700">{courses.length - earnedCount}</p>
              <p className="text-[10px] text-slate-400 font-semibold">In Progress</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-2">My Enrolled Courses</p>
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelected(course)}
              className={`w-full text-left p-3 rounded-xl transition-all border ${
                selected.id === course.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold truncate pr-2">{course.name}</span>
                {course.eligible ? (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${selected.id === course.id ? 'text-white' : 'text-emerald-500'}`} />
                ) : (
                  <LockKeyhole className={`w-4 h-4 shrink-0 ${selected.id === course.id ? 'text-blue-200' : 'text-slate-400'}`} />
                )}
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${selected.id === course.id ? 'bg-blue-400' : 'bg-slate-100'}`}>
                <div
                  className={`h-full rounded-full ${course.eligible ? 'bg-emerald-400' : selected.id === course.id ? 'bg-white' : 'bg-blue-500'}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className={`text-[10px] mt-1 font-semibold ${selected.id === course.id ? 'text-blue-100' : 'text-slate-400'}`}>
                {course.progress}% completed
              </p>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <Link
            to="/student-dashboard"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 min-w-0 p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              {selected.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Instructor: <b>{selected.instructor}</b> · Learner: <b className="text-blue-600">{currentUser.name}</b>
            </p>
          </div>
          {selected.eligible && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Completion', value: `${selected.progress}%`, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Lessons Completed', value: `${selected.completedLectures}/${selected.totalLectures}`, icon: FileCheck2, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Credential Status', value: selected.eligible ? 'Certified & Verified' : 'In Progress', icon: selected.eligible ? ShieldCheck : Clock3, color: selected.eligible ? 'text-emerald-600' : 'text-orange-500', bg: selected.eligible ? 'bg-emerald-50' : 'bg-orange-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">{value}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Checklist + Certificate Preview */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Eligibility Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Eligibility Checklist</h2>
            </div>
            <div className="p-4 space-y-2.5">
              {steps(selected).map((step, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    step.done
                      ? 'bg-emerald-50 border-emerald-200'
                      : step.locked
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : step.locked ? (
                      <LockKeyhole className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{step.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                  <span>Course Completion</span>
                  <span className={selected.progress === 100 ? 'text-emerald-600 font-bold' : 'text-orange-500 font-bold'}>
                    {selected.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${selected.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${selected.progress}%` }}
                  />
                </div>
              </div>
              {!selected.eligible && (
                <Link
                  to={`/course/${selected.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all mt-2"
                >
                  <PlayCircle className="w-4 h-4" /> Continue Watching Lessons
                </Link>
              )}
            </div>
          </div>

          {/* Certificate Live Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Certificate Document</h2>
              </div>
              {selected.eligible && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-all"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy ID'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              {selected.eligible ? (
                <div className="overflow-auto border border-slate-100 rounded-2xl">
                  <div className="scale-[0.55] origin-top-left" style={{ width: '794px', marginBottom: '-250px' }}>
                    <CertificateDoc course={selected} studentName={currentUser.name} studentId={currentUser.studentId} />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4 bg-slate-50 relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                    <LockKeyhole className="w-7 h-7 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      Certificate Locked
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-2">{100 - selected.progress}% Remaining</p>
                    <p className="text-[11px] text-slate-500 mt-1">Complete all video lectures to unlock your verified credential.</p>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-xs">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selected.progress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {selected.eligible && (
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download PDF / Print
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DOWNLOAD / PRINT CONFIRMATION MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Download Certificate</h3>
                  <p className="text-[11px] text-slate-500">Official PDF document</p>
                </div>
              </div>
              <button onClick={() => setShowDownloadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
              <Award className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs font-black text-slate-900">{selected.name}</p>
              <p className="text-[11px] text-slate-600">Awarded to: <b>{currentUser.name}</b></p>
              <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Credential · {selected.certificateId}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                disabled={downloading}
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                {downloading ? 'Preparing...' : 'Print / Save PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
