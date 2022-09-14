import { useState, useEffect } from 'react';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { useUiStore } from '../stores/ui-store';
import { useNotesStore } from '../stores/notes-store';
import { ReactComponent as CloseIcon } from '../assets/close.svg';

export default function LockNotePopover() {
  const [currentNote, addLock] = useNotesStore((state) => [
    state.byId[state.selectedNoteId],
    state.addLock,
  ]);
  const { isLockPopoverOpen, closeLockPopover } = useUiStore();
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

  const handleClose = () => {
    setPassword('');
    setConfirmationPassword('');
    closeLockPopover();
  };

  const handleAddLock = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (currentNote.type === 'encrypted') return;
    addLock(currentNote, password);
    handleClose();
  };

  const handleBlur = (ev: React.FocusEvent<HTMLDivElement, Element>) => {
    const currentTarget = ev.currentTarget;
    requestAnimationFrame(() => !currentTarget.contains(document.activeElement) && handleClose());
  };

  if (!isLockPopoverOpen || currentNote.type === 'encrypted') return null;

  return (
    <div className="absolute inset-0">
      <div className="fixed inset-0 bg-black/30 z-30" onClick={handleClose}></div>
      <div
        tabIndex={-1}
        onBlur={handleBlur}
        className="relative w-full h-full z-30 grid place-items-center overflow-y-auto bg-[#252528] bg-opacity-90 p-8 rounded-md"
      >
        <button
          className="absolute top-4 right-4 w-7 p-2 opacity-50"
          type="button"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <form onSubmit={handleAddLock} className="grid place-items-center gap-4">
          <PrivateIcon className={`w-14 ${error ? 'animate-wiggle' : ''}`} />
          <h2 className={'capitalize text-lg font-semibold' + (error ? ' text-red-400' : '')}>
            {error ?? 'Lock note.'}
          </h2>
          <label htmlFor="current-password" className="grid gap-1">
            <span>Password:</span>
            <input
              autoFocus
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
              className={`px-2 rounded-md bg-zinc-700 ${error ? 'ring-2 ring-red-400' : ''}`}
              value={confirmationPassword}
              onChange={(ev) => setConfirmationPassword(ev.target.value)}
            />
          </label>
          <button
            disabled={error !== null}
            className="text-sm font-semibold disabled:opacity-25 p-2"
          >
            Lock
          </button>
        </form>
      </div>
    </div>
  );
}
