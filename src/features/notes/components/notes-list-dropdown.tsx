import { useState, useEffect } from 'react';
import useOutsideClick from '../hooks/use-outside-click';
import { useNotesStore } from '../stores/notes-store';
import NotesList from './notes-list';
import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';

export default function NotesListDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);

  const toggle = () => setIsExpanded((prev) => !prev);
  const close = () => setIsExpanded(false);

  useEffect(close, [currentNote]);
  const containerRef = useOutsideClick(close);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="px-2 py-1 w-full flex gap-2 justify-between items-center"
      >
        <div className="w-4">
          <DropdownIcon />
        </div>
        <span className="w-32 capitalize overflow-hidden whitespace-nowrap text-left text-ellipsis">
          {currentNote.title}
        </span>
      </button>
      {isExpanded && (
        <div className="absolute left-2 max-h-96 shadow-md rounded-md z-20 bg-zinc-900 overflow-y-auto px-1">
          <NotesList />
        </div>
      )}
    </div>
  );
}
