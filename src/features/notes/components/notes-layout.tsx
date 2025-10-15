import NotesMain from './notes-main';
import NotesSidebar from './notes-sidebar';

export default function NotesLayout() {
  return (
    <div className="w-full h-full flex p-2 gap-1 overflow-hidden">
      <NotesSidebar />
      <NotesMain />
    </div>
  );
}
