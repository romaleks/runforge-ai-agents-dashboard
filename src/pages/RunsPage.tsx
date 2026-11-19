import { useCallback, useEffect, useMemo, useState } from 'react'
import { RunDetailsDrawer } from '../components/RunDetailsDrawer/RunDetailsDrawer'
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/StateViews'
import { RunsList } from '../components/RunsList/RunsList'
import { RunsToolbar } from '../components/RunsToolbar/RunsToolbar'
import { fetchRuns } from '../services/runsService'
import type { Run, SortOption, StatusFilter } from '../types/run'

const statuses: StatusFilter[] = ['all', 'queued', 'running', 'succeeded', 'failed']

function getInitialStatus(): StatusFilter {
  const value = new URLSearchParams(window.location.search).get('status')
  return value && statuses.includes(value as StatusFilter) ? (value as StatusFilter) : 'all'
}

function getInitialQuery(): string {
  return new URLSearchParams(window.location.search).get('q') ?? ''
}

export function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([])
  const [query, setQuery] = useState(getInitialQuery)
  const [status, setStatus] = useState<StatusFilter>(getInitialStatus)
  const [sort, setSort] = useState<SortOption>('newest')
  const [selectedRun, setSelectedRun] = useState<Run | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [simulateError, setSimulateError] = useState(false)

  const loadRuns = useCallback(() => {
    setIsLoading(true)
    setError(null)
    void fetchRuns({ shouldFail: simulateError })
      .then(setRuns)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Unable to load runs.')
      })
      .finally(() => setIsLoading(false))
  }, [simulateError])

  useEffect(() => {
    const timer = window.setTimeout(loadRuns, 0)
    return () => window.clearTimeout(timer)
  }, [loadRuns])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (status === 'all') params.delete('status')
    else params.set('status', status)
    if (query.trim()) params.set('q', query)
    else params.delete('q')
    const queryString = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`,
    )
  }, [query, status])

  const filteredRuns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return runs
      .filter((run) => status === 'all' || run.status === status)
      .filter(
        (run) =>
          !normalizedQuery ||
          run.name.toLowerCase().includes(normalizedQuery) ||
          run.repository.toLowerCase().includes(normalizedQuery),
      )
      .sort((first, second) => {
        if (sort === 'durationDesc') {
          return (second.durationSeconds ?? -1) - (first.durationSeconds ?? -1)
        }
        const difference =
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
        return sort === 'newest' ? difference : -difference
      })
  }, [query, runs, sort, status])

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
  }

  return (
    <>
      <RunsToolbar
        query={query}
        status={status}
        sort={sort}
        simulateError={simulateError}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onSimulateErrorChange={setSimulateError}
      />
      {isLoading && <LoadingSkeleton />}
      {!isLoading && error && <ErrorState message={error} onRetry={loadRuns} />}
      {!isLoading && !error && filteredRuns.length === 0 && (
        <EmptyState onReset={resetFilters} />
      )}
      {!isLoading && !error && filteredRuns.length > 0 && (
        <RunsList runs={filteredRuns} onSelect={setSelectedRun} />
      )}
      <RunDetailsDrawer run={selectedRun} onClose={() => setSelectedRun(null)} />
    </>
  )
}
