import { describe, expect, it } from 'vitest'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { mdxJsx } from 'micromark-extension-mdx-jsx'
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx'
import { mdxMd } from 'micromark-extension-mdx-md'
import { applyPipeline } from './pipeline'
import { BUILTIN_TEMPLATES } from './templates'
import { escapeMarkdownForEditor, stripMarkdownEscapesForFeishu } from './markdownProcessor'

const technicalDoc = BUILTIN_TEMPLATES[0]!.config

function parseLikeEditor(markdown: string) {
  return fromMarkdown(markdown, {
    extensions: [gfm(), mdxJsx(), mdxMd()],
    mdastExtensions: [gfmFromMarkdown(), mdxJsxFromMarkdown()],
  })
}

describe('escapeMarkdownForEditor', () => {
  it('escapes unclosed tags left in prose after inline code is removed', () => {
    const input = '会话 ID 为 `csr-tfl/<用户>-<运行号>`。'
    const processed = applyPipeline(input, { template: technicalDoc })

    expect(processed).toContain('<用户>')
    expect(processed).not.toContain('`csr-tfl')
    expect(() => parseLikeEditor(processed)).toThrow(/运行号/)

    const visible = escapeMarkdownForEditor(processed)
    expect(visible).toContain('\\<用户>')
    expect(visible).toContain('\\<运行号>')
    expect(() => parseLikeEditor(visible)).not.toThrow()
    expect(stripMarkdownEscapesForFeishu(visible)).toBe(processed)
  })

  it('leaves angle brackets inside fenced code unchanged', () => {
    const input = ['```mermaid', 'J["裁判<br/>判定"]', '```'].join('\n')
    const visible = escapeMarkdownForEditor(input)
    expect(visible).toContain('<br/>')
    expect(visible).not.toContain('\\<br')
    expect(() => parseLikeEditor(visible)).not.toThrow()
  })

  it('does not escape tags that are still inside inline code', () => {
    const input = '保留 `csr-tfl/<用户>`'
    const visible = escapeMarkdownForEditor(input)
    expect(visible).toBe(input)
    expect(() => parseLikeEditor(visible)).not.toThrow()
  })
})
