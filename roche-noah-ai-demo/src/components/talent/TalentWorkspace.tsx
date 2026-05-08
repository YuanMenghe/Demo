import { useState } from "react";
import {
  BookOpen,
  Target,
  BrainCircuit,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Send,
  Sparkles,
  Brain,
  ChevronDown,
  X,
  MessageCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";

const LEARNING_PLAN = [
  { id: 1, title: "文献检索与阅读方法论", type: "video", status: "completed", duration: "1.5h" },
  { id: 2, title: "靶向治疗与免疫治疗基础", type: "doc", status: "active", duration: "2.0h" },
  { id: 3, title: "随堂测验：机制理解", type: "quiz", status: "locked", duration: "15m" },
  { id: 4, title: "CDH-17 靶点前沿进展", type: "doc", status: "locked", duration: "1.0h" },
  { id: 5, title: "课题方向头脑风暴", type: "ai", status: "locked", duration: "30m" },
];

const completedCount = LEARNING_PLAN.filter((i) => i.status === "completed").length;
const activeItem = LEARNING_PLAN.find((i) => i.status === "active") ?? LEARNING_PLAN[0];

export function TalentWorkspace() {
  const [activeTab, setActiveTab] = useState("material");
  const [chatInput, setChatInput] = useState("");
  // 移动端：学习计划折叠/展开（顶部抽屉）
  const [planOpen, setPlanOpen] = useState(false);
  // 移动端：AI 教伴底部 Sheet
  const [tutorOpen, setTutorOpen] = useState(false);
  // PC/手机通用：术语点击 popover（替代不可用的 hover tooltip）
  const [termPopover, setTermPopover] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-full bg-slate-50 md:gap-4 md:p-4 overflow-hidden">
      {/* ================= 左栏：学习计划 ================= */}
      {/* PC: 固定左栏；手机：顶部可折叠卡片 */}
      <aside className="md:w-72 bg-white md:rounded-2xl border-b md:border border-gray-200 md:shadow-sm flex flex-col md:overflow-hidden shrink-0">
        {/* 折叠头：手机端可点击切换；PC 端常驻 */}
        <button
          type="button"
          onClick={() => setPlanOpen((v) => !v)}
          className="w-full text-left p-4 border-b border-gray-100 bg-gray-50/50 md:cursor-default"
          aria-expanded={planOpen}
        >
          <div className="flex items-center gap-2 mb-1">
            <Target size={18} className="text-teal-600" />
            <h2 className="font-semibold text-gray-900 border-none flex-1">个性化学习计划</h2>
            {/* 仅手机端显示进度 + 折叠箭头 */}
            <span className="md:hidden text-xs text-gray-500 font-medium">
              {completedCount}/{LEARNING_PLAN.length}
            </span>
            <ChevronDown
              size={18}
              className={cn(
                "md:hidden text-gray-400 transition-transform",
                planOpen && "rotate-180"
              )}
            />
          </div>
          <p className="text-xs text-gray-500">基于您的目标："肿瘤免疫新靶点研究"</p>

          {/* 当前章节摘要：手机折叠态时显示 */}
          {!planOpen && (
            <div className="mt-3 md:hidden text-sm text-gray-700">
              <span className="text-teal-600 font-medium">当前：</span>
              {activeItem.title}
            </div>
          )}

          <div className="mt-4 bg-white p-3 rounded-xl border border-teal-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-600 mb-1 tracking-wider">
                当前能力图谱
              </div>
              <div className="text-sm font-medium text-gray-800">靶点挖掘能力 L2</div>
            </div>
            <BrainCircuit size={24} className="text-teal-200" />
          </div>
        </button>

        {/* 学习节点列表：PC 常驻，手机展开时显示 */}
        <div
          className={cn(
            "md:flex-1 md:overflow-y-auto p-3 space-y-2",
            planOpen ? "block max-h-[60vh] overflow-y-auto" : "hidden md:block"
          )}
        >
          {LEARNING_PLAN.map((item, idx) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setPlanOpen(false)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 min-h-[60px] active:scale-[0.99]",
                item.status === "active"
                  ? "bg-teal-50 border-teal-200 shadow-sm"
                  : item.status === "completed"
                    ? "bg-white border-gray-200 hover:border-gray-300"
                    : "bg-gray-50 border-gray-100 opacity-70"
              )}
            >
              <div className="mt-0.5">
                {item.status === "completed" && (
                  <CheckCircle2 size={20} className="text-teal-500" />
                )}
                {item.status === "active" && (
                  <Circle size={20} className="text-teal-500 fill-teal-100" />
                )}
                {item.status === "locked" && <Circle size={20} className="text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "font-medium text-sm mb-1 truncate",
                    item.status === "active" ? "text-teal-900" : "text-gray-700"
                  )}
                >
                  {idx + 1}. {item.title}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {item.type === "video" && <PlayCircle size={12} />}
                    {item.type === "doc" && <FileText size={12} />}
                    {item.type === "quiz" && <BookOpen size={12} />}
                    {item.type === "ai" && <Sparkles size={12} />}
                    <span className="uppercase text-[10px]">{item.type}</span>
                  </span>
                  <span>{item.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= 中栏：内容阅读区 ================= */}
      <main className="flex-1 bg-white md:rounded-2xl md:border border-gray-200 md:shadow-sm flex flex-col overflow-hidden min-h-0">
        <div className="border-b border-gray-100 flex flex-col sm:flex-row sm:items-center px-4 py-3 sm:py-0 sm:h-14 gap-2 sm:gap-0 sm:justify-between bg-white relative z-10">
          <h2 className="font-semibold text-base sm:text-lg text-gray-800 flex items-center gap-2 min-w-0">
            <FileText size={20} className="text-teal-500 shrink-0" />
            <span className="truncate">靶向治疗与免疫治疗基础</span>
          </h2>
          <div className="flex bg-gray-100 p-1 rounded-lg shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("material")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all min-h-[36px]",
                activeTab === "material"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              学习资料
            </button>
            <button
              onClick={() => setActiveTab("graph")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 min-h-[36px]",
                activeTab === "graph"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Brain size={16} /> 知识图谱
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-8 pb-24 md:pb-8">
          {activeTab === "material" ? (
            <article className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-sm rounded-xl p-5 sm:p-10 prose prose-slate prose-teal prose-base">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                第二章：肿瘤免疫学机制
              </h1>
              <p className="text-gray-700 leading-relaxed mb-4 text-[15px] sm:text-base">
                肿瘤免疫治疗是通过重新启动并维持肿瘤-免疫循环，恢复机体正常的抗肿瘤免疫反应，从而控制与清除肿瘤的一种治疗方法。
              </p>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-8 mb-3">
                2.1 免疫检查点（Immune Checkpoints）
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-[15px] sm:text-base">
                免疫系统具有多重调节机制，以防止针对自体抗原的过度免疫激活。
                {/* 术语 popover：点击触发，PC/手机一致 */}
                <span className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setTermPopover((v) => !v)}
                    className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border-b border-amber-300 active:bg-amber-200 cursor-pointer"
                  >
                    CTLA-4 和 PD-1
                  </button>
                  {termPopover && (
                    <>
                      {/* 点击外部关闭遮罩 */}
                      <span
                        className="fixed inset-0 z-10"
                        onClick={() => setTermPopover(false)}
                      />
                      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-60 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-20 leading-relaxed block">
                        点击右下角 NOAH 教伴，可深入了解这两个靶点的区别与作用机制。
                      </span>
                    </>
                  )}
                </span>{" "}
                是目前研究最深入的两个免疫检查点受体。
              </p>
              <div className="my-8 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-lg">
                <p className="text-sm text-teal-800 font-medium m-0">
                  💡 知识点测试：通常来说，PD-1 主要在肿瘤微环境中抑制 T 细胞，而 CTLA-4
                  主要在淋巴结中发挥作用。
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed text-[15px] sm:text-base">
                在肿瘤微环境(TME)中，肿瘤细胞可以通过表达 PD-L1 来"劫持"这一机制，导致肿瘤特异性 T
                细胞耗竭...
              </p>
            </article>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="text-center text-gray-500 px-4">
                <BrainCircuit size={48} className="mx-auto text-teal-200 mb-4" />
                <p>基于 LightRAG 提取的知识图谱可视化区域</p>
                <p className="text-sm mt-2 opacity-70">在此处展示实体关联（PD-1 → 抑制 → T细胞）</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= 右栏：AI 教伴 ================= */}
      {/* PC: 固定右栏；手机：底部 Sheet（由 FAB 触发） */}
      <TutorPanel
        chatInput={chatInput}
        setChatInput={setChatInput}
        mobileOpen={tutorOpen}
        onMobileClose={() => setTutorOpen(false)}
      />

      {/* 移动端浮动按钮：召唤 AI 教伴 */}
      {!tutorOpen && (
        <button
          type="button"
          onClick={() => setTutorOpen(true)}
          className="md:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center active:scale-95 transition-transform"
          style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          aria-label="打开 NOAH 教伴"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" />
        </button>
      )}
    </div>
  );
}

