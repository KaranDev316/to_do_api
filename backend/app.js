const express = require('express');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  completeTodo,
  deleteTodo
} = require('./controller/todoService');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/todos', (req, res) => {
  console.log('GET /todos route hit');
  const todoList = getAllTodos();
  console.log(`Returning ${todoList.length} todos`);
  res.status(200).json({
    success: true,
    data: todoList
  });
}); 

app.get('/todos/:id', getTodoById);
app.post('/todos', createTodo);
app.patch('/todos/:id/complete', completeTodo);
app.delete('/todos/:id', deleteTodo);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
