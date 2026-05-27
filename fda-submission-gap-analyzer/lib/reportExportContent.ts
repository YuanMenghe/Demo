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

const MODULE_ORDER = ['completeness', 'scientific', 'issues'] as const;

const SECTIONS: Record<
  (typeof MODULE_ORDER)[number],
  { zh: ReportSection; en: ReportSection }
> = {
  completeness: {
    zh: {
      heading: '1. 材料完整性检查（M1–M5）',
      paragraphs: [
        '输入范围：M1–M5 卷宗。',
        '【形式完整性 · 内容缺失项清单】',
        '• M1 — Form FDA 356h：申报表缺失。（参考：21 CFR 314.50(a)）',
        '• M1 — 禁止参与声明、财务披露：强制项未完整提交。',
        '• M5 — BIMO 数据清单：检查计划所需清单缺失。',
        '• M2 — 2.7.3 临床安全性总结（完整版）：仅有摘要版本。',
        '【内容完整性 · 技术完整性报告】',
        '• M1：部分通过 — 行政表格齐全，eCTD XML 元数据校验记录缺失。',
        '• M2：需补充 — 2.5 临床概述人群适用性论证不足；与 M3 交叉引用编号不一致。',
        '• M3：需补充 — 3.2.P.5 方法验证深度不足；PPQ 偏差 RCA 叙述不充分。',
        '• M4：通过 — 非临床结构完整。',
        '• M5：需补充 — SAP 偏离论证不足；CSR 与统计附录数据集锁定版本不一致。',
      ],
    },
    en: {
      heading: '1. Material completeness (M1–M5)',
      paragraphs: [
        'Input scope: Modules M1–M5 dossier.',
        '[Formal completeness · Missing content list]',
        '• M1 — Form FDA 356h: application form missing. (Ref: 21 CFR 314.50(a))',
        '• M1 — Debarment / financial disclosure: mandatory items incomplete.',
        '• M5 — BIMO listings: required for inspection planning.',
        '• M2 — 2.7.3 Clinical Safety Summary (complete): only abbreviated version present.',
        '[Content completeness · Technical integrity report]',
        '• M1: Partial — admin forms OK; eCTD XML metadata validation log missing.',
        '• M2: Needs work — 2.5 overview lacks applicability structure; M3 cross-refs inconsistent.',
        '• M3: Needs work — 3.2.P.5 validation depth insufficient; PPQ deviation RCA shallow.',
        '• M4: Pass — nonclinical structure complete.',
        '• M5: Needs work — SAP deviation justification weak; dataset lock versions inconsistent.',
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
      heading: '3. 可能的审查问题预测',
      paragraphs: [
        '基于同类适应症历史审评报告、CRL 与公开先例预测的潜在信息请求与审查问题。',
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
      heading: '3. Predicted review questions',
      paragraphs: [
        'Potential IRs and review questions predicted from historical reviews, CRLs, and precedent for similar indications.',
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
  return lang === 'zh' ? '申报审查分析报告' : 'Submission review report';
}

export function buildReportSubtitle(lang: ExportLanguage): string {
  return lang === 'zh' ? '输入范围：M1–M5 · NDA 非小细胞肺癌' : 'Scope: M1–M5 · NDA NSCLC';
}
