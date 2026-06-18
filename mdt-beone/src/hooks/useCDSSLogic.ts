import { useState, useCallback } from 'react';
import type { CDSSResponse, Concept, MissingInput, Citation, Treatment } from '@/types';
import { SCENARIOS } from '@/mockData';

const EMPTY_RESPONSE: CDSSResponse = {
  diagnosisTitle: '',
  diagnosisStatus: 'unclear',
  concepts: [],
  missingInputs: [],
  treatments: [],
  guidelines: [],
  citations: [],
  exams: [],
};

function buildMockResponse(): CDSSResponse {
  const citations: Citation[] = [
    {
      id: 'c1',
      index: 1,
      title: 'CSCO 淋巴瘤诊疗指南 2024',
      sourceType: 'guideline',
      journal: 'CSCO',
      guidelineLocation: {
        section: '第3章 弥漫大B细胞淋巴瘤',
        subsection: '3.1 一线治疗',
        excerpt: 'R-CHOP 仍为初治 DLBCL 的基础方案；维泊妥珠单抗联合 R-CHP（Pola-R-CHP）已获 I 级推荐，成为初治 DLBCL 首选方案之一。POLARIX 研究证实，与 R-CHOP 相比，Pola-R-CHP 在亚洲人群中 2 年疾病进展风险降低约 36%，并可获得更深分子学缓解。',
        pageLabel: 'P.12',
      },
    },
    {
      id: 'c2',
      index: 2,
      title: 'NCCN B-Cell Lymphomas V.1.2024',
      sourceType: 'guideline',
      journal: 'NCCN',
      guidelineLocation: {
        section: 'DLBCL - First-Line Therapy',
        subsection: 'Stage I-II (limited stage)',
        excerpt: 'For Ann Arbor I-II stage DLBCL (excluding extensive mesenteric involvement), Pola-R-CHP (polatuzumab vedotin + rituximab + cyclophosphamide + doxorubicin + prednisone) is recommended as Category 1 for first-line treatment.',
        pageLabel: 'DLBCL-3',
      },
    },
    {
      id: 'c3',
      index: 3,
      title: 'POLARIX: Polatuzumab vedotin + R-CHP in DLBCL',
      sourceType: 'pubmed',
      journal: 'Lancet',
      year: '2022',
      impactFactor: '168.9',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35483363/',
      abstract:
        'Phase III trial; Pola-R-CHP vs R-CHOP in previously untreated DLBCL. 2-year PFS 76.7% vs 70.2%, HR 0.73. Supports Pola-R-CHP as first-line option.',
    },
    {
      id: 'c4',
      index: 4,
      title: 'GOYA: Obinutuzumab plus CHOP versus Rituximab plus CHOP in DLBCL',
      sourceType: 'pubmed',
      journal: 'J Clin Oncol',
      year: '2019',
      impactFactor: '45.3',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30932798/',
      abstract:
        'GOYA phase III: G-CHOP vs R-CHOP in DLBCL. No significant PFS benefit for G-CHOP in unselected population; biomarker-driven studies ongoing.',
    },
    {
      id: 'c5',
      index: 5,
      title: 'IPI and R-IPI in the rituximab era',
      sourceType: 'pubmed',
      journal: 'Blood',
      year: '2020',
      impactFactor: '25.5',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31934966/',
      abstract:
        'Validation of IPI and revised IPI for prognostic stratification in R-CHOP–treated DLBCL. R-IPI identifies very good, good, poor risk groups.',
    },
  ];
  const concepts: Concept[] = [
    { id: 'co1', text: 'DLBCL', confirmed: true, isCritical: true },
    { id: 'co2', text: 'GCB亚型', confirmed: true },
    { id: 'co3', text: 'III期 A', confirmed: true },
  ];
  const missingInputs: MissingInput[] = [
    { id: 'm1', label: 'LDH (乳酸脱氢酶) 水平', type: 'select', options: ['正常', '升高 (>245 U/L)'], allowEmpty: true, requiredFor: '解锁分期与预后评分', guidelineName: 'IPI 评分关键因子' },
    { id: 'm2', label: 'HBsAg (乙肝表面抗原)', type: 'select', options: ['阴性', '阳性'], allowEmpty: true, requiredFor: '用药安全与联合用药禁忌判断', guidelineName: '免疫治疗安全性筛查' },
  ];
  const treatments: Treatment[] = [
    { id: 't1', name: 'R-CHOP 方案 x 6周期', description: '标准一线治疗方案。利妥昔单抗 + 环磷酰胺 + 多柔比星 + 长春新碱 + 泼尼松。', evidenceLevel: '1', citationIndices: [1, 2] },
    { id: 't2', name: 'Pola-R-CHP 方案 x 6周期', description: '基于 POLARIX 研究，对于 IPI 2-5 分的初治 DLBCL 患者，PFS 获益优于 R-CHOP。', evidenceLevel: '1', citationIndices: [2, 3] },
  ];
    return {
    diagnosisTitle: '明确诊断：DLBCL, GCB亚型, III期 A',
    diagnosisStatus: 'confirmed',
    concepts,
    missingInputs,
    treatments,
    guidelines: [
      {
        id: 'csco-2024',
        name: 'CSCO 淋巴瘤诊疗指南 2024',
        type: 'primary',
        recommendations: [
          { topic: '一线治疗基础方案', content: 'R-CHOP 仍为初治 DLBCL 的基础方案；维泊妥珠单抗联合 R-CHP（Pola-R-CHP）已获 I 级推荐，成为初治 DLBCL 首选方案之一。POLARIX 研究证实，与 R-CHOP 相比，Pola-R-CHP 在亚洲人群中 2 年疾病进展风险降低约 36%，并可获得更深分子学缓解。', evidenceLevel: 'I级' },
          { topic: '适用人群', content: '推荐考虑 6 周期 Pola-R-CHP 的患者：年龄 <60 岁初治患者中，低危伴大肿块或中低危、中高危、高危患者；年龄 60～80 岁且无心功能不全者。', evidenceLevel: 'I级' },
          { topic: '个体化与分层', content: '需结合年龄、体能、临床分期、病理类型及分子遗传学特征制定方案。中期 PET/CT 未达 CR 且身体可耐受者，可考虑加用「X」药物；存在结外受累等高危因素者应接受更积极方案。', evidenceLevel: 'II级' },
          { topic: '复发/难治 DLBCL', content: '格菲妥单抗（CD3/CD20 双抗）首次纳入指南，对 ≥2 次复发/进展患者为 II 级推荐；完全缓解率约 40%，CAR-T 经治人群仍可有约 37% CR 率。', evidenceLevel: 'II级' },
        ],
      },
      {
        id: 'nccn-2024',
        name: 'NCCN B-Cell Lymphomas V.1.2024',
        type: 'reference',
        recommendations: [
          { topic: '局限期 (I-II 期)', content: '对于 Ann Arbor I-II 期 DLBCL（排除广泛肠系膜受累），Pola-R-CHP（polatuzumab vedotin + rituximab + cyclophosphamide + doxorubicin + prednisone）已作为 Category 1 推荐纳入一线治疗选项。', evidenceLevel: 'Category 1' },
          { topic: '双打击/三打击', content: '伴有 MYC 与 BCL2 重排的高级别 B 细胞淋巴瘤，Pola-R-CHP 同样作为推荐的一线治疗选择之一。', evidenceLevel: 'Category 1' },
          { topic: '一线标准与疗效', content: 'R-CHOP 仍为公认的一线标准方案，多数患者可获得长期缓解（>60%）。Pola-R-CHP 的加入代表一线治疗在循证基础上的演进，需根据患者特征与疾病特点个体化选择。', evidenceLevel: 'Category 1' },
        ],
      },
      {
        id: 'caca-lymphoma',
        name: '中国抗癌协会淋巴瘤诊疗指南',
        type: 'reference',
        recommendations: [
          { topic: '诊断与分期', content: '确诊依赖病理（形态+免疫组化±FISH）；分期采用 Ann Arbor 分期，建议结合 IPI 评分进行预后分层。LDH、结外受累部位数、ECOG、年龄与分期为 IPI 五项因子。', evidenceLevel: '共识' },
          { topic: '用药前筛查', content: '使用利妥昔单抗前必须筛查 HBsAg；阳性者需 HBV DNA 定量并预防性抗病毒治疗，以降低乙肝再激活风险。', evidenceLevel: '共识' },
        ],
      },
      {
        id: 'esmo-dlbcl',
        name: 'ESMO 弥漫大 B 细胞淋巴瘤临床实践指南',
        type: 'reference',
        recommendations: [
          { topic: '一线治疗', content: '初治 DLBCL 一线推荐 R-CHOP 或 Pola-R-CHP（依据 POLARIX 等证据）；疗程通常 6 周期，部分局限期可考虑 4 周期联合放疗。', evidenceLevel: 'I级' },
          { topic: '随访', content: '治疗结束后 2 年内每 3 个月复查，3～5 年每 6 个月，5 年后每年复查；复查包括病史、体格检查、血常规、LDH 及影像（CT/MRI 或 PET-CT 按需）。', evidenceLevel: '共识' },
        ],
      },
    ],
    citations,
    comprehensiveAnalysis: `## 结论（可执行推荐）
对于**初治 DLBCL（GCB，III 期）**，一线可选 **R-CHOP** 或 **Pola-R-CHP**，优先依据指南推荐与患者风险分层 [1][2]；当 IPI 2–5 分等中高危时，Pola-R-CHP 在随机对照研究中显示 PFS 获益 [3]。

## 证据概览（从“指南”到“研究”）
- **指南一致性**：CSCO/NCCN/ESMO 等均将 R-CHOP 作为一线基础方案，并将 Pola-R-CHP 纳入一线选项 [1][2]。
- **随机对照研究**：POLARIX 显示 Pola-R-CHP 相比 R-CHOP 改善 2 年 PFS（HR 0.73）[3]。
- **阴性证据提醒**：GOYA 未证实以 G-CHOP 替代 R-CHOP 在总体 DLBCL 人群带来 PFS 优势，提示“换 CD20 抗体”并非普适增益 [4]。
- **风险分层**：治疗决策与预后评估建议使用 IPI/R-IPI [5]。

## 方案选择（怎么选）
### R-CHOP（标准一线）
- **适用**：大多数初治 DLBCL [1][2]。
- **优势**：长期随访证据充分，方案成熟。
- **需要补齐**：LDH、结外受累、ECOG 等用于 IPI 评分（影响风险分层与方案倾向）[5]。

### Pola-R-CHP（强化一线选项）
- **适用**：初治 DLBCL，尤其 IPI 2–5 分者更匹配研究获益人群 [3]。
- **证据要点**：随机对照提示 PFS 获益 [3]；需结合毒性谱与患者合并症个体化 [1][2]。

## 安全性与注意事项
- **HBsAg 阳性**：利妥昔单抗相关治疗前需进行 HBV 风险评估与预防性抗病毒，以降低再激活风险 [1][2]。`,
    
    
  exams: [
      { id: 'e1', name: '乙肝病毒 DNA 定量', purpose: '若 HBsAg 阳性，需评估病毒载量并预防性抗病毒' },
      { id: 'e2', name: '超声心动图 (LVEF)', purpose: '评估基线心功能，指导蒽环类药物使用' },
    ],
  };
}

