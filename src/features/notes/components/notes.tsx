import NotesList from './notes-list';
import Toolbar from './toolbar';
import Note from './note';

export default function Notes() {
  return (
    <main className="relative w-full h-full grid grid-cols-[15rem_2rem_1fr] gap-2 xl:w-[65rem] xl:h-[43rem]">
      <NotesList />
      <Toolbar />
      <Note />
    </main>
  );
}
