import { useNotesStore } from '../stores/notes-store';
import UnlockNoteForm from './unlock-note-form';

import type { EditableNote } from '../stores/notes-store';

function TextEditor({ note }: { note: EditableNote }) {
  const changeNoteText = useNotesStore((state) => state.changeNoteText);

  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = ev.target.value;
    changeNoteText(note.id, text);
  };

  return (
    <textarea
      aria-label="note editor"
      value={note.data}
      onChange={handleChange}
      spellCheck="true"
      className="w-full p-4 bg-transparent outline-none resize-none"
    />
  );
}

export default function NoteContent() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);

  if (currentNote.type === 'encrypted') {
    return <UnlockNoteForm note={currentNote} />;
  }

  return <TextEditor note={currentNote} />;
}
