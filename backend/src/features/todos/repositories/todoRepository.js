const todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build API', completed: false }
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
    completed: data.completed ?? false
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
