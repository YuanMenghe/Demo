import React from 'react';
import { ListChecks, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Checklists() {
  const categories = [
    {
      name: '研究科学性与社会价值',
      items: [
        '研究目的和目标是否明确且具有科学价值？',
        '研究设计是否科学合理，能否回答研究假设？',
        '样本量计算是否有统计学依据？'
      ]
    },
    {
      name: '受试者风险与获益',
      items: [
        '研究干预措施的风险是否已降至最低？',
        '预期的风险与预期的获益相比是否合理？',
        '是否有充分的不良事件监测和处理预案？'
      ]
    },
    {
      name: '知情同意过程',
      items: [
        '知情同意书的语言是否通俗易懂？',
        '是否充分说明了研究的自愿性和退出权利？',
        '隐私保护和数据保密措施是否明确告知？'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">审核要点清单管理</h1>
          <p className="text-slate-500 mt-1">自定义AI审查的规则框架与关注重点</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          新增审查维度
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((category, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <ListChecks size={18} className="text-[var(--color-primary)]" />
                {category.name}
              </h3>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] transition-colors"><Edit2 size={16} /></button>
                <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {category.items.map((item, i) => (
                <li key={i} className="px-5 py-3 flex justify-between items-start group hover:bg-slate-50 transition-colors">
                  <span className="text-sm text-slate-700 mt-0.5">{item}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-slate-400 hover:text-[var(--color-primary)]"><Edit2 size={14} /></button>
                    <button className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 bg-white border-t border-slate-100">
              <button className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium flex items-center gap-1">
                <Plus size={14} /> 添加审查要点
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
