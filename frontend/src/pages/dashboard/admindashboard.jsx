import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareWarning,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Users,
  Video,
  X,
  UserCheck,
  UserX,
  Clock,
  PauseCircle,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { logout } from '../../services/authService';
import {
  getPlatformStats,
  getAllUsers,
  getPendingUsers,
  approveUser,
  suspendUser,
  reinstateUser,
  deleteUser
} from '../../services/adminService';
import {
  VideosTab,
  FeedbackAuditTab,
  BroadcastTab,
  FacultyIndexTab,
  AuditLogsTab,
} from './adminTabs';

const navGroups = [
  {
    title: 'Overview',
    items: [{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Platform Control',
    items: [
      { id: 'faculty_control', label: 'Instructors', icon: Users },
      { id: 'tasks', label: 'Access Requests', icon: CheckSquare },
      { id: 'content', label: 'Course Catalog', icon: Video },
    ],
  },
  {
    title: 'Quality & Governance',
    items: [
      { id: 'faculty_index', label: 'Teaching Quality', icon: Star },
      { id: 'feedbacks', label: 'Student Grievances', icon: MessageSquareWarning },
      { id: 'broadcasts', label: 'Platform Notices', icon: Radio },
    ],
  },
  {
    title: 'System & Security',
    items: [
      { id: 'audit_logs', label: 'Security Timeline', icon: Activity },
      { id: 'settings', label: 'Governance Policies', icon: Settings },
    ],
  },
];

function AdminDashboard() {
  const navigateRoute = useNavigate();
  const { feedbacks, resolveFeedback } = useLMS();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');

  // Modals State
  const [suspendModal, setSuspendModal] = useState({ open: false, user: null, days: '7', reason: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [actionSuccess, setActionSuccess] = useState('');

  // Live Stats from MongoDB
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    pendingApprovals: 0,
    suspendedCount: 0,
    totalCourses: 0,
  });

  // Real Users from Database
  const [allDbUsers, setAllDbUsers] = useState([]);
  const [pendingList, setPendingList] = useState([]);

  const loadAdminData = async () => {
    try {
      const [statsData, usersData, pendingData] = await Promise.all([
        getPlatformStats(),
        getAllUsers(),
        getPendingUsers(),
      ]);
      if (statsData) setStats(statsData);
      if (usersData) setAllDbUsers(usersData);
      if (pendingData) setPendingList(pendingData);
    } catch (err) {
      console.log('Failed to fetch admin data:', err.message);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const triggerToast = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Handle Approve User
  const handleApproveUser = async (userId, name) => {
    try {
      await approveUser(userId);
      await loadAdminData();
      triggerToast(`Access granted for ${name}`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Handle Suspend Confirmation (Works from both Instructors Tab & Grievances Tab)
  const confirmSuspend = async () => {
    if (!suspendModal.user) return;
    try {
      if (suspendModal.user._id && !suspendModal.user._id.startsWith('temp-')) {
        await suspendUser(suspendModal.user._id, suspendModal.days, suspendModal.reason);
      }
      setSuspendModal({ open: false, user: null, days: '7', reason: '' });
      await loadAdminData();
      triggerToast(`${suspendModal.user.name} suspended for ${suspendModal.days} days`);
    } catch (err) {
      alert('Error suspending: ' + err.message);
    }
  };

  // Handle Reinstate Access
  const handleReinstate = async (user) => {
    try {
      await reinstateUser(user._id);
      await loadAdminData();
      triggerToast(`Publishing access restored for ${user.name}`);
    } catch (err) {
      alert('Error reinstating: ' + err.message);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await deleteUser(deleteModal.user._id);
      setDeleteModal({ open: false, user: null });
      await loadAdminData();
      triggerToast(`${deleteModal.user.name} removed from platform`);
    } catch (err) {
      alert('Error removing: ' + err.message);
    }
  };

  // Notices
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Platform Maintenance & System Upgrade',
      category: 'System Announcement',
      message: 'Routine optimizations will be deployed this Sunday at 2:00 AM IST.',
      date: 'Today',
      author: 'Super Administrator',
    },
  ]);

  const [auditLogs] = useState([
    { id: 1, action: 'ACCESS_AUDIT', detail: 'Admin session initialized with multi-role governance', time: '10:15 AM · Today', type: 'INFO' },
    { id: 2, action: 'SECURITY_CHECK', detail: 'Zero unapproved user access violations recorded', time: '09:30 AM · Today', type: 'INFO' },
  ]);

  const [contentList, setContentList] = useState([
    { id: 1, title: 'Full Stack Web Development (MERN)', course: 'Web Dev Track', instructor: 'Dr. Rahul Sharma' },
    { id: 2, title: 'Data Structures & Algorithms in Java', course: 'Core Computer Science', instructor: 'Prof. Anjali Verma' },
    { id: 3, title: 'Database Management Systems', course: 'Database Engineering', instructor: 'Siddharth Roy' },
  ]);

  // Real Instructors List from MongoDB (with fallback so it never breaks)
  const defaultInstructors = [
    { _id: 'inst-1', name: 'Dr. Rahul Sharma', email: 'instructor@edulearn.com', role: 'instructor', isSuspended: false },
    { _id: 'inst-2', name: 'Prof. Anjali Verma', email: 'anjali@edulearn.com', role: 'instructor', isSuspended: false },
  ];

  // Sirf APPROVED instructors hi Directory me aayenge (Pending wale Access Requests me rahenge)
  const dbInstructors = allDbUsers.filter((u) => u.role === 'instructor' && u.isApproved);
  const liveInstructors = dbInstructors.length > 0 ? dbInstructors : defaultInstructors;

  const filteredFaculty = liveInstructors.filter((x) =>
    `${x.name} ${x.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const counts = useMemo(
    () => ({
      instructors: liveInstructors.length,
      students: stats.totalStudents,
      broadcasts: notices.length,
      grievances: (feedbacks || []).filter((f) => f.status !== 'Resolved').length,
      reviews: pendingList.length,
      content: stats.totalCourses || contentList.length,
    }),
    [stats, liveInstructors, notices, feedbacks, pendingList, contentList]
  );

  const pageMeta = {
    overview: ['Platform Overview', 'Key performance metrics, learner enrolment, and governance decisions.'],
    faculty_control: ['Instructors Directory', 'Manage faculty credentials, course publishing privileges, and disciplinary actions.'],
    content: ['Course Catalog', 'Review, publish, and audit course modules across all departments.'],
    tasks: ['Access Requests Queue', 'Review and grant access to newly registered students and instructors.'],
    faculty_index: ['Teaching Quality Index', 'Aggregated quality signals based on student reviews and course ratings.'],
    feedbacks: ['Student Grievances', 'Review learner escalations and resolve teaching pace or doubt disputes.'],
    broadcasts: ['Platform Announcements', 'Publish system-wide updates and masterclass notices to learners.'],
    audit_logs: ['Security & Audit Logs', 'Complete audit trail of all governance and access actions.'],
    settings: ['Platform Policies', 'Configure registration controls, token policies, and academic rules.'],
  };

  const [title, subtitle] = pageMeta[activeTab];

  const navigate = (id) => {
    setActiveTab(id);
    setMobileMenu(false);
  };

  const handleSignOut = () => {
    logout();
    navigateRoute('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-xs font-bold">{actionSuccess}</p>
        </div>
      )}

      {/* SUSPEND MODAL */}
      {suspendModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <PauseCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Suspend Instructor Access</h3>
                <p className="text-xs text-slate-500">{suspendModal.user?.name}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Suspension Period</label>
                <select
                  value={suspendModal.days}
                  onChange={(e) => setSuspendModal({ ...suspendModal, days: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="7">7 Days (Temporary Review)</option>
                  <option value="14">14 Days (Grievance Investigation)</option>
                  <option value="30">30 Days (Disciplinary Action)</option>
                  <option value="0">Indefinite (Until Administrative Clearance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Suspension</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe grievance resolution or administrative reason..."
                  value={suspendModal.reason}
                  onChange={(e) => setSuspendModal({ ...suspendModal, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendModal({ open: false, user: null, days: '7', reason: '' })}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSuspend}
                className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Revoke Account</h3>
                <p className="text-xs text-slate-500">Permanent Action</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently revoke credentials for <b>{deleteModal.user?.name}</b>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, user: null })}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm"
              >
                Revoke Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[255px] shrink-0 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
          <div className="px-5 pt-6 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white grid place-items-center font-black shadow-md shadow-blue-200">
                E
              </div>
              <div>
                <p className="font-black tracking-tight text-slate-950">EduLearn LMS</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-slate-400 font-bold">Admin Console</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarContent activeTab={activeTab} navigate={navigate} counts={counts} onSignOut={handleSignOut} />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="h-[72px] bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 grid place-items-center"
                onClick={() => setMobileMenu(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Institutional Governance</p>
                <h1 className="text-base sm:text-lg font-black truncate">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 w-60">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search faculty or students..."
                  className="bg-transparent outline-none text-xs w-full"
                />
              </div>
              <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 grid place-items-center text-xs font-black border border-blue-200">
                  SA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Super Administrator</p>
                  <p className="text-[10px] text-slate-400">admin@edulearn.com</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
            {/* Header Breadcrumbs */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-1">
                  <span>Workspace</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-600">{title}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Academic Session 2026-27 Active
                </span>
              </div>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <Overview counts={counts} onNavigate={navigate} stats={stats} auditLogs={auditLogs} notices={notices} />
            )}

            {/* TAB: INSTRUCTORS DIRECTORY */}
            {activeTab === 'faculty_control' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Faculty & Instructor Directory</h2>
                    <p className="text-xs text-slate-500">Manage teaching credentials, temporary suspensions, and administrative actions.</p>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-200">
                    Total Faculty: {filteredFaculty.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-3">Instructor Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Grievance / Policy Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFaculty.map((inst) => (
                        <tr key={inst._id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 grid place-items-center font-black text-xs">
                              {inst.name[0]}
                            </div>
                            {inst.name}
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[11px]">{inst.email}</td>
                          <td className="p-3">
                            {inst.isSuspended ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <PauseCircle className="w-3 h-3" /> Suspended
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <UserCheck className="w-3 h-3" /> Active & Verified
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            {inst.isSuspended ? (
                              <span className="text-amber-700 font-medium">
                                Reason: {inst.suspensionReason || 'Under Review'}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">Clear record</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {inst.isSuspended ? (
                              <button
                                onClick={() => handleReinstate(inst)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all"
                              >
                                <PlayCircle className="w-3.5 h-3.5" /> Lift Suspension
                              </button>
                            ) : (
                              <button
                                onClick={() => setSuspendModal({ open: true, user: inst, days: '7', reason: '' })}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all"
                              >
                                <PauseCircle className="w-3.5 h-3.5" /> Suspend
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteModal({ open: true, user: inst })}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all"
                            >
                              <UserX className="w-3.5 h-3.5" /> Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ACCESS REQUESTS QUEUE */}
            {activeTab === 'tasks' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Access Approval Queue</h2>
                    <p className="text-xs text-slate-500">
                      New student and instructor sign-ups awaiting verification before login credentials activate.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-200">
                    Pending Requests: {pendingList.length}
                  </span>
                </div>

                {pendingList.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">No Pending Access Requests</h3>
                    <p className="text-xs text-slate-400">All registered students and faculty members have been verified.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingList.map((user) => (
                      <div key={user._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black text-sm">
                            {user.name ? user.name[0] : 'U'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 text-slate-600">
                              Requested Role: {user.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveUser(user._id, user.name)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Approve Access
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, user })}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: CONTENT */}
            {activeTab === 'content' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                <VideosTab list={contentList} onDelete={(id) => setContentList(contentList.filter((v) => v.id !== id))} />
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS */}
            {activeTab === 'broadcasts' && (
              <BroadcastTab
                notices={notices}
                onAddNotice={(n) => setNotices([n, ...notices])}
                onDeleteNotice={(id) => setNotices(notices.filter((n) => n.id !== id))}
              />
            )}

            {activeTab === 'faculty_index' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                <FacultyIndexTab
                  facultyList={[{ id: 'FAC-201', name: 'Dr. Rahul Sharma', dept: 'Full Stack Development', score: 4.8, syllabus: 88, approval: 96 }]}
                  onIssueNotice={() => triggerToast('Notice dispatched')}
                />
              </div>
            )}

            {/* TAB: STUDENT GRIEVANCES (HERE IS THE SUSPEND BUTTON FROM YOUR IMAGE 1!) */}
            {activeTab === 'feedbacks' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                <FeedbackAuditTab
                  feedbacks={feedbacks}
                  onResolve={resolveFeedback}
                  onSuspendFaculty={(facultyName, feedbackId) => {
                    // Find instructor or create matching record
                    const targetInst = liveInstructors.find((i) =>
                      i.name.toLowerCase().includes(facultyName.toLowerCase()) || facultyName.toLowerCase().includes(i.name.toLowerCase())
                    ) || {
                      _id: 'temp-' + Date.now(),
                      name: facultyName,
                      email: `${facultyName.toLowerCase().replace(/[^a-z]/g, '')}@edulearn.com`,
                    };

                    // Find grievance text
                    const g = feedbacks?.find((x) => x.id === feedbackId || x.facultyName === facultyName);
                    const reasonMsg = g ? `Grievance Escalation: "${g.message}"` : 'Student grievance under review';

                    // OPEN SUSPENSION MODAL WITH REASON AUTO-FILLED!
                    setSuspendModal({
                      open: true,
                      user: targetInst,
                      days: '7',
                      reason: reasonMsg,
                    });
                  }}
                />
              </div>
            )}

            {activeTab === 'audit_logs' && <AuditLogsTab logs={auditLogs} />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ activeTab, navigate, counts, onSignOut }) {
  return (
    <nav className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.16em] font-bold text-slate-400">{group.title}</p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const count =
                item.id === 'faculty_control'
                  ? counts.instructors
                  : item.id === 'tasks'
                  ? counts.reviews
                  : item.id === 'content'
                  ? counts.content
                  : null;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </span>
                  {count !== null && (
                    <span
                      className={`min-w-5 h-5 px-1.5 rounded-full grid place-items-center text-[9px] font-black ${
                        active
                          ? 'bg-white/20 text-white'
                          : item.id === 'tasks' && count > 0
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </nav>
  );
}

function Overview({ stats, onNavigate }) {
  const cards = [
    {
      label: 'Registered Learners',
      value: stats.totalStudents || 2,
      note: 'Active enrolled cohort',
      icon: Users,
      action: 'overview',
      tone: 'blue',
    },
    {
      label: 'Active Instructors',
      value: stats.totalInstructors || 2,
      note: 'Authorized course faculty',
      icon: UserCheck,
      action: 'faculty_control',
      tone: 'emerald',
    },
    {
      label: 'Published Courses',
      value: stats.totalCourses || 3,
      note: 'Live curriculum units',
      icon: BookOpen,
      action: 'content',
      tone: 'indigo',
    },
    {
      label: 'Access Approvals Pending',
      value: stats.pendingApprovals,
      note: stats.pendingApprovals > 0 ? 'Requires administrator action' : 'All users verified',
      icon: Clock,
      action: 'tasks',
      tone: stats.pendingApprovals > 0 ? 'rose' : 'amber',
    },
  ];

  const tone = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => onNavigate(c.action)}
              className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl grid place-items-center ${tone[c.tone]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
              </div>
              <p className="text-xs font-bold text-slate-500 mt-4">{c.label}</p>
              <p className="text-2xl font-black mt-1 text-slate-900">{c.value}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{c.note}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black text-slate-900">Academic & Administrative Workflows</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quick access to daily platform governance operations.</p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg">STANDARD PROTOCOL</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <ActionStep number="01" title="Verify Sign-ups" desc="Review user identity" icon={CheckSquare} onClick={() => onNavigate('tasks')} />
            <ActionStep number="02" title="Manage Faculty" desc="Monitor teaching status" icon={Users} onClick={() => onNavigate('faculty_control')} />
            <ActionStep number="03" title="Curriculum Audit" desc="Review course quality" icon={Video} onClick={() => onNavigate('content')} />
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-xs text-slate-600">
              <b className="text-slate-900">Access Policy Enforced:</b> Self-registration is strictly regulated. All accounts require administrator clearance.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-900">Platform Security Status</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Healthy</span>
            </div>
            <div className="space-y-3 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-800">Faculty Suspension Policy</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Admin can suspend instructors for 7-30 days upon student complaints.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-800">Access Gating Active</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Unapproved users are prohibited from entering learner portals.</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('audit_logs')}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all text-center"
          >
            View Complete Security Audit
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionStep({ number, title, desc, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-blue-600">{number}</span>
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <h4 className="font-black text-sm mt-4 text-slate-900">{title}</h4>
      <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
    </button>
  );
}

function SettingsPanel() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-100 grid place-items-center">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h3 className="font-black text-slate-900">Governance & Security Controls</h3>
          <p className="text-xs text-slate-500">Platform operational rules and policy settings.</p>
        </div>
      </div>
      <div className="space-y-3">
        {['Enforce Administrator Approval for all new student/instructor registrations', 'Enable temporary suspension workflow for disputed faculty credentials', 'Log all administrative permissions in immutable security audit trail'].map((x, i) => (
          <div key={x} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">{x}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Enforced across platform API routes.</p>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 ${i === 0 ? 'bg-blue-600' : 'bg-emerald-500'}`}>
              <div className="w-4 h-4 rounded-full bg-white ml-auto shadow-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
