
import { useEffect, useState } from 'react'
import { Link, Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import AddTodo from './components/AddTodo'
import TodoList from './components/TodoList'

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

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

  function handleAddTodo(title) {
    const todo = {
      id: Date.now(),
      title,
      completed: false,
    }

    setTodos((currentTodos) => [todo, ...currentTodos])
  }

  return (
    <div className="space-y-4">
      <AddTodo onAddTodo={handleAddTodo} />

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
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/"
      className="mb-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      ← Back to list
    </Link>
  )
}

function FeedbackCard({ children, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'border-slate-200 bg-white text-slate-500',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-red-200 bg-red-50 text-red-600',
  }

  return (
    <div className={`rounded-lg border p-6 text-center ${toneClasses[tone]}`}>
      {children}
    </div>
  )
}

function TodoDetail() {
  const { id } = useParams()
  const [todo, setTodo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorType, setErrorType] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const isInvalidId = !/^\d+$/.test(id ?? '') || Number(id) <= 0

  useEffect(() => {
    async function fetchTodo() {
      if (isInvalidId) {
        setTodo(null)
        setErrorType('invalid')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorType('')
      setTodo(null)

      try {
        await wait(1200)

        const response = await fetch(`/todos/${id}`)

        if (response.status === 404) {
          setErrorType('not-found')
          return
        }

        if (!response.ok) {
          throw new Error('Could not connect')
        }

        const data = await response.json()
        setTodo(data.data ?? data)
      } catch (error) {
        console.error('Failed to fetch todo:', error)
        setErrorType('network')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodo()
  }, [id, isInvalidId, retryCount])

  if (isInvalidId || errorType === 'invalid') {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="warning">
          <p className="text-sm font-medium">Invalid ID</p>
        </FeedbackCard>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <BackLink />
        <FeedbackCard>
          <p className="text-sm font-medium text-slate-500">Loading todo...</p>
        </FeedbackCard>
      </>
    )
  }

  if (errorType === 'not-found') {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="warning">
          <p className="text-sm font-medium">
            This todo doesn't exist or was deleted
          </p>
        </FeedbackCard>
      </>
    )
  }

  if (errorType === 'network') {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="error">
          <p className="text-sm font-medium">Could not connect. Try again.</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Retry
          </button>
        </FeedbackCard>
      </>
    )
  }

  if (!todo) {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="error">
          <p className="text-sm font-medium">Failed to load todo</p>
        </FeedbackCard>
      </>
    )
  }

  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString()
    : 'Not available'

  return (
    <>
      <BackLink />
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
    </>
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
