# feishu-md-fixer 测试计划

## 1. 功能清单与测试范围

| 模块 | 功能点 | 测试类型 | 优先级 |
|------|--------|----------|--------|
| Pipeline | 空输入/非字符串返回空 | 单元 | P0 |
| Pipeline | 正常 Markdown 解析与变换 | 单元 | P0 |
| Pipeline | 转义剥离（\. \& 行末\） | 单元 | P0 |
| Pipeline | 多空行合并（3+ → 2） | 单元 | P0 |
| Pipeline | 异常输入不抛错、原样返回 | 单元 | P0 |
| Transformers | 标题升降级、转加粗、编辑 | 单元(经 pipeline) | P0 |
| Transformers | 数字 Emoji → 1. 2. 3. | 单元 | P0 |
| Transformers | 删除代码块/引用/分割线/链接简化 | 单元 | P1 |
| Templates | 模板复制 config 独立、深拷贝 | 单元 | P0 |
| Clipboard | 写入前连续换行 → 单换行（飞书无空行） | 单元 | P0 |
| htmlToMarkdown | 空 HTML 回退 text、异常不抛 | 单元 | P1 |
| App 流程 | output 与 editorRef 同步、复制取 getMarkdown | 手测/集成 | P0 |
| UI | 长文可滚动、占位与编辑切换 | 手测 | P1 |

## 2. 自动化测试用例（Vitest）

### 2.1 pipeline.test.ts（已有 + 补充）
- 空/空白/非字符串 → ''
- 简单 Markdown 无转义、无多余空行
- 非法输入不抛错、返回 trim 原文
- 3+ 换行压成 2
- 行末反斜杠去掉
- **补充**：标题降级、数字 emoji 转换（依赖 defaultConfig）

### 2.2 templates.test.ts（已有）
- createTemplateFrom 副本 config 独立
- cloneTemplateConfig 深拷贝

### 2.3 clipboard 写入规范化（新增）
- normalize：\n\n → \n，\n\n\n → \n，trimEnd

### 2.4 htmlToMarkdown（新增）
- 空 html 返回 fallbackText
- 正常 html 返回 markdown 串
- 异常不抛错、回退 fallbackText

## 3. 执行与回归流程

1. **运行**：`npm run test`
2. **修复**：任何失败用例修代码或用例，直到全部通过
3. **构建**：`npm run build` 确保无编译/打包错误
4. **手测检查表**（可选）：一键读取、粘贴弹窗、复制、模板切换、长文滚动

## 4. 通过标准

- 所有 Vitest 用例通过
- `npm run build` 成功
- 无新增 linter 报错

## 5. 执行记录

| 日期 | 结果 | 说明 |
|------|------|------|
| 本轮 | ✅ 20 用例全部通过 | pipeline 8 + templates 2 + feishuPasteNormalize 6 + htmlToMarkdown 4；构建成功、无 lint 报错 |

### 5.1 手测检查表（可选）

- [ ] 一键读取→处理：有内容时能处理并展示
- [ ] 一键读取→处理→复制：粘贴到飞书无多余空行
- [ ] 复制 Markdown：粘贴到飞书无多余空行
- [ ] 粘贴弹窗：Ctrl+V 后能清洗并更新
- [ ] 切换模板：结果区随规则重算
- [ ] 长文：编辑区可滚动到底
