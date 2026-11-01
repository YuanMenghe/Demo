import { describe, expect, it, vi } from 'vitest'
import { shouldSyncEditorMarkdown, syncEditorMarkdown } from './editorSync'
import type { MDXEditorMethods } from '@mdxeditor/editor'

describe('shouldSyncEditorMarkdown', () => {
  it('returns false when current and next markdown are the same', () => {
    expect(shouldSyncEditorMarkdown('same', 'same')).toBe(false)
    expect(shouldSyncEditorMarkdown('', undefined)).toBe(false)
  })

  it('returns true when markdown actually changes', () => {
    expect(shouldSyncEditorMarkdown('before', 'after')).toBe(true)
  })
})

describe('syncEditorMarkdown', () => {
  it('does not call setMarkdown when editor content is unchanged', () => {
    const editor = {
      getMarkdown: vi.fn(() => 'same'),
      setMarkdown: vi.fn(),
    } satisfies Pick<MDXEditorMethods, 'getMarkdown' | 'setMarkdown'>

    const updated = syncEditorMarkdown(editor as unknown as MDXEditorMethods, 'same')

    expect(updated).toBe(false)
    expect(editor.setMarkdown).not.toHaveBeenCalled()
  })

  it('calls setMarkdown once when editor content differs', () => {
    const editor = {
      getMarkdown: vi.fn(() => 'before'),
      setMarkdown: vi.fn(),
    } satisfies Pick<MDXEditorMethods, 'getMarkdown' | 'setMarkdown'>

    const updated = syncEditorMarkdown(editor as unknown as MDXEditorMethods, 'after')

    expect(updated).toBe(true)
    expect(editor.setMarkdown).toHaveBeenCalledOnce()
    expect(editor.setMarkdown).toHaveBeenCalledWith('after')
  })
})
