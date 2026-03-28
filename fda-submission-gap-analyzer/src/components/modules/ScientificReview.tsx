import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Info, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { CitationLink } from '../CitationLink';

export default function ScientificReview() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t('科学性审查', 'Scientific Validity Review')}</h2>
        <p className="text-slate-500 mt-2">
          {t('对照 FDA 临床指南、美国指南和 PubMed 文献评估临床和 CMC 数据。', 'Evaluation of clinical and CMC data against FDA clinical guidance, US guidelines, and PubMed literature.')}
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg">{t('详细科学评估', 'Detailed Scientific Assessment')}</CardTitle>
          <CardDescription>{t('点击展开每个部分以查看详细发现和 FDA 参考依据。', 'Click to expand each section for detailed findings and FDA references.')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="design" className="border-b border-slate-100 px-6">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">{t('1. 研究设计科学性', '1. Study Design Validity')}</h3>
                    <p className="text-sm text-slate-500 font-normal">{t('随机、对照、盲法、适应症定义。', 'Randomization, control, blinding, indication definition.')}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">{t('低风险', 'Low Risk')}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2 text-slate-700 space-y-4">
                <p>{t('随机、双盲、阳性对照设计符合 FDA 对该适应症关键疗效试验的期望。', 'The randomized, double-blind, active-controlled design aligns with FDA expectations for pivotal efficacy trials in this indication.')}</p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" /> {t('FDA 参考依据', 'FDA Reference')}
                  </h4>
                  <p className="text-sm text-slate-600">{t('FDA 行业指南：为人类药物和生物制品提供有效性的临床证据。', 'FDA Guidance for Industry: Providing Clinical Evidence of Effectiveness for Human Drug and Biological Products.')}</p>
                  <div className="mt-2">
                    <CitationLink citationKey="fda-effectiveness-guidance" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="endpoints" className="border-b border-slate-100 px-6">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">{t('2. 关键科学终点', '2. Key Scientific Endpoints')}</h3>
                    <p className="text-sm text-slate-500 font-normal">{t('对照 FDA 肿瘤学指南论证 OS、PFS、ORR、DOR。', 'OS, PFS, ORR, DOR justification against FDA oncology guidance.')}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200">{t('中风险', 'Medium Risk')}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2 text-slate-700 space-y-4">
                <p>{t('虽然 PFS 是主要终点，但 FDA 最近强调了在特定 NSCLC 环境中的总生存期 (OS)。目前的 OS 数据尚不成熟。', 'While PFS is the primary endpoint, the FDA has recently emphasized Overall Survival (OS) in this specific NSCLC setting. The current OS data is immature.')}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><span className="font-semibold text-slate-900">{t('缺口：', 'Gap:')}</span> {t('缺乏成熟的 OS 数据来支持 PFS 获益。', 'Lack of mature OS data to support the PFS benefit.')}</li>
                  <li><span className="font-semibold text-slate-900">{t('建议：', 'Recommendation:')}</span> {t('准备中期 OS 分析，并基于最近的 ODAC 会议为 PFS 作为替代终点提供强有力的论证。', 'Prepare an interim OS analysis and strong justification for PFS as a surrogate endpoint based on recent ODAC meetings.')}</li>
                </ul>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" /> {t('FDA 参考依据', 'FDA Reference')}
                  </h4>
                  <p className="text-sm text-slate-600">{t('FDA 指南：用于批准抗癌药物和生物制品的临床试验终点。', 'FDA Guidance: Clinical Trial Endpoints for the Approval of Cancer Drugs and Biologics.')}</p>
                  <div className="mt-2">
                    <CitationLink citationKey="fda-oncology-endpoints" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="population" className="border-b border-slate-100 px-6">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">{t('3. 人群外推性', '3. Population Extrapolation')}</h3>
                    <p className="text-sm text-slate-500 font-normal">{t('种族、民族、区域、年龄、性别代表性。', 'Race, ethnicity, region, age, gender representation.')}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-red-50 text-red-700 border-red-200">{t('高风险', 'High Risk')}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2 text-slate-700 space-y-4">
                <p className="text-red-700 font-medium">{t('关键问题：临床数据主要来自中国中心 (>85%)。', 'Critical Issue: The clinical data is predominantly from Chinese sites (>85%).')}</p>
                <p>{t('FDA 要求数据适用于美国人群。试验人群缺乏多样性（特别是白人、非裔美国人和西班牙裔患者代表性不足）构成了重大的监管风险。', 'FDA requires data that is applicable to the US population. The lack of diversity in the trial population (specifically underrepresentation of Caucasian, African American, and Hispanic patients) poses a significant regulatory risk.')}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><span className="font-semibold text-slate-900">{t('行动要求：', 'Action Required:')}</span> {t('进行稳健的桥接研究，或提供广泛的 PK/PD 和疾病流行病学论证 (ICH E5)，以支持向美国人群的外推。', 'Conduct a robust bridging study or provide extensive PK/PD and disease epidemiology justification (ICH E5) to support extrapolation to the US population.')}</li>
                </ul>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" /> {t('FDA 参考依据', 'FDA Reference')}
                  </h4>
                  <p className="text-sm text-slate-600">{t('ICH E5 (R1) 接受外国临床数据的种族因素；FDA 草案指南：改善临床试验中代表性不足的种族和民族人群入组的多样性计划。', 'ICH E5 (R1) Ethnic Factors in the Acceptability of Foreign Clinical Data; FDA Draft Guidance: Diversity Plans to Improve Enrollment of Participants from Underrepresented Racial and Ethnic Populations in Clinical Trials.')}</p>
                  <div className="mt-2">
                    <CitationLink citationKey="ich-e5" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="statistics" className="border-b border-slate-100 px-6">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">{t('4. 统计学科学性', '4. Statistical Validity')}</h3>
                    <p className="text-sm text-slate-500 font-normal">{t('数据处理、缺失数据插补、统计方法。', 'Data handling, missing data imputation, statistical methods.')}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">{t('低风险', 'Low Risk')}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2 text-slate-700 space-y-4">
                <p>{t('SAP 中描述的统计方法总体上是可以接受的，并符合 ICH E9。通过多重插补处理缺失数据是合适的。', 'Statistical methods described in the SAP are generally acceptable and align with ICH E9. Handling of missing data via multiple imputation is appropriate.')}</p>
                <div className="mt-2">
                  <CitationLink citationKey="ich-e9" />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cmc" className="px-6">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">{t('5. CMC / 检查风险', '5. CMC / Inspection Risk')}</h3>
                    <p className="text-sm text-slate-500 font-normal">{t('工艺一致性、验证、偏差闭环。', 'Process consistency, validation, deviation closure.')}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200">{t('中风险', 'Medium Risk')}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2 text-slate-700 space-y-4">
                <p>{t('对 CMC 摘要的审查表明，商业化放大的工艺验证文件可能存在缺口。', 'Review of CMC summaries indicates potential gaps in process validation documentation for the commercial scale-up.')}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><span className="font-semibold text-slate-900">{t('观察结果：', 'Observation:')}</span> {t('PPQ 批次期间的三个主要偏差已关闭，但根本原因分析缺乏 FDA 检查员期望的深度。', 'Three major deviations during PPQ batches were closed, but the root cause analysis lacks depth expected by FDA investigators.')}</li>
                  <li><span className="font-semibold text-slate-900">{t('行动要求：', 'Action Required:')}</span> {t('加强模块 3 中关于偏差关闭的叙述，并准备好应对批准前检查 (PAI) 对这些批次的潜在审查。', 'Strengthen the narrative around deviation closures in Module 3 and prepare for potential Pre-Approval Inspection (PAI) scrutiny on these batches.')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
