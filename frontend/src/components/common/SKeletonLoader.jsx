import React from 'react';

export function CourseCardSkeleton() {
  return (
    <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4 animate-pulse">
      <div className="h-20 bg-slate-800/60 rounded-2xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/80 rounded-md w-3/4"></div>
        <div className="h-3 bg-slate-800/50 rounded-md w-1/2"></div>
      </div>
      <div className="h-8 bg-slate-800/40 rounded-xl w-full"></div>
    </div>
  );
}

