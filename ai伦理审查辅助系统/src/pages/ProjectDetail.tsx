import React, { useState } from 'react';
import { ArrowLeft, Upload, Play, FileText, CheckCircle2, AlertTriangle, Clock, Activity, FileSearch, Edit2, MessageSquarePlus, Download, Trash2, CheckSquare, Square } from 'lucide-react';

const MOCK_DOCS = [
  { id: 'd1', name: '临床研究方案_v1.0.pdf', type: '研究方案', date: '2026-03-20', size: '2.4 MB', status: 'reviewed' },
  { id: 'd2', name: '知情同意书_成人版_v1.0.docx', type: '知情同意书', date: '2026-03-20', size: '1.1 MB', status: 'reviewed' },
  { id: 'd3', name: '受试者招募广告_v1.0.jpg', type: '招募材料', date: '2026-03-21', size: '0.8 MB', status: 'pending' },
  { id: 'd4', name: '临床研究方案_v1.1_修改版.pdf', type: '研究方案', date: '2026-03-25', size: '2.5 MB', status: 'pending' },
];

const INITIAL_RISKS = [
  {
    id: 'r1',
    title: 'V1.1 修改版提交',
    date: '2026-03-25',
    type: 'low',
    content: '新版方案增加了对不良事件的监测频率（由每月一次改为每周一次），并明确了紧急破盲机制。受试者保护措施得到显著加强，整体风险-获益比趋于有利。',
    isEdited: false
  },
  {
    id: 'r2',
    title: '初始审查 (V1.0)',
    date: '2026-03-20',
    type: 'high',
    content: '靶向药物存在已知的心血管毒性风险，但方案中缺乏针对性的监测计划。预期获益明确，但当前风险控制措施不足。',
    isEdited: false
  }
];

