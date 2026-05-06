function TodoItem({ todo }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="font-medium text-slate-800">{todo.title}</span>
      <span
        className="shrink-0 text-xl"
        aria-label={todo.completed ? 'Completed' : 'Not completed'}
        title={todo.completed ? 'Completed' : 'Not completed'}
      >
        {todo.completed ? '✅' : '❌'}
      </span>
    </li>
  )
}

export default TodoItem
