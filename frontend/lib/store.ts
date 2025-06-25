import { create } from 'zustand';

interface State {
  price: string;
  key: number;
  title: string;
}

interface Actions {
  setPrice: (figure: string) => void;
  setKey: (index: number) => void;
  setTitle: (value: string) => void;
  setMembership: (membership: { price: string; key: number; title: string }) => void;
  reset: () => void;
}

const initialStoreState: State = {
  price: '',
  key: 0,
  title: '',
};
//Generalize
export const useMembershipStore = create<State & Actions>((set) => ({
  ...initialStoreState,
  setPrice: (figure) => set({ price: figure }),
  setKey: (index) => set({ key: index }),
  setTitle: (value) => set({ title: value }),
  setMembership: ({ price, key, title }) => set({ price, key, title }),
  reset: () => set(initialStoreState),
}));