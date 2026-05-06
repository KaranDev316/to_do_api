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
  const { title, completed = false } = data;
  const todo = { id: nextTodoId, title, completed };

  nextTodoId += 1;
  todos.push(todo);

  return todo;
}

function toggleTodoCompleteService(id) {
  const todo = findTodoById(id);

  if (!todo) {
    return null;
  }

  todo.completed = !todo.completed;

  return todo;
}

function deleteTodoService(id) {
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return null;
  }

  const [deletedTodo] = todos.splice(todoIndex, 1);

  return deletedTodo;
}

module.exports = {
  findTodoById,
  getAllTodos,
  createTodoService,
  toggleTodoCompleteService,
  deleteTodoService
};
