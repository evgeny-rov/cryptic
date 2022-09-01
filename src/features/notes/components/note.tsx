import { useEffect } from 'react';
import { useNotesStore } from '../stores/notes-store';
import { useNoteAccessDialog } from '../stores/dialogs-store';
import EncryptionDialog from './note-access-dialog';
import UnlockNoteForm from './unlock-note-form';
import TextEditor from './text-editor';

export default function Note() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const changeNote = useNotesStore((state) => state.changeNote);
  const isNoteAccessDialogOpen = useNoteAccessDialog((state) => state.isOpen);
  const closeNoteAccessDialog = useNoteAccessDialog((state) => state.close);

  useEffect(() => closeNoteAccessDialog, [currentNote]);

  return (
    <div className="relative w-full h-full bg-[#252528] rounded-md border-2 border-zinc-800">
      {isNoteAccessDialogOpen && currentNote.type === 'plain' && (
        <EncryptionDialog note={currentNote} changeNote={changeNote} />
      )}
      {currentNote.type === 'encrypted' && <UnlockNoteForm note={currentNote} />}
      {currentNote.type === 'plain' && <TextEditor note={currentNote} />}
    </div>
  );
}
