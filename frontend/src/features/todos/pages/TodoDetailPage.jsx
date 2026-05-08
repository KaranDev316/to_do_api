import { useParams } from 'react-router-dom'
import FeedbackCard from '../../../components/FeedbackCard'
import BackLink from '../components/BackLink'
import TodoDetailCard from '../components/TodoDetailCard'
import { useTodoDetail } from '../hooks/useTodoDetail'

function TodoDetailPage() {
  const { id } = useParams()
  const { todo, isLoading, errorType, isInvalidId, retry } = useTodoDetail(id)

  if (isInvalidId || errorType === 'invalid') {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="warning">
          <p className="text-sm font-medium">Invalid ID</p>
        </FeedbackCard>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <BackLink />
        <FeedbackCard>
          <p className="text-sm font-medium text-slate-500">Loading todo...</p>
        </FeedbackCard>
      </>
    )
  }

  if (errorType === 'not-found') {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="warning">
          <p className="text-sm font-medium">
            This todo doesn't exist or was deleted
          </p>
        </FeedbackCard>
      </>
    )
  }

  if (errorType === 'network') {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="error">
          <p className="text-sm font-medium">Could not connect. Try again.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Retry
          </button>
        </FeedbackCard>
      </>
    )
  }

  if (!todo) {
    return (
      <>
        <BackLink />
        <FeedbackCard tone="error">
          <p className="text-sm font-medium">Failed to load todo</p>
        </FeedbackCard>
      </>
    )
  }

  return (
    <>
      <BackLink />
      <TodoDetailCard todo={todo} />
    </>
  )
}

export default TodoDetailPage
