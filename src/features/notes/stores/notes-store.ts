import create from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import without from 'lodash/without';
import omit from 'lodash/omit';

import { encrypt, KeyData } from '../../crypto';

type RemoveNameField<Type, Keys> = {
  [Property in keyof Type as Exclude<Property, Keys>]: Type[Property];
};

type NoteId = string;

type PlainNote = {
  id: NoteId;
  type: 'plain';
  title: string;
  credentials?: KeyData;
  data: string;
};

type EncryptedNote = {
  id: NoteId;
  type: 'encrypted';
  title: string;
  data: {
    iv: string;
    salt: string;
    ciphertext: string;
  };
};

type Note = PlainNote | EncryptedNote;
type ExternalNote = Omit<PlainNote, 'id' | 'credentials'> | Omit<EncryptedNote, 'id'>;

interface NotesState {
  allIds: NoteId[];
  byId: Record<NoteId, Note>;
  selectedNoteId: NoteId;

  createNewNote: () => void;
  addExternalNote: (noteData: ExternalNote) => void;
  deleteNote: (id: NoteId) => void;
  selectNote: (id: NoteId) => void;
  changeNote: (id: NoteId, noteData: RemoveNameField<Note, 'id'>) => void;
}

const createDefaultState = () => {
  const id = uuidv4();
  const placeholderNote: Note = {
    id,
    type: 'plain',
    title: 'Untitled Note',
    data: '',
  };

  return {
    allIds: [id],
    byId: { [id]: placeholderNote },
    selectedNoteId: id,
  };
};

const persistConfig: PersistOptions<NotesState> = {
  name: 'cryptic-notes',
  serialize: async (store) => {
    const persistedNotesById: NotesState['byId'] = {};

    for (const id of store.state.allIds) {
      const note = store.state.byId[id];

      if (note.type === 'plain' && note.credentials) {
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

const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      createNewNote: () => {
        const id = uuidv4();
        const newNote: Note = {
          id,
          type: 'plain',
          title: 'Untitled Note',
          data: '',
        };

        set((state) => ({
          ...state,
          allIds: [id, ...state.allIds],
          byId: { ...state.byId, [id]: newNote },
          selectedNoteId: id,
        }));
      },
      addExternalNote: (noteData) => {
        const id = uuidv4();
        const newNote: Note = { id, ...noteData };

        const currentState = get();
        const hasOneNote = currentState.allIds.length === 1;
        const firstNote = currentState.byId[currentState.allIds[0]];
        const isFirstNoteEmpty = firstNote.type !== 'encrypted' && firstNote.data === '';
        const isPristine = hasOneNote && isFirstNoteEmpty;

        set((state) => ({
          ...state,
          allIds: isPristine ? [id] : [...state.allIds, id],
          byId: isPristine ? { [id]: newNote } : { ...state.byId, [id]: newNote },
          selectedNoteId: isPristine ? id : state.selectedNoteId,
        }));
      },
      deleteNote: (id) =>
        set((state) => {
          if (state.allIds.length <= 1) return createDefaultState();

          const allIds = without(state.allIds, id);
          const byId = omit(state.byId, id);
          const selectedNoteId = allIds[0];

          return { ...state, allIds, byId, selectedNoteId };
        }),
      selectNote: (id) => set((state) => ({ ...state, selectedNoteId: id })),
      changeNote: (id, noteData) =>
        set((state) => ({
          ...state,
          allIds: [id, ...without(state.allIds, id)],
          byId: { ...state.byId, [id]: { id, ...noteData } },
        })),
    }),
    persistConfig
  )
);

export type { NoteId, EncryptedNote, PlainNote, Note, ExternalNote, RemoveNameField };
export { useNotesStore };
