import { z } from 'zod';
import type { ExternalNote, Note } from '../stores/notes-store';

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

  const { id, ...noteData } = note;
  const data: z.infer<typeof noteSchema> = noteData;

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

  fileLink.href = URL.createObjectURL(blob);
  fileLink.click();
  URL.revokeObjectURL(fileLink.href);
};

const parseFiles = async (files: FileList) => {
  return Promise.all([...files].map((file) => file.text()));
};

const plainNoteSchema = z
  .object({
    type: z.literal('plain'),
    title: z.string(),
    data: z.string().min(1),
  })
  .strip();

const encryptedNoteSchema = z
  .object({
    type: z.literal('encrypted'),
    title: z.string(),
    data: z.object({
      salt: z.string().min(1),
      iv: z.string().min(1),
      ciphertext: z.string().min(1),
    }),
  })
  .strip();

const noteSchema: z.ZodType<ExternalNote> = z.union([plainNoteSchema, encryptedNoteSchema]);

interface ParsedNotes {
  successful: z.infer<typeof noteSchema>[];
  failed: unknown[];
}

const parseNotes = (maybeNotesList: string[]): ParsedNotes => {
  const result: ParsedNotes = { successful: [], failed: [] };

  for (const item of maybeNotesList) {
    try {
      const json = JSON.parse(item);
      const note = noteSchema.parse(json);

      result.successful.push(note);
    } catch (e) {
      result.failed.push(e);
    }
  }

  return result;
};

export { promptExport, promptImport, parseFiles, parseNotes };
