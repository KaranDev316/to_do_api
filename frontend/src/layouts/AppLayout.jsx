function AppLayout({ children }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          My Todos
        </h1>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  )
}

export default AppLayout
