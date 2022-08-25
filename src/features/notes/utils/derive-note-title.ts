const deriveNoteTitle = (text: string) => {
  const firstLine = text.match(/^.*$/m);

  if (!firstLine) return text;

  const words = firstLine[0].split(' ');
  const title = words.slice(0, 3).join(' ');

  return title;
};

export default deriveNoteTitle;
