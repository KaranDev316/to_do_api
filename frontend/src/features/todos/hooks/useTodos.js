import { useEffect, useState } from 'react'
import { getTodos, deleteTodo as deleteTodoApi } from '../services/todosApi'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')

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

  async function deleteTodo(id) {
    setDeleteError('')

    try {
      await deleteTodoApi(id)
      // Remove from local state on success
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error('Failed to delete todo:', error)
      setDeleteError(error.message || 'Failed to delete todo')
      throw error
    }
  }

  return {
    todos,
    isLoading,
    error,
    deleteError,
    addTodo,
    deleteTodo,
  }
}
