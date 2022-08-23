import { z } from 'zod';

const plainNoteSchema = z.object({
  type: z.literal('plain'),
  data: z.string().min(1),
});

const encryptedNoteSchema = z.object({
  type: z.literal('encrypted'),
  data: z.object({
    salt: z.string().min(1),
    iv: z.string().min(1),
    ciphertext: z.string().min(1),
  }),
});

const noteSchema = z.union([plainNoteSchema, encryptedNoteSchema]);

interface ParsedNotes {
  successful: z.infer<typeof noteSchema>[];
  failed: unknown[];
}

const parseNotes = (someDataList: string[]): ParsedNotes => {
  const result: ParsedNotes = { successful: [], failed: [] };

  for (const item of someDataList) {
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

export { parseNotes };
