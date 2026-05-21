import sys
import re

with open('src/hooks/useCDSSLogic.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to add some mock data for drugInfo and userKb.
# find the definition of EMPTY_RESPONSE and add drugInfo and userKb to it.

drug_info_mock = """
  drugInfo: [
    {
      id: 'd1',
      name: '利妥昔单抗 (Rituximab)',
      indicationMatch: 'high',
      dosage: '375 mg/m²，静脉滴注，第1天',
      contraindications: ['对本品或鼠蛋白过敏者', '活动性严重感染', '严重心衰'],
      adverseReactions: ['输液相关反应（发热、寒战）', '骨髓抑制', '感染风险增加'],
      interactionCheck: {
        status: 'warning',
        suggestion: '慎用/密切监测',
        reason: '患者HBsAg阳性，利妥昔单抗存在HBV再激活风险，必须联合抗病毒药物（如恩替卡韦）并密切监测HBV DNA。'
      }
    }
  ],
  userKb: [
    {
      id: 'kb1',
      title: '我院DLBCL规范化诊疗流程（2025版）',
      content: '根据我院MDT专家共识，对于初诊DLBCL且HBsAg阳性患者，需在化疗前至少1周启动恩替卡韦预防性抗病毒治疗，并在免疫化疗结束后继续维持至少12个月。同时建议常规查HBV DNA基线水平。',
      relevance: 'high',
      sourceFile: 'DLBCL_Clinical_Pathway_v2.pdf'
    }
  ],
"""

# Let's insert it before `exams: [`

content = content.replace("exams: [", drug_info_mock + "  exams: [")

with open('src/hooks/useCDSSLogic.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Mock data added")
