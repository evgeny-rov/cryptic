import classNames from 'classnames';

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
        disabled={disabled}
        placeholder={placeholder}
        onChange={(ev) => onChange(ev.target.value)}
        className={classNames(
          'p-1 py-2 bg-transparent rounded-md w-full capitalize text-ellipsis text-current',
          'placeholder:italic placeholder:text-zinc-500 group-hover:placeholder:text-current',
          'group-focus-within:placeholder:text-current'
        )}
        value={value}
      />
    </form>
  );
}
