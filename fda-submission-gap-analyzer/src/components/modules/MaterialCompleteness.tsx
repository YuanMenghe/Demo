import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileSearch, ClipboardList } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/lib/i18n';
import { useKnowledge } from '@/contexts/KnowledgeContext';
import { CitationLink, CitationUserLink } from '../CitationLink';
import { MODULE_ORDER } from '@/lib/projectDocuments';

export default function MaterialCompleteness() {
  const { t } = useLanguage();
  const { entries } = useKnowledge();
  const firstPdf = entries.find((e) => e.kind === 'pdf');

  const missingItems = [
    { module: 'M1', item: 'Form FDA 356h', reason: t('申报表为 NDA/BLA 的强制项。', 'Application form required for NDA/BLA submissions.'), reference: '21 CFR 314.50(a)', citationKey: 'cfr-314-50a' as const },
    { module: 'M1', item: t('禁止参与声明 (Debarment Certification)', 'Debarment Certification'), reason: t('关于不使用被禁止人员的强制声明。', 'Mandatory statement regarding use of debarred persons.'), reference: 'FD&C Act Section 306(k)(1)', citationKey: 'fdca-306k' as const },
    { module: 'M1', item: t('财务披露 (Financial Disclosure)', 'Financial Disclosure'), reason: t('临床研究者需提交 Form FDA 3454 或 3455。', 'Form FDA 3454 or 3455 required for clinical investigators.'), reference: '21 CFR Part 54', citationKey: 'cfr-part-54' as const },
    { module: 'M5', item: t('BIMO 数据清单', 'BIMO Data Listings'), reason: t('生物研究监测数据清单为检查计划所必需。', 'Required for inspection planning.'), reference: 'FDA BIMO Guidance', citationKey: 'bimo-guidance' as const },
    { module: 'M2', item: t('2.7.3 临床安全性总结（完整版）', '2.7.3 Clinical Safety Summary (complete)'), reason: t('卷宗中仅有摘要版本，缺少完整 CSR 交叉引用索引。', 'Only abbreviated version present; full CSR cross-reference index missing.'), reference: 'ICH M4E(R2)', citationKey: 'fda-effectiveness-guidance' as const },
  ];

  const technicalByModule = [
    {
      module: 'M1',
      status: t('部分通过', 'Partial'),
      statusVariant: 'outline' as const,
      findings: [
        t('行政表格齐全，但缺少与 eCTD 4.0 目录一致的 XML 元数据校验记录。', 'Administrative forms present; missing XML metadata validation log aligned with eCTD 4.0 TOC.'),
        t('Cover Letter 未列出本次申报所含 M2–M5 变更摘要。', 'Cover letter does not summarize M2–M5 changes in this submission.'),
      ],
    },
    {
      module: 'M2',
      status: t('需补充', 'Needs work'),
      statusVariant: 'destructive' as const,
      findings: [
        t('2.5 临床概述侧重单一区域人群，缺少全球/目标区域适用性论证结构。', '2.5 Clinical Overview emphasizes a single regional population; lacks global/target-region applicability structure.'),
        t('2.3 QOS 与 M3 详细报告之间的交叉引用编号不一致。', 'Cross-reference numbering between 2.3 QOS and Module 3 detail reports is inconsistent.'),
      ],
    },
    {
      module: 'M3',
      status: t('需补充', 'Needs work'),
      statusVariant: 'destructive' as const,
      findings: [
        t('3.2.P.5 分析方法验证数据深度不足（对照 ICH Q2(R2)）。', 'Insufficient depth of analytical method validation in 3.2.P.5 (vs ICH Q2(R2)).'),
        t('商业化规模 PPQ 偏差关闭叙述缺少根本原因层级分析。', 'Commercial-scale PPQ deviation closure narrative lacks root-cause depth.'),
      ],
    },
    {
      module: 'M4',
      status: t('通过', 'Pass'),
      statusVariant: 'default' as const,
      findings: [
        t('非临床综述与毒理核心研究报告结构完整，章节编号符合 eCTD 规范。', 'Nonclinical overview and core tox reports are structurally complete with valid eCTD section numbering.'),
      ],
    },
    {
      module: 'M5',
      status: t('需补充', 'Needs work'),
      statusVariant: 'destructive' as const,
      findings: [
        t('5.3.5.1 疗效报告中 SAP 偏离未按预设敏感性分析框架充分论证。', 'SAP deviations in 5.3.5.1 efficacy report not fully justified per predefined sensitivity framework.'),
        t('CSR 与统计分析附录之间的数据集锁定版本号不一致。', 'Dataset lock version numbers inconsistent between CSR and statistical analysis appendices.'),
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t('材料完整性检查', 'Material Completeness Check')}</h2>
        <p className="text-slate-500 mt-2">
          {t(
            '基于已上传的 M1–M5 卷宗，分别输出形式完整性（缺失项清单）与内容完整性（技术完整性报告）。',
            'Based on uploaded Modules M1–M5 dossier content: formal completeness (missing-item list) and content completeness (technical integrity report).'
          )}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {MODULE_ORDER.map((m) => (
            <Badge key={m} variant="secondary" className="bg-slate-100 text-slate-700">
              {m}
            </Badge>
          ))}
        </div>
        {firstPdf && (
          <p className="text-sm text-teal-800 mt-2 flex flex-wrap items-center gap-2">
            {t('已关联用户知识库 PDF：', 'Linked user knowledge PDF:')}
            <CitationUserLink entryId={firstPdf.id} />
          </p>
        )}
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle>{t('形式完整性摘要', 'Formal completeness summary')}</AlertTitle>
        <AlertDescription>
          {t(
            'M1–M5 范围内识别 5 项内容缺失；技术完整性方面 M2、M3、M5 需重点补充。',
            'Five content gaps identified across M1–M5; technical integrity requires priority follow-up in M2, M3, and M5.'
          )}
        </AlertDescription>
      </Alert>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">{t('形式完整性 · 内容缺失项清单', 'Formal completeness · Missing content list')}</CardTitle>
          </div>
          <CardDescription>
            {t(
              '对照 eCTD 目录与申报规范，列出 M1–M5 中未提交或章节占位不完整的内容项。',
              'Against eCTD TOC and submission norms: items not submitted or with incomplete section placeholders in M1–M5.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[72px]">{t('模块', 'Module')}</TableHead>
                <TableHead>{t('缺失内容项', 'Missing content item')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('参考依据', 'Reference')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missingItems.map((item, i) => (
                <TableRow key={i} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 font-mono">
                      {item.module}
                    </Badge>
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
            <FileSearch className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">{t('内容完整性检查 · 技术完整性报告', 'Content completeness · Technical integrity report')}</CardTitle>
          </div>
          <CardDescription>
            {t(
              '对已提交的 M1–M5 文件进行技术深度、交叉引用与数据一致性审查（非形式目录项）。',
              'Technical depth, cross-references, and data consistency review for submitted M1–M5 files (beyond formal TOC items).'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {technicalByModule.map((block) => (
            <div key={block.module} className="p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <Badge variant="outline" className="font-mono text-sm px-2.5">
                  {block.module}
                </Badge>
                <Badge variant={block.statusVariant}>{block.status}</Badge>
              </div>
              <ul className="space-y-2">
                {block.findings.map((text, j) => (
                  <li key={j} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-slate-300 shrink-0">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
