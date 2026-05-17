import { useEffect, useRef, useState } from 'react'
import {
  getTodos,
  deleteTodo as deleteTodoApi,
  updateTodo as updateTodoApi,
} from '../services/todosApi'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [deletingIds, setDeletingIds] = useState([])
  const [updatingIds, setUpdatingIds] = useState([])
  const deletingIdsRef = useRef(new Set())
  const updatingIdsRef = useRef(new Set())

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

  async function toggleTodoCompletion(id, completed) {
    const previousTodo = todos.find((todo) => todo.id === id)

    if (id === null || id === undefined || id === '') {
      setUpdateError('Invalid todo selected for update.')
      return
    }

    if (!previousTodo) {
      setUpdateError('Todo not found for update.')
      return
    }

    if (typeof completed !== 'boolean') {
      setUpdateError('Completed value must be true or false.')
      return
    }

    if (updatingIdsRef.current.has(id)) {
      return
    }

    const previousTodoSnapshot = { ...previousTodo }

    updatingIdsRef.current.add(id)
    setUpdatingIds((current) => [...current, id])
    setUpdateError('')

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed,
            }
          : todo,
      ),
    )

    try {
      const updatedTodo = await updateTodoApi(id, { completed })

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                ...updatedTodo,
              }
            : todo,
        ),
      )
    } catch (error) {
      console.error('Failed to update todo completion:', error)

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? previousTodoSnapshot : todo,
        ),
      )

      const rawMessage = error?.message || ''
      const userMessage = rawMessage.includes('not found')
        ? 'This todo could not be found. It may already have been removed.'
        : 'Unable to update todo completion. Please try again.'

      setUpdateError(userMessage)
    } finally {
      updatingIdsRef.current.delete(id)
      setUpdatingIds((current) => current.filter((pendingId) => pendingId !== id))
    }
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
    updateError,
    deletingIds,
    updatingIds,
    addTodo,
    toggleTodoCompletion,
    deleteTodo,
  }
}
