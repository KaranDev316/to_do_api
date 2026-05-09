function TodoItem({ todo, onDelete, isDeleting }) {
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

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="min-w-0 space-y-1">
        <span className="block break-words font-medium text-slate-800">
          {todo.title}
        </span>

        <p className="break-words text-sm text-slate-500">
          {todo.description || 'No description provided'}
        </p>

        <p className="text-xs font-medium text-slate-400">
          Created {createdDate}
        </p>
      </div>
      <div className="flex items-center shrink-0 gap-3">
        <span
          className="text-xl"
          aria-label={todo.completed ? 'Completed' : 'Not completed'}
          title={todo.completed ? 'Completed' : 'Not completed'}
        >
          {todo.completed ? '✅' : '❌'}
        </span>
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
