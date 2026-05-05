const express = require('express');
const { findTodoById, getAllTodos } = require('./controller/todoService');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

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

app.get('/todos', (req, res) => {
  console.log('GET /todos route hit');
  const todoList = getAllTodos();
  console.log(`Returning ${todoList.length} todos`);
  res.status(200).json(todoList);
});

app.get('/todos/:id', getTodoById);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
