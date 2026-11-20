import { describe, expect, it } from 'vitest'
import { createFeishuClipboardHtml, prepareFeishuClipboard } from './clipboard'
import { applyPipeline } from '../core/pipeline'
import { BUILTIN_TEMPLATES } from '../core/templates'

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

  it('renders links, emphasis, tasks and images', () => {
    const html = createFeishuClipboardHtml(
      ['看 [文档](https://example.com/a) 和 *斜体*', '', '- [x] 已完成', '- [ ] 未完成', '', '![示意图](https://example.com/a.png)'].join('\n')
    )

    expect(html).toContain('<a href="https://example.com/a">文档</a>')
    expect(html).toContain('<em>斜体</em>')
    expect(html).toContain('<input type="checkbox" disabled checked>')
    expect(html).toContain('<input type="checkbox" disabled>')
    expect(html).toContain('<img alt="示意图" src="https://example.com/a.png">')
  })

  it('keeps a jumped ordered-list number on the list item', () => {
    const html = createFeishuClipboardHtml('1. 第一项\n5. 第五项')

    expect(html).toContain('<ol start="1"><li>第一项</li><li value="5">第五项</li></ol>')
  })

  it('keeps paragraph breaks inside a table cell and does not pad the separator to the cell width', () => {
    const long = '甲'.repeat(80)
    const input = [
      '### 第 10 章',
      '',
      '| 序号 | 内容 |',
      '| :---: | :--- |',
      `| 1 | ${long}<br><br>下一句（N = 6） |`,
    ].join('\n')
    const processed = applyPipeline(input, { template: BUILTIN_TEMPLATES[0]!.config })
    const separator = `| :---: | :${'-'.repeat(80)} |`
    const copied = processed.replace(/^\|.*---.*\|$/m, separator).replace('（N = 6）', '（N \\= 6）')
    const { plain, htmlSource } = prepareFeishuClipboard(copied)
    const html = createFeishuClipboardHtml(htmlSource)

    expect(processed).toContain('### 第 10 章')
    expect(processed).toContain(`${long}\u2028\u2028下一句（N = 6）`)
    expect(processed).not.toContain('\\=')
    expect(plain).toContain(`${long}<br><br>下一句（N = 6）`)
    expect(plain).not.toContain('\\=')
    expect(plain.split('\n').find((line) => line.includes('---'))!.length).toBeLessThan(40)
    expect(html).toContain(`<td>${long}<br><br>下一句（N = 6）</td>`)
    expect(html).not.toContain('&lt;br')
  })

  it('turns an editor-exported one-dash alignment row back into a real table', () => {
    const exported = [
      '### 第 10 章 研究受试者',
      '|  序号 | 生成内容                               |',
      '| :-: | :--------------------------------- |',
      '|  1  | **10 研究对象**<br><br>【待补充】<br><br>本章（N = 6） S054 |',
    ].join('\n')
    const { plain, htmlSource } = prepareFeishuClipboard(exported)
    const html = createFeishuClipboardHtml(htmlSource)

    expect(plain).toContain('| :---: | :--- |')
    expect(plain).toContain('**10 研究对象**<br><br>【待补充】')
    expect(plain.split('\n').find((line) => line.includes('---'))!.length).toBeLessThan(30)
    expect(html).toContain('<table>')
    expect(html).toContain('<h3>第 10 章 研究受试者</h3>')
    expect(html).toContain('<strong>10 研究对象</strong><br><br>【待补充】<br><br>本章（N = 6） S054')
    expect(html).not.toContain('<p>|')
  })

  it('does not render ordered-list-looking text inside fenced code blocks as lists', () => {
    const html = createFeishuClipboardHtml('```md\n1. 示例\n```')

    expect(html).toContain('<pre><code>1. 示例</code></pre>')
    expect(html).not.toContain('<ol')
  })
})
