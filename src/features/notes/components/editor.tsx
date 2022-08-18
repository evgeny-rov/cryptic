import { useNotesStore } from '../stores/notes-store';

export default function Editor() {
  const note = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const updateNote = useNotesStore((state) => state.updateNote);

  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { ...note, data: ev.target.value });
  };

  return (
    <textarea
      value={note.data}
      onChange={handleChange}
      className="p-6 w-full h-full bg-transparent outline-none resize-none"
    />
  );
}
