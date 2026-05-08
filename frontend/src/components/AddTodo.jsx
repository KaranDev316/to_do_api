import { useRef, useState } from 'react'

function AddTodo({ onTodoCreated }) {
  const [title, setTitle] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const isSubmittingRef = useRef(false)

  const trimmedTitle = title.trim()
  const isEmpty = trimmedTitle.length === 0
  const showError = isTouched && isEmpty

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmittingRef.current) {
      return
    }

    setIsTouched(true)
    setApiError('')

    if (isEmpty) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)

    try {
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: trimmedTitle,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create todo')
      }

      const result = await response.json()
      const createdTodo = result.data ?? result

      onTodoCreated(createdTodo)
      setTitle('')
      setIsTouched(false)
    } catch (error) {
      console.error('Failed to create todo:', error)
      setApiError('Could not add todo. Please try again.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  function handleChange(event) {
    setTitle(event.target.value)
    setApiError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <label
        htmlFor="todo-title"
        className="block text-sm font-medium text-slate-700"
      >
        Todo title
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={handleChange}
          onBlur={() => setIsTouched(true)}
          disabled={isSubmitting}
          placeholder="Add a new todo"
          className="min-h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
        />

        <button
          type="submit"
          disabled={isEmpty || isSubmitting}
          className="min-h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>

      {showError && (
        <p className="mt-2 text-sm text-red-600">Todo title is required</p>
      )}

      {apiError && <p className="mt-2 text-sm text-red-600">{apiError}</p>}
    </form>
  )
}

export default AddTodo
