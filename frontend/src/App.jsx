import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LMSProvider, useLMS } from './context/LMSContext';
import Navbar from './components/navbar/navbar';
import Home from './pages/home/home';
import Login from './pages/auth/login';
import StudentDashboard from './pages/dashboard/studentdashboard';
import InstructorDashboard from './pages/dashboard/instructorDashboard';
import AdminDashboard from './pages/dashboard/admindashboard';
import CoursePlayer from './pages/course/coursePlayer';
import QuizPortal from './pages/assessment/quizPortal';
import AssignmentPortal from './pages/assessment/assignmentPortal';
import CertificateModal from './pages/certificate/certificateModal';

function Toast(){ const { toast } = useLMS(); if(!toast) return null; return <div className={`fixed bottom-5 right-5 z-[100] px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white ${toast.type==='warning'?'bg-amber-600':toast.type==='info'?'bg-slate-800':'bg-emerald-600'}`}>{toast.message}</div>; }
export default function App(){ return <ThemeProvider><LMSProvider><BrowserRouter><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/student-dashboard" element={<StudentDashboard/>}/><Route path="/instructor-dashboard" element={<InstructorDashboard/>}/><Route path="/admin-dashboard" element={<AdminDashboard/>}/><Route path="/course/:id" element={<CoursePlayer/>}/><Route path="/quiz/:id" element={<QuizPortal/>}/><Route path="/assignments" element={<AssignmentPortal/>}/><Route path="/certificate" element={<CertificateModal/>}/><Route path="*" element={<Home/>}/></Routes><Toast/></BrowserRouter></LMSProvider></ThemeProvider>; }
