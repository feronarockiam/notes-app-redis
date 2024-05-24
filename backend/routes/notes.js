const express = require('express');
const router = express.Router();

module.exports = (client) => {
  router.get('/', async (req, res) => {
    try {
      console.log('Fetching notes...');
      const keys = await client.keys('*');
      if (keys.length === 0) {
        console.log('No keys found.');
        return res.send([]);
      }
      console.log("notes.js fetching.....", keys);

      const multi = client.multi();
      keys.forEach(key => multi.get(key));
      const values = await multi.exec();

      console.log('Keys:', keys);
      console.log('Values:', values);
      const notes = keys.map((key, index) => ({
        id: key,
        text: values[index]
      }));
      console.log("logging.... notes", notes);
      res.send(notes);
    } catch (err) {
      console.error('Error fetching notes:', err);
      res.status(500).send({ error: 'Failed to fetch notes' });
    }
  });

  router.post('/', async (req, res) => {
    const id = `note:${Date.now()}`;
    const { text } = req.body;

    try {
      console.log('Adding note:', text);
      await client.set(id, text);
      const savedNote = await client.get(id);
      console.log('Saved note:', savedNote);
      res.status(201).send({ id, text });
    } catch (err) {
      console.error('Error adding note:', err);
      res.status(500).send({ error: 'Failed to add note' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      console.log('Deleting note with id:', id);
      await client.del(id);
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting note:', err);
      res.status(500).send({ error: 'Failed to delete note' });
    }
  });

  return router;
};
