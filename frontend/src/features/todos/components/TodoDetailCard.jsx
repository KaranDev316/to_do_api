function TodoDetailCard({ todo }) {
  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString()
    : 'Not available'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-slate-500">Title</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">
            {todo.title}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Description</dt>
          <dd className="mt-1 text-slate-700">
            {todo.description || 'No description provided'}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Status</dt>
          <dd className="mt-1 text-slate-700">
            {todo.completed ? 'Completed' : 'Not completed'}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Created Date</dt>
          <dd className="mt-1 text-slate-700">{createdDate}</dd>
        </div>
      </dl>
    </div>
  )
}

export default TodoDetailCard
