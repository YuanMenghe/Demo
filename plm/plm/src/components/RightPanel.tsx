import React from 'react';
import { X, FileText, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Citation, GuidelineLocation } from '@/types';

interface RightPanelProps {
  logic: { response: { citations?: Citation[] } };
  selectedCitation: Citation | null;
  onClose: () => void;
  onSelectCitation?: (citation: Citation) => void;
  highlightedCitationId?: string | null;
}

export function RightPanel({ logic, selectedCitation, onClose, highlightedCitationId, onSelectCitation }: RightPanelProps) {
  const { response } = logic;
  const citations = response.citations ?? [];

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          {selectedCitation ? (
            <>
              <div className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold",
                selectedCitation.sourceType === 'guideline' ? "bg-teal-600" :
                selectedCitation.sourceType === 'pubmed' ? "bg-blue-600" : "bg-purple-600"
              )}>
                {selectedCitation.index}
              </div>
              <span className="text-sm">证据详情</span>
            </>
          ) : (
            <span className="text-sm">参考文献 ({citations.length})</span>
          )}
        </div>
        {selectedCitation && (
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {selectedCitation ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2">{selectedCitation.title}</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-600">
                {selectedCitation.sourceType.toUpperCase()}
              </span>
              {selectedCitation.journal && <span>{selectedCitation.journal}</span>}
              {selectedCitation.year && <span>{selectedCitation.year}</span>}
              {selectedCitation.impactFactor && (
                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">
                  IF: {selectedCitation.impactFactor}
                </span>
              )}
            </div>
            {selectedCitation.url && (
              <a
                href={selectedCitation.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                打开原文链接
              </a>
            )}
            {selectedCitation.sourceType === 'guideline' && selectedCitation.guidelineLocation && (
              <GuidelineLocationBlock location={selectedCitation.guidelineLocation} />
            )}
            {selectedCitation.abstract && (
              <p className="text-sm text-slate-600 leading-relaxed">{selectedCitation.abstract}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {citations.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCitation?.(c)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  highlightedCitationId === c.id ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200 hover:border-teal-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white",
                    c.sourceType === 'guideline' ? "bg-teal-600" : c.sourceType === 'pubmed' ? "bg-blue-600" : "bg-purple-600"
                  )}>
                    {c.index}
                  </span>
                  <span className="text-sm font-medium text-slate-900 line-clamp-2">{c.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** 指南定位示意图：展示章节位置 + 高亮被引用段落 */
function GuidelineLocationBlock({ location }: { location: GuidelineLocation }) {
  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/30 overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-teal-100 bg-teal-50 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">指南定位</span>
        {location.pageLabel && (
          <span className="ml-auto text-xs text-teal-600 font-medium">{location.pageLabel}</span>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">{location.section}</span>
          {location.subsection && (
            <>
              <span className="text-slate-400">→</span>
              <span className="text-teal-700 font-medium">{location.subsection}</span>
            </>
          )}
        </div>
        <div className="rounded-lg border-2 border-amber-300 bg-amber-50/80 p-3 shadow-inner">
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {location.excerpt}
          </p>
          <p className="mt-2 text-[10px] text-amber-700 font-medium">↑ 本段为引用对应原文（高亮）</p>
        </div>
      </div>
    </div>
  );
}
