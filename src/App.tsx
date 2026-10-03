import { useBooks } from './useLocalStorage'
import { ALL_STATUSES, STATUS_META, type ReadingStatus } from './types'
import { useMemo, useState } from 'react'

type Filter = ReadingStatus | 'all'

export default function App() {
  const { books, addBook, setStatus, removeBook } = useBooks()
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [error, setError] = useState<string | null>(null)

  const counts = useMemo(() => {
    return books.reduce(
      (acc, b) => {
        acc[b.status]++
        return acc
      },
      { 'want-to-read': 0, reading: 0, finished: 0 } as Record<ReadingStatus, number>,
    )
  }, [books])

  const visibleBooks = useMemo(() => {
    if (filter === 'all') return books
    return books.filter((b) => b.status === filter)
  }, [books, filter])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const result = addBook(title, 'want-to-read')
    if (result) {
      setError(result)
    } else {
      setError(null)
      setTitle('')
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (error) setError(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Reading List</h1>
        <p>Keep track of books you want to read, are reading, and have finished.</p>
      </header>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter a book title…"
          aria-label="Book title"
        />
        <button type="submit">Add Book</button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {books.length > 0 && (
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All<span className="filter-count">{books.length}</span>
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {STATUS_META[s].label}
              <span className="filter-count">{counts[s]}</span>
            </button>
          ))}
        </div>
      )}

      {books.length > 0 && (
        <div className="summary">
          <div className="summary-item">
            <span className="summary-value">{books.length}</span>
            <span className="summary-label">Total Books</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{counts['reading']}</span>
            <span className="summary-label">Currently Reading</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{counts['finished']}</span>
            <span className="summary-label">Finished</span>
          </div>
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📖</div>
          <p>Your reading list is empty. Add your first book.</p>
        </div>
      ) : visibleBooks.length === 0 ? (
        <div className="empty">
          <p>No books in this category.</p>
        </div>
      ) : (
        <div className="book-list">
          {visibleBooks.map((book) => {
            const meta = STATUS_META[book.status]
            return (
              <div key={book.id} className="book-card">
                <div className="book-card-top">
                  <span className="book-title">{book.title}</span>
                  <button
                    className="book-delete"
                    onClick={() => removeBook(book.id)}
                    aria-label={`Remove ${book.title}`}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
                <span
                  className="status-badge"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  <span className="status-dot" style={{ background: meta.dot }} />
                  {meta.label}
                </span>
                <select
                  className="status-select"
                  value={book.status}
                  onChange={(e) => setStatus(book.id, e.target.value as ReadingStatus)}
                  aria-label={`Change status for ${book.title}`}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
