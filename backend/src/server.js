const app = require('./app');
const { PORT } = require('./config/env');
const { connectDatabase } = require('./database');

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
