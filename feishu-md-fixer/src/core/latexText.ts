const SYMBOLS: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ϵ',
  zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', varpi: 'ϖ',
  rho: 'ρ', varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ',
  phi: 'φ', varphi: 'ϕ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
  Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  times: '×', div: '÷', cdot: '⋅', pm: '±', mp: '∓',
  leq: '≤', le: '≤', geq: '≥', ge: '≥', neq: '≠', ne: '≠',
  approx: '≈', equiv: '≡', sim: '∼', simeq: '≃', cong: '≅', propto: '∝',
  ll: '≪', gg: '≫', infty: '∞', partial: '∂', nabla: '∇',
  sum: '∑', prod: '∏', int: '∫', oint: '∮',
  rightarrow: '→', to: '→', leftarrow: '←', leftrightarrow: '↔',
  Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔', mapsto: '↦', implies: '⇒',
  in: '∈', notin: '∉', subset: '⊂', supset: '⊃', subseteq: '⊆', supseteq: '⊇',
  cup: '∪', cap: '∩', emptyset: '∅', varnothing: '∅',
  forall: '∀', exists: '∃', land: '∧', lor: '∨', wedge: '∧', vee: '∨', neg: '¬', lnot: '¬',
  oplus: '⊕', otimes: '⊗', circ: '∘', star: '⋆', ast: '∗', bullet: '•', degree: '°',
  ldots: '…', cdots: '⋯', dots: '…', dotsb: '⋯', dotsc: '…',
  prime: '′', angle: '∠', perp: '⊥', parallel: '∥', mid: '∣', vert: '∣', Vert: '‖',
  hbar: 'ℏ', ell: 'ℓ', Re: 'ℜ', Im: 'ℑ', aleph: 'ℵ', therefore: '∴', because: '∵',
  quad: ' ', qquad: '  ',
}

const TEXT_COMMANDS = new Set([
  'text', 'textrm', 'textbf', 'textit', 'textsf', 'texttt',
  'mathrm', 'mathbf', 'mathit', 'mathsf', 'mathtt', 'operatorname', 'boldsymbol', 'bm', 'emph',
])

const ACCENTS: Record<string, string> = {
  bar: '\u0304', hat: '\u0302', tilde: '\u0303', vec: '\u20D7',
  dot: '\u0307', ddot: '\u0308', overline: '\u0305',
}

const SUPER: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', n: 'ⁿ', i: 'ⁱ',
}

const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', h: 'ₕ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', p: 'ₚ', s: 'ₛ', t: 'ₜ',
  i: 'ᵢ', j: 'ⱼ', r: 'ᵣ', u: 'ᵤ', v: 'ᵥ',
}

const PUNCT_ESCAPE: Record<string, string> = {
  ',': ' ', ';': ' ', ':': ' ', '!': '', ' ': ' ',
  '%': '%', '&': '&', '#': '#', $: '$', _: '_', '{': '{', '}': '}',
  '|': '‖', '\\': '\\',
}

/**
 * 把 $\alpha$、\(\beta\)、$$\frac{a}{b}$$ 这类公式换成可以直接阅读的字符。
 * 代码围栏和行内代码保持原样。纯数字的 $100$ 不当成公式。
 */
export function replaceLatexMath(markdown: string): string {
  if (!markdown) return markdown
  const lines = markdown.split(/\r?\n/)
  const parts: string[] = []
  let fence: { marker: '`' | '~'; length: number } | null = null
  let prose: string[] = []

  const flush = () => {
    if (!prose.length) return
    parts.push(replaceOutsideInlineCode(prose.join('\n'), replaceLatexInText))
    prose = []
  }

  for (const line of lines) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fenceMatch) {
      const markerText = fenceMatch[1]
      const marker = markerText[0] as '`' | '~'
      const length = markerText.length
      if (fence && fence.marker === marker && length >= fence.length) {
        flush()
        fence = null
        parts.push(line)
        continue
      }
      if (!fence) {
        flush()
        fence = { marker, length }
        parts.push(line)
        continue
      }
    }

    if (fence) parts.push(line)
    else prose.push(line)
  }

  flush()
  return parts.join('\n')
}

