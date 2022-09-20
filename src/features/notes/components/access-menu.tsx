import { useState } from 'react';
import classNames from 'classnames';
import useOutsideClick from '../hooks/use-outside-click';
import ToolButton from './tool-button';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
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

  const containerRef = useOutsideClick<HTMLDivElement>(close, isMenuOpen);

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
      <ToolButton title="Manage Access" disabled={disabled} onClick={toggle}>
        <AccessIcon />
      </ToolButton>
      {isMenuOpen && (
        <div
          className={classNames(
            'absolute bottom-full bg-zinc-800 -left-14 rounded-md z-20 shadow-md grid overflow-hidden',
            'md:bottom-auto md:bg-zinc-900'
          )}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={classNames(
                'px-4 py-2 capitalize text-sm text-left opacity-50 whitespace-nowrap',
                'hover:opacity-100 focus:opacity-100'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
