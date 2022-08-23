import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import without from 'lodash/without';
import omit from 'lodash/omit';

type NoteId = string;

interface PlainNote {
  id: NoteId;
  type: 'plain';
  data: string;
}

interface EncryptedNote {
  id: NoteId;
  type: 'encrypted';
  data: {
    iv: string;
    salt: string;
    ciphertext: string;
  };
}

type Note = PlainNote | EncryptedNote;
type PartialNote = Omit<PlainNote, 'id'> | Omit<EncryptedNote, 'id'>;

interface NotesState {
  allIds: NoteId[];
  byId: Record<NoteId, Note>;
  selectedNoteId: NoteId;

  createNote: () => void;
  updateNote: (id: NoteId, updateNote: Note) => void;
  deleteNote: (id: NoteId) => void;
  selectNote: (id: NoteId) => void;
  appendExternalNotes: (partialNote: PartialNote[]) => void;
}

const createDefaultState = () => {
  const id = uuidv4();
  const emptyNote: Note = { id, type: 'plain', data: '' };

  return {
    allIds: [id],
    byId: { [id]: emptyNote },
    selectedNoteId: id,
  };
};

const useNotesStore = create<NotesState>()((set) => ({
  ...createDefaultState(),

  createNote: () => {
    const id = uuidv4();
    const newNote: Note = { id, type: 'plain', data: '' };

    set((state) => ({
      ...state,
      allIds: [id, ...state.allIds],
      byId: { ...state.byId, [id]: newNote },
      selectedNoteId: id,
    }));
  },
  appendExternalNotes(partialNotes) {
    const prepared = partialNotes.reduce<Pick<NotesState, 'allIds' | 'byId'>>(
      (acc, partialNote) => {
        const id = uuidv4();
        const newNote = { id, ...partialNote };

        return { ...acc, allIds: [...acc.allIds, id], byId: { ...acc.byId, [id]: newNote } };
      },
      { allIds: [], byId: {} }
    );

    set((state) => ({
      ...state,
      allIds: [...state.allIds, ...prepared.allIds],
      byId: { ...state.byId, ...prepared.byId },
    }));
  },
  updateNote: (id, updatedNote) =>
    set((state) => ({
      ...state,
      allIds: [id, ...without(state.allIds, id)],
      byId: { ...state.byId, [id]: updatedNote },
    })),
  deleteNote: (id) =>
    set((state) => {
      if (state.allIds.length <= 1) return createDefaultState();

      const allIds = without(state.allIds, id);
      const byId = omit(state.byId, id);
      const selectedNoteId = allIds[0];

      return { ...state, allIds, byId, selectedNoteId };
    }),
  selectNote: (id) => set((state) => ({ ...state, selectedNoteId: id })),
}));

export type { NoteId, Note };
export { useNotesStore };
