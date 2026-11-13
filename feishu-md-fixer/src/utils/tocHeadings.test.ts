import { describe, expect, it } from 'vitest'
import { extractMarkdownHeadings, headingLevelLabel } from './tocHeadings'

describe('extractMarkdownHeadings', () => {
  it('keeps heading order and skips fences', () => {
    const markdown = ['# 总则', '## 范围', '```', '# 不是标题', '```', '**[H7]** 更深', ''].join('\n')
    expect(extractMarkdownHeadings(markdown)).toEqual([
      { level: 1, text: '总则' },
      { level: 2, text: '范围' },
      { level: 7, text: '更深' },
    ])
  })

  it('returns nothing when there is no heading', () => {
    expect(extractMarkdownHeadings('只有正文\n\n第二段')).toEqual([])
  })

  it('names heading levels for the outline hint', () => {
    expect(headingLevelLabel(1)).toBe('一级')
    expect(headingLevelLabel(2)).toBe('二级')
    expect(headingLevelLabel(12)).toBe('十二级')
    expect(headingLevelLabel(13)).toBe('13级')
  })
})
