import { useState } from 'react'

// Input + button for adding a task.
// `onAdd(title)` is provided by App and returns a promise that resolves once the
// backend has saved the task; the input is only cleared after that succeeds.
function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault() // stop the browser from reloading the page
    const trimmed = title.trim()
    if (!trimmed) return

    setSaving(true)
    try {
      await onAdd(trimmed)
      setTitle('') // clear the input after a successful POST
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New task title"
        maxLength={200}
        autoFocus
      />
      <button type="submit" disabled={saving || !title.trim()}>
        {saving ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}

export default TaskForm
