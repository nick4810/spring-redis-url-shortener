import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import StatsView from './StatsView'
import * as urlService from '../api/urlService'

vi.mock('../api/urlService')

describe('StatsView', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the short code input and submit button', () => {
    render(<StatsView />)
    expect(screen.getByLabelText(/short code/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get stats/i })).toBeInTheDocument()
  })

  it('displays stats on a successful response', async () => {
    urlService.getStats.mockResolvedValue({
      id: 'abc123',
      originalUrl: 'https://example.com',
      clickCount: 42,
      createdAt: '2026-01-01T00:00:00Z',
    })
    render(<StatsView />)

    await userEvent.type(screen.getByLabelText(/short code/i), 'abc123')
    await userEvent.click(screen.getByRole('button', { name: /get stats/i }))

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /example\.com/i })).toHaveAttribute('href', 'https://example.com')
    })
  })

  it('shows an error message when the short code is not found', async () => {
    urlService.getStats.mockRejectedValue(new Error('No URL found for id: notfound'))
    render(<StatsView />)

    await userEvent.type(screen.getByLabelText(/short code/i), 'notfound')
    await userEvent.click(screen.getByRole('button', { name: /get stats/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No URL found for id: notfound')
    })
  })

  it('disables the button while a request is in flight', async () => {
    let resolve
    urlService.getStats.mockReturnValue(new Promise((r) => { resolve = r }))
    render(<StatsView />)

    await userEvent.type(screen.getByLabelText(/short code/i), 'abc123')
    await userEvent.click(screen.getByRole('button', { name: /get stats/i }))

    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()
    resolve({ id: 'abc123', originalUrl: 'https://example.com', clickCount: 0, createdAt: '2026-01-01T00:00:00Z' })
  })
})
