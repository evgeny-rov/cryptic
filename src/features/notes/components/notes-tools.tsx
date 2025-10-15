import { useAtom } from 'jotai';
import { ReactComponent as CreateIcon } from '../assets/create.svg';
import { ReactComponent as ImportIcon } from '../assets/import.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';

import { isPristineNote, useNotesStore } from '../stores/notes-store';
import { lockingStateAtom } from '../stores/ui-atoms';

import NoteAccessMenu from './note-access-menu';
import NotesTB from './notes-tool-button';
import promptExportStore from '../helpers/prompt-export-store';
import promptImportStore from '../helpers/prompt-import-store';

export default function NotesTools() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNewNote = useNotesStore((state) => state.createNewNote);
  const deleteCurrentNote = useNotesStore((state) => () => state.deleteNote(currentNote.id));
  const importNotes = useNotesStore((state) => state.importNotes);
  const exportStore = useNotesStore((state) => state.exportStore);
  const importStore = useNotesStore((state) => state.importStore);
  const [, setIsLocking] = useAtom(lockingStateAtom);

  const toggleLocking = () => setIsLocking((state) => !state);

  const handleExportStore = async () => {
    try {
      const store = await exportStore();
      promptExportStore(store);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImportStore = async () => {
    if (!window.confirm('Are you sure you want to replace your current notes?')) {
      return;
    }

    try {
      const store = await promptImportStore();
      if (!store) return;
      importStore(store);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNote = () => {
    const isPristine = isPristineNote(currentNote);

    if (isPristine) {
      deleteCurrentNote();
      return;
    }

    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteCurrentNote();
    }
  };

  return (
    <div className="flex gap-1">
      <NotesTB title="Create Note" onClick={createNewNote}>
        <CreateIcon className="w-4 h-4" />
      </NotesTB>
      <NotesTB title="Remove Note" onClick={handleDeleteNote}>
        <RemoveIcon className="w-4 h-4" />
      </NotesTB>
      {currentNote.type === 'plain' ? (
        <NotesTB title="Lock Note" onClick={toggleLocking}>
          <LockIcon className="w-4 h-4" />
        </NotesTB>
      ) : (
        <NoteAccessMenu disabled={currentNote.type === 'encrypted'} />
      )}
      <NotesTB title="Import Notes" onClick={handleImportStore}>
        <ImportIcon className="w-4 h-4" />
      </NotesTB>
      <NotesTB title="Export Note" onClick={handleExportStore}>
        <ExportIcon className="w-4 h-4" />
      </NotesTB>
    </div>
  );
}
