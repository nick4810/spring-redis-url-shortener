import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import UrlResult from './UrlResult'

describe('UrlResult', () => {
  it('renders the full short URL as a link', () => {
    render(<UrlResult shortCode="abc123" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://localhost:8080/abc123')
    expect(screen.getByRole('link')).toHaveTextContent('http://localhost:8080/abc123')
  })

  it('opens the link in a new tab', () => {
    render(<UrlResult shortCode="abc123" />)
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
  })

  it('renders a Copy button', () => {
    render(<UrlResult shortCode="abc123" />)
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('shows Copied! after clicking the copy button', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    render(<UrlResult shortCode="abc123" />)

    await userEvent.click(screen.getByRole('button', { name: /copy/i }))

    expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:8080/abc123')
  })
})
