import React, { useState } from 'react';
import { Plus, Star, MoreVertical, Clock, FileText } from 'lucide-react';

const MOCK_PROJECTS = [
  { id: '1', name: '新型靶向药物治疗晚期肺癌的有效性与安全性研究', status: 'reviewing', updatedAt: '2026-03-25 10:30', docCount: 5, isFavorite: true },
  { id: '2', name: '基于深度学习的早期糖尿病视网膜病变筛查模型构建', status: 'pending', updatedAt: '2026-03-24 16:45', docCount: 3, isFavorite: false },
  { id: '3', name: '某院心血管内科住院患者抗菌药物使用合理性回顾性分析', status: 'completed', updatedAt: '2026-03-20 09:15', docCount: 2, isFavorite: false },
  { id: '4', name: '比较两种微创手术治疗腰椎间盘突出症的临床疗效', status: 'completed', updatedAt: '2026-03-15 14:20', docCount: 8, isFavorite: true },
];

export default function Projects({ navigateTo }: { navigateTo: (view: string, id?: string) => void }) {
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProjects(projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'reviewing': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">审查中</span>;
      case 'pending': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">待审查</span>;
      case 'completed': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">已完成</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">项目管理</h1>
          <p className="text-slate-500 mt-1">管理临床研究项目及相关审查材料</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-[var(--color-primary)]/20">
          <Plus size={18} />
          新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => navigateTo('project-detail', project.id)}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              {getStatusBadge(project.status)}
              <div className="flex items-center gap-1">
                <button onClick={(e) => toggleFavorite(e, project.id)} className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors">
                  <Star size={18} className={project.isFavorite ? "fill-amber-400 text-amber-400" : ""} />
                </button>
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug flex-1">
              {project.name}
            </h3>
            
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{project.updatedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText size={14} />
                <span>{project.docCount} 份文档</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
