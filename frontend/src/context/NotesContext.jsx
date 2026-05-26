import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../lib/api';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getNotes();
      setNotes(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (data) => {
    const res = await api.createNote(data);
    const note = res.data.data;
    setNotes(prev => [note, ...prev]);
    return note;
  };

  const editNote = async (id, data) => {
    const res = await api.updateNote(id, data);
    const updated = res.data.data;
    setNotes(prev => prev.map(n => n._id === id ? updated : n));
    return updated;
  };

  const removeNote = async (id) => {
    await api.deleteNote(id);
    setNotes(prev => prev.filter(n => n._id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, loading, fetchNotes, addNote, editNote, removeNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
