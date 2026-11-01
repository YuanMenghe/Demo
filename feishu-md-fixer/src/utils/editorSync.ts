import type { MDXEditorMethods } from '@mdxeditor/editor'

export function normalizeEditorMarkdown(value: string | null | undefined): string {
  return value ?? ''
}

export function shouldSyncEditorMarkdown(
  currentValue: string | null | undefined,
  nextValue: string | null | undefined
): boolean {
  return normalizeEditorMarkdown(currentValue) !== normalizeEditorMarkdown(nextValue)
}

export function syncEditorMarkdown(
  editor: MDXEditorMethods | null | undefined,
  nextValue: string | null | undefined
): boolean {
  if (!editor) return false
  const normalizedNext = normalizeEditorMarkdown(nextValue)
  if (!shouldSyncEditorMarkdown(editor.getMarkdown(), normalizedNext)) {
    return false
  }
  editor.setMarkdown(normalizedNext)
  return true
}
