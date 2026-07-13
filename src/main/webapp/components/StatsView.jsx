import { useState } from 'react'
import { getStats } from '../api/urlService'

export default function StatsView() {
  const [id, setId] = useState('')
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setStats(null)
    setLoading(true)
    try {
      const data = await getStats(id)
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>URL Stats</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="stats-input">Short code</label>
        <input
          id="stats-input"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="aB3xYz"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Stats'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {stats && (
        <dl>
          <dt>Original URL</dt>
          <dd><a href={stats.originalUrl}>{stats.originalUrl}</a></dd>
          <dt>Click count</dt>
          <dd>{stats.clickCount}</dd>
          <dt>Created</dt>
          <dd>{new Date(stats.createdAt).toLocaleString()}</dd>
        </dl>
      )}
    </div>
  )
}
