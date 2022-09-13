import create from 'zustand';

interface UiState {
  isLockPopoverOpen: boolean;
  openLockPopover: () => void;
  closeLockPopover: () => void;
  toggleLockPopover: () => void;
}

const useUiStore = create<UiState>()((set) => ({
  isLockPopoverOpen: false,

  openLockPopover: () => set(() => ({ isLockPopoverOpen: true })),
  closeLockPopover: () => set(() => ({ isLockPopoverOpen: false })),
  toggleLockPopover: () => set((state) => ({ isLockPopoverOpen: !state.isLockPopoverOpen })),
}));

export { useUiStore };
