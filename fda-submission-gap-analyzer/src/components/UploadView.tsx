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

  const mockFiles = [
    'M1/1.1_Forms/application-form.pdf',
    'M2/2.5_Clinical_Overview/overview.pdf',
    'M3/3.2.P/drug-product.pdf',
    'M4/4.2_Nonclinical/overview.pdf',
    'M5/5.3.5/clinical-study-report.pdf',
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    setFiles(mockFiles);
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
                {t('eCTD M1–M5', 'eCTD M1–M5')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
                {t('申报审查智能体', 'Submission Review Agent')}
              </h1>
              <p className="text-lg text-slate-600">
                {t(
                  '上传 M1–M5 申报卷宗，智能体将执行材料完整性（形式 + 技术）、科学性审查，并预测可能的审查问题。',
                  'Upload your M1–M5 dossier for material completeness (formal + technical), scientific review, and predicted review questions.'
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('材料完整性检查', 'Material completeness')}</h3>
                  <p className="text-sm text-slate-500">
                    {t('形式完整性缺失项清单 + 内容完整性技术报告', 'Formal missing-item list + technical integrity report')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('科学性审查', 'Scientific validity')}</h3>
                  <p className="text-sm text-slate-500">{t('对照指南与文献评估临床与 CMC 数据', 'Clinical and CMC assessment vs guidance')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('可能的审查问题预测', 'Predicted review questions')}</h3>
                  <p className="text-sm text-slate-500">{t('基于历史审查报告与 CRL 先例预测审查问题', 'Predict questions from review history and CRL precedent')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>{compact ? t('上传增量文档', 'Upload incremental documents') : t('新建审查项目', 'New review project')}</CardTitle>
            <CardDescription>
              {compact
                ? t('按 M1–M5 子文件夹上传新材料', 'Upload new materials into M1–M5 subfolders')
                : t('配置申报目标并上传 M1–M5 材料', 'Configure submission target and upload M1–M5 materials')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {!compact && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="submission-type">{t('申报类型', 'Submission type')}</Label>
                    <Select defaultValue="nda">
                      <SelectTrigger id="submission-type">
                        <SelectValue placeholder={t('选择类型', 'Select type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nda">{t('NDA (新药申请)', 'NDA')}</SelectItem>
                        <SelectItem value="bla">{t('BLA (生物制品许可申请)', 'BLA')}</SelectItem>
                        <SelectItem value="anda">{t('ANDA (简略新药申请)', 'ANDA')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indication">{t('适应症', 'Indication')}</Label>
                    <Input id="indication" placeholder={t('例如：NSCLC', 'e.g., NSCLC')} defaultValue={t('非小细胞肺癌', 'NSCLC')} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>{t('申报卷宗 (M1–M5)', 'Dossier (M1–M5)')}</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isHovering ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                  }`}
                  onClick={() => setFiles(mockFiles)}
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {t('将卷宗拖拽至此（含 M1–M5 目录结构）', 'Drag dossier here (M1–M5 folder structure)')}
                  </p>
                  <p className="text-xs text-slate-500">{t('支持 PDF, DOCX, ZIP (eCTD)', 'PDF, DOCX, ZIP (eCTD)')}</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">
                    {t('已识别文件', 'Detected files')} ({files.length})
                  </Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center p-2 bg-white border rounded-md text-sm">
                        <FileText className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="truncate font-mono text-xs">{file}</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={onComplete} disabled={files.length === 0}>
              {compact ? t('确认上传', 'Confirm upload') : t('进入项目工作台', 'Open workspace')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
