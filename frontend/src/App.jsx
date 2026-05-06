
import { useEffect, useState } from 'react'
import './App.css'
import TodoList from './components/TodoList'

function App() {
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

        const data = await response.json()

        console.log('Fetched todos:', data)
        setTodos(data.data)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        setError('Failed to load todos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [])

  useEffect(() => {
    if (todos.length > 0) {
      console.log('Todos stored in state:', todos)
    }
  }, [todos])

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto w-full max-w-xl">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          My Todos
        </h1>

        <div className="mt-8 min-h-64 rounded-lg border border-dashed border-slate-300 bg-slate-100 p-4">
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

          {!isLoading && todos.length > 0 && <TodoList todos={todos} />}
        </div>
      </section>
    </main>
  )
}

export default App
