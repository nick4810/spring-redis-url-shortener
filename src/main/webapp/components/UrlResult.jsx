import { useState } from 'react'

const BASE_URL = 'http://localhost:8080'

export default function UrlResult({ shortCode }) {
  const [copied, setCopied] = useState(false)
  const shortUrl = `${BASE_URL}/${shortCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="url-result">
      <p>Shortened URL</p>
      <div className="url-result-row">
        <a href={shortUrl} target="_blank" rel="noreferrer">
          {shortUrl}
        </a>
        <button className="btn-secondary" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  )
}
