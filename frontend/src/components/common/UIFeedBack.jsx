import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

// 1. Toast Notification Component
export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-900/95 border-emerald-500/50 text-emerald-100',
    error: 'bg-rose-900/95 border-rose-500/50 text-rose-100',
    info: 'bg-blue-900/95 border-blue-500/50 text-blue-100',
    warning: 'bg-amber-900/95 border-amber-500/50 text-amber-100'
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgStyles[type]}`}>
        {icons[type]}
        <p className="text-xs font-semibold tracking-wide pr-2">{message}</p>
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// 2. Action Confirmation Modal
export function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', confirmStyle = 'danger', onConfirm, onCancel }) {
  if (!isOpen) return null;

  const btnStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-slate-800 dark:text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl text-amber-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer ${btnStyles[confirmStyle] || btnStyles.danger}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
