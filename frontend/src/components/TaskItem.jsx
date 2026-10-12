import { useState } from 'react'

// One row in the list: checkbox (PUT completed), title (PUT title on edit), delete (DELETE).
function TaskItem({ task, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  function startEditing() {
    setDraft(task.title)
    setEditing(true)
  }

  async function saveEdit() {
    const trimmed = draft.trim()
    // Nothing changed, or left empty: just leave edit mode without calling the API
    if (!trimmed || trimmed === task.title) {
      setEditing(false)
      return
    }
    try {
      await onRename(task._id, trimmed)
      setEditing(false)
    } catch {
      // App already shows the error message; stay in edit mode so the text isn't lost
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  const created = new Date(task.createdAt).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <li className={`task-item${task.completed ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="task-body">
        {editing ? (
          <input
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            aria-label="Edit task title"
            autoFocus
          />
        ) : (
          <span className="task-title" onDoubleClick={startEditing} title="Double-click to edit">
            {task.title}
          </span>
        )}
        <span className="task-meta">Added {created}</span>
      </div>

      {!editing && (
        <button className="icon-btn" onClick={startEditing} aria-label={`Edit "${task.title}"`}>
          Edit
        </button>
      )}
      <button className="icon-btn danger" onClick={() => onDelete(task._id)} aria-label={`Delete "${task.title}"`}>
        Delete
      </button>
    </li>
  )
}

export default TaskItem
