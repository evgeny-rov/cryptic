import { useState, useEffect } from 'react';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { createKey, encrypt } from '../../crypto';
import { PlainNote, RemoveNameField, Note } from '../stores/notes-store';

export default function NoteAccessDialog({
  note,
  changeNote,
}: {
  note: PlainNote;
  changeNote: (id: string, updatedNote: RemoveNameField<Note, 'id'>) => void;
}) {
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
      const newKey = await createKey(password);
      const cipher = await encrypt(note.data, newKey);
      changeNote(note.id, { type: 'encrypted', title: note.title, data: cipher });
    } catch (e) {
      // ignore for now
    }
  };

  return (
    <div className="absolute w-full h-full grid place-items-center bg-[#252528] bg-opacity-90">
      <form onSubmit={handleEncrypt} className="w-1/2 grid place-items-center gap-5">
        <PrivateIcon className={`w-14 ${error ? 'animate-wiggle' : ''}`} />
        <h2 className="font-semibold text-lg capitalize">Lock note.</h2>
        <p className="text-red-400 h-4">{error ?? ''}</p>
        <label htmlFor="current-password" className="grid gap-1">
          <span>Password:</span>
          <input
            required
            type="password"
            name="password"
            id="current-password"
            minLength={5}
            autoComplete="current-password"
            className="px-2 rounded-md bg-zinc-700"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </label>
        <label htmlFor="confirm-password" className="grid gap-1">
          <span>Confirm Password:</span>
          <input
            required
            type="password"
            name="password"
            id="confirm-password"
            minLength={5}
            autoComplete="current-password"
            className={`px-2 rounded-md bg-zinc-700 ${
              error ? 'outline outline-red-400 outline-4' : ''
            }`}
            value={confirmationPassword}
            onChange={(ev) => setConfirmationPassword(ev.target.value)}
          />
        </label>
        <button disabled={error !== null} className="text-sm font-semibold disabled:opacity-25">
          Lock
        </button>
      </form>
    </div>
  );
}
