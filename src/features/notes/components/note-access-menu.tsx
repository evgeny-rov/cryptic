import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
import useOutsideClick from '../hooks/use-outside-click';
import ToolButton from './notes-tool-button';

import { UnlockedNote, useNotesStore } from '../stores/notes-store';
import { lockingStateAtom } from '../stores/ui-atoms';

export default function NoteAccessMenu({ disabled }: { disabled: boolean }) {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const removeLock = useNotesStore((state) => state.removeLock);
  const lockNote = useNotesStore((state) => state.lockNote);
  const [, setIsLocking] = useAtom(lockingStateAtom);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggle = () => setIsMenuOpen((prev) => !prev);
  const close = () => setIsMenuOpen(false);

  const containerRef = useOutsideClick<HTMLDivElement>(close, isMenuOpen);

  const options = ['lock note', 'change password', 'remove lock'] as const;

  const handleOptionClick = (option: typeof options[number]) => {
    if (currentNote.type !== 'unlocked') return;

    const handlers: Record<typeof option, (note: UnlockedNote) => void> = {
      'lock note': lockNote,
      'change password': () => setIsLocking(true),
      'remove lock': removeLock,
    };

    handlers[option](currentNote);
    close();
  };

  return (
    <div className="relative" ref={containerRef}>
      <ToolButton title="Manage Access" disabled={disabled} onClick={toggle}>
        <AccessIcon className="h-4 w-4" />
      </ToolButton>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'absolute bg-zinc-900 border border-zinc-800 -left-14 rounded-md z-20 shadow-xl grid'
          )}
        >
          {options.map((option) => (
            <button
              key={option}
              title={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={clsx(
                'px-4 py-2 transition-colors capitalize text-sm text-left whitespace-nowrap',
                'text-zinc-400 hover:text-current focus:text-current'
              )}
            >
              {option}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
