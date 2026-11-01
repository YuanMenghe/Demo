import { describe, it, expect } from 'vitest'
import { htmlToMarkdown, normalizeImportedMarkdown } from './htmlToMarkdown'

describe('htmlToMarkdown', () => {
  it('returns fallback when html is empty', () => {
    expect(htmlToMarkdown('', 'plain')).toBe('plain')
    expect(htmlToMarkdown('   ', 'fallback')).toBe('fallback')
  })

  it('converts simple html to markdown', () => {
    const out = htmlToMarkdown('<p>hello</p>', '')
    expect(out).toContain('hello')
  })

  it('returns string (converted or fallback) for any html', () => {
    const out = htmlToMarkdown('<div><div>x</div></div>', 'fallback')
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThanOrEqual(0)
  })

  it('handles headings', () => {
    const out = htmlToMarkdown('<h1>Title</h1>', '')
    expect(out).toContain('Title')
  })

  it('converts HTML table to Markdown table', () => {
    const html = `
      <table>
        <tr><th>Name</th><th>Age</th></tr>
        <tr><td>Alice</td><td>30</td></tr>
        <tr><td>Bob</td><td>25</td></tr>
      </table>
    `
    const out = htmlToMarkdown(html, '')
    expect(out).toContain('| Name | Age |')
    expect(out).toContain('| --- | --- |')
    expect(out).toContain('| Alice | 30 |')
    expect(out).toContain('| Bob | 25 |')
  })

  it('keeps mixed th and td cells in document order', () => {
    const html = '<table><tr><td>A</td><th>B</th><td>C</td></tr></table>'
    const out = htmlToMarkdown(html, '')

    expect(out).toContain('| A | B | C |')
  })

  it('indents nested lists under their parent item', () => {
    const html = '<ol><li>外<ul><li>内</li></ul></li></ol>'
    const out = htmlToMarkdown(html, '')

    expect(out).toContain('1. 外')
    expect(out).toMatch(/\n[ \t]+[-*][ \t]+内/)
  })

  it('handles table with nested elements', () => {
    const html = `
      <table>
        <tr><th><strong>Header</strong></th></tr>
        <tr><td><a href="#">Link</a></td></tr>
      </table>
    `
    const out = htmlToMarkdown(html, '')
    expect(out).toContain('| Header |')
    expect(out).toContain('| Link |')
  })

  it('escapes pipe characters in table cells', () => {
    const html = `
      <table>
        <tr><th>A|B</th></tr>
        <tr><td>C|D</td></tr>
      </table>
    `
    const out = htmlToMarkdown(html, '')
    expect(out).toContain('A\\|B')
    expect(out).toContain('C\\|D')
  })

  it('handles empty table gracefully', () => {
    const html = '<table></table>'
    const out = htmlToMarkdown(html, '')
    expect(out).toBe('')
  })

  it('keeps ordered list numbers incremental', () => {
    const html = `
      <ol>
        <li>第一项</li>
        <li>第二项</li>
        <li>第三项</li>
      </ol>
    `
    const out = htmlToMarkdown(html, '')
    expect(out).toContain('1. 第一项')
    expect(out).toContain('2. 第二项')
    expect(out).toContain('3. 第三项')
  })

  it('keeps nested ordered list numbers incremental (1.1 / 1.2 style when rendered)', () => {
    const html = `
      <ol>
        <li>
          外层一
          <ol>
            <li>内层一</li>
            <li>内层二</li>
          </ol>
        </li>
        <li>外层二</li>
      </ol>
    `
    const out = htmlToMarkdown(html, '')
    // 外层
    expect(out).toContain('1. 外层一')
    expect(out).toContain('2. 外层二')
    // 内层：不要都变成 1.
    expect(out).toMatch(/\n\s*1\.\s+内层一/)
    expect(out).toMatch(/\n\s*2\.\s+内层二/)
  })

  it('prefers fallback text when html conversion loses fenced code blocks', () => {
    const html = '<h3>Phase 3</h3><h4>Task 3.1</h4>'
    const fallback = [
      '### Phase 3',
      '',
      '#### Task 3.1',
      '',
      '```r',
      'print("hello")',
      '```',
    ].join('\n')

    const out = htmlToMarkdown(html, fallback)

    expect(out).toContain('```r')
    expect(out).toContain('print("hello")')
  })

  it('prefers fallback text when html conversion loses markdown tables', () => {
    const html = '<p>表格标题</p>'
    const fallback = [
      '| Name | Age |',
      '| --- | --- |',
      '| Alice | 30 |',
    ].join('\n')

    const out = htmlToMarkdown(html, fallback)

    expect(out).toContain('| Name | Age |')
    expect(out).toContain('| Alice | 30 |')
  })

  it('normalizes bare triple backticks to avoid nested example blocks breaking parsing', () => {
    const input = [
      '#### Task 3.2',
      '',
      '```',
      '模板如下：',
      '',
      '```r',
      'print(\"hello\")',
      '```',
      '```',
    ].join('\n')

    const out = normalizeImportedMarkdown(input)

    expect(out).toContain('````\n模板如下：')
    expect(out).toContain('```r')
    expect(out).toContain('print("hello")\n```')
    expect(out).toContain('\n````')
  })
})
