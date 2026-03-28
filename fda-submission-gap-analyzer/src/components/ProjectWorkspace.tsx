import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UploadCloud, FileText, CheckCircle2, Search, Plus, Clock, Play, Settings2, FileCheck2, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ResultsDashboard from './ResultsDashboard';
import UploadView from './UploadView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface ProjectWorkspaceProps {
  project: any;
  onBack: () => void;
  onUpdateProject: (project: any) => void;
}

export default function ProjectWorkspace({ project, onBack, onUpdateProject }: ProjectWorkspaceProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'documents' | 'analyses'>('analyses');
  const [isUploading, setIsUploading] = useState(project?.docCount === 0);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingAnalysis, setViewingAnalysis] = useState<any>(null);

  const [documents, setDocuments] = useState([
    { id: 'd1', name: 'clinical-study-report-001.pdf', module: 'Module 5', time: '2026-03-23 10:00' },
    { id: 'd2', name: 'cmc-quality-summary.pdf', module: 'Module 3', time: '2026-03-23 10:05' },
    { id: 'd3', name: 'nonclinical-overview.pdf', module: 'Module 2', time: '2026-03-22 15:30' },
    { id: 'd4', name: 'investigator-brochure.pdf', module: 'Module 1', time: '2026-03-21 09:15' }
  ]);

  const [analyses, setAnalyses] = useState<any[]>([
    ...(project?.status === 'analyzed' ? [{
      id: 'a1',
      date: '2026-03-23 10:30',
      name: 'Initial Full Analysis',
      files: 4,
      modules: ['completeness', 'scientific', 'issues', 'copilot']
    }] : [])
  ]);

  const [selectedFiles, setSelectedFiles] = useState<string[]>(documents.map(d => d.id));
  const [selectedModules, setSelectedModules] = useState<string[]>(['completeness', 'scientific', 'issues', 'copilot']);

  const handleUploadComplete = () => {
    setIsUploading(false);
    setActiveTab('documents');
    
    // Add some mock new documents
    const newDocs = [
      { id: `d${Date.now()}`, name: 'updated_protocol_v3.pdf', module: 'Module 5', time: new Date().toISOString().replace('T', ' ').substring(0, 16) },
      { id: `d${Date.now()+1}`, name: 'new_safety_data.pdf', module: 'Module 2', time: new Date().toISOString().replace('T', ' ').substring(0, 16) }
    ];
    setDocuments([...newDocs, ...documents]);
    
    onUpdateProject({
      ...project,
      docCount: project.docCount + newDocs.length,
      name: project.name === 'New Project' ? 'Project Delta - Auto' : project.name
    });
  };

  const handleStartAnalysis = () => {
    setIsConfiguring(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const newAnalysis = {
        id: Date.now().toString(),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        name: `Analysis Run ${analyses.length + 1}`,
        files: selectedFiles.length,
        modules: selectedModules
      };
      setAnalyses([newAnalysis, ...analyses]);
      setViewingAnalysis(newAnalysis);
      onUpdateProject({
        ...project,
        status: 'analyzed'
      });
    }, 2000);
  };

  const toggleFile = (id: string) => {
    setSelectedFiles(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleModule = (id: string) => {
    setSelectedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  if (isUploading) {
    return (
      <div className="min-h-screen bg-slate-50 relative">
        <Button variant="ghost" className="absolute top-6 left-6 z-10" onClick={() => {
          if (project?.docCount === 0 && documents.length === 0) {
            onBack();
          } else {
            setIsUploading(false);
          }
        }}>
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('返回项目', 'Back to Project')}
        </Button>
        <UploadView onComplete={handleUploadComplete} compact={project?.docCount > 0 || documents.length > 0} />
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('正在执行分析...', 'Running Analysis...')}</h2>
        <p className="text-slate-500">{t('正在根据选定的文档和模块生成报告', 'Generating report based on selected documents and modules')}</p>
      </div>
    );
  }

  if (viewingAnalysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setViewingAnalysis(null)} className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{viewingAnalysis.name}</h1>
                <p className="text-xs text-slate-500">{viewingAnalysis.date} · {viewingAnalysis.files} {t('个文档', 'documents')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">{t('导出 PDF', 'Export PDF')}</Button>
              <Button size="sm">{t('分享报告', 'Share Report')}</Button>
            </div>
          </div>
        </header>
        <div>
          <ResultsDashboard onReset={() => setViewingAnalysis(null)} hideHeader={true} selectedModules={viewingAnalysis.modules} />
        </div>
      </div>
    );
  }

  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsConfiguring(false)} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">{t('配置新分析', 'Configure New Analysis')}</h1>
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('选择要分析的文档', 'Select Documents to Analyze')}</CardTitle>
              <CardDescription>{t('选择本次分析需要包含的源文件。', 'Select the source files to include in this analysis run.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <Checkbox 
                      id={`doc-${doc.id}`} 
                      checked={selectedFiles.includes(doc.id)}
                      onCheckedChange={() => toggleFile(doc.id)}
                    />
                    <label htmlFor={`doc-${doc.id}`} className="flex-1 flex items-center cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      {doc.name}
                    </label>
                    <span className="text-xs text-slate-400">{doc.module}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('选择分析模块', 'Select Analysis Modules')}</CardTitle>
              <CardDescription>{t('选择本次运行需要执行的审查模块。', 'Select the review modules to execute in this run.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'completeness', name: t('1. 完整性检查', '1. Completeness Check'), desc: t('识别缺失或需要改写的文件', 'Identify missing or rewrite-required documents') },
                  { id: 'scientific', name: t('2. 科学性审查', '2. Scientific Validity'), desc: t('对照 FDA 指南检查研究设计', 'Check study design against FDA guidance') },
                  { id: 'issues', name: t('3. 核心问题预测', '3. Key FDA Issues'), desc: t('预测 FDA 可能提出的问题', 'Predict potential FDA questions') },
                  { id: 'copilot', name: t('4. 回复草拟', '4. Response Copilot'), desc: t('为潜在问题草拟回复', 'Draft responses for potential issues') }
                ].map(mod => (
                  <div key={mod.id} className="flex items-start space-x-3 p-4 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <Checkbox 
                      id={`mod-${mod.id}`} 
                      checked={selectedModules.includes(mod.id)}
                      onCheckedChange={() => toggleModule(mod.id)}
                      className="mt-1"
                    />
                    <label htmlFor={`mod-${mod.id}`} className="cursor-pointer">
                      <div className="text-sm font-medium text-slate-900">{mod.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{mod.desc}</div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsConfiguring(false)}>{t('取消', 'Cancel')}</Button>
            <Button onClick={handleStartAnalysis} disabled={selectedFiles.length === 0 || selectedModules.length === 0} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              {t('开始执行分析', 'Run Analysis')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{project?.name || t('项目详情', 'Project Details')}</h1>
              <p className="text-xs text-slate-500">{project?.type} - {project?.indication}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant={activeTab === 'analyses' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('analyses')}
            >
              <Activity className="w-4 h-4 mr-2" />
              {t('分析记录', 'Analysis History')}
            </Button>
            <Button 
              variant={activeTab === 'documents' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="w-4 h-4 mr-2" />
              {t('文档管理', 'Documents')}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'documents' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">{t('已上传文档', 'Uploaded Documents')}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => setIsConfiguring(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={documents.length === 0}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('新建分析', 'New Analysis')}
                </Button>
                <Button onClick={() => setIsUploading(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  {t('上传新文档', 'Upload Documents')}
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-sm font-medium text-slate-500">
                <div className="col-span-6">{t('文件名', 'File Name')}</div>
                <div className="col-span-3">{t('模块', 'Module')}</div>
                <div className="col-span-3">{t('上传时间', 'Upload Time')}</div>
              </div>
              <div className="divide-y divide-slate-100">
                {documents.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p>{t('暂无文档，请点击右上角上传', 'No documents yet, click upload to add some')}</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-slate-50 transition-colors">
                      <div className="col-span-6 flex items-center font-medium text-slate-700">
                        <FileText className="w-4 h-4 mr-3 text-blue-500" />
                        {doc.name}
                      </div>
                      <div className="col-span-3 text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{doc.module}</span>
                      </div>
                      <div className="col-span-3 text-slate-400">{doc.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">{t('分析记录', 'Analysis History')}</h2>
              <Button onClick={() => setIsConfiguring(true)} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={documents.length === 0}>
                <Play className="w-4 h-4 mr-2" />
                {t('新建分析', 'New Analysis')}
              </Button>
            </div>

            {analyses.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">{t('暂无分析记录', 'No Analysis History')}</h3>
                <p className="text-slate-500 mb-6">{t('上传文档后，点击新建分析开始您的第一次审查。', 'Upload documents and click New Analysis to start your first review.')}</p>
                <Button onClick={() => setIsConfiguring(true)} disabled={documents.length === 0}>
                  {t('新建分析', 'New Analysis')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses.map(analysis => (
                  <Card key={analysis.id} className="cursor-pointer hover:shadow-md transition-all border-slate-200 hover:border-blue-300 group" onClick={() => setViewingAnalysis(analysis)}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {analysis.date}
                        </span>
                      </div>
                      <CardTitle className="mt-4 text-lg">{analysis.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-3 text-sm text-slate-500 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center"><FileText className="w-4 h-4 mr-2" /> {t('分析文档数', 'Documents Analyzed')}</span>
                          <span className="font-medium text-slate-900">{analysis.files}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center"><Settings2 className="w-4 h-4 mr-2" /> {t('执行模块数', 'Modules Run')}</span>
                          <span className="font-medium text-slate-900">{analysis.modules.length}/4</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
