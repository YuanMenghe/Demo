// 智汇MDT - 模拟数据

const mockPatients = [
    {
        id: 'P001',
        name: '王某某',
        gender: '男',
        age: 58,
        disease: '肝细胞癌',
        stage: 'III期',
        complications: ['高血压', '糖尿病'],
        treatment: '初治',
        group: 'liver',
        lastUpdate: '2026-03-06 10:30',
        timeline: [
            { date: '2025-08-07', title: '首次入院检查', hospital: '山东省立医院', type: 'admission', 
              desc: '患者因模糊性黄疸入院，实验室检查显示肝功能严重异常，总胆红素725.82 μmol/L，凝血功能异常，肿瘤标志物CA19-9(418.00 IU/ml)和异常凝血酶原(3754.00 mAU/ml)显著升高，心超提示未见明显异常。' },
            { date: '2025-08-08', title: '心脏超声检查', hospital: '山东省立医院', type: 'imaging',
              desc: '心脏超声检查显示心内结构异常，基本排除心脏相关病因。' },
            { date: '2025-08-10', title: '肝穿加重', hospital: '山东省立医院', type: 'evaluation',
              desc: '黄疸加重，总胆红素继续升高(725.82μmol/L)，肝功能恶化(CREA 124.0)，出血白蛋白升高及低钠血症。' },
            { date: '2025-08-13', title: '降钙素原升高', hospital: '山东省立医院', type: 'evaluation',
              desc: '检查显示降钙素原(PCT)升高(0.75ng/ml)，考虑感染，总胆红素下降至510.5μmol/L，但肝硬化仍在。' },
            { date: '2025-08-15', title: '增强CT确认肝占位', hospital: '山东省立医院', type: 'imaging',
              desc: '增强CT确认肝左叶占位（考虑肝肿瘤），显示为PTCD术后状态，同时发现左肾下方结节（约1.4cm），建议会诊。' },
            { date: '2025-08-17', title: '肝脏MR检查', hospital: '山东省立医院', type: 'imaging',
              desc: '肝脏MR提示肝左叶占位，考虑肝胆管癌，伴肝硬化、肝肿大，同日化验尿蛋血尿物酶异常(INR 1.76)，总胆红素下降至316.1μmol/L。' },
            { date: '2025-08-22', title: '肝功能指标异常', hospital: '山东省立医院', type: 'evaluation',
              desc: '肝功能仍严重异常，总胆红素升至555.53μmol/L，出现轻度贫血(RBC 4.26)。' },
            { date: '2025-09-01', title: '肝动脉化疗栓塞(TACE)', hospital: '山东省立医院', type: 'treatment',
              desc: '行TACE治疗，术后化验显示贫血加重(HGB 128g/L)，肝功能持续异常，并出现电解质紊乱(低钾、低钠)。' },
            { date: '2025-09-05', title: '贫血加重', hospital: '山东省立医院', type: 'evaluation',
              desc: '贫血加重(HGB 120g/L)，D-二聚体(1.16mg/L)及CRP(33.8mg/L)升高，HBV-DNA转阴。' },
            { date: '2025-09-08', title: '炎症指标持续升高', hospital: '山东省立医院', type: 'evaluation',
              desc: '炎症指标CRP持续升高至41.9mg/L，总胆红素升至269.5μmol/L，肝功能恶化。' },
            { date: '2025-09-10', title: '严重感染征象', hospital: '山东省立医院', type: 'evaluation',
              desc: '出现严重感染征象，白细胞(12.97×10^9/L)升高，伴血胆红素(49.43μmol/L)及严重电解质紊乱和代谢性酸中毒。' },
            { date: '2025-09-12', title: '感染指标仍高', hospital: '山东省立医院', type: 'evaluation',
              desc: '感染指标仍高，D-二聚体升至1.72mg/L，肝功能持续异常，紫癜(26.9mmol/L)和宾容(490.0μmol/L)显著升高。' },
            { date: '2025-10-20', title: '复查评估', hospital: '山东省立医院', type: 'followup',
              desc: '复查评估显示肝功能有所改善，AFP下降至450ng/mL，建议继续观察。' },
            { date: '2025-12-05', title: '二次TACE治疗', hospital: '山东省立医院', type: 'treatment',
              desc: '二次TACE治疗，术后肝功能稳定，肿瘤标志物继续下降。' },
            { date: '2026-02-10', title: 'MDT多学科会诊', hospital: '山东省立医院', type: 'mdt',
              desc: '组织肝胆外科、肿瘤内科、影像科、介入科进行MDT会诊，讨论后续治疗方案，建议靶向联合免疫治疗。' },
        ],
        indicators: {
            AFP: [{ date: '2025-08-07', value: 1250 }, { date: '2025-09-01', value: 890 }, { date: '2025-10-20', value: 450 }, { date: '2025-12-05', value: 380 }, { date: '2026-02-10', value: 125 }],
            ALT: [{ date: '2025-08-07', value: 85 }, { date: '2025-09-01', value: 120 }, { date: '2025-10-20', value: 65 }, { date: '2025-12-05', value: 48 }, { date: '2026-02-10', value: 42 }],
            AST: [{ date: '2025-08-07', value: 92 }, { date: '2025-09-01', value: 135 }, { date: '2025-10-20', value: 58 }, { date: '2025-12-05', value: 45 }, { date: '2026-02-10', value: 38 }],
        },
        basicInfo: {
            chiefComplaint: '右上腹隐痛2月余，发现肝占位1周',
            presentHistory: '患者2月前无明显诱因出现右上腹隐痛，呈持续性，无放射痛。1周前体检发现肝右叶占位，遂来我院就诊。',
            pastHistory: '乙肝病史20年，高血压病史10年，糖尿病史5年',
            familyHistory: '父亲因肝癌去世，母亲健在',
            personalHistory: '吸烟史30年，每日1包；饮酒史25年',
        }
    },
    {
        id: 'P002',
        name: '李某某',
        gender: '女',
        age: 45,
        disease: '弥漫大B细胞淋巴瘤',
        stage: 'IV期',
        complications: ['贫血'],
        treatment: '复发',
        group: 'lymphoma',
        lastUpdate: '2026-03-05 16:20',
        timeline: [
            { date: '2024-03-15', title: '初诊确诊', hospital: '北京协和医院', type: 'diagnosis' },
            { date: '2024-04-01', title: 'R-CHOP方案化疗', hospital: '北京协和医院', type: 'treatment' },
            { date: '2024-09-20', title: '完全缓解评估', hospital: '北京协和医院', type: 'evaluation' },
            { date: '2025-11-10', title: '复发确认', hospital: '山东省立医院', type: 'relapse' },
            { date: '2026-01-15', title: 'MDT会诊', hospital: '山东省立医院', type: 'mdt' },
        ],
        indicators: {
            LDH: [{ date: '2024-03-15', value: 580 }, { date: '2024-09-20', value: 220 }, { date: '2025-11-10', value: 420 }],
            'β2-MG': [{ date: '2024-03-15', value: 4.2 }, { date: '2024-09-20', value: 2.1 }, { date: '2025-11-10', value: 3.8 }],
        },
        basicInfo: {
            chiefComplaint: '颈部淋巴结肿大伴发热1月',
            presentHistory: '患者1月前发现右侧颈部淋巴结肿大，伴间断发热，体温最高39°C，伴夜间盗汗、体重下降约5kg。',
            pastHistory: '既往体健',
            familyHistory: '无特殊',
            personalHistory: '无吸烟饮酒史',
        }
    },
    {
        id: 'P003',
        name: '张某某',
        gender: '男',
        age: 62,
        disease: '肺腺癌',
        stage: 'IIIB期',
        complications: ['COPD', '冠心病'],
        treatment: '初治',
        group: 'lung',
        lastUpdate: '2026-03-04 14:15',
        timeline: [
            { date: '2025-12-01', title: '胸部CT发现肺结节', hospital: '济南市中心医院', type: 'imaging' },
            { date: '2025-12-15', title: 'PET-CT检查', hospital: '山东省立医院', type: 'imaging' },
            { date: '2026-01-05', title: '穿刺活检确诊', hospital: '山东省立医院', type: 'diagnosis' },
            { date: '2026-02-20', title: 'MDT会诊', hospital: '山东省立医院', type: 'mdt' },
        ],
        indicators: {
            CEA: [{ date: '2025-12-01', value: 15.6 }, { date: '2026-01-05', value: 18.2 }, { date: '2026-02-20', value: 22.5 }],
            NSE: [{ date: '2025-12-01', value: 12.3 }, { date: '2026-01-05', value: 14.1 }, { date: '2026-02-20', value: 13.8 }],
        },
        basicInfo: {
            chiefComplaint: '咳嗽、咳痰2月余，发现肺占位1月',
            presentHistory: '患者2月前出现咳嗽、咳痰，痰中偶带血丝。1月前胸部CT发现右肺上叶占位性病变。',
            pastHistory: 'COPD病史10年，冠心病史5年',
            familyHistory: '无肿瘤家族史',
            personalHistory: '吸烟史40年，每日2包',
        }
    },
    {
        id: 'P004',
        name: '赵某某',
        gender: '女',
        age: 55,
        disease: '胃癌',
        stage: 'II期',
        complications: [],
        treatment: '初治',
        group: 'gastric',
        lastUpdate: '2026-03-03 09:45',
        timeline: [
            { date: '2026-01-10', title: '胃镜检查', hospital: '山东大学齐鲁医院', type: 'examination' },
            { date: '2026-01-20', title: '腹部CT增强', hospital: '山东大学齐鲁医院', type: 'imaging' },
            { date: '2026-02-01', title: '术前评估', hospital: '山东大学齐鲁医院', type: 'evaluation' },
        ],
        indicators: {
            'CA19-9': [{ date: '2026-01-10', value: 45 }, { date: '2026-02-01', value: 52 }],
            CEA: [{ date: '2026-01-10', value: 8.5 }, { date: '2026-02-01', value: 9.2 }],
        },
        basicInfo: {
            chiefComplaint: '上腹部不适伴纳差1月',
            presentHistory: '患者1月前出现上腹部不适，进食后明显，伴食欲下降，体重减轻约3kg。',
            pastHistory: '既往体健',
            familyHistory: '母亲有胃癌病史',
            personalHistory: '无吸烟饮酒史',
        }
    },
    {
        id: 'P005',
        name: '刘某某',
        gender: '男',
        age: 48,
        disease: '肝细胞癌',
        stage: 'II期',
        complications: ['乙肝肝硬化'],
        treatment: '初治',
        group: 'liver',
        lastUpdate: '2026-03-02 11:30',
        timeline: [
            { date: '2025-11-15', title: '肝脏超声发现结节', hospital: '济南市第一人民医院', type: 'imaging' },
            { date: '2025-12-01', title: '肝脏MRI增强', hospital: '山东省立医院', type: 'imaging' },
            { date: '2026-01-10', title: '肝穿刺活检', hospital: '山东省立医院', type: 'diagnosis' },
        ],
        indicators: {
            AFP: [{ date: '2025-11-15', value: 350 }, { date: '2025-12-01', value: 420 }, { date: '2026-01-10', value: 480 }],
            ALT: [{ date: '2025-11-15', value: 62 }, { date: '2025-12-01', value: 58 }, { date: '2026-01-10', value: 55 }],
        },
        basicInfo: {
            chiefComplaint: '体检发现肝占位2周',
            presentHistory: '患者常规体检超声发现肝右叶低回声结节，进一步检查确诊为肝癌。',
            pastHistory: '乙肝病史15年，肝硬化3年',
            familyHistory: '父亲有乙肝病史',
            personalHistory: '少量饮酒史',
        }
    },
    {
        id: 'P006',
        name: '陈某某',
        gender: '女',
        age: 38,
        disease: '霍奇金淋巴瘤',
        stage: 'II期',
        complications: [],
        treatment: '初治',
        group: 'lymphoma',
        lastUpdate: '2026-03-01 15:00',
        timeline: [
            { date: '2026-01-05', title: '颈部淋巴结活检', hospital: '山东省肿瘤医院', type: 'diagnosis' },
            { date: '2026-01-20', title: 'PET-CT分期', hospital: '山东省肿瘤医院', type: 'imaging' },
            { date: '2026-02-15', title: 'ABVD方案化疗', hospital: '山东省肿瘤医院', type: 'treatment' },
        ],
        indicators: {
            LDH: [{ date: '2026-01-05', value: 280 }, { date: '2026-02-15', value: 245 }],
            ESR: [{ date: '2026-01-05', value: 65 }, { date: '2026-02-15', value: 42 }],
        },
        basicInfo: {
            chiefComplaint: '颈部淋巴结肿大2月',
            presentHistory: '患者2月前发现左侧颈部淋巴结肿大，无压痛，逐渐增大。',
            pastHistory: '既往体健',
            familyHistory: '无特殊',
            personalHistory: '无吸烟饮酒史',
        }
    },
    {
        id: 'P007',
        name: '孙某某',
        gender: '男',
        age: 70,
        disease: '肺鳞癌',
        stage: 'IV期',
        complications: ['高血压', '房颤'],
        treatment: '难治',
        group: 'lung',
        lastUpdate: '2026-02-28 10:20',
        timeline: [
            { date: '2025-06-10', title: '初诊确诊', hospital: '山东省立医院', type: 'diagnosis' },
            { date: '2025-07-01', title: '化疗方案启动', hospital: '山东省立医院', type: 'treatment' },
            { date: '2025-10-15', title: '疾病进展', hospital: '山东省立医院', type: 'progression' },
            { date: '2025-12-01', title: '免疫治疗', hospital: '山东省立医院', type: 'treatment' },
            { date: '2026-02-20', title: 'MDT会诊', hospital: '山东省立医院', type: 'mdt' },
        ],
        indicators: {
            SCC: [{ date: '2025-06-10', value: 12.5 }, { date: '2025-10-15', value: 18.3 }, { date: '2026-02-20', value: 15.2 }],
            CYFRA21: [{ date: '2025-06-10', value: 8.2 }, { date: '2025-10-15', value: 12.6 }, { date: '2026-02-20', value: 10.1 }],
        },
        basicInfo: {
            chiefComplaint: '咳嗽、胸痛4月，发现肺部肿物3月',
            presentHistory: '患者4月前出现干咳、胸痛，后确诊为肺鳞癌IV期，经多线治疗后病情反复。',
            pastHistory: '高血压病史15年，房颤3年',
            familyHistory: '父亲因肺癌去世',
            personalHistory: '吸烟史45年',
        }
    },
    {
        id: 'P008',
        name: '周某某',
        gender: '女',
        age: 52,
        disease: '胃癌',
        stage: 'III期',
        complications: ['贫血'],
        treatment: '术后',
        group: 'gastric',
        lastUpdate: '2026-02-27 14:50',
        timeline: [
            { date: '2025-09-15', title: '胃镜活检确诊', hospital: '山东大学齐鲁医院', type: 'diagnosis' },
            { date: '2025-10-10', title: '胃癌根治术', hospital: '山东大学齐鲁医院', type: 'surgery' },
            { date: '2025-11-15', title: '术后辅助化疗', hospital: '山东大学齐鲁医院', type: 'treatment' },
            { date: '2026-02-20', title: '术后复查', hospital: '山东大学齐鲁医院', type: 'followup' },
        ],
        indicators: {
            'CA19-9': [{ date: '2025-09-15', value: 120 }, { date: '2025-11-15', value: 45 }, { date: '2026-02-20', value: 28 }],
            CEA: [{ date: '2025-09-15', value: 15.8 }, { date: '2025-11-15', value: 6.2 }, { date: '2026-02-20', value: 4.1 }],
            HGB: [{ date: '2025-09-15', value: 85 }, { date: '2025-11-15', value: 98 }, { date: '2026-02-20', value: 112 }],
        },
        basicInfo: {
            chiefComplaint: '上腹痛、黑便1月',
            presentHistory: '患者1月前出现上腹部疼痛，伴黑便，胃镜检查确诊为胃癌。',
            pastHistory: '既往体健',
            familyHistory: '无特殊',
            personalHistory: '无吸烟饮酒史',
        }
    },
    {
        id: 'P009',
        name: '郑某某',
        gender: '男',
        age: 48,
        disease: '结直肠癌',
        stage: 'II期',
        complications: [],
        treatment: '初治',
        group: '',
        lastUpdate: '2026-03-06 09:15',
        timeline: [
            { date: '2026-02-20', title: '肠镜发现肿物', hospital: '济南市第一人民医院', type: 'imaging' },
            { date: '2026-03-01', title: '活检确诊', hospital: '山东省立医院', type: 'diagnosis' },
        ],
        indicators: {
            CEA: [{ date: '2026-03-01', value: 8.5 }],
            'CA19-9': [{ date: '2026-03-01', value: 35 }],
        },
        basicInfo: {
            chiefComplaint: '便血、大便习惯改变2月',
            presentHistory: '患者2月前出现便血，大便次数增多，每日3-4次，遂行肠镜检查发现结肠肿物。',
            pastHistory: '既往体健',
            familyHistory: '无特殊',
            personalHistory: '无吸烟饮酒史',
        }
    },
    {
        id: 'P010',
        name: '吴某某',
        gender: '女',
        age: 35,
        disease: '乳腺癌',
        stage: 'IIA期',
        complications: [],
        treatment: '初治',
        group: '',
        lastUpdate: '2026-03-05 15:40',
        timeline: [
            { date: '2026-02-15', title: '乳腺超声发现肿块', hospital: '济南市妇幼保健院', type: 'imaging' },
            { date: '2026-02-28', title: '穿刺活检确诊', hospital: '山东省立医院', type: 'diagnosis' },
        ],
        indicators: {
            'CA15-3': [{ date: '2026-02-28', value: 28 }],
        },
        basicInfo: {
            chiefComplaint: '发现右乳肿块1月',
            presentHistory: '患者1月前洗澡时偶然发现右乳外上象限肿块，约2cm大小，无疼痛。',
            pastHistory: '既往体健',
            familyHistory: '母亲有乳腺癌病史',
            personalHistory: '无吸烟饮酒史',
        }
    }
];

