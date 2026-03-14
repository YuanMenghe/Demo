import React, { useState } from 'react';
import { Search, Pin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getMockDoctors } from '@/data/mock';
import type { Locale } from '@/data/mock';
import { cn } from '@/lib/utils';

interface SidebarProps {
  selectedDoctorId: string;
  onSelectDoctor: (id: string) => void;
}

function getLocaleFromLanguage(lang: string): Locale {
  return lang.startsWith('zh') ? 'zh' : 'en';
}

export function Sidebar({ selectedDoctorId, onSelectDoctor }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const locale = getLocaleFromLanguage(i18n.language);
  const doctors = getMockDoctors(locale);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 border-r border-slate-200 bg-white h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="text-xs font-medium text-slate-500 mb-1">{t('sidebar.therapyArea')}</div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800">PAH</span>
          <ChevronDownIcon className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="flex p-2 gap-1 border-b border-slate-100">
        <button type="button" className="flex-1 py-1.5 text-xs font-medium bg-medical-teal-50 text-medical-teal-700 rounded-md">
          {t('sidebar.scientificLeader')}
        </button>
        <button type="button" className="flex-1 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-md">
          {t('sidebar.deleteHistory')}
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('sidebar.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onSelectDoctor(doc.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectDoctor(doc.id)}
            className={cn(
              "px-4 py-3 cursor-pointer border-l-2 transition-all hover:bg-slate-50 group",
              selectedDoctorId === doc.id
                ? "bg-medical-teal-50/50 border-medical-teal-600"
                : "border-transparent"
            )}
          >
            <div className="flex items-start justify-between mb-1">
              <span className={cn(
                "text-sm font-medium",
                selectedDoctorId === doc.id ? "text-medical-teal-800" : "text-slate-700"
              )}>
                {doc.name}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pin className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                <Clock className="w-3 h-3 text-slate-400 hover:text-slate-600" />
              </div>
            </div>
            <div className="text-xs text-slate-500 truncate">{doc.title}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <button type="button" className="w-full py-2 bg-medical-teal-700 hover:bg-medical-teal-800 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm">
          <Search className="w-4 h-4" />
          {t('sidebar.searchAllSLs')}
        </button>
      </div>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
