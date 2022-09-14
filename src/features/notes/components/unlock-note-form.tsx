import { useState } from 'react';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { EncryptedNote, useNotesStore } from '../stores/notes-store';

export default function UnlockNoteForm({ note }: { note: EncryptedNote }) {
  const unlockNote = useNotesStore((state) => state.unlockNote);
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleUnlock = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    try {
      await unlockNote(note, password);
    } catch (e) {
      setHasError(true);
    }
  };

  return (
    <div className="absolute inset-0 grid place-items-center overflow-y-auto p-8">
      <form onSubmit={handleUnlock} className="grid place-items-center gap-4">
        <PrivateIcon
          className={`w-14 ${hasError ? 'animate-wiggle' : ''}`}
          onAnimationEnd={() => setHasError(false)}
        />
        <h2 className="font-semibold text-lg capitalize">This note is locked.</h2>
        <p className="text-sm">Enter password to unlock.</p>
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
