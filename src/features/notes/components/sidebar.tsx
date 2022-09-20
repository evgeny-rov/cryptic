import NotesList from './notes-list';
import Tools from './tools';

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex py-4 justify-evenly">
        <Tools />
      </div>
      <div className="px-1 overflow-y-auto">
        <NotesList />
      </div>
    </div>
  );
}
