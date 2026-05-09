import { useRef, useState } from 'react'
import { createTodo } from '../services/todosApi'
import {
  getTodoDescriptionValidation,
  getTodoTitleValidation,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
} from '../utils/todoValidation'

export function useCreateTodo(onTodoCreated) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const isSubmittingRef = useRef(false)

  const { trimmedTitle, isEmpty, isTooLong, validationError } =
    getTodoTitleValidation(title)
  const {
    trimmedDescription,
    isTooLong: isDescriptionTooLong,
    validationError: descriptionValidationError,
  } = getTodoDescriptionValidation(description)

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmittingRef.current) {
      return
    }

    setIsTouched(true)
    setApiError('')

    if (isEmpty || isTooLong || isDescriptionTooLong) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const createdTodo = await createTodo(trimmedTitle, trimmedDescription)
      onTodoCreated(createdTodo)
      setTitle('')
      setDescription('')
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

  function handleDescriptionChange(event) {
    setDescription(event.target.value)
    setApiError('')
  }

  return {
    title,
    description,
    isSubmitting,
    apiError,
    maxTitleLength: MAX_TITLE_LENGTH,
    maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
    isSubmitDisabled: isEmpty || isTooLong || isDescriptionTooLong || isSubmitting,
    showValidationError: isTouched && (isEmpty || isTooLong || isDescriptionTooLong),
    validationError: isDescriptionTooLong ? descriptionValidationError : validationError,
    handleChange,
    handleDescriptionChange,
    handleSubmit,
    handleBlur: () => setIsTouched(true),
  }
}
