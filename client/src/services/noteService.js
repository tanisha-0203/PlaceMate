import api from './api';

const noteService = {
<<<<<<< HEAD
  // Get all notes
  getNotes: async () => {
    const response = await api.get('/notes');
=======
  // Get notes with optional query filters
  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
>>>>>>> c76f504 (updating changes)
    return response.data;
  },

  // Create a new note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Update a note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
<<<<<<< HEAD
  }
=======
  },
>>>>>>> c76f504 (updating changes)
};

export default noteService;
