import useOutsideClick from '../hooks/use-outside-click';
import TBButton from './tb-button';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
import { useState } from 'react';
import { useNotesStore } from '../stores/notes-store';
import { useUiStore } from '../stores/ui-store';

export default function AccessMenu({ disabled }: { disabled: boolean }) {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const removeLock = useNotesStore((state) => state.removeLock);
  const openLockPopover = useUiStore((state) => state.openLockPopover);
  const lockNote = useNotesStore((state) => state.lockNote);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggle = () => setIsMenuOpen((prev) => !prev);
  const close = () => setIsMenuOpen(false);

  const containerRef = useOutsideClick(close);

  const options = ['lock note', 'change password', 'remove lock'] as const;

  const handleOptionClick = (option: typeof options[number]) => {
    if (currentNote.type !== 'unlocked') return;

    switch (option) {
      case 'lock note': {
        lockNote(currentNote);
        break;
      }
      case 'change password': {
        openLockPopover();
        break;
      }
      case 'remove lock': {
        removeLock(currentNote);
        break;
      }
    }

    close();
  };

  return (
    <div className="relative" ref={containerRef}>
      <TBButton title="Manage Access" disabled={disabled} onClick={toggle}>
        <AccessIcon />
      </TBButton>
      {isMenuOpen && (
        <div className="absolute -left-14 top-full rounded-md z-20 bg-zinc-900 shadow-md grid overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 capitalize text-sm text-left opacity-50 hover:opacity-100 focus:opacity-100 whitespace-nowrap"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
