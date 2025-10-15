import { z } from 'zod';
import { promptImport, readFiles } from '../../files';
import type { BaseState, ExternalNote } from '../stores/notes-store';

const plainNoteSchema = z.object({
  type: z.literal('plain'),
  id: z.string(),
  title: z.string(),
  data: z.string(),
});

const encryptedNoteSchema = z.object({
  type: z.literal('encrypted'),
  title: z.string(),
  id: z.string(),
  data: z.object({
    salt: z.string().min(1),
    iv: z.string().min(1),
    ciphertext: z.string().min(1),
  }),
});

const noteSchema = z.union([plainNoteSchema, encryptedNoteSchema]);
const NotesByIdSchema = z.record(noteSchema);

const stateSchema = z.object({
  allIds: z.array(z.string().uuid()),
  byId: NotesByIdSchema,
  selectedNoteId: z.string().uuid(),
});

const storeSchema = z.object({
  state: stateSchema,
});

const parseStore = (maybeStore: string[]): BaseState | null => {
  const maybeStoreFirst = maybeStore[0];

  if (!maybeStoreFirst) return null;

  try {
    const json = JSON.parse(JSON.parse(maybeStoreFirst));
    const store = storeSchema.parse(json);

    return store.state;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default async () => {
  const pickedFiles = await promptImport();
  const maybeSerializedStore = await readFiles(pickedFiles);
  const importedNotes = parseStore(maybeSerializedStore);

  return importedNotes;
};
