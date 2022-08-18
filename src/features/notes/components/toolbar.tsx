import { useNotesStore } from '../stores/notes-store';

export default function Toolbar() {
  const createNote = useNotesStore((state) => state.createNote);

  return (
    <div className="h-full w-full px-6 bg-[#28282c]">
      <button type="button" onClick={createNote}>
        add
      </button>
    </div>
  );
}
