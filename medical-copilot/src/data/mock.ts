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
