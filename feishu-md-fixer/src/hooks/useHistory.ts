import { useCallback, useMemo, useState } from 'react'

interface HistoryState<T> {
  current: T
  canUndo: boolean
  canRedo: boolean
}

interface UseHistoryReturn<T> extends HistoryState<T> {
  set: (value: T, recordHistory?: boolean) => void
  undo: () => void
  redo: () => void
  clear: (initialValue: T) => void
}

const MAX_HISTORY = 50

/**
 * 历史记录 hook，支持 Undo/Redo
 */
interface HistorySnapshot<T> {
  current: T
  past: T[]
  future: T[]
}

export function useHistory<T>(initialValue: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistorySnapshot<T>>({
    current: initialValue,
    past: [],
    future: [],
  })

  const set = useCallback((value: T, recordHistory = true) => {
    setHistory((prev) => {
      if (Object.is(prev.current, value)) return prev
      if (!recordHistory) return { ...prev, current: value }
      return {
        current: value,
        past: [...prev.past, prev.current].slice(-MAX_HISTORY),
        future: [],
      }
    })
  }, [])

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev
      const previous = prev.past[prev.past.length - 1]
      return {
        current: previous,
        past: prev.past.slice(0, -1),
        future: [prev.current, ...prev.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev
      const [next, ...future] = prev.future
      return {
        current: next,
        past: [...prev.past, prev.current],
        future,
      }
    })
  }, [])

  const clear = useCallback((initialValue: T) => {
    setHistory({ current: initialValue, past: [], future: [] })
  }, [])

  return useMemo(
    () => ({
      current: history.current,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      set,
      undo,
      redo,
      clear,
    }),
    [history, set, undo, redo, clear]
  )
}
