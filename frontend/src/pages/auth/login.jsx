import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserRound, UsersRound, LockKeyhole, ArrowRight, CheckCircle2, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login, register } from '../../services/authService';

export default function Login() {
  const nav = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Strict Email Regex (Must have @ and dot with extension like .com, .in, .org)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // 🔒 1. Frontend Strict Email Validation
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address with domain extension (e.g. name@gmail.com)');
      return;
    }

    // 🔒 2. Password Length Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // NAYA USER REGISTER
        const res = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: registerRole,
        });

        // 🚀 Student hai toh INSTANT LOGIN (PW / Udemy style)
        if (registerRole === 'student') {
          setSuccessMsg('Account created successfully! Redirecting to Student Dashboard...');
          setTimeout(() => {
            localStorage.setItem('edulearn_role', 'student');
            nav('/student-dashboard');
          }, 1200);
        } else {
          // Instructor hai toh Admin approval message
          setSuccessMsg(res.message || 'Faculty application submitted for administrator verification.');
          setName('');
          setEmail('');
          setPassword('');
          setTimeout(() => setIsRegister(false), 2500);
        }
      } else {
        // DIRECT LOGIN (Email & Password se automatic role identify hoga)
        const data = await login(email.trim().toLowerCase(), password);
        const userRole = data.role || 'student';
        localStorage.setItem('edulearn_role', userRole);

        if (userRole === 'admin') {
          nav('/admin-dashboard');
        } else if (userRole === 'instructor') {
          nav('/instructor-dashboard');
        } else {
          nav('/student-dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#070b14] px-4 py-10 flex items-center">
      <div className="max-w-5xl w-full mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Hero */}
        <section className="hidden lg:block">
          <span className="badge-blue">SECURE LMS PORTAL</span>
          <h1 className="text-5xl font-black tracking-tight mt-4 text-slate-950 dark:text-white">
            One platform.<br />
            <span className="text-blue-600">Three workspaces.</span>
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400 max-w-lg">
            EduLearn connects learners, instructors and administrators through a secure role-based learning workflow.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              'Enterprise Grade Access Control',
              'Instant student onboarding and course access',
              'Verified instructor curriculum and grading',
            ].map((x) => (
              <div key={x} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="text-emerald-500" size={18} />
                {x}
              </div>
            ))}
          </div>
        </section>

        {/* Right Auth Card */}
        <section className="bg-white dark:bg-[#0d1422] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center">
            <div className="brand-mark mx-auto">
              <GraduationCap size={23} />
            </div>
            <h2 className="text-2xl font-black mt-4 text-slate-950 dark:text-white">
              {isRegister ? 'Create Your Account' : 'Sign in to EduLearn'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRegister
                ? 'Join thousands of learners and instructors today'
                : 'Enter your credentials to access your workspace'}
            </p>
          </div>

          {/* Role selector sirf registration ke waqt dikhega */}
          {isRegister && (
            <div className="mt-5 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">I am joining as:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('student')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    registerRole === 'student'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <UserRound size={13} /> Student (Instant Access)
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('instructor')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    registerRole === 'instructor'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <UsersRound size={13} /> Instructor (Faculty)
                </button>
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-4 mt-6">
            {isRegister && (
              <label className="block">
                <span className="label">Full Name</span>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pr-10"
                  />
                  <User size={16} className="absolute right-3 top-3.5 text-slate-400" />
                </div>
              </label>
            )}

            <label className="block">
              <span className="label">Email Address</span>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pr-10"
                />
                <Mail size={16} className="absolute right-3 top-3.5 text-slate-400" />
              </div>
            </label>

            <label className="block">
              <span className="label">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2">
              {loading
                ? 'Processing...'
                : isRegister
                ? registerRole === 'student'
                  ? 'Create Student Account'
                  : 'Submit Faculty Application'
                : 'Sign In to Workspace'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccessMsg('');
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

