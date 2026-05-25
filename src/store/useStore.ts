import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Character, CartoonVideo, Notification, SubscriptionTier } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Characters
  characters: Character[];
  selectedCharacter: Character | null;

  // Videos
  videos: CartoonVideo[];
  selectedVideo: CartoonVideo | null;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Admin
  isAdmin: boolean;
  allUsers: User[];

  // Actions - Auth
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;

  // Actions - Characters
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setSelectedCharacter: (character: Character | null) => void;
  toggleFavorite: (id: string) => void;

  // Actions - Videos
  addVideo: (video: CartoonVideo) => void;
  updateVideo: (id: string, updates: Partial<CartoonVideo>) => void;
  deleteVideo: (id: string) => void;
  setSelectedVideo: (video: CartoonVideo | null) => void;

  // Actions - Subscription
  upgradeSubscription: (tier: SubscriptionTier) => Promise<boolean>;

  // Actions - Notifications
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;

  // Admin Actions
  loadAllUsers: () => Promise<void>;
  updateUserSubscription: (userId: string, tier: SubscriptionTier) => void;
  deleteUser: (userId: string) => void;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@cartoonai.com',
    name: 'Admin User',
    subscription: 'studio',
    role: 'admin',
    createdAt: '2024-01-01',
    charactersCreated: 45,
    videosCreated: 12,
  },
  {
    id: '2',
    email: 'creator@test.com',
    name: 'Creative Sarah',
    subscription: 'pro',
    role: 'user',
    createdAt: '2024-02-15',
    charactersCreated: 23,
    videosCreated: 8,
  },
  {
    id: '3',
    email: 'user@test.com',
    name: 'John Doe',
    subscription: 'free',
    role: 'user',
    createdAt: '2024-03-10',
    charactersCreated: 3,
    videosCreated: 1,
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char1',
    name: 'Super Kitty',
    userId: '1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    customization: {
      body: 'body1',
      head: 'head2',
      eyes: 'eyes2',
      mouth: 'mouth1',
      hair: 'hair3',
      accessories: 'crown',
      outfit: 'hero',
      skinColor: '#FFD93D',
      hairColor: '#FF6B6B',
      eyeColor: '#6C5CE7',
      outfitColor: '#FF6B6B',
      backgroundColor: '#A29BFE',
      name: 'Super Kitty',
    },
    animations: ['wave', 'jump'],
    isFavorite: true,
  },
  {
    id: 'char2',
    name: 'Space Explorer',
    userId: '1',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    customization: {
      body: 'body3',
      head: 'head1',
      eyes: 'eyes4',
      mouth: 'mouth2',
      hair: 'hair1',
      accessories: 'none',
      outfit: 'robot',
      skinColor: '#C0C0C0',
      hairColor: '#333333',
      eyeColor: '#00B894',
      outfitColor: '#2D3436',
      backgroundColor: '#0B0B3B',
      name: 'Space Explorer',
    },
    animations: ['run'],
    isFavorite: false,
  },
];

