import clsx from 'clsx';
import { useAtom } from 'jotai';
import useOutsideClick from '../hooks/use-outside-click';
import { sidebarStateAtom } from '../stores/ui-atoms';
import NotesList from './notes-list';
import NotesTools from './notes-tools';

export default function NotesSidebar() {
  const [isExpanded, setIsExpanded] = useAtom(sidebarStateAtom);

  const containerRef = useOutsideClick<HTMLDivElement>(() => setIsExpanded(false), isExpanded);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'bg-zinc-800/30 w-60 flex-shrink-0 flex flex-col',
        !isExpanded && 'hidden',
        'md:flex xl:mr-1 xl:rounded-md xl:border-2 xl:border-zinc-800'
      )}
    >
      <div className="flex py-2 justify-evenly">
        <NotesTools />
      </div>
      <div
        className={clsx(
          'px-2 overflow-y-auto app-scrollbar',
          'supports-gutter:gutter-both supports-gutter:px-1'
        )}
      >
        <NotesList />
      </div>
    </div>
  );
}
