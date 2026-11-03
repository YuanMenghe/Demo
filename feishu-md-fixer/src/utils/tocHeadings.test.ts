import { describe, expect, it } from 'vitest'
import { extractMarkdownHeadings } from './tocHeadings'

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
})
