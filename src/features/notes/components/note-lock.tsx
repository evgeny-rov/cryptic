import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { z } from 'zod';
import { EditableNote, useNotesStore } from '../stores/notes-store';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import { ReactComponent as PrivateIcon } from '../assets/private.svg';
import { lockingStateAtom } from '../stores/ui-atoms';
import useOutsideClick from '../hooks/use-outside-click';

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
  });

  const handleClose = () => {
    setIsLocking(false);
  };

  const containerRef = useOutsideClick<HTMLDivElement>(handleClose);

  const handleChangePassword = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((state) => ({ ...state, [ev.target.name]: ev.target.value }));
  };

  const handleAddLock = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const validation = validationSchema.safeParse(formState);

    if (validation.success) {
      handleClose();
      addLock(note, formState.password);
      return;
    }

    setFormState((state) => ({ ...state, error: validation.error.issues[0].message }));
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0"
    >
      <div className="h-full z-30 grid items-center overflow-y-auto p-8 bg-zinc-800/95">
        <button
          title="Close Lock Popover"
          className="absolute top-4 right-4 w-6 p-2"
          type="button"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <motion.form
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleAddLock}
          className="grid place-items-center space-y-4 text-center"
        >
          <PrivateIcon className={clsx('w-14', formState.error && 'animate-wiggle')} />
          <h2 className={clsx('capitalize font-semibold', formState.error && 'text-red-400')}>
            {formState.error ? formState.error : 'Lock note.'}
          </h2>
          <label htmlFor="current-password" className="grid space-y-1">
            <span>Password:</span>
            <input
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
              type="password"
              name="confirm"
              id="confirm-password"
              autoComplete="current-password"
              className="w-52 px-2 rounded-md bg-zinc-700"
              value={formState.confirm}
              onChange={handleChangePassword}
            />
          </label>
          <button title="Lock Note" className="text-sm font-semibold p-2">
            Lock
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
