import { describe, expect, it } from 'vitest'
import { hasFencedCodeBlock, hasMarkdownTable, pickBetterClipboardText } from './markdownSignals'

describe('markdownSignals', () => {
  it('detects fenced code blocks', () => {
    expect(hasFencedCodeBlock('```ts\nconst x = 1\n```')).toBe(true)
    expect(hasFencedCodeBlock('no code')).toBe(false)
  })

  it('detects markdown tables', () => {
    expect(hasMarkdownTable('| A | B |\n| --- | --- |\n| 1 | 2 |')).toBe(true)
    expect(hasMarkdownTable('普通段落\n- 列表')).toBe(false)
  })

  it('prefers fallback text when secondary keeps code blocks', () => {
    const primary = '### Title'
    const secondary = '### Title\n\n```r\nprint("x")\n```'
    expect(pickBetterClipboardText(primary, secondary)).toBe(secondary)
  })

  it('prefers fallback text when secondary keeps tables', () => {
    const primary = '表格标题'
    const secondary = '| A | B |\n| --- | --- |\n| 1 | 2 |'
    expect(pickBetterClipboardText(primary, secondary)).toBe(secondary)
  })

  it('falls back to longer plain text when content is much more complete', () => {
    const primary = '短文本'
    const secondary = '短文本\n补充说明\n补充说明\n补充说明\n补充说明'
    expect(pickBetterClipboardText(primary, secondary)).toBe(secondary)
  })

  it('keeps primary text when it is already the better source', () => {
    const primary = '### Title\n\n```json\n{}\n```'
    const secondary = '### Title'
    expect(pickBetterClipboardText(primary, secondary)).toBe(primary)
  })
})
