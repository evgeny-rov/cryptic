import NotesMain from './notes-main';
import NotesSidebar from './notes-sidebar';

export default function NotesLayout() {
  return (
    <div className="w-full h-full flex xl:w-[64rem] xl:h-[45rem] overflow-hidden">
      <NotesSidebar />
      <NotesMain />
    </div>
  );
}
