import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChevronDown, Activity, Clock, PieChart, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const trendData = [
  { year: '2020', count: 2 },
  { year: '2021', count: 4 },
  { year: '2022', count: 8 },
  { year: '2023', count: 5 },
  { year: '2024', count: 5 },
  { year: '2025', count: 8 }
];

export function TopicView({ onNext }: { onNext: () => void }) {
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [showLiterature, setShowLiterature] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasResults(true);
    }, 1500);
  };

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-3xl mx-auto text-center px-4">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
           <h1 className="text-4xl font-extrabold text-[#1a237e] mb-4 flex items-center justify-center gap-3">
             智能选题 <Sparkles size={28} className="text-indigo-400" />
           </h1>
           <p className="text-gray-500 text-lg">智能推荐科研选题，深度挖掘文献证据，助力科学选题决策</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-full relative">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-2 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-indigo-100 transition-all focus-within:border-indigo-400">
             <textarea 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="请最多输入3个英文选题关键词，并用分号隔开。如: cancer; medical; treatment"
               className="w-full min-h-[100px] resize-none border-none outline-none p-4 text-gray-800 text-[15px]"
             />
             <div className="px-4 pb-3 flex justify-between items-center border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer border border-gray-200 transition-colors">
                   <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-1 text-[10px] font-bold">DS</div>
                   DeepSeek <ChevronDown size={14} />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching || !query}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                >
                  {isSearching ? <Activity size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
             </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-full mt-12 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-left">
           <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
             <Clock size={16} className="text-gray-400" /> <span className="font-bold text-gray-700">选题历史</span>
           </div>
           <div>
             {[
               { q: '阿米卡星治疗药物监测 (TDM)', date: '2026-04-20 18:41:02' },
               { q: 'ai drug breast cancer', date: '2025-11-10 18:13:53' },
             ].map((item, i) => (
               <div 
                 key={i} 
                 className="flex justify-between items-center px-6 py-4 border-b border-gray-50 hover:bg-slate-50 cursor-pointer group"
                 onClick={() => {
                   setQuery(item.q);
                   setIsSearching(true);
                   setTimeout(() => {
                     setIsSearching(false);
                     setHasResults(true);
                   }, 1500);
                 }}
               >
                 <div className="flex items-center gap-3">
                   <Search size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                   <span className="text-sm font-medium text-indigo-900/80">{item.q}</span>
                 </div>
                 <span className="text-xs text-gray-400">{item.date}</span>
               </div>
             ))}
           </div>
        </motion.div>
      </div>
    );
  }

  if (showLiterature) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex justify-between items-center">
          <div className="min-w-0">
            <div className="text-xs font-bold text-indigo-500 mb-1">选题内文献挖掘</div>
            <h2 className="text-lg font-bold text-indigo-900 truncate">人工智能算法优化阿米卡星 TDM 采样时间点的前瞻性验证</h2>
            <p className="text-xs text-gray-500 mt-1">该页面属于“选题与文献挖掘”同一功能模块，证据结果将随选题上下文进入后续 Synopsis。</p>
          </div>
          <button onClick={() => setShowLiterature(false)} className="text-sm font-medium text-gray-500 hover:text-indigo-600">
            返回选题列表
          </button>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr] gap-6 min-h-0 flex-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">证据检索与筛选</h3>
                <p className="text-xs text-gray-500 mt-1">围绕已选方向自动检索 PubMed，支持按发表时间与影响因子排序。</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">近5年 · 23篇</span>
            </div>
            <div className="p-4 border-b border-gray-100 grid grid-cols-3 gap-3">
              {['发表时间：近5年', '影响因子：优先高分', '研究类型：临床研究'].map((item) => (
                <button key={item} className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-medium text-gray-600 hover:border-indigo-200 hover:bg-indigo-50">
                  {item}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                ['Population pharmacokinetic model of amikacin in critically ill patients', 'PMID: 38402191', 'TDM 个体化给药模型可显著降低谷浓度超标风险。'],
                ['Optimal sampling strategy for aminoglycoside therapeutic monitoring', 'PMID: 37955218', '早期双点采样可改善 AUC 估计稳定性。'],
                ['Machine learning assisted dose adjustment for anti-infective therapy', 'PMID: 37140882', '机器学习模型适合嵌入前瞻性验证流程。'],
              ].map(([title, pmid, insight]) => (
                <article key={pmid} className="rounded-xl border border-gray-100 p-4 hover:border-indigo-200 hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-gray-900 leading-snug">{title}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>{pmid}</span>
                    <span>IF 6.8</span>
                    <span>2024</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{insight}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 min-h-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3">研究重点与难点分析</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                  <strong className="text-indigo-800">重点：</strong> 明确 AI 采样策略相较传统 TDM 的剂量调整收益。
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <strong className="text-amber-800">难点：</strong> 需要控制感染严重程度、肾功能变化和联合用药干扰。
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <strong className="text-emerald-800">Synopsis 输入：</strong> 已形成 P/I/C/O/S 草案，可进入独立 Synopsis 设计模块细化。
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-1 min-h-[240px] flex flex-col">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-[15px]">
                <FileText size={16} className="text-gray-400" /> PICOS 明确度预览
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {[
                  ['P', '重症感染且需阿米卡星治疗药物监测的住院患者'],
                  ['I', 'AI 辅助 TDM 采样时间点与剂量调整策略'],
                  ['C', '传统经验采样或常规 TDM 流程'],
                  ['O', '目标浓度达标率、肾毒性、安全性与住院结局'],
                  ['S', '前瞻性验证研究'],
                ].map(([key, value]) => (
                  <div key={key} className="flex gap-3 rounded-lg bg-slate-50 border border-slate-100 p-2.5">
                    <span className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={onNext} className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-bold shadow-md shadow-indigo-200">
                进入独立 Synopsis 设计 <Sparkles size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // HAS RESULTS VIEW
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-6">
       {/* Top Bar matching design */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1 min-w-0">
             <span className="text-sm text-gray-500 font-medium whitespace-nowrap shrink-0">您的选题是：</span>
             <h2 className="text-lg font-bold text-indigo-600 truncate">{query || '阿米卡星治疗药物监测 (TDM)'}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500">统计时间</span>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 outline-none">
              <option>5年</option>
            </select>
          </div>
       </div>

       <div className="flex-1 min-h-0 flex gap-6">
         {/* Left col: Topics List */}
         <div className="w-[45%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-indigo-50/50 to-transparent">
              <Sparkles size={18} className="text-indigo-600" />
              <div>
                <h3 className="font-bold text-gray-900">选题推荐</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">已为您生成 10 个选题，模型已优化匹配</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
               {[
                 { title: '基于群体药代动力学的阿米卡星个体化给药模型构建', en: 'Construction of Personalized Dosing Model for Amikacin Based on Population Pharmacokinetics' },
                 { title: '重症感染患者中阿米卡星治疗药物监测与临床结局的关联性研究', en: 'Association Between Amikacin Therapeutic Drug Monitoring and Clinical Outcomes in Critically Ill Patients...' },
                 { title: '人工智能算法优化阿米卡星TDM采样时间点的前瞻性验证', en: 'Prospective Validation of Artificial Intelligence Algorithms for Optimizing Amikacin TDM Sampling Time Points', active: true },
                 { title: '新生儿脓毒症中阿米卡星暴露-反应关系及毒性阈值研究', en: 'Exposure-Response Relationship and Toxicity Threshold of Amikacin in Neonatal Sepsis' },
               ].map((topic, i) => (
                 <div key={i} className={cn(
                   "p-4 rounded-xl border relative transition-all group",
                   topic.active ? "border-indigo-400 shadow-[0_4px_20px_rgba(79,70,229,0.1)] bg-indigo-50/20" : "border-gray-100 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer"
                 )}>
                   <div className="flex items-start gap-3 relative z-10">
                     <span className={cn(
                       "text-lg font-black italic mt-0.5 opacity-50",
                       topic.active ? "text-indigo-600" : "text-gray-300 group-hover:text-indigo-300"
                     )}>{i + 1}</span>
                     <div>
                       <h4 className={cn("text-[15px] font-bold leading-tight mb-1.5", topic.active ? "text-indigo-900" : "text-gray-800")}>{topic.title}</h4>
                       <p className="text-xs text-gray-400 line-clamp-1">{topic.en}</p>
                       <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-[2px]">
                           {['P','I','C','O','S'].map(l => (
                             <span key={l} className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">{l}</span>
                           ))}
                         </div>
                          {topic.active && (
                            <button onClick={() => setShowLiterature(true)} className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm">
                              查看文献证据 
                            </button>
                          )}
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Right col: Charts */}
         <div className="flex-1 flex flex-col gap-6 min-h-0">
            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col shrink-0">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-[15px]">
                 <FileText size={16} className="text-gray-400" /> 证据地图 <span className="text-xs font-normal text-gray-400">(基于PubMed数据统计)</span>
               </h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-center">
                   <thead>
                     <tr className="text-gray-500 font-medium border-b border-gray-100">
                       <td className="py-2 text-left pl-2"></td>
                       <td className="py-2">预防与监测</td>
                       <td className="py-2">诊断与筛查</td>
                       <td className="py-2">治疗与管理</td>
                     </tr>
                   </thead>
                   <tbody className="text-gray-700">
                     {[
                       ['其他综述', '2', '-', '2'],
                       ['队列研究', '4', '-', '4'],
                       ['病例报告', '1', '-', '1'],
                     ].map((row, i) => (
                       <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors">
                         <td className="py-3 text-left pl-2 text-gray-500 text-xs font-medium">{row[0]}</td>
                         <td className="py-3"><span className="inline-block px-4 py-1 bg-indigo-50 text-indigo-700 rounded font-medium min-w-[32px]">{row[1]}</span></td>
                         <td className="py-3"><span className="inline-block px-4 py-1 bg-gray-50 text-gray-400 rounded min-w-[32px]">{row[2]}</span></td>
                         <td className="py-3"><span className="inline-block px-4 py-1 bg-indigo-50 text-indigo-700 rounded font-medium min-w-[32px]">{row[3]}</span></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex-1 flex flex-col min-h-[250px]">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-[15px]">
                 <PieChart size={16} className="text-gray-400" /> 年度发文趋势
               </h3>
               <p className="text-xs text-gray-500 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                 以 <strong className="text-indigo-600">阿米卡星治疗药物监测 (TDM)</strong> 为关键词搜索，最近5年的文献有 <strong className="text-indigo-600">23</strong> 篇。年均发文量 5 篇。2025 年达到年发文量顶峰 8 篇。
               </p>
               <div className="flex-1 w-[90%] mx-auto relative -mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                     />
                     <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
         </div>
       </div>
    </motion.div>
  );
}