const mockDepartments = [
    {
        id: 'D001',
        name: '肿瘤内科',
        onlineCount: 3,
        totalCases: 850,
        remainingCases: 150,
        diseases: ['肝癌', '肺癌', '胃癌', '淋巴瘤']
    },
    {
        id: 'D002',
        name: '肝胆外科',
        onlineCount: 2,
        totalCases: 620,
        remainingCases: 180,
        diseases: ['肝癌', '胆管癌', '胆囊癌']
    },
    {
        id: 'D003',
        name: '胸外科',
        onlineCount: 2,
        totalCases: 480,
        remainingCases: 120,
        diseases: ['肺癌', '食管癌', '胸腺瘤']
    },
    {
        id: 'D004',
        name: '血液科',
        onlineCount: 1,
        totalCases: 320,
        remainingCases: 80,
        diseases: ['淋巴瘤', '白血病', '多发性骨髓瘤']
    },
    {
        id: 'D005',
        name: '消化内科',
        onlineCount: 2,
        totalCases: 280,
        remainingCases: 70,
        diseases: ['胃癌', '结直肠癌', '胰腺癌']
    },
    {
        id: 'D006',
        name: '放疗科',
        onlineCount: 2,
        totalCases: 560,
        remainingCases: 90,
        diseases: ['肺癌', '食管癌', '鼻咽癌']
    }
];

