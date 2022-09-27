import create from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import without from 'lodash/without';
import omit from 'lodash/omit';
import zipObject from 'lodash/zipObject';

import { createKey, decrypt, encrypt, KeyData } from '../../crypto';
import type { RemoveNameField } from '../types';

type NoteId = string;
type NoteType = 'plain' | 'unlocked' | 'encrypted';
type NoteTitle = string;

interface BaseNote {
  id: NoteId;
  type: NoteType;
  title: NoteTitle;
}

export interface PlainNote extends BaseNote {
  type: 'plain';
  data: string;
}

export interface UnlockedNote extends BaseNote {
  type: 'unlocked';
  data: string;
  credentials: KeyData;
}

export interface EncryptedNote extends BaseNote {
  type: 'encrypted';
  data: {
    iv: string;
    salt: string;
    ciphertext: string;
  };
}

export type Note = PlainNote | UnlockedNote | EncryptedNote;
export type EditableNote = PlainNote | UnlockedNote;
export type ExternalNote = RemoveNameField<PlainNote | EncryptedNote, 'id'>;

interface NotesState {
  allIds: NoteId[];
  byId: Record<NoteId, Note>;
  selectedNoteId: NoteId;

  createNewNote: () => void;
  selectNote: (id: NoteId) => void;
  changeNoteText: (id: NoteId, text: string) => void;
  changeNoteTitle: (id: NoteId, title: string) => void;
  deleteNote: (id: NoteId) => void;

  addLock: (note: EditableNote, password: string) => Promise<void>;
  lockNote: (note: UnlockedNote) => Promise<void>;
  unlockNote: (note: EncryptedNote, password: string) => Promise<void>;
  removeLock: (note: UnlockedNote) => void;

  importNotes: (notes: ExternalNote[]) => void;
}

const createPlainNote = (): PlainNote => ({
  id: uuidv4(),
  type: 'plain',
  title: '',
  data: '',
});

const createDefaultState = () => {
  const placeholderNote = createPlainNote();

  return {
    allIds: [placeholderNote.id],
    byId: { [placeholderNote.id]: placeholderNote },
    selectedNoteId: placeholderNote.id,
  };
};

const persistConfig: PersistOptions<NotesState> = {
  name: 'cryptic-notes',
  serialize: async (store) => {
    const persistedNotesById: NotesState['byId'] = {};

    for (const id of store.state.allIds) {
      const note = store.state.byId[id];

      if (note.type === 'unlocked') {
        const cipher = await encrypt(note.data, note.credentials);
        persistedNotesById[id] = { id, type: 'encrypted', title: note.title, data: cipher };
      } else {
        persistedNotesById[id] = note;
      }
    }

    const storeToPersist: typeof store = {
      ...store,
      state: {
        ...store.state,
        byId: persistedNotesById,
      },
    };

    return JSON.stringify(storeToPersist);
  },
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      createNewNote: () => {
        const newNote = createPlainNote();

        set((state) => ({
          allIds: [newNote.id, ...state.allIds],
          byId: { ...state.byId, [newNote.id]: newNote },
          selectedNoteId: newNote.id,
        }));
      },
      selectNote: (id) => set((state) => ({ ...state, selectedNoteId: id })),
      changeNoteText: (id, text) => {
        const note = get().byId[id];

        if (note.type === 'encrypted') return;

        set((state) => ({
          allIds: [id, ...without(state.allIds, id)],
          byId: { ...state.byId, [id]: { ...note, data: text } },
        }));
      },
      changeNoteTitle: (id, title) => {
        const note = get().byId[id];

        if (note.type === 'encrypted') return;

        set((state) => ({
          byId: { ...state.byId, [id]: { ...note, title } },
        }));
      },
      deleteNote: (id) =>
        set((state) => {
          if (state.allIds.length <= 1) return createDefaultState();

          const allIds = without(state.allIds, id);
          const byId = omit(state.byId, id);

          const currentNoteIdx = state.allIds.findIndex((noteId) => noteId === id);
          const replacingIdx = Math.min(currentNoteIdx, allIds.length - 1);

          const selectedNoteId = allIds[replacingIdx];

          return { allIds, byId, selectedNoteId };
        }),
      addLock: async (note, password) => {
        const newKey = await createKey(password);
        const cipher = await encrypt(note.data, newKey);
        const lockedNote: EncryptedNote = { ...note, type: 'encrypted', data: cipher };

        set((state) => ({ byId: { ...state.byId, [note.id]: lockedNote } }));
      },
      lockNote: async (note) => {
        const cipher = await encrypt(note.data, note.credentials);
        const lockedNote: EncryptedNote = { ...note, type: 'encrypted', data: cipher };

        set((state) => ({ byId: { ...state.byId, [note.id]: lockedNote } }));
      },
      unlockNote: async (note, password) => {
        const credentials = await createKey(password, note.data.salt);
        const text = await decrypt(note.data, credentials);
        const unlockedNote: UnlockedNote = { ...note, type: 'unlocked', data: text, credentials };

        set((state) => ({ byId: { ...state.byId, [note.id]: unlockedNote } }));
      },
      removeLock: (note) => {
        const { credentials, ...noteData } = note;
        const plainNote: PlainNote = { ...noteData, type: 'plain' };
        set((state) => ({ byId: { ...state.byId, [note.id]: plainNote } }));
      },
      importNotes: (notes) => {
        if (notes.length === 0) return;

        const notesWithIds = notes.map((note) => ({ id: uuidv4(), ...note }));
        const ids = notesWithIds.map((note) => note.id);
        const zippedById = zipObject(ids, notesWithIds);

        const currentState = get();
        const hasOneNote = currentState.allIds.length === 1;
        const firstNote = currentState.byId[currentState.allIds[0]];
        const isFirstNoteEmpty = firstNote.type !== 'encrypted' && firstNote.data === '';
        const isPristine = hasOneNote && isFirstNoteEmpty;

        set((state) => ({
          allIds: isPristine ? ids : [...state.allIds, ...ids],
          byId: isPristine ? zippedById : { ...state.byId, ...zippedById },
          selectedNoteId: ids[0],
        }));
      },
    }),
    persistConfig
  )
);
