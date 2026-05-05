const todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build API', completed: false }
];

function findTodoById(id) {
  return todos.find((item) => item.id === id);
}

function getAllTodos() {
  return todos;
}

module.exports = { findTodoById, getAllTodos };