function replaceLatexInText(text: string): string {
  let out = ''
  let index = 0

  while (index < text.length) {
    if (text[index] === '\\' && text[index + 1] === '$') {
      out += '$'
      index += 2
      continue
    }

    const wrapped = readWrappedMath(text, index)
    if (wrapped) {
      out += renderLatex(wrapped.inner)
      index = wrapped.next
      continue
    }

    const atom = readKnownAtom(text, index)
    if (atom) {
      out += atom.text
      index = atom.next
      continue
    }

    out += text[index]
    index += 1
  }

  return out
}

function readWrappedMath(text: string, index: number): { inner: string; next: number } | null {
  let open = ''
  let close = ''
  if (text.startsWith('$$', index)) {
    open = '$$'
    close = '$$'
  } else if (text[index] === '$') {
    open = '$'
    close = '$'
  } else if (text.startsWith('\\(', index)) {
    open = '\\('
    close = '\\)'
  } else if (text.startsWith('\\[', index)) {
    open = '\\['
    close = '\\]'
  } else {
    return null
  }

  const start = index + open.length
  const end = findCloser(text, start, close, open === '$')
  if (end === -1) return null
  const inner = text.slice(start, end)
  if (!inner.trim()) return null
  if (open === '$' && !shouldConvertInline(inner)) return null
  if ((open === '$$' || open === '\\[') && !shouldConvertBlock(inner)) return null
  return { inner, next: end + close.length }
}

function findCloser(text: string, start: number, close: string, singleLine: boolean): number {
  for (let index = start; index < text.length; index += 1) {
    if (singleLine && text[index] === '\n') return -1
    if (text.startsWith(close, index)) return index
    if (text[index] === '\\') index += 1
  }
  return -1
}

function shouldConvertBlock(inner: string): boolean {
  const value = inner.trim()
  if (!value || value.length > 2000) return false
  if (/[\\^_]/.test(value)) return true
  if (value.includes('\n')) return false
  return shouldConvertInline(value)
}

function shouldConvertInline(inner: string): boolean {
  const value = inner.trim()
  if (!value || value.length > 300) return false
  if (/^\d[\d,]*(?:\.\d+)?$/.test(value)) return false
  if (/[\\^_=<>≤≥±×÷]/.test(value)) return true
  return /^[A-Za-z][A-Za-z0-9]*$/.test(value)
}

function readKnownAtom(text: string, index: number): { text: string; next: number } | null {
  if (text[index] !== '\\' || !/[A-Za-z]/.test(text[index + 1] ?? '')) return null
  const name = readCommandName(text, index + 1)
  if (!name || !isKnownCommand(name)) return null
  let end = index + 1 + name.length
  if (name === 'frac') {
    end = skipGroup(text, end)
    end = skipGroup(text, end)
  } else if (name === 'sqrt') {
    if (text[end] === '[') end = skipBracket(text, end)
    end = skipGroup(text, end)
  } else if (TEXT_COMMANDS.has(name) || ACCENTS[name]) {
    end = skipGroup(text, end)
  }
  end = skipScripts(text, end)
  return { text: renderLatex(text.slice(index, end)), next: end }
}

function isKnownCommand(name: string): boolean {
  return Boolean(SYMBOLS[name] || ACCENTS[name] || TEXT_COMMANDS.has(name) || name === 'frac' || name === 'sqrt')
}

function readCommandName(text: string, index: number): string {
  let end = index
  while (end < text.length && /[A-Za-z]/.test(text[end])) end += 1
  return text.slice(index, end)
}

function skipGroup(text: string, index: number): number {
  if (text[index] !== '{') return index
  let depth = 0
  for (let cursor = index; cursor < text.length; cursor += 1) {
    if (text[cursor] === '\\') {
      cursor += 1
      continue
    }
    if (text[cursor] === '{') depth += 1
    else if (text[cursor] === '}') {
      depth -= 1
      if (depth === 0) return cursor + 1
    }
  }
  return text.length
}

function skipBracket(text: string, index: number): number {
  const end = text.indexOf(']', index + 1)
  return end === -1 ? text.length : end + 1
}

function skipScripts(text: string, index: number): number {
  let cursor = index
  while (text[cursor] === '^' || text[cursor] === '_') {
    cursor += 1
    if (text[cursor] === '{') cursor = skipGroup(text, cursor)
    else if (text[cursor] === '\\') {
      const name = readCommandName(text, cursor + 1)
      cursor += name ? 1 + name.length : 2
    } else if (cursor < text.length) cursor += 1
  }
  return cursor
}

