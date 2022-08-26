import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import without from 'lodash/without';
import omit from 'lodash/omit';

type NoteId = string;

interface PlainNote {
  id: NoteId;
  type: 'plain';
  title: string;
  data: string;
}

interface EncryptedNote {
  id: NoteId;
  type: 'encrypted';
  title: string;
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
  addNote: (noteData: PartialNote) => void;
  updateNote: (id: NoteId, updatedNote: Note) => void;
  deleteNote: (id: NoteId) => void;
  selectNote: (id: NoteId) => void;
}

const createDefaultState = () => {
  const id = uuidv4();
  const emptyNote: Note = {
    id,
    type: 'plain',
    title: 'Untitled Note',
    data: '',
  };

  return {
    allIds: [id],
    byId: { [id]: emptyNote },
    selectedNoteId: id,
  };
};

const useNotesStore = create<NotesState>()((set, get) => ({
  ...createDefaultState(),

  createNote: () => {
    const id = uuidv4();
    const newNote: Note = { id, type: 'plain', title: 'Untitled Note', data: '' };

    set((state) => ({
      ...state,
      allIds: [id, ...state.allIds],
      byId: { ...state.byId, [id]: newNote },
      selectedNoteId: id,
    }));
  },
  addNote: (noteData) => {
    const id = uuidv4();
    const newNote = { id, ...noteData };

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

export type { NoteId, EncryptedNote, PlainNote, Note };
export { useNotesStore };
