import { Link } from 'react-router-dom'

function BackLink() {
  return (
    <Link
      to="/"
      className="mb-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      ← Back to list
    </Link>
  )
}

export default BackLink
