import createIcon from '../assets/create.svg';
import importIcon from '../assets/import.svg';
import downloadIcon from '../assets/download.svg';
import lockIcon from '../assets/lock.svg';
import trashIcon from '../assets/trash.svg';

import { useNotesStore } from '../stores/notes-store';
import { parseFiles, promptExport, promptImport } from '../utils/files';
import { parseNotes } from '../utils/parse-notes';

const ToolbarButton = ({
  onClick,
  iconSrc,
  title,
}: {
  onClick: () => void;
  iconSrc: string;
  title: string;
}) => {
  return (
    <button className="opacity-70 hover:opacity-100" type="button" title={title} onClick={onClick}>
      <img src={iconSrc} alt={title} />
    </button>
  );
};

export default function Toolbar() {
  const currentNote = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const createNote = useNotesStore((state) => state.createNote);
  const deleteNote = useNotesStore((state) => () => state.deleteNote(state.selectedNoteId));
  const appendExternalNotes = useNotesStore((state) => state.appendExternalNotes);

  const handleImport = async () => {
    const pickedFiles = await promptImport();
    const maybeSerializedNotes = await parseFiles(pickedFiles);
    const importedNotes = parseNotes(maybeSerializedNotes);
    appendExternalNotes(importedNotes.successful);
  };

  return (
    <div className="h-full w-full py-3 px-[0.4rem] rounded-md flex flex-col justify-between bg-[#202023] border-2 border-zinc-800">
      <div className="grid place-items-center gap-5">
        <ToolbarButton title="Create note" onClick={createNote} iconSrc={createIcon} />
        <ToolbarButton title="Import notes" onClick={handleImport} iconSrc={importIcon} />
      </div>
      <div className="grid place-items-center gap-5">
        <ToolbarButton title="Encrypt note" onClick={() => null} iconSrc={lockIcon} />
        <ToolbarButton
          title="Download note"
          onClick={() => promptExport(currentNote)}
          iconSrc={downloadIcon}
        />
        <ToolbarButton title="Delete note" onClick={deleteNote} iconSrc={trashIcon} />
      </div>
    </div>
  );
}
