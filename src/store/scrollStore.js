import { create } from 'zustand';

const useScrollStore = create((set) => ({
  scroll: 0,
  direction: '',
  speed: 0,
  setScroll: (value) => set({ scroll: value }),
  setDirection: (value) => set({ direction: value }),
  setSpeed: (value) => set({ speed: value }),
}));

export default useScrollStore;
