import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share, AlertTriangle, SendHorizonal, FileOutput, ChevronDown, ChevronUp, BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

// Helper Accordion Component
const AccordionSection = ({ title, children, defaultOpen = false, controlledOpen, onToggle }: { title: string, children: React.ReactNode, defaultOpen?: boolean, controlledOpen?: boolean, onToggle?: () => void }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const handleToggle = () => {
    if (onToggle) onToggle();
    if (controlledOpen === undefined) setInternalOpen(!internalOpen);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden mb-3">
      <button 
        onClick={handleToggle} 
        className="w-full px-4 py-3 flex items-center justify-between bg-white"
      >
        <h3 className="font-semibold text-neutral-900 text-sm">{title}</h3>
        {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 text-sm text-neutral-700 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AnalysisResult() {
  const navigate = useNavigate();
  const { clearDraft, updateDraft } = useAppStore();
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [showDataConfirmModal, setShowDataConfirmModal] = useState(false);
  const [showGuidelineDrawer, setShowGuidelineDrawer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  // Match process state
  const [isGenerating, setIsGenerating] = useState(true);
  const [matchStep, setMatchStep] = useState<0|1|2|3>(0);
  const [matchText, setMatchText] = useState('');
  const [matchAccordionOpen, setMatchAccordionOpen] = useState(true);
  const [conclusionVisible, setConclusionVisible] = useState(false);
  const stopGenerationRef = useRef(false);

  useEffect(() => {
    clearDraft();
    stopGenerationRef.current = false;
    
    const steps = [
      "正在加载 NCCN 2025.v3 淋巴瘤指南...\n匹配当前亚型：DLBCL\n检索到相关条例 12 条...",
      "应用 IPI 评分规则...\n判断年龄与 LDH 风险因子...\n路径计算完毕，高危（评分 3）...",
      "扫描全文细节...\n排除心血管禁忌等特殊状况...\n匹配到首选方案区域..."
    ];

    let currentStep = 0;
    
    // Quick typing simulation
    const simulateStep = () => {
       if (stopGenerationRef.current) {
         return;
       }
       if (currentStep > 2) {
         setMatchAccordionOpen(false);
         setTimeout(() => {
           setConclusionVisible(true);
           setIsGenerating(false);
         }, 300);
         return;
       }
       setMatchStep(currentStep as 0|1|2);
       setMatchText('');
       
       let charIdx = 0;
       const fullText = steps[currentStep];
       
       const interval = setInterval(() => {
          if (stopGenerationRef.current) {
             clearInterval(interval);
             return;
          }
          setMatchText(fullText.slice(0, charIdx + 1));
          charIdx++;
          if (charIdx === fullText.length) {
             clearInterval(interval);
             setTimeout(() => {
                currentStep++;
                simulateStep();
             }, 800);
          }
       }, 30);
    };

    simulateStep();
    return () => { stopGenerationRef.current = true; };
  }, [clearDraft]);

  const handleStop = () => {
     stopGenerationRef.current = true;
     setIsGenerating(false);
     setConclusionVisible(true); // show partial or full anyway
     setMatchAccordionOpen(false);
  };

  // Mock guideline click
  const openGuideline = () => setShowGuidelineDrawer(true);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert('模拟导出成功，已唤起 wx.openDocument预览。');
    }, 2000);
  };

  const NCCNRef = () => (
    <sup 
      onClick={openGuideline}
      className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded ml-1 cursor-pointer font-semibold"
    >
      [NCCN 2025.v3]^1
    </sup>
  );

  const handleSend = () => {
    if (!chatInput.trim()) return;
    
    // Simulate NLU detection for scenario B (Clinical Data)
    if (chatInput.includes('LDH') || chatInput.includes('指标') || chatInput.includes('正常值')) {
      setShowDataConfirmModal(true);
      return; 
    }

    // Scenario A: Chat
    const newMsgs = [...messages, { role: 'user' as const, content: chatInput }];
    setMessages(newMsgs);
    setChatInput('');
    
    setTimeout(() => {
      setMessages([...newMsgs, { 
        role: 'assistant', 
        content: "根据指南，R-CHOP 是目前被广泛推荐的一线标准化疗方案，能够有效提高患者的完全缓解率。" 
      }]);
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 relative">
      <header className="px-4 py-3 flex items-center justify-between border-b border-neutral-100 bg-white z-10 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/history')} className="p-1 -ml-1 text-neutral-900">
             <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg text-neutral-900">分析结果</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-[100px]" ref={scrollRef}>
        
        <AccordionSection title="关键信息抽取" defaultOpen>
          <div className="space-y-1">
            <p className="flex justify-between border-b border-neutral-50 pb-1">
              <span className="text-neutral-500">患者情况</span>
              <span className="font-medium text-neutral-900">60岁男性</span>
            </p>
            <p className="flex justify-between border-b border-neutral-50 py-1">
              <span className="text-neutral-500">主要症状</span>
              <span className="font-medium text-neutral-900">无痛性淋巴结肿大</span>
            </p>
            <p className="flex justify-between pt-1">
              <span className="text-neutral-500">病理分型</span>
              <span className="font-medium text-neutral-900">DLBCL / Ann Arbor III期</span>
            </p>
          </div>
        </AccordionSection>

        <AccordionSection 
           title="匹配过程" 
           controlledOpen={matchAccordionOpen} 
           onToggle={() => setMatchAccordionOpen(!matchAccordionOpen)}
        >
          <div className="flex bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 min-h-[100px]">
             {/* Left side tags */}
             <div className="w-[90px] shrink-0 bg-neutral-100 border-r border-neutral-200 flex flex-col">
               {(['匹配指南', '决策树匹配', '全文匹配'] as const).map((label, idx) => (
                 <div key={idx} className={cn(
                   "text-[10px] font-medium px-2 py-2 border-b border-neutral-200 last:border-0 relative transition-colors flex p-2 items-center",
                   matchStep === idx ? "text-emerald-700 bg-white" : "text-neutral-500"
                 )}>
                   {matchStep === idx && (
                     <motion.div layoutId="activeTag" className="absolute left-0 inset-y-0 w-0.5 bg-emerald-500" />
                   )}
                   {label}
                 </div>
               ))}
             </div>
             {/* Right side streaming text */}
             <div className="flex-1 p-3 text-[11px] leading-5 text-neutral-700 whitespace-pre-wrap font-mono">
                {matchText}
                {isGenerating && <span className="inline-block w-1.5 h-3 bg-emerald-500 animate-pulse ml-0.5 align-middle" />}
             </div>
          </div>
        </AccordionSection>

        {conclusionVisible && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <AccordionSection title="诊断与分层结论" defaultOpen>
              根据提取事实计算，该患者 <strong>IPI 评分为 3 分</strong>，属于 
              <span className="inline-block mx-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-bold">高危</span>
              群体。<NCCNRef />
            </AccordionSection>

            <AccordionSection title="治疗方案建议" defaultOpen>
               <ul className="list-disc pl-4 space-y-2 mt-1">
                 <li>
                    <span className="font-medium text-neutral-900">首选方案：</span> 
                    R-CHOP 方案 x 6 个疗程。<NCCNRef />
                 </li>
                 <li>
                    如有特殊心脏风险，可考虑剂量调整或其他靶向药物联合。
                 </li>
               </ul>
            </AccordionSection>

            <AccordionSection title="进一步检查建议" defaultOpen>
              建议补充PET-CT检查以明确结外受累范围，并定期复查血常规和肝肾功能。
            </AccordionSection>

            <AccordionSection title="医患沟通要点" defaultOpen>
              患者高危倾向明显，需强调早期规范化疗的重要性及预后风险，关注心理状态。
            </AccordionSection>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 bg-neutral-100 p-3 rounded-lg mt-6">
           <AlertTriangle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
           <p className="text-[10px] text-neutral-500 leading-tight">
             免责声明：本系统为辅助分析工具，输出内容基于指南算法生成，仅供专业医生参考，不构成医疗诊断或处方。
           </p>
        </div>

        {/* Dynamic Chat Bubbles below Results */}
        {messages.length > 0 && (
          <div className="mt-8 space-y-4">
             {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === 'user' ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white border border-neutral-100 text-neutral-800 rounded-bl-sm shadow-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
             ))}
          </div>
        )}

      </main>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-neutral-200 px-3 py-3 pb-safe z-20 flex gap-2 items-center">
        <button 
          onClick={handleExport}
          className="h-10 px-3 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600 active:bg-neutral-200 transition-all font-medium text-xs gap-1"
        >
           {exporting ? (
             <span className="animate-pulse">生成中...</span>
           ) : (
             <FileOutput className="w-5 h-5" />
           )}
        </button>
        <div className="flex-1 relative">
           <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isGenerating ? "生成中..." : "继续追问..."}
              disabled={isGenerating}
              className="w-full bg-neutral-100 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
           />
           {isGenerating ? (
              <button 
                onClick={handleStop}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
              </button>
           ) : (
             <button 
                onClick={handleSend}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 text-white rounded-full flex items-center justify-center w-8 h-8"
              >
                <SendHorizonal className="w-5 h-5 pr-[2px]" />
             </button>
           )}
        </div>
      </div>

      {/* Data Confirm Modal */}
      <AnimatePresence>
        {showDataConfirmModal && (
          <>
            <motion.div className="fixed inset-0 bg-neutral-900/40 z-40" onClick={() => setShowDataConfirmModal(false)} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-white p-5 rounded-2xl z-50">
              <h3 className="font-semibold text-neutral-900 mb-2">更新分析报告？</h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                 检测到您补充了新的临床指标（LDH），是否基于新信息重新生成分析报告？
              </p>
              <div className="flex gap-3">
                 <button 
                  onClick={() => {
                    setShowDataConfirmModal(false);
                    // Add it to chat directly
                    setMessages([...messages, { role: 'user', content: chatInput }, { role: 'assistant', content: "好的，我已经记录了 LDH 升高的情况。根据之前的指南..."}]);
                    setChatInput('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-sm"
                 >
                   仅作回答
                 </button>
                 <button 
                  onClick={() => {
                    updateDraft({ subtype: 'DLBCL' }); // Prep the draft edit
                    navigate('/case/confirm'); // Go back to confirm
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm"
                 >
                   重新分析
                 </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Guideline Drawer */}
      <AnimatePresence>
        {showGuidelineDrawer && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-neutral-900/30 z-30" 
               onClick={() => setShowGuidelineDrawer(false)}
            />
            <motion.div
               initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute bottom-0 inset-x-0 h-[50%] bg-white rounded-t-3xl z-40 flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-bold">NCCN 2025.v3 DLBCL指南</span>
                </div>
                <button onClick={() => setShowGuidelineDrawer(false)} className="p-1.5 bg-neutral-100 rounded-full text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
                 <p className="text-sm text-neutral-700 leading-loose">
                    对于预期生存期良好且 <mark className="bg-yellow-200 text-neutral-900 font-medium px-1 rounded">IPI 评分 ≥ 3分（高危）</mark> 的弥漫大B细胞淋巴瘤患者，标准的 R-CHOP 方案...
                 </p>
                 <p className="text-xs text-neutral-400 mt-4">来源：NCCN Guidelines Version 3.2025 B-Cell Lymphomas</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
