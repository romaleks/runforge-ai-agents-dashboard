import { mockRuns } from '../data/mockRuns'
import type { Run } from '../types/run'

export interface FetchRunsOptions {
  shouldFail?: boolean
  delayMs?: number
}

const DEFAULT_DELAY_MS = 650
const FAILURE_MESSAGE = 'Failed to load AI agent runs. Please try again.'

export function fetchRuns({
  shouldFail = false,
  delayMs = DEFAULT_DELAY_MS,
}: FetchRunsOptions = {}): Promise<Run[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error(FAILURE_MESSAGE))
        return
      }

      resolve(mockRuns.map((run) => ({ ...run, logs: [...run.logs] })))
    }, delayMs)
  })
}
