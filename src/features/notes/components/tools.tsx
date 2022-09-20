import { ReactComponent as CreateIcon } from '../assets/create.svg';
import { ReactComponent as ImportIcon } from '../assets/import.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';

import { useNotesStore } from '../stores/notes-store';
import { useUiStore } from '../stores/ui-store';

import promptImportNotes from '../helpers/prompt-import-notes';
import exportNote from '../helpers/export-note';
import AccessMenu from './access-menu';
import ToolButton from './tool-button';

export default function Tools() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNewNote = useNotesStore((state) => state.createNewNote);
  const deleteCurrentNote = useNotesStore((state) => () => state.deleteNote(currentNote.id));
  const importNotes = useNotesStore((state) => state.importNotes);
  const toggleLockPopover = useUiStore((state) => state.toggleLockPopover);

  const handleImportNotes = async () => {
    const parsedNotes = await promptImportNotes();
    importNotes(parsedNotes.successful);
  };

  return (
    <>
      <ToolButton title="Create Note" onClick={createNewNote}>
        <CreateIcon />
      </ToolButton>
      <ToolButton title="Remove Note" onClick={deleteCurrentNote}>
        <RemoveIcon />
      </ToolButton>
      {currentNote.type === 'plain' ? (
        <ToolButton title="Lock Note" onClick={toggleLockPopover}>
          <LockIcon />
        </ToolButton>
      ) : (
        <AccessMenu disabled={currentNote.type === 'encrypted'} />
      )}
      <ToolButton title="Import Notes" onClick={handleImportNotes}>
        <ImportIcon />
      </ToolButton>
      <ToolButton title="Export Note" onClick={() => exportNote(currentNote)}>
        <ExportIcon />
      </ToolButton>
    </>
  );
}