interface TutorPanelProps {
  chatInput: string;
  setChatInput: (v: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function TutorPanel({ chatInput, setChatInput, mobileOpen, onMobileClose }: TutorPanelProps) {
  return (
    <>
      {/* 手机端遮罩 */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 animate-in fade-in"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          // 桌面端布局
          "md:relative md:w-[340px] md:h-auto md:rounded-2xl md:border md:shadow-sm md:translate-y-0 md:flex",
          // 手机端：固定底部 Sheet
          "fixed inset-x-0 bottom-0 z-50 h-[85vh] rounded-t-2xl border-t shadow-2xl bg-white border-gray-200 flex-col overflow-hidden shrink-0 transition-transform duration-300",
          mobileOpen ? "flex translate-y-0" : "translate-y-full md:flex md:translate-y-0"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* 拖拽指示条（仅手机） */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="h-14 border-b border-gray-100 flex items-center px-4 gap-2 bg-teal-50/50 shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900">NOAH 科研教伴</h3>
            <p className="text-[11px] text-teal-600 truncate">正在陪伴阅读《肿瘤免疫学机制》</p>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden w-9 h-9 -mr-1 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
            aria-label="关闭教伴"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 shrink-0 flex items-center justify-center mt-1">
              <Sparkles size={12} className="text-teal-600" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700">
              <p>
                你好！我们现在学习到了<strong>免疫检查点</strong>。需要我为你解释一下刚刚标记的{" "}
                <code>CTLA-4</code> 和 <code>PD-1</code> 在机制上的核心区别吗？
              </p>
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
                <li>
                  <strong>CTLA-4</strong> 就像是 T
                  细胞出征前的"新兵训练营教官"。它在淋巴结里工作，阻止 T 细胞一开始就被过度激活。
                </li>
                <li>
                  <strong>PD-1</strong> 就像是在前线（肿瘤微环境）的"急行军刹车"。它在战场上起作用，当
                  T 细胞打仗太累了，PD-1 会让它们休息（耗竭）。
                </li>
              </ul>

              <div className="bg-white border border-teal-100 rounded-lg p-3 mt-3 shadow-sm">
                <p className="text-xs font-semibold text-teal-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> 阶段性检查
                </p>
                <p className="text-sm font-medium mb-2">
                  如果科学家想要增强 T 细胞在<strong>淋巴结</strong>中的初始激活能力，应该优先针对哪个靶点？
                </p>
                <div className="space-y-1.5">
                  <button className="w-full text-left px-3 py-2.5 text-sm rounded-md border border-gray-200 hover:border-teal-400 hover:bg-teal-50 active:bg-teal-100 transition-colors min-h-[44px]">
                    A. PD-1
                  </button>
                  <button className="w-full text-left px-3 py-2.5 text-sm rounded-md border border-teal-500 bg-teal-50 text-teal-700 transition-colors flex items-center justify-between min-h-[44px]">
                    <span>B. CTLA-4</span>
                    <CheckCircle2 size={16} className="text-teal-500" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> 回答正确！靶点挖掘能力 +10 Exp
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="向教伴提问（输入 @ 触发资料检索）"
              className="w-full resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all min-h-[60px] md:min-h-[80px]"
            />
            <button className="absolute right-2 bottom-2 w-10 h-10 rounded-lg bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 active:scale-95 transition-all">
              <Send size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
