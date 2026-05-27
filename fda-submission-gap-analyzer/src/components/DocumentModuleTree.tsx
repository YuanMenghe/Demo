import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/lib/i18n';
import {
  groupDocumentsByModule,
  MODULE_LABELS,
  MODULE_ORDER,
  type ProjectDocument,
} from '@/lib/projectDocuments';

type Mode = 'view' | 'select';

type Props = {
  documents: ProjectDocument[];
  mode?: Mode;
  selectedIds?: string[];
  onToggle?: (id: string) => void;
};

export default function DocumentModuleTree({
  documents,
  mode = 'view',
  selectedIds = [],
  onToggle,
}: Props) {
  const { t, language } = useLanguage();
  const grouped = groupDocumentsByModule(documents);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => new Set(MODULE_ORDER));
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => new Set());

  const toggleModule = (m: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {MODULE_ORDER.map((moduleId) => {
        const folders = grouped.get(moduleId)!;
        const folderEntries = [...folders.entries()].sort(([a], [b]) => a.localeCompare(b));
        const fileCount = folderEntries.reduce((n, [, files]) => n + files.length, 0);
        if (fileCount === 0) return null;

        const moduleOpen = expandedModules.has(moduleId);
        const label = language === 'zh' ? MODULE_LABELS[moduleId].zh : MODULE_LABELS[moduleId].en;

        return (
          <div key={moduleId} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left border-b border-slate-100"
              onClick={() => toggleModule(moduleId)}
            >
              {moduleOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <Folder className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-900 text-sm flex-1">{label}</span>
              <span className="text-xs text-slate-500">
                {fileCount} {t('个文件', 'files')}
              </span>
            </button>

            {moduleOpen && (
              <div className="divide-y divide-slate-50">
                {folderEntries.map(([folderName, files]) => {
                  const folderKey = `${moduleId}/${folderName}`;
                  const folderOpen = expandedFolders.has(folderKey);

                  return (
                    <div key={folderKey}>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 pl-8 pr-4 py-2.5 hover:bg-slate-50 text-left"
                        onClick={() => toggleFolder(folderKey)}
                      >
                        {folderOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 flex-1">{folderName}</span>
                        <span className="text-xs text-slate-400">{files.length}</span>
                      </button>
                      {folderOpen && (
                        <ul className="pb-2">
                          {files.map((doc) => (
                            <li
                              key={doc.id}
                              className={`flex items-center gap-3 pl-14 pr-4 py-2 text-sm hover:bg-slate-50 ${
                                mode === 'select' ? '' : ''
                              }`}
                            >
                              {mode === 'select' && onToggle && (
                                <Checkbox
                                  id={`doc-${doc.id}`}
                                  checked={selectedIds.includes(doc.id)}
                                  onCheckedChange={() => onToggle(doc.id)}
                                />
                              )}
                              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                              <label
                                htmlFor={mode === 'select' ? `doc-${doc.id}` : undefined}
                                className="flex-1 min-w-0 cursor-pointer"
                              >
                                <span className="font-medium text-slate-800 truncate block">{doc.name}</span>
                                {mode === 'view' && (
                                  <span className="text-xs text-slate-400">{doc.time}</span>
                                )}
                              </label>
                              {mode === 'view' && (
                                <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">{doc.time}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
