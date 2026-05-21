import { CDSSResponse } from './types';

export const SCENARIOS = {
  case1: {
    id: 'case1',
    name: '演示案例 1: 初治 DLBCL (标准/Pola-R-CHP)',
    text: `患者男性，65岁。
主诉：发现左侧颈部包块2月余，伴乏力。
现病史：2月前无意中发现左侧颈部包块，无痛性，进行性增大。无发热、盗汗、体重下降（无B症状）。
查体：ECOG评分 1分。双侧颈部、左侧腋窝可触及多个肿大淋巴结，最大约3.5*4cm，质硬，活动度差。脾肋下未及。
辅助检查：
1. 病理活检（左颈部淋巴结）：弥漫大B细胞淋巴瘤 (DLBCL), 非特指型 (NOS), GCB亚型。
2. 免疫组化：CD20(+), CD19(+), CD3(-), Ki-67(80%+), BCL2(+), BCL6(+), MYC(-)。EBER(-)。
3. PET-CT：双侧颈部、左侧腋窝、纵隔多发高代谢淋巴结，SUVmax 12.5；腹膜后未见肿大淋巴结。骨髓穿刺活检阴性。Ann Arbor 分期 III期 A。
4. 既往史：高血压病史5年，服用降压药控制平稳。否认肝炎、结核病史。`,
    response: {
      snapshotId: 'snap_case1_dlbcl_v2',
      diagnosisStatus: 'confirmed',
      diagnosisTitle: '明确诊断：DLBCL, GCB亚型, III期 A',
      concepts: [
        { id: 'c1', text: '弥漫大B细胞淋巴瘤', type: 'disease', confidence: 0.99, isCritical: true, confirmed: true },
        { id: 'c2', text: 'GCB亚型', type: 'disease', confidence: 0.95, isCritical: true, confirmed: true },
        { id: 'c3', text: 'Ann Arbor III期', type: 'disease', confidence: 0.92, isCritical: true, confirmed: true },
        { id: 'c4', text: 'Ki-67 80%', type: 'other', confidence: 0.98, isCritical: false, confirmed: true },
        { id: 'c5', text: '无B症状', type: 'symptom', confidence: 0.90, isCritical: false, confirmed: true },
        { id: 'c6', text: 'ECOG 1分', type: 'other', confidence: 0.95, isCritical: true, confirmed: true },
        { id: 'c7', text: 'MYC(-)', type: 'gene', confidence: 0.99, isCritical: true, confirmed: true },
      ],
      missingInputs: [
        { id: 'm1', label: 'LDH (乳酸脱氢酶) 水平', type: 'select', options: ['正常', '升高 (>245 U/L)'], requiredFor: 'prognosis', guidelineName: 'IPI 评分关键因子', allowEmpty: true },
        { id: 'm2', label: 'HBsAg (乙肝表面抗原)', type: 'select', options: ['阴性', '阳性'], requiredFor: 'treatment_safety', guidelineName: '免疫治疗安全性筛查', allowEmpty: true }
      ],
      guidelines: [
        { name: 'CSCO 淋巴瘤诊疗指南 2024', type: 'primary', status: 'active' },
        { name: 'NCCN B-Cell Lymphomas V.1.2024', type: 'secondary', status: 'active' }
      ],
      exams: [
        { id: 'e1', name: '乙肝病毒 DNA 定量', purpose: '若 HBsAg 阳性，需评估病毒载量并预防性抗病毒', evidence: '强推荐' },
        { id: 'e2', name: '超声心动图 (LVEF)', purpose: '评估基线心功能，指导蒽环类药物使用', evidence: '必查' }
      ],
      treatments: [
        {
          id: 't1',
          name: 'R-CHOP 方案 x 6周期',
          evidenceLevel: '1A',
          description: '标准一线治疗方案。利妥昔单抗 + 环磷酰胺 + 多柔比星 + 长春新碱 + 泼尼松。建议≥65岁患者给予初级 G-CSF 预防。',
          citationIndices: [1, 3],
          contraindications: [],
          alternatives: []
        },
        {
          id: 't2',
          name: 'Pola-R-CHP 方案 x 6周期',
          evidenceLevel: '1A',
          description: '基于 POLARIX 研究，对于 IPI 2-5 分的初治 DLBCL 患者，PFS 获益优于 R-CHOP。',
          citationIndices: [2],
          contraindications: [],
          alternatives: []
        }
      ],
      comprehensiveAnalysis: `### 直接结论（核心建议）
对该**68岁**男性、Ann Arbor IIIA期、GCB型弥漫大B细胞淋巴瘤（DLBCL）患者，首选证据支持的一线方案为：**R-CHOP（标准剂量）每21天1次，合计6个疗程**；鉴于患者 **HBsAg 阳性**，必须同步启动**恩替卡韦（Entecavir）**或**替诺福韦（Tenofovir）**抗病毒治疗以预防乙肝再激活。同时建议进行 CNS 风险评估及预防性使用 G-CSF。[1][2][4]

### 概述
患者为68岁老年男性，ECOG 1分，病理确诊为 GCB-DLBCL，分期为 III期A组。IPI 评分 3分（高中危）。治疗目标为治愈。基于 GELA LNH-98.5 等关键随机对照试验，R-CHOP 方案显著优于 CHOP 方案，是该年龄段的标准一线治疗。[1][2]

### 推荐治疗方案（步骤化执行）

#### 1. 关键基线评估与风险管理
*   **乙肝病毒再激活预防**：患者 HBsAg 阳性，属于 HBV 再激活极高危人群（>10%）。
    *   **行动**：必须在 R-CHOP 治疗前或当天启动抗病毒治疗（ETV 或 TDF）。
    *   **监测**：治疗期间及停药后至少 6-12 个月内，每月监测 HBV DNA 和肝功能。[4]
*   **心脏毒性评估**：R-CHOP 含蒽环类药物（多柔比星），需基线评估 LVEF（超声心动图）。若 LVEF < 50%，需调整方案。[2]
*   **CNS 侵犯风险**：IPI 3分提示中高危，建议计算 CNS-IPI 评分。若有肾上腺/肾/睾丸受累等高危因素，需考虑 CNS 预防（如鞘内注射 MTX）。[3]

#### 2. 一线诱导治疗（首选）
*   **方案**：**R-CHOP-21**
    *   **Rituximab**: 375 mg/m², Day 1
    *   **Cyclophosphamide**: 750 mg/m², Day 1
    *   **Doxorubicin**: 50 mg/m², Day 1
    *   **Vincristine**: 1.4 mg/m² (max 2mg), Day 1
    *   **Prednisone**: 100 mg, Days 1-5
*   **周期**：每 21 天重复，共 6-8 周期。
*   **证据**：N Engl J Med (2002) 及 Blood (2005) 长期随访证实，R-CHOP 较 CHOP 显著延长老年 DLBCL 患者的 EFS 和 OS。[1][2]

#### 3. 支持治疗
*   **G-CSF 支持**：患者 68岁，属于发热性中性粒细胞减少（FN）高危人群（>65岁）。建议预防性使用 G-CSF（如 PEG-rhG-CSF）以保证化疗剂量强度。[5]
*   **肿瘤溶解综合征（TLS）预防**：充分水化，别嘌醇/非布司他降尿酸。

#### 4. 疗效评估与后续
*   **中期评估**：2-4 周期后行 PET-CT 评估。
*   **终点评估**：化疗结束后 6-8 周行 PET-CT。
*   **复发/难治**：若一线治疗失败，可考虑二线挽救化疗联合自体干细胞移植（ASCT）或 CAR-T 治疗。[6]`,
      citations: [
        {
          id: 'cit1',
          index: 1,
          sourceType: 'pubmed',
          title: 'CHOP chemotherapy plus rituximab compared with CHOP alone in elderly patients with diffuse large-B-cell lymphoma',
          year: '2002',
          journal: 'N Engl J Med',
          url: 'https://pubmed.ncbi.nlm.nih.gov/11807147/',
          impactFactor: 176.0,
          abstract: 'The standard treatment for patients with diffuse large-B-cell lymphoma is CHOP. Rituximab added to CHOP increases the complete-response rate and prolongs event-free and overall survival in elderly patients.'
        },
        {
          id: 'cit2',
          index: 2,
          sourceType: 'pubmed',
          title: 'Long-term results of the R-CHOP study in the treatment of elderly patients with diffuse large B-cell lymphoma',
          year: '2005',
          journal: 'Blood',
          url: 'https://pubmed.ncbi.nlm.nih.gov/15867204/',
          impactFactor: 22.1,
          abstract: 'Long-term follow-up confirms the survival benefit of R-CHOP over CHOP in elderly patients.'
        },
        {
          id: 'cit3',
          index: 3,
          sourceType: 'pubmed',
          title: 'Central nervous system relapse in diffuse large B cell lymphoma: Risk factors',
          year: '2015',
          journal: 'Ann Hematol',
          url: 'https://pubmed.ncbi.nlm.nih.gov/25817451/',
          impactFactor: 3.0,
          abstract: 'Central nervous system (CNS) involvement by lymphoma is a complication associated, almost invariably, with a poor prognosis. The knowledge of the risk factors for CNS relapse is important to determine.'
        },
        {
          id: 'cit4',
          index: 4,
          sourceType: 'guideline',
          title: 'Antiviral Prophylaxis With Tenofovir for Patients With History of Hepatitis B',
          year: '2023',
          journal: 'Guideline',
          abstract: 'The guideline also strongly recommends entecavir or tenofovir treatment for HBsAg-negative and anti-HBc-positive patients receiving rituximab.'
        },
        {
          id: 'cit5',
          index: 5,
          sourceType: 'pubmed',
          title: 'How I treat older patients with DLBCL in the frontline setting',
          year: '2023',
          journal: 'Blood',
          url: 'https://pubmed.ncbi.nlm.nih.gov/37229654/',
          impactFactor: 22.1,
          abstract: 'Current guidelines recommend primary recombinant G-CSF prophylaxis in patients aged ≥65 years receiving R-CHOP.'
        },
        {
          id: 'cit6',
          index: 6,
          sourceType: 'pubmed',
          title: 'Outcome of patients with relapsed diffuse large B-cell lymphoma who fail second-line salvage regimens in the International CORAL study',
          year: '2015',
          journal: 'Haematologica',
          url: 'https://pubmed.ncbi.nlm.nih.gov/26367239/',
          impactFactor: 9.9,
          abstract: 'Salvage chemotherapy followed by autologous stem cell transplantation (ASCT) is the standard second-line treatment for relapsed and refractory diffuse large B-cell lymphoma (DLBCL).'
        }
      ],
      rwdAnalysis: {
        totalDatabaseSize: 15420,
        matchedCohortSize: 1250,
        matchQuality: 'high',
        dataSource: '多中心淋巴瘤专病数据库 (2018-2024)',
        lastUpdated: '2024-02',
        summaryText: `基于多中心真实世界队列（N=1,250，III期 GCB型 DLBCL），我们观察到以下治疗趋势与建议：

*   **标准 R-CHOP 疗效基线**：一线接受标准 R-CHOP 方案的患者，3年 PFS（无进展生存期）约为 72.5%，5年 PFS 为 65.2%。这证实了 R-CHOP 在该人群中的基础地位。
*   **Pola-R-CHP 的真实世界获益**：在近2年采用 Pola-R-CHP（维泊妥珠单抗+R-CHP）的匹配亚组（N=312）中，早期完全缓解率（CR）提升了约 8.4%。对于有较高复发风险或对传统化疗耐受性较好的年轻/中年患者，真实世界数据支持其作为一线优选，以降低远期复发率。
*   **不良反应管理提示**：R-CHOP 组最常见的 3-4 级不良反应为中性粒细胞减少（34%），建议在首疗程预防性使用长效 G-CSF。`,
        criteria: [
          { category: 'high_weight', name: '疾病诊断', value: 'DLBCL (NOS)', matchStatus: 'exact' },
          { category: 'high_weight', name: '分子亚型', value: 'GCB', matchStatus: 'exact' },
          { category: 'high_weight', name: 'AJCC分期', value: 'III期', matchStatus: 'exact' },
          { category: 'high_weight', name: '年龄分层', value: '60-70岁', matchStatus: 'exact' },
          { category: 'low_weight', name: 'ECOG评分', value: '0-1分', matchStatus: 'exact' },
          { category: 'low_weight', name: 'IPI评分', value: '中高危', matchStatus: 'partial' }
        ],
        flowData: {
          id: 'root',
          label: 'III期 GCB-DLBCL (N=1250)',
          percentage: 100,
          type: 'state',
          children: [
            {
              id: '1L-RCHOP',
              label: '一线 R-CHOP 治疗',
              percentage: 82.4,
              type: 'treatment',
              color: '#10b981',
              children: [
                { id: 'outcome-cr', label: '长期缓解 (CR > 5年)', percentage: 65.2, type: 'outcome', status: 'active' },
                { id: 'outcome-relapse', label: '复发/进展', percentage: 28.5, type: 'outcome', status: 'active', 
                  children: [
                    { id: '2L-chemo', label: '二线挽救化疗', percentage: 60.0, type: 'treatment' },
                    { id: '2L-cart', label: 'CAR-T 治疗', percentage: 15.0, type: 'treatment' }
                  ]
                },
                { id: 'outcome-death', label: '死亡', percentage: 6.3, type: 'outcome', status: 'terminal' }
              ]
            },
            {
              id: '1L-Other',
              label: '其他方案 (R-EPOCH等)',
              percentage: 17.6,
              type: 'treatment',
              color: '#64748b',
              children: [
                { id: 'outcome-cr-other', label: '缓解', percentage: 58.0, type: 'outcome' },
                { id: 'outcome-fail-other', label: '治疗失败', percentage: 42.0, type: 'outcome' }
              ]
            }
          ]
        }
      }
    } as CDSSResponse
  },
  case2: {
    id: 'case2',
    name: '演示案例 2: 禁忌症 (合并心衰)',
    text: `患者女性，72岁。
主诉：确诊 DLBCL 1周，拟行化疗。
现病史：外院病理确诊为 DLBCL，non-GCB亚型。IPI评分 3分（高中危）。
既往史：冠心病、陈旧性心肌梗死病史 5 年，平素活动后气促。
辅助检查：
1. 心脏超声：左室射血分数 (LVEF) 38%，室壁运动普遍减弱，左室扩大。
2. 心电图：陈旧性下壁心肌梗死，频发室早。
3. 肝肾功能：基本正常。`,
    response: {
      snapshotId: 'snap_case2_heart_failure',
      diagnosisStatus: 'confirmed',
      diagnosisTitle: '明确诊断：DLBCL (non-GCB), 高中危 | 合并严重心功能不全',
      concepts: [
        { id: 'c1', text: 'DLBCL (non-GCB)', type: 'disease', confidence: 0.99, isCritical: true, confirmed: true },
        { id: 'c2', text: 'LVEF 38%', type: 'other', confidence: 0.98, isCritical: true, confirmed: true },
        { id: 'c3', text: '陈旧性心梗', type: 'disease', confidence: 0.95, isCritical: true, confirmed: true },
        { id: 'c4', text: '年龄 > 70岁', type: 'other', confidence: 1.0, isCritical: false, confirmed: true },
        { id: 'c5', text: 'IPI 3分', type: 'other', confidence: 0.95, isCritical: false, confirmed: true },
      ],
      missingInputs: [
        { id: 'm1', label: 'HBsAg (乙肝表面抗原)', type: 'select', options: ['阳性', '阴性'], requiredFor: 'treatment_safety', guidelineName: '免疫治疗前筛查', allowEmpty: true }
      ],
      guidelines: [
        { name: 'CSCO 2023', type: 'primary', status: 'active' },
        { name: 'NCCN 2024', type: 'secondary', status: 'active' }
      ],
      exams: [
        { id: 'e1', name: 'BNP / NT-proBNP', purpose: '定量评估心衰程度', evidence: '心血管专科建议' },
        { id: 'e2', name: '动态心电图', purpose: '评估室早负荷与恶性心律失常风险', evidence: '心脏安全监测' }
      ],
      treatments: [
        {
          id: 't1',
          name: '脂质体阿霉素 R-CHOP 变体 (R-CDOP)',
          evidenceLevel: '2A',
          description: '使用聚乙二醇脂质体阿霉素替代常规阿霉素。研究显示在老年患者中总体缓解率76%，且心脏安全性较好。',
          citationIndices: [3],
          contraindications: [],
          alternatives: [
            { name: 'R-GemOx 方案', reason: '无蒽环类药物，适合心功能差的高龄患者', citationIndices: [] }
          ]
        },
        {
          id: 't2',
          name: 'R-CHOP 方案',
          evidenceLevel: '1A',
          description: '标准一线方案',
          citationIndices: [2],
          contraindications: [
            { reason: '检测到 LVEF 38% (<45%) 且有心梗病史，常规蒽环类药物绝对禁忌', level: 'absolute', citationIndices: [1] }
          ],
          alternatives: []
        }
      ],
      comprehensiveAnalysis: `### 直接结论（核心建议）
鉴于患者72岁高龄且合并严重心功能不全（LVEF 38%）及陈旧性心梗病史，常规足剂量 R-CHOP 中的常规阿霉素（doxorubicin）心脏风险很高。**首选推荐使用聚乙二醇脂质体阿霉素（PL-doxorubicin）替代常规阿霉素的 R-CHOP 变体方案（R-CDOP）**，以在保留治愈机会的同时降低心脏毒性。同时需联合心内科进行心衰优化治疗及全程严密监测。[1][2][3]

### 概述
患者为72岁女性，确诊 non-GCB DLBCL，IPI 3分（高中危）。合并陈旧性心梗、频发室早，LVEF 38%（明显收缩功能不全）。常规阿霉素的心脏毒性与给药峰浓度和累积剂量相关，老年人风险更高。R-CHOP 是老年 DLBCL 的标准方案并带来长期生存获益，因此若能在心脏可承受范围内“保留蒽环有效成分”，通常更有利于治愈目标。[1][2]

### 推荐治疗方案（步骤化执行）

#### 1. 先做“心脏风险再分层 + 心衰优化”
*   **目的**：在不延误淋巴瘤治疗前提下，控制可逆的心衰诱因、容量状态及心律失常。
*   **行动**：立即启动 MDT（血液科+心内科）。尽快完成心衰分级、NT-proBNP/肌钙蛋白、动态心电图评估。
*   **监测**：治疗期间建立心脏监测路径（心超 LVEF + 肌钙蛋白/ECG）。[1][3][4]

#### 2. 一线治疗优先考虑：脂质体阿霉素替代常规阿霉素
*   **方案**：**R-CDOP / R-COMP-like**
    *   **核心调整**：使用聚乙二醇脂质体阿霉素（PL-doxorubicin）30 mg/m² 替代常规阿霉素。
    *   **证据**：老年 DLBCL 研究显示，PL-doxorubicin 替代方案总体缓解率 76%，CR 59%，且治疗过程中 LVEF 未见显著变化，心脏毒性发生率低。[3][5]
    *   **给药策略**：参考 q21d x 6 的研究用法，并根据耐受性做个体化减量。

#### 3. 心脏保护策略
*   **Dexrazoxane（右雷佐生）**：可讨论作为心脏保护的辅助策略。研究提示其预处理可部分减轻阿霉素导致的收缩功能下降，但在此特定场景（DLBCL一线、LVEF 38%）的直接证据有限，需向患者告知证据不确定性。[4]
*   **G-CSF 支持**：老年人及脂质体蒽环方案需强化感染/粒缺管理，建议一级预防使用 G-CSF。[5]

#### 4. 备选策略（若任何蒽环均不可耐受）
*   若评估认为“任何蒽环（含脂质体）都不可承受”，则改用非蒽环方案（如 R-GemOx, R-CVP 等），但需明确告知疗效/治愈概率可能下降。优先考虑临床试验或替代免疫化疗。`,
      citations: [
        {
          id: 'c1',
          index: 1,
          sourceType: 'pubmed',
          title: 'Anthracycline-induced cardiotoxicity',
          year: '2005',
          journal: 'PMID: 15899623',
          url: 'https://pubmed.ncbi.nlm.nih.gov/15899623/',
          abstract: 'Anthracyclines are topoisomerase II inhibitors used for malignancies but limited by cardiotoxicity. Three types are distinguished: acute, sub-acute, and chronic.'
        },
        {
          id: 'c2',
          index: 2,
          sourceType: 'pubmed',
          title: 'Long-term results of the R-CHOP study in the treatment of elderly patients with diffuse large B-cell lymphoma',
          year: '2005',
          journal: 'Blood',
          url: 'https://pubmed.ncbi.nlm.nih.gov/15867204/',
          impactFactor: 41.9,
          abstract: 'Long-term follow-up confirms the survival benefit of R-CHOP over CHOP in elderly patients.'
        },
        {
          id: 'c3',
          index: 3,
          sourceType: 'pubmed',
          title: 'CHOP-rituximab with pegylated liposomal doxorubicin for the treatment of elderly patients with diffuse large B-cell lymphoma',
          year: '2006',
          journal: 'Leuk Lymphoma',
          url: 'https://pubmed.ncbi.nlm.nih.gov/17071492/',
          impactFactor: 2.2,
          abstract: 'Thirty untreated patients (median age 69) treated with PL-doxorubicin modified R-CHOP showed 76% ORR and 59% CR. LVEF and Troponin I showed no significant changes.'
        },
        {
          id: 'c4',
          index: 4,
          sourceType: 'pubmed',
          title: 'Dexrazoxane protects against doxorubicin-induced cardiotoxicity in susceptible human living myocardial slices',
          year: '2025',
          journal: 'PMID: 40437840',
          url: 'https://pubmed.ncbi.nlm.nih.gov/40437840/',
          impactFactor: 7.7,
          abstract: 'Dexrazoxane pretreatment partially attenuated doxorubicin-induced contractile dysfunction and reduced structural damage in human myocardial slices.'
        },
        {
          id: 'c5',
          index: 5,
          sourceType: 'pubmed',
          title: 'Cyclophosphamide, pegylated liposomal doxorubicin (Caelyx), vincristine and prednisone (CCOP) in elderly patients with diffuse large B-cell lymphoma',
          year: '2002',
          journal: 'Haematologica',
          url: 'https://pubmed.ncbi.nlm.nih.gov/12161358/',
          impactFactor: 7.9,
          abstract: 'CCOP regimen showed 64% ORR in elderly DLBCL patients. Main toxicity was grade 3-4 neutropenia (64%).'
        }
      ],
      rwdAnalysis: {
        totalDatabaseSize: 15420,
        matchedCohortSize: 342,
        matchQuality: 'medium',
        dataSource: '多中心淋巴瘤专病数据库 (2018-2024)',
        lastUpdated: '2024-02',
        summaryText: `基于高龄且合并心功能不全（LVEF < 45%）的 DLBCL 专病队列（N=342），真实世界治疗路径与预后提示：

*   **传统蒽环类药物的极高风险**：接受标准剂量 R-CHOP 的患者（N=45），3级以上心血管不良事件（如心力衰竭加重、致死性心律失常）发生率高达 42%，且治疗相关死亡率（TRM）显著增加。**强烈建议避免使用常规多柔比星**。
*   **脂质体多柔比星（R-CDOP）的安全性**：采用脂质体多柔比星替代的患者（N=156），心血管事件发生率降至 11%，且 2年 OS（总生存期）与常规化疗组无显著统计学差异（68% vs 71%）。这是目前真实世界中最平衡疗效与心脏安全的策略。
*   **去蒽环方案（R-GemOx / R-CVP）**：对于极度虚弱或 LVEF < 35% 的患者，R-GemOx 显示出最佳的耐受性（心脏事件 < 5%），但远期复发率略高。建议结合患者体能评分（ECOG）进行个体化取舍。`,
        criteria: [
          { category: 'high_weight', name: '疾病诊断', value: 'DLBCL', matchStatus: 'exact' },
          { category: 'high_weight', name: '年龄分层', value: '>70岁', matchStatus: 'exact' },
          { category: 'high_weight', name: '心功能状态', value: 'LVEF < 45%', matchStatus: 'exact' },
          { category: 'low_weight', name: '合并症', value: '陈旧性心梗', matchStatus: 'exact' }
        ],
        flowData: {
          id: 'root',
          label: '高龄心功能不全 DLBCL (N=342)',
          percentage: 100,
          type: 'state',
          children: [
            {
              id: '1L-Anthracycline',
              label: '含常规蒽环类方案',
              percentage: 15.2,
              type: 'treatment',
              color: '#ef4444',
              children: [
                { id: 'outcome-cardio', label: '严重心血管事件', percentage: 45.0, type: 'outcome', status: 'terminal' },
                { id: 'outcome-survive', label: '生存获益', percentage: 55.0, type: 'outcome' }
              ]
            },
            {
              id: '1L-Mod',
              label: '脂质体蒽环/去蒽环方案',
              percentage: 84.8,
              type: 'treatment',
              color: '#10b981',
              children: [
                { id: 'outcome-cr-safe', label: '缓解且安全', percentage: 62.0, type: 'outcome' },
                { id: 'outcome-progression', label: '疾病进展', percentage: 38.0, type: 'outcome' }
              ]
            }
          ]
        }
      }
    } as CDSSResponse
  },
  case3: {
    id: 'case3',
    name: '演示案例 3: 信息缺失 (待确诊)',
    text: `患者男性，45岁。
主诉：发现左侧腹股沟包块 1 周。
查体：左侧腹股沟可触及 2*2cm 肿物，质韧，无压痛，活动度可。
辅助检查：
1. 腹股沟B超：多发淋巴结肿大，皮髓质分界不清，血流丰富，考虑淋巴瘤可能。
2. 血常规：WBC 11.2, LYM 4.5。`,
    response: {
      snapshotId: 'snap_case3_unclear',
      diagnosisStatus: 'unclear',
      diagnosisTitle: '初步评估：淋巴结肿大待查 (疑似淋巴瘤)',
      concepts: [
        { id: 'c1', text: '腹股沟淋巴结肿大', type: 'symptom', confidence: 0.95, isCritical: true, confirmed: true },
        { id: 'c2', text: '疑似淋巴瘤', type: 'disease', confidence: 0.75, isCritical: false, confirmed: false },
        { id: 'c3', text: 'WBC 11.2', type: 'other', confidence: 0.99, isCritical: false, confirmed: true },
      ],
      missingInputs: [
        { id: 'm1', label: '病理活检结果', type: 'text', requiredFor: 'diagnosis', guidelineName: '确诊依据', allowEmpty: true },
        { id: 'm2', label: '免疫组化 (IHC)', type: 'text', requiredFor: 'diagnosis', guidelineName: '分型依据', allowEmpty: true },
        { id: 'm3', label: '是否有B症状', type: 'select', options: ['无', '发热', '盗汗', '体重下降', '多种症状'], requiredFor: 'staging', allowEmpty: true }
      ],
      guidelines: [
        { name: 'CSCO 淋巴瘤诊疗指南 2023', type: 'primary', status: 'active' }
      ],
      exams: [
        { id: 'e1', name: '淋巴结切除活检', purpose: '获取病理组织，明确诊断（金标准）', evidence: '必查' },
        { id: 'e2', name: 'PET-CT', purpose: '辅助诊断及分期', evidence: '推荐' }
      ],
      treatments: [
        {
          id: 't3-1',
          name: '完整淋巴结切除活检 (首要推荐)',
          description: 'CSCO 指南强烈推荐：对于初诊淋巴结肿大疑似淋巴瘤的患者，首选完整切除肿大淋巴结进行病理学、免疫组化及分子生物学检查。不推荐首选细针穿刺或粗针穿刺，以免破坏组织结构导致误诊或分型困难。',
          evidenceLevel: 'I',
          citationIndices: [1],
          contraindications: [],
          alternatives: [
            { name: '粗针穿刺活检 (CNB)', reason: '仅在淋巴结部位深在、手术风险过高或患者无法耐受手术时作为替代方案，且需多点穿刺以获取足够组织。', citationIndices: [1] }
          ]
        },
        {
          id: 't3-2',
          name: 'PET-CT 全身评估',
          description: '在活检前或确诊后进行，有助于寻找最具高代谢活性的病灶作为活检靶点，并为后续可能的淋巴瘤分期提供基线数据。',
          evidenceLevel: 'II',
          citationIndices: [1],
          contraindications: [],
          alternatives: []
        },
        {
          id: 't3-3',
          name: '淋巴瘤潜在治疗路径 (概述)',
          description: '若最终病理确诊为侵袭性 B 细胞淋巴瘤 (如 DLBCL)，一线标准治疗通常为 R-CHOP 或 Pola-R-CHP 方案免疫化疗；若为惰性淋巴瘤 (如 FL)，则根据肿瘤负荷决定是否观察等待或采用温和的免疫化疗。具体方案需严格依赖最终病理报告。',
          evidenceLevel: '专家共识',
          citationIndices: [],
          contraindications: [],
          alternatives: []
        }
      ],
      comprehensiveAnalysis: `⚠️ **当前诊断不明确**

由于缺乏明确的病理学诊断，系统暂无法提供针对性的循证医学（PubMed）临床研究分析。

待完成淋巴结活检并明确病理分型后，系统将自动启动针对特定亚型（如 DLBCL、FL 等）的治疗方案搜索与前沿文献匹配。目前请优先遵循指南建议完善相关检查。`,
      citations: [
        {
          id: 'c1', index: 1, sourceType: 'guideline', title: 'CSCO 淋巴瘤诊疗指南 (2023版)', journal: 'CSCO Guidelines', year: '2023', url: '#', abstract: '关于淋巴瘤初诊的病理获取标准：强烈推荐完整切除淋巴结活检，以评估淋巴结结构。粗针穿刺活检仅在无法切除活检时作为替代。'
        }
      ],
      rwdAnalysis: {
        totalDatabaseSize: 15420,
        matchedCohortSize: 5200,
        matchQuality: 'low',
        dataSource: '多中心淋巴瘤专病数据库 (2018-2024)',
        lastUpdated: '2024-02',
        summaryText: '基于“腹股沟淋巴结肿大”的初筛人群中，最终确诊为 DLBCL 的比例约为 45%，滤泡性淋巴瘤 (FL) 约占 25%。',
        criteria: [
          { category: 'high_weight', name: '主诉', value: '腹股沟淋巴结肿大', matchStatus: 'exact' },
          { category: 'high_weight', name: '年龄', value: '40-50岁', matchStatus: 'exact' },
          { category: 'low_weight', name: '其他症状', value: '无特异性', matchStatus: 'ignored' }
        ],
        flowData: {
          id: 'root',
          label: '腹股沟淋巴结肿大待查 (N=5200)',
          percentage: 100,
          type: 'state',
          children: [
            {
              id: 'diag-dlbcl',
              label: '确诊 DLBCL',
              percentage: 45.0,
              type: 'outcome',
              color: '#f59e0b'
            },
            {
              id: 'diag-fl',
              label: '确诊 滤泡性淋巴瘤',
              percentage: 25.0,
              type: 'outcome',
              color: '#3b82f6'
            },
            {
              id: 'diag-reactive',
              label: '反应性增生/其他',
              percentage: 30.0,
              type: 'outcome',
              color: '#94a3b8'
            }
          ]
        }
      }
    } as CDSSResponse
  },
  case4: {
    id: 'case4',
    name: '演示案例 4: 复发难治 (双表达)',
    text: `患者男性，58岁。
主诉：确诊 DLBCL 2年，R-CHOP 治疗后完全缓解，近期复发。
现病史：2年前确诊 GCB型 DLBCL，接受 R-CHOP x 6 疗程后 CR。24个月后复查 PET-CT 提示腹膜后淋巴结代谢增高，活检证实 DLBCL 复发。
辅助检查：
1. 病理复核：DLBCL, GCB亚型。
2. 免疫组化：MYC(≥40%), BCL2(≥50%) 双表达 (Double Expressor)。
3. FISH检测：MYC/BCL2/BCL6 重排阴性 (排除 Double Hit)。
4. 既往史：体健，无其他慢性病。`,
    response: {
      snapshotId: 'snap_case4_relapse_cart',
      diagnosisStatus: 'confirmed',
      diagnosisTitle: '明确诊断：复发性 DLBCL (晚期复发) | 双表达 (DEL)',
      concepts: [
        { id: 'c1', text: '复发性 DLBCL', type: 'disease', confidence: 1.0, isCritical: true, confirmed: true },
        { id: 'c2', text: '晚期复发 (>12个月)', type: 'other', confidence: 0.98, isCritical: true, confirmed: true },
        { id: 'c3', text: '双表达 (MYC+/BCL2+)', type: 'gene', confidence: 0.99, isCritical: true, confirmed: true },
        { id: 'c4', text: '非 Double Hit', type: 'gene', confidence: 0.95, isCritical: true, confirmed: true },
      ],
      missingInputs: [
        { id: 'm1', label: 'TP53 突变状态', type: 'select', options: ['野生型', '突变型'], requiredFor: 'prognosis', guidelineName: '高危分子分型', allowEmpty: true },
        { id: 'm2', label: '器官功能评估 (心/肾)', type: 'select', options: ['正常', '异常'], requiredFor: 'treatment_safety', guidelineName: 'ASCT/CAR-T 适用性', allowEmpty: true }
      ],
      guidelines: [
        { name: 'CSCO 2024 - 复发难治淋巴瘤', type: 'primary', status: 'active' },
        { name: 'NCCN 2024', type: 'secondary', status: 'active' }
      ],
      exams: [
        { id: 'e1', name: 'HLA 配型', purpose: '为异基因移植做储备（若 ASCT/CAR-T 失败）', evidence: '可选' },
        { id: 'e2', name: 'T细胞亚群分析', purpose: '评估 CAR-T 治疗前的 T 细胞功能状态', evidence: '建议' }
      ],
      treatments: [
        {
          id: 't1',
          name: '挽救化疗 (R-ICE/DHAP) -> ASCT',
          evidenceLevel: '1A',
          description: '对于晚期复发 (>12个月) 且对化疗敏感的患者，大剂量化疗联合自体干细胞移植 (ASCT) 仍是标准二线治愈性方案。',
          citationIndices: [1, 9],
          contraindications: [],
          alternatives: []
        },
        {
          id: 't2',
          name: 'CD19 CAR-T 细胞治疗',
          evidenceLevel: '1B',
          description: '若挽救化疗不敏感或再次复发，应立即转为 CAR-T 治疗。ZUMA-7 等研究显示在二线治疗中优于标准治疗，但主要获益人群为早期复发/难治患者。对于双表达 (DEL) 患者，CAR-T 可能克服不良预后。',
          citationIndices: [3, 6],
          contraindications: [],
          alternatives: []
        }
      ],
      comprehensiveAnalysis: `### 直接结论（核心建议）
对该患者（58岁，GCB型 DLBCL，R-CHOP 完全缓解后 24 个月复发，MYC/BCL2 双表达）：**首选以“拯救化疗（评估化学敏感性）→ 若 1 个疗程拯救化疗获得应答（CR/PR）则行自体造血干细胞移植 ASCT 巩固”为主要路径**；若拯救化疗失败、无法进行 ASCT 或病情/分子学提示极高危（如经 FISH 证实为 double-hit），应尽早转诊评估 CD19 CAR-T（或优先入组临床试验）。[1][2][3]

### 简要概述（基于文献的理由）
*   **晚期复发（≥12 个月）且耐受性良好的患者**：传统证据和回顾/队列研究支持以拯救化疗后行 ASCT 作为标准二线治疗，有望获得长期缓解或治愈机会；但若需要 >1 条拯救疗法才能获得应答，ASCT 预后明显下降，应考虑替代策略（如 CAR-T 或试验）。[1][4]
*   **近期三项二线随机试验（ZUMA-7、TRANSFORM、BELINDA）显示**：axi-cel 和 liso-cel 在部分二线人群显著优于常规拯救+ASCT（ZUMA-7、TRANSFORM 为阳性结果，BELINDA 结果受试验设计及 bridging 使用差异影响），因此 CAR-T 是二线/救援失败的重要选择，但对晚期复发且可移植患者，仍应优先评估拯救→ASCT 策略。[3][5][6]
*   **MYC/BCL2 双表达（double-expressor, DEL）**：本身与化疗应答率降低、复发风险增加相关；应首先通过 FISH 排除 MYC/BCL2（或 BCL6）的基因重排（即 double-hit/triple-hit），因为若为 double-hit，通常被视为更高危并可改变治疗倾向（更早考虑强化或非传统策略）。[2][7]

### 逐步、可操作的诊疗计划
#### 1. 病理与分子学复核（立即完成）
*   **复核 IHC**：记录 MYC、BCL2 阳性比例（常用切点 MYC ≥40%、BCL2 ≥50%）；如尚未做，做 p53 (或 TP53) IHC/测序以评估共存高危因素。[8]
*   **必需**：尽快做 FISH（或等效分子学）检测 MYC、BCL2、BCL6 重排，明确是否为 double-hit/triple-hit；DEL 与 DHL 治疗选择与预后不同，FISH 结果会影响风险分层与是否提早选择 CAR-T/强化方案。[7]

#### 2. 完整评估与基线检查（立即/入院前）
*   **完整影像**：PET-CT（已有），必要时 MRI 骨盆/胸腹部/盆腔局部评估；骨髓活检（如既往无骨髓检查）。
*   **实验室/器官功能**：CBC、肝肾功能、电解质、LDH、病毒学筛查（HBV、HCV、HIV）、心功能评估（心超）。
*   **评估移植/CAR-T 适应证**：ECOG、合并症、器官功能、心理/社经可及性。

#### 3. 若评估为可耐受并拟以 ASCT 优先（推荐路径，适合本患者）
*   启动 1 个周期拯救化疗（常见方案：R-ICE 或 R-DHAP 或 R-GDP，选择依据中心经验与患者器官功能）。在拯救化疗同时联系造血/移植科安排响应评估与干细胞动员。
*   在拯救化疗后以 PET-CT 评估：若达到 PR/CR → 进行干细胞动员与高剂量化疗后 ASCT；若对 1 线拯救即不敏感或需 >1 线拯救才能得到应答，则 ASCT 预后差，应考虑直接转向 CAR-T 或临床试验。[1][4]

#### 4. 若对拯救化疗失败或不适合 ASCT（或 FISH 证实为 double-hit/多线失败）
*   **早期转诊 CAR-T 中心评估**（axi-cel / liso-cel / tisa-cel 之一），并在等待制备期间考虑桥接治疗（局部放疗、低毒药物或 ADC 等）以控制病情。[3][6]
*   如 CAR-T 不可及或患者不愿意/不合格：可考虑按中心经验采用 polatuzumab 基础组合或 tafasitamab+lenalidomide、loncastuximab 等作为缓解/桥接。[5]`,
      citations: [
        {
          id: 'c1', index: 1, sourceType: 'pubmed', title: 'Autologous Stem Cell Transplant in Fit Patients With Late Relapsed DLBCL', year: '2022', journal: 'Blood Rev', url: 'https://pubmed.ncbi.nlm.nih.gov/35869021/', impactFactor: 6.5, abstract: 'Salvage chemotherapy followed by ASCT remains the standard of care for late relapsed DLBCL.'
        },
        {
          id: 'c2', index: 2, sourceType: 'pubmed', title: 'Clinical significance of co-expression of MYC and BCL2 protein in aggressive B-cell lymphomas treated with a second line immunochemotherapy', year: '2015', journal: 'Leuk Res', url: 'https://pubmed.ncbi.nlm.nih.gov/26390147/', impactFactor: 2.2, abstract: 'Double-expressor lymphoma (DEL) is associated with inferior outcomes with standard salvage chemotherapy.'
        },
        {
          id: 'c3', index: 3, sourceType: 'pubmed', title: 'CAR T Cells: Second-Line Treatment Option for NHL? - NCI', year: '2022', journal: 'NCI', url: 'https://www.cancer.gov/news-events/cancer-currents-blog/2022/car-t-cell-therapy-second-line-lymphoma', abstract: 'ZUMA-7, TRANSFORM, and BELINDA trials comparison.'
        },
        {
          id: 'c4', index: 4, sourceType: 'pubmed', title: 'Salvage Chemotherapy Followed by Autologous Stem-Cell Transplantation Using Targeted Busulfan for Refractory DLBCL', year: '2022', journal: 'Transplant Cell Ther', url: 'https://pubmed.ncbi.nlm.nih.gov/35869021/', impactFactor: 2.7
        },
        {
          id: 'c5', index: 5, sourceType: 'pubmed', title: 'Role of CD19 Chimeric Antigen Receptor T Cells in Second-Line Treatment of DLBCL', year: '2022', journal: 'J Clin Oncol', url: 'https://pubmed.ncbi.nlm.nih.gov/34310745/', impactFactor: 9.9
        },
        {
          id: 'c6', index: 6, sourceType: 'pubmed', title: 'Efficacy and safety of CD19-directed CAR-T cell therapies in patients with relapsed/refractory aggressive B-cell lymphomas', year: '2021', journal: 'J Hematol Oncol', url: 'https://pubmed.ncbi.nlm.nih.gov/34310745/', impactFactor: 9.9, abstract: 'CAR-T therapies have improved outcomes for R/R DLBCL. ZUMA-7 and TRANSFORM trials support second-line use in high-risk patients.'
        },
        {
          id: 'c7', index: 7, sourceType: 'pubmed', title: 'Molecular background delineates outcome of double protein expressor diffuse large B-cell lymphoma', year: '2020', journal: 'Blood Cancer J', url: 'https://pubmed.ncbi.nlm.nih.gov/32780847/', impactFactor: 7.1
        },
        {
          id: 'c8', index: 8, sourceType: 'pubmed', title: 'P53 expression correlates with poorer survival and augments the negative prognostic effect of MYC rearrangement', year: '2016', journal: 'Mod Pathol', url: 'https://pubmed.ncbi.nlm.nih.gov/27739436/', impactFactor: 5.5
        },
        {
          id: 'c9', index: 9, sourceType: 'pubmed', title: 'Patterns of Utilization and Outcomes of Autologous Stem Cell Transplantation and Chimeric Antigen Receptor T-Cell Therapy', year: '2022', journal: 'Transplant Cell Ther', url: 'https://pubmed.ncbi.nlm.nih.gov/35869021/', impactFactor: 2.7
        }
      ],
      rwdAnalysis: {
        totalDatabaseSize: 15420,
        matchedCohortSize: 415,
        matchQuality: 'high',
        dataSource: '多中心淋巴瘤专病数据库 (2018-2024)',
        lastUpdated: '2024-02',
        summaryText: `针对晚期复发（>12个月）且伴有 MYC/BCL2 双表达（DEL）的 DLBCL 队列（N=415），真实世界干预结果表明：

*   **挽救化疗+ASCT 的局限与机会**：对于二线挽救化疗（如 R-ICE）**一疗程即达到 CR/PR** 的敏感患者（约占 45%），序贯 ASCT 的 3年 OS 达到 58%，依然是可靠的治愈路径。但 DEL 患者对常规挽救化疗的整体原发耐药率较非 DEL 患者高出 20%。
*   **CAR-T 疗法的真实世界优势**：在挽救化疗反应不佳（SD/PD）或早期复发的 DEL 患者中，直接桥接 CD19 CAR-T（如 Axi-cel）的客观缓解率（ORR）达到 72%，显著优于继续尝试三线化疗（ORR < 25%）。
*   **临床决策建议**：真实世界实践强烈提示，对于此类患者，**在启动二线化疗的首日即应联系细胞治疗中心进行 CAR-T 评估与 T 细胞采集（白细胞分离）**。若二线化疗中期评估未达 PR，应毫不迟疑地切换至 CAR-T 流程，避免因肿瘤负荷过大或体能下降错失 CAR-T 治疗窗。`,
        criteria: [
          { category: 'high_weight', name: '疾病状态', value: '复发 (Relapsed)', matchStatus: 'exact' },
          { category: 'high_weight', name: '复发时间', value: '>12个月', matchStatus: 'exact' },
          { category: 'high_weight', name: '分子特征', value: '双表达 (DEL)', matchStatus: 'exact' },
          { category: 'low_weight', name: '一线方案', value: 'R-CHOP', matchStatus: 'exact' }
        ],
        flowData: {
          id: 'root',
          label: '晚期复发 DEL-DLBCL (N=415)',
          percentage: 100,
          type: 'state',
          children: [
            {
              id: '2L-Salvage',
              label: '挽救化疗 + ASCT',
              percentage: 65.0,
              type: 'treatment',
              color: '#3b82f6',
              children: [
                { id: 'outcome-s-cr', label: '持续缓解', percentage: 45.0, type: 'outcome' },
                { id: 'outcome-s-fail', label: '治疗失败', percentage: 55.0, type: 'outcome',
                  children: [
                     { id: '3L-CART', label: '三线 CAR-T', percentage: 80.0, type: 'treatment' }
                  ]
                }
              ]
            },
            {
              id: '2L-CART',
              label: '二线 CAR-T / 临床试验',
              percentage: 35.0,
              type: 'treatment',
              color: '#8b5cf6',
              children: [
                { id: 'outcome-c-cr', label: '持续缓解', percentage: 52.0, type: 'outcome' },
                { id: 'outcome-c-fail', label: '进展', percentage: 48.0, type: 'outcome' }
              ]
            }
          ]
        }
      }
    } as CDSSResponse
  }
};

export const MOCK_INITIAL_RESPONSE: CDSSResponse = {
  snapshotId: 'snap_init_001',
  diagnosisStatus: 'unclear',
  diagnosisTitle: '信息不足，无法明确诊断',
  concepts: [],
  missingInputs: [],
  guidelines: [
    { name: 'CSCO 2023', type: 'primary', status: 'active' },
    { name: 'NCCN 2024', type: 'secondary', status: 'inactive' }
  ],
  exams: [],
  treatments: [],
};

export const MOCK_ANALYZED_RESPONSE = SCENARIOS.case1.response;
