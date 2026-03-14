export interface Evidence {
  id: string;
  type: 'CRM' | 'Publication' | 'Clinical Trial' | 'Interaction';
  title: string;
  date: string;
  source: string;
  snippet: string;
  url?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  org: string;
  partyId: string;
  npi: string;
  specialty: string;
  avatar: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Kelly Chin, MD',
    title: 'Professor of Internal Medicine',
    org: 'UT SOUTHWESTERN HEART AND LUNG CLINIC',
    partyId: '1222595',
    npi: '1841243664',
    specialty: 'Pulmonary Hypertension',
    avatar: 'KC'
  },
  {
    id: '2',
    name: 'Miller, Heidi N.P.',
    title: 'Nurse Practitioner',
    org: 'Baylor St. Luke\'s Medical Center',
    partyId: '1222596',
    npi: '1841243665',
    specialty: 'Cardiology',
    avatar: 'HM'
  },
  {
    id: '3',
    name: 'Amita Krishnan, MD',
    title: 'Associate Professor',
    org: 'Cleveland Clinic',
    partyId: '1222597',
    npi: '1841243666',
    specialty: 'Pulmonology',
    avatar: 'AK'
  },
  {
    id: '4',
    name: 'Sonja Bartolome, MD',
    title: 'Director',
    org: 'UT Southwestern',
    partyId: '1222598',
    npi: '1841243667',
    specialty: 'Pulmonary Disease',
    avatar: 'SB'
  },
  {
    id: '5',
    name: 'Adolfo Kaplan, MD',
    title: 'Physician',
    org: 'Methodist Hospital',
    partyId: '1222599',
    npi: '1841243668',
    specialty: 'Critical Care',
    avatar: 'AK'
  }
];

export const MOCK_EVIDENCE: Record<string, Evidence> = {
  'ev-1': {
    id: 'ev-1',
    type: 'Publication',
    title: 'Efficacy and Safety of Sotatercept for Pulmonary Arterial Hypertension',
    date: 'July 1, 2025',
    source: 'New England Journal of Medicine',
    snippet: 'In this phase 3 trial, treatment with sotatercept resulted in a significant improvement in exercise capacity...'
  },
  'ev-2': {
    id: 'ev-2',
    type: 'Clinical Trial',
    title: 'STELLAR Phase 3 Trial',
    date: 'Ongoing (Late 2025)',
    source: 'ClinicalTrials.gov',
    snippet: 'Primary completion date estimated for December 2025. Recruitment is active in 45 sites.'
  },
  'ev-3': {
    id: 'ev-3',
    type: 'Interaction',
    title: 'Medical Science Liaison Visit',
    date: 'May 20, 2025',
    source: 'Veeva CRM',
    snippet: 'Discussed recent trial protocols with Jaclyn Stoffel. Dr. Chin expressed interest in the new inclusion criteria.'
  },
  'ev-4': {
    id: 'ev-4',
    type: 'Publication',
    title: 'Long-term outcomes in PAH',
    date: 'June 15, 2025',
    source: 'Journal of Heart and Lung Transplantation',
    snippet: 'Retrospective analysis of 5-year survival rates shows correlation with early intervention.'
  }
};

export const MOCK_SUMMARY_SEGMENTS = [
  {
    text: "In summary, Dr. Kelly Chin has been actively engaged in several recent publications focusing on pulmonary arterial hypertension, with the most recent publication dated July 1, 2025.",
    evidenceId: 'ev-1'
  },
  {
    text: "Additionally, there are ongoing clinical trials aimed at improving treatment outcomes for PAH patients, with activities extending into late 2025 and beyond.",
    evidenceId: 'ev-2'
  },
  {
    text: "Furthermore, there was a recent medical interaction with Jaclyn Stoffel on May 20, 2025.",
    evidenceId: 'ev-3'
  },
  {
    text: "This reflects Dr. Chin's continued commitment to advancing research and clinical practices in her field.",
    evidenceId: 'ev-4'
  }
];

