function FeedbackCard({ children, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'border-slate-200 bg-white text-slate-500',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-red-200 bg-red-50 text-red-600',
  }

  return (
    <div className={`rounded-lg border p-6 text-center ${toneClasses[tone]}`}>
      {children}
    </div>
  )
}

export default FeedbackCard
