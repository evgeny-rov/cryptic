import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
import { useNotesStore } from '../stores/notes-store';
import NoteTitle from './note-title';
import derivePlaceholderTitle from '../helpers/derive-placeholder-title';

import type { Note } from '../stores/notes-store';

const NoteListItem = ({
  id,
  note,
  isSelected,
}: {
  id: Note['id'];
  note: Note;
  isSelected: boolean;
}) => {
  const selectNote = useNotesStore((state) => () => state.selectNote(id));
  const changeTitle = useNotesStore((state) => state.changeNoteTitle);

  const handleChangeTitle = (text: string) => changeTitle(note.id, text);

  return (
    <li
      className={classNames(
        'relative group text-zinc-400 hover:text-current focus-within:text-current',
        {
          'text-current': isSelected,
        }
      )}
    >
      {isSelected && <div className="absolute inset-0 bg-zinc-800 rounded-md" />}

      <button
        title="Select Note"
        type="button"
        onClick={selectNote}
        className={classNames('absolute w-full inset-0 rounded-md', { 'z-10': !isSelected })}
      />

      <div className="relative flex">
        <div className="relative px-2 w-7 grid place-items-center text-md text-center">
          {note.type === 'plain' && <span>{'•'}</span>}
          {note.type === 'unlocked' && <AccessIcon />}
          {note.type === 'encrypted' && <PrivateIcon />}
        </div>
        <NoteTitle
          value={note.title}
          onChange={handleChangeTitle}
          placeholder={derivePlaceholderTitle(note)}
          disabled={!isSelected || note.type === 'encrypted'}
        />
      </div>
    </li>
  );
};

export default function NotesList() {
  const notesIds = useNotesStore((state) => state.allIds);
  const notes = useNotesStore((state) => state.byId);
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
        <NoteListItem key={id} id={id} note={notes[id]} isSelected={id === selectedNoteId} />
      ))}
    </ul>
  );
}
