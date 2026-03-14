/**
 * Content Studio 中英双语 Mock：学术问答与内容生产示例
 * 展示：智能问答、创作模式、证据绑定、冲突标注、适用边界、参考文献
 */

export interface StructuredConclusion {
  text: string;
  citations: { evidenceId: string; label: string }[];
}

export interface EvidenceSummaryItem {
  design: string;
  sample: string;
  endpoint: string;
  evidenceId: string;
}

export interface ReferenceItem {
  id: string;
  short: string;
  full: string;
  evidenceId: string;
}

export interface ContentStudioMockLocale {
  modeQA: string;
  modeCreation: string;
  modeMaterial: string;
  sampleQuestion: string;
  sectionConclusion: string;
  sectionEvidenceSummary: string;
  sectionDiscussionBoundary: string;
  sectionReferences: string;
  conclusionParagraph: string;
  evidenceSummaryItems: EvidenceSummaryItem[];
  labelDesign: string;
  labelSample: string;
  labelEndpoint: string;
  discussionParagraph: string;
  applicabilityBoundary: string;
  conflictCallout: string;
  references: ReferenceItem[];
  outlineTitle: string;
  outlineSections: { title: string; evidenceId?: string }[];
  creationTopicPlaceholder: string;
  creationTopicExample: string;
  generatedModuleTitle: string;
  generatedParagraphs: { text: string; evidenceIds: string[] }[];
  exportWord: string;
  exportTxt: string;
  exportPpt: string;
  uploadPdfHint: string;
  materialHint: string;
  generateOutline: string;
  confirmOutline: string;
  generateByModule: string;
}

const EN: ContentStudioMockLocale = {
  modeQA: 'Q&A',
  modeCreation: 'Content creation',
  modeMaterial: 'Material-enhanced',
  sampleQuestion: 'What is the efficacy of sotatercept in PAH across different baseline functional classes?',
  sectionConclusion: 'Conclusion',
  sectionEvidenceSummary: 'Evidence summary',
  sectionDiscussionBoundary: 'Discussion & applicability',
  sectionReferences: 'References',
  conclusionParagraph: 'Sotatercept as add-on therapy significantly improves exercise capacity (6MWD) in PAH, with consistent efficacy across baseline functional class (FC) II and III subgroups [1][2]. The treatment effect is supported by the STELLAR phase 3 trial and its subgroup analyses presented at ASCO 2025.',
  evidenceSummaryItems: [
    { design: 'Phase 3, double-blind, placebo-controlled', sample: 'N=323', endpoint: 'Primary: change in 6MWD at 24 weeks', evidenceId: 'ev-1' },
    { design: 'Pre-specified subgroup by baseline FC', sample: 'FC II vs FC III', endpoint: '6MWD improvement 38.2m vs 42.1m', evidenceId: 'ev-5' }
  ],
  labelDesign: 'Design',
  labelSample: 'N',
  labelEndpoint: 'Endpoint',
  discussionParagraph: 'Current evidence is from adults on background PAH therapy. Long-term extension data suggest sustained benefit up to 24 months [3].',
  applicabilityBoundary: 'Applicability: Not studied in paediatric PAH or severe hepatic impairment; see EMA SmPC [4].',
  conflictCallout: 'Note: One post hoc analysis suggested numerical differences in a small subgroup; this was not pre-specified and should be interpreted with caution.',
  references: [
    { id: '1', short: 'NEJM 2025; Sotatercept in PAH', full: 'Efficacy and Safety of Sotatercept for Pulmonary Arterial Hypertension. New England Journal of Medicine. July 2025.', evidenceId: 'ev-1' },
    { id: '2', short: 'STELLAR Phase 3', full: 'STELLAR Phase 3 Trial. ClinicalTrials.gov. Ongoing (Late 2025).', evidenceId: 'ev-2' },
    { id: '3', short: 'Long-term outcomes in PAH', full: 'Long-term outcomes in PAH. Journal of Heart and Lung Transplantation. June 15, 2025.', evidenceId: 'ev-4' },
    { id: '4', short: 'EMA SmPC Sotatercept', full: 'EMA summary of product characteristics: Sotatercept. European Medicines Agency. March 2025.', evidenceId: 'ev-6' }
  ],
  outlineTitle: 'Recommended outline',
  outlineSections: [
    { title: '1. Background and mechanism' },
    { title: '2. STELLAR trial: efficacy by baseline FC', evidenceId: 'ev-5' },
    { title: '3. Safety and tolerability', evidenceId: 'ev-1' },
    { title: '4. Applicability and limitations', evidenceId: 'ev-6' }
  ],
  creationTopicPlaceholder: 'Enter topic or requirement (e.g. “STELLAR subgroup summary for internal slide”)',
  creationTopicExample: 'STELLAR subgroup analysis summary for internal use',
  generatedModuleTitle: '2. STELLAR trial: efficacy by baseline FC',
  generatedParagraphs: [
    {
      text: 'In the STELLAR phase 3 trial, sotatercept demonstrated consistent efficacy across pre-specified subgroups. For patients in FC II at baseline, the mean change in 6-minute walk distance (6MWD) was +38.2 m; for FC III, +42.1 m, with no significant treatment-by-subgroup interaction.',
      evidenceIds: ['ev-1', 'ev-5']
    },
    {
      text: 'Adverse events were predominantly mild to moderate; telangiectasia was the most frequently reported treatment-related AE. Long-term extension data support sustained benefit up to 24 months.',
      evidenceIds: ['ev-1', 'ev-4']
    }
  ],
  exportWord: 'Export Word',
  exportTxt: 'Export TXT',
  exportPpt: 'Export PPT',
  uploadPdfHint: 'Upload PDF / abstract as priority evidence source',
  materialHint: 'Content will be generated from uploaded materials first; otherwise same as creation mode.',
  generateOutline: 'Generate outline',
  confirmOutline: 'Confirm outline',
  generateByModule: 'Generate by section',
};

