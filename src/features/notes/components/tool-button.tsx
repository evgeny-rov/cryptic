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
      className="px-[0.4rem] w-7 h-7 grid place-items-center opacity-50 hover:opacity-100 disabled:opacity-10 focus:opacity-100"
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
