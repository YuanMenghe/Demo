/** 演示案例：id、名称、初始病历文本。需保证医学常识一致（如 ECOG 0-4、分期表述等） */
export const SCENARIOS: Record<string, { id: string; name: string; initialText: string }> = {
  scenario1: {
    id: 'scenario1',
    name: '演示案例 1: 初治 DLBCL (标准/Pola-R-CHP)',
    initialText: `患者男性，65岁。
主诉：发现左侧颈部包块2月余，伴乏力。
现病史：2月前无意中发现左侧颈部包块，无痛性，进行性增大。无发热、盗汗、体重下降（无B症状）。
查体：ECOG评分 1分。双侧颈部、左侧锁骨上可触及肿大淋巴结，最大约3cm，质韧。余浅表淋巴结未及。
病理（外院）：弥漫大B细胞淋巴瘤，GCB亚型。免疫组化：CD20+，CD10+，BCL6+，MUM1-，Ki-67 约80%。
分期检查：Ann Arbor III期 A；LDH 升高；骨髓未见侵犯。HBsAg 阳性。`,
  },
  scenario2: {
    id: 'scenario2',
    name: '演示案例 2: 禁忌症 (合并心衰)',
    initialText: `患者女性，72岁。
主诉：确诊弥漫大B细胞淋巴瘤1周，拟制定治疗方案。
现病史：1周前淋巴结活检病理确诊DLBCL，非特指型。既往高血压、慢性心衰（NYHA II级），LVEF 35%。
ECOG 1分。Ann Arbor II期，LDH 正常。`,
  },
  scenario3: {
    id: 'scenario3',
    name: '演示案例 3: 信息缺失 (待确诊)',
    initialText: `患者男性，58岁。发现颈部淋巴结肿大2月，伴发热。外院淋巴结活检提示「B细胞淋巴瘤」，具体亚型待会诊。ECOG 0分。未完成完整分期及分子检测。`,
  },
  scenario4: {
    id: 'scenario4',
    name: '演示案例 4: 复发难治 (双表达)',
    initialText: `患者男性，55岁。6月前诊断DLBCL，双表达（BCL2+，MYC+），完成R-CHOP 6周期后2月复发。PET-CT示多部位进展。ECOG 2分。既往无乙肝。`,
  },
};