export type PatientContextState = {
  unstructuredText: string;
  structuredData?: Record<string, string>;
};

export function useCDSSLogic() {
  const [patientContext, setPatientContext] = useState<PatientContextState>({ unstructuredText: '', structuredData: {} });
  const [response, setResponse] = useState<CDSSResponse>(EMPTY_RESPONSE);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadScenario = useCallback((id: string) => {
    const scenario = SCENARIOS[id] ?? Object.values(SCENARIOS)[0];
    if (scenario) {
      setPatientContext({ unstructuredText: scenario.initialText, structuredData: {} });
      setCurrentScenarioId(scenario.id);
      setResponse(buildMockResponse());
    }
  }, []);

  const checkPII = useCallback((text: string) => {
    const phone = /\d{11}/.test(text);
    const idCard = /\d{17}[\dXx]/.test(text);
    let maskedText = text;
    if (phone) maskedText = maskedText.replace(/\d{11}/g, '***手机号***');
    if (idCard) maskedText = maskedText.replace(/\d{17}[\dXx]/g, '***身份证***');
    return { hasPII: phone || idCard, maskedText };
  }, []);

  const confirmConcept = useCallback((id: string) => {
    setResponse(prev => ({
      ...prev,
      concepts: prev.concepts.map(c => c.id === id ? { ...c, confirmed: true } : c),
    }));
  }, []);

  const updateConcept = useCallback((id: string, text: string) => {
    setResponse(prev => ({
      ...prev,
      concepts: prev.concepts.map(c => c.id === id ? { ...c, text } : c),
    }));
  }, []);

  const updateMissingInput = useCallback((id: string, value: string) => {
    setResponse(prev => ({
      ...prev,
      missingInputs: prev.missingInputs.map(m => m.id === id ? { ...m, label: m.label } : m),
    }));
  }, []);

  const runAnalysis = useCallback(() => {
    setResponse(buildMockResponse());
  }, []);

  return {
    patientContext,
    setPatientContext,
    response,
    checkPII,
    confirmConcept,
    updateConcept,
    updateMissingInput,
    loadScenario,
    currentScenarioId,
    isAnalyzing,
    runAnalysis,
  };
}
