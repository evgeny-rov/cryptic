import { Note, useNotesStore } from '../stores/notes-store';
import classNames from 'classnames';

const getPlaceholderTitle = (note: Note) => {
  if (note.type === 'encrypted') {
    return note.title || 'Empty Note';
  }

  return note.title || note.data.slice(0, 100) || 'Untitled Note';
};

export default function NoteTitle({ note, editable }: { note: Note; editable: boolean }) {
  const changeTitle = useNotesStore(
    (state) => (ev: React.ChangeEvent<HTMLInputElement>) =>
      state.changeNoteTitle(note.id, ev.target.value)
  );

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    ev.currentTarget.contains(document.activeElement) &&
      document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="note title"
        enterKeyHint="done"
        disabled={!editable || note.type === 'encrypted'}
        placeholder={getPlaceholderTitle(note)}
        onChange={changeTitle}
        className={classNames(
          'p-1 bg-transparent w-full capitalize whitespace-nowrap text-ellipsis',
          { 'cursor-pointer': !editable }
        )}
        value={note.title}
      />
    </form>
  );
}
