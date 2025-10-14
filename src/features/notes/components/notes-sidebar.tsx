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
        'w-60 flex-shrink-0 flex flex-col',
        !isExpanded && 'hidden',
        'md:flex'
      )}
    >
      <div className="flex justify-evenly">
        <NotesTools />
      </div>
      <div
        className={clsx(
          'overflow-y-auto app-scrollbar',
          'supports-gutter:gutter supports-gutter:pr-1'
        )}
      >
        <NotesList />
      </div>
    </div>
  );
}
