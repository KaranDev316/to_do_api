const todoService = require('../services/todoService');

async function listTodos(req, res) {
  const todoList = await todoService.getAllTodos();

  res.status(200).json({
    success: true,
    data: todoList
  });
}

async function getTodoById(req, res) {
  const todo = await todoService.getTodoById(req.todoId);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: todo
  });
}

async function createTodo(req, res) {
  const todo = await todoService.createTodo(req.validatedTodo);

  res.status(201).json({
    success: true,
    data: todo
  });
}

async function completeTodo(req, res) {
  const todo = await todoService.toggleTodoComplete(req.todoId);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
}

async function deleteTodo(req, res) {
  const todo = await todoService.deleteTodo(req.todoId);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
}

module.exports = {
  listTodos,
  getTodoById,
  createTodo,
  completeTodo,
  deleteTodo
};
