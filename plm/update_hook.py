import sys

with open('src/hooks/useCDSSLogic.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("RWDAnalysis", "DrugInfo")

rwd_block = """  const rwd: DrugInfo = {
    totalDatabaseSize: 12500,
    matchedCohortSize: 320,
    matchQuality: 'high',
    dataSource: 'CSCO-WL C-RWD (2020-2023)',
    summaryText: '在真实世界队列中，年龄>60岁且伴有乙肝表面抗原阳性的DLBCL患者，接受R-CHOP方案联合预防性抗病毒治疗（恩替卡韦）后，肝功能异常发生率显著降低（从15%降至3%）。该结果支持本例患者必须启动并维持抗病毒治疗。',
    criteria: [
      { name: '疾病亚型', value: 'DLBCL, NOS', category: 'high_weight', matchStatus: 'exact' },
      { name: '年龄段', value: '60-70岁', category: 'high_weight', matchStatus: 'exact' },
      { name: '分期', value: 'II/III期', category: 'low_weight', matchStatus: 'partial' },
      { name: '合并症', value: 'HBsAg (+)', category: 'high_weight', matchStatus: 'exact' }
    ],
    flowData: [
      { id: 'start', label: 'DLBCL队列 (n=12,500)', value: 12500, children: [
        { id: 'age', label: '60-70岁 (n=3,200)', value: 3200, children: [
          { id: 'hbsag', label: 'HBsAg阳性 (n=320)', value: 320 }
        ]}
      ]}
    ]
  };"""

if rwd_block in content:
    content = content.replace(rwd_block, "")
    
content = content.replace("rwdAnalysis: rwd,", "")

with open('src/hooks/useCDSSLogic.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated useCDSSLogic.ts")
