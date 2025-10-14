import { Note } from '../stores/notes-store';

export default (note: Note) => {
  if (note.type === 'encrypted') {
    return 'Untitled Note';
  }

  const slice = note.data.slice(0, 100);
  const lines = slice.split('\n');
  const firstNonEmptyLine = lines.find((line) => line.trim().length > 0);

  if (firstNonEmptyLine) return firstNonEmptyLine;
  else if (slice.trim().length > 0) return slice;

  return 'Untitled Note';
};
