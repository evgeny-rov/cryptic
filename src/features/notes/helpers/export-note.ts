import { encrypt } from '../../crypto';
import { promptExport } from '../../files';
import type { ExternalNote, Note } from '../stores/notes-store';

export default async (note: Note) => {
  const currentDate = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const name = note.title || 'Untitled Note';

  const filename = `${name} - ${currentDate}.cryptic`;

  if (note.type === 'unlocked') {
    const cipher = await encrypt(note.data, note.credentials);
    const exportedNote: ExternalNote = { type: 'encrypted', data: cipher, title: note.title };

    promptExport(filename, JSON.stringify(exportedNote));
  } else {
    promptExport(filename, JSON.stringify(note));
  }
};
