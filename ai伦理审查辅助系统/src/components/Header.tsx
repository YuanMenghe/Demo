import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:bg-white transition-all">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="搜索项目、文档或审查记录..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm text-slate-700 placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-px h-6 bg-slate-200"></div>
        <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200">
          <div className="w-8 h-8 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center font-medium">
            伦
          </div>
          <span className="text-sm font-medium text-slate-700">伦理委员</span>
        </button>
      </div>
    </header>
  );
}
