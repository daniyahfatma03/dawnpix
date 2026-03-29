import { create } from 'zustand';

export type MoodFilter = 'none' | 'dreamy' | 'vintage' | 'y2k' | 'dark' | 'cute';
export type FrameTheme = 'none' | 'holiday' | 'summer' | 'birthday';

interface SessionState {
  // Config
  layout: number;
  countdown: number;
  burstMode: boolean;
  dailyThemeId?: string;
  
  // Capture
  photos: string[];
  
  // Edit
  filter: MoodFilter;
  frame: FrameTheme;
  overlayText: string;
  hasSparkles: boolean;
  
  // Actions
  setSetup: (layout: number, countdown: number, burstMode: boolean, dailyThemeId?: string) => void;
  addPhoto: (dataUrl: string) => void;
  setPhotos: (photos: string[]) => void;
  setEditOptions: (options: Partial<Pick<SessionState, 'filter' | 'frame' | 'overlayText' | 'hasSparkles'>>) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  layout: 3,
  countdown: 3,
  burstMode: false,
  dailyThemeId: undefined,
  
  photos: [],
  
  filter: 'none',
  frame: 'none',
  overlayText: '',
  hasSparkles: false,
  
  setSetup: (layout, countdown, burstMode, dailyThemeId) => 
    set({ layout, countdown, burstMode, dailyThemeId }),
    
  addPhoto: (dataUrl) => 
    set((state) => ({ photos: [...state.photos, dataUrl] })),
    
  setPhotos: (photos) => set({ photos }),
    
  setEditOptions: (options) => 
    set((state) => ({ ...state, ...options })),
    
  reset: () => set({
    layout: 3,
    countdown: 3,
    burstMode: false,
    photos: [],
    filter: 'none',
    frame: 'none',
    overlayText: '',
    hasSparkles: false,
    dailyThemeId: undefined
  }),
}));
