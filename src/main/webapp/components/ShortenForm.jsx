import { useState } from 'react'
import { shortenUrl } from '../api/urlService'
import UrlResult from './UrlResult'

export default function ShortenForm() {
  const [url, setUrl] = useState('')
  const [shortCode, setShortCode] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setShortCode(null)
    setLoading(true)
    try {
      const data = await shortenUrl(url)
      setShortCode(data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url-input">URL to shorten</label>
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {shortCode && <UrlResult shortCode={shortCode} />}
    </div>
  )
}
