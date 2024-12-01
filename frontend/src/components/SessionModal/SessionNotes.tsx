import { useState } from 'react';
import NoteBulletPoint from './NoteBulletPoint';
import { Note } from '../../types/api';

interface SessionNotesProps {
  notes: Note[];
  onChange: (notes: Note[]) => void;
}

const SessionNotes = ({ notes, onChange }: SessionNotesProps) => {
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const addNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: ''
    };
    setLastAddedId(newNote.id);
    onChange([newNote, ...notes]);
  };

  const updateNote = (id: string, content: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, content } : note
    );
    onChange(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    onChange(updatedNotes);
    if (lastAddedId === id) {
      setLastAddedId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">Session Notes</h3>
        <div className="flex justify-end">
          <button
            onClick={addNewNote}
            className="w-10 h-10 text-2xl font-semibold bg-[rgb(37,150,190)] text-white rounded-full hover:bg-[rgb(27,140,180)] transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
        {notes.map(note => (
          <NoteBulletPoint
            key={note.id}
            content={note.content}
            onChange={(content) => updateNote(note.id, content)}
            onDelete={() => deleteNote(note.id)}
            autoFocus={note.id === lastAddedId}
            onCreateNew={addNewNote}
          />
        ))}
        {notes.length === 0 && (
          <div className="text-gray-400 text-center py-4">
            Click + to add a new note
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionNotes;
