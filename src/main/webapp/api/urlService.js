const BASE_URL = 'http://localhost:8080'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed: ${res.status}`)
  }
  return data
}

export async function shortenUrl(originalUrl) {
  const res = await fetch(`${BASE_URL}/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl }),
  })
  return handleResponse(res)
}

export async function getUrl(id) {
  const res = await fetch(`${BASE_URL}/${id}`)
  return handleResponse(res)
}

export async function deleteUrl(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}

export async function getStats(id) {
  const res = await fetch(`${BASE_URL}/stats/${id}`)
  return handleResponse(res)
}
