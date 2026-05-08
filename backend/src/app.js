const express = require('express');
const todoRoutes = require('./features/todos/routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/todos', todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