const diseaseIndicators = {
    '肝癌': ['AFP', 'ALT', 'AST', 'TBIL', 'ALB', 'PT'],
    '肺癌': ['CEA', 'NSE', 'CYFRA21', 'SCC', 'proGRP'],
    '淋巴瘤': ['LDH', 'β2-MG', 'ESR', 'CRP'],
    '胃癌': ['CEA', 'CA19-9', 'CA72-4', 'HGB'],
    '默认': ['CEA', 'CA19-9', 'AFP', 'LDH']
};

const indicatorColors = {
    'AFP': '#ef4444',
    'ALT': '#f97316',
    'AST': '#eab308',
    'CEA': '#22c55e',
    'NSE': '#14b8a6',
    'CYFRA21': '#06b6d4',
    'SCC': '#3b82f6',
    'LDH': '#8b5cf6',
    'β2-MG': '#d946ef',
    'CA19-9': '#ec4899',
    'CA72-4': '#f43f5e',
    'HGB': '#64748b',
    'ESR': '#0ea5e9',
    'proGRP': '#a855f7',
    'TBIL': '#84cc16',
    'ALB': '#fbbf24',
    'PT': '#fb923c',
    'CRP': '#a3e635'
};

const indicatorUnits = {
    'AFP': 'ng/mL',
    'ALT': 'U/L',
    'AST': 'U/L',
    'CEA': 'ng/mL',
    'NSE': 'ng/mL',
    'CYFRA21': 'ng/mL',
    'SCC': 'ng/mL',
    'LDH': 'U/L',
    'β2-MG': 'mg/L',
    'CA19-9': 'U/mL',
    'CA72-4': 'U/mL',
    'HGB': 'g/L',
    'ESR': 'mm/h',
    'proGRP': 'pg/mL',
    'TBIL': 'μmol/L',
    'ALB': 'g/L',
    'PT': 's',
    'CRP': 'mg/L'
};

const indicatorRanges = {
    'AFP': { min: 0, max: 7, unit: 'ng/mL' },
    'ALT': { min: 0, max: 40, unit: 'U/L' },
    'AST': { min: 0, max: 40, unit: 'U/L' },
    'CEA': { min: 0, max: 5, unit: 'ng/mL' },
    'NSE': { min: 0, max: 16.3, unit: 'ng/mL' },
    'CYFRA21': { min: 0, max: 3.3, unit: 'ng/mL' },
    'SCC': { min: 0, max: 1.5, unit: 'ng/mL' },
    'LDH': { min: 120, max: 250, unit: 'U/L' },
    'β2-MG': { min: 1.0, max: 3.0, unit: 'mg/L' },
    'CA19-9': { min: 0, max: 37, unit: 'U/mL' },
    'CA72-4': { min: 0, max: 6.9, unit: 'U/mL' },
    'HGB': { min: 120, max: 160, unit: 'g/L' },
    'ESR': { min: 0, max: 20, unit: 'mm/h' },
};
