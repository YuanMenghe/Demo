import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UploadCloud, FileText, Clock, Play, Settings2, FileCheck2, Activity, Package, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ResultsDashboard from './ResultsDashboard';
import UploadView from './UploadView';
import DocumentModuleTree from './DocumentModuleTree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { downloadAnalysisBundleZip } from '@/lib/analysisReportExport';
import type { AnalysisExportContext } from '@/lib/reportExportContent';
import { DEFAULT_SELECTED_MODULES, type AnalysisModuleId } from '@/lib/analysisModules';
import { DEFAULT_PROJECT_DOCUMENTS, type ProjectDocument } from '@/lib/projectDocuments';

interface ProjectWorkspaceProps {
  project: any;
  onBack: () => void;
  onUpdateProject: (project: any) => void;
}

export default function ProjectWorkspace({ project, onBack, onUpdateProject }: ProjectWorkspaceProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'documents' | 'analyses'>('analyses');
  const [isUploading, setIsUploading] = useState(project?.docCount === 0);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingAnalysis, setViewingAnalysis] = useState<any>(null);

  const initialDocuments = (): ProjectDocument[] => {
    if (!project?.docCount) return [];
    return DEFAULT_PROJECT_DOCUMENTS.slice(0, Math.min(project.docCount, DEFAULT_PROJECT_DOCUMENTS.length));
  };

  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);

  const [analyses, setAnalyses] = useState<any[]>([
    ...(project?.status === 'analyzed' ? [{
      id: 'a1',
      date: '2026-03-23 10:30',
      name: t('首次全量分析 (M1–M5)', 'Initial full analysis (M1–M5)'),
      files: initialDocuments().length || DEFAULT_PROJECT_DOCUMENTS.length,
      modules: [...DEFAULT_SELECTED_MODULES],
    }] : [])
  ]);

  const [selectedFiles, setSelectedFiles] = useState<string[]>(() => initialDocuments().map((d) => d.id));
  const [selectedModules, setSelectedModules] = useState<AnalysisModuleId[]>([...DEFAULT_SELECTED_MODULES]);
  const [bundleDownloadingId, setBundleDownloadingId] = useState<string | null>(null);

  const handleUploadComplete = () => {
    setIsUploading(false);
    setActiveTab('documents');
    
    // Add some mock new documents
    const ts = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newDocs: ProjectDocument[] = [
      { id: `d${Date.now()}`, name: 'updated_protocol_v3.pdf', module: 'M5', folder: '5.3.1 Protocols', time: ts },
      { id: `d${Date.now() + 1}`, name: 'new_safety_data.pdf', module: 'M2', folder: '2.7 Clinical Summary', time: ts },
    ];
    const nextDocs =
      documents.length === 0 ? [...DEFAULT_PROJECT_DOCUMENTS] : [...newDocs, ...documents];
    setDocuments(nextDocs);
    setSelectedFiles(nextDocs.map((d) => d.id));

    onUpdateProject({
      ...project,
      docCount: nextDocs.length,
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

  const toggleModule = (id: AnalysisModuleId) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const buildExportContext = (analysis: { name: string; date: string; files: number; modules: string[] }): AnalysisExportContext => ({
    projectName: project?.name ?? t('未命名项目', 'Untitled project'),
    analysisName: analysis.name,
    analysisDate: analysis.date,
    fileCount: analysis.files,
    modules: analysis.modules,
  });

  const handleAnalysisBundleDownload = async (e: React.MouseEvent, analysis: { id: string; name: string; date: string; files: number; modules: string[] }) => {
    e.stopPropagation();
    setBundleDownloadingId(analysis.id);
    try {
      await downloadAnalysisBundleZip(buildExportContext(analysis), language);
    } finally {
      setBundleDownloadingId(null);
    }
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
          </div>
        </header>
        <div>
          <ResultsDashboard
            onReset={() => setViewingAnalysis(null)}
            hideHeader={true}
            selectedModules={viewingAnalysis.modules}
            reportExport={{
              projectName: project?.name ?? t('未命名项目', 'Untitled project'),
              analysisName: viewingAnalysis.name,
              analysisDate: viewingAnalysis.date,
              fileCount: viewingAnalysis.files,
            }}
          />
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
              <CardDescription>
                {t('按 M1–M5 模块与子文件夹勾选本次分析所包含的源文件。', 'Select source files by M1–M5 module and subfolder for this run.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentModuleTree
                documents={documents}
                mode="select"
                selectedIds={selectedFiles}
                onToggle={toggleFile}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('选择分析模块', 'Select Analysis Modules')}</CardTitle>
              <CardDescription>{t('选择本次运行需要执行的审查模块。', 'Select the review modules to execute in this run.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: 'completeness' as const,
                    name: t('1. 材料完整性检查', '1. Material completeness'),
                    desc: t('形式完整性（内容缺失项清单）+ 内容完整性（技术完整性报告），输入 M1–M5', 'Formal missing-item list + technical integrity report for M1–M5'),
                  },
                  {
                    id: 'scientific' as const,
                    name: t('2. 科学性审查', '2. Scientific validity'),
                    desc: t('对照指南与文献评估临床与 CMC 科学性', 'Clinical and CMC scientific assessment vs guidance'),
                  },
                  {
                    id: 'issues' as const,
                    name: t('3. 可能的审查问题预测', '3. Predicted review questions'),
                    desc: t('预测监管机构可能提出的审查问题', 'Predict likely regulatory review questions'),
                  },
                ].map((mod) => (
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
            
            <p className="text-sm text-slate-500">
              {t(
                '文档按 M1–M5 模块与子文件夹组织，便于管理大量 eCTD 源文件。',
                'Documents are organized by Modules M1–M5 and subfolders for large eCTD source sets.'
              )}
            </p>
            {documents.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>{t('暂无文档，请点击右上角上传', 'No documents yet, click upload to add some')}</p>
              </div>
            ) : (
              <DocumentModuleTree documents={documents} mode="view" />
            )}
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
                      <div className="flex justify-between items-start gap-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs text-slate-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {analysis.date}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            disabled={bundleDownloadingId === analysis.id}
                            onClick={(e) => void handleAnalysisBundleDownload(e, analysis)}
                          >
                            {bundleDownloadingId === analysis.id ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            ) : (
                              <Package className="w-3.5 h-3.5 mr-1" />
                            )}
                            {t('打包下载', 'Bundle')}
                          </Button>
                        </div>
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
                          <span className="font-medium text-slate-900">{analysis.modules.length}/3</span>
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
