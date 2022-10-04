import clsx from 'clsx';

interface Props {
  value: string;
  disabled: boolean;
  placeholder: string;
  onChange: (text: string) => void;
}

const handleClearFocus = (ev: React.FormEvent<HTMLFormElement>) => {
  ev.preventDefault();

  ev.currentTarget.contains(document.activeElement) &&
    document.activeElement instanceof HTMLElement &&
    document.activeElement.blur();
};

export default function NoteTitle({ value, disabled, onChange, placeholder }: Props) {
  return (
    <form className="w-full" onSubmit={handleClearFocus}>
      <input
        type="text"
        aria-label="note title"
        enterKeyHint="done"
        placeholder={placeholder}
        onChange={(ev) => onChange(ev.target.value)}
        disabled={disabled}
        value={value}
        className={clsx(
          'p-1 py-2 bg-transparent rounded-md w-full capitalize text-ellipsis text-current outline-none',
          'placeholder:italic placeholder:text-zinc-500 read-only:cursor-pointer'
        )}
      />
    </form>
  );
}
