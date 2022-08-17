import NotesList from './notes-list';
import Toolbar from './toolbar';
import Editor from './editor';

export default function Notes() {
  return (
    <main className="relative w-[65rem] h-[43rem] bg-[#202023] grid grid-cols-[15rem_1fr] rounded-md overflow-hidden">
      <NotesList />
      <div className="w-full h-full grid grid-rows-[1.5rem_1fr] bg-[#252528] rounded-md overflow-hidden">
        <Toolbar />
        <Editor />
      </div>
    </main>
  );
}
