import { useNotesStore } from '../stores/notes-store';

export default function Toolbar() {
  const createNote = useNotesStore((state) => state.createNote);

  return (
    <div className="h-full w-full py-3 rounded-md flex flex-col bg-[#202023] border-2 border-zinc-800">
      <div className="grid place-items-center gap-4">
        <button className="grid place-items-center w-full h-3.5" type="button" onClick={createNote}>
          a
        </button>
      </div>
    </div>
  );
}
