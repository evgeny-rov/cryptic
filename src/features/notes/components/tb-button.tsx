export default function TBButton({
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
      disabled={disabled}
      className="px-[0.4rem] w-7 h-7 grid place-items-center opacity-50 hover:opacity-100 disabled:opacity-10 focus:opacity-100"
      type="button"
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
