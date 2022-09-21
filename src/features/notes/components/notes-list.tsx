import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
import NoteTitle from './note-title';
import type { Note } from '../stores/notes-store';

const NoteListItem = ({ id }: { id: Note['id'] }) => {
  const currentNote = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => () => state.selectNote(id));

  return (
    <li>
      <button
        title="select note"
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
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const firstNote = notesIds[0];
    if (!firstNote || !listRef.current) return;

    const shouldScrollToTop = firstNote === selectedNoteId;

    if (shouldScrollToTop) listRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [notesIds, selectedNoteId]);

  return (
    <ul ref={listRef}>
      {notesIds.map((id) => (
        <NoteListItem key={id} id={id} />
      ))}
    </ul>
  );
}
