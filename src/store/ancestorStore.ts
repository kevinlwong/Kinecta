import { create } from "zustand";

// Types for heritage and persona
export interface HeritageData {
  ethnicity: string;
  region: string;
  timePeriod: string;
  relationship: string;
  occupation: string;
  traits: string;
}

export interface AncestorPersona {
  name: string;
  ethnicity: string;
  region: string;
  timePeriod: string;
  occupation: string;
  traits: string;
}

// Conversation history type
export interface SavedConversation {
  id: string;
  ancestorName: string;
  heritage: string;
  date: string; // ISO string
  messageCount: number;
  preview: string;
}

interface AncestorStore {
  // Heritage selection & persona
  selectedHeritage: HeritageData | null;
  ancestorPersona: AncestorPersona | null;
  setSelectedHeritage: (heritage: HeritageData) => void;
  setAncestorPersona: (persona: AncestorPersona) => void;
  resetSelection: () => void;

  // Conversation history
  conversations: SavedConversation[];
  loadConversations: () => void;
  addConversation: (conv: SavedConversation) => void;
  bookmarkConversation: (id: string) => void;
  shareConversation: (id: string) => void;
}

export const useAncestorStore = create<AncestorStore>((set, get) => ({
  // Heritage
  selectedHeritage: null,
  ancestorPersona: null,
  setSelectedHeritage: (heritage) => set({ selectedHeritage: heritage }),
  setAncestorPersona: (persona) => set({ ancestorPersona: persona }),
  resetSelection: () => set({ selectedHeritage: null, ancestorPersona: null }),

  // Conversations
  conversations: [],

  loadConversations: () => {
    try {
      const stored = localStorage.getItem("kinecta_conversations");
      const parsed: SavedConversation[] = stored ? JSON.parse(stored) : [];
      set({ conversations: parsed });
    } catch {
      set({ conversations: [] });
    }
  },

  addConversation: (conv) => {
    const updated = [...get().conversations, conv];
    set({ conversations: updated });
    localStorage.setItem("kinecta_conversations", JSON.stringify(updated));
  },

  bookmarkConversation: (id) => {
    // TODO: implement bookmark logic (e.g. mark flag, persist separately)
    console.log("Bookmark conversation", id);
  },

  shareConversation: (id) => {
    // TODO: implement share logic (open share UI, clipboard, etc.)
    console.log("Share conversation", id);
  },
}));
