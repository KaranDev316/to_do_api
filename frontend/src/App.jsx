
import { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import TodoList from './components/TodoList'

function TodoListPage() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTodos() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/todos')

        if (!response.ok) {
          throw new Error('Failed to load todos')
        }

        const result = await response.json()

        console.log('Fetched todos:', result)
        setTodos(result.data)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        setError('Failed to load todos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [])

  return (
    <div className="min-h-64 rounded-lg border border-dashed border-slate-300 bg-slate-100 p-4">
      {isLoading && (
        <p className="text-center text-sm font-medium text-slate-500">
          Loading...
        </p>
      )}

      {!isLoading && error && (
        <p className="text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && todos.length === 0 && (
        <p className="text-center text-sm font-medium text-slate-500">
          No todos found
        </p>
      )}

      {!isLoading && !error && todos.length > 0 && <TodoList todos={todos} />}
    </div>
  )
}

function TodoDetail() {
  const { id } = useParams()
  const [todo, setTodo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTodo() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`http://localhost:5000/todos/${id}`)

        if (!response.ok) {
          throw new Error('Failed to load todo')
        }

        const data = await response.json()
        setTodo(data.data ?? data)
      } catch (error) {
        console.error('Failed to fetch todo:', error)
        setError('Failed to load todo')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodo()
  }, [id])

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm font-medium text-slate-500">Loading todo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    )
  }

  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString()
    : 'Not available'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-slate-500">Title</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">
            {todo.title}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Description</dt>
          <dd className="mt-1 text-slate-700">
            {todo.description || 'No description provided'}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Status</dt>
          <dd className="mt-1 text-slate-700">
            {todo.completed ? 'Completed' : 'Not completed'}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Created Date</dt>
          <dd className="mt-1 text-slate-700">{createdDate}</dd>
        </div>
      </dl>
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          My Todos
        </h1>

        <div className="mt-8">
          <Routes>
            <Route path="/" element={<TodoListPage />} />
            <Route path="/todos/:id" element={<TodoDetail />} />
          </Routes>
        </div>
      </div>
    </main>
  )
}

export default App
