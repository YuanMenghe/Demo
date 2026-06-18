import React, { useState } from "react";
import {
  AlertTriangle, Check, ChevronDown, Sparkles,
  ShieldAlert, PlayCircle, Pencil, Edit3, RefreshCw, FileText,
  X, FileUp, ArrowUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCDSSLogic } from "@/hooks/useCDSSLogic";
import { Concept } from "@/types";
import { SCENARIOS } from "@/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface LeftPanelProps {
  logic: ReturnType<typeof useCDSSLogic>;
  slim?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAnalyze?: () => void;
  onResetToInput?: () => void;
  isAnalyzing?: boolean;
}

export function LeftPanel({ logic, slim=false, onAnalyze, onResetToInput, isAnalyzing }: LeftPanelProps) {
  const { patientContext, setPatientContext, response, checkPII, confirmConcept, updateConcept, updateMissingInput, loadScenario, currentScenarioId } = logic;
  const [showPIIAlert, setShowPIIAlert] = useState(false);
  const [tempText, setTempText] = useState("");
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleAnalyzeClick = () => {
    const { hasPII, maskedText } = checkPII(patientContext.unstructuredText);
    if (hasPII) { setTempText(maskedText); setShowPIIAlert(true); }
    else onAnalyze?.();
  };
  const handlePIIConfirm = () => {
    setPatientContext(prev => ({ ...prev, unstructuredText: tempText }));
    setShowPIIAlert(false); onAnalyze?.();
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isAnalyzing && patientContext.unstructuredText?.trim()) handleAnalyzeClick();
    }
  };

  const handleFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    setFiles(prev => [...prev, ...arr]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const formatBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  };

  if (slim) {
    return <SlimPanel logic={logic} onAnalyze={onAnalyze} onResetToInput={onResetToInput} isAnalyzing={isAnalyzing} />;
  }

  const charCount = patientContext.unstructuredText?.length ?? 0;
  const canSubmit = !isAnalyzing && !!patientContext.unstructuredText?.trim();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50/60 overflow-y-auto">
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-6 sm:px-8 pt-12 pb-10">

        {/* ── Hero ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span className="text-[11px] font-semibold text-teal-700 tracking-wide">MDT_Beone · 智能临床决策</span>
          </div>
          <h1 className="text-3xl sm:text-[2rem] font-bold text-slate-900 tracking-tight leading-tight">
            患者信息录入
          </h1>
          <p className="text-slate-500 mt-3 text-[15px] max-w-md leading-relaxed">
            粘贴病历或上传报告，AI 将自动提取临床要素并匹配指南证据。
          </p>

          {/* 演示案例选择器 */}
          <div className="relative mt-6">
            <button
              onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)}
              className="group inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-200 px-4 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow"
            >
              <PlayCircle className="w-4 h-4 text-teal-600" />
              <span>试用演示案例</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", isScenarioMenuOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isScenarioMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsScenarioMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 overflow-hidden"
                  >
                    {SCENARIOS && Object.values(SCENARIOS).map(scenario => (
                      <button
                        key={scenario.id}
                        onClick={() => { loadScenario(scenario.id as any); setIsScenarioMenuOpen(false); }}
                        className={cn(
                          "w-full text-left px-5 py-3 text-sm transition-colors flex items-center gap-2.5",
                          currentScenarioId === scenario.id
                            ? "bg-teal-50/70 text-teal-700 font-semibold"
                            : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          currentScenarioId === scenario.id ? "bg-teal-500" : "bg-slate-300"
                        )} />
                        <span className="flex-1">{scenario.name}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── 输入卡(textarea + 内嵌 toolbar) ── */}
        <div className={cn(
          "relative bg-white rounded-3xl border shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] transition-all overflow-hidden",
          "border-slate-200/80 focus-within:border-teal-300 focus-within:shadow-[0_8px_32px_-8px_rgba(13,148,136,0.18)]"
        )}>
          <textarea
            className="w-full px-6 pt-6 pb-2 text-[15px] text-slate-800 bg-transparent border-none focus:outline-none resize-none placeholder:text-slate-400 leading-relaxed min-h-[260px] max-h-[460px]"
            placeholder="在此粘贴患者病历，例如：65 岁男性，发现左侧颈部包块 2 月余。病理：弥漫大 B 细胞淋巴瘤，GCB 亚型。Ann Arbor III 期 A，LDH 升高，HBsAg 阳性..."
            value={patientContext.unstructuredText}
            onChange={e => setPatientContext(prev => ({ ...prev, unstructuredText: e.target.value }))}
            onKeyDown={handleTextareaKeyDown}
          />
          {/* toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {charCount.toLocaleString()} 字符
              </span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-mono">Enter</kbd>
                <span className="text-slate-400">分析</span>
              </span>
            </div>
            <button
              onClick={handleAnalyzeClick}
              disabled={!canSubmit}
              aria-label="智能分析"
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-full shadow-sm transition-all active:scale-95",
                canSubmit
                  ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {isAnalyzing
                ? <span className="animate-spin text-sm">⏳</span>
                : <ArrowUp className="w-4 h-4" strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* ── 附件上传区 ── */}
        <div className="mt-5">
          <label
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "group flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl border border-dashed cursor-pointer transition-all",
              isDragging
                ? "bg-teal-50 border-teal-400 ring-4 ring-teal-500/10"
                : "bg-white/60 border-slate-200 hover:bg-teal-50/40 hover:border-teal-300"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              isDragging ? "bg-teal-100" : "bg-slate-100 group-hover:bg-teal-100"
            )}>
              <FileUp className={cn(
                "w-4 h-4 transition-colors",
                isDragging ? "text-teal-700" : "text-slate-500 group-hover:text-teal-700"
              )} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-sm text-slate-700 font-medium">
                <span className="text-teal-700">点击上传</span>
                <span className="text-slate-500"> 或拖拽病历 / 检查报告</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">支持 PDF · DOCX · JPG · PNG (可选)</div>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={e => handleFiles(e.target.files)}
            />
          </label>

          {/* 文件 chip 列表 */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex flex-wrap gap-2"
              >
                {files.map((f, i) => (
                  <motion.div
                    key={`${f.name}-${i}`}
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-slate-700 truncate max-w-[180px]" title={f.name}>{f.name}</span>
                    <span className="text-slate-400">{formatBytes(f.size)}</span>
                    <button
                      onClick={e => { e.preventDefault(); removeFile(i); }}
                      className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full p-0.5 transition-colors"
                      aria-label="移除文件"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── PII 提示 ── */}
        <AnimatePresence>
          {showPIIAlert && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-amber-900 font-bold">检测到隐私信息</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">系统已自动遮罩敏感字段（如姓名、电话等），请确认后继续。</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPIIAlert(false)} className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
                <button onClick={handlePIIConfirm} className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-lg shadow-sm transition-colors">确认并提交</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 已识别要素 (分析后) ── */}
        <AnimatePresence>
          {response.concepts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  已识别要素
                </label>
                <span className="text-[11px] text-slate-400">点击标签可修改</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {response.concepts.map(c => (
                  <ConceptTag key={c.id} concept={c} onConfirm={() => confirmConcept(c.id)} onUpdate={t => updateConcept(c.id, t)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 需要补充信息 (分析后) ── */}
        <AnimatePresence>
          {response.missingInputs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 p-5 bg-gradient-to-b from-amber-50/80 to-amber-50/20 border border-amber-200/60 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">需要补充信息</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">完善以下信息以获取更精准的方案</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {response.missingInputs.map(input => (
                  <div key={input.id} className="bg-white border border-amber-200/60 rounded-xl p-3 shadow-sm space-y-2 hover:border-amber-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {input.label}
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      </label>
                      {input.requiredFor && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100 font-medium shrink-0">
                          {input.requiredFor === "guideline_unlock" ? "解锁指南" : input.requiredFor === "treatment_safety" ? "用药安全" : "必要信息"}
                        </span>
                      )}
                    </div>
                    {input.type === "select" ? (
                      <div className="relative">
                        <select
                          className="w-full text-xs pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 appearance-none transition-all"
                          onChange={e => updateMissingInput(input.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>请选择...</option>
                          {input.allowEmpty && <option value="not_done">暂不填写</option>}
                          {input.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400 transition-all"
                        placeholder="请输入..."
                        onBlur={e => updateMissingInput(input.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── 底部 sticky CTA ── */}
      <div className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 shrink-0 shadow-[0_-6px_24px_-12px_rgba(15,23,42,0.1)] z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            {canSubmit ? "准备就绪 · 点击右侧按钮开始" : "请先输入或粘贴病历文本"}
          </div>
          <button
            onClick={handleAnalyzeClick}
            disabled={!canSubmit}
            className={cn(
              "flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] min-w-[220px]",
              canSubmit
                ? "bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30"
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            {isAnalyzing
              ? <><span className="animate-spin text-base">⏳</span> 正在分析...</>
              : <><Sparkles className="w-4 h-4" /> 生成治疗方案</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function SlimPanel({ logic, onAnalyze, onResetToInput, isAnalyzing }: { logic: ReturnType<typeof useCDSSLogic>; onAnalyze?: () => void; onResetToInput?: () => void; isAnalyzing?: boolean; }) {
  const { patientContext, response, updateMissingInput } = logic;
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="px-4 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">患者档案</span>
        <button onClick={onResetToInput} className="flex items-center gap-1 text-xs text-teal-600 hover:bg-teal-50 px-2 py-1 rounded-lg transition-colors">
          <Edit3 className="w-3 h-3" /> 修改信息
        </button>
      </div>
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto min-h-0">
        {patientContext.unstructuredText && (
          <div className="text-xs text-slate-600 leading-relaxed line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100">{patientContext.unstructuredText}</div>
        )}
        {response.concepts.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">识别要素</p>
            <div className="flex flex-wrap gap-1.5">{response.concepts.map(c => (
              <span key={c.id} className={cn("px-2 py-0.5 rounded-full text-xs border", c.confirmed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : c.isCritical ? "bg-yellow-50 text-yellow-700 border-yellow-300 border-dashed" : "bg-slate-50 text-slate-600 border-slate-200")}>{c.text}</span>
            ))}</div>
          </div>
        )}
        {response.missingInputs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5"><div className="p-1 bg-amber-100 rounded-full"><AlertTriangle className="w-3 h-3 text-amber-600" /></div><p className="text-xs font-semibold text-amber-800">{response.missingInputs.length} 项待补充</p></div>
            <div className="space-y-2">{response.missingInputs.map(input => (
              <div key={input.id} className="bg-white border border-amber-200/60 rounded-lg p-2.5">
                <div className="mb-1.5">
                    <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1 mb-0.5">{input.label}<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /></label>
                    {(input.requiredFor || input.guidelineName) && (
                      <div className="text-[9px] text-slate-400 bg-slate-50 p-1 rounded">
                        {input.requiredFor && <div>解锁: {input.requiredFor}</div>}
                        {input.guidelineName && <div>来源: {input.guidelineName}</div>}
                      </div>
                    )}
                  </div>
                {input.type === "select" ? (
                  <div className="relative"><select className="w-full text-xs pl-2.5 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-md appearance-none focus:ring-1 focus:ring-amber-400" onChange={e => updateMissingInput(input.id, e.target.value)} defaultValue=""><option value="" disabled>请选择...</option>{input.allowEmpty && <option value="not_done">暂不填写</option>}{input.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" /></div>
                ) : (
                  <input type="text" className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-400 placeholder:text-slate-400" placeholder="请输入..." onBlur={e => updateMissingInput(input.id, e.target.value)} />
                )}
              </div>
            ))}</div>
          </div>
        )}
      </div>
      <div className="px-5 py-5 border-t border-slate-100 shrink-0">
        <button onClick={onAnalyze} disabled={isAnalyzing} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-all disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", isAnalyzing && "animate-spin")} /> 重新生成方案
        </button>
      </div>
    </div>
  );
}

const ConceptTag: React.FC<{ concept: Concept; onConfirm: () => void; onUpdate: (text: string) => void; }> = ({ concept, onConfirm, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(concept.text);
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);
  const handleSave = () => { if (editText.trim()) onUpdate(editText); else setEditText(concept.text); setIsEditing(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setEditText(concept.text); setIsEditing(false); } };
  if (isEditing) return (
    <div className="inline-flex items-center rounded-full text-sm border bg-white border-teal-500 shadow-sm overflow-hidden h-7">
      <input ref={inputRef} type="text" value={editText} onChange={e => setEditText(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} className="w-28 px-2.5 py-0.5 text-sm border-none focus:ring-0 bg-transparent outline-none h-full" />
      <button onMouseDown={handleSave} className="px-2 hover:bg-teal-50 text-teal-600 h-full flex items-center border-l border-teal-100"><Check className="w-3.5 h-3.5" /></button>
    </div>
  );
  return (
    <div className={cn("group relative inline-flex items-center pl-3 pr-1.5 py-1 rounded-full text-sm border transition-all cursor-pointer select-none", concept.confirmed ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300" : concept.isCritical ? "bg-yellow-50 text-yellow-800 border-yellow-300 border-dashed hover:border-yellow-400" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300")} onClick={() => setIsEditing(true)}>
      <span className="mr-1 max-w-[140px] truncate">{concept.text}</span>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"><Pencil className="w-3 h-3 text-slate-400" />{!concept.confirmed && <div onClick={e => { e.stopPropagation(); onConfirm(); }} className="p-0.5 rounded-full hover:bg-emerald-100 text-emerald-600 ml-1"><Check className="w-3 h-3" /></div>}</div>
      {concept.isCritical && !concept.confirmed && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full animate-pulse border border-white" />}
    </div>
  );
};
