export function pickBetterClipboardText(primary: string, secondary: string): string {
  const primaryTrimmed = primary.trim()
  const secondaryTrimmed = secondary.trim()

  if (!primaryTrimmed) return secondary
  if (!secondaryTrimmed) return primary

  if (hasFencedCodeBlock(secondaryTrimmed) && !hasFencedCodeBlock(primaryTrimmed)) {
    return secondary
  }

  if (hasMarkdownTable(secondaryTrimmed) && !hasMarkdownTable(primaryTrimmed)) {
    return secondary
  }

  if (secondaryTrimmed.length > primaryTrimmed.length * 1.5) {
    return secondary
  }

  return primary
}

export function hasFencedCodeBlock(value: string): boolean {
  return /(^|\n)```[\s\S]*?\n```(?=\n|$)/m.test(value)
}

export function hasMarkdownTable(value: string): boolean {
  return /(^|\n)\|.+\|\s*\n\|(?:\s*:?-{3,}:?\s*\|)+/m.test(value)
}
