import { describe, expect, it } from 'vitest'
import { createFeishuClipboardHtml } from './clipboard'

describe('createFeishuClipboardHtml', () => {
  it('renders numeric dot lines as real ordered lists for Feishu paste', () => {
    const html = createFeishuClipboardHtml('1. 需求背景\n现有 synopsis 产品')

    expect(html).toContain('<ol start="1"><li>需求背景</li></ol>')
    expect(html).toContain('<p>现有 synopsis 产品</p>')
  })

  it('groups consecutive numeric dot lines into one ordered list', () => {
    const html = createFeishuClipboardHtml('1. 第一项\n2. 第二项')

    expect(html).toContain('<ol start="1"><li>第一项</li><li>第二项</li></ol>')
  })

  it('keeps headings as heading html while preserving deep heading levels', () => {
    const html = createFeishuClipboardHtml('# H1\n####### H7')

    expect(html).toContain('<h1>H1</h1>')
    expect(html).toContain('<h7>H7</h7>')
  })

  it('renders markdown tables and nested lists as real html', () => {
    const html = createFeishuClipboardHtml(
      ['| 列1 | 列2 |', '| --- | --- |', '| A | B |', '', '1. 父项', '   - 子项'].join('\n')
    )

    expect(html).toContain('<table><thead><tr><th>列1</th><th>列2</th></tr></thead><tbody><tr><td>A</td><td>B</td></tr></tbody></table>')
    expect(html).toContain('<ol start="1"><li>父项<ul><li>子项</li></ul></li></ol>')
    expect(html).not.toContain('<p>|')
  })

  it('keeps a jumped ordered-list number on the list item', () => {
    const html = createFeishuClipboardHtml('1. 第一项\n5. 第五项')

    expect(html).toContain('<ol start="1"><li>第一项</li><li value="5">第五项</li></ol>')
  })

  it('does not render ordered-list-looking text inside fenced code blocks as lists', () => {
    const html = createFeishuClipboardHtml('```md\n1. 示例\n```')

    expect(html).toContain('<pre><code>1. 示例</code></pre>')
    expect(html).not.toContain('<ol')
  })
})
