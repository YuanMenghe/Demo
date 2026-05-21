import React from 'react';
import { 
  X,
  ExternalLink,
  BookOpen,
  FileText,
  Users,
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCDSSLogic } from '@/hooks/useCDSSLogic';
import { Citation } from '@/types';
import { motion } from 'framer-motion';

interface RightPanelProps {
  logic: ReturnType<typeof useCDSSLogic>;
  selectedCitation: Citation | null;
  onClose: () => void;
  highlightedCitationId?: string | null;
  onSelectCitation?: (citation: Citation) => void;
}

export function RightPanel({ logic, selectedCitation, onClose, highlightedCitationId, onSelectCitation }: RightPanelProps) {
  const { response } = logic;

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 shrink-0 bg-white">
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
              <span className="text-sm truncate max-w-[200px]">证据详情</span>
            </>
          ) : (
            <>
              <Quote className="w-4 h-4 text-slate-400" />
              <span className="text-sm">参考文献 ({response.citations?.length || 0})</span>
            </>
          )}
        </div>
        
        {selectedCitation && (
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        {selectedCitation ? (
          <CitationDetail citation={selectedCitation} />
        ) : (
          <div className="p-4 space-y-3">
            {response.citations?.map(citation => (
              <div 
                key={citation.id}
                onClick={() => onSelectCitation?.(citation)}
                className={cn(
                  "bg-white p-3 rounded-lg border shadow-sm transition-all group cursor-pointer",
                  highlightedCitationId === citation.id 
                    ? "border-indigo-400 ring-2 ring-indigo-100 shadow-md scale-[1.02]" 
                    : "border-slate-200 hover:border-teal-200 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span className={cn(
                    "shrink-0 w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold text-white mt-0.5 transition-colors",
                    highlightedCitationId === citation.id ? "bg-indigo-600" : (
                      citation.sourceType === 'guideline' ? "bg-teal-600" :
                      citation.sourceType === 'pubmed' ? "bg-blue-600" : "bg-purple-600"
                    )
                  )}>
                    {citation.index}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className={cn(
                      "text-xs font-medium leading-snug transition-colors line-clamp-2",
                      highlightedCitationId === citation.id ? "text-indigo-700" : "text-slate-900 group-hover:text-teal-700"
                    )}>
                      {citation.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="uppercase font-semibold tracking-wider">{citation.sourceType}</span>
                      <span>•</span>
                      <span className="truncate">{citation.journal}</span>
                      <span>•</span>
                      <span>{citation.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!response.citations || response.citations.length === 0) && (
              <div className="text-center py-12 text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无引用文献</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CitationDetail({ citation }: { citation: Citation }) {
  return (
    <div className="flex flex-col h-full">
      {/* Meta Info */}
      <div className="p-6 bg-white border-b border-slate-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 leading-snug">
          {citation.url ? (
            <a 
              href={citation.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-teal-600 hover:underline flex items-start gap-2"
            >
              {citation.title}
              <ExternalLink className="w-4 h-4 mt-1 shrink-0 text-slate-400" />
            </a>
          ) : (
            citation.title
          )}
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            "px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5",
            citation.sourceType === 'guideline' ? "bg-teal-50 text-teal-700" :
            citation.sourceType === 'pubmed' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
          )}>
            {citation.sourceType === 'guideline' ? <FileText className="w-3 h-3" /> :
             citation.sourceType === 'pubmed' ? <BookOpen className="w-3 h-3" /> : <Users className="w-3 h-3" />}
            {citation.sourceType.toUpperCase()}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
            {citation.journal}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
            {citation.year}
          </span>
          {citation.url && (
            <a 
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open Source
            </a>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {citation.abstract && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Abstract / Excerpt</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {citation.abstract}
            </p>
          </div>
        )}

        {/* Mock PDF Viewer for Guidelines */}
        {citation.sourceType === 'guideline' && (
          <div className="relative aspect-[3/4] bg-slate-200 rounded-lg overflow-hidden border border-slate-300 shadow-inner group">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">PDF Preview</p>
              </div>
            </div>
            {/* Highlight Overlay Mockup */}
            <div className="absolute top-[20%] left-[10%] right-[10%] h-[15%] bg-yellow-300/40 border-2 border-yellow-400 rounded mix-blend-multiply animate-pulse" />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button className="bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                <ExternalLink className="w-3 h-3" />
                Open Full PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