const MOCK_VIDEOS: CartoonVideo[] = [
  {
    id: 'vid1',
    title: 'Super Kitty Adventures',
    description: 'Episode 1: The Missing Yarn',
    userId: '1',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    duration: 120,
    scenes: [],
    status: 'ready',
    quality: '1080p',
    tags: ['cartoon', 'kids', 'adventure'],
    views: 1250,
    likes: 340,
  },
  {
    id: 'vid2',
    title: 'Space Explorer: Lost in Galaxy',
    description: 'Episode 1: The Beginning',
    userId: '1',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    duration: 180,
    scenes: [],
    status: 'draft',
    quality: '720p',
    tags: ['space', 'adventure', 'kids'],
    views: 0,
    likes: 0,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Video Ready!',
    message: '"Super Kitty Adventures" has finished rendering and is ready to watch.',
    type: 'success',
    read: false,
    createdAt: '2024-01-22T10:30:00Z',
  },
  {
    id: 'n2',
    title: 'Subscription Renewed',
    message: 'Your Creator Pro subscription has been renewed for another month.',
    type: 'info',
    read: false,
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'n3',
    title: 'New Feature Available',
    message: 'Try our new 4K export feature! Available for Studio Pro subscribers.',
    type: 'info',
    read: true,
    createdAt: '2024-01-18T14:00:00Z',
  },
];

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  characters: MOCK_CHARACTERS,
  selectedCharacter: null,
  videos: MOCK_VIDEOS,
  selectedVideo: null,
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
  isAdmin: false,
  allUsers: MOCK_USERS,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isLoading: false,
      });
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser: User = {
      id: generateId(),
      email,
      name,
      subscription: 'free',
      role: 'user',
      createdAt: new Date().toISOString(),
      charactersCreated: 0,
      videosCreated: 0,
    };

    set({
      user: newUser,
      isAuthenticated: true,
      isAdmin: false,
      isLoading: false,
    });
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    return true;
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },

  loadUser: async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        set({ user, isAuthenticated: true, isAdmin: user.role === 'admin' });
      }
    } catch (e) {
      console.error('Failed to load user', e);
    }
  },

  addCharacter: (character: Character) => {
    set(state => ({
      characters: [character, ...state.characters],
    }));
    if (get().user) {
      set(state => ({
        user: state.user ? { ...state.user, charactersCreated: state.user.charactersCreated + 1 } : null,
      }));
    }
  },

  updateCharacter: (id: string, updates: Partial<Character>) => {
    set(state => ({
      characters: state.characters.map(c => c.id === id ? { ...c, ...updates } : c),
      selectedCharacter: state.selectedCharacter?.id === id
        ? { ...state.selectedCharacter, ...updates } : state.selectedCharacter,
    }));
  },

  deleteCharacter: (id: string) => {
    set(state => ({
      characters: state.characters.filter(c => c.id !== id),
      selectedCharacter: state.selectedCharacter?.id === id ? null : state.selectedCharacter,
    }));
  },

  setSelectedCharacter: (character: Character | null) => set({ selectedCharacter: character }),

  toggleFavorite: (id: string) => {
    set(state => ({
      characters: state.characters.map(c =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      ),
    }));
  },

  addVideo: (video: CartoonVideo) => {
    set(state => ({ videos: [video, ...state.videos] }));
  },

  updateVideo: (id: string, updates: Partial<CartoonVideo>) => {
    set(state => ({
      videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v),
      selectedVideo: state.selectedVideo?.id === id
        ? { ...state.selectedVideo, ...updates } : state.selectedVideo,
    }));
  },

  deleteVideo: (id: string) => {
    set(state => ({
      videos: state.videos.filter(v => v.id !== id),
      selectedVideo: state.selectedVideo?.id === id ? null : state.selectedVideo,
    }));
  },

  setSelectedVideo: (video: CartoonVideo | null) => set({ selectedVideo: video }),

  upgradeSubscription: async (tier: SubscriptionTier) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { user } = get();
    if (user) {
      const updatedUser = { ...user, subscription: tier };
      set({ user: updatedUser, isLoading: false });
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      get().addNotification({
        title: 'Subscription Upgraded! 🎉',
        message: `You are now on the ${tier === 'pro' ? 'Creator Pro' : 'Studio Pro'} plan!`,
        type: 'success',
      });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  markNotificationRead: (id: string) => {
    set(state => {
      const notifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter(n => !n.read).length };
    });
  },

  markAllRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  addNotification: (notification) => {
    const newNotif: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  loadAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ allUsers: MOCK_USERS });
  },

  updateUserSubscription: (userId: string, tier: SubscriptionTier) => {
    set(state => ({
      allUsers: state.allUsers.map(u => u.id === userId ? { ...u, subscription: tier } : u),
    }));
  },

  deleteUser: (userId: string) => {
    set(state => ({ allUsers: state.allUsers.filter(u => u.id !== userId) }));
  },
}));
