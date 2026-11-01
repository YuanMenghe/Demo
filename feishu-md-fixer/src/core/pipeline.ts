import type { Root } from 'mdast'
import { createMarkdownProcessor, stripMarkdownEscapesForFeishu } from './markdownProcessor'
import { collapseMarkdownBlankLines, normalizeNumberingInMarkdown, protectDiscontinuousOrderedMarkers, runTransformers } from './transformers'
import type { TemplateConfig } from './templates'

export interface PipelineOptions {
  template: TemplateConfig
}

export function applyPipeline(input: string, options: PipelineOptions): string {
  if (typeof input !== 'string') return ''
    const raw = input.trim()
    if (!raw) return ''

    try {
      const processor = createMarkdownProcessor()

      // 先把跳号改成全角点，避免解析器把它收成上一条的第 2 项并改写成 2.
      const tree = processor.parse(protectDiscontinuousOrderedMarkers(raw)) as Root
    runTransformers(tree, options.template)

    const file = processor.runSync(tree)
    let result = processor.stringify(file as any) as string

    // 飞书粘贴时不需要 Markdown 转义，否则会显示成 1\. 执行摘要\ 等
    result = stripMarkdownEscapesForFeishu(result)
    if (options.template.text.collapseBlankLines) {
      result = collapseMarkdownBlankLines(result, options.template.text.maxBlankLines)
    }
    if (options.template.numbering?.normalize !== false) {
      result = normalizeNumberingInMarkdown(result)
    }
    result = protectDiscontinuousOrderedMarkers(result)

    return result.trimEnd()
  } catch {
    // 解析或变换异常时原样返回，避免白屏
    return raw
  }
}

