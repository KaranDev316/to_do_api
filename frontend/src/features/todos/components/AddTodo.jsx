function AddTodo({
  title,
  isSubmitting,
  apiError,
  maxTitleLength,
  isSubmitDisabled,
  showValidationError,
  validationError,
  onChange,
  onSubmit,
  onBlur,
}) {
  return (
    <form
      onSubmit={onSubmit}
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
          onChange={onChange}
          onBlur={onBlur}
          disabled={isSubmitting}
          maxLength={maxTitleLength + 1}
          placeholder="Add a new todo"
          className="min-h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="min-h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>

      {showValidationError && (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
      )}

      <p className="mt-2 text-xs text-slate-400">
        {title.length}/{maxTitleLength}
      </p>

      {apiError && <p className="mt-2 text-sm text-red-600">{apiError}</p>}
    </form>
  )
}

export default AddTodo
