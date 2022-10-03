import { Note } from '../stores/notes-store';

export default (note: Note) => {
  if (note.type === 'encrypted') {
    return 'Untitled Note';
  }

  return note.data.slice(0, 100) || 'Untitled Note';
};
