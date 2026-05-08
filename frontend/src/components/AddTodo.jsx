import { useState } from 'react'

function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  const trimmedTitle = title.trim()
  const isEmpty = trimmedTitle.length === 0
  const showError = isTouched && isEmpty

  function handleSubmit(event) {
    event.preventDefault()
    setIsTouched(true)

    if (isEmpty) {
      return
    }

    onAddTodo(trimmedTitle)
    setTitle('')
    setIsTouched(false)
  }

  function handleChange(event) {
    setTitle(event.target.value)
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
          placeholder="Add a new todo"
          className="min-h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <button
          type="submit"
          disabled={isEmpty}
          className="min-h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Add Todo
        </button>
      </div>

      {showError && (
        <p className="mt-2 text-sm text-red-600">Todo title is required</p>
      )}
    </form>
  )
}

export default AddTodo
