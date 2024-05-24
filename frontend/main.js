document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const noteText = document.getElementById('note-text');
    const notesList = document.getElementById('notes-list');
  
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:7000/notes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const notes = await response.json();
        if (!Array.isArray(notes)) {
          throw new Error('Response is not an array');
        }
        notesList.innerHTML = '';
        notes.forEach(note => {
          const listItem = document.createElement('li');
          listItem.textContent = note.text;
          listItem.dataset.id = note.id;
          listItem.appendChild(createDeleteButton(note.id));
          notesList.appendChild(listItem);
        });
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
  
    const createDeleteButton = (id) => {
      const button = document.createElement('button');
      button.textContent = 'Delete';
      button.addEventListener('click', async () => {
        try {
          await fetch(`http://localhost:7000/notes/${id}`, { method: 'DELETE' });
          fetchNotes();
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      });
      return button;
    };
  
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = noteText.value;
      try {
        await fetch('http://localhost:7000/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        });
        noteText.value = '';
        fetchNotes();
      } catch (error) {
        console.error('Error adding note:', error);
      }
    });
  
    fetchNotes();
  });
  