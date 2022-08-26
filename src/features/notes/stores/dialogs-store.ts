import create from 'zustand';

interface DialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useEncryptionDialogStore = create<DialogState>()((set) => ({
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

export { useEncryptionDialogStore };