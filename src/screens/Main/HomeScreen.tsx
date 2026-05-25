import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, RefreshControl, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { GradientButton } from '../../components/common/GradientButton';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { SubscriptionBadge } from '../../components/common/SubscriptionBadge';
import { StatsCard } from '../../components/common/StatsCard';
import { CharacterAvatar } from '../../components/common/CharacterAvatar';
import { COLORS, SIZES } from '../../constants';
import { Character } from '../../types';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: 'create', icon: '🎨', label: 'New\nCharacter', gradient: ['#6C5CE7', '#A29BFE'], screen: 'Create' },
  { id: 'video', icon: '🎬', label: 'New\nVideo', gradient: ['#FD79A8', '#FDCB6E'], screen: 'Studio' },
  { id: 'gallery', icon: '🖼️', label: 'My\nGallery', gradient: ['#00B894', '#00CEC9'], screen: 'Gallery' },
  { id: 'sub', icon: '👑', label: 'Upgrade\nPlan', gradient: ['#FFD700', '#FFA500'], screen: 'Subscription' },
];

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, characters, videos, unreadCount } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.06, { duration: 2000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const recentChars = characters.slice(0, 4);
  const recentVideos = videos.slice(0, 3);

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard, COLORS.background]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Creator'}</Text>
            <SubscriptionBadge tier={user?.subscription || 'free'} size="sm" />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            {user?.role === 'admin' && (
              <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('Admin')}>
                <Ionicons name="settings-outline" size={22} color={COLORS.accent} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Banner / CTA */}
        {user?.subscription === 'free' && (
          <Animated.View entering={FadeInDown.delay(100)}>
            <TouchableOpacity onPress={() => navigation.navigate('Subscription')} activeOpacity={0.9}>
              <LinearGradient colors={['#6C5CE7', '#A29BFE', '#FD79A8']} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.bannerLeft}>
                  <Text style={styles.bannerTitle}>🚀 Upgrade to Pro</Text>
                  <Text style={styles.bannerSub}>Unlimited videos, HD export & YouTube upload</Text>
                </View>
                <View style={styles.bannerBadge}><Text style={styles.bannerPrice}>$9.99/mo</Text></View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsRow}>
            <StatsCard label="Characters" value={user?.charactersCreated || 0} icon="🎨" gradient={['#6C5CE7', '#A29BFE']} delay={0} />
            <StatsCard label="Videos" value={user?.videosCreated || 0} icon="🎬" gradient={['#FD79A8', '#FDCB6E']} delay={50} />
            <StatsCard label="Views" value="1.2K" icon="👁" gradient={['#00B894', '#00CEC9']} delay={100} />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Create</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => {
                  if (action.screen === 'Subscription') {
                    navigation.navigate('Subscription');
                  } else {
                    navigation.navigate(action.screen);
                  }
                }}
                activeOpacity={0.85}
                style={styles.quickCard}
              >
                <LinearGradient colors={action.gradient as any} style={styles.quickGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.quickIcon}>{action.icon}</Text>
                  <Text style={styles.quickLabel}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Characters */}
        {recentChars.length > 0 && (
          <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Characters</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Gallery')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {recentChars.map((char, i) => (
                <AnimatedCard
                  key={char.id}
                  delay={i * 80}
                  style={styles.charCard}
                  onPress={() => navigation.navigate('Create', { characterId: char.id })}
                >
                  <CharacterAvatar customization={char.customization} size={80} />
                  <Text style={styles.charName} numberOfLines={1}>{char.name}</Text>
                  {char.isFavorite && <Text style={styles.favStar}>⭐</Text>}
                </AnimatedCard>
              ))}
              <AnimatedCard
                delay={recentChars.length * 80}
                style={[styles.charCard, styles.addCard] as any}
                onPress={() => navigation.navigate('Create')}
              >
                <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.addCircle}>
                  <Ionicons name="add" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.charName}>Create New</Text>
              </AnimatedCard>
            </ScrollView>
          </Animated.View>
        )}

        {/* Recent Videos */}
        {recentVideos.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Videos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Studio')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentVideos.map((video, i) => (
              <AnimatedCard key={video.id} delay={i * 80} style={styles.videoCard} onPress={() => {}}>
                <LinearGradient colors={['#2D2D50', '#1A1A35']} style={styles.videoThumb}>
                  <Text style={styles.videoPlayIcon}>▶</Text>
                  <View style={[styles.videoBadge, {
                    backgroundColor: video.status === 'ready' ? COLORS.success : video.status === 'rendering' ? COLORS.warning : COLORS.textMuted
                  }]}>
                    <Text style={styles.videoBadgeText}>{video.status.toUpperCase()}</Text>
                  </View>
                </LinearGradient>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                  <Text style={styles.videoMeta}>{video.quality} • {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</Text>
                  {video.views ? (
                    <View style={styles.videoStats}>
                      <Ionicons name="eye-outline" size={12} color={COLORS.textMuted} />
                      <Text style={styles.videoStatText}>{video.views.toLocaleString()} views</Text>
                      <Ionicons name="heart-outline" size={12} color={COLORS.textMuted} style={{ marginLeft: 8 }} />
                      <Text style={styles.videoStatText}>{video.likes}</Text>
                    </View>
                  ) : null}
                </View>
              </AnimatedCard>
            ))}
          </Animated.View>
        )}

        {/* Tips */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
          {[
            { tip: 'Use the Emotion Presets for quick character expressions', icon: '😊' },
            { tip: 'Add background music to make your videos more engaging', icon: '🎵' },
            { tip: 'Publish consistently to grow your YouTube channel', icon: '📈' },
          ].map((item, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipEmoji}>{item.icon}</Text>
              <Text style={styles.tipText}>{item.tip}</Text>
            </View>
          ))}
        </Animated.View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20,
  },
  headerLeft: { gap: 4 },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  userName: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', gap: 8, marginTop: 4 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.backgroundCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border, position: 'relative',
  },
  adminBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.backgroundCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  banner: {
    borderRadius: 18, padding: 16, marginBottom: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  bannerLeft: { flex: 1 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  bannerBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: 8 },
  bannerPrice: { color: '#fff', fontWeight: '800', fontSize: 14 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 0 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: (width - 42) / 2, borderRadius: 16, overflow: 'hidden' },
  quickGrad: {
    padding: 18, alignItems: 'flex-start', minHeight: 90,
    justifyContent: 'space-between',
  },
  quickIcon: { fontSize: 28 },
  quickLabel: { color: '#fff', fontSize: 13, fontWeight: '700', lineHeight: 18, marginTop: 8 },
  horizontalScroll: { paddingRight: 16, gap: 12 },
  charCard: {
    width: 100, padding: 12, alignItems: 'center',
    gap: 6, borderRadius: 16,
  },
  addCard: { justifyContent: 'center', alignItems: 'center' as const },
  addCircle: {
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  charName: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '600' },
  favStar: { fontSize: 12, position: 'absolute', top: 8, right: 8 },
  videoCard: { flexDirection: 'row', gap: 12, marginBottom: 10, padding: 10 },
  videoThumb: {
    width: 100, height: 70, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  videoPlayIcon: { fontSize: 20, color: 'rgba(255,255,255,0.7)' },
  videoBadge: {
    position: 'absolute', bottom: 4, right: 4,
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4,
  },
  videoBadgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  videoInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  videoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  videoMeta: { fontSize: 12, color: COLORS.textMuted },
  videoStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  videoStatText: { fontSize: 11, color: COLORS.textMuted },
  tipRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: COLORS.backgroundCard, borderRadius: 12, padding: 12,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  tipEmoji: { fontSize: 18 },
  tipText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
});
