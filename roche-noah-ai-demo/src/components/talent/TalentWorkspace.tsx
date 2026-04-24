import { useState } from "react";
import { 
  BookOpen, 
  Target, 
  BrainCircuit, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  FileText,
  Send,
  MessageSquare,
  Sparkles,
  BarChart,
  Brain
} from "lucide-react";
import { cn } from "../../lib/utils";

const LEARNING_PLAN = [
  { id: 1, title: "文献检索与阅读方法论", type: "video", status: "completed", duration: "1.5h" },
  { id: 2, title: "靶向治疗与免疫治疗基础", type: "doc", status: "active", duration: "2.0h" },
  { id: 3, title: "随堂测验：机制理解", type: "quiz", status: "locked", duration: "15m" },
  { id: 4, title: "CDH-17 靶点前沿进展", type: "doc", status: "locked", duration: "1.0h" },
  { id: 5, title: "课题方向头脑风暴", type: "ai", status: "locked", duration: "30m" },
];

export function TalentWorkspace() {
  const [activeTab, setActiveTab] = useState('material');
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="flex h-full bg-slate-50 gap-4 p-4 overflow-hidden">
      
        {/* Left Panel: Learning Path */}
      <div className="w-72 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-1">
            <Target size={18} className="text-teal-600" />
            <h2 className="font-semibold text-gray-900 border-none">个性化学习计划</h2>
          </div>
          <p className="text-xs text-gray-500">基于您的目标："肿瘤免疫新靶点研究"</p>
          
          <div className="mt-4 bg-white p-3 rounded-xl border border-teal-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-600 mb-1 tracking-wider">当前能力图谱</div>
              <div className="text-sm font-medium text-gray-800">靶点挖掘能力 L2</div>
            </div>
            <BrainCircuit size={24} className="text-teal-200" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {LEARNING_PLAN.map((item, idx) => (
            <div 
              key={item.id}
              className={cn(
                "p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3",
                item.status === 'active' ? "bg-teal-50 border-teal-200 shadow-sm" : 
                item.status === 'completed' ? "bg-white border-gray-200 hover:border-gray-300" : 
                "bg-gray-50 border-gray-100 opacity-60"
              )}
            >
              <div className="mt-0.5">
                {item.status === 'completed' && <CheckCircle2 size={18} className="text-teal-500" />}
                {item.status === 'active' && <Circle size={18} className="text-teal-500 fill-teal-100" />}
                {item.status === 'locked' && <Circle size={18} className="text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium text-sm mb-1 truncate",
                  item.status === 'active' ? "text-teal-900" : "text-gray-700"
                )}>
                  {idx + 1}. {item.title}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {item.type === 'video' && <PlayCircle size={12} />}
                    {item.type === 'doc' && <FileText size={12} />}
                    {item.type === 'quiz' && <BookOpen size={12} />}
                    {item.type === 'ai' && <Sparkles size={12} />}
                    <span className="uppercase text-[10px]">{item.type}</span>
                  </span>
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel: Content Viewer */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="h-14 border-b border-gray-100 flex items-center px-4 justify-between bg-white relative z-10">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <FileText size={20} className="text-teal-500" />
            靶向治疗与免疫治疗基础
          </h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('material')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'material' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              学习资料
            </button>
            <button 
              onClick={() => setActiveTab('graph')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5", activeTab === 'graph' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              <Brain size={16} /> 知识图谱
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
          {activeTab === 'material' ? (
            <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-sm rounded-xl p-10 prose prose-slate prose-teal">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">第二章：肿瘤免疫学机制</h1>
              <p className="text-gray-700 leading-relaxed mb-4">
                肿瘤免疫治疗是通过重新启动并维持肿瘤-免疫循环，恢复机体正常的抗肿瘤免疫反应，从而控制与清除肿瘤的一种治疗方法。
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-3">2.1 免疫检查点（Immune Checkpoints）</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                免疫系统具有多重调节机制，以防止针对自体抗原的过度免疫激活。<span className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded cursor-help relative group border-b border-amber-300">CTLA-4 和 PD-1
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                    点击右侧 AI 伴读了解更多关于这两个靶点的区别
                  </span>
                </span> 是目前研究最深入的两个免疫检查点受体。
              </p>
              <div className="my-8 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-lg">
                <p className="text-sm text-teal-800 font-medium m-0">
                  💡 知识点测试：通常来说，PD-1 主要在肿瘤微环境中抑制 T 细胞，而 CTLA-4 主要在淋巴结中发挥作用。
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                在肿瘤微环境(TME)中，肿瘤细胞可以通过表达 PD-L1 来"劫持"这一机制，导致肿瘤特异性 T 细胞耗竭...
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="text-center text-gray-500">
                <BrainCircuit size={48} className="mx-auto text-teal-200 mb-4" />
                <p>基于 LightRAG 提取的知识图谱可视化区域</p>
                <p className="text-sm mt-2 opacity-70">在此处展示实体关联（PD-1 → 抑制 → T细胞）</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: AI Tutor Chat */}
      <div className="w-[340px] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0 relative">
        <div className="h-14 border-b border-gray-100 flex items-center px-4 gap-2 bg-teal-50/50">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-900">NOAH 科研教伴</h3>
            <p className="text-[11px] text-teal-600">正在陪伴阅读《肿瘤免疫学机制》</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 shrink-0 flex items-center justify-center mt-1">
              <Sparkles size={12} className="text-teal-600" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700">
              <p>你好！我们现在学习到了**免疫检查点**。需要我为你解释一下刚刚标记的 <code>CTLA-4</code> 和 <code>PD-1</code> 在机制上的核心区别吗？</p>
            </div>
          </div>
          
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-teal-500 shrink-0 flex items-center justify-center mt-1 text-white text-xs font-bold">
              U
            </div>
            <div className="flex-1 bg-teal-500 text-white rounded-2xl rounded-tr-none p-3 text-sm">
              <p>可以的，尽量用通俗的语言解释，我刚接触这个领域。</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 shrink-0 flex items-center justify-center mt-1">
              <Sparkles size={12} className="text-teal-600" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700 space-y-3">
              <p>没问题！打个比方：</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>CTLA-4</strong> 就像是 T 细胞出征前的“新兵训练营教官”。它在淋巴结里工作，阻止 T 细胞一开始就被过度激活。</li>
                <li><strong>PD-1</strong> 就像是在前线（肿瘤微环境）的“急行军刹车”。它在战场上起作用，当 T 细胞打仗太累了，PD-1 会让它们休息（耗竭）。</li>
              </ul>
              
              <div className="bg-white border border-teal-100 rounded-lg p-3 mt-3 shadow-sm">
                <p className="text-xs font-semibold text-teal-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> 阶段性检查
                </p>
                <p className="text-sm font-medium mb-2">如果科学家想要增强 T 细胞在**淋巴结**中的初始激活能力，应该优先针对哪个靶点？</p>
                <div className="space-y-1.5">
                  <button className="w-full text-left px-3 py-2 text-xs rounded-md border border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition-colors">
                    A. PD-1
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs rounded-md border border-teal-500 bg-teal-50 text-teal-700 transition-colors flex items-center justify-between">
                    <span>B. CTLA-4</span>
                    <CheckCircle2 size={14} className="text-teal-500" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> 回答正确！靶点挖掘能力 +10 Exp
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-gray-100">
          <div className="relative">
            <textarea 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="向教伴提问（输入 @ 触发资料检索）"
              className="w-full resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all min-h-[80px]"
            />
            <button className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
