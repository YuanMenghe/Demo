import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Activity, BarChart3, FlaskConical, Users, FileText, Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function KeyReviewIssues() {
  const { t } = useLanguage();

  const issues = [
    {
      category: t('有效性', 'Efficacy'),
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      questions: [
        { q: t('在总生存期趋势的背景下，PFS 获益的幅度是否具有临床意义？', 'Is the magnitude of the PFS benefit clinically meaningful in the context of the overall survival trend?'), severity: t('高', 'High'), severityEn: 'High' },
        { q: t('生物标志物阴性亚组的疗效与总体人群相比如何？', 'How does the efficacy in the biomarker-negative subgroup compare to the overall population?'), severity: t('中', 'Medium'), severityEn: 'Medium' }
      ]
    },
    {
      category: t('安全性', 'Safety'),
      icon: ShieldAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      questions: [
        { q: t('与阳性对照相比，间质性肺病 (ILD) 的发生率和严重程度如何？', 'What is the incidence and severity of interstitial lung disease (ILD) compared to the active control?'), severity: t('高', 'High'), severityEn: 'High' },
        { q: t('是否有针对肝功能损害的充分剂量调整指南？', 'Are there adequate dose modification guidelines for hepatic impairment?'), severity: t('中', 'Medium'), severityEn: 'Medium' }
      ]
    },
    {
      category: t('人群外推性', 'Population Extrapolation'),
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      questions: [
        { q: t('鉴于试验人群主要为亚洲人，PK/PD 曲线如何桥接到美国人群？', 'Given the predominantly Asian trial population, how do PK/PD profiles bridge to the US demographic?'), severity: t('极高', 'Critical'), severityEn: 'Critical' },
        { q: t('基线疾病特征的分布是否代表了美国的临床实践？', 'Is the distribution of baseline disease characteristics representative of US clinical practice?'), severity: t('高', 'High'), severityEn: 'High' }
      ]
    },
    {
      category: t('CMC', 'CMC'),
      icon: FlaskConical,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
      questions: [
        { q: t('拟定的杂质商业放行标准是否有临床批次数据的充分论证？', 'Are the proposed commercial specifications for impurities adequately justified by clinical batch data?'), severity: t('中', 'Medium'), severityEn: 'Medium' },
        { q: t('请提供用于含量测定的新型分析方法的详细验证数据。', 'Provide detailed validation data for the novel analytical method used for assay determination.'), severity: t('高', 'High'), severityEn: 'High' }
      ]
    },
    {
      category: t('统计学', 'Statistics'),
      icon: BarChart3,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100',
      questions: [
        { q: t('请论证在主要疗效分析中使用非比例风险模型的合理性。', 'Justify the choice of the non-proportional hazards model used in the primary efficacy analysis.'), severity: t('中', 'Medium'), severityEn: 'Medium' }
      ]
    },
    {
      category: t('说明书', 'Labeling'),
      icon: FileText,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      questions: [
        { q: t('拟定的适应症声明比研究人群更广泛。请修改以反映特定的患者队列。', 'The proposed indication statement is broader than the studied population. Revise to reflect the specific patient cohort.'), severity: t('高', 'High'), severityEn: 'High' }
      ]
    },
    {
      category: t('核查', 'Inspection'),
      icon: Search,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100',
      questions: [
        { q: t('请解释 042 中心方案违背率较高的原因以及实施的 CAPA。', 'Explain the high rate of protocol deviations at Site 042 and the CAPA implemented.'), severity: t('中', 'Medium'), severityEn: 'Medium' }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t('FDA 重点审查问题预测', 'FDA Key Review Issues Prediction')}</h2>
        <p className="text-slate-500 mt-2">
          {t('基于类似肿瘤学申请的历史 FDA 审查报告和 CRL 预测的潜在信息请求 (IR) 和审查问题。', 'Potential Information Requests (IRs) and review questions predicted based on historical FDA review reports and CRLs for similar oncology applications.')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue, index) => {
          const Icon = issue.icon;
          return (
            <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${issue.bgColor} ${issue.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{issue.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {issue.questions.map((q, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex items-start justify-between mb-1">
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${
                          q.severityEn === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                          q.severityEn === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                          'border-amber-500 text-amber-700 bg-amber-50'
                        }`}>
                          {q.severity}
                        </Badge>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">"{q.q}"</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
