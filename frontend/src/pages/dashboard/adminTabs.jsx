import React from 'react';
import { 
  Video, 
  Trash2, 
  UserX, 
  Check, 
  CheckCircle2, 
  Radio, 
  Star, 
  Send,
  Activity,
  UserCheck
} from 'lucide-react';

// Tab 1: Platform Broadcasts & Announcements
export function BroadcastTab({ notices, onAddNotice, onDeleteNotice }) {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Live Masterclass Alert');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    onAddNotice({
      id: Date.now(),
      title,
      category,
      message,
      date: '25 Aug 2026',
      author: 'EduLearn Platform Team'
    });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-600" />
          <span>Publish Platform Announcement</span>
        </h2>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Announcement Headline</label>
          <input
            type="text"
            required
            placeholder="e.g., Live Masterclass on Next.js 15 this Sunday"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Broadcast Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
          >
            <option>Live Masterclass Alert</option>
            <option>New Curriculum Module Release</option>
            <option>Hackathon & Project Deadline</option>
            <option>Server & Streaming Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Broadcast Details</label>
          <textarea
            rows={3}
            required
            placeholder="Type platform announcement details for enrolled learners..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast to All Enrolled Learners</span>
        </button>
      </form>

      <div className="lg:col-span-2 space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Active Platform Announcements ({notices.length})</h2>
        {notices.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No active broadcasts published.</p>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-start gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    n.category.includes('Masterclass') ? 'bg-blue-50 text-blue-700' :
                    n.category.includes('Deadline') ? 'bg-amber-50 text-amber-700' :
                    n.category.includes('Maintenance') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {n.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {n.message}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Published by: {n.author}</p>
              </div>

              <button
                onClick={() => onDeleteNotice(n.id)}
                className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Tab 2: Faculty Control & Removal
export function FacultyControlTab({ instructorList, onRemoveInstructor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Authorized Faculty Directory & Removal Control</h2>
          <p className="text-xs text-slate-500">Manage active instructors, course assignments, and revoke publishing permissions.</p>
        </div>
        <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
          Total Faculty: {instructorList.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
            <tr>
              <th className="p-3">Faculty ID</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Department Domain</th>
              <th className="p-3 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instructorList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400 font-semibold">
                  No active instructors registered in the system.
                </td>
              </tr>
            ) : (
              instructorList.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-600">{inst.id}</td>
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    {inst.name}
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{inst.email}</td>
                  <td className="p-3 text-slate-600 font-medium">{inst.department}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onRemoveInstructor(inst.id, inst.name)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all shadow-xs"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Revoke & Remove</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Tab 3: Faculty KPI Index
export function FacultyIndexTab({ facultyList, onIssueNotice }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-sm font-bold text-slate-900">Faculty Performance Index & Quality Audit</h2>
        <p className="text-xs text-slate-500">Live aggregated metrics calculated from learner ratings, feedback & lecture delivery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {facultyList.map((f) => {
          const isWarning = f.score < 3.5;
          return (
            <div key={f.id} className={`bg-white border rounded-2xl p-4 shadow-xs space-y-3 ${isWarning ? 'border-amber-300' : 'border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{f.name}</h3>
                  <p className="text-[11px] text-slate-500">{f.dept}</p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                  isWarning ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <Star className="w-3 h-3 fill-current" />
                  <span>{f.score} / 5.0</span>
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Syllabus Covered</span>
                  <span className="font-bold text-slate-900">{f.syllabus}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Learner Approval</span>
                  <span className="font-bold text-slate-900">{f.approval}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => onIssueNotice(f.name)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 rounded-xl text-xs transition-colors"
                >
                  Issue Quality Note
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Tab 4: System Audit Logs
export function AuditLogsTab({ logs }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Activity className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">System Security & Master Audit Trail</h2>
      </div>

      <div className="space-y-2.5">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                log.type === 'WARN' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {log.action}
              </span>
              <p className="text-slate-800 font-medium mt-1">{log.detail}</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-4">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tab 5: Grievance Audit
export function FeedbackAuditTab({ feedbacks, onResolve, onSuspendFaculty }) {
  const activeFeedbacks = (feedbacks || []).filter((f) => f.status !== 'Resolved');

  if (activeFeedbacks.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-semibold">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        No active grievances reported by students.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activeFeedbacks.map((f) => (
        <div key={f.id} className={`bg-white border rounded-2xl p-4 shadow-xs space-y-3 ${
          f.rating <= 2 ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              f.rating <= 2 ? 'bg-rose-100 text-rose-700' : 'bg-blue-50 text-blue-700'
            }`}>
              ★ {f.rating}/5 • {f.feedbackType}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{f.date}</span>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              Instructor: <span className="text-rose-600 underline">{f.facultyName}</span>
            </p>
            <p className="text-[11px] text-slate-500">{f.courseName}</p>
          </div>

          <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 italic">
            "{f.message}"
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => onResolve(f.id)}
              className="w-1/2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1.5 rounded-xl text-xs font-bold"
            >
              ✓ Resolve
            </button>
            <button
              onClick={() => onSuspendFaculty(f.facultyName, f.id)}
              className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
            >
              <UserX className="w-3.5 h-3.5" /> Suspend
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Tab 6: Content & Tasks
export function VideosTab({ list, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
          <tr>
            <th className="p-3">Lecture</th>
            <th className="p-3">Course</th>
            <th className="p-3">Instructor</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50">
              <td className="p-3 font-bold text-slate-900 flex items-center gap-2"><Video className="w-4 h-4 text-blue-600 shrink-0" />{v.title}</td>
              <td className="p-3 text-slate-600">{v.course}</td>
              <td className="p-3 font-bold text-slate-800">{v.instructor}</td>
              <td className="p-3 text-right">
                <button onClick={() => onDelete(v.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PendingTasksTab({ tasks, onApprove }) {
  if (!tasks || tasks.length === 0) return <p className="text-xs text-slate-400 py-8 text-center font-semibold">All pending tasks graded!</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
          <tr>
            <th className="p-3">Student</th>
            <th className="p-3">Course</th>
            <th className="p-3">Task</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50">
              <td className="p-3 font-bold text-slate-900">{t.student}</td>
              <td className="p-3 text-slate-600">{t.course}</td>
              <td className="p-3 font-bold text-blue-600">{t.task}</td>
              <td className="p-3 text-right">
                <button onClick={() => onApprove(t.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 shadow-xs">
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

