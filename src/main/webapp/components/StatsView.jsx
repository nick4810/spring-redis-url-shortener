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
    <div className="card">
      <h2>URL Stats</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="stats-input">Short code</label>
          <input
            id="stats-input"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="aB3xYz"
            required
          />
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Stats'}
        </button>
      </form>
      {error && <p className="alert-error" role="alert">{error}</p>}
      {stats && (
        <div className="stats-list">
          <div className="stats-row">
            <span className="stats-label">Original URL</span>
            <span className="stats-value"><a href={stats.originalUrl}>{stats.originalUrl}</a></span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Click count</span>
            <span className="stats-value">{stats.clickCount}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Created</span>
            <span className="stats-value">{new Date(stats.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
