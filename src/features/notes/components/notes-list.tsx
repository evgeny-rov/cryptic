import { useEffect, useRef } from 'react';
import clsx from 'clsx';
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
      onClick={selectNote}
      className={clsx(
        'relative rounded-md text-zinc-400 hover:text-current',
        isSelected && 'text-current bg-zinc-800'
      )}
    >
      <button className="absolute inset-[2px] rounded-md" />

      <div className="relative flex pl-2 space-x-1 transition-colors">
        <div className="relative w-3 grid place-items-center text-md text-center">
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

    const isNewNoteAdded = firstNote === selectedNoteId;

    if (isNewNoteAdded) listRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [notesIds, selectedNoteId]);

  return (
    <ul ref={listRef}>
      {notesIds.map((id) => (
        <NoteListItem key={id} id={id} note={notes[id]} isSelected={id === selectedNoteId} />
      ))}
    </ul>
  );
}
