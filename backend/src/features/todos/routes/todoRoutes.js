const express = require('express');
const todoController = require('../controllers/todoController');
const {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId
} = require('../validators/todoValidators');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(todoController.listTodos));
router.get('/:id', validateTodoId, asyncHandler(todoController.getTodoById));
router.post('/', validateCreateTodo, asyncHandler(todoController.createTodo));
router.put(
  '/:id',
  validateTodoId,
  validateUpdateTodo,
  asyncHandler(todoController.updateTodo)
);
router.patch(
  '/:id/complete',
  validateTodoId,
  asyncHandler(todoController.completeTodo)
);
router.delete('/:id', validateTodoId, asyncHandler(todoController.deleteTodo));

module.exports = router;
