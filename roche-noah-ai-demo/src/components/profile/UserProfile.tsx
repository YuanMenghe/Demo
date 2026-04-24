import { motion } from 'framer-motion';
import { User, Activity, BookOpen, Target, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const capabilityData = [
  { subject: '研究设计与假说设立', A: 85, fullMark: 100 },
  { subject: '文献检索与阅读', A: 65, fullMark: 100 },
  { subject: '数据分析能力', A: 45, fullMark: 100 },
  { subject: 'SCI写作与表达', A: 70, fullMark: 100 },
  { subject: '统计学方法掌握', A: 55, fullMark: 100 },
  { subject: '临床试验规范(GCP)', A: 90, fullMark: 100 },
];

export function UserProfile() {
  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8 flex flex-col gap-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <User className="text-indigo-600" size={32} />科研学习画像
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">系统自动记录您的学习路径、测评表现与兴趣方向，为您生成动态更新的专属画像与推荐策略。</p>
          </div>
          <button className="bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm text-sm">
            调整我的目标方向
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Memory (Static details) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Target size={18} className="text-indigo-500" /> 研究兴趣与目标
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">主要研究领域</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium">肿瘤学 (Oncology)</span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium">临床药学</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">当前科研阶段</div>
                  <div className="text-sm font-bold text-gray-700">主治医师 / 独立带组初期</div>
                </div>
                <div className="pt-3 border-t border-gray-50">
                  <div className="text-xs text-gray-400 mb-2">已掌握技能</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['文献检索基础', '基础统计学 (SPSS)', '伦理审批流程'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-md text-white relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
               <h3 className="font-bold text-indigo-50 flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-300" /> 智能推荐策略
               </h3>
               <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                 根据您的能力雷达，系统检测到您的 <strong className="text-white">数据分析能力</strong> 和 <strong className="text-white">统计学方法</strong> 为当前短板环节。
               </p>
               <button className="w-full bg-white text-indigo-700 font-bold py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-1.5 text-sm">
                 一键生成专属补强计划 <ChevronRight size={16} />
               </button>
            </div>
          </motion.div>

          {/* Activity Memory (Dynamic learning data) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
                   <TrendingUp size={18} className="text-emerald-500" /> 能力雷达评测
                 </h3>
                 <div className="h-[220px] -mx-4 -mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={capabilityData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="User" dataKey="A" stroke="#4f46e5" strokeWidth={2} fill="#4f46e5" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                   <Activity size={18} className="text-orange-500" /> 学习路线与数据
                 </h3>
                 <div className="flex-1 flex flex-col justify-center space-y-5">
                   <div>
                     <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">已完成课程体系</span><span className="font-bold text-gray-900">4 / 12</span></div>
                     <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400 w-1/3 rounded-full"></div></div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">案例演练得分均值</span><span className="font-bold text-gray-900">76 分</span></div>
                     <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 w-[76%] rounded-full"></div></div>
                   </div>
                   <div className="pt-2">
                     <span className="text-xs text-gray-400 block mb-2">高频问答主题标签</span>
                     <div className="flex gap-2 flex-wrap">
                       <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">R语言基础</span>
                       <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">倾向性评分</span>
                       <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">盲法设计</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                 <BookOpen size={18} className="text-blue-500" /> 最近学习轨迹 (Memory Summary)
               </h3>
               <div className="space-y-0 pl-2">
                 {[
                   { date: '今天', desc: '在实战演练中完成了「临床预测模型」课题，并针对假说设立请求了 3 次 AI 辅导。得分: 85。', highlight: true },
                   { date: '3天前', desc: '浏览了「GCP 规范与伦理审查」相关课程文献。', highlight: false },
                   { date: '1周前', desc: '高频询问 "前瞻性队列研究与回顾性队列研究的统计效能差异"。系统已将其记为薄弱点并推荐了专项补习文章。', highlight: false },
                 ].map((hist, i) => (
                   <div key={i} className="flex gap-4 relative py-3 group">
                     {i !== 2 && <div className="absolute left-[5px] top-6 bottom-[-10px] w-0.5 bg-gray-100"></div>}
                     <div className={cn("w-3 h-3 rounded-full shrink-0 mt-1.5 relative z-10", hist.highlight ? "bg-indigo-500 ring-4 ring-indigo-50" : "bg-gray-300 group-hover:bg-gray-400 transition-colors")} />
                     <div>
                       <span className="text-xs font-bold text-gray-400 block mb-0.5">{hist.date}</span>
                       <p className="text-sm text-gray-700 leading-relaxed">{hist.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
