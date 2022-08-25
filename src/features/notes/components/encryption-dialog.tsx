import { useState, useEffect } from 'react';
import lockIcon from '../assets/lock.svg';
import { encrypt } from '../../crypto';
import { useEncryptionDialogStore } from '../stores/dialogs-store';
import { PlainNote, Note } from '../stores/notes-store';

export default function EncryptionDialog({
  note,
  updateNote,
}: {
  note: PlainNote;
  updateNote: (id: string, updatedNote: Note) => void;
}) {
  const isOpen = useEncryptionDialogStore((state) => state.isOpen);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  useEffect(() => {
    if (password !== confirmationPassword) {
      setError('Passwords do not match.');
    } else {
      setError(null);
    }
  }, [password, confirmationPassword]);

  const handleEncrypt = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    try {
      const cipher = await encrypt(note.data, password);
      updateNote(note.id, { ...note, type: 'encrypted', data: cipher });
    } catch (e) {
      // ignore for now
      console.log(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute w-full h-full grid place-items-center bg-[#252528] bg-opacity-90">
      <form action="" onSubmit={handleEncrypt} className="w-1/2 grid place-items-center gap-5">
        <img className={`w-10 ${error ? 'animate-wiggle' : ''}`} src={lockIcon} alt="Lock image" />
        <h2 className="font-semibold text-lg capitalize">Encrypt note.</h2>
        <p className="text-red-400 h-4">{error ?? ''}</p>
        <label className="grid gap-1">
          <span>Password:</span>
          <input
            required
            type="password"
            name="password"
            className="px-2 rounded-md bg-zinc-700"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Confirm Password:</span>
          <input
            required
            type="password"
            name="confirm"
            className={`px-2 rounded-md outline-red-400 bg-zinc-700 ${error ? 'outline' : ''}`}
            value={confirmationPassword}
            onChange={(ev) => setConfirmationPassword(ev.target.value)}
          />
        </label>
        <button disabled={error !== null} className="text-sm">
          Encrypt
        </button>
      </form>
    </div>
  );
}
