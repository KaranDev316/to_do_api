const todoRepository = require('../repositories/todoRepository');

async function getAllTodos() {
  return todoRepository.findAll();
}

async function getTodoById(id) {
  return todoRepository.findById(id);
}

async function createTodo(data) {
  return todoRepository.create({
    title: data.title,
    description: data.description,
    completed: data.completed
  });
}

async function toggleTodoComplete(id) {
  const todo = await todoRepository.findById(id);

  if (!todo) {
    return null;
  }

  return todoRepository.update(id, {
    completed: !todo.completed
  });
}

async function updateTodo(id, data) {
  return todoRepository.update(id, {
    completed: data.completed
  });
}

async function deleteTodo(id) {
  return todoRepository.remove(id);
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  toggleTodoComplete,
  updateTodo,
  deleteTodo
};
