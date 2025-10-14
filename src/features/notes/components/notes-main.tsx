import { useAtom } from 'jotai';
import NoteEditor from './note-editor';
import NoteUnlock from './note-unlock';
import NoteLock from './note-lock';
import NotesTopAppbar from './notes-top-appbar';
import { useNotesStore } from '../stores/notes-store';
import { lockingStateAtom } from '../stores/ui-atoms';

export default function NotesMain() {
  const note = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const [isLocking] = useAtom(lockingStateAtom);

  return (
    <main className="bg-[#1b1b1b] flex flex-col relative flex-grow overflow-hidden shadow-lg rounded-md">
      <NotesTopAppbar />
      {note.type === 'encrypted' && <NoteUnlock note={note} />}
      {note.type !== 'encrypted' && isLocking && <NoteLock note={note} />}
      {note.type !== 'encrypted' && <NoteEditor note={note} />}
    </main>
  );
}
