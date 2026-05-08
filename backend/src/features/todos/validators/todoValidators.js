const MAX_TITLE_LENGTH = 120;

function validateTodoId(req, res, next) {
  const todoId = Number(req.params.id);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  req.todoId = todoId;
  return next();
}

function validateCreateTodo(req, res, next) {
  const { title, completed } = req.body;
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';

  if (!trimmedTitle) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Todo title must be ${MAX_TITLE_LENGTH} characters or fewer`
    });
  }

  req.validatedTodo = {
    title: trimmedTitle,
    completed
  };

  return next();
}

module.exports = {
  validateTodoId,
  validateCreateTodo
};
