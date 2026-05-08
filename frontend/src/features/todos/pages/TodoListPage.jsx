import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import { useCreateTodo } from '../hooks/useCreateTodo'
import { useTodos } from '../hooks/useTodos'

function TodoListPage() {
  const { todos, isLoading, error, addTodo } = useTodos()
  const addTodoForm = useCreateTodo(addTodo)

  return (
    <div className="space-y-4">
      <AddTodo
        title={addTodoForm.title}
        isSubmitting={addTodoForm.isSubmitting}
        apiError={addTodoForm.apiError}
        maxTitleLength={addTodoForm.maxTitleLength}
        isSubmitDisabled={addTodoForm.isSubmitDisabled}
        showValidationError={addTodoForm.showValidationError}
        validationError={addTodoForm.validationError}
        onChange={addTodoForm.handleChange}
        onSubmit={addTodoForm.handleSubmit}
        onBlur={addTodoForm.handleBlur}
      />

      <div className="min-h-64 rounded-lg border border-dashed border-slate-300 bg-slate-100 p-4">
        {isLoading && (
          <p className="text-center text-sm font-medium text-slate-500">
            Loading...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {!isLoading && !error && <TodoList todos={todos} />}
      </div>
    </div>
  )
}

export default TodoListPage
