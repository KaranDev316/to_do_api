const todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build API', completed: false }
];

let nextTodoId = Math.max(...todos.map((todo) => todo.id), 0) + 1;

function findTodoById(id) {
  return todos.find((item) => item.id === id);
}

function getAllTodos() {
  return todos;
}

function getTodoById(req, res) {
  const { id } = req.params;
  const todoId = Number(id);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const todo = findTodoById(todoId);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
}

function createTodo(req, res) {
  const { title, completed } = req.body;
  const todo = { id: nextTodoId, title, completed };

  nextTodoId += 1;
  todos.push(todo);

  res.status(201).json(todo);
}

module.exports = { findTodoById, getAllTodos, getTodoById, createTodo };
