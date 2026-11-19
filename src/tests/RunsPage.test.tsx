import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRuns } from '../data/mockRuns'
import { RunsPage } from '../pages/RunsPage'
import { fetchRuns } from '../services/runsService'

vi.mock('../services/runsService', () => ({
  fetchRuns: vi.fn(),
}))

const mockedFetchRuns = vi.mocked(fetchRuns)

describe('RunsPage', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    mockedFetchRuns.mockReset()
    mockedFetchRuns.mockResolvedValue(mockRuns)
  })

  it('filters runs by status', async () => {
    const user = userEvent.setup()
    render(<RunsPage />)
    await screen.findByText('API migration review')

    await user.click(screen.getByRole('button', { name: 'Failed' }))

    expect(screen.getByText('Landing page accessibility')).toBeInTheDocument()
    expect(screen.getByText('Admin permissions audit')).toBeInTheDocument()
    expect(screen.queryByText('API migration review')).not.toBeInTheDocument()
  })

  it('combines search with filters and resets an empty result', async () => {
    const user = userEvent.setup()
    render(<RunsPage />)
    await screen.findByText('API migration review')

    await user.click(screen.getByRole('button', { name: 'Succeeded' }))
    await user.type(screen.getByRole('searchbox'), 'missing')
    expect(screen.getByText('No runs found')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getByText('API migration review')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('syncs URL filters and supports sorting', async () => {
    const user = userEvent.setup()
    render(<RunsPage />)
    await screen.findByText('API migration review')

    await user.click(screen.getByRole('button', { name: 'Failed' }))
    await user.type(screen.getByRole('searchbox'), 'accounts')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort runs' }), 'oldest')

    expect(window.location.search).toContain('status=failed')
    expect(window.location.search).toContain('q=accounts')
    expect(screen.getByText('Admin permissions audit')).toBeInTheDocument()
  })

  it('opens details and closes them with Escape', async () => {
    const user = userEvent.setup()
    render(<RunsPage />)
    await user.click(await screen.findByRole('button', { name: 'Open API migration review' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Migration plan approved with three follow-up tasks.')).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByText('feat/api-migration')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows an error and retries the request', async () => {
    mockedFetchRuns.mockRejectedValueOnce(new Error('Failed to load AI agent runs. Please try again.'))
    mockedFetchRuns.mockResolvedValueOnce(mockRuns)
    const user = userEvent.setup()
    render(<RunsPage />)

    expect(await screen.findByText('Could not load runs')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('API migration review')).toBeInTheDocument()
    expect(mockedFetchRuns).toHaveBeenCalledTimes(2)
  })
})
