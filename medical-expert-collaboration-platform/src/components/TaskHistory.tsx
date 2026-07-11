import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';

export default function TaskHistory() {
  const historyTasks = [
    {
      id: 'T-2023-082',
      title: '复杂病例循证论证 (罕见病合并用药)',
      difficulty: 'C5',
      date: '2023-10-24',
      quality: 'Q5',
      basePrice: 3300,
      multiplier: 1.5,
      finalPrice: 4950,
      status: 'paid',
    },
    {
      id: 'T-2023-075',
      title: '指南 Agent 事实核查',
      difficulty: 'C2',
      date: '2023-10-22',
      quality: 'Q4',
      basePrice: 40,
      multiplier: 1.2,
      finalPrice: 48,
      status: 'paid',
    },
    {
      id: 'T-2023-068',
      title: '心血管临床数据库字段审查',
      difficulty: 'C2',
      date: '2023-10-18',
      quality: 'Q3',
      basePrice: 40,
      multiplier: 1.0,
      finalPrice: 40,
      status: 'pending',
    },
    {
      id: 'T-2023-061',
      title: '科研项目基础信息标准化',
      difficulty: 'C1',
      date: '2023-10-15',
      quality: 'Q3',
      basePrice: 12,
      multiplier: 1.0,
      finalPrice: 12,
      status: 'paid',
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">结算与历史记录</h2>
        <p className="text-sm text-slate-500 mt-1">查看已完成任务的质量评级与劳务结算情况</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1 mb-2">
            <DollarSign size={14} className="text-slate-400" />
            累计税前收入
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">¥ 12,850</span>
            <span className="text-xs text-slate-500">.00</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1 mb-2">
            <Clock size={14} className="text-slate-400" />
            待结算金额
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-blue-600">¥ 40</span>
            <span className="text-xs text-slate-500">.00</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1 mb-2">
            <CheckCircle2 size={14} className="text-slate-400" />
            已完成任务
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">42</span>
            <span className="text-xs text-slate-500">个</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1 mb-2">
            <TrendingUp size={14} className="text-slate-400" />
            历史优质率 (Q4/Q5)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-noah-600">85</span>
            <span className="text-xs text-slate-500">%</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">任务明细</h3>
          <button className="text-xs text-noah-600 font-medium hover:underline">下载对账单</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-white text-slate-500 border-b border-slate-200 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">完成日期</th>
                <th className="px-6 py-3 font-semibold">任务信息</th>
                <th className="px-6 py-3 font-semibold text-center">难度</th>
                <th className="px-6 py-3 font-semibold text-center">质量评级</th>
                <th className="px-6 py-3 font-semibold text-right">结算金额 (税前)</th>
                <th className="px-6 py-3 font-semibold text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {historyTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {task.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 mb-0.5">{task.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{task.id}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                      {task.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {task.quality === 'Q5' && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-noah-50 text-noah-700 rounded font-bold text-xs"><Award size={12}/> Q5 卓越</span>}
                    {task.quality === 'Q4' && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-xs">Q4 优质</span>}
                    {task.quality === 'Q3' && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-xs">Q3 合格</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-900">¥ {task.finalPrice}</div>
                    <div className="text-[10px] text-slate-400">
                      基准 {task.basePrice} × {task.multiplier}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {task.status === 'paid' ? (
                      <span className="text-xs font-medium text-green-600">已打款</span>
                    ) : (
                      <span className="text-xs font-medium text-orange-500">待结算</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-center">
          <button className="text-xs text-slate-500 hover:text-slate-800 transition-colors">加载更多记录</button>
        </div>
      </div>
    </div>
  );
}
