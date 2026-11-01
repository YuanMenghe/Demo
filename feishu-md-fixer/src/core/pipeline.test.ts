import { describe, it, expect } from 'vitest'
import { applyPipeline } from './pipeline'
import { BUILTIN_TEMPLATES } from './templates'
import { shiftHeadingsInMarkdown, normalizeNumberingInMarkdown } from './transformers'

const defaultConfig = BUILTIN_TEMPLATES[0]!.config

describe('applyPipeline', () => {
  it('returns empty string for empty input', () => {
    expect(applyPipeline('', { template: defaultConfig })).toBe('')
    expect(applyPipeline('   ', { template: defaultConfig })).toBe('')
    expect(applyPipeline('\n\t  \n', { template: defaultConfig })).toBe('')
  })

  it('returns empty string for non-string input (guarded)', () => {
    expect(applyPipeline(null as any, { template: defaultConfig })).toBe('')
    expect(applyPipeline(undefined as any, { template: defaultConfig })).toBe('')
  })

  it('keeps a jumped ordered marker instead of letting the parser renumber it', () => {
    const out = applyPipeline('1. 父项\n21. 章节', { template: defaultConfig })
    expect(out).toContain('1. 父项')
    expect(out).toContain('21． 章节')
    expect(out).not.toMatch(/^2\. 章节/m)
  })

  it('processes simple markdown and strips backslash escapes', () => {
    const input = '# Hello\n\n1. item one\n2. item two'
    const out = applyPipeline(input, { template: defaultConfig })
    expect(out).toContain('Hello')
    expect(out).not.toMatch(/\\\./)
    expect(out).not.toMatch(/\\\s*$/)
  })

  it('does not throw on invalid or edge markdown', () => {
    expect(() => applyPipeline('[[[', { template: defaultConfig })).not.toThrow()
    expect(() => applyPipeline('```', { template: defaultConfig })).not.toThrow()
    const r = applyPipeline('[[[', { template: defaultConfig })
    expect(r).toBe('[[[')
  })

  it('collapses multiple blank lines to at most one', () => {
    const input = 'a\n\n\n\nb'
    const out = applyPipeline(input, { template: defaultConfig })
    expect(out).not.toMatch(/\n{3,}/)
  })

  it('strips trailing backslash at end of line', () => {
    const input = 'line one\\\nline two'
    const out = applyPipeline(input, { template: defaultConfig })
    expect(out).not.toContain('\\')
  })

  it('keeps headings unchanged in pipeline (manual shift via UI)', () => {
    // 注意：标题升降级现在改为用户手动点击按钮操作当前内容，pipeline 不再自动执行
    const input = '# H1\n## H2\n### H3'
    const out = applyPipeline(input, { template: defaultConfig })
    expect(out).toContain('# H1')
    expect(out).toContain('## H2')
    expect(out).toContain('### H3')
  })

  it('converts number emoji to ordered list style (1. 2. 3.)', () => {
    const one = '\u0031\uFE0F\u20E3' // 1️⃣
    const two = '\u0032\uFE0F\u20E3' // 2️⃣
    const input = `a${one}b${two}c`
    const out = applyPipeline(input, { template: defaultConfig })
    expect(out).toContain('1. ')
    expect(out).toContain('2. ')
    expect(out).not.toMatch(/\u20E3/)
  })

  it('flattens ordered-list headings into numbered outline headings', () => {
    const input = [
      '1. # 审查维度与重点',
      '',
      '   > 引用说明',
      '',
      '   1. ## 研究必要性与创新性',
      '',
      '      - 背景描述',
      '',
      '   2. ## 研究目的与假设',
    ].join('\n')

    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('# 1 审查维度与重点')
    expect(out).toContain('## 1.1 研究必要性与创新性')
    expect(out).toContain('## 1.2 研究目的与假设')
    expect(out).toContain('引用说明')
    expect(out).not.toContain('> 引用说明')
    expect(out).not.toContain('1. # 审查维度与重点')
  })

  it('preserves plain ordered lists (paragraph-only items) without flattening to outline', () => {
    const input = [
      '## 步骤',
      '',
      '1. 医生打开微信小程序。',
      '2. 系统发起人脸识别。',
      '3. 完成认证。',
    ].join('\n')

    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('1. 医生打开微信小程序。')
    expect(out).toContain('2. 系统发起人脸识别。')
    expect(out).toContain('3. 完成认证。')
    // 不应被展平为裸段落（如 "1 医生..." 缺少点号）
    expect(out).not.toMatch(/^1 医生/m)
  })

  it('preserves GFM tables during pipeline processing', () => {
    const input = [
      '| 列1 | 列2 |',
      '| --- | --- |',
      '| A | B |',
    ].join('\n')

    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('| 列1 | 列2 |')
    expect(out).toMatch(/\|\s*-+\s*\|\s*-+\s*\|/)
    expect(out).toContain('| A')
    expect(out).toContain('| B')
  })

  it('preserves GFM task lists during pipeline processing', () => {
    const input = '- [x] done\n- [ ] todo'
    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('- [x] done')
    expect(out).toContain('- [ ] todo')
  })

  it('preserves strikethrough during pipeline processing', () => {
    const input = '这是 ~~删除线~~ 文本'
    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('~~删除线~~')
  })

  it('preserves fenced code blocks in the default technical-doc template', () => {
    const input = [
      '正文',
      '',
      '```r',
      'print("hello")',
      '```',
    ].join('\n')

    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('```r')
    expect(out).toContain('print("hello")')
    expect(out).toContain('```')
  })

  it('converts GFM footnotes into endnotes for Feishu-friendly output', () => {
    const input = [
      '这里有一句话[^a]，这里再引用一次[^a]。',
      '',
      '[^a]: 这是脚注内容',
    ].join('\n')

    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('这里有一句话[1]，这里再引用一次[1]。')
    expect(out).toContain('**注释**')
    expect(out).toContain('[1] 这是脚注内容')
    expect(out).not.toContain('[^a]')
  })

  it('keeps formatted link text and unescapes the url colon', () => {
    const input = '[**文档**](https://example.com/a)'
    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('文档')
    expect(out).toContain('https://example.com/a')
    expect(out).not.toContain('\\')
  })

  it('keeps backslashes inside fenced code blocks', () => {
    const input = ['```js', 'const re = /\\./', 'const path = "C:\\\\temp"', '```'].join('\n')
    const out = applyPipeline(input, { template: defaultConfig })

    expect(out).toContain('const re = /\\./')
    expect(out).toContain('const path = "C:\\\\temp"')
  })

  it('removes blank lines between blocks when maxBlankLines is 0, but keeps them in code', () => {
    const cfg = {
      ...defaultConfig,
      text: { collapseBlankLines: true, maxBlankLines: 0 },
    }
    const input = ['```js', 'function a() {', '', '  return 1', '}', '```', '', '段落'].join('\n')
    const out = applyPipeline(input, { template: cfg })

    expect(out).toContain('function a() {\n\n  return 1')
    expect(out).toContain('```\n段落')
    expect(out).not.toContain('```\n\n段落')
  })

  it('preserves original footnotes when keep mode is selected', () => {
    const keepConfig = {
      ...defaultConfig,
      footnote: {
        mode: 'keep' as const,
      },
    }
    const input = '正文[^1]\n\n[^1]: 脚注'
    const out = applyPipeline(input, { template: keepConfig })

    expect(out).toContain('[^1]')
    expect(out).toContain('[^1]: 脚注')
  })
})

describe('shiftHeadingsInMarkdown', () => {
  it('shifts all headings down by 1 level', () => {
    const input = '# H1\n## H2\n### H3'
    const out = shiftHeadingsInMarkdown(input, 1)
    expect(out).toContain('## H1')
    expect(out).toContain('### H2')
    expect(out).toContain('#### H3')
  })

  it('shifts all headings up by 1 level', () => {
    const input = '## H2\n### H3\n#### H4'
    const out = shiftHeadingsInMarkdown(input, -1)
    expect(out).toContain('# H2')
    expect(out).toContain('## H3')
    expect(out).toContain('### H4')
  })

  it('clamps H1 to minimum 1 when shifting up', () => {
    const input = '# H1'
    const out = shiftHeadingsInMarkdown(input, -1)
    expect(out).toBe('# H1')
  })

  it('shifts H6 down into Feishu deep heading syntax without internal markers', () => {
    const input = '###### H6'
    const out = shiftHeadingsInMarkdown(input, 1)
    expect(out).toBe('####### H6')
  })
})

describe('normalizeNumberingInMarkdown', () => {
  it('converts Chinese numbers to Arabic (一、→ 1.)', () => {
    const input = '一、第一节\n二、第二节\n三、第三节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('1. 第一节')
    expect(out).toContain('2. 第二节')
    expect(out).toContain('3. 第三节')
  })

  it('converts parentheses numbers to a nested ordered list', () => {
    const input = '（1）要点一\n（2）要点二'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('   1. 要点一')
    expect(out).toContain('   2. 要点二')
  })

  it('converts circle numbers to a deeper nested ordered list', () => {
    const input = '①细节\n②细节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('      1. 细节')
    expect(out).toContain('      2. 细节')
  })

  it('parses hundreds and keeps three outline levels', () => {
    const input = '一百零一、总则\n（1）要点\n①细节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('101． 总则')
    expect(out).toContain('   1. 要点')
    expect(out).toContain('      1. 细节')
  })

  it('protects a jumped number so the editor will not renumber it to 2', () => {
    const input = '1. 父项\n21. 章节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('1. 父项')
    expect(out).toContain('21． 章节')
    expect(out).not.toContain('\n21. 章节')
  })

  it('converts Chinese comma numbers (1、→ 1.)', () => {
    const input = '1、步骤一\n2、步骤二'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('1. 步骤一')
    expect(out).toContain('2. 步骤二')
  })

  it('preserves content that is not a numbering pattern', () => {
    const input = '这是普通段落\n# 标题\n- 列表项'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toBe(input)
  })

  it('handles mixed content with numbering', () => {
    const input = '# 标题\n一、第一节\n普通段落\n（1）要点'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('# 标题')
    expect(out).toContain('1. 第一节')
    expect(out).toContain('普通段落')
    expect(out).toContain('1. 要点')
  })

  it('handles Feishu-style OL prefix (1. 一、→ 1.)', () => {
    const input = '1. 一、第一节\n2. 二、第二节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('1. 第一节')
    expect(out).toContain('2. 第二节')
    expect(out).not.toMatch(/一、|二、/)
  })

  it('converts bullet + Chinese numbering to ordered (- 一、→ 1.)', () => {
    const input = '- 一、第一节\n- 二、第二节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('1. 第一节')
    expect(out).toContain('2. 第二节')
  })

  it('matches multi-char Chinese numerals before single-char (十一、→ 11.)', () => {
    const input = '十一、章节\n一、单独'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('11． 章节')
    expect(out).toContain('1. 单独')
  })

  it('parses twenty-one at line start and ignores numbering inside sentences', () => {
    expect(normalizeNumberingInMarkdown('二十一、章节')).toBe('21． 章节')
    expect(normalizeNumberingInMarkdown('九十九、末节')).toBe('99． 末节')
    expect(normalizeNumberingInMarkdown('会议一、讨论方案')).toBe('会议一、讨论方案')
    expect(normalizeNumberingInMarkdown('第一，我们先看数据')).toBe('第一，我们先看数据')
    expect(normalizeNumberingInMarkdown('版本（1）已发布')).toBe('版本（1）已发布')
    expect(normalizeNumberingInMarkdown('参数1，参数2')).toBe('参数1，参数2')
    expect(normalizeNumberingInMarkdown('见①项')).toBe('见①项')
  })

  it('strips duplicate digit+顿号 after ordered marker (1. 1、→ 1.)', () => {
    const input = '1. 1、步骤一'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toBe('1. 步骤一')
  })

  it('handles blockquote + Chinese numbering', () => {
    const input = '> 一、引用节'
    const out = normalizeNumberingInMarkdown(input)
    expect(out).toContain('> 1. 引用节')
  })
})

describe('shiftHeadingsInMarkdown edge cases', () => {
  it('returns unchanged for empty input', () => {
    expect(shiftHeadingsInMarkdown('', 1)).toBe('')
    expect(shiftHeadingsInMarkdown('   ', 1)).toBe('   ')
  })

  it('returns unchanged for delta 0', () => {
    const input = '# H1\n## H2'
    expect(shiftHeadingsInMarkdown(input, 0)).toBe(input)
  })

  it('handles content without headings', () => {
    const input = '普通段落\n- 列表项'
    expect(shiftHeadingsInMarkdown(input, 1)).toBe(input)
  })

  it('handles multiple levels shift', () => {
    const input = '# H1'
    const out = shiftHeadingsInMarkdown(input, 3)
    expect(out).toBe('#### H1')
  })

  it('preserves extra deep levels beyond H6 as Feishu heading hashes', () => {
    const input = '##### H5'
    const out = shiftHeadingsInMarkdown(input, 3)
    expect(out).toBe('######## H5')
  })

  it('shifts headings with up to 3 leading spaces', () => {
    const input = '   ## Indented heading'
    const out = shiftHeadingsInMarkdown(input, 1)
    expect(out).toBe('   ### Indented heading')
  })

  it('shifts setext headings as real headings', () => {
    const input = 'Title\n---\n\nSubtitle\n==='
    const out = shiftHeadingsInMarkdown(input, 1)
    expect(out).toContain('### Title')
    expect(out).toContain('## Subtitle')
  })

  it('leaves a thematic break after a blank line or an ATX heading alone', () => {
    expect(shiftHeadingsInMarkdown('段落\n\n---\n\n下一段', 1)).toBe('段落\n\n---\n\n下一段')
    expect(shiftHeadingsInMarkdown('# 标题\n---\n正文', 1)).toBe('## 标题\n---\n正文')
  })

  it('does not change pseudo headings inside fenced code blocks', () => {
    const input = '```md\n# not a heading\n```\n\n## Real heading'
    const out = shiftHeadingsInMarkdown(input, 1)
    expect(out).toContain('# not a heading')
    expect(out).toContain('### Real heading')
  })

  it('can shift deep-heading markers back into real headings', () => {
    const input = '**[H7]** Deep heading'
    const out = shiftHeadingsInMarkdown(input, -1)
    expect(out).toBe('###### Deep heading')
  })

  it('shifts existing Feishu deep heading hashes', () => {
    expect(shiftHeadingsInMarkdown('####### H7', 1)).toBe('######## H7')
    expect(shiftHeadingsInMarkdown('######## H8', -1)).toBe('####### H8')
  })
})
