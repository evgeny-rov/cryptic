const deriveNoteTitle = (text: string) => {
  const firstLine = text.match(/^.*$/m);

  if (!firstLine) return text;

  const words = firstLine[0].trim().split(' ');
  const title = words.slice(0, 3).join(' ');

  return title || 'Untitled Note';
};

export default deriveNoteTitle;
