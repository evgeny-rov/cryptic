import { useNotesStore } from '../stores/notes-store';
import type { NoteId } from '../stores/notes-store';
import encryptedIcon from '../assets/encrypted.svg';

const NoteListItem = ({ id }: { id: NoteId }) => {
  const note = useNotesStore((state) => state.byId[id]);
  const isSelected = useNotesStore((state) => state.selectedNoteId === id);
  const selectNote = useNotesStore((state) => state.selectNote);

  return (
    <li
      className={`h-9 px-3 flex items-center gap-3 rounded-md hover:opacity-100 cursor-pointer ${
        isSelected ? 'bg-[#202023]' : 'opacity-50'
      }`}
      onClick={() => selectNote(id)}
    >
      {note.type === 'plain' ? (
        <span className="w-2.5 text-xl">{'•'}</span>
      ) : (
        <img className="w-2.5" src={encryptedIcon} alt="Lock image" />
      )}
      <span className="w-44 capitalize overflow-hidden whitespace-nowrap text-ellipsis">
        {note.title}
      </span>
    </li>
  );
};

export default function NotesList() {
  const notesIds = useNotesStore((state) => state.allIds);

  return (
    <div className="bg-[#202023] p-2 rounded-md overflow-y-auto border-2 border-zinc-800">
      <ul>
        {notesIds.map((id) => (
          <NoteListItem key={id} id={id} />
        ))}
      </ul>
    </div>
  );
}
