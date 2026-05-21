import React from 'react';
import { ArrowLeft, GripVertical } from 'lucide-react';

export function SettingsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回工作台
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">系统与指南配置</h1>
          <p className="text-slate-500 mt-1">管理启用的指南库及其优先级顺序。</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800">已启用指南 (按优先级排序)</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {['CSCO 淋巴瘤诊疗指南 2023', 'NCCN B-Cell Lymphomas 2024 V1', 'ESMO Diffuse Large B-Cell Lymphoma'].map((item, i) => (
              <div key={i} className="p-4 flex items-center gap-3 hover:bg-slate-50 group cursor-move">
                <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{item}</p>
                </div>
                <div className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] rounded">
                  {i === 0 ? '主优先级' : '次级参考'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">更多指南库</h3>
          <div className="grid grid-cols-2 gap-3">
            {['WHO 造血与淋巴组织肿瘤分类 (2022)', 'Lugano 2014 分期标准', '中国临床肿瘤学会 (CSCO) 通则'].map((lib) => (
              <label key={lib} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-teal-200 cursor-pointer">
                <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                <span className="text-sm text-slate-700">{lib}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
