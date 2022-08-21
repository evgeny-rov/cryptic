import { useNotesStore } from '../stores/notes-store';
import type { NoteId } from '../stores/notes-store';

const NoteListItem = ({ id }: { id: NoteId }) => {
  const note = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => state.selectNote);

  const notePreviewText = note.data.trim().split(/\r?\n/)[0];

  return (
    <li className="h-9">
      <button
        onClick={() => selectNote(id)}
        className={`w-full h-full px-3 flex items-center gap-4 rounded-md hover:opacity-100 ${
          isSelected ? 'bg-[#202023]' : 'opacity-50'
        }`}
        type="button"
      >
        <span className="text-xl">{'•'}</span>
        <span className="w-44 text-left capitalize overflow-hidden whitespace-nowrap text-ellipsis">
          {notePreviewText || 'Empty note'}
        </span>
      </button>
    </li>
  );
};

export default function NotesList() {
  const notesIds = useNotesStore((state) => state.allIds);

  return (
    <div className="bg-[#202023] p-2 rounded-md overflow-y-auto border-2 border-zinc-800">
      <ul>
        {notesIds.map((id) => (
          <NoteListItem key={id} id={id} />
        ))}
      </ul>
    </div>
  );
}
