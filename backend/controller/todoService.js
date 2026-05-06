const {
  findTodoById,
  getAllTodos,
  createTodoService,
  toggleTodoCompleteService,
  deleteTodoService
} = require('../service/todoService');

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

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const todo = createTodoService({ title, completed });

  res.status(201).json(todo);
}

function completeTodo(req, res) {
  const { id } = req.params;
  const todoId = Number(id);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const todo = toggleTodoCompleteService(todoId);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
}

function deleteTodo(req, res) {
  const { id } = req.params;
  const todoId = Number(id);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const todo = deleteTodoService(todoId);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
}

module.exports = { findTodoById, getAllTodos, getTodoById, createTodo, completeTodo, deleteTodo };
