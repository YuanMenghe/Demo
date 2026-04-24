import { Search, Sparkles, ArrowRight, ArrowUp, Send, Link } from "lucide-react";
import { cn } from "../../lib/utils";

export function ChatInput() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center mt-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-12">生命科学领域AI助手</h1>
      
      <div className="w-full bg-white rounded-3xl outline outline-1 outline-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:outline-teal-500 focus-within:outline-2 transition-all p-2 flex flex-col">
        <textarea 
          placeholder="给 NOAH 一个生命科学相关任务..."
          className="w-full resize-none border-0 outline-none p-4 text-gray-700 bg-transparent min-h-[100px]"
        />
        
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-100">
              <Sparkles size={14} /> Agent
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-100">
              <Search size={14} /> Search
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 rounded-full text-xs hover:bg-gray-50">
              <span className="flex items-center gap-1"><span className="w-3 h-3 border border-current rounded-sm inline-flex items-center justify-center shrink-0"><span className="w-1.5 h-1.5 bg-current rounded-[1px]"></span></span> 医学搜索</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <span className="font-serif italic text-lg px-2">A</span>
            </button>
            <button className="w-8 h-8 bg-teal-200 text-white rounded-full flex items-center justify-center hover:bg-teal-300 transition-colors">
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
          <Link size={14} /> TRY ASKING ABOUT
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["Professionals", "Investors", "Clinicians", "Research Users", "General Users"].map((tag) => (
            <button key={tag} className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-sm hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center gap-2">
              {tag === "Professionals" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              {tag === "Investors" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
              {tag === "Clinicians" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              {tag === "Research Users" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
              {tag === "General Users" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              {tag}
            </button>
          ))}
        </div>

        <div className="space-y-3 text-left">
          <Suggestion num="01" text="Drug Development Potential of Target CDH-17" />
          <Suggestion num="02" text="Car-T in Multiple Sclerosis and Neuromyelitis Optica Spectrum Disorder" />
          <Suggestion num="03" text="Latest Advances about Diagnosis and Treatment of Multiple Sclerosis" />
          <Suggestion num="04" text="Animal Modes for Depression Study" />
        </div>
      </div>
    </div>
  );
}

function Suggestion({ num, text }: { num: string, text: string }) {
  return (
    <div className="flex items-center text-sm text-gray-700 hover:text-teal-600 transition-colors cursor-pointer group">
      <span className="text-gray-400 font-mono text-xs mr-4">{num}</span>
      <span className="flex-1">{text}</span>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </div>
  );
}
