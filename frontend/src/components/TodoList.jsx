import { Link } from 'react-router-dom'
import TodoItem from './TodoItem'

function TodoList({ todos }) {
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
