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

function createTodoService(data) {
  const { title, completed } = data;
  const todo = { id: nextTodoId, title, completed };

  nextTodoId += 1;
  todos.push(todo);

  return todo;
}

module.exports = { findTodoById, getAllTodos, createTodoService };
