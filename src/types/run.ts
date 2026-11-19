export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed'

export type StatusFilter = 'all' | RunStatus

export type SortOption = 'newest' | 'oldest' | 'durationDesc'

export interface Run {
  id: string
  name: string
  repository: string
  branch: string
  status: RunStatus
  createdAt: string
  durationSeconds?: number
  logs: string[]
  result?: string
}
