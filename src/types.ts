export type ReadingStatus = 'want-to-read' | 'reading' | 'finished'

export interface Book {
  id: string
  title: string
  status: ReadingStatus
}

export const STATUS_META: Record<
  ReadingStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  'want-to-read': {
    label: 'Want to Read',
    color: '#8a6d3b',
    bg: '#fef3c7',
    dot: '#f59e0b',
  },
  reading: {
    label: 'Reading',
    color: '#1e5a8e',
    bg: '#dbeafe',
    dot: '#3b82f6',
  },
  finished: {
    label: 'Finished',
    color: '#2e6d4f',
    bg: '#dcfce7',
    dot: '#22c55e',
  },
}

export const ALL_STATUSES: ReadingStatus[] = ['want-to-read', 'reading', 'finished']
