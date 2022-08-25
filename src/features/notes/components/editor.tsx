import { useEffect, useState } from 'react';
import lockIcon from '../assets/lock.svg';

import { decrypt } from '../../crypto';

import { Note, PlainNote, EncryptedNote, useNotesStore } from '../stores/notes-store';
import { useEncryptionDialogStore } from '../stores/dialogs-store';
import EncryptionDialog from './encryption-dialog';
import deriveNoteTitle from '../utils/derive-note-title';

const EditorEncryptedNote = ({
  note,
  updateNote,
}: {
  note: EncryptedNote;
  updateNote: (id: string, updatedNote: Note) => void;
}) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleDecrypt = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      const decryptedText = await decrypt(note.data, password);
      updateNote(note.id, { ...note, type: 'plain', data: decryptedText });
    } catch (e) {
      setHasError(true);
    }
  };

  return (
    <div className="w-full h-full grid place-items-center">
      <form action="" onSubmit={handleDecrypt} className="w-1/2 grid place-items-center gap-4">
        <img
          className={`w-10 ${hasError ? 'animate-wiggle' : ''}`}
          onAnimationEnd={() => setHasError(false)}
          src={lockIcon}
          alt="Lock image"
        />
        <h2 className="font-semibold text-lg capitalize">This note is encrypted.</h2>
        <p className="text-sm">Enter this note's password to view.</p>
        <input
          required
          type="password"
          name="password"
          className="px-2 rounded-md bg-zinc-700"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button className="text-sm">Decrypt</button>
      </form>
    </div>
  );
};

const EditorPlainNote = ({
  note,
  updateNote,
}: {
  note: PlainNote;
  updateNote: (id: string, updatedNote: Note) => void;
}) => {
  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = ev.target.value;
    updateNote(note.id, { ...note, title: deriveNoteTitle(text), data: text });
  };

  return (
    <>
      <EncryptionDialog note={note} updateNote={updateNote} />
      <textarea
        value={note.data}
        onChange={handleChange}
        className="p-6 w-full h-full bg-transparent outline-none resize-none"
      />
    </>
  );
};

export default function NoteEditor() {
  const note = useNotesStore((state) => state.byId[state.selectedNoteId]);
  const updateNote = useNotesStore((state) => state.updateNote);
  const closeEncryptionDialog = useEncryptionDialogStore((state) => state.close);

  useEffect(() => {
    return closeEncryptionDialog;
  });

  return (
    <div className="relative w-full h-full bg-[#252528] rounded-md border-2 border-zinc-800">
      {note.type === 'encrypted' ? (
        <EditorEncryptedNote note={note} updateNote={updateNote} />
      ) : (
        <EditorPlainNote note={note} updateNote={updateNote} />
      )}
    </div>
  );
}
