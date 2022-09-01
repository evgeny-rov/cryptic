import { useEffect, useState } from 'react';
import { ReactComponent as CreateIcon } from '../assets/create.svg';
import { ReactComponent as ImportIcon } from '../assets/import.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as AccessIcon } from '../assets/access.svg';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';

import { encrypt } from '../../crypto';
import { useNotesStore } from '../stores/notes-store';
import { parseFiles, parseNotes, promptExport, promptImport } from '../stores/file-store';
import { useNoteAccessDialog } from '../stores/dialogs-store';
import useOutsideClick from '../hooks/use-outside-click';

import Menu from './menu';
import TBButton from './tb-button';

export default function Toolbar() {
  const createNewNote = useNotesStore((state) => state.createNewNote);
  const deleteNote = useNotesStore((state) => () => state.deleteNote(state.selectedNoteId));
  const changeNote = useNotesStore((state) => state.changeNote);
  const addExternalNote = useNotesStore((state) => state.addExternalNote);
  const noteAccessDialog = useNoteAccessDialog();
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => () => setIsMenuOpen(false), [currentNote]);

  const privacyMenuOptions = ['lock note', 'change password', 'remove lock'] as const;

  const toggleAccessMenu = () => setIsMenuOpen((isOpen) => !isOpen);
  const closeAccessMenu = () => setIsMenuOpen(false);
  const menuWrapperRef = useOutsideClick(closeAccessMenu);

  const handleImport = async () => {
    const pickedFiles = await promptImport();
    const maybeSerializedNotes = await parseFiles(pickedFiles);
    const importedNotes = parseNotes(maybeSerializedNotes);
    importedNotes.successful.forEach(addExternalNote);
  };

  const handleExport = async () => {
    if (currentNote.type === 'plain' && currentNote.credentials) {
      const cipher = await encrypt(currentNote.data, currentNote.credentials);
      promptExport({
        id: currentNote.id,
        type: 'encrypted',
        title: currentNote.title,
        data: cipher,
      });
    } else {
      promptExport(currentNote);
    }
  };

  const handleAccessMenuOption = async (option: typeof privacyMenuOptions[number]) => {
    if (currentNote.type === 'encrypted' || !currentNote.credentials) return;

    switch (option) {
      case 'lock note': {
        const cipher = await encrypt(currentNote.data, currentNote.credentials);
        changeNote(currentNote.id, { type: 'encrypted', title: currentNote.title, data: cipher });
        break;
      }
      case 'change password': {
        noteAccessDialog.open();
        break;
      }
      case 'remove lock': {
        const { credentials, ...noteData } = currentNote;
        changeNote(currentNote.id, noteData);
        break;
      }
    }

    closeAccessMenu();
  };

  const handleManageAccessClick = () => {
    if (currentNote.type === 'encrypted') return;

    if (currentNote.credentials && !noteAccessDialog.isOpen) {
      toggleAccessMenu();
    } else {
      noteAccessDialog.toggle();
    }
  };

  return (
    <div className="w-full h-full rounded-md flex flex-col gap-4 py-2 bg-[#202023] border-2 border-zinc-800">
      <div className="flex flex-col gap-2">
        <TBButton title="Create Note" onClick={createNewNote}>
          <CreateIcon />
        </TBButton>
        <TBButton title="Remove Note" onClick={deleteNote}>
          <RemoveIcon />
        </TBButton>
      </div>
      <div ref={menuWrapperRef} className="relative flex flex-col">
        <TBButton
          title="Manage Access"
          disabled={currentNote.type === 'encrypted'}
          onClick={handleManageAccessClick}
        >
          <AccessIcon />
        </TBButton>
        <Menu<typeof privacyMenuOptions>
          isOpen={isMenuOpen}
          options={privacyMenuOptions}
          onOptionClick={handleAccessMenuOption}
        />
      </div>
      <div className="flex flex-col gap-2">
        <TBButton title="Import Notes" onClick={handleImport}>
          <ImportIcon />
        </TBButton>
        <TBButton title="Export Note" onClick={handleExport}>
          <ExportIcon />
        </TBButton>
      </div>
    </div>
  );
}
