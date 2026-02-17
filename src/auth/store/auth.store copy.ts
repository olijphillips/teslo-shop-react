import { create } from "zustand";

type Store = {
  count: number;
  inc: () => void;
  dec: () => void;
  incBy: (value: number) => void;
};

export const useCounterStore = create<Store>()((set) => ({
  count: 100,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  incBy: (value: number) => set((state) => ({ count: state.count + value })),
}));
