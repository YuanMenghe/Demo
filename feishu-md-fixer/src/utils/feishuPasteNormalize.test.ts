import { describe, it, expect } from 'vitest'
import { normalizeForFeishuPaste } from './feishuPasteNormalize'

describe('normalizeForFeishuPaste', () => {
  it('collapses double newlines to single', () => {
    expect(normalizeForFeishuPaste('a\n\nb')).toBe('a\nb')
  })

  it('collapses many newlines to single', () => {
    expect(normalizeForFeishuPaste('a\n\n\n\nb')).toBe('a\nb')
  })

  it('trimEnd removes trailing newlines', () => {
    expect(normalizeForFeishuPaste('a\nb\n\n')).toBe('a\nb')
    expect(normalizeForFeishuPaste('a\n\n')).toBe('a')
  })

  it('leaves single newlines unchanged', () => {
    expect(normalizeForFeishuPaste('a\nb\nc')).toBe('a\nb\nc')
  })

  it('handles empty string', () => {
    expect(normalizeForFeishuPaste('')).toBe('')
  })

  it('real-world: headings and lists get single line breaks', () => {
    const input = '#### ① 文献数据库\n\n- PubMed\n\n- 中文期刊\n\n#### ② NMPA'
    const out = normalizeForFeishuPaste(input)
    expect(out).toBe('#### ① 文献数据库\n- PubMed\n- 中文期刊\n#### ② NMPA')
    expect(out).not.toMatch(/\n\n/)
  })

  it('keeps normal H1-H6 markdown headings unchanged', () => {
    const input = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6'

    expect(normalizeForFeishuPaste(input)).toBe(input)
  })

  it('converts overflow heading markers into Feishu-recognizable headings without visible markers', () => {
    expect(normalizeForFeishuPaste('**[H7]** 深层标题')).toBe('####### 深层标题')
    expect(normalizeForFeishuPaste('**[H8]** 更深标题')).toBe('######## 更深标题')
    expect(normalizeForFeishuPaste('###### [H9] 极深标题')).toBe('######### 极深标题')
  })

  it('supports legacy overflow heading markers without leaking the marker text', () => {
    expect(normalizeForFeishuPaste('**[H8] 更深标题**')).toBe('######## 更深标题')
  })

  it('keeps Feishu H7+ ATX headings as deep headings', () => {
    expect(normalizeForFeishuPaste('####### 手写七级标题')).toBe('####### 手写七级标题')
    expect(normalizeForFeishuPaste('######## 手写八级标题 ########')).toBe('######## 手写八级标题')
  })

  it('preserves blockquote prefixes when normalizing deep headings', () => {
    expect(normalizeForFeishuPaste('> **[H7]** 引用里的深层标题')).toBe('> ####### 引用里的深层标题')
    expect(normalizeForFeishuPaste('> ####### 引用里的手写七级标题')).toBe('> ####### 引用里的手写七级标题')
  })

  it('preserves list prefixes when normalizing deep headings', () => {
    expect(normalizeForFeishuPaste('- **[H7]** 列表里的深层标题')).toBe('- ####### 列表里的深层标题')
    expect(normalizeForFeishuPaste('1. **[H7]** 有序列表里的深层标题')).toBe('1. ####### 有序列表里的深层标题')
    expect(normalizeForFeishuPaste('> - **[H8]** 引用+列表里的更深标题')).toBe('> - ######## 引用+列表里的更深标题')
  })

  it('does not normalize heading-looking text inside fenced code blocks', () => {
    const input = ['```md', '**[H7]** 深层标题', '####### 手写七级标题', '```'].join('\n')

    expect(normalizeForFeishuPaste(input)).toBe(input)
  })

  it('normalizes numeric dot list markers so Feishu recognizes Markdown ordered lists', () => {
    const input = ['1.第一项', '2\\. 第二项', '3．第三项', '> 4.引用项', '  5. 子项'].join('\n')

    expect(normalizeForFeishuPaste(input)).toBe([
      '1. 第一项',
      '2. 第二项',
      '3. 第三项',
      '> 4. 引用项',
      '  5. 子项',
    ].join('\n'))
  })

  it('does not convert non-dot numbering styles during paste normalization', () => {
    const input = ['一、第一项', '① 第一项', '1、第一项', '（1）第一项'].join('\n')

    expect(normalizeForFeishuPaste(input)).toBe(input)
  })

  it('keeps blank lines inside fenced code blocks', () => {
    const input = ['```js', 'function a() {', '', '  return 1', '}', '```'].join('\n')

    expect(normalizeForFeishuPaste(input)).toBe(input)
  })

  it('does not normalize ordered-list-looking text inside fenced code blocks', () => {
    const input = ['```md', '1.第一项', '2\\. 第二项', '```'].join('\n')

    expect(normalizeForFeishuPaste(input)).toBe(input)
  })
})
