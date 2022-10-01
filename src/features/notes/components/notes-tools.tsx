import { useAtom } from 'jotai';
import { ReactComponent as CreateIcon } from '../assets/create.svg';
import { ReactComponent as ImportIcon } from '../assets/import.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';

import { useNotesStore } from '../stores/notes-store';
import { lockingStateAtom } from '../stores/ui-atoms';

import promptImportNotes from '../helpers/prompt-import-notes';
import exportNote from '../helpers/export-note';
import NoteAccessMenu from './note-access-menu';
import NotesTB from './notes-tool-button';

export default function NotesTools() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNewNote = useNotesStore((state) => state.createNewNote);
  const deleteCurrentNote = useNotesStore((state) => () => state.deleteNote(currentNote.id));
  const importNotes = useNotesStore((state) => state.importNotes);
  const [, setIsLocking] = useAtom(lockingStateAtom);

  const toggleLocking = () => setIsLocking((state) => !state);

  const handleImportNotes = async () => {
    const parsedNotes = await promptImportNotes();
    importNotes(parsedNotes.successful);
  };

  return (
    <>
      <NotesTB title="Create Note" onClick={createNewNote}>
        <CreateIcon className="h-4 w-4" />
      </NotesTB>
      <NotesTB title="Remove Note" onClick={deleteCurrentNote}>
        <RemoveIcon className="h-4 w-4" />
      </NotesTB>
      {currentNote.type === 'plain' ? (
        <NotesTB title="Lock Note" onClick={toggleLocking}>
          <LockIcon className="h-4 w-4" />
        </NotesTB>
      ) : (
        <NoteAccessMenu disabled={currentNote.type === 'encrypted'} />
      )}
      <NotesTB title="Import Notes" onClick={handleImportNotes}>
        <ImportIcon className="h-4 w-4" />
      </NotesTB>
      <NotesTB title="Export Note" onClick={() => exportNote(currentNote)}>
        <ExportIcon className="h-4 w-4" />
      </NotesTB>
    </>
  );
}
