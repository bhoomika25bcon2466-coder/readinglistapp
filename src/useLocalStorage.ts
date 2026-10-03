import { useCallback, useEffect, useState } from 'react'
import type { Book, ReadingStatus } from './types'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota / private-mode errors
    }
  }, [key, value])

  return [value, setValue] as const
}

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>('reading-list-books', [])

  const addBook = useCallback(
    (title: string, status: ReadingStatus): string | null => {
      const trimmed = title.trim()
      if (!trimmed) return null
      if (trimmed.length > 60) return 'Book title must be 60 characters or fewer.'
      const exists = books.some(
        (b) => b.title.trim().toLowerCase() === trimmed.toLowerCase(),
      )
      if (exists) return 'This book is already in your reading list.'
      setBooks((prev) => [
        { id: crypto.randomUUID(), title: trimmed, status },
        ...prev,
      ])
      return null
    },
    [books, setBooks],
  )

  const setStatus = useCallback(
    (id: string, status: ReadingStatus) => {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    },
    [setBooks],
  )

  const removeBook = useCallback(
    (id: string) => {
      setBooks((prev) => prev.filter((b) => b.id !== id))
    },
    [setBooks],
  )

  return { books, addBook, setStatus, removeBook }
}
