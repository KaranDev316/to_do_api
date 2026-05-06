
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch('/todos')
        const data = await response.json()

        console.log('Fetched todos:', data)
        setTodos(data)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
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

        <div className="mt-8 min-h-64 rounded-lg border border-dashed border-slate-300 bg-white" />
      </section>
    </main>
  )
}

export default App
