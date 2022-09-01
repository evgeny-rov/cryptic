import create from 'zustand';

interface DialogsState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useNoteAccessDialog = create<DialogsState>()((set) => ({
  isOpen: false,

  open: () => {
    set((state) => ({ ...state, isOpen: true }));
  },

  close: () => {
    set((state) => ({ ...state, isOpen: false }));
  },

  toggle: () => {
    set((state) => ({ ...state, isOpen: !state.isOpen }));
  },
}));

export { useNoteAccessDialog };
