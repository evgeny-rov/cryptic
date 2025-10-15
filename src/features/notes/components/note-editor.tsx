import { useCallback } from 'react';
import { EditableNote, useNotesStore } from '../stores/notes-store';

const shortcuts: Record<string, string> = {
  '--s': '\t',
  '--b': '• ',
  '--z': '▢ - ',
  '--x': '▣ - ',
  '-->': '→',
  '<--': '←',
  '--t': '⭐',
};

export default function NoteEditor({ note }: { note: EditableNote }) {
  const changeNoteText = useNotesStore((state) => state.changeNoteText);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      const value = textarea.value;
      const cursorPos = textarea.selectionStart;

      try {
        const before = value.slice(0, cursorPos);
        const after = value.slice(cursorPos);

        const match = Object.entries(shortcuts).find(([key]) => before.endsWith(key));

        if (match) {
          const [key, replacement] = match;

          const newBefore = before.slice(0, -key.length) + replacement;
          const newValue = newBefore + after;

          textarea.value = newValue;
          const newCursorPos = newBefore.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);

          changeNoteText(note.id, newValue);
        } else {
          changeNoteText(note.id, value);
        }
      } catch (er) {
        changeNoteText(note.id, value);
      }
    },
    [note]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      try {
        if (e.key === 'Enter') {
          e.preventDefault();
          const textarea = e.currentTarget;
          const { selectionStart, selectionEnd, value } = textarea;

          const before = value.slice(0, selectionStart);
          const after = value.slice(selectionEnd);

          const lastLineBreak = before.lastIndexOf('\n');
          const currentLine = before.slice(lastLineBreak + 1);

          const prefix = currentLine.startsWith('\t') ? '\t' : '';

          const newValue = before + '\n' + prefix + after;
          const newCursorPos = selectionStart + 1 + prefix.length;

          textarea.value = newValue;
          textarea.setSelectionRange(newCursorPos, newCursorPos);

          changeNoteText(note.id, newValue);
        }
      } catch (err) {}
    },
    [note]
  );

  return (
    <textarea
      aria-label="note editor"
      value={note.data}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      spellCheck="true"
      className="w-full flex-grow p-4 bg-transparent outline-none resize-none"
    />
  );
}
