import type { Note } from '../stores/notes-store';

const parseFiles = async (files: FileList) => {
  return Promise.all([...files].map((file) => file.text()));
};

const promptImport = (): Promise<FileList> => {
  return new Promise((res, rej) => {
    const fileInputElement = document.createElement('input');
    fileInputElement.setAttribute('type', 'file');
    fileInputElement.setAttribute('multiple', 'true');
    fileInputElement.setAttribute('accept', '.cryptic');

    fileInputElement.addEventListener('change', async function (ev) {
      if (!this.files || this.files.length === 0) {
        rej(Error('No files selected'));
        return;
      }

      res(this.files);
    });

    fileInputElement.click();
  });
};

const promptExport = (note: Note) => {
  const link = document.createElement('a');

  const dateString = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const filename = `Note - ${dateString}.cryptic`;
  link.download = filename;

  const data = { type: note.type, data: note.data };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
};

export { promptExport, promptImport, parseFiles };
