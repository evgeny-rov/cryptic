import createIcon from '../assets/create.svg';
import importIcon from '../assets/import.svg';
import downloadIcon from '../assets/download.svg';
import lockIcon from '../assets/lock.svg';
import trashIcon from '../assets/trash.svg';

import { useNotesStore } from '../stores/notes-store';
import { parseFiles, promptExport, promptImport } from '../stores/file-store';
import { parseNotes } from '../utils/parse-external-notes';
import { useEncryptionDialogStore } from '../stores/dialogs-store';

const ToolbarButton = ({
  onClick,
  iconSrc,
  title,
  disabled = false,
}: {
  onClick: () => void;
  iconSrc: string;
  title: string;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      className="px-[0.65rem] flex items-center opacity-70 hover:opacity-100 disabled:opacity-10"
      type="button"
      title={title}
      onClick={onClick}
    >
      <img className="h-4" src={iconSrc} alt={title} />
    </button>
  );
};

export default function Toolbar() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNote = useNotesStore((state) => state.createNote);
  const deleteNote = useNotesStore((state) => () => state.deleteNote(state.selectedNoteId));
  const addNote = useNotesStore((state) => state.addNote);
  const toggleEncryptionDialog = useEncryptionDialogStore((state) => state.toggle);

  const handleImport = async () => {
    const pickedFiles = await promptImport();
    const maybeSerializedNotes = await parseFiles(pickedFiles);
    const importedNotes = parseNotes(maybeSerializedNotes);
    importedNotes.successful.forEach(addNote);
  };

  const handleExport = () => promptExport(currentNote);

  return (
    <div className="w-fit h-9 rounded-md flex bg-[#202023] border-2 border-zinc-800">
      <ToolbarButton title="Create note" onClick={createNote} iconSrc={createIcon} />
      <ToolbarButton title="Import notes" onClick={handleImport} iconSrc={importIcon} />
      <ToolbarButton
        title="Encrypt note"
        onClick={toggleEncryptionDialog}
        iconSrc={lockIcon}
        disabled={currentNote.type === 'encrypted'}
      />
      <ToolbarButton title="Download note" onClick={handleExport} iconSrc={downloadIcon} />
      <ToolbarButton title="Delete note" onClick={deleteNote} iconSrc={trashIcon} />
    </div>
  );
}
