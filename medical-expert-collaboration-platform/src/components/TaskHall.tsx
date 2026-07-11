import React from 'react';
import { Clock, Award, ChevronRight, FileText, Stethoscope } from 'lucide-react';
import { Task } from '../types';

const mockTasks: Task[] = [
  {
    id: 'T-2023-001',
    title: '非小细胞肺癌(NSCLC)真实世界研究方案结构化审查',
    category: '方案审查',
    type: '混合类',
    difficulty: 'C4',
    requiredLevel: 'S3',
    estimatedTime: '30—60分钟',
    basePrice: 600,
    description: '从研究基础、技术路线、样本与数据等维度审查，识别关键问题并提供风险等级和可执行建议。',
  },
  {
    id: 'T-2023-002',
    title: '最新心血管疾病指南问答标准化测试',
    category: '指南问答',
    type: '选择类',
    difficulty: 'C1',
    requiredLevel: 'S2',
    estimatedTime: '1—5分钟',
    basePrice: 8,
    description: '核对指南问答的格式和字段完整性，确认标准术语的使用。',
  },
  {
    id: 'T-2023-003',
    title: '抗体药物偶联物(ADC)临床试验数据库字段摘要提取',
    category: '数据提取',
    type: '混合类',
    difficulty: 'C2',
    requiredLevel: 'S2',
    estimatedTime: '5—10分钟',
    basePrice: 25,
    description: '补充简短摘要，完成标准化映射，识别明显缺失或基础条件不匹配。',
  },
  {
    id: 'T-2023-004',
    title: '罕见病基因治疗复杂病例循证论证',
    category: '病例分析',
    type: '开放式',
    difficulty: 'C5',
    requiredLevel: 'S5',
    estimatedTime: '1—3小时',
    basePrice: 3300,
    description: '系统性评审，识别隐藏风险和影响核心问题，形成结构化专家报告并提出替代路径。',
  },
  {
    id: 'T-2023-005',
    title: '乳腺癌IIT局部审查可行性评估',
    category: '伦理审查',
    type: '开放式',
    difficulty: 'C3',
    requiredLevel: 'S3',
    estimatedTime: '10—30分钟',
    basePrice: 180,
    description: '判断单个可行性模块，指出具体问题，提供简短理由、证据和修改建议。',
  },
];

export default function TaskHall() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">待领取的专家任务</h2>
          <p className="text-sm text-slate-500 mt-1">根据您的资质（S3），为您推荐以下待领取任务</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-noah-500 text-sm">
            <option>全部难度</option>
            <option>C1 - 简单判断</option>
            <option>C3 - 专业分析</option>
            <option>C5 - 系统性分析</option>
          </select>
          <button className="bg-noah-600 hover:bg-noah-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm">
            刷新任务
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockTasks.map((task) => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-5 card-hover relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-noah-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-noah-50 text-noah-600 flex items-center justify-center shrink-0">
                  {task.difficulty === 'C5' || task.difficulty === 'C4' ? <Stethoscope size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {task.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <Clock size={14} className="text-noah-600" />
                      <span>{task.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <Award size={14} className="text-noah-600" />
                      <span>最低资质: {task.requiredLevel}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <span>难度: <span className="font-medium text-slate-800">{task.difficulty}</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <span>类型: {task.type}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end shrink-0 pl-4 border-l border-slate-100">
                <span className="text-xs text-slate-400 font-medium uppercase mb-1">Q3基准报酬</span>
                <div className="text-2xl font-bold text-noah-600 mb-3 flex items-baseline">
                  <span className="text-sm mr-1">¥</span>{task.basePrice}
                </div>
                <button className="flex items-center gap-1 text-xs bg-noah-600 hover:bg-noah-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">
                  领取任务
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
