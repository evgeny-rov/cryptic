export default (text: string) => {
  const firstLine = text.match(/^.*$/m);

  if (!firstLine) return text;

  const title_max_words_count = 4;

  const words = firstLine[0].trim().split(' ');
  const title = words.slice(0, title_max_words_count).join(' ');

  return title || 'Untitled Note';
};
