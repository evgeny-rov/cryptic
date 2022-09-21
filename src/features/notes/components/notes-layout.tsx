import NoteContent from './note-content';
import LockNotePopover from './lock-note-popover';
import BottomAppbar from './bottom-appbar';
import Sidebar from './sidebar';
import classNames from 'classnames';

const Pane = ({ children, className }: { className: string; children: React.ReactNode }) => {
  return (
    <div className={classNames('xl:rounded-md xl:border-2 xl:border-zinc-800', className)}>
      {children}
    </div>
  );
};

export default function NotesLayout() {
  return (
    <main className="relative overflow-hidden w-full h-full flex flex-col xl:space-x-1 md:flex-row xl:w-[64rem] xl:h-[45rem]">
      <Pane className="bg-[#202023] w-60 overflow-hidden hidden md:block">
        <Sidebar />
      </Pane>
      <Pane className="bg-[#252528] flex relative flex-grow overflow-hidden">
        <LockNotePopover />
        <NoteContent />
      </Pane>
      <BottomAppbar />
    </main>
  );
}
