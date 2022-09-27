import { useState } from 'react';
import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as MenuIcon } from '../assets/menu.svg';
import useOutsideClick from '../hooks/use-outside-click';
import NotesList from './notes-list';
import Tools from './tools';
import NoteTitle from './note-title';
import derivePlaceholderTitle from '../helpers/derive-placeholder-title';

export default function BottomAppbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const changeTitle = useNotesStore((state) => state.changeNoteTitle);

  const handleChangeTitle = (text: string) => changeTitle(currentNote.id, text);

  const toggle = () => setIsExpanded((state) => !state);
  const close = () => setIsExpanded(false);

  const menuRef = useOutsideClick<HTMLDivElement>(close, isExpanded);

  return (
    <div ref={menuRef} className="flex md:hidden flex-col justify-between max-h-[40vh] space-y-1">
      <div className="flex items-center">
        <div className="px-4 flex flex-grow">
          <NoteTitle
            value={currentNote.title}
            onChange={handleChangeTitle}
            placeholder={derivePlaceholderTitle(currentNote)}
            disabled={currentNote.type === 'encrypted'}
          />
        </div>
        <button title="menu" className="px-4 py-5" type="button" onClick={toggle}>
          <MenuIcon className="w-5" />
        </button>
      </div>
      {isExpanded && (
        <div className="px-2 overflow-y-auto">
          <NotesList />
        </div>
      )}
      {isExpanded && (
        <div className="flex justify-evenly p-2">
          <Tools />
        </div>
      )}
    </div>
  );
}
