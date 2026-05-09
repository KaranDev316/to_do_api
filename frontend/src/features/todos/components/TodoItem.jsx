function TodoItem({ todo, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="min-w-0 break-words font-medium text-slate-800">
        {todo.title}
      </span>
      <div className="flex items-center shrink-0 gap-3">
        <span
          className="text-xl"
          aria-label={todo.completed ? 'Completed' : 'Not completed'}
          title={todo.completed ? 'Completed' : 'Not completed'}
        >
          {todo.completed ? '✅' : '❌'}
        </span>
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
              onDelete(todo.id)
            }
          }}
          className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
          aria-label={`Delete todo: ${todo.title}`}
          title="Delete this todo"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TodoItem
