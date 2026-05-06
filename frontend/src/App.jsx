
import './App.css'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto w-full max-w-xl">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          My Todos
        </h1>

        <div
          className="mt-8 min-h-64 rounded-lg border border-dashed border-slate-300 bg-white"
          aria-label="Todo list placeholder"
        />
      </section>
    </main>
  )
}

export default App
