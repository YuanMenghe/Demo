import { create } from 'zustand';

export type LymphomaSubtype = 'DLBCL' | 'FL' | 'MCL' | 'Other' | '';

export interface CaseDraft {
  id?: string;
  chiefComplaint: string;
  subtype: LymphomaSubtype;
  annArborStaging: string;
  // Specific scores based on subtype
  age?: string;
  ldh?: string;
  ecog?: string;
  extranodal?: string;
  // ...other fields
  attachments: { name: string; size: string }[];
}

export interface CaseHistory {
  id: string;
  title: string;
  subtype: string;
  status: 'analyzing' | 'completed';
  updatedAt: string;
}

export type UserRole = 'doctor' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  dept: string;
  role: UserRole;
  expiresAt?: string; // yyyy-mm-dd
}

interface AppState {
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
  
  draft: CaseDraft | null;
  updateDraft: (update: Partial<CaseDraft>) => void;
  clearDraft: () => void;
  
  history: CaseHistory[];
  addHistory: (record: CaseHistory) => void;
  removeHistory: (id: string) => void;
  updateHistoryTitle: (id: string, title: string) => void;

  currentUser: AppUser;
  setCurrentUser: (user: Partial<AppUser>) => void;

  users: AppUser[];
  updateUser: (id: string, patch: Partial<AppUser>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),
  
  draft: {
    chiefComplaint: '',
    subtype: '',
    annArborStaging: '',
    attachments: [],
  }, // Pre-existing draft to show the banner
  
  updateDraft: (update) => set((state) => ({
    draft: state.draft ? { ...state.draft, ...update } : {
      chiefComplaint: '',
      subtype: '',
      annArborStaging: '',
      attachments: [],
      ...update
    }
  })),
  
  clearDraft: () => set({ draft: null }),
  
  history: [
    {
      id: '1',
      title: '60岁男性无痛性颈部肿块',
      subtype: 'DLBCL',
      status: 'completed',
      updatedAt: '2023-10-24 14:30'
    },
    {
      id: '2',
      title: '复发滤泡性淋巴瘤咨询',
      subtype: 'FL',
      status: 'analyzing',
      updatedAt: '2023-10-24 10:15'
    }
  ],
  
  addHistory: (record) => set((state) => ({ history: [record, ...state.history] })),
  removeHistory: (id) => set((state) => ({ history: state.history.filter(h => h.id !== id) })),
  updateHistoryTitle: (id, title) => set((state) => ({
    history: state.history.map(h => h.id === id ? { ...h, title } : h)
  })),

  currentUser: {
    id: 'u-admin',
    name: '张医生',
    dept: '血液科',
    role: 'admin',
    expiresAt: '2026-05-20',
  },
  setCurrentUser: (user) => set((state) => ({ currentUser: { ...state.currentUser, ...user } })),

  users: [
    { id: 'u-admin', name: '张医生', dept: '血液科', role: 'admin', expiresAt: '2026-05-20' },
    { id: 'u-2', name: '李医生', dept: '肿瘤科', role: 'admin', expiresAt: '2026-05-08' },
    { id: 'u-3', name: '王护士', dept: '血液科', role: 'doctor', expiresAt: '2026-12-31' },
  ],
  updateUser: (id, patch) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),
}));
