import NotesList from './notes-list';
import Toolbar from './toolbar';
import NoteContent from './note-content';
import LockNotePopover from './lock-note-popover';

export default function NotesLayout() {
  return (
    <main className="relative w-full h-full flex gap-1 max-w-[65rem] max-h-[45rem]">
      <div className="bg-[#202023] p-2 overflow-y-auto rounded-md border-2 border-zinc-800">
        <NotesList />
      </div>
      <div className="bg-[#202023] flex flex-col gap-4 rounded-md border-2 border-zinc-800">
        <Toolbar />
      </div>
      <div className="bg-[#252528] flex-grow relative rounded-md border-2 border-zinc-800">
        <LockNotePopover />
        <NoteContent />
      </div>
    </main>
  );
}
