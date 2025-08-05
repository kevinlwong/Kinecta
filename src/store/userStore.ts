import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  occupation?: string;
  interests?: string[];
  personalBackground?: string;
  familyBackground?: string;
  culturalBackground?: string;
  languages?: string[];
  createdAt: string;
  avatar?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'email';
}

interface UserStore {
  // Authentication
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Profile
  profile: UserProfile | null;
  
  // Actions
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  loadProfile: () => void;
  saveProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  profile: null,

  // Authentication actions
  signIn: (user) => {
    set({ user, isAuthenticated: true });
    localStorage.setItem("kinecta_user", JSON.stringify(user));
    // Try to load existing profile
    get().loadProfile();
  },

  signOut: () => {
    set({ user: null, isAuthenticated: false, profile: null });
    localStorage.removeItem("kinecta_user");
    localStorage.removeItem("kinecta_profile");
  },

  // Profile actions
  loadProfile: () => {
    try {
      const user = get().user;
      if (!user) return;

      const stored = localStorage.getItem("kinecta_profile");
      if (stored) {
        const profile: UserProfile = JSON.parse(stored);
        set({ profile });
      } else {
        // Create default profile from user data
        const defaultProfile: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: new Date().toISOString(),
          avatar: user.avatar,
        };
        set({ profile: defaultProfile });
        localStorage.setItem("kinecta_profile", JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  },

  updateProfile: (profileData) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    const updatedProfile = {
      ...currentProfile,
      ...profileData,
    };

    // Update avatar URL if name changed and no custom avatar
    if (profileData.name && !profileData.avatar && !updatedProfile.avatar?.startsWith('data:')) {
      const initials = updatedProfile.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      updatedProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedProfile.name)}&background=d4a574&color=fff&size=200&format=png`;
    }
    
    set({ profile: updatedProfile });
    localStorage.setItem("kinecta_profile", JSON.stringify(updatedProfile));

    // Also update user avatar if it's the default generated one
    const currentUser = get().user;
    if (currentUser && profileData.name && !currentUser.avatar?.startsWith('data:')) {
      const updatedUser = {
        ...currentUser,
        name: updatedProfile.name,
        avatar: updatedProfile.avatar
      };
      set({ user: updatedUser });
      localStorage.setItem("kinecta_user", JSON.stringify(updatedUser));
    }
  },

  saveProfile: (profile) => {
    set({ profile });
    localStorage.setItem("kinecta_profile", JSON.stringify(profile));
  },
}));

// Initialize auth state from localStorage on app start
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem("kinecta_user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useUserStore.getState().signIn(user);
    } catch (error) {
      console.error("Failed to restore user session:", error);
      localStorage.removeItem("kinecta_user");
    }
  }
}