import classNames from 'classnames';

export default function ToolButton({
  title,
  onClick,
  disabled = false,
  children,
}: {
  onClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames(
        'py-3 px-2 flex items-center text-zinc-400',
        'hover:text-current focus:text-current disabled:text-zinc-700'
      )}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
