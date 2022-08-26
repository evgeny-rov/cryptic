import NotesList from './notes-list';
import Toolbar from './toolbar';
import NoteEditor from './editor';

export default function Notes() {
  return (
    <main className="relative w-[65rem] h-[43rem] grid grid-cols-[15rem_1fr] gap-2">
      <NotesList />
      <div className="flex flex-col gap-2">
        <Toolbar />
        <NoteEditor />
      </div>
    </main>
  );
}
