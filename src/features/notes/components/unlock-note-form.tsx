import { useState } from 'react';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { createKey, decrypt } from '../../crypto';
import { EncryptedNote, useNotesStore } from '../stores/notes-store';

export default function UnlockNoteForm({ note }: { note: EncryptedNote }) {
  const changeNote = useNotesStore((state) => state.changeNote);
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleDecrypt = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      const credentials = await createKey(password, note.data.salt);
      const decryptedText = await decrypt(note.data, credentials);
      changeNote(note.id, { ...note, type: 'plain', credentials, data: decryptedText });
    } catch (e) {
      setHasError(true);
    }
  };

  return (
    <div className="w-full h-full grid place-items-center">
      <form onSubmit={handleDecrypt} className="w-1/2 grid place-items-center gap-5">
        <PrivateIcon
          className={`w-14 ${hasError ? 'animate-wiggle' : ''}`}
          onAnimationEnd={() => setHasError(false)}
        />
        <h2 className="font-semibold text-lg capitalize">This note is locked.</h2>
        <p className="text-sm">Enter this note's password to view.</p>
        <input
          required
          type="password"
          name="password"
          id="current-password"
          autoComplete="current-password"
          className="px-2 rounded-md bg-zinc-700"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button className="text-sm font-semibold disabled:opacity-25">Unlock</button>
      </form>
    </div>
  );
}
