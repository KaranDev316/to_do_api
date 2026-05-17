import { useState } from 'react'

function TodoItem({ todo, onDelete, onToggle, isDeleting }) {
  const [isCompleted, setIsCompleted] = useState(Boolean(todo.completed))
  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString()
    : 'Not available'

  const handleDelete = () => {
    if (isDeleting) {
      return
    }

    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onDelete(todo.id)
    }
  }

  const handleToggle = (event) => {
    event.stopPropagation()

    const nextCompleted = !isCompleted
    setIsCompleted(nextCompleted)
    onToggle?.(todo.id, nextCompleted)
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm transition-opacity ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
    >
      <div className="min-w-0 space-y-1">
        <span
          className={`block break-words font-medium text-slate-800 ${isCompleted ? 'line-through' : ''}`}
        >
          {todo.title}
        </span>

        <p
          className={`break-words text-sm text-slate-500 ${isCompleted ? 'line-through' : ''}`}
        >
          {todo.description || 'No description provided'}
        </p>

        <p className="text-xs font-medium text-slate-400">
          Created {createdDate}
        </p>
      </div>
      <div className="flex items-center shrink-0 gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex h-8 w-8 items-center justify-center rounded border text-sm font-bold transition-colors ${isCompleted ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-transparent hover:border-slate-400'}`}
          aria-pressed={isCompleted}
          aria-label={`${isCompleted ? 'Mark incomplete' : 'Mark complete'}: ${todo.title}`}
          title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          ✓
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${isDeleting ? 'cursor-not-allowed bg-red-100 text-red-400' : 'text-red-600 hover:bg-red-50 active:bg-red-100'}`}
          aria-label={isDeleting ? `Deleting ${todo.title}` : `Delete todo: ${todo.title}`}
          title={isDeleting ? 'Deleting...' : 'Delete this todo'}
        >
          {isDeleting ? 'Deleting…' : '🗑️'}
        </button>
      </div>
    </div>
  )
}

export default TodoItem
