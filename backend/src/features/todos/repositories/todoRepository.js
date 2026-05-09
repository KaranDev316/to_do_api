const todos = [
  {
    id: 1,
    title: 'Learn Express',
    description: 'Practice routing, middleware, and controllers.',
    completed: false,
    createdAt: '2026-05-08T09:00:00.000Z'
  },
  {
    id: 2,
    title: 'Build API',
    description: 'Create todo endpoints for the frontend app.',
    completed: false,
    createdAt: '2026-05-08T10:00:00.000Z'
  }
];

let nextTodoId = Math.max(...todos.map((todo) => todo.id), 0) + 1;

async function findAll() {
  return todos;
}

async function findById(id) {
  return todos.find((todo) => todo.id === id) || null;
}

async function create(data) {
  const todo = {
    id: nextTodoId,
    title: data.title,
    description: data.description ?? '',
    completed: data.completed ?? false,
    createdAt: new Date().toISOString()
  };

  nextTodoId += 1;
  todos.push(todo);

  return todo;
}

async function update(id, data) {
  const todo = await findById(id);

  if (!todo) {
    return null;
  }

  Object.assign(todo, data);
  return todo;
}

async function remove(id) {
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return null;
  }

  const [deletedTodo] = todos.splice(todoIndex, 1);
  return deletedTodo;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
