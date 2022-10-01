import { EditableNote, useNotesStore } from '../stores/notes-store';

export default function NoteEditor({ note }: { note: EditableNote }) {
  const changeNoteText = useNotesStore((state) => state.changeNoteText);

  return (
    <textarea
      aria-label="note editor"
      value={note.data}
      onChange={(ev) => changeNoteText(note.id, ev.target.value)}
      spellCheck="true"
      className="w-full h-full p-4 bg-transparent outline-none resize-none"
    />
  );
}
