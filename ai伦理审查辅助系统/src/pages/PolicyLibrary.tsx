import React from 'react';
import { Book, Upload, Search } from 'lucide-react';

export default function PolicyLibrary() {
  const policies = [
    { id: 1, name: '涉及人的生命科学和医学研究伦理审查办法', agency: '国家卫健委等', date: '2023-02-18', type: '国内法规' },
    { id: 2, name: '药物临床试验质量管理规范 (GCP)', agency: '国家药监局', date: '2020-04-23', type: '国内法规' },
    { id: 3, name: '赫尔辛基宣言 (2013版)', agency: '世界医学大会', date: '2013-10-01', type: '国际准则' },
    { id: 4, name: '本院临床研究伦理审查SOP_v3.0', agency: '本院伦理委员会', date: '2025-01-10', type: '院内制度' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">政策法规库</h1>
          <p className="text-slate-500 mt-1">管理AI审查依据，支持自定义上传本院规范</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Upload size={18} />
          上传政策文件
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-80 focus-within:border-[var(--color-primary)] transition-colors">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="搜索法规名称..." className="border-none outline-none ml-2 text-sm w-full" />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-[var(--color-primary)] transition-colors">
            <option>所有类型</option>
            <option>国内法规</option>
            <option>国际准则</option>
            <option>院内制度</option>
          </select>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium">文件名称</th>
              <th className="p-4 font-medium">发布机构</th>
              <th className="p-4 font-medium">发布/生效日期</th>
              <th className="p-4 font-medium">类型</th>
              <th className="p-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {policies.map(policy => (
              <tr key={policy.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                  <Book size={16} className="text-[var(--color-primary)]" />
                  {policy.name}
                </td>
                <td className="p-4 text-slate-600">{policy.agency}</td>
                <td className="p-4 text-slate-500">{policy.date}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{policy.type}</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm">查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
