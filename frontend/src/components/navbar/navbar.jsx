import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../services/authService';

const PUBLIC_ROUTES = ['/', '/login'];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('edulearn_role') && localStorage.getItem('edulearn_token')
      ? localStorage.getItem('edulearn_role')
      : null;
  });

  // Har route change aur storage change par sync karega
  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem('edulearn_role');
      const token = localStorage.getItem('edulearn_token');
      setUserRole(role && token ? role : null);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location.pathname]);

  if (!PUBLIC_ROUTES.includes(location.pathname)) return null;

  const isHome = location.pathname === '/';

  // Logout click karte hi session clean hoga aur usi page par turant 'Sign in' button dikhega
  const handleLogout = () => {
    logout();
    setUserRole(null);
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0b1020]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="brand-mark"><GraduationCap size={21} /></span>
          <span>
            <b className="text-slate-950 dark:text-white">EduLearn</b>
            <span className="text-blue-600 font-bold"> LMS</span>
            <small className="hidden sm:block text-[9px] text-slate-400 tracking-widest uppercase">Learning Management System</small>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {isHome ? (
            <>
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
              <a href="#workflow" className="hover:text-blue-600 transition-colors">How it works</a>
            </>
          ) : (
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <button onClick={toggleTheme} className="icon-btn" title="Toggle theme">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Agar user LOGIN hai to sirf Logout button dikhega */}
          {userRole ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all shadow-xs"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          ) : (
            /* Agar user LOGOUT hai to direct blue Sign in button dikhega */
            <Link
              to="/login"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              Sign in
            </Link>
          )}

          <button className="md:hidden icon-btn" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 p-4 space-y-2.5 bg-white dark:bg-[#0b1020]">
          {isHome ? (
            <>
              <a href="#features" onClick={() => setOpen(false)} className="mobile-link">Features</a>
              <a href="#courses" onClick={() => setOpen(false)} className="mobile-link">Courses</a>
            </>
          ) : (
            <Link to="/" onClick={() => setOpen(false)} className="mobile-link">Home</Link>
          )}
          {userRole ? (
            <button onClick={handleLogout} className="mobile-link text-rose-600 font-bold flex items-center gap-2 w-full text-left">
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="mobile-link text-blue-600 font-bold">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
