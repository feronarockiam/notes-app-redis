const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('redis');
const path = require('path');
const notesRoutes = require('./routes/notes');
const indexRoutes = require('./routes/index');

const app = express();
const client = createClient();

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

client.connect().then(() => {
  console.log('Connected to Redis');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Serve frontend files
  app.use('/index', indexRoutes);
  app.use('/notes', notesRoutes(client));

  // Serve static files
  app.use(express.static(path.join(__dirname, '../frontend')));

  app.listen(7000, () => {
    console.log('Server is running on port 7000');
  });
}).catch((err) => {
  console.error('Could not connect to Redis:', err);
});
