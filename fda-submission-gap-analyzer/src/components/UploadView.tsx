import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n';

interface UploadViewProps {
  onComplete: () => void;
  compact?: boolean;
}

export default function UploadView({ onComplete, compact = false }: UploadViewProps) {
  const { t } = useLanguage();
  const [files, setFiles] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    setFiles(['eCTD_Module_List.pdf', 'Clinical_Study_Report_CSR.pdf', 'Protocol_V2.pdf', 'SAP_V1.pdf', 'CMC_Summaries.pdf']);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={`flex items-center justify-center p-6 ${compact ? 'min-h-[60vh]' : 'min-h-screen'}`}>
      <div className={`w-full ${compact ? 'max-w-2xl' : 'max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8'}`}>
        {!compact && (
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 mb-4">
                {t('CDE 转 FDA 申报', 'CDE to FDA Transition')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
                {t('FDA 申报差距分析系统', 'FDA Submission Gap Analyzer')}
              </h1>
              <p className="text-lg text-slate-600">
                {t('上传您现有的 CDE 申报文件。我们的 AI 将对照 FDA 要求（21 CFR Part 11, eCTD 4.0 及 FDA 指南）进行分析，识别缺口、科学风险并草拟回复。', 'Upload your existing CDE submission documents. Our AI will analyze them against FDA requirements (21 CFR Part 11, eCTD 4.0, and FDA Guidance) to identify gaps, scientific risks, and draft responses.')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('材料完整性检查', 'Material Completeness')}</h3>
                  <p className="text-sm text-slate-500">{t('识别缺失或需要改写的文件。', 'Identify missing or rewrite-required documents.')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('科学性审查', 'Scientific Validity')}</h3>
                  <p className="text-sm text-slate-500">{t('对照 FDA 指南检查研究设计、终点和统计学。', 'Check study design, endpoints, and statistics against FDA guidance.')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('重点审查问题预测', 'Key Review Issues')}</h3>
                  <p className="text-sm text-slate-500">{t('基于 CRL 数据库和审评报告预测 FDA 问题。', 'Predict FDA questions based on CRL databases and review reports.')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>{compact ? t('上传增量文档', 'Upload Incremental Documents') : t('新建分析项目', 'New Analysis Project')}</CardTitle>
            <CardDescription>{compact ? t('上传新的 CDE 材料以更新分析结果。', 'Upload new CDE materials to update the analysis results.') : t('配置您的申报目标并上传 CDE 材料。', 'Configure your submission target and upload CDE materials.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {!compact && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="submission-type">{t('申报类型', 'Submission Type')}</Label>
                    <Select defaultValue="nda">
                      <SelectTrigger id="submission-type">
                        <SelectValue placeholder={t('选择类型', 'Select type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nda">{t('NDA (新药申请)', 'NDA (New Drug Application)')}</SelectItem>
                        <SelectItem value="bla">{t('BLA (生物制品许可申请)', 'BLA (Biologics License Application)')}</SelectItem>
                        <SelectItem value="anda">{t('ANDA (简略新药申请)', 'ANDA (Abbreviated NDA)')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indication">{t('适应症', 'Indication')}</Label>
                    <Input id="indication" placeholder={t('例如：NSCLC', 'e.g., NSCLC')} defaultValue={t('非小细胞肺癌', 'Non-Small Cell Lung Cancer')} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>{t('CDE 申报文件', 'CDE Submission Documents')}</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isHovering ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                  }`}
                  onClick={() => setFiles(['eCTD_Module_List.pdf', 'Clinical_Study_Report_CSR.pdf', 'Protocol_V2.pdf', 'SAP_V1.pdf', 'CMC_Summaries.pdf'])}
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {t('将您的 CDE 卷宗拖拽至此', 'Drag & drop your CDE dossier here')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t('支持 PDF, DOCX, ZIP (eCTD 结构)', 'Supports PDF, DOCX, ZIP (eCTD structure)')}
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">{t('已上传文件', 'Uploaded Files')} ({files.length})</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center p-2 bg-white border rounded-md text-sm">
                        <FileText className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="truncate">{file}</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={onComplete}
              disabled={files.length === 0}
            >
              {compact ? t('确认上传', 'Confirm Upload') : t('开始 AI 差距分析', 'Start AI Gap Analysis')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
