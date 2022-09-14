import NotesList from './notes-list';
import Toolbar from './toolbar';
import NoteContent from './note-content';
import LockNotePopover from './lock-note-popover';
import NotesListDropdown from './notes-list-dropdown';

const Pane = ({ children, className }: { className: string; children: React.ReactNode }) => {
  return (
    <div className={['xl:rounded-md xl:border-2 xl:border-zinc-800', className].join(' ')}>
      {children}
    </div>
  );
};

export default function NotesLayout() {
  return (
    <main className="relative w-full h-full flex flex-col xl:gap-1 md:flex-row xl:w-[64rem] xl:h-[45rem]">
      <Pane className="hidden bg-[#202023] overflow-y-auto md:block py-2">
        <NotesList />
      </Pane>
      <Pane className="bg-[#202023] flex flex-wrap justify-between min-h-[3rem] items-center md:w-8 md:items-start md:py-2">
        <div className="md:hidden">
          <NotesListDropdown />
        </div>
        <Toolbar />
      </Pane>
      <Pane className="relative bg-[#252528] flex-grow">
        <LockNotePopover />
        <NoteContent />
      </Pane>
    </main>
  );
}
