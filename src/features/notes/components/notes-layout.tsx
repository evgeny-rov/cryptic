import classNames from 'classnames';
import NoteContent from './note-content';
import Appbar from './appbar';
import Sidebar from './sidebar';

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
        <NoteContent />
      </Pane>
      <Appbar />
    </main>
  );
}
