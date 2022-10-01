import classNames from 'classnames';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { z } from 'zod';
import { EditableNote, useNotesStore } from '../stores/notes-store';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { lockingStateAtom } from '../stores/ui-atoms';

const validationSchema = z
  .object({
    password: z.string().trim().min(6, 'Password must be 6 or more characters long.'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { message: `Passwords don't match.` });

export default function NoteLock({ note }: { note: EditableNote }) {
  const [, setIsLocking] = useAtom(lockingStateAtom);
  const addLock = useNotesStore((state) => state.addLock);
  const [formState, setFormState] = useState({
    password: '',
    confirm: '',
    error: '',
    isPristine: true,
  });

  const handleClose = () => {
    setIsLocking(false);
  };

  const handleChangePassword = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((state) => {
      const newState = { ...state, [ev.target.name]: ev.target.value };
      const validationResult = validationSchema.safeParse(newState);

      const error = !validationResult.success ? validationResult.error.issues[0].message : '';
      const isPristine = newState.password === '' && newState.confirm === '';

      return {
        ...newState,
        isPristine,
        error,
      };
    });
  };

  const handleAddLock = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    addLock(note, formState.password);
    handleClose();
  };

  const showError = !formState.isPristine && formState.error !== '';

  return (
    <div className="absolute inset-0">
      <div className="h-full z-30 grid items-center overflow-y-auto p-8 bg-zinc-800/95">
        <button
          title="Close Lock Popover"
          className="absolute top-4 right-4 w-6 p-2"
          type="button"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <form onSubmit={handleAddLock} className="grid place-items-center space-y-4 text-center">
          <PrivateIcon className={classNames('w-14', { 'animate-wiggle': showError })} />
          <h2 className={classNames('capitalize font-semibold', { 'text-red-400': showError })}>
            {showError ? formState.error : 'Lock note.'}
          </h2>
          <label htmlFor="current-password" className="grid space-y-1">
            <span>Password:</span>
            <input
              required
              type="password"
              name="password"
              id="current-password"
              autoComplete="current-password"
              className="px-2 w-52 rounded-md bg-zinc-700"
              value={formState.password}
              onChange={handleChangePassword}
            />
          </label>
          <label htmlFor="confirm-password" className="grid space-y-1">
            <span>Confirm Password:</span>
            <input
              required
              type="password"
              name="confirm"
              id="confirm-password"
              autoComplete="current-password"
              className="w-52 px-2 rounded-md bg-zinc-700"
              value={formState.confirm}
              onChange={handleChangePassword}
            />
          </label>
          <button
            title="Lock Note"
            disabled={formState.isPristine || formState.error !== ''}
            className="text-sm font-semibold disabled:text-zinc-600 p-2"
          >
            Lock
          </button>
        </form>
      </div>
    </div>
  );
}
