import { Note } from '../stores/notes-store';

export default (note: Note) => {
  if (note.type === 'encrypted') {
    return 'Untitled Note';
  }

  const slice = note.data.trim().slice(0, 100).replaceAll('\n', ' ');

  if (slice) return slice;

  return 'Untitled Note';
};
