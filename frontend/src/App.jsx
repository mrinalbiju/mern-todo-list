import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])     // tasks currently shown on screen
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load all tasks from the backend once, when the page first renders
  useEffect(() => {
    getTasks()
      .then((data) => setTasks(data))
      .catch((err) => setError(`Could not load tasks: ${err.message}. Is the backend running?`))
      .finally(() => setLoading(false))
  }, [])

  // POST the new task, then put the saved copy (with its _id) at the top of the list
  async function handleAdd(title) {
    setError('')
    try {
      const saved = await createTask(title)
      setTasks((prev) => [saved, ...prev])
    } catch (err) {
      setError(err.message)
      throw err // lets TaskForm keep the text in the input
    }
  }

  // PUT the flipped `completed` value and replace the task with the server's version
  async function handleToggle(task) {
    setError('')
    try {
      const updated = await updateTask(task._id, { completed: !task.completed })
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  // PUT a new title
  async function handleRename(id, title) {
    setError('')
    try {
      const updated = await updateTask(id, { title })
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // DELETE the task, then drop it from state so it disappears without a reload
  async function handleDelete(id) {
    setError('')
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const doneCount = tasks.filter((t) => t.completed).length

  return (
    <main className="app">
      <header className="app-header">
        <h1>To-Do List</h1>
        {!loading && (
          <p className="summary">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · {doneCount} completed
          </p>
        )}
      </header>

      <TaskForm onAdd={handleAdd} />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}

      <footer className="app-footer">MongoDB · Express · React · Node.js</footer>
    </main>
  )
}

export default App
