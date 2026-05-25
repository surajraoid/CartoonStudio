export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: SubscriptionTier;
  role: 'user' | 'admin';
  createdAt: string;
  charactersCreated: number;
  videosCreated: number;
}

export type SubscriptionTier = 'free' | 'pro' | 'studio';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: string;
  color: string[];
  popular?: boolean;
  features: string[];
  limitations: string[];
}

export interface Character {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  customization: CharacterCustomization;
  animations: string[];
  isFavorite: boolean;
}

export interface CharacterCustomization {
  body: string;
  head: string;
  eyes: string;
  mouth: string;
  hair: string;
  accessories: string;
  outfit: string;
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  outfitColor: string;
  backgroundColor: string;
  name: string;
}

export interface Scene {
  id: string;
  backgroundId: string;
  characters: SceneCharacter[];
  duration: number;
  dialogue?: string;
  animation?: string;
  transition?: string;
  music?: string;
}

export interface SceneCharacter {
  characterId: string;
  position: { x: number; y: number };
  scale: number;
  emotion: string;
  animation: string;
}

export interface CartoonVideo {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  duration: number;
  scenes: Scene[];
  status: 'draft' | 'rendering' | 'ready' | 'published';
  quality: '480p' | '720p' | '1080p' | '4K';
  tags?: string[];
  youtubeUrl?: string;
  views?: number;
  likes?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCharacters: number;
  totalVideos: number;
  freeUsers: number;
  proUsers: number;
  studioUsers: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Home: undefined;
  CharacterCreate: { characterId?: string };
  CharacterDetail: { characterId: string };
  VideoStudio: { videoId?: string };
  VideoPreview: { videoId: string };
  Subscription: undefined;
  Profile: undefined;
  Settings: undefined;
  Admin: undefined;
  AdminUsers: undefined;
  AdminSubscriptions: undefined;
  AdminAnalytics: undefined;
  Notifications: undefined;
};
