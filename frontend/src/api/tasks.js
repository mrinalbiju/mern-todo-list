// All calls to the Express backend live here, so components never build URLs themselves.
// The base URL can be changed with VITE_API_URL in frontend/.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/tasks'

// Shared helper: sends the request, parses JSON, and throws a readable error
// for any non-2xx status so callers can show it to the user.
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`)
  }
  return data
}

// GET /api/tasks — returns an array of tasks
export function getTasks() {
  return request(API_URL)
}

// POST /api/tasks — returns the newly created task
export function createTask(title) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

// PUT /api/tasks/:id — updates { completed } and/or { title }, returns the updated task
export function updateTask(id, changes) {
  return request(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  })
}

// DELETE /api/tasks/:id
export function deleteTask(id) {
  return request(`${API_URL}/${id}`, { method: 'DELETE' })
}