// ---------- 中文 Mock 数据 ----------
export const MOCK_DOCTORS_ZH: Doctor[] = [
  { id: '1', name: '陈凯丽 医生', title: '内科学教授', org: '西南大学心脏与肺病诊所', partyId: '1222595', npi: '1841243664', specialty: '肺动脉高压', avatar: '陈' },
  { id: '2', name: '米勒·海蒂 N.P.', title: '执业护士', org: '贝勒圣卢克医学中心', partyId: '1222596', npi: '1841243665', specialty: '心脏病学', avatar: '海' },
  { id: '3', name: '阿米塔·克里希南 医生', title: '副教授', org: '克利夫兰诊所', partyId: '1222597', npi: '1841243666', specialty: '肺病学', avatar: '阿' },
  { id: '4', name: '索尼娅·巴托洛梅 医生', title: '主任', org: '西南大学', partyId: '1222598', npi: '1841243667', specialty: '肺病', avatar: '索' },
  { id: '5', name: '阿道夫·卡普兰 医生', title: '主治医师', org: '卫理公会医院', partyId: '1222599', npi: '1841243668', specialty: '重症监护', avatar: '卡' }
];

export const MOCK_EVIDENCE_ZH: Record<string, Evidence> = {
  'ev-1': {
    id: 'ev-1',
    type: 'Publication',
    title: 'Sotatercept 治疗肺动脉高压的疗效与安全性',
    date: '2025年7月1日',
    source: '新英格兰医学杂志',
    snippet: '本 III 期试验中，sotatercept 治疗使运动耐量显著改善…'
  },
  'ev-2': {
    id: 'ev-2',
    type: 'Clinical Trial',
    title: 'STELLAR III 期试验',
    date: '进行中（2025 年底）',
    source: 'ClinicalTrials.gov',
    snippet: '主要完成日期预计 2025 年 12 月。45 家中心正在招募。'
  },
  'ev-3': {
    id: 'ev-3',
    type: 'Interaction',
    title: '医学科学联络拜访',
    date: '2025年5月20日',
    source: 'Veeva CRM',
    snippet: '与 Jaclyn Stoffel 讨论了近期试验方案。陈医生对新纳入标准表示兴趣。'
  },
  'ev-4': {
    id: 'ev-4',
    type: 'Publication',
    title: 'PAH 长期结局',
    date: '2025年6月15日',
    source: '心肺移植杂志',
    snippet: '5 年生存率回顾性分析显示与早期干预相关。'
  }
};

export const MOCK_SUMMARY_SEGMENTS_ZH = [
  { text: '综上，陈凯丽医生近期积极参与多篇聚焦肺动脉高压的文献，最近一篇发表于 2025 年 7 月 1 日。', evidenceId: 'ev-1' },
  { text: '此外，旨在改善 PAH 患者治疗结局的临床试验正在进行中，活动延续至 2025 年底及以后。', evidenceId: 'ev-2' },
  { text: '另外，2025 年 5 月 20 日与 Jaclyn Stoffel 有一次医学互动。', evidenceId: 'ev-3' },
  { text: '这反映了陈医生在其领域推动研究与临床实践的持续投入。', evidenceId: 'ev-4' }
];

export type Locale = 'en' | 'zh';

export function getMockDoctors(locale: Locale): Doctor[] {
  return locale === 'zh' ? MOCK_DOCTORS_ZH : MOCK_DOCTORS;
}

export function getMockEvidence(locale: Locale): Record<string, Evidence> {
  return locale === 'zh' ? MOCK_EVIDENCE_ZH : MOCK_EVIDENCE;
}

export function getMockSummarySegments(locale: Locale): typeof MOCK_SUMMARY_SEGMENTS {
  return locale === 'zh' ? MOCK_SUMMARY_SEGMENTS_ZH : MOCK_SUMMARY_SEGMENTS;
}
