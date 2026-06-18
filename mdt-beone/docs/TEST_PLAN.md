# MDT_Beone - 详细测试计划

## 1. 测试范围与目标

- **范围**：患者信息录入、生成方案、整合/指南/循证/RWD 四个 Tab、引用详情侧栏、设置页、演示案例、Mock 数据结构。
- **目标**：功能正确、无未处理异常、数据一致、关键用户路径可回归。

## 2. 测试类型与优先级

| 类型       | 说明                     | 优先级 |
|------------|--------------------------|--------|
| 单元测试   | 组件/逻辑单点行为         | P0     |
| 集成测试   | 多组件协作（如点击引用→右侧详情） | P0     |
| 数据一致性 | Mock 与 types 一致、必填字段完整 | P0     |
| 边界/异常  | 空数据、缺失字段、长文本  | P1     |
| 回归       | 每次修复后全量再测        | P0     |

---

## 3. 模块测试清单

### 3.1 App 与整体流程 (P0)

- [ ] **APP-1** 首屏：左侧为患者信息录入，无方案内容，有「生成治疗方案」按钮。
- [ ] **APP-2** 无输入时「生成治疗方案」为 disabled。
- [ ] **APP-3** 输入病历后点击生成，约 1.5s 后展示智能诊疗方案（中栏有内容）。
- [ ] **APP-4** 点击设置进入设置页，返回回到工作台。
- [ ] **APP-5** 有结果后点击引用可展开右栏（citation 阶段），关闭后回到 results。

### 3.2 LeftPanel 左栏 (P0)

- [ ] **LP-1** 渲染「患者信息录入」标题与病历输入框（placeholder 含「粘贴患者」）。
- [ ] **LP-2** 有「演示案例」按钮。
- [ ] **LP-3** 点击演示案例展开菜单，选择「初治 DLBCL」后病历框加载对应文本。
- [ ] **LP-4** slim 模式下显示摘要/重置入口，不显示完整录入表单。

### 3.3 CenterPanel 中栏 (P0)

- [ ] **CP-1** 无 response 且未分析时显示空状态（无方案内容）。
- [ ] **CP-2** 分析中显示 loading（正在分析病例…）。
- [ ] **CP-3** 有 response 时显示 Tab：整合 / 指南 / 循证 / 真实世界。
- [ ] **CP-4** 整合 Tab：诊断标题、概念、缺失信息、治疗方案、指南摘要、RWD 摘要可见。
- [ ] **CP-5** 指南 Tab：参考指南列表、各指南意见（按来源）、指南推荐方案（综合）均存在；推荐方案中引用角标可点。
- [ ] **CP-6** 循证 Tab：循证医学分析、循证推荐要点、关键临床研究列表存在；分析及要点中 [1][2] 等角标可点。
- [ ] **CP-7** 真实世界 Tab：匹配条件、队列流程图（RWDFlowChart）、总结文案存在。
- [ ] **CP-8** 点击角标触发 onCitationClick，不报错。

### 3.4 RightPanel 右栏 (P0)

- [ ] **RP-1** 无选中引用时不展示或展示空状态。
- [ ] **RP-2** 选中 guideline 引用时展示标题、期刊、指南定位（章节、小节、excerpt、页码）。
- [ ] **RP-3** 选中 pubmed 引用时展示标题、期刊、年份、abstract（若有）；无 guidelineLocation。
- [ ] **RP-4** 关闭按钮清除选中引用。

### 3.5 RWDFlowChart (P1)

- [ ] **RWD-1** flowData 为空或 null 时不报错，不渲染内容。
- [ ] **RWD-2** 单层节点（无 children）渲染 label + value。
- [ ] **RWD-3** 有 children 时递归渲染子节点，数值使用 toLocaleString。

### 3.6 useCDSSLogic / Mock 数据 (P0)

- [ ] **MOCK-1** buildMockResponse 返回的 response 符合 CDSSResponse 类型；diagnosisTitle、concepts、treatments、guidelines、citations 非空。
- [ ] **MOCK-2** citations 含 guideline 与 pubmed；至少一条 guideline 带 guidelineLocation（section、excerpt）。
- [ ] **MOCK-3** guidelines 每条可有 recommendations 数组；recommendations 含 topic、content。
- [ ] **MOCK-4** rwdAnalysis 存在时含 flowData、criteria、summaryText、dataSource；flowData 为树形结构。
- [ ] **MOCK-5** comprehensiveAnalysis 含 [1][2] 或 [3] 等引用标记；循证推荐要点中引用的 index 在 citations 中存在。

### 3.7 演示案例与数据常识 (P1)

- [ ] **DEMO-1** SCENARIOS 每个案例有 id、name、initialText；id 与 key 一致；名称与初始文本长度合理。
- [ ] **DEMO-2** 病历中 ECOG 若存在，数值在 0–4。

### 3.8 Settings 设置页 (P1)

- [ ] **SET-1** 设置页有「返回」按钮，点击回到工作台。
- [ ] **SET-2** 设置页标题/系统设置相关文案存在。

---

## 4. 执行流程

1. **首轮**：运行现有 Vitest 用例 + 新增用例，记录失败项。
2. **修复**：按失败用例逐项修 bug（代码或 mock 数据）。
3. **复测**：全量再跑测试。
4. **迭代**：重复 2–3 直至全部通过且无新增回归。
5. **收尾**：将测试计划中已覆盖项勾选，并更新本文档通过状态。

---

## 5. 通过状态（执行后填写）

- 计划编写日期：2025-03-12
- 最后执行日期：___________
- 测试结果：□ 全部通过  □ 部分通过（见下方）
- 备注：___________

