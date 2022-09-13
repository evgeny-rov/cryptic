import useOutsideClick from '../hooks/use-outside-click';

interface MenuProps<Type extends readonly string[]> {
  onClose: () => void;
  options: Type;
  onOptionClick: (option: Type[number]) => void;
}

export default function Menu<Type extends readonly string[]>({
  onClose,
  options,
  onOptionClick,
}: MenuProps<Type>) {
  const menuRef = useOutsideClick(onClose);

  return (
    <div
      ref={menuRef}
      className="absolute left-7 z-10 -top-2 rounded-md bg-zinc-700 shadow-xl grid py-2 px-4 gap-2"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onOptionClick(option)}
          className="capitalize text-sm text-left opacity-70 hover:opacity-100 whitespace-nowrap"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
