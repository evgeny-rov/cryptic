import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { ReactComponent as AccessIcon } from '../assets/access.svg';

import type { Note } from '../stores/notes-store';

const NoteListItem = ({ id }: { id: Note['id'] }) => {
  const currentNote = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => state.selectNote);

  return (
    <li>
      <button
        type="button"
        className={`px-3 py-2 flex items-center gap-3 hover:opacity-100 focus:opacity-100 ${
          isSelected ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => selectNote(id)}
      >
        <div className="w-3 grid place-items-center text-md text-center">
          {currentNote.type === 'plain' && <span>{'•'}</span>}
          {currentNote.type === 'unlocked' && <AccessIcon />}
          {currentNote.type === 'encrypted' && <PrivateIcon />}
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
    <ul>
      {notesIds.map((id) => (
        <NoteListItem key={id} id={id} />
      ))}
    </ul>
  );
}
