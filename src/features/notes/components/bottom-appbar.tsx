import { useState } from 'react';
import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as MenuIcon } from '../assets/menu.svg';
import useOutsideClick from '../hooks/use-outside-click';
import NotesList from './notes-list';
import Tools from './tools';
import NoteTitle from './note-title';

export default function BottomAppbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);

  const toggle = () => setIsExpanded((state) => !state);
  const close = () => setIsExpanded(false);

  const menuRef = useOutsideClick<HTMLDivElement>(close, isExpanded);

  return (
    <div ref={menuRef} className="flex md:hidden flex-col justify-between max-h-[40vh] space-y-1">
      <div className="flex items-center">
        <div className="px-4 flex flex-grow">
          <NoteTitle note={currentNote} editable={true} />
        </div>
        <button className="px-4 py-5" type="button" onClick={toggle}>
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
