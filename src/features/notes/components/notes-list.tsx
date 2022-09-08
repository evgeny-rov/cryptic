import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import type { NoteId } from '../stores/notes-store';

const NoteListItem = ({ id }: { id: NoteId }) => {
  const currentNote = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => state.selectNote);

  return (
    <li className="h-9">
      <button
        type="button"
        className={`h-full w-full px-1 flex items-center gap-3 hover:opacity-100 cursor-pointer ${
          isSelected ? '' : 'opacity-50'
        }`}
        onClick={() => selectNote(id)}
      >
        <div className="w-3.5 grid place-items-center">
          {currentNote.type === 'plain' && !currentNote.credentials ? (
            <span className="w-2.5 text-xl text-center">{'•'}</span>
          ) : (
            <PrivateIcon className="w-3" />
          )}
        </div>
        <span className="w-44 capitalize overflow-hidden whitespace-nowrap text-left text-ellipsis">
          {currentNote.title}
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
