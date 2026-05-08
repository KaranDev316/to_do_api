import { useRef, useState } from 'react'
import { createTodo } from '../services/todosApi'
import {
  getTodoTitleValidation,
  MAX_TITLE_LENGTH,
} from '../utils/todoValidation'

export function useCreateTodo(onTodoCreated) {
  const [title, setTitle] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const isSubmittingRef = useRef(false)

  const { trimmedTitle, isEmpty, isTooLong, validationError } =
    getTodoTitleValidation(title)

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmittingRef.current) {
      return
    }

    setIsTouched(true)
    setApiError('')

    if (isEmpty || isTooLong) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const createdTodo = await createTodo(trimmedTitle)
      onTodoCreated(createdTodo)
      setTitle('')
      setIsTouched(false)
    } catch (error) {
      console.error('Failed to create todo:', error)
      setApiError(error.message || 'Could not add todo. Please try again.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  function handleChange(event) {
    setTitle(event.target.value)
    setApiError('')
  }

  return {
    title,
    isSubmitting,
    apiError,
    maxTitleLength: MAX_TITLE_LENGTH,
    isSubmitDisabled: isEmpty || isTooLong || isSubmitting,
    showValidationError: isTouched && (isEmpty || isTooLong),
    validationError,
    handleChange,
    handleSubmit,
    handleBlur: () => setIsTouched(true),
  }
}
