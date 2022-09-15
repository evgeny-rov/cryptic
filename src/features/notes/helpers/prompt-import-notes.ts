import { z } from 'zod';
import { promptImport, readFiles } from '../../files';
import type { ExternalNote } from '../stores/notes-store';

const plainNoteSchema = z.object({
  type: z.literal('plain'),
  title: z.string(),
  data: z.string(),
});

const encryptedNoteSchema = z.object({
  type: z.literal('encrypted'),
  title: z.string(),
  data: z.object({
    salt: z.string().min(1),
    iv: z.string().min(1),
    ciphertext: z.string().min(1),
  }),
});

const noteSchema: z.ZodType<ExternalNote> = z.union([plainNoteSchema, encryptedNoteSchema]);

interface ParsedNotes {
  successful: z.infer<typeof noteSchema>[];
  failed: unknown[];
}

const parseNotes = (maybeSerializedNotes: string[]): ParsedNotes => {
  const result: ParsedNotes = { successful: [], failed: [] };

  for (const item of maybeSerializedNotes) {
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

export default async () => {
  const pickedFiles = await promptImport();
  const maybeSerializedNotes = await readFiles(pickedFiles);
  const importedNotes = parseNotes(maybeSerializedNotes);

  return importedNotes;
};
