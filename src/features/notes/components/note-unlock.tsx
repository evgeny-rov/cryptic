import classNames from 'classnames';
import { useState } from 'react';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { EncryptedNote, useNotesStore } from '../stores/notes-store';

export default function NoteUnlock({ note }: { note: EncryptedNote }) {
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
    <div className="grid w-full h-full place-items-center overflow-y-auto">
      <form onSubmit={handleUnlock} className="grid place-items-center space-y-4 p-8">
        <PrivateIcon
          className={classNames('w-14', { 'animate-wiggle': hasError })}
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
          className="w-52 px-2 rounded-md bg-zinc-700"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button title="unlock note" className="text-sm font-semibold">
          Unlock
        </button>
      </form>
    </div>
  );
}
