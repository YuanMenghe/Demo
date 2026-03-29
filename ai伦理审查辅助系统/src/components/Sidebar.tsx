import React from 'react';
import { FolderKanban, Library, ListChecks, Activity } from 'lucide-react';

export default function Sidebar({ currentView, navigateTo }: { currentView: string, navigateTo: (view: string) => void }) {
  const navItems = [
    { id: 'projects', label: '项目管理', icon: FolderKanban },
    { id: 'policies', label: '政策法规库', icon: Library },
    { id: 'checklists', label: '审核要点清单', icon: ListChecks },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={`${import.meta.env.BASE_URL}noah-logo.png`}
            alt="Noah AI"
            className="h-9 w-auto shrink-0 object-contain"
          />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-bold text-lg text-slate-900 tracking-tight">Noah AI</span>
            <span className="text-xs text-slate-500 truncate">AI伦理审查辅助系统</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (currentView === 'project-detail' && item.id === 'projects');
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Activity size={16} className="text-[var(--color-primary)]" />
            系统状态
          </div>
          <div className="text-xs text-slate-500">AI审查引擎运行中</div>
          <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)] w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
