
import { Route, Routes } from 'react-router-dom'
import TodoDetailPage from './features/todos/pages/TodoDetailPage'
import TodoListPage from './features/todos/pages/TodoListPage'
import AppLayout from './layouts/AppLayout'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/todos/:id" element={<TodoDetailPage />} />
      </Routes>
    </AppLayout>
  )
}

export default App
