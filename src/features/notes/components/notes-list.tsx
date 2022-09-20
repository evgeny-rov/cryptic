import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { ReactComponent as AccessIcon } from '../assets/access.svg';

import type { Note } from '../stores/notes-store';
import classNames from 'classnames';
import NoteTitle from './note-title';

const NoteListItem = ({ id }: { id: Note['id'] }) => {
  const currentNote = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => () => state.selectNote(id));

  return (
    <li>
      <button
        type="button"
        className={classNames(
          'flex items-center px-3 py-1 space-x-2 rounded-md w-full opacity-50',
          'hover:opacity-100 focus-visible:opacity-100',
          { 'bg-zinc-800 opacity-100': isSelected }
        )}
        onClick={selectNote}
      >
        <div className="w-3 grid place-items-center text-md text-center">
          {currentNote.type === 'plain' && <span>{'•'}</span>}
          {currentNote.type === 'unlocked' && <AccessIcon />}
          {currentNote.type === 'encrypted' && <PrivateIcon />}
        </div>
        <NoteTitle note={currentNote} editable={isSelected} />
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
