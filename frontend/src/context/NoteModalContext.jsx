import { createContext, useContext, useState, useCallback } from 'react';
import NoteModal from '../components/NoteModal';

const NoteModalContext = createContext(null);

export function NoteModalProvider({ children }) {
  const [modalNote, setModalNote] = useState(null);   // null = closed, undefined = new, object = edit
  const [isOpen, setIsOpen]       = useState(false);

  const openNewNote = useCallback(() => {
    setModalNote(undefined);
    setIsOpen(true);
  }, []);

  const openEditNote = useCallback((note) => {
    setModalNote(note);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalNote(null);
  }, []);

  return (
    <NoteModalContext.Provider value={{ openNewNote, openEditNote }}>
      {children}
      {isOpen && <NoteModal note={modalNote} onClose={closeModal} />}
    </NoteModalContext.Provider>
  );
}

export const useNoteModal = () => useContext(NoteModalContext);
