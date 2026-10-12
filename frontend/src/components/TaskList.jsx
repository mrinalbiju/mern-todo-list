import TaskItem from './TaskItem'

// Renders every task, or an empty-state message when there are none.
function TaskList({ tasks, onToggle, onRename, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add your first one above.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TaskList
