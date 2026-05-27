import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckSquare, Microscope, AlertOctagon, FileDown, FileText, Package, Share2, Loader2 } from 'lucide-react';
import MaterialCompleteness from './modules/MaterialCompleteness';
import ScientificReview from './modules/ScientificReview';
import KeyReviewIssues from './modules/KeyReviewIssues';
import { useLanguage } from '@/lib/i18n';
import { DEFAULT_SELECTED_MODULES, type AnalysisModuleId } from '@/lib/analysisModules';
import type { AnalysisExportContext } from '@/lib/reportExportContent';
import {
  downloadAnalysisPdf,
  downloadAnalysisDocx,
  downloadAnalysisBundleZip,
} from '@/lib/analysisReportExport';

export interface ReportExportMeta {
  projectName: string;
  analysisName: string;
  analysisDate: string;
  fileCount: number;
}

interface ResultsDashboardProps {
  onReset: () => void;
  hideHeader?: boolean;
  selectedModules?: AnalysisModuleId[];
  reportExport?: ReportExportMeta | null;
}

export default function ResultsDashboard({
  onReset,
  hideHeader = false,
  selectedModules = DEFAULT_SELECTED_MODULES,
  reportExport = null,
}: ResultsDashboardProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(selectedModules[0] || 'completeness');
  const [exporting, setExporting] = useState<null | 'pdf' | 'docx' | 'zip'>(null);

  const exportCtx: AnalysisExportContext = useMemo(
    () => ({
      projectName: reportExport?.projectName ?? t('演示项目', 'Demo project'),
      analysisName: reportExport?.analysisName ?? t('申报审查报告', 'Submission review report'),
      analysisDate: reportExport?.analysisDate ?? '—',
      fileCount: reportExport?.fileCount ?? 0,
      modules: selectedModules,
    }),
    [reportExport, selectedModules, t]
  );

  const runExport = async (kind: 'pdf' | 'docx' | 'zip') => {
    setExporting(kind);
    try {
      if (kind === 'pdf') await downloadAnalysisPdf(exportCtx, language);
      else if (kind === 'docx') await downloadAnalysisDocx(exportCtx, language);
      else await downloadAnalysisBundleZip(exportCtx, language);
    } finally {
      setExporting(null);
    }
  };

  const handleShare = async () => {
    const title = `${exportCtx.analysisName} (${exportCtx.analysisDate})`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: title });
      } else {
        await navigator.clipboard.writeText(title);
      }
    } catch {
      /* ignore */
    }
  };

  const exportToolbar = reportExport ? (
    <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
      <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => void runExport('pdf')}>
        {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
        {t('下载 PDF', 'Download PDF')}
      </Button>
      <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => void runExport('docx')}>
        {exporting === 'docx' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        {t('下载 Word', 'Download Word')}
      </Button>
      <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => void runExport('zip')}>
        {exporting === 'zip' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
        {t('打包下载 (PDF+Word)', 'Download bundle (PDF+Word)')}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => void handleShare()}>
        <Share2 className="w-4 h-4 mr-2" />
        {t('分享报告', 'Share Report')}
      </Button>
    </div>
  ) : null;

  const tabCols =
    selectedModules.length === 1 ? 'grid-cols-1' : selectedModules.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!hideHeader && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onReset} className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t('申报审查分析报告', 'Submission review report')}</h1>
                <p className="text-xs text-slate-500">{t('输入范围：M1–M5', 'Scope: Modules M1–M5')}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => void runExport('pdf')}>
                {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                {t('下载 PDF', 'Download PDF')}
              </Button>
              <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => void runExport('docx')}>
                {exporting === 'docx' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                {t('下载 Word', 'Download Word')}
              </Button>
              <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => void runExport('zip')}>
                {exporting === 'zip' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
                {t('打包下载', 'Bundle')}
              </Button>
              <Button size="sm" onClick={() => void handleShare()}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('分享报告', 'Share Report')}
              </Button>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 ${hideHeader ? 'py-4' : 'py-8'}`}>
        {hideHeader && exportToolbar}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList
            variant="line"
            className="w-full flex flex-wrap items-center justify-start gap-2 bg-transparent p-0 h-10"
          >
            {selectedModules.includes('completeness') && (
              <TabsTrigger
                value="completeness"
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/60 hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span className="font-medium text-sm">{t('材料完整性', 'Completeness')}</span>
                </span>
              </TabsTrigger>
            )}
            {selectedModules.includes('scientific') && (
              <TabsTrigger
                value="scientific"
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/60 hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <Microscope className="w-4 h-4" />
                  <span className="font-medium text-sm">{t('科学性', 'Scientific')}</span>
                </span>
              </TabsTrigger>
            )}
            {selectedModules.includes('issues') && (
              <TabsTrigger
                value="issues"
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white/60 hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" />
                  <span className="font-medium text-sm">{t('审查问题预测', 'Review Qs')}</span>
                </span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
            {selectedModules.includes('completeness') && (
              <TabsContent value="completeness" className="mt-0 outline-none">
                <MaterialCompleteness />
              </TabsContent>
            )}
            {selectedModules.includes('scientific') && (
              <TabsContent value="scientific" className="mt-0 outline-none">
                <ScientificReview />
              </TabsContent>
            )}
            {selectedModules.includes('issues') && (
              <TabsContent value="issues" className="mt-0 outline-none">
                <KeyReviewIssues />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
