export type ExportLanguage = 'zh' | 'en';

export interface AnalysisExportContext {
  projectName: string;
  analysisName: string;
  analysisDate: string;
  fileCount: number;
  modules: string[];
}

export interface ReportSection {
  heading: string;
  paragraphs: string[];
}

const MODULE_ORDER = ['completeness', 'scientific', 'issues', 'copilot'] as const;

const SECTIONS: Record<
  (typeof MODULE_ORDER)[number],
  { zh: ReportSection; en: ReportSection }
> = {
  completeness: {
    zh: {
      heading: '1. 材料完整性检查',
      paragraphs: [
        '上传的 CDE 卷宗与 FDA eCTD 4.0 和 21 CFR Part 11 要求的比对。',
        '【摘要】发现 4 份缺失文件和 3 份需要大幅改写以符合 FDA 标准的文件。',
        '【缺失文件（示例）】',
        '• 模块 1 — Form FDA 356h：所有 NDA/BLA 申报的强制要求。（参考：21 CFR 314.50(a)）',
        '• 模块 1 — 禁止参与声明 (Debarment Certification)：关于不使用被禁止人员的强制声明。（参考：FD&C Act Section 306(k)(1)）',
        '• 模块 1 — 财务披露 (Financial Disclosure)：临床研究者需要提交 Form FDA 3454 或 3455。（参考：21 CFR Part 54）',
        '• 模块 5 — BIMO (生物研究监测) 数据清单：FDA 检查计划的强制要求。（参考：FDA BIMO Guidance）',
        '【需改写文件（示例）】',
        '• 模块 2 — 2.5 临床概述：CDE 版本过度侧重于中国人群数据。行动：重写以强调全球试验数据和美国人群外推性。',
        '• 模块 3 — 3.2.P.5 药品控制：缺少符合 FDA ICH Q2(R1) 期望的分析方法具体验证数据。行动：补充详细的验证报告和原始数据摘要。',
        '• 模块 5 — 5.3.5.1 疗效报告：SAP 偏差未按照 FDA 标准进行充分论证。行动：增加专门章节，通过敏感性分析论证所有 SAP 偏差的合理性。',
      ],
    },
    en: {
      heading: '1. Material Completeness',
      paragraphs: [
        'Comparison of the uploaded CDE dossier against FDA eCTD 4.0 and 21 CFR Part 11 requirements.',
        '[Summary] Four missing documents and three documents requiring significant rewrites to meet FDA standards were identified.',
        '[Missing documents (examples)]',
        '• Module 1 — Form FDA 356h: Required for all NDA/BLA submissions. (Ref: 21 CFR 314.50(a))',
        '• Module 1 — Debarment Certification: Mandatory statement regarding use of debarred persons. (Ref: FD&C Act Section 306(k)(1))',
        '• Module 1 — Financial Disclosure: Form FDA 3454 or 3455 required for clinical investigators. (Ref: 21 CFR Part 54)',
        '• Module 5 — BIMO Data Listings: Required for FDA inspection planning. (Ref: FDA BIMO Guidance)',
        '[Documents to rewrite (examples)]',
        '• Module 2 — 2.5 Clinical Overview: CDE version focuses heavily on Chinese population data. Action: Rewrite to emphasize global trial data and US population extrapolation.',
        '• Module 3 — 3.2.P.5 Control of Drug Product: Missing specific validation data for analytical procedures per FDA ICH Q2(R1). Action: Supplement with detailed validation reports and raw data summaries.',
        '• Module 5 — 5.3.5.1 Efficacy Reports: SAP deviations not fully justified per FDA standards. Action: Add a dedicated section justifying SAP deviations with sensitivity analyses.',
      ],
    },
  },
  scientific: {
    zh: {
      heading: '2. 科学性审查',
      paragraphs: [
        '对照 FDA 临床指南、美国指南和 PubMed 文献评估临床和 CMC 数据。',
        '【1. 研究设计科学性】（低风险）随机、双盲、阳性对照设计符合 FDA 对该适应症关键疗效试验的期望。FDA 参考：为人类药物和生物制品提供有效性的临床证据（行业指南）。',
        '【2. 关键科学终点】（中风险）虽然 PFS 是主要终点，但 FDA 最近强调了在特定 NSCLC 环境中的总生存期 (OS)。目前的 OS 数据尚不成熟。缺口：缺乏成熟的 OS 数据来支持 PFS 获益。建议：准备中期 OS 分析，并基于最近的 ODAC 会议为 PFS 作为替代终点提供强有力的论证。FDA 参考：用于批准抗癌药物和生物制品的临床试验终点。',
        '【3. 人群外推性】（高风险）关键问题：临床数据主要来自中国中心 (>85%)。FDA 要求数据适用于美国人群；多样性不足构成重大监管风险。行动：进行稳健的桥接研究，或提供广泛的 PK/PD 和疾病流行病学论证 (ICH E5)。FDA 参考：ICH E5 (R1)；FDA 多样性计划草案指南。',
        '【4. 统计学科学性】（低风险）SAP 中描述的统计方法总体上可以接受，并符合 ICH E9。通过多重插补处理缺失数据是合适的。',
        '【5. CMC / 检查风险】（中风险）商业化放大的工艺验证文件可能存在缺口。观察：PPQ 批次期间的三个主要偏差已关闭，但根本原因分析缺乏 FDA 检查员期望的深度。行动：加强模块 3 中关于偏差关闭的叙述，并准备 PAI 审查。',
      ],
    },
    en: {
      heading: '2. Scientific Validity Review',
      paragraphs: [
        'Evaluation of clinical and CMC data against FDA clinical guidance, US guidelines, and PubMed literature.',
        '[1. Study Design Validity] (Low Risk) Randomized, double-blind, active-controlled design aligns with FDA expectations for pivotal efficacy trials. FDA Reference: Providing Clinical Evidence of Effectiveness for Human Drug and Biological Products.',
        '[2. Key Scientific Endpoints] (Medium Risk) While PFS is primary, FDA has emphasized OS in this NSCLC setting; OS data are immature. Gap: Lack of mature OS data to support PFS benefit. Recommendation: Prepare interim OS analysis and strong justification for PFS as a surrogate per recent ODAC precedent. FDA Reference: Clinical Trial Endpoints for the Approval of Cancer Drugs and Biologics.',
        '[3. Population Extrapolation] (High Risk) Critical issue: clinical data predominantly from Chinese sites (>85%). FDA requires applicability to the US population; lack of diversity poses significant regulatory risk. Action: Robust bridging study or extensive PK/PD and disease epidemiology justification (ICH E5). FDA Reference: ICH E5 (R1); FDA Draft Guidance on diversity plans.',
        '[4. Statistical Validity] (Low Risk) Statistical methods in the SAP are generally acceptable and align with ICH E9. Multiple imputation for missing data is appropriate.',
        '[5. CMC / Inspection Risk] (Medium Risk) Potential gaps in process validation documentation for commercial scale-up. Observation: Three major PPQ deviations closed but RCA depth may be insufficient. Action: Strengthen Module 3 narrative and prepare for PAI scrutiny.',
      ],
    },
  },
  issues: {
    zh: {
      heading: '3. FDA 重点审查问题预测',
      paragraphs: [
        '基于类似肿瘤学申请的历史 FDA 审查报告和 CRL 预测的潜在信息请求 (IR) 和审查问题。',
        '【有效性】',
        '• [高] 在总生存期趋势的背景下，PFS 获益的幅度是否具有临床意义？',
        '• [中] 生物标志物阴性亚组的疗效与总体人群相比如何？',
        '【安全性】',
        '• [高] 与阳性对照相比，间质性肺病 (ILD) 的发生率和严重程度如何？',
        '• [中] 是否有针对肝功能损害的充分剂量调整指南？',
        '【人群外推性】',
        '• [极高] 鉴于试验人群主要为亚洲人，PK/PD 曲线如何桥接到美国人群？',
        '• [高] 基线疾病特征的分布是否代表了美国的临床实践？',
        '【CMC】',
        '• [中] 拟定的杂质商业放行标准是否有临床批次数据的充分论证？',
        '• [高] 请提供用于含量测定的新型分析方法的详细验证数据。',
        '【统计学】',
        '• [中] 请论证在主要疗效分析中使用非比例风险模型的合理性。',
        '【说明书】',
        '• [高] 拟定的适应症声明比研究人群更广泛。请修改以反映特定的患者队列。',
        '【核查】',
        '• [中] 请解释 042 中心方案违背率较高的原因以及实施的 CAPA。',
      ],
    },
    en: {
      heading: '3. Predicted Key FDA Review Issues',
      paragraphs: [
        'Potential IRs and review questions predicted from historical FDA reviews and CRLs for similar oncology applications.',
        '[Efficacy]',
        '• [High] Is the magnitude of the PFS benefit clinically meaningful in the context of the overall survival trend?',
        '• [Medium] How does efficacy in the biomarker-negative subgroup compare to the overall population?',
        '[Safety]',
        '• [High] What is the incidence and severity of ILD compared to the active control?',
        '• [Medium] Are there adequate dose modification guidelines for hepatic impairment?',
        '[Population Extrapolation]',
        '• [Critical] Given a predominantly Asian trial population, how do PK/PD profiles bridge to the US demographic?',
        '• [High] Is the distribution of baseline disease characteristics representative of US clinical practice?',
        '[CMC]',
        '• [Medium] Are commercial impurity specifications adequately justified by clinical batch data?',
        '• [High] Provide detailed validation data for the novel analytical method used for assay determination.',
        '[Statistics]',
        '• [Medium] Justify the choice of the non-proportional hazards model used in the primary efficacy analysis.',
        '[Labeling]',
        '• [High] The proposed indication is broader than the studied population; revise to reflect the specific cohort.',
        '[Inspection]',
        '• [Medium] Explain the high protocol deviation rate at Site 042 and CAPA implemented.',
      ],
    },
  },
  copilot: {
    zh: {
      heading: '4. 回复草拟助手 (Copilot)',
      paragraphs: [
        '选择一个预测的 FDA 问题，基于 FDA 指南和先例生成逻辑分析和回复草稿。',
        '【预测问题列表】',
        '• 人群外推性：鉴于试验人群主要为亚洲人（>85%），PK/PD 曲线如何桥接到美国人群？',
        '• 有效性：在总生存期趋势的背景下，PFS 获益的幅度是否具有临床意义？',
        '• 安全性：与阳性对照相比，间质性肺病 (ILD) 的发生率和严重程度如何？',
        '【示例回复草稿（节选）】',
        '基于 ICH E5 和 FDA 关于人群外推性的指南，我们建议采取以下回复策略：',
        '1) PK/PD 桥接：提供全面的群体 PK 分析，证明种族/民族不会显著影响研究药物的药代动力学。',
        '2) 疾病流行病学：提交文献，确认该适应症的疾病生物学和标准治疗在亚洲和美国人群中一致。',
        '3) 亚组分析：重点展示非亚洲亚组的疗效和安全性结果，显示与整体试验结果的一致性。',
        '参考依据：ICH E5(R1), FDA 多样性相关指南。',
      ],
    },
    en: {
      heading: '4. Response Drafting Copilot',
      paragraphs: [
        'Select a predicted FDA issue to generate analysis and draft responses based on FDA guidance and precedent.',
        '[Predicted issues]',
        '• Population extrapolation: Given a predominantly Asian trial population (>85%), how do PK/PD profiles bridge to the US demographic?',
        '• Efficacy: Is the magnitude of the PFS benefit clinically meaningful in the context of the OS trend?',
        '• Safety: What is the incidence and severity of ILD compared to the active control?',
        '[Example draft response (excerpt)]',
        'Based on ICH E5 and FDA guidance on population extrapolation, we propose:',
        '1) PK/PD bridging: provide population PK analysis demonstrating race/ethnicity does not materially impact PK.',
        '2) Disease epidemiology: literature confirming consistent disease biology and standard of care between regions.',
        '3) Subgroup analysis: highlight non-Asian subgroup efficacy/safety consistency with overall results.',
        'References: ICH E5(R1); FDA guidance on diversity and extrapolation.',
      ],
    },
  },
};

export function getOrderedSectionsForModules(
  lang: ExportLanguage,
  modules: string[]
): ReportSection[] {
  const set = new Set(modules);
  const out: ReportSection[] = [];
  for (const id of MODULE_ORDER) {
    if (!set.has(id)) continue;
    out.push(SECTIONS[id][lang]);
  }
  return out;
}

export function buildReportTitle(lang: ExportLanguage): string {
  return lang === 'zh' ? 'FDA NDA/BLA 差距分析报告' : 'FDA NDA/BLA Gap Analysis Report';
}

export function buildReportSubtitle(lang: ExportLanguage): string {
  return lang === 'zh' ? '目标：NDA - 非小细胞肺癌' : 'Target: NDA - Non-Small Cell Lung Cancer';
}