export default function ProjectDetail({ projectId, navigateTo }: { projectId: string, navigateTo: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState('docs');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);

  // 动态风险评估状态
  const [riskAssessments, setRiskAssessments] = useState(INITIAL_RISKS);
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [editRiskContent, setEditRiskContent] = useState('');
  const [newRiskInput, setNewRiskInput] = useState('');
  const [selectedRiskDocs, setSelectedRiskDocs] = useState<string[]>([]);
  const [isGeneratingRisk, setIsGeneratingRisk] = useState(false);

  const toggleDocSelection = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleRiskDocSelection = (id: string) => {
    setSelectedRiskDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleStartReview = () => {
    if (selectedDocs.length === 0) return;
    setIsReviewing(true);
    setTimeout(() => {
      setIsReviewing(false);
      setActiveTab('tasks');
    }, 2000);
  };

  const handleGenerateRisk = () => {
    if (!newRiskInput.trim() && selectedRiskDocs.length === 0) return;
    setIsGeneratingRisk(true);
    setTimeout(() => {
      const docNames = selectedRiskDocs.map(id => MOCK_DOCS.find(d => d.id === id)?.name).join('、');
      const docText = docNames ? `关联文档：${docNames}。\n` : '';
      const inputStr = newRiskInput.trim() ? `补充信息：“${newRiskInput}”。\n` : '';

      const newRisk = {
        id: `r${Date.now()}`,
        title: '补充动态信息评估',
        date: new Date().toISOString().split('T')[0],
        type: 'low',
        content: `基于${docText}${inputStr}AI分析：该补充信息进一步完善了受试者保护机制，当前风险控制措施有效，整体风险-获益比保持有利。`,
        isEdited: false
      };
      setRiskAssessments([newRisk, ...riskAssessments]);
      setNewRiskInput('');
      setSelectedRiskDocs([]);
      setIsGeneratingRisk(false);
    }, 1500);
  };

  const startEditingRisk = (risk: any) => {
    setEditingRiskId(risk.id);
    setEditRiskContent(risk.content);
  };

  const saveRiskEdit = (id: string) => {
    setRiskAssessments(prev => prev.map(r => 
      r.id === id ? { ...r, content: editRiskContent, isEdited: true } : r
    ));
    setEditingRiskId(null);
  };

  const deleteRisk = (id: string) => {
    setRiskAssessments(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigateTo('projects')}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[var(--color-primary)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          返回项目列表
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">新型靶向药物治疗晚期肺癌的有效性与安全性研究</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Clock size={14}/> 立项时间: 2026-03-20</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">干预性研究</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 shrink-0">
        {[
          { id: 'docs', label: '文档管理', icon: FileText },
          { id: 'tasks', label: '审查任务与记录', icon: FileSearch },
          { id: 'risk', label: '动态风险-获益评估', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors text-sm font-medium ${
              activeTab === tab.id 
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-10">
        {activeTab === 'docs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <Upload size={16} />
                  上传文档
                </button>
                {selectedDocs.length > 0 && (
                  <button 
                    onClick={handleStartReview}
                    disabled={isReviewing}
                    className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isReviewing ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
                    发起AI审查 ({selectedDocs.length})
                  </button>
                )}
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                  </th>
                  <th className="p-4 font-medium">文档名称</th>
                  <th className="p-4 font-medium">文档类型</th>
                  <th className="p-4 font-medium">上传时间</th>
                  <th className="p-4 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DOCS.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleDocSelection(doc.id)}
                        className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                      />
                    </td>
                    <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                      <FileText size={16} className="text-slate-400" />
                      {doc.name}
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs">{doc.type}</span>
                    </td>
                    <td className="p-4 text-slate-500">{doc.date}</td>
                    <td className="p-4">
                      {doc.status === 'reviewed' ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <CheckCircle2 size={14} /> 已审查
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                          <Clock size={14} /> 待审查
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-900 mb-4">历史审查记录</h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-medium">审查时间</th>
                    <th className="p-4 font-medium">审查类型</th>
                    <th className="p-4 font-medium">审查文档</th>
                    <th className="p-4 font-medium">结果下载</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500">2026-03-25 10:32</td>
                    <td className="p-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">补充审查</span></td>
                    <td className="p-4 text-slate-700">临床研究方案_v1.1_修改版.pdf</td>
                    <td className="p-4">
                      <button className="flex items-center gap-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors font-medium">
                        <Download size={16} />
                        审查报告
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500">2026-03-20 14:00</td>
                    <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">初始审查</span></td>
                    <td className="p-4 text-slate-700">方案v1.0, 知情同意书v1.0</td>
                    <td className="p-4">
                      <button className="flex items-center gap-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors font-medium">
                        <Download size={16} />
                        审查报告
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            {/* 补充动态信息输入区 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquarePlus size={18} className="text-[var(--color-primary)]" />
                补充动态信息
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                除了基于文档的审查，您还可以直接输入项目过程中的动态变化、补充说明或研究者答复，AI将结合历史基线重新评估风险-获益比。
              </p>
              
              {/* 关联文档选择 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">关联已有文档 (可选)</label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_DOCS.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => toggleRiskDocSelection(doc.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        selectedRiskDocs.includes(doc.id)
                          ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {selectedRiskDocs.includes(doc.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                      <FileText size={12} />
                      {doc.name}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newRiskInput}
                onChange={(e) => setNewRiskInput(e.target.value)}
                placeholder="例如：研究者承诺将为受试者购买专属商业保险，并已提供保险合同草案..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none resize-none h-24"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleGenerateRisk}
                  disabled={(!newRiskInput.trim() && selectedRiskDocs.length === 0) || isGeneratingRisk}
                  className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                >
                  {isGeneratingRisk ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
                  生成动态评估
                </button>
              </div>
            </div>

            {/* 动态评估趋势时间轴 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">动态风险-获益评估趋势</h3>
              
              <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 py-2">
                {riskAssessments.length === 0 && (
                  <div className="text-sm text-slate-500 italic">暂无评估记录</div>
                )}
                {riskAssessments.map((risk, index) => (
                  <div key={risk.id} className="relative">
                    {/* 时间轴节点 */}
                    <div className={`absolute -left-[41px] bg-white p-1 rounded-full border-2 ${index === 0 ? 'border-[var(--color-primary)]' : 'border-slate-300'}`}>
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}></div>
                    </div>

                    <div className={`rounded-lg p-5 border ${index === 0 ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-slate-900 text-base">{risk.title}</span>
                          {risk.isEdited && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded border border-blue-100">
                              已人工修正 (作为新基线)
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{risk.date}</span>
                      </div>

                      {editingRiskId === risk.id ? (
                        <div className="mt-3 animate-in fade-in duration-200">
                          <textarea
                            value={editRiskContent}
                            onChange={(e) => setEditRiskContent(e.target.value)}
                            className="w-full border border-[var(--color-primary)] rounded-lg p-3 text-sm focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none min-h-[120px] bg-white shadow-sm"
                          />
                          <div className="flex justify-end gap-2 mt-3">
                            <button 
                              onClick={() => setEditingRiskId(null)} 
                              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                            >
                              取消
                            </button>
                            <button 
                              onClick={() => saveRiskEdit(risk.id)} 
                              className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium shadow-sm"
                            >
                              保存修改并设为基线
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-slate-700 mb-4 whitespace-pre-wrap leading-relaxed">
                            <strong className={risk.isEdited ? "text-blue-700" : "text-slate-800"}>
                              {risk.isEdited ? '专家评估修正:' : 'AI初步分析:'}
                            </strong>{' '}
                            {risk.content}
                          </p>
                          <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-slate-200/60">
                            <div className="flex items-center gap-2">
                              {risk.type === 'low' ? (
                                <span className="text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md">
                                  <Activity size={14} /> 风险可控 / 趋于有利
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md">
                                  <AlertTriangle size={14} /> 风险较高 / 需关注
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditingRisk(risk)}
                                className="text-slate-500 hover:text-[var(--color-primary)] flex items-center gap-1.5 text-sm font-medium transition-colors bg-white border border-slate-200 hover:border-[var(--color-primary)] px-3 py-1.5 rounded-md shadow-sm"
                              >
                                <Edit2 size={14} /> 
                                修改
                              </button>
                              <button
                                onClick={() => deleteRisk(risk.id)}
                                className="text-slate-500 hover:text-red-500 flex items-center gap-1.5 text-sm font-medium transition-colors bg-white border border-slate-200 hover:border-red-500 px-3 py-1.5 rounded-md shadow-sm"
                              >
                                <Trash2 size={14} /> 
                                删除
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
