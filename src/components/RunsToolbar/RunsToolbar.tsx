import type { ChangeEvent } from 'react'
import type { SortOption, StatusFilter } from '../../types/run'
import styles from './RunsToolbar.module.css'

interface RunsToolbarProps {
  query: string
  status: StatusFilter
  sort: SortOption
  simulateError: boolean
  onQueryChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  onSortChange: (value: SortOption) => void
  onSimulateErrorChange: (value: boolean) => void
}

const filters: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All runs' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
]

export function RunsToolbar({
  query, status, sort, simulateError, onQueryChange, onStatusChange, onSortChange, onSimulateErrorChange,
}: RunsToolbarProps) {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as SortOption)
  }

  return (
    <section className={styles.toolbar} aria-label="Run filters">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>CONTROL PLANE</p>
          <h1>Runs</h1>
          <p className={styles.description}>Monitor and inspect your AI agent executions.</p>
        </div>
        <label className={styles.errorToggle}>
          <input type="checkbox" checked={simulateError} onChange={(event) => onSimulateErrorChange(event.target.checked)} />
          Simulate error
        </label>
      </div>
      <div className={styles.controls}>
        <label className={styles.search}>
          <span aria-hidden="true">⌕</span>
          <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search runs or repositories" aria-label="Search runs or repositories" />
          {query && <button type="button" onClick={() => onQueryChange('')} aria-label="Clear search">×</button>}
        </label>
        <label className={styles.sortSelect}>
          <select value={sort} onChange={handleSortChange} aria-label="Sort runs">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="durationDesc">Longest duration</option>
          </select>
        </label>
      </div>
      <div className={styles.filters} role="group" aria-label="Filter by status">
        {filters.map((filter) => (
          <button type="button" key={filter.value} className={status === filter.value ? styles.activeFilter : ''} aria-pressed={status === filter.value} onClick={() => onStatusChange(filter.value)}>
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  )
}
