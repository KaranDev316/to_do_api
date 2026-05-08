import { Link } from 'react-router-dom'
import TodoItem from './TodoItem'

function TodoList({ todos }) {
  if (todos.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
        <p className="text-sm font-medium text-slate-600">No todos found</p>
        <p className="mt-1 text-sm text-slate-400">
          Add your first todo to get started.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li key={todo.id}>
          <Link
            to={`/todos/${todo.id}`}
            className="block rounded-md transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <TodoItem todo={todo} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default TodoList
