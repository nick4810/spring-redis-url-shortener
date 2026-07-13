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
    <div>
      <p>Shortened URL:</p>
      <a href={shortUrl} target="_blank" rel="noreferrer">
        {shortUrl}
      </a>
      <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
    </div>
  )
}
