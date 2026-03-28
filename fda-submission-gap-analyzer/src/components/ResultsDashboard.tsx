import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckSquare, Microscope, AlertOctagon, PenTool, FileDown, FileText, Package, Share2, Loader2 } from 'lucide-react';
import MaterialCompleteness from './modules/MaterialCompleteness';
import ScientificReview from './modules/ScientificReview';
import KeyReviewIssues from './modules/KeyReviewIssues';
import ResponseCopilot from './modules/ResponseCopilot';
import { useLanguage } from '@/lib/i18n';
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
  selectedModules?: string[];
  /** When set, shows PDF / Word / ZIP download + share in the report view */
  reportExport?: ReportExportMeta | null;
}

export default function ResultsDashboard({
  onReset,
  hideHeader = false,
  selectedModules = ['completeness', 'scientific', 'issues', 'copilot'],
  reportExport = null,
}: ResultsDashboardProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(selectedModules[0] || 'completeness');
  const [exporting, setExporting] = useState<null | 'pdf' | 'docx' | 'zip'>(null);

  const exportCtx: AnalysisExportContext = useMemo(
    () => ({
      projectName: reportExport?.projectName ?? t('演示项目', 'Demo project'),
      analysisName: reportExport?.analysisName ?? t('差距分析报告', 'Gap analysis report'),
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
      <Button
        variant="outline"
        size="sm"
        disabled={!!exporting}
        onClick={() => void runExport('pdf')}
      >
        {exporting === 'pdf' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
        {t('下载 PDF', 'Download PDF')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!!exporting}
        onClick={() => void runExport('docx')}
      >
        {exporting === 'docx' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        {t('下载 Word', 'Download Word')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!!exporting}
        onClick={() => void runExport('zip')}
      >
        {exporting === 'zip' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
        {t('打包下载 (PDF+Word)', 'Download bundle (PDF+Word)')}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => void handleShare()}>
        <Share2 className="w-4 h-4 mr-2" />
        {t('分享报告', 'Share Report')}
      </Button>
    </div>
  ) : null;

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
                <h1 className="text-xl font-bold text-slate-900">{t('FDA NDA/BLA 差距分析报告', 'FDA NDA/BLA Gap Analysis Report')}</h1>
                <p className="text-xs text-slate-500">{t('目标：NDA - 非小细胞肺癌', 'Target: NDA - Non-Small Cell Lung Cancer')}</p>
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
          <TabsList className={`grid w-full h-auto p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-sm ${
            selectedModules.length === 1 ? 'grid-cols-1' :
            selectedModules.length === 2 ? 'grid-cols-2' :
            selectedModules.length === 3 ? 'grid-cols-3' :
            'grid-cols-4'
          }`}>
            {selectedModules.includes('completeness') && (
              <TabsTrigger value="completeness" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <div className="flex flex-col items-center space-y-1">
                  <CheckSquare className="w-5 h-5" />
                  <span className="font-medium">{t('1. 完整性', '1. Completeness')}</span>
                </div>
              </TabsTrigger>
            )}
            {selectedModules.includes('scientific') && (
              <TabsTrigger value="scientific" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <div className="flex flex-col items-center space-y-1">
                  <Microscope className="w-5 h-5" />
                  <span className="font-medium">{t('2. 科学性', '2. Scientific Validity')}</span>
                </div>
              </TabsTrigger>
            )}
            {selectedModules.includes('issues') && (
              <TabsTrigger value="issues" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <div className="flex flex-col items-center space-y-1">
                  <AlertOctagon className="w-5 h-5" />
                  <span className="font-medium">{t('3. 核心问题', '3. Key FDA Issues')}</span>
                </div>
              </TabsTrigger>
            )}
            {selectedModules.includes('copilot') && (
              <TabsTrigger value="copilot" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                <div className="flex flex-col items-center space-y-1">
                  <PenTool className="w-5 h-5" />
                  <span className="font-medium">{t('4. 回复草拟', '4. Response Copilot')}</span>
                </div>
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
            {selectedModules.includes('copilot') && (
              <TabsContent value="copilot" className="mt-0 outline-none">
                <ResponseCopilot />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
