const express = require('express');

const app = express();

app.use(express.json());

const todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build API', completed: false }
];

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Todos:', todos);
});
