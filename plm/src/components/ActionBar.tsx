import React from 'react';
import { 
  Share2, 
  Presentation, 
  Microscope, 
  FileEdit,
  Settings
} from 'lucide-react';

export function ActionBar({ onSettingsClick }: { onSettingsClick: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <ActionButton icon={<Share2 className="w-4 h-4" />} label="MDT 查房" />
      <ActionButton icon={<Presentation className="w-4 h-4" />} label="生成 PPT" />
      <ActionButton icon={<Microscope className="w-4 h-4" />} label="匹配研究" />
      <div className="w-px h-6 bg-slate-300 mx-1" />
      <button 
        onClick={onSettingsClick}
        className="p-2 bg-white text-slate-600 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-all hover:rotate-90 duration-300"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-white text-slate-700 text-xs font-medium rounded-full shadow-md border border-slate-200 hover:bg-slate-50 hover:text-teal-600 transition-all">
      {icon}
      <span>{label}</span>
    </button>
  );
}
