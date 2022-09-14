import { ReactComponent as CreateIcon } from '../assets/create.svg';
import { ReactComponent as ImportIcon } from '../assets/import.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';

import { useNotesStore } from '../stores/notes-store';
import { useUiStore } from '../stores/ui-store';

import TBButton from './tb-button';
import promptImportNotes from '../helpers/prompt-import-notes';
import exportNote from '../helpers/export-note';
import AccessMenu from './access-menu';

export default function Toolbar() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNewNote = useNotesStore((state) => state.createNewNote);
  const deleteCurrentNote = useNotesStore((state) => () => state.deleteNote(currentNote.id));
  const importNotes = useNotesStore((state) => state.importNotes);
  const openLockPopover = useUiStore((state) => state.openLockPopover);

  const handleImportNotes = async () => {
    const parsedNotes = await promptImportNotes();
    importNotes(parsedNotes.successful);
  };

  return (
    <div className="flex h-fit flex-wrap gap-4 justify-center">
      <div className="flex flex-wrap gap-2 justify-center">
        <TBButton title="Create Note" onClick={createNewNote}>
          <CreateIcon />
        </TBButton>
        <TBButton title="Remove Note" onClick={deleteCurrentNote}>
          <RemoveIcon />
        </TBButton>
      </div>
      {currentNote.type === 'plain' ? (
        <TBButton title="Lock Note" onClick={openLockPopover}>
          <LockIcon />
        </TBButton>
      ) : (
        <AccessMenu disabled={currentNote.type === 'encrypted'} />
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        <TBButton title="Import Notes" onClick={handleImportNotes}>
          <ImportIcon />
        </TBButton>
        <TBButton title="Export Note" onClick={() => exportNote(currentNote)}>
          <ExportIcon />
        </TBButton>
      </div>
    </div>
  );
}
