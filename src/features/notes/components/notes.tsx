import NotesList from './notes-list';
import Toolbar from './toolbar';
import NoteEditor from './editor';

export default function Notes() {
  return (
    <main className="relative w-[65rem] h-[43rem] grid grid-cols-[15rem_2rem_1fr] gap-2">
      <NotesList />
      <Toolbar />
      <NoteEditor />
    </main>
  );
}