function renderLatex(source: string): string {
  let out = ''
  let index = 0

  while (index < source.length) {
    const char = source[index]
    if (char === '\\') {
      const punct = source[index + 1]
      if (punct && !/[A-Za-z]/.test(punct)) {
        out += PUNCT_ESCAPE[punct] ?? punct
        index += 2
        continue
      }
      const name = readCommandName(source, index + 1)
      index += 1 + name.length
      if (name === 'frac') {
        const numerator = readRenderedGroup(source, index)
        index = numerator.next
        const denominator = readRenderedGroup(source, index)
        index = denominator.next
        out += `${wrapFracPart(numerator.text)}/${wrapFracPart(denominator.text)}`
        continue
      }
      if (name === 'sqrt') {
        let degree = ''
        if (source[index] === '[') {
          const end = source.indexOf(']', index + 1)
          degree = end === -1 ? '' : renderLatex(source.slice(index + 1, end))
          index = end === -1 ? source.length : end + 1
        }
        const body = readRenderedGroup(source, index)
        index = body.next
        const radical = body.text.length > 1 ? `√(${body.text})` : `√${body.text}`
        out += `${formatScript(degree, true)}${radical}`
        continue
      }
      if (TEXT_COMMANDS.has(name)) {
        const group = readRenderedGroup(source, index)
        index = group.next
        out += group.text
        continue
      }
      if (ACCENTS[name]) {
        const group = readRenderedGroup(source, index)
        index = group.next
        out += `${group.text}${ACCENTS[name]}`
        continue
      }
      if (name === 'left' || name === 'right' || /^big+[glr]?$/.test(name)) {
        if (source[index] === '\\') index += 1 + readCommandName(source, index + 1).length
        else if (source[index] && !/[A-Za-z]/.test(source[index])) index += 1
        continue
      }
      out += SYMBOLS[name] ?? name
      continue
    }

    if (char === '^' || char === '_') {
      index += 1
      let inner = ''
      if (source[index] === '{') {
        const group = readRenderedGroup(source, index)
        inner = group.text
        index = group.next
      } else if (source[index] === '\\') {
        const name = readCommandName(source, index + 1)
        inner = name ? renderLatex(`\\${name}`) : ''
        index += name ? 1 + name.length : 1
      } else if (source[index]) {
        inner = source[index]
        index += 1
      }
      out += formatScript(inner, char === '^')
      continue
    }

    if (char === '{' || char === '}') {
      index += 1
      continue
    }
    if (char === '~') {
      out += ' '
      index += 1
      continue
    }
    if (char === '|') {
      out += '∣'
      index += 1
      continue
    }
    out += char
    index += 1
  }

  return out.replace(/[ \t]{2,}/g, ' ').trim()
}

function readRenderedGroup(source: string, index: number): { text: string; next: number } {
  if (source[index] !== '{') return { text: '', next: index }
  const end = skipGroup(source, index)
  return { text: renderLatex(source.slice(index + 1, end - 1)), next: end }
}

function wrapFracPart(value: string): string {
  return /[+\-*/\s]/.test(value) ? `(${value})` : value
}

function formatScript(text: string, superscript: boolean): string {
  if (!text) return ''
  const map = superscript ? SUPER : SUB
  const chars = Array.from(text)
  if (chars.every((char) => map[char])) return chars.map((char) => map[char]).join('')
  return superscript ? text : `₍${text}₎`
}

function replaceOutsideInlineCode(text: string, transform: (value: string) => string): string {
  let result = ''
  let index = 0

  while (index < text.length) {
    if (text[index] === '`') {
      const ticks = text.slice(index).match(/^`+/)?.[0]
      if (ticks) {
        const close = text.indexOf(ticks, index + ticks.length)
        if (close !== -1) {
          result += text.slice(index, close + ticks.length)
          index = close + ticks.length
          continue
        }
      }
    }

    let end = index
    while (end < text.length) {
      if (text[end] === '`') {
        const ticks = text.slice(end).match(/^`+/)?.[0]
        if (ticks && text.indexOf(ticks, end + ticks.length) !== -1) break
      }
      end += 1
    }

    result += transform(text.slice(index, end))
    index = end
  }

  return result
}
