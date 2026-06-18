# MDT_Beone 测试计划

## 范围
患者信息录入、生成方案、整合/指南/循证/RWD Tab、引用详情、设置页、Mock 数据。

## 模块清单
- App: 首屏、按钮禁用、生成后展示方案、设置页往返。
- LeftPanel: 标题与输入框、演示案例、加载案例文本。
- CenterPanel: 空态、Tab 切换、指南/循证/RWD 内容。
- RightPanel: 引用详情、指南定位、abstract。
- RWDFlowChart: 空数据、树形渲染。
- useCDSSLogic: response 结构、citations/guidelines/rwdAnalysis、guidelineLocation、引用角标。
- SCENARIOS: id/name/initialText、ECOG 0-4。
- Settings: 返回按钮。

## 执行
1. 运行 vitest 全量。2. 修复失败。3. 复测至全部通过。

