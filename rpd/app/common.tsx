
import { YouTubePlayer } from 'youtube-player/dist/types';
import { YouTubeEvent } from 'react-youtube';
import create from 'zustand';

interface Store {
  player: any; // Change 'any' to the type of player if known
  endEvent: any; // Change 'any' to the type of endEvent if known
  initialized: boolean;
  setPlayer: (newValue: any) => void; // Change 'any' to the type of player if known
  setEndEvent: (newValue: any) => void; // Change 'any' to the type of endEvent if known
}

export const useStore = create<Store>((set) => ({
  player: null,
  endEvent: null,
  initialized: false,
  setPlayer: (newValue) => set({ player: newValue, initialized: true }),
  setEndEvent: (newValue) => set({ endEvent: newValue }),
}));

export interface Video {
    id?: string,
    title?: string,
    channel?: string,
}