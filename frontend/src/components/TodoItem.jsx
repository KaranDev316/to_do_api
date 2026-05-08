function TodoItem({ todo }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="min-w-0 break-words font-medium text-slate-800">
        {todo.title}
      </span>
      <span
        className="shrink-0 text-xl"
        aria-label={todo.completed ? 'Completed' : 'Not completed'}
        title={todo.completed ? 'Completed' : 'Not completed'}
      >
        {todo.completed ? '✅' : '❌'}
      </span>
    </div>
  )
}

export default TodoItem
