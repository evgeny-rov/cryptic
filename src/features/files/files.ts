export const readFiles = async (files: FileList) =>
  Promise.all([...files].map((file) => file.text()));

export const promptImport = (): Promise<FileList> => {
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

export const promptExport = (filename: string, data: string, type = 'application/json') => {
  const fileLink = document.createElement('a');
  fileLink.download = filename;

  const blob = new Blob([data], { type });

  fileLink.href = URL.createObjectURL(blob);
  fileLink.click();
  URL.revokeObjectURL(fileLink.href);
};
