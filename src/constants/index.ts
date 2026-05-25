export const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5A4BD1',
  primaryLight: '#A29BFE',
  secondary: '#FD79A8',
  secondaryDark: '#E84393',
  accent: '#FDCB6E',
  accentDark: '#E17055',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',
  info: '#0984E3',

  background: '#0F0F23',
  backgroundCard: '#1A1A35',
  backgroundElevated: '#242444',
  surface: '#1E1E3A',

  textPrimary: '#FFFFFF',
  textSecondary: '#B2B2CC',
  textMuted: '#6B6B8A',
  textAccent: '#A29BFE',

  border: '#2D2D50',
  borderLight: '#3D3D60',

  gradient1: ['#6C5CE7', '#A29BFE'],
  gradient2: ['#FD79A8', '#FDCB6E'],
  gradient3: ['#00B894', '#00CEC9'],
  gradient4: ['#E17055', '#D63031'],
  gradientBg: ['#0F0F23', '#1A1A35', '#0F0F23'],
  gradientPremium: ['#FFD700', '#FFA500', '#FF6347'],
};

export const FONTS = {
  thin: 'System',
  light: 'System',
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  extraBold: 'System',
  black: 'System',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  fontXs: 10,
  fontSm: 12,
  fontMd: 14,
  fontLg: 16,
  fontXl: 18,
  fontXxl: 22,
  fontXxxl: 28,
  fontHuge: 36,
  fontMassive: 48,

  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,

  screenWidth: 375,
  screenHeight: 812,
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'Forever',
    color: ['#636e72', '#b2bec3'],
    features: [
      '3 Characters per month',
      '1 Video per month (30 sec)',
      'Basic templates',
      'Watermarked export',
      'Standard quality',
    ],
    limitations: ['No HD export', 'No YouTube upload', 'No custom music'],
  },
  {
    id: 'pro',
    name: 'Creator Pro',
    price: 9.99,
    period: 'month',
    color: ['#6C5CE7', '#A29BFE'],
    popular: true,
    features: [
      'Unlimited characters',
      '10 Videos per month (5 min each)',
      'Premium templates',
      'HD export (1080p)',
      'YouTube direct upload',
      'Background music library',
      'Priority rendering',
    ],
    limitations: [],
  },
  {
    id: 'studio',
    name: 'Studio Pro',
    price: 24.99,
    period: 'month',
    color: ['#FFD700', '#FFA500'],
    features: [
      'Unlimited everything',
      'Unlimited videos (no time limit)',
      'All premium templates',
      '4K export',
      'YouTube + TikTok upload',
      'Custom music upload',
      'Advanced animations',
      'Team collaboration (5 members)',
      'Priority support',
      'Commercial license',
    ],
    limitations: [],
  },
];

export const CHARACTER_PARTS = {
  bodies: ['body1', 'body2', 'body3', 'body4', 'body5'],
  heads: ['head1', 'head2', 'head3', 'head4', 'head5'],
  eyes: ['eyes1', 'eyes2', 'eyes3', 'eyes4', 'eyes5', 'eyes6'],
  mouths: ['mouth1', 'mouth2', 'mouth3', 'mouth4', 'mouth5'],
  hair: ['hair1', 'hair2', 'hair3', 'hair4', 'hair5', 'hair6', 'hair7'],
  accessories: ['none', 'glasses', 'hat', 'crown', 'headband', 'bow'],
  outfits: ['casual', 'formal', 'hero', 'princess', 'ninja', 'wizard', 'robot'],
};

export const EMOTION_PRESETS = [
  { id: 'happy', label: '😊 Happy', eyes: 'eyes2', mouth: 'mouth1' },
  { id: 'sad', label: '😢 Sad', eyes: 'eyes3', mouth: 'mouth4' },
  { id: 'angry', label: '😠 Angry', eyes: 'eyes4', mouth: 'mouth5' },
  { id: 'surprised', label: '😲 Surprised', eyes: 'eyes5', mouth: 'mouth2' },
  { id: 'cool', label: '😎 Cool', eyes: 'eyes6', mouth: 'mouth1' },
];

export const ANIMATION_TYPES = [
  { id: 'wave', label: 'Wave', icon: '👋', isPremium: false },
  { id: 'jump', label: 'Jump', icon: '⬆️', isPremium: false },
  { id: 'spin', label: 'Spin', icon: '🔄', isPremium: true },
  { id: 'dance', label: 'Dance', icon: '💃', isPremium: true },
  { id: 'fly', label: 'Fly', icon: '🦋', isPremium: true },
  { id: 'run', label: 'Run', icon: '🏃', isPremium: false },
];

export const SCENE_BACKGROUNDS = [
  { id: 'city', label: 'City', color: ['#2C3E50', '#3498DB'], isPremium: false },
  { id: 'forest', label: 'Forest', color: ['#1A5276', '#28B463'], isPremium: false },
  { id: 'space', label: 'Space', color: ['#0B0B3B', '#6C5CE7'], isPremium: false },
  { id: 'beach', label: 'Beach', color: ['#0099CC', '#F7CA18'], isPremium: true },
  { id: 'castle', label: 'Castle', color: ['#7F8C8D', '#BDC3C7'], isPremium: true },
  { id: 'volcano', label: 'Volcano', color: ['#C0392B', '#F39C12'], isPremium: true },
  { id: 'underwater', label: 'Underwater', color: ['#1A5276', '#148F77'], isPremium: true },
  { id: 'clouds', label: 'Clouds', color: ['#AED6F1', '#FDFEFE'], isPremium: false },
];
