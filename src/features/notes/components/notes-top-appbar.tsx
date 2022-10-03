import { useAtom } from 'jotai';
import { useNotesStore } from '../stores/notes-store';
import { sidebarStateAtom } from '../stores/ui-atoms';
import { ReactComponent as MenuIcon } from '../assets/menu.svg';
import NoteTitle from './note-title';
import derivePlaceholderTitle from '../helpers/derive-placeholder-title';

export default function NotesTopAppbar() {
  const [, setIsExpanded] = useAtom(sidebarStateAtom);
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const changeTitle = useNotesStore((state) => state.changeNoteTitle);

  const toggleExpandSidebar = () => setIsExpanded((state) => !state);
  const handleChangeTitle = (text: string) => changeTitle(currentNote.id, text);

  return (
    <div className="sticky top-0 bg-zinc-900/30 flex items-center justify-between md:hidden">
      <button title="Sidebar" className="p-4" type="button" onClick={toggleExpandSidebar}>
        <MenuIcon className="w-5" />
      </button>
      <NoteTitle
        value={currentNote.title}
        onChange={handleChangeTitle}
        placeholder={derivePlaceholderTitle(currentNote)}
        readonly={currentNote.type === 'encrypted'}
      />
    </div>
  );
}
