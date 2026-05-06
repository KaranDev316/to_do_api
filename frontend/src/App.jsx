
import './App.css'
import TodoList from './components/TodoList'

const todos = [
  { id: 1, title: 'Learn React components', completed: true },
  { id: 2, title: 'Pass todos as props', completed: true },
  { id: 3, title: 'Fetch data later', completed: false },
]

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <section className="mx-auto w-full max-w-xl">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          My Todos
        </h1>

        <div className="mt-8 min-h-64 rounded-lg border border-dashed border-slate-300 bg-slate-100 p-4">
          <TodoList todos={todos} />
        </div>
      </section>
    </main>
  )
}

export default App
