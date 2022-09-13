import { useState } from 'react';
import { ReactComponent as CreateIcon } from '../assets/create.svg';
import { ReactComponent as ImportIcon } from '../assets/import.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';

import { useNotesStore } from '../stores/notes-store';
import { useUiStore } from '../stores/ui-store';

import Menu from './menu';
import TBButton from './tb-button';
import promptImportNotes from '../helpers/prompt-import-notes';
import exportNote from '../helpers/export-note';

export default function Toolbar() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNewNote = useNotesStore((state) => state.createNewNote);
  const deleteCurrentNote = useNotesStore((state) => () => state.deleteNote(currentNote.id));
  const lockNote = useNotesStore((state) => state.lockNote);
  const removeLock = useNotesStore((state) => state.removeLock);
  const importNotes = useNotesStore((state) => state.importNotes);
  const openLockPopover = useUiStore((state) => state.openLockPopover);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const privacyMenuOptions = ['lock note', 'change password', 'remove lock'] as const;
  const toggleAccessMenu = () => setIsMenuOpen((isOpen) => !isOpen);
  const closeAccessMenu = () => setIsMenuOpen(false);

  const handleImportNotes = async () => {
    const parsedNotes = await promptImportNotes();
    importNotes(parsedNotes.successful);
  };

  const handleAccessMenuClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (currentNote.type !== 'unlocked') return;
    toggleAccessMenu();
    ev.stopPropagation();
  };

  const handleMenuOptionClick = async (option: typeof privacyMenuOptions[number]) => {
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

    closeAccessMenu();
  };

  return (
    <>
      <div className="mt-2 flex flex-col gap-2">
        <TBButton title="Create Note" onClick={createNewNote}>
          <CreateIcon />
        </TBButton>
        <TBButton title="Remove Note" onClick={deleteCurrentNote}>
          <RemoveIcon />
        </TBButton>
      </div>
      <div className="relative flex flex-col">
        {currentNote.type === 'plain' ? (
          <TBButton title="Lock Note" onClick={openLockPopover}>
            <LockIcon />
          </TBButton>
        ) : (
          <TBButton
            title="Manage Access"
            disabled={currentNote.type === 'encrypted'}
            onClick={handleAccessMenuClick}
          >
            <AccessIcon />
          </TBButton>
        )}
        {isMenuOpen && (
          <Menu<typeof privacyMenuOptions>
            onClose={closeAccessMenu}
            options={privacyMenuOptions}
            onOptionClick={handleMenuOptionClick}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <TBButton title="Import Notes" onClick={handleImportNotes}>
          <ImportIcon />
        </TBButton>
        <TBButton title="Export Note" onClick={() => exportNote(currentNote)}>
          <ExportIcon />
        </TBButton>
      </div>
    </>
  );
}
