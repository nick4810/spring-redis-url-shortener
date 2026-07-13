import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ShortenForm from './ShortenForm'
import * as urlService from '../api/urlService'

vi.mock('../api/urlService')

describe('ShortenForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the URL input and submit button', () => {
    render(<ShortenForm />)
    expect(screen.getByLabelText(/url to shorten/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument()
  })

  it('shows the shortened URL on successful submission', async () => {
    urlService.shortenUrl.mockResolvedValue({ id: 'abc123' })
    render(<ShortenForm />)

    await userEvent.type(screen.getByLabelText(/url to shorten/i), 'https://example.com')
    await userEvent.click(screen.getByRole('button', { name: /shorten/i }))

    await waitFor(() => {
      expect(screen.getByRole('link')).toHaveAttribute('href', 'http://localhost:8080/abc123')
    })
  })

  it('shows an error message on failed submission', async () => {
    urlService.shortenUrl.mockRejectedValue(new Error('Server error'))
    render(<ShortenForm />)

    await userEvent.type(screen.getByLabelText(/url to shorten/i), 'https://example.com')
    await userEvent.click(screen.getByRole('button', { name: /shorten/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Server error')
    })
  })

  it('disables the button while a request is in flight', async () => {
    let resolve
    urlService.shortenUrl.mockReturnValue(new Promise((r) => { resolve = r }))
    render(<ShortenForm />)

    await userEvent.type(screen.getByLabelText(/url to shorten/i), 'https://example.com')
    await userEvent.click(screen.getByRole('button', { name: /shorten/i }))

    expect(screen.getByRole('button', { name: /shortening/i })).toBeDisabled()
    resolve({ id: 'abc123' })
  })
})
