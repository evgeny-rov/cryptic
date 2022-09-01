import { PlainNote, useNotesStore } from '../stores/notes-store';
import deriveNoteTitle from '../utils/derive-note-title';

export default function TextEditor({ note }: { note: PlainNote }) {
  const changeNote = useNotesStore((state) => state.changeNote);

  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = ev.target.value;
    changeNote(note.id, { ...note, title: deriveNoteTitle(text), data: text });
  };

  return (
    <textarea
      value={note.data}
      onChange={handleChange}
      className="p-6 w-full h-full bg-transparent outline-none resize-none"
    />
  );
}
