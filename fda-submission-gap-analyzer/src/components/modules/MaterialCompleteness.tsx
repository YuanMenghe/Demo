import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileWarning, FilePlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/lib/i18n';
import { useKnowledge } from '@/contexts/KnowledgeContext';
import { CitationLink, CitationUserLink } from '../CitationLink';

export default function MaterialCompleteness() {
  const { t } = useLanguage();
  const { entries } = useKnowledge();
  const firstPdf = entries.find((e) => e.kind === 'pdf');

  const missingItems = [
    { module: t('模块 1', 'Module 1'), item: 'Form FDA 356h', reason: t('所有 NDA/BLA 申报的强制要求。', 'Required for all NDA/BLA submissions.'), reference: '21 CFR 314.50(a)', citationKey: 'cfr-314-50a' as const },
    { module: t('模块 1', 'Module 1'), item: t('禁止参与声明 (Debarment Certification)', 'Debarment Certification'), reason: t('关于不使用被禁止人员的强制声明。', 'Mandatory statement regarding use of debarred persons.'), reference: 'FD&C Act Section 306(k)(1)', citationKey: 'fdca-306k' as const },
    { module: t('模块 1', 'Module 1'), item: t('财务披露 (Financial Disclosure)', 'Financial Disclosure'), reason: t('临床研究者需要提交 Form FDA 3454 或 3455。', 'Form FDA 3454 or 3455 required for clinical investigators.'), reference: '21 CFR Part 54', citationKey: 'cfr-part-54' as const },
    { module: t('模块 5', 'Module 5'), item: t('BIMO (生物研究监测) 数据清单', 'BIMO (Bioresearch Monitoring) Data Listings'), reason: t('FDA 检查计划的强制要求。', 'Required for FDA inspection planning.'), reference: 'FDA BIMO Guidance', citationKey: 'bimo-guidance' as const },
  ];

  const rewriteItems = [
    { module: t('模块 2', 'Module 2'), item: t('2.5 临床概述', '2.5 Clinical Overview'), issue: t('CDE 版本过度侧重于中国人群数据。FDA 要求提供更广泛的全球背景，并具体论证对美国人群的适用性。', 'CDE version focuses heavily on Chinese population data. FDA requires broader global context and specific justification for applicability to US population.'), action: t('重写以强调全球试验数据和美国人群外推性。', 'Rewrite to emphasize global trial data and US population extrapolation.') },
    { module: t('模块 3', 'Module 3'), item: t('3.2.P.5 药品控制', '3.2.P.5 Control of Drug Product'), issue: t('缺少符合 FDA ICH Q2(R1) 期望的分析方法具体验证数据。', 'Missing specific validation data for analytical procedures as per FDA ICH Q2(R1) expectations.'), action: t('补充详细的验证报告和原始数据摘要。', 'Supplement with detailed validation reports and raw data summaries.') },
    { module: t('模块 5', 'Module 5'), item: t('5.3.5.1 疗效报告', '5.3.5.1 Efficacy Reports'), issue: t('统计分析计划 (SAP) 偏差未按照 FDA 标准进行充分论证。', 'Statistical Analysis Plan (SAP) deviations not fully justified according to FDA standards.'), action: t('增加专门章节，通过敏感性分析论证所有 SAP 偏差的合理性。', 'Add a dedicated section justifying all SAP deviations with sensitivity analyses.') },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t('材料完整性检查', 'Material Completeness Check')}</h2>
        <p className="text-slate-500 mt-2">
          {t('上传的 CDE 卷宗与 FDA eCTD 4.0 和 21 CFR Part 11 要求的比对。', 'Comparison of uploaded CDE dossier against FDA eCTD 4.0 and 21 CFR Part 11 requirements.')}
        </p>
        {firstPdf && (
          <p className="text-sm text-teal-800 mt-2 flex flex-wrap items-center gap-2">
            {t('已关联用户知识库 PDF：', 'Linked user knowledge PDF:')}
            <CitationUserLink entryId={firstPdf.id} />
          </p>
        )}
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle>{t('发现关键缺口', 'Critical Gaps Identified')}</AlertTitle>
        <AlertDescription>
          {t('发现 4 份缺失文件和 3 份需要大幅改写以符合 FDA 标准的文件。', 'Found 4 missing documents and 3 documents requiring significant rewrites to meet FDA standards.')}
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <FilePlus className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">{t('缺失文件', 'Missing Documents')}</CardTitle>
            </div>
            <CardDescription>{t('在 CDE 提交中未找到但 FDA 强制要求的文件。', 'Items not found in the CDE submission that are mandatory for FDA.')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[100px]">{t('模块', 'Module')}</TableHead>
                  <TableHead>{t('要求项', 'Required Item')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('参考依据', 'Reference')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missingItems.map((item, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">{item.module}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{item.item}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.reason}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 lg:hidden">
                        <span className="text-xs font-mono text-slate-500">{item.reference}</span>
                        <CitationLink citationKey={item.citationKey} />
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-slate-500 font-mono">
                      <div className="space-y-1">
                        <div>{item.reference}</div>
                        <CitationLink citationKey={item.citationKey} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <FileWarning className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">{t('需改写文件', 'Documents to Rewrite')}</CardTitle>
            </div>
            <CardDescription>{t('已存在但需要根据 FDA 语境进行修改的文件。', 'Items present but requiring modification for FDA context.')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[100px]">{t('模块', 'Module')}</TableHead>
                  <TableHead>{t('文件与问题', 'Document & Issue')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewriteItems.map((item, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium align-top pt-4">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">{item.module}</Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium text-slate-900">{item.item}</div>
                      <div className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">
                        <span className="font-semibold">{t('CDE 缺口：', 'CDE Gap:')}</span> {item.issue}
                      </div>
                      <div className="text-sm text-blue-700 mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                        <span className="font-semibold">{t('行动项：', 'Action:')}</span> {item.action}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
