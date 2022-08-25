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
  const fileLink = document.createElement('a');

  const date = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const filename = `${note.title} - ${date}.cryptic`;
  fileLink.download = filename;

  const data = { type: note.type, title: note.title, data: note.data };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

  fileLink.href = URL.createObjectURL(blob);
  fileLink.click();
  URL.revokeObjectURL(fileLink.href);
};

export { promptExport, promptImport, parseFiles };
