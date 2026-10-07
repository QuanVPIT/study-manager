import { useEffect, useState } from 'react'

// A "custom hook": works like useState, but also SAVES the value in localStorage,
// so your data is still there after you refresh or close the browser.
//
// <T> is a "generic": T can be any type (Course[], string, ...), decided when we use the hook.
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. When the component starts, try to load the saved value
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      // localStorage only stores text, so we turn the text back into data with JSON.parse
      return saved !== null ? (JSON.parse(saved) as T) : initialValue
    } catch {
      return initialValue // saved data is broken or storage is blocked → start fresh
    }
  })

  // 2. Every time the value changes, save it again (as text, using JSON.stringify)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage is full or blocked: the app still works, it just won't remember
    }
  }, [key, value])

  // "as const" keeps the types exact: [T, setter] — just like useState
  return [value, setValue] as const
}
