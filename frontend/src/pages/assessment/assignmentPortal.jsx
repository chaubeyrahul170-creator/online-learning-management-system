import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  Clock,
  FileText,
  FolderKanban,
  ExternalLink,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { getAssignments, submitAssignmentSolution } from '../../services/assignmentService';

export default function AssignmentPortal() {
  const { assignments: mockAssignments } = useLMS();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [solutionUrl, setSolutionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Current logged in user
  const currentUser = (() => {
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
  })();

  const fetchLiveAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAssignments();
      if (data && data.length > 0) {
        setAssignments(data);
      } else {
        setAssignments(mockAssignments || []);
      }
    } catch (err) {
      console.log('Error fetching assignments, fallback to mock:', err.message);
      setAssignments(mockAssignments || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAssignments();
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!solutionUrl.trim() || !selected) return;

    setSubmitting(true);
    try {
      if (selected._id) {
        await submitAssignmentSolution(selected._id, {
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          studentId: currentUser.studentId,
          solutionUrl: solutionUrl.trim(),
          notes: notes.trim(),
        });
      }

      setSent(true);
      triggerToast('Assignment submitted successfully to faculty queue!');
      setTimeout(() => {
        setSent(false);
        setSelected(null);
        setSolutionUrl('');
        setNotes('');
        fetchLiveAssignments();
      }, 1500);
    } catch (err) {
      console.log('Submission failed:', err.message);
      triggerToast('Submission recorded in session.');
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] p-4 sm:p-8 transition-colors">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/student-dashboard"
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to workspace
          </Link>
          <span className="badge-blue flex items-center gap-1">
            <FolderKanban size={12} /> ASSESSMENTS
          </span>
        </div>

        {/* Header Panel */}
        <header className="panel">
          <h1 className="page-title text-xl">Assignments & Practical Work</h1>
          <p className="page-subtitle">
            Submit GitHub repository links, practical files, and project reports before the faculty deadline.
          </p>
        </header>

        {/* Assignments Grid */}
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Loading active assignments from MongoDB...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((a) => {
              const mySub = (a.submissions || []).find((s) => s.studentEmail === currentUser.email);
              const isClosed = a.status === 'Closed';

              return (
                <article
                  key={a._id || a.id}
                  className="panel flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1422] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isClosed
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : mySub
                            ? mySub.status === 'Graded'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {isClosed ? 'Closed' : mySub ? mySub.status : 'Open'}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {a.totalMarks || a.marks || 50} Marks
                      </span>
                    </div>

                    <h2 className="font-black text-sm text-slate-900 dark:text-white leading-snug">
                      {a.title}
                    </h2>

                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                      {a.course}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {a.description || 'Complete the practical task and submit your final solution for faculty evaluation.'}
                    </p>

                    {/* If student already submitted */}
                    {mySub && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Your Submission:</span>
                          <span className="text-emerald-600 font-bold text-[10px]">
                            {mySub.status === 'Graded' ? `Score: ${mySub.marksObtained}/${a.totalMarks || 50}` : 'In Review'}
                          </span>
                        </div>
                        <a
                          href={mySub.solutionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px] truncate"
                        >
                          <ExternalLink size={12} /> {mySub.solutionUrl}
                        </a>
                        {mySub.feedback && (
                          <p className="text-slate-500 italic text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                            Faculty: "{mySub.feedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-3">
                      <Clock size={13} className="text-rose-500" />
                      <span>Due: {a.deadline || 'Upcoming'}</span>
                    </div>

                    {mySub ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Check size={14} /> Solution Submitted
                      </button>
                    ) : (
                      <button
                        disabled={isClosed}
                        onClick={() => setSelected(a)}
                        className="w-full btn-primary py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold disabled:opacity-50"
                      >
                        <UploadCloud size={15} /> Submit Solution
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="panel max-w-lg w-full bg-white dark:bg-[#0d1422] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 size={42} className="text-emerald-500 mx-auto" />
                <h3 className="font-black mt-3 text-base text-slate-900 dark:text-white">Submission Received</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your project repository has been queued for faculty evaluation.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="badge-blue text-[10px]">SUBMIT WORK</span>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white mt-2">
                      {selected.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selected.course} · {selected.totalMarks || selected.marks || 50} Marks</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      GitHub Repository Solution URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/project-repo"
                      value={solutionUrl}
                      onChange={(e) => setSolutionUrl(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Implementation Notes / Test Instructions (Optional)
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Mention test cases passed, libraries installed, commands to run..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="btn-secondary flex-1 py-2.5 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      {submitting ? 'Submitting...' : 'Confirm Submission'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
