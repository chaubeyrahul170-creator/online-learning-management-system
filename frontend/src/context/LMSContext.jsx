import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LMSContext = createContext(null);

const seed = {
  courses: [
    { id: 1, title: 'Full Stack Web Development (MERN)', category: 'Web Development', instructor: 'Dr. Rahul Sharma', totalLessons: 24, progress: 68, students: 128, hours: '42 hrs', level: 'Intermediate', accentColor: 'from-blue-600 to-indigo-700', icon: '⚡', description: 'React, Node.js, Express, MongoDB, REST APIs and authentication.' },
    { id: 2, title: 'Data Structures & Algorithms in Java', category: 'Computer Science', instructor: 'Prof. Anjali Verma', totalLessons: 32, progress: 42, students: 164, hours: '56 hrs', level: 'Advanced', accentColor: 'from-violet-600 to-fuchsia-700', icon: '⌘', description: 'Problem solving, trees, graphs, sorting, searching and complexity.' },
    { id: 3, title: 'Database Management Systems', category: 'Database', instructor: 'Siddharth Roy', totalLessons: 18, progress: 100, students: 96, hours: '30 hrs', level: 'Intermediate', accentColor: 'from-emerald-600 to-teal-700', icon: '◈', description: 'SQL, MongoDB, indexing, normalization and aggregation pipelines.' },
  ],
  instructors: [
    { id: 'FAC-201', name: 'Dr. Rahul Sharma', email: 'rahul.cs@institute.edu', department: 'Full Stack Development', status: 'Active', courses: 2 },
    { id: 'FAC-202', name: 'Prof. Anjali Verma', email: 'anjali.cs@institute.edu', department: 'Algorithms & Data Structures', status: 'Active', courses: 1 },
    { id: 'FAC-203', name: 'Siddharth Roy', email: 'siddharth.db@institute.edu', department: 'Database Engineering', status: 'Active', courses: 1 },
  ],
  assignments: [
    { id: 1, title: 'Lab 4: REST API with JWT Middleware', course: 'Full Stack Web Development (MERN)', deadline: '28 Aug 2026', marks: 50, submissions: 84, status: 'Open' },
    { id: 2, title: 'Practical 3: Binary Search Tree', course: 'Data Structures & Algorithms in Java', deadline: '30 Aug 2026', marks: 30, submissions: 71, status: 'Open' },
    { id: 3, title: 'Assignment 2: MongoDB Aggregations', course: 'Database Management Systems', deadline: '02 Sep 2026', marks: 40, submissions: 96, status: 'Closed' },
  ],
  lectures: [
    { id: 1, title: 'Introduction to Node.js & Express', courseId: 1, duration: '45 min', status: 'Published' },
    { id: 2, title: 'REST APIs & Routing Handlers', courseId: 1, duration: '38 min', status: 'Published' },
    { id: 3, title: 'MongoDB Schema Design & Mongoose', courseId: 1, duration: '51 min', status: 'Published' },
    { id: 4, title: 'JWT Authentication & Protected Routes', courseId: 1, duration: '46 min', status: 'Published' },
    { id: 5, title: 'React Context API & State Management', courseId: 1, duration: '35 min', status: 'Published' },
  ],
  feedbacks: [
    { id: 1, studentName: 'Anonymous Student', studentId: 'STU-HIDDEN', facultyName: 'Dr. Rahul Sharma', courseName: 'Full Stack Web Development (MERN)', feedbackType: 'Lecture Pace', rating: 2, message: 'React hooks ka pace thoda fast hai. More examples would help.', date: '25 Aug 2026', status: 'Pending', severity: 'High' },
  ],
  notices: [
    { id: 1, title: 'Live Masterclass: Production Deployment', category: 'Announcement', message: 'Docker, AWS and CI/CD masterclass this Sunday at 7 PM.', date: '25 Aug 2026', author: 'EduLearn Platform Team' },
    { id: 2, title: 'Assessment Window Updated', category: 'Academic Notice', message: 'Unit tests for all semester courses remain open until 30 Aug.', date: '24 Aug 2026', author: 'Academic Office' },
  ],
};

const clone = () => JSON.parse(JSON.stringify(seed));

export function LMSProvider({ children }) {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edulearn_lms_data')) || clone(); } catch { return clone(); }
  });
  const [toast, setToast] = useState(null);

  useEffect(() => localStorage.setItem('edulearn_lms_data', JSON.stringify(data)), [data]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const resetDemo = () => { setData(clone()); showToast('Demo data restored'); };
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const addLecture = lecture => { update('lectures', [{ id: Date.now(), status: 'Published', ...lecture }, ...data.lectures]); showToast('Lecture published successfully'); };
  const removeLecture = id => { update('lectures', data.lectures.filter(x => x.id !== id)); showToast('Lecture removed', 'info'); };
  const addAssignment = assignment => { update('assignments', [{ id: Date.now(), submissions: 0, status: 'Open', ...assignment }, ...data.assignments]); showToast('Assignment published successfully'); };
  const submitAssignment = id => { update('assignments', data.assignments.map(x => x.id === id ? { ...x, submissions: x.submissions + 1 } : x)); showToast('Assignment submitted successfully'); };
  const submitFeedback = feedback => { update('feedbacks', [{ id: Date.now(), date: '25 Aug 2026', status: 'Pending', ...feedback }, ...data.feedbacks]); showToast('Confidential feedback sent to admin'); };
  const resolveFeedback = id => { update('feedbacks', data.feedbacks.map(x => x.id === id ? { ...x, status: 'Resolved' } : x)); showToast('Grievance marked resolved'); };
  const deleteFeedback = id => update('feedbacks', data.feedbacks.filter(x => x.id !== id));
  const addNotice = notice => { update('notices', [{ id: Date.now(), date: '25 Aug 2026', author: 'Admin', ...notice }, ...data.notices]); showToast('Announcement published'); };
  const removeNotice = id => update('notices', data.notices.filter(x => x.id !== id));
  const removeInstructor = id => { update('instructors', data.instructors.filter(x => x.id !== id)); showToast('Instructor access revoked', 'warning'); };

  const value = useMemo(() => ({ ...data, setCourses: v => update('courses', v), setInstructors: v => update('instructors', v), setTasks: () => {}, showToast, resetDemo, addLecture, removeLecture, addAssignment, submitAssignment, submitFeedback, resolveFeedback, deleteFeedback, addNotice, removeNotice, removeInstructor, toast }), [data, toast]);
  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
}

export const useLMS = () => useContext(LMSContext);
