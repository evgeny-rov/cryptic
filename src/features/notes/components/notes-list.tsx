import { useNotesStore } from '../stores/notes-store';
import type { NoteId } from '../stores/notes-store';

const NoteListItem = ({ id }: { id: NoteId }) => {
  const note = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => state.selectNote);

  const notePreviewText = note.data.trim().split(/\r?\n/)[0];

  return (
    <li className="h-10">
      <button
        onClick={() => selectNote(id)}
        className={`w-full h-full px-4 flex items-center gap-4 hover:bg-[#252528] ${
          isSelected ? 'bg-[#252528]' : ''
        }`}
        type="button"
      >
        <div className="w-[5px] h-[5px] bg-white rounded-[50%]" />
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
    <div>
      <ul>
        {notesIds.map((id) => (
          <NoteListItem key={id} id={id} />
        ))}
      </ul>
    </div>
  );
}
