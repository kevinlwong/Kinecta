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
export interface ConversationMessage {
  id: string;
  content: string;
  sender: 'user' | 'ancestor';
  timestamp: Date;
}

export interface SavedConversation {
  id: string;
  ancestorName: string;
  heritage: string;
  date: string; // ISO string
  messageCount: number;
  preview: string;
  bookmarked?: boolean;
  messages?: ConversationMessage[]; // Optional for backward compatibility
  ancestorPersona?: {
    name: string;
    ethnicity: string;
    region: string;
    timePeriod: string;
    occupation: string;
    traits: string;
  };
  selectedHeritage?: {
    ethnicity: string;
    region: string;
    timePeriod: string;
    relationship: string;
    occupation: string;
    traits: string;
  };
}

interface AncestorStore {
  // Heritage selection & persona
  selectedHeritage: HeritageData | null;
  ancestorPersona: AncestorPersona | null;
  setSelectedHeritage: (heritage: HeritageData) => void;
  setAncestorPersona: (persona: AncestorPersona) => void;
  resetSelection: () => void;

  // Current conversation tracking
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;

  // Conversation history
  conversations: SavedConversation[];
  loadConversations: () => void;
  addConversation: (conv: SavedConversation) => void;
  updateConversation: (conv: SavedConversation) => void;
  deleteConversation: (id: string) => void;
  bookmarkConversation: (id: string) => void;
  shareConversation: (id: string) => void;
  resumeConversation: (conv: SavedConversation) => void;
}

export const useAncestorStore = create<AncestorStore>((set, get) => ({
  // Heritage
  selectedHeritage: null,
  ancestorPersona: null,
  setSelectedHeritage: (heritage) => set({ selectedHeritage: heritage }),
  setAncestorPersona: (persona) => set({ ancestorPersona: persona }),
  resetSelection: () => set({ selectedHeritage: null, ancestorPersona: null, currentConversationId: null }),

  // Current conversation tracking
  currentConversationId: null,
  setCurrentConversationId: (id) => set({ currentConversationId: id }),

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
    set({ conversations: updated, currentConversationId: conv.id });
    localStorage.setItem("kinecta_conversations", JSON.stringify(updated));
  },

  updateConversation: (conv) => {
    const conversations = get().conversations;
    const updated = conversations.map(existing => 
      existing.id === conv.id ? conv : existing
    );
    set({ conversations: updated });
    localStorage.setItem("kinecta_conversations", JSON.stringify(updated));
  },

  deleteConversation: (id) => {
    const updated = get().conversations.filter(conv => conv.id !== id);
    const currentId = get().currentConversationId;
    set({ 
      conversations: updated,
      currentConversationId: currentId === id ? null : currentId
    });
    localStorage.setItem("kinecta_conversations", JSON.stringify(updated));
  },

  bookmarkConversation: (id) => {
    const conversations = get().conversations;
    const updated = conversations.map(conv => 
      conv.id === id 
        ? { ...conv, bookmarked: !conv.bookmarked } 
        : conv
    );
    set({ conversations: updated });
    localStorage.setItem("kinecta_conversations", JSON.stringify(updated));
  },

  shareConversation: (id) => {
    const conversation = get().conversations.find(conv => conv.id === id);
    if (!conversation) return;
    
    const shareText = `I had a meaningful conversation with my ${conversation.heritage} ancestor ${conversation.ancestorName} on Kinecta:\n\n"${conversation.preview}"\n\nDiscover your own family heritage at Kinecta!`;
    
    if (navigator.share) {
      // Use native share API if available
      navigator.share({
        title: `Conversation with ${conversation.ancestorName}`,
        text: shareText,
        url: window.location.origin
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Conversation copied to clipboard!');
      }).catch(() => {
        // Final fallback - create a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Conversation copied to clipboard!');
      });
    }
  },

  resumeConversation: (conv) => {
    // Handle legacy conversations that don't have full ancestorPersona/selectedHeritage
    if (!conv.ancestorPersona || !conv.selectedHeritage) {
      console.warn('Cannot resume conversation: missing ancestorPersona or selectedHeritage data');
      alert('This conversation cannot be resumed as it was created in an older version. Please start a new conversation.');
      return;
    }

    // Store the messages temporarily for the chat interface to pick up (if messages exist)
    if (conv.messages && conv.messages.length > 0) {
      const tempKey = `kinecta_chat_${conv.ancestorPersona.name}_${conv.selectedHeritage.ethnicity}`;
      localStorage.setItem(tempKey, JSON.stringify(conv.messages));
    }

    // Restore the ancestor persona and heritage from the conversation
    set({
      selectedHeritage: {
        ethnicity: conv.selectedHeritage.ethnicity,
        region: conv.selectedHeritage.region,
        timePeriod: conv.selectedHeritage.timePeriod,
        relationship: conv.selectedHeritage.relationship,
        occupation: conv.selectedHeritage.occupation,
        traits: conv.selectedHeritage.traits,
      },
      ancestorPersona: {
        name: conv.ancestorPersona.name,
        ethnicity: conv.ancestorPersona.ethnicity,
        region: conv.ancestorPersona.region,
        timePeriod: conv.ancestorPersona.timePeriod,
        occupation: conv.ancestorPersona.occupation,
        traits: conv.ancestorPersona.traits,
      },
      currentConversationId: conv.id
    });
  },
}));
