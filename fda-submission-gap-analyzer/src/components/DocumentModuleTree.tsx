import { ChevronDown, ChevronRight, FileText, Folder, Layers } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  onToggleLatestModule?: (moduleId: ProjectDocument['module']) => void;
  onToggleLatestFolder?: (folderKey: string) => void;
};

function groupByDocKey(files: ProjectDocument[]) {
  const map = new Map<string, ProjectDocument[]>();
  for (const f of files) {
    const list = map.get(f.docKey) ?? [];
    list.push(f);
    map.set(f.docKey, list);
  }
  // Sort each version list (newest first)
  for (const [k, list] of map.entries()) {
    list.sort((a, b) => {
      if (b.versionSortKey !== a.versionSortKey) return b.versionSortKey - a.versionSortKey;
      return b.time.localeCompare(a.time);
    });
    map.set(k, list);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function DocumentModuleTree({
  documents,
  mode = 'view',
  selectedIds = [],
  onToggle,
  onToggleLatestModule,
  onToggleLatestFolder,
}: Props) {
  const { t, language } = useLanguage();
  const grouped = groupDocumentsByModule(documents);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => new Set(MODULE_ORDER));
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => new Set());
  const [expandedDocKeys, setExpandedDocKeys] = useState<Set<string>>(() => new Set());
  const selectedSet = new Set(selectedIds);

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

  const toggleDocKey = (key: string) => {
    setExpandedDocKeys((prev) => {
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
    <div className={mode === 'view' ? 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3' : 'space-y-2'}>
      {MODULE_ORDER.map((moduleId) => {
        const folders = grouped.get(moduleId)!;
        const folderEntries = [...folders.entries()].sort(([a], [b]) => a.localeCompare(b));
        const fileCount = folderEntries.reduce((n, [, files]) => n + files.length, 0);
        if (fileCount === 0) return null;

        const moduleOpen = expandedModules.has(moduleId);
        const label = language === 'zh' ? MODULE_LABELS[moduleId].zh : MODULE_LABELS[moduleId].en;
        const moduleAllIds = folderEntries.flatMap(([, files]) => files.map((f) => f.id));
        const moduleLatestIds = folderEntries
          .flatMap(([, files]) => groupByDocKey(files).map(([, versions]) => versions[0]!.id));
        const moduleSelectedCount = moduleAllIds.filter((id) => selectedSet.has(id)).length;
        const moduleLatestCount = moduleLatestIds.length;
        const moduleCheckboxState: boolean | 'indeterminate' =
          moduleLatestCount === 0
            ? false
            : moduleLatestIds.every((id) => selectedSet.has(id))
              ? true
              : moduleLatestIds.some((id) => selectedSet.has(id))
                ? 'indeterminate'
                : false;

        const expandAllInModule = () => {
          setExpandedModules((prev) => new Set(prev).add(moduleId));
          setExpandedFolders((prev) => {
            const next = new Set(prev);
            for (const [folderName] of folderEntries) next.add(`${moduleId}/${folderName}`);
            return next;
          });
          setExpandedDocKeys((prev) => {
            const next = new Set(prev);
            for (const [, files] of folderEntries) {
              for (const [, versions] of groupByDocKey(files)) {
                if (versions.length > 1) next.add(versions[0]!.docKey);
              }
            }
            return next;
          });
        };

        const collapseAllInModule = () => {
          setExpandedFolders((prev) => {
            const next = new Set(prev);
            for (const [folderName] of folderEntries) next.delete(`${moduleId}/${folderName}`);
            return next;
          });
          setExpandedDocKeys((prev) => {
            const next = new Set(prev);
            for (const [, files] of folderEntries) {
              for (const [, versions] of groupByDocKey(files)) {
                next.delete(versions[0]!.docKey);
              }
            }
            return next;
          });
        };

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
              {mode === 'select' && onToggleLatestModule && (
                <span
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLatestModule(moduleId);
                  }}
                >
                  <Checkbox checked={moduleCheckboxState} aria-label={t('选择该模块最新版本', 'Select latest in module')} />
                </span>
              )}
              <Folder className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-900 text-sm flex-1">{label}</span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {t('已选', 'Selected')} {moduleSelectedCount} / {t('最新', 'Latest')} {moduleLatestCount} / {t('总计', 'Total')} {fileCount}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    expandAllInModule();
                  }}
                >
                  {t('展开全部', 'Expand all')}
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    collapseAllInModule();
                  }}
                >
                  {t('收起全部', 'Collapse all')}
                </button>
              </div>
              <span className="text-xs text-slate-500 sm:hidden">
                {moduleSelectedCount}/{moduleLatestCount}/{fileCount}
              </span>
            </button>

            {moduleOpen && (
              <div className={mode === 'view' ? 'p-2' : 'divide-y divide-slate-50'}>
                {folderEntries.map(([folderName, files]) => {
                  const folderKey = `${moduleId}/${folderName}`;
                  const folderOpen = expandedFolders.has(folderKey);
                  const docKeyGroups = groupByDocKey(files);
                  const folderAllIds = files.map((f) => f.id);
                  const folderLatestIds = docKeyGroups.map(([, versions]) => versions[0]!.id);
                  const folderSelectedCount = folderAllIds.filter((id) => selectedSet.has(id)).length;
                  const folderLatestCount = folderLatestIds.length;
                  const folderCheckboxState: boolean | 'indeterminate' =
                    folderLatestCount === 0
                      ? false
                      : folderLatestIds.every((id) => selectedSet.has(id))
                        ? true
                        : folderLatestIds.some((id) => selectedSet.has(id))
                          ? 'indeterminate'
                          : false;

                  return (
                    <div key={folderKey} className={mode === 'view' ? 'rounded-lg border border-slate-200 bg-white overflow-hidden' : ''}>
                      <button
                        type="button"
                        className={mode === 'view'
                          ? 'w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left'
                          : 'w-full flex items-center gap-2 pl-8 pr-4 py-2.5 hover:bg-slate-50 text-left'}
                        onClick={() => toggleFolder(folderKey)}
                      >
                        {folderOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        {mode === 'select' && onToggleLatestFolder && (
                          <span
                            className="shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLatestFolder(folderKey);
                            }}
                          >
                            <Checkbox checked={folderCheckboxState} aria-label={t('选择该文件夹最新版本', 'Select latest in folder')} />
                          </span>
                        )}
                        <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 flex-1 min-w-0">
                          <span className="block truncate">{folderName}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          {t('已选', 'Selected')} {folderSelectedCount} / {t('最新', 'Latest')} {folderLatestCount} / {t('总计', 'Total')} {files.length}
                        </span>
                        <span className="text-xs text-slate-400 sm:hidden">{folderSelectedCount}/{folderLatestCount}/{files.length}</span>
                      </button>
                      {folderOpen && (
                        <div className="pb-3">
                          <div
                            className={
                              mode === 'view'
                                ? 'space-y-1 px-3 pb-2'
                                : 'flex flex-col'
                            }
                          >
                            {docKeyGroups.map(([docKey, versions]) => {
                              const latest = versions[0]!;
                              const hasHistory = versions.length > 1;
                              const docKeyOpen = expandedDocKeys.has(docKey);

                              const row = (
                                <div
                                  key={docKey}
                                  className={
                                    mode === 'view'
                                      ? 'flex items-center gap-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors px-2.5 py-2'
                                      : 'flex items-center gap-3 pl-14 pr-4 py-2 text-sm hover:bg-slate-50'
                                  }
                                >
                                  {mode === 'select' && onToggle && (
                                    <Checkbox
                                      id={`doc-${latest.id}`}
                                      checked={selectedIds.includes(latest.id)}
                                      onCheckedChange={() => onToggle(latest.id)}
                                    />
                                  )}
                                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                  <label
                                    htmlFor={mode === 'select' ? `doc-${latest.id}` : undefined}
                                    className="flex-1 min-w-0 cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="font-medium text-slate-800 truncate">{latest.docKey}</span>
                                      <Badge variant="secondary" className="shrink-0">
                                        {latest.version}
                                      </Badge>
                                    </div>
                                  </label>
                                  {mode === 'view' && (
                                    <span className="text-xs text-slate-400 shrink-0 tabular-nums">{latest.time.split(' ')[0]}</span>
                                  )}

                                  {hasHistory && (
                                    <button
                                      type="button"
                                      className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDocKey(docKey);
                                      }}
                                    >
                                      <Layers className="w-3.5 h-3.5" />
                                      {versions.length}
                                      {docKeyOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                    </button>
                                  )}
                                </div>
                              );

                              return (
                                <div key={docKey} className={mode === 'view' ? '' : ''}>
                                  {row}
                                  {hasHistory && docKeyOpen && (
                                    <div className={mode === 'view' ? 'mt-1' : ''}>
                                      <div className={mode === 'view' ? 'rounded-md border border-slate-100 bg-slate-50 p-2' : 'pl-14 pr-4 pb-2'}>
                                        <div className={mode === 'view' ? 'space-y-1' : 'space-y-1'}>
                                          {versions.slice(1).map((v) => (
                                            <div
                                              key={v.id}
                                              className={
                                                mode === 'view'
                                                  ? 'flex items-center gap-2 px-2 py-1 rounded hover:bg-white'
                                                  : 'flex items-center gap-3 py-1.5 text-sm hover:bg-slate-50'
                                              }
                                            >
                                              {mode === 'select' && onToggle && (
                                                <Checkbox
                                                  id={`doc-${v.id}`}
                                                  checked={selectedIds.includes(v.id)}
                                                  onCheckedChange={() => onToggle(v.id)}
                                                />
                                              )}
                                              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                              <label
                                                htmlFor={mode === 'select' ? `doc-${v.id}` : undefined}
                                                className="flex-1 min-w-0 cursor-pointer"
                                              >
                                                <div className="flex items-center gap-2 min-w-0">
                                                  <span className="text-slate-700 truncate">{v.docKey}</span>
                                                  <Badge variant="outline" className="shrink-0">
                                                    {v.version}
                                                  </Badge>
                                                </div>
                                              </label>
                                              {mode === 'view' && (
                                                <span className="text-xs text-slate-400 shrink-0 tabular-nums">{v.time.split(' ')[0]}</span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
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
