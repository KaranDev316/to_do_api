import { useEffect, useState } from 'react'
import { getTodos } from '../services/todosApi'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTodos() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getTodos()
        setTodos(result)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        setError('Failed to load todos')
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [])

  function addTodo(todo) {
    setTodos((currentTodos) => [...currentTodos, todo])
  }

  return {
    todos,
    isLoading,
    error,
    addTodo,
  }
}
