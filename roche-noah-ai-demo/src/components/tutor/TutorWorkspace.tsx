import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, User, Sparkles, BookOpen, CheckCircle, FileText, Activity, 
  ArrowRight, BrainCircuit, ChevronLeft, ChevronRight, CheckCircle2, 
  Circle, LayoutList, LocateFixed, Target, BookMarked, UserCircle, 
  Flag, AlertTriangle, Presentation, PenTool, Network, ChevronDown, ListChecks,
  Settings2, X, SlidersHorizontal, Trash2, Plus
} from "lucide-react";
import { cn } from "../../lib/utils";

type DemoStep = 'profiling' | 'learning-map' | 'studying' | 'assessment';

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: ReactNode;
  reasoning?: string[];
  widget?: "quiz-hint";
};

interface TutorWorkspaceProps {
  onNavigateToModule2?: () => void;
}

export function TutorWorkspace({ onNavigateToModule2 }: TutorWorkspaceProps) {
  const [demoStep, setDemoStep] = useState<DemoStep>('profiling');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (demoStep === 'profiling') {
      setMessages([{
        id: "msg-1", role: "assistant", 
        content: "欢迎进入科研系统！请在左侧完成**基础信息采集**，我们将结合内置的科研课程、方法学指南等为您量身定制学习地图。"
      }]);
    } else if (demoStep === 'learning-map') {
      setMessages([
        { id: "msg-2", role: "assistant", content: "画像建立成功！根据您的薄弱项，系统从知识底座中提取了内容。\n\n为了给您渐进式体验，已生成四大阶段学习旅程。请点击当前阶段的「进入学习」开启互动。" }
      ]);
    } else if (demoStep === 'studying') {
      setMessages([
        { id: "msg-3", role: "assistant", content: "这里是《文献理解与综述选题》单元伴读模式。阅读过程中您可以向我提问。\n\n💡 *建议尝试问我：* \n**“如何判断综述的选题是否过大？”**" }
      ]);
    } else if (demoStep === 'assessment') {
      setMessages([
        { id: "msg-4", role: "assistant", content: "本章学习结束！我为您生成了一道测试题。请在左侧答题面板完成。\n\n系统将根据您的答题情况动态更新科研画像。" }
      ]);
    }
  }, [demoStep]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), role: "user", content: inputValue }]);
    
    // Check if it's the specific complex demo question
    const isTopicQuestion = inputValue.includes("选题") || inputValue.includes("过大") || inputValue.includes("判断");
    
    setInputValue("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      if (isTopicQuestion) {
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            content: <div className="space-y-4">
              <div>
                <strong className="text-teal-700 block mb-1">🔍 核心概念解释</strong>
                <p className="m-0 text-sm">综述选题的“大小”通常取决于研究视角的宽窄及对应文献存量。若无法在合理篇幅内聚焦，即为过大。</p>
              </div>
              <div>
                <strong className="text-emerald-700 block mb-1">🎯 具体应用场景</strong>
                <p className="m-0 text-[13px] bg-emerald-50 p-2 rounded border border-emerald-100 mt-1">
                  <span className="line-through text-gray-400">“免疫治疗在实体瘤中的应用”</span> (极大题目)<br/>
                  <span className="text-emerald-800 font-medium">“PD-1抑制剂在三阴性乳腺癌新辅助治疗中的评估”</span> (切口具体)
                </p>
              </div>
              <div>
                <strong className="text-amber-700 block mb-1">⚠️ 常见科研误区</strong>
                <p className="m-0 text-[13px]">初学者常刻意选大题，很容易导致文章沦为文献罗列，缺乏独立深刻的见解。</p>
              </div>
            </div>,
         }]);
      } else {
         setMessages(prev => [...prev, {
            id: Date.now().toString(), role: "assistant", content: "收到。结合左侧知识讲义，这个问题值得我们深度探讨..."
         }]);
      }
    }, 1500);
  };

  return (
    <div className="flex h-full w-full bg-slate-50 relative overflow-hidden">
      
      {/* ⬅️ Left & Center Panel: Main Content View */}
      <div className="flex-1 flex flex-col h-full bg-white relative rounded-r-[32px] shadow-[4px_0_24px_rgba(0,0,0,0.03)] z-10 border-r border-gray-100 overflow-hidden">
        
        {/* Workspace Toolbar */}
        <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[11px] font-medium text-gray-400 bg-gray-50 rounded-full border border-gray-200">
                <span className={cn("px-3 py-1.5 rounded-full transition-colors", demoStep === 'profiling' ? "bg-teal-500 text-white font-bold" : "cursor-pointer hover:bg-gray-100")} onClick={() => setDemoStep('profiling')}>1. 基础画像</span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className={cn("px-3 py-1.5 rounded-full transition-colors", demoStep === 'learning-map' ? "bg-teal-500 text-white font-bold" : "cursor-pointer hover:bg-gray-100")} onClick={() => setDemoStep('learning-map')}>2. 定制路径</span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className={cn("px-3 py-1.5 rounded-full transition-colors", demoStep === 'studying' ? "bg-teal-500 text-white font-bold" : "cursor-pointer hover:bg-gray-100")} onClick={() => setDemoStep('studying')}>3. 伴读问答</span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className={cn("px-3 py-1.5 rounded-full transition-colors", demoStep === 'assessment' ? "bg-teal-500 text-white font-bold" : "cursor-pointer hover:bg-gray-100")} onClick={() => setDemoStep('assessment')}>4. 测评更新</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsPersonaOpen(true)}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold border border-indigo-200 hover:border-indigo-600 transition-colors shadow-sm group"
             >
               <SlidersHorizontal size={14} className="group-hover:rotate-90 transition-transform" /> 独立入口：全景画像看板
             </button>
          </div>
        </div>

        {/* Dynamic Center Stage */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          {demoStep === 'profiling' && <ProfilingView onNext={() => setDemoStep('learning-map')} />}
          {demoStep === 'learning-map' && <LearningMapView onNext={() => setDemoStep('studying')} />}
          {demoStep === 'studying' && <StudyingView onNext={() => setDemoStep('assessment')} />}
          {demoStep === 'assessment' && <AssessmentView onNavigateToModule2={onNavigateToModule2} />}
        </div>
      </div>

      {/* ➡️ Right Panel: Chat Assistant */}
      <div className="w-[380px] bg-white flex flex-col flex-shrink-0 relative">
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
              <Sparkles size={16} className="text-teal-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">学习伴读智能体</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-md">陪伴中</span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {msg.role === "user" ? (
                  <div className="w-7 h-7 bg-indigo-900 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1">
                    <User size={14} />
                  </div>
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1 ring-2 ring-white">
                    <Bot size={14} />
                  </div>
                )}

                <div className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap",
                    msg.role === "user" 
                      ? "bg-indigo-900 text-white rounded-tr-sm" 
                      : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm w-full"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white mt-1 shadow-sm">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-10">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-end bg-gray-50 border border-gray-200 rounded-xl p-1.5 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="让伴学助手为你辅导..."
              className="flex-1 bg-transparent border-0 outline-none p-2.5 text-[14px] resize-none max-h-32 min-h-[44px]"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-indigo-900 text-white rounded-lg mb-0.5 mr-0.5 hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Persona View Modal */}
      <AnimatePresence>
        {isPersonaOpen && <PersonaDashboardModal onClose={() => setIsPersonaOpen(false)} onNavigateToModule2={onNavigateToModule2} />}
      </AnimatePresence>
    </div>
  );
}

