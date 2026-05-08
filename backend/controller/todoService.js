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
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  res.status(200).json({
    success: true,
    data: todo
  });
}

function createTodo(req, res) {
  const { title, completed } = req.body;
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';

  if (!trimmedTitle) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  if (trimmedTitle.length > 120) {
    return res.status(400).json({
      success: false,
      message: 'Todo title must be 120 characters or fewer'
    });
  }

  const todo = createTodoService({ title: trimmedTitle, completed });

  res.status(201).json({
    success: true,
    data: todo
  });
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
