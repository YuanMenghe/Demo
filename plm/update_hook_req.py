import sys

with open('src/hooks/useCDSSLogic.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("requiredFor: 'guideline_unlock'", "requiredFor: '解锁分期与预后评分'")
content = content.replace("requiredFor: 'treatment_safety'", "requiredFor: '用药安全与联合用药禁忌判断'")

with open('src/hooks/useCDSSLogic.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced English placeholders")