// ======================= Persona Dashboard Modal =========================

function PersonaDashboardModal({ onClose, onNavigateToModule2 }: { onClose: () => void, onNavigateToModule2?: () => void }) {
  const [skills, setSkills] = useState({ literature: 35, planning: 80, design: 45, stat: 20 });
  const [directions, setDirections] = useState(["肿瘤免疫", "单抗药物"]);

  const removeDir = (dir: string) => setDirections(directions.filter(d => d !== dir));

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-gray-50 w-full max-w-6xl h-[85vh] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden ring-1 ring-white/50"
      >
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-inner">
              <UserCircle size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">科研成长双轨画像 (Dual-Track Persona)</h2>
              <p className="text-[11px] text-gray-500 font-medium">您可以随时查看 AI 总结记录，或手动干预调整您的期望指标。</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* LEFT: Profile (Editable) */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <BrainCircuit size={18} /> Memory: Profile
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-600 px-2 py-1 rounded">互动学习目标与能力底盘 | 可人工调优</span>
            </div>

            <div className="space-y-6">
              {/* Directions */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Target size={14}/> 聚焦研究方向</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {directions.map(dir => (
                    <span key={dir} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg text-sm font-medium">
                      {dir}
                      <button onClick={() => removeDir(dir)} className="hover:bg-indigo-200 p-0.5 rounded-full"><X size={12} /></button>
                    </span>
                  ))}
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-200 border-dashed hover:border-slate-300 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                    <Plus size={14} /> 补充新前沿
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Settings2 size={14}/> 陪伴沟通方式期望</label>
                <select className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 font-medium">
                  <option>偏向底层逻辑解读与推导 (推荐学习期使用)</option>
                  <option>偏向结论导向与快捷查阅 (推荐提效期使用)</option>
                  <option>偏向严苛批评式挑错 (推荐科研实战时使用)</option>
                </select>
              </div>

              {/* Skills Sliders */}
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1"><Activity size={14}/> 系统评估科研能力分位 (拖拽自评修正)</label>
                <div className="space-y-5 bg-slate-50 p-5 border border-slate-100 rounded-2xl">
                  
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                      <span>文献洞察视野</span>
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{skills.literature}% Top</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={skills.literature} 
                      onChange={(e) => setSkills({...skills, literature: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                      <span>综述选题规划</span>
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{skills.planning}% Top</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={skills.planning} 
                      onChange={(e) => setSkills({...skills, planning: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                      <span>实验设计规范 (IIT)</span>
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{skills.design}% Top</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={skills.design} 
                      onChange={(e) => setSkills({...skills, design: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary (Read Only History) */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <BookMarked size={18} /> Memory: Summary
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded">学习记录与行为轨迹 | 自动沉淀</span>
            </div>

            <div className="space-y-6">
              
              <div className="relative pl-6 border-l-2 border-emerald-100 space-y-6 before:absolute before:top-0 before:left-[-2px] before:w-[2px] before:h-8 before:bg-emerald-500">
                 
                 <div className="relative">
                   <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[31px] top-1 ring-4 ring-white"></div>
                   <h4 className="text-sm font-bold text-gray-900">完成《文献理解与综述精读》单元</h4>
                   <p className="text-xs text-gray-500 mt-1">2026-04-19 14:20</p>
                   <div className="mt-2 text-sm text-gray-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                     <span className="font-semibold text-emerald-700">表现记录：</span>场景测试“判断课题收敛度” 1次命中。已掌握 PICOS 缩放分析框架。
                   </div>
                 </div>

                 <div className="relative">
                   <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[31px] top-1 ring-4 ring-white"></div>
                   <h4 className="text-sm font-bold text-gray-900">高频提问与深究点提取</h4>
                   <p className="text-xs text-gray-500 mt-1">2026-04-18 内沉淀</p>
                   <ul className="mt-2 text-sm text-gray-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                     <li className="flex gap-1.5"><ChevronRight size={16} className="text-slate-400 shrink-0"/> <span>反复追问“<strong className="text-gray-800">实体瘤代谢剥夺重编程</strong>”的底层生化通路</span></li>
                     <li className="flex gap-1.5"><ChevronRight size={16} className="text-slate-400 shrink-0"/> <span>对比索取 PD-1 和 CTLA-4 关于起效位置差异的数据</span></li>
                   </ul>
                 </div>

                 <div className="relative">
                   <div className="absolute w-3 h-3 bg-amber-400 rounded-full -left-[31px] top-1 ring-4 ring-white"></div>
                   <h4 className="text-sm font-bold text-gray-900">识别出知识薄弱点</h4>
                   <div className="mt-2 bg-amber-50 text-amber-800 text-[13px] p-2.5 rounded-lg border border-amber-100">
                     临床前研究盲点：对流式细胞术的数据解读存在卡点，后续已自动为您在路线第 3 阶中插入图形解析靶向练习。
                   </div>
                 </div>

              </div>
              
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors text-sm">取消调整</button>
          <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-medium rounded-xl flex items-center gap-2 transform active:scale-95 transition-all text-sm">
            <CheckCircle2 size={16} /> 保存偏好并实时干预学习路径
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================= Steps Views (Same as before) =========================

function ProfilingView({ onNext }: { onNext: () => void }) {
  return (
    <div className="p-8 max-w-2xl mx-auto h-full flex flex-col justify-center">
       <div className="mb-6">
         <h2 className="text-3xl font-extrabold text-gray-900 mb-2">生成你的个人画像</h2>
         <p className="text-gray-500 text-sm">选择下方信息，系统将对接科研知识底座生成针对性学习方案。</p>
       </div>
       
       <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Target size={16} className="text-teal-600"/> 研究方向与科室</label>
             <div className="grid grid-cols-3 gap-2">
               {["肿瘤科", "心血管", "神经内科", "罕见病", "内分泌", "其它方向"].map(item => (
                 <div key={item} className={cn("px-3 py-2 border rounded-lg text-sm text-center cursor-pointer transition-colors", item === "肿瘤科" ? "bg-teal-50 border-teal-500 text-teal-800 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                   {item}
                 </div>
               ))}
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><UserCircle size={16} className="text-teal-600"/> 科研阶段</label>
             <div className="grid grid-cols-4 gap-2">
               {["硕士", "博士", "主治医", "研究员"].map(item => (
                 <div key={item} className={cn("px-3 py-2 border rounded-lg text-sm text-center cursor-pointer transition-colors", item === "硕士" ? "bg-teal-50 border-teal-500 text-teal-800 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                   {item}
                 </div>
               ))}
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Flag size={16} className="text-teal-600"/> 近期破局目标</label>
             <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-teal-500">
               <option>完成核心综述选题与初稿撰写</option>
               <option>开展并设计一个完整的 IIT 研究</option>
               <option>熟悉各类试验设计的关键</option>
             </select>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><AlertTriangle size={16} className="text-rose-500"/> 当前痛点/薄弱点</label>
             <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium">文献筛选很慢</span>
               <span className="px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium">结构化写作难点</span>
               <span className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-sm">实验设计方案</span>
               <span className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-sm">统计排版基础</span>
             </div>
          </div>
       </div>

       <button onClick={onNext} className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all w-full flex items-center justify-center gap-2 text-lg">
         <Sparkles size={20} /> 基于大库生成互动学习地图
       </button>
    </div>
  )
}

function LearningMapView({ onNext }: { onNext: () => void }) {
  return (
    <div className="p-10 max-w-4xl mx-auto h-full flex flex-col pt-8">
       
       <div className="mb-6 flex justify-between items-end">
         <div>
           <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutList className="text-indigo-600"/> 您的个性化学习地图</h2>
           <p className="text-gray-500 mt-1 text-sm">根据前序信息提取课程底座，分为四大培养阶段。</p>
         </div>
       </div>

       {/* Knowledge Base Tags Mock */}
       <div className="bg-white border text-sm border-gray-200 p-4 rounded-2xl shadow-sm mb-8 flex gap-4 overflow-x-auto relative">
         <div className="absolute -top-3 left-6 bg-white px-2 text-[10px] uppercase font-bold text-gray-400">资源挂载关联</div>
         <div className="flex shrink-0 items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs">
           <Network size={12} className="text-indigo-400" />
           <span className="text-slate-600">疾病类目匹配：实体瘤类</span>
         </div>
         <div className="flex shrink-0 items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs">
           <BookMarked size={12} className="text-indigo-400" />
           <span className="text-slate-600">文献指引已就绪</span>
         </div>
         <div className="flex shrink-0 items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs">
           <PenTool size={12} className="text-indigo-400" />
           <span className="text-slate-600">题库与试卷库生成激活</span>
         </div>
       </div>
       
       <div className="flex-1 relative pb-10 mt-2">
         <div className="absolute top-[28px] bottom-0 left-6 w-[2px] bg-gray-100"></div>

         <div className="space-y-6 relative">
           
           <div className="flex items-start gap-6 group">
             <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 z-10 shadow-sm relative">
               <CheckCircle2 size={24} />
             </div>
             <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex-1 flex justify-between items-center opacity-60">
                <div>
                  <h4 className="font-bold text-gray-900 line-through text-lg">第1阶：科研入门与伦理底座</h4>
                  <p className="text-sm text-gray-500 mt-0.5">此部分基础模块在您的画像雷达中已达预设健康值，已跳过。</p>
                </div>
                <span className="text-xs font-bold text-slate-400">已达标跳过</span>
             </div>
           </div>

           <div className="flex items-start gap-6 relative">
             <div className="absolute top-[52px] left-[23px] bottom-[-20px] w-1 bg-teal-500 z-0"></div>
             <div className="w-12 h-12 rounded-full border-4 border-white bg-teal-500 text-white flex items-center justify-center shrink-0 z-10 shadow-md ring-4 ring-teal-50 animate-pulse">
               <BookOpen size={20} />
             </div>
             <div className="bg-white px-6 py-5 rounded-2xl border-2 border-teal-500 shadow-lg shadow-teal-100 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1 px-3 bg-teal-500 text-white text-[11px] font-bold rounded-bl-lg">Current Stage</div>
                <h4 className="font-bold text-xl text-teal-900 mb-2">第2阶：文献理解与综述精读</h4>
                <p className="text-sm text-gray-600 mb-4 bg-teal-50/70 py-2.5 px-3 rounded text-justify">
                  您当前的薄弱点存在于对文献海量信息的梳理极易失焦。本阶段旨在教会您如何在泛读中寻找锚点并进行价值评估。系统准备了经典读物和场景问答环节。
                </p>
                <div className="flex items-center justify-between mt-5">
                  <div className="text-sm font-semibold text-teal-600 flex items-center gap-1.5"><Activity size={16} /> 阶段训练：单点测验 2个</div>
                  <button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transform active:scale-95 transition-all">
                    开始互动学习单元 <ArrowRight size={16} />
                  </button>
                </div>
             </div>
           </div>

           <div className="flex items-start gap-6 group">
             <div className="w-12 h-12 rounded-full border-4 border-white bg-white border-dashed border-gray-300 text-gray-300 flex items-center justify-center shrink-0 z-10">
               <Presentation size={20} />
             </div>
             <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 shadow-sm flex-1 opacity-70">
                <h4 className="font-bold text-gray-500 text-lg">第3阶：研究设计逻辑拆解</h4>
                <p className="text-[13px] text-gray-400 mt-1">请通关本阶段并接受测验画像更新后解锁。</p>
             </div>
           </div>
           
           <div className="flex items-start gap-6 group">
             <div className="w-12 h-12 rounded-full border-4 border-white bg-white border-dashed border-gray-300 text-gray-300 flex items-center justify-center shrink-0 z-10">
               <PenTool size={20} />
             </div>
             <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 shadow-sm flex-1 opacity-70">
                <h4 className="font-bold text-gray-500 text-lg">第4阶：写作实践 (模块化撰写)</h4>
                <p className="text-[13px] text-gray-400 mt-1">需达成一定熟练度，随后为您无缝衔接第二大辅助场景。</p>
             </div>
           </div>

         </div>
       </div>
    </div>
  )
}

function StudyingView({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 bg-white p-10 overflow-y-auto prose prose-slate max-w-none prose-h2:text-gray-800 prose-p:text-gray-700 prose-p:leading-8">
          <div className="mb-10 border-b border-gray-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-[11px] font-bold tracking-wider mb-4 border border-teal-100">
              <BookMarked size={14} /> 课程研读
            </div>
            <h2 className="text-3xl font-extrabold mt-0 mb-3">文献理解：避免陷入无底洞的选题盲区</h2>
            <p className="text-sm text-gray-400 font-medium tracking-wide">模块学习重点：如何评估综述文献综览量与自身承受边界</p>
          </div>
          
          <p>
            叙述性综述（Narrative Review）在提笔前，对**破孔（Gap）的界定**比什么都重要。初生牛犊最忌讳选择范围“无远弗届”的主题，那极易导致文献堆砌大赏。
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500"></div>
            <h4 className="text-indigo-900 font-bold mt-0 mb-4 flex items-center gap-2">
              <ListChecks size={20} /> The "Niche Down" 概念法则
            </h4>
            <p className="text-[14px] mt-0 text-gray-600 leading-relaxed">
               无论采用哪些搜索策略，你的文章都应当在某个特定场景下具有深挖价值。例如，针对非常前沿的机制分支、特殊罕见突变的小样本总结、亦或是同一靶点在不同疗法下表现差异。如果能用三句话内讲清楚你要探讨的问题，选题才算过关。<br/><br/>
               <strong className="text-indigo-800">💡 课堂小助手：如果您不确定，可以直接向右侧的伴读AI提问：“如何判断综述的选题是否过大？” 这正是 AI 通过知识底座所擅长解构的内容！</strong>
            </p>
          </div>

          <p>
            在确定了破孔区后，建立搜索基准同样关键。你必须从核心的国际指南和顶级综述中提炼出主流架构的演变历史，而不是只盯着低分流水线文章。
          </p>

          <div className="mt-16 flex flex-col items-center border-t border-gray-100 pt-10 pb-8">
            <p className="text-gray-500 text-sm mb-4 font-medium">确认已学习完上述理论知识？</p>
            <button onClick={onNext} className="bg-gray-900 hover:bg-teal-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg ring-1 ring-gray-900 hover:ring-teal-700 flex items-center gap-2 transform active:scale-95 transition-all">
              <CheckCircle2 size={18} /> 进入知识检验与测评
            </button>
          </div>
      </div>
    </div>
  )
}

function AssessmentView({ onNavigateToModule2 }: { onNavigateToModule2?: () => void }) {
  const [answered, setAnswered] = useState(false);
  const [showPersona, setShowPersona] = useState(false);

  const handleCorrect = () => {
    setAnswered(true);
    setTimeout(() => setShowPersona(true), 1500);
  }

  return (
    <div className="p-8 mx-auto w-full max-w-5xl h-full flex flex-col relative justify-center overflow-y-auto">
       <AnimatePresence>
         {!showPersona ? (
           <motion.div exit={{ opacity: 0, x: -50, filter: "blur(4px)" }} className="bg-white border text-left border-gray-200 rounded-[28px] p-10 shadow-sm max-w-3xl mx-auto w-full">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
               <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
                 <LocateFixed size={22} /> 阶段性试练：场景判断
               </div>
               <span className="text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-md">基于刚刚的伴学知识</span>
             </div>

             <h3 className="text-[17px] font-bold text-gray-900 mb-8 leading-relaxed">
               某学生提交了这样一个综述立项：“分析近十年来所有针对 PD-1 及 VEGFR 等多靶点在各类晚期实体瘤的大型回顾综述”，从结构化角度来看，它最致命的立项误区是什么？
             </h3>

             <div className="space-y-4">
               <button onClick={handleCorrect} disabled={answered} className={cn("w-full text-left p-4 border-2 rounded-xl transition-all duration-300 relative text-[15px]", answered ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium" : "border-gray-200 hover:border-indigo-300 hover:bg-slate-50 text-gray-700")}>
                  A. 题目视角过于宏大而不聚焦，极容易导致只进行文献层面的罗列而丢失深度。
                  {answered && <CheckCircle2 size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
               </button>
               <button disabled={answered} className={cn("w-full text-left p-4 border-2 rounded-xl transition-all text-[15px]", answered ? "border-gray-100 bg-gray-50 opacity-50" : "border-gray-200 hover:border-gray-300 text-gray-700")}>
                  B. 近十年的数据可能太少，找不到充分的支持材料进行佐证。
               </button>
               <button disabled={answered} className={cn("w-full text-left p-4 border-2 rounded-xl transition-all text-[15px]", answered ? "border-gray-100 bg-gray-50 opacity-50" : "border-gray-200 hover:border-gray-300 text-gray-700")}>
                  C. 这是具有重大影响力的写法，没有硬伤。
               </button>
             </div>
             
             {answered && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center text-sm font-bold text-emerald-600 bg-emerald-50/50 py-3 rounded-lg flex items-center justify-center gap-2">
                 <BrainCircuit size={18} /> 回答正确！AI Agent 正在进行双轨记忆 (Summary & Profile) 的同步刻录...
               </motion.div>
             )}
           </motion.div>
         ) : (
           <motion.div initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} className="w-full max-w-4xl mx-auto flex flex-col gap-6">
              
              <div className="bg-white border rounded-[24px] shadow-sm overflow-hidden border-teal-200">
                <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md relative z-10 ring-4 ring-white/5">
                    <UserCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 relative z-10 flex items-center justify-center gap-2">
                    <Activity size={24} className="text-emerald-400" /> AI 双轨画像已更新
                  </h2>
                  <p className="text-indigo-200 text-sm relative z-10 font-medium">系统已跨周期沉淀您的科研学习心智与行为习惯。</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Summary Memory Block */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative">
                      <div className="absolute -top-3 left-6 bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                        <BookMarked size={12} /> Memory: Summary
                      </div>
                      <h3 className="text-gray-900 font-bold mb-4 mt-2">学习过程与行为轨迹</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-gray-800">学习节点：</strong>顺利通关《文献理解与综述精读》。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-gray-800">攻克高频薄弱点：</strong>题目边界收敛测试表现优异。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-gray-800">问答探究倾向：</strong>高频查询实验设计场景对比。</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Profile Memory Block */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-100 text-indigo-800 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-200 flex items-center gap-1">
                        <BrainCircuit size={12} /> Memory: Profile
                      </div>
                      <h3 className="text-gray-900 font-bold mb-4 mt-2">科研特质与能力推演</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                            <span>肿瘤免疫·文献洞察分位</span> <span className="text-emerald-500">+15% ↑</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div initial={{ width: "20%" }} animate={{ width: "35%" }} transition={{ duration: 1.5, delay: 0.5 }} className="bg-indigo-500 h-full rounded-full" />
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-medium">目标: 顶刊综述发表</span>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-medium">交流偏好: 底层逻辑解析</span>
                          <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 font-medium">当前短板: 架构生成</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to action connecting to Module 2 */}
                  <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-inner">
                     <Presentation size={32} className="text-teal-600 mb-3" />
                     <h3 className="text-teal-900 font-bold mb-2">学习闭环完成！实战衔接推荐</h3>
                     <p className="text-teal-700/80 text-sm leading-relaxed mb-6">
                       系统综合评定：您已具备极佳的综述选题评估眼光。系统建议立即将记忆力转化为生产力。
                     </p>
                     <button onClick={onNavigateToModule2} className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 font-medium px-8 py-3.5 rounded-xl w-full flex justify-center items-center gap-2 transform active:scale-95 transition-all text-sm">
                       开启【模块2：述评综述写作场景】 <ArrowRight size={16} />
                     </button>
                  </div>
                </div>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}