const ZH: ContentStudioMockLocale = {
  modeQA: '问答',
  modeCreation: '创作',
  modeMaterial: '材料增强',
  sampleQuestion: 'Sotatercept 在不同基线功能分级 PAH 患者中的疗效如何？',
  sectionConclusion: '结论',
  sectionEvidenceSummary: '证据摘要',
  sectionDiscussionBoundary: '讨论与适用边界',
  sectionReferences: '参考文献',
  conclusionParagraph: 'Sotatercept 作为附加治疗可显著改善 PAH 患者运动耐量（6MWD），在基线功能分级（FC）II 与 III 亚组中疗效一致 [1][2]。该疗效获 STELLAR III 期试验及 ASCO 2025 亚组分析支持。',
  evidenceSummaryItems: [
    { design: 'III 期、双盲、安慰剂对照', sample: 'N=323', endpoint: '主要终点：24 周时 6MWD 变化', evidenceId: 'ev-1' },
    { design: '按基线 FC 预设亚组', sample: 'FC II vs FC III', endpoint: '6MWD 改善 38.2m vs 42.1m', evidenceId: 'ev-5' }
  ],
  labelDesign: '研究设计',
  labelSample: 'N',
  labelEndpoint: '终点',
  discussionParagraph: '现有证据来自接受背景 PAH 治疗的成人患者。长期扩展数据提示获益可持续至 24 个月 [3]。',
  applicabilityBoundary: '适用边界：未在儿童 PAH 或严重肝功能损害人群中研究；参见 EMA SmPC [4]。',
  conflictCallout: '说明：一项事后分析在少数亚组中观察到数值差异，该分析非预设，解读需谨慎。',
  references: [
    { id: '1', short: 'NEJM 2025；Sotatercept 用于 PAH', full: 'Efficacy and Safety of Sotatercept for Pulmonary Arterial Hypertension. 新英格兰医学杂志. 2025年7月.', evidenceId: 'ev-1' },
    { id: '2', short: 'STELLAR III 期', full: 'STELLAR Phase 3 Trial. ClinicalTrials.gov. 进行中（2025 年底）. ', evidenceId: 'ev-2' },
    { id: '3', short: 'PAH 长期结局', full: 'Long-term outcomes in PAH. 心肺移植杂志. 2025年6月15日.', evidenceId: 'ev-4' },
    { id: '4', short: 'EMA SmPC Sotatercept', full: 'EMA 产品特性摘要：Sotatercept. 欧洲药品管理局. 2025年3月.', evidenceId: 'ev-6' }
  ],
  outlineTitle: '推荐大纲',
  outlineSections: [
    { title: '1. 背景与机制' },
    { title: '2. STELLAR 试验：按基线 FC 的疗效', evidenceId: 'ev-5' },
    { title: '3. 安全性与耐受性', evidenceId: 'ev-1' },
    { title: '4. 适用性与局限性', evidenceId: 'ev-6' }
  ],
  creationTopicPlaceholder: '输入创作主题或需求（如“STELLAR 亚组摘要用于内部幻灯”）',
  creationTopicExample: 'STELLAR 亚组分析摘要（内部使用）',
  generatedModuleTitle: '2. STELLAR 试验：按基线 FC 的疗效',
  generatedParagraphs: [
    {
      text: '在 STELLAR III 期试验中，sotatercept 在预设亚组中疗效一致。基线 FC II 患者 6 分钟步行距离（6MWD）平均变化为 +38.2 m，FC III 为 +42.1 m，治疗与亚组无显著交互作用。',
      evidenceIds: ['ev-1', 'ev-5']
    },
    {
      text: '不良事件多为轻至中度，毛细血管扩张为最常见的治疗相关 AE。长期扩展数据支持获益可持续至 24 个月。',
      evidenceIds: ['ev-1', 'ev-4']
    }
  ],
  exportWord: '导出 Word',
  exportTxt: '导出 TXT',
  exportPpt: '导出 PPT',
  uploadPdfHint: '上传 PDF / 会议摘要作为优先证据源',
  materialHint: '上传材料后将优先基于材料生成内容；未上传时与创作模式一致。',
  generateOutline: '生成大纲',
  confirmOutline: '确认大纲',
  generateByModule: '分模块生成',
};

export type ContentStudioLocale = 'en' | 'zh';

export function getContentStudioMock(locale: ContentStudioLocale): ContentStudioMockLocale {
  return locale === 'zh' ? ZH : EN;
}
