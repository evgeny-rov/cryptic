import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import without from 'lodash/without';
import omit from 'lodash/omit';

type NoteId = string;

interface Note {
  id: NoteId;
  type: 'encrypted' | 'plain';
  data: string;
}

interface NotesState {
  allIds: NoteId[];
  byId: Record<NoteId, Note>;
  selectedNoteId: NoteId;

  createNote: () => void;
  updateNote: (id: NoteId, updateNote: Note) => void;
  deleteNote: (id: NoteId) => void;
  selectNote: (id: NoteId) => void;
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
  updateNote: (id, updatedNote) =>
    set((state) => ({
      ...state,
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
