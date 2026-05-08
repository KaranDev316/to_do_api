import { useEffect, useState } from 'react'
import { wait } from '../../../utils/async'
import { getTodoById } from '../services/todosApi'

export function useTodoDetail(id) {
  const [todo, setTodo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorType, setErrorType] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const isInvalidId = !/^\d+$/.test(id ?? '') || Number(id) <= 0

  useEffect(() => {
    async function loadTodo() {
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

        const result = await getTodoById(id)

        if (!result) {
          setErrorType('not-found')
          return
        }

        setTodo(result)
      } catch (error) {
        console.error('Failed to fetch todo:', error)
        setErrorType('network')
      } finally {
        setIsLoading(false)
      }
    }

    loadTodo()
  }, [id, isInvalidId, retryCount])

  return {
    todo,
    isLoading,
    errorType,
    isInvalidId,
    retry: () => setRetryCount((count) => count + 1),
  }
}
