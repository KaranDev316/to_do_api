import { useEffect, useRef, useState } from 'react'
import { getTodos, deleteTodo as deleteTodoApi } from '../services/todosApi'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deletingIds, setDeletingIds] = useState([])
  const deletingIdsRef = useRef(new Set())

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
    if (id === null || id === undefined || id === '') {
      setDeleteError('Invalid todo selected for deletion.')
      return
    }

    if (deletingIdsRef.current.has(id)) {
      return
    }

    deletingIdsRef.current.add(id)
    setDeletingIds((current) => [...current, id])
    setDeleteError('')

    let removedTodo = null
    let removedIndex = -1

    setTodos((currentTodos) => {
      removedIndex = currentTodos.findIndex((todo) => todo.id === id)

      if (removedIndex === -1) {
        return currentTodos
      }

      removedTodo = currentTodos[removedIndex]
      return currentTodos.filter((todo) => todo.id !== id)
    })

    try {
      await deleteTodoApi(id)
    } catch (error) {
      console.error('Failed to delete todo:', error)
      const rawMessage = error?.message || ''
      const userMessage = rawMessage.includes('not found')
        ? 'This todo could not be found. It may already have been deleted.'
        : 'Unable to delete the todo. Please check your connection and try again.'

      if (removedTodo) {
        setTodos((currentTodos) => {
          if (currentTodos.some((todo) => todo.id === id)) {
            return currentTodos
          }

          const restoredTodos = [...currentTodos]
          restoredTodos.splice(removedIndex, 0, removedTodo)
          return restoredTodos
        })
      }

      setDeleteError(userMessage)
    } finally {
      deletingIdsRef.current.delete(id)
      setDeletingIds((current) => current.filter((pendingId) => pendingId !== id))
    }
  }

  return {
    todos,
    isLoading,
    error,
    deleteError,
    deletingIds,
    addTodo,
    deleteTodo,
  }
}
