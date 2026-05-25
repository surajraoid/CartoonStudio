import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { StatsCard } from '../../components/common/StatsCard';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../constants';

export function AdminDashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { allUsers, characters, videos, loadAllUsers } = useStore();

  useEffect(() => { loadAllUsers(); }, []);

  const totalRevenue = allUsers.reduce((sum, u) => {
    if (u.subscription === 'pro') return sum + 9.99;
    if (u.subscription === 'studio') return sum + 24.99;
    return sum;
  }, 0);

  const proUsers = allUsers.filter(u => u.subscription === 'pro').length;
  const studioUsers = allUsers.filter(u => u.subscription === 'studio').length;
  const freeUsers = allUsers.filter(u => u.subscription === 'free').length;

  const adminMenus = [
    { icon: '👥', label: 'User Management', subtitle: `${allUsers.length} total users`, screen: 'AdminUsers', gradient: ['#6C5CE7', '#A29BFE'] },
    { icon: '💎', label: 'Subscription Plans', subtitle: 'Manage pricing & features', screen: 'AdminPlans', gradient: ['#FFD700', '#FFA500'] },
    { icon: '📊', label: 'Analytics', subtitle: 'View detailed reports', screen: null, gradient: ['#00B894', '#00CEC9'] },
    { icon: '🔔', label: 'Push Notifications', subtitle: 'Send to all users', screen: null, gradient: ['#FD79A8', '#FDCB6E'] },
    { icon: '🎨', label: 'Content Library', subtitle: 'Manage templates', screen: null, gradient: ['#E17055', '#D63031'] },
    { icon: '⚙️', label: 'App Settings', subtitle: 'Configure the app', screen: null, gradient: ['#2D3436', '#636E72'] },
  ];

  const recentActivity = [
    { action: 'New signup', user: 'John Doe', time: '2 min ago', icon: '👤' },
    { action: 'Pro upgrade', user: 'Sarah Smith', time: '15 min ago', icon: '💎' },
    { action: 'Video published', user: 'Mike Johnson', time: '1 hour ago', icon: '🎬' },
    { action: 'Character created', user: 'Emma Wilson', time: '2 hours ago', icon: '🎨' },
    { action: 'Studio upgrade', user: 'Chris Lee', time: '3 hours ago', icon: '👑' },
  ];

  return (
    <LinearGradient colors={[COLORS.background, '#12123A', COLORS.background]} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🛡️ Admin Panel</Text>
          <Text style={styles.headerSubtitle}>CartoonAI Studio</Text>
        </View>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>

        {/* Revenue banner */}
        <Animated.View entering={FadeInDown.delay(0)}>
          <LinearGradient colors={['#FFD700', '#FFA500', '#FF6347']} style={styles.revenueBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View>
              <Text style={styles.revenueLabel}>Monthly Revenue</Text>
              <Text style={styles.revenueValue}>${totalRevenue.toFixed(2)}</Text>
              <Text style={styles.revenueGrowth}>▲ 23.5% from last month</Text>
            </View>
            <View style={styles.revenueRight}>
              <Text style={styles.revenueIcon}>💰</Text>
              <Text style={styles.revenueSubLabel}>Active Subscriptions</Text>
              <Text style={styles.revenueSubValue}>{proUsers + studioUsers}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeInDown.delay(80)}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <StatsCard label="Total Users" value={allUsers.length} icon="👥" gradient={['#6C5CE7', '#A29BFE']} delay={0} />
            <StatsCard label="Free" value={freeUsers} icon="⭐" gradient={['#636e72', '#b2bec3']} delay={50} />
          </View>
          <View style={styles.statsRow}>
            <StatsCard label="Pro Users" value={proUsers} icon="💎" gradient={['#6C5CE7', '#FD79A8']} delay={0} />
            <StatsCard label="Studio" value={studioUsers} icon="👑" gradient={['#FFD700', '#FFA500']} delay={50} />
          </View>
          <View style={styles.statsRow}>
            <StatsCard label="Characters" value={characters.length} icon="🎨" gradient={['#00B894', '#00CEC9']} delay={0} />
            <StatsCard label="Videos" value={videos.length} icon="🎬" gradient={['#E17055', '#D63031']} delay={50} />
          </View>
        </Animated.View>

        {/* Admin menu grid */}
        <Animated.View entering={FadeInDown.delay(160)}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.menuGrid}>
            {adminMenus.map((menu, i) => (
              <TouchableOpacity
                key={menu.label}
                style={styles.menuCard}
                activeOpacity={0.85}
                onPress={() => menu.screen ? navigation.navigate(menu.screen) : null}
              >
                <LinearGradient colors={menu.gradient as any} style={styles.menuCardGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.menuCardIcon}>{menu.icon}</Text>
                  <Text style={styles.menuCardLabel}>{menu.label}</Text>
                  <Text style={styles.menuCardSub}>{menu.subtitle}</Text>
                  {!menu.screen && <View style={styles.comingSoon}><Text style={styles.comingSoonText}>Soon</Text></View>}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(240)}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <AnimatedCard style={{ padding: 0 }}>
            {recentActivity.map((activity, i) => (
              <View key={i} style={[styles.activityRow, i < recentActivity.length - 1 && styles.activityBorder]}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>{activity.icon}</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityUser}>{activity.user}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
          </AnimatedCard>
        </Animated.View>

        {/* Quick stats */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={styles.sectionTitle}>Subscription Split</Text>
          <AnimatedCard style={styles.splitCard}>
            {[
              { label: 'Free', count: freeUsers, color: '#636e72', total: allUsers.length },
              { label: 'Creator Pro', count: proUsers, color: COLORS.primary, total: allUsers.length },
              { label: 'Studio Pro', count: studioUsers, color: '#FFD700', total: allUsers.length },
            ].map(({ label, count, color, total }) => (
              <View key={label} style={styles.splitRow}>
                <Text style={styles.splitLabel}>{label}</Text>
                <View style={styles.splitBar}>
                  <View style={[styles.splitFill, { width: `${(count / total) * 100}%` as any, backgroundColor: color }]} />
                </View>
                <Text style={styles.splitCount}>{count}</Text>
              </View>
            ))}
          </AnimatedCard>
        </Animated.View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.backgroundCard, alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted },
  adminBadge: {
    backgroundColor: COLORS.error + '30', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.error + '50',
  },
  adminBadgeText: { color: COLORS.error, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  scroll: { padding: 16, gap: 16 },
  revenueBanner: {
    borderRadius: 20, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  revenueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  revenueValue: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  revenueGrowth: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },
  revenueRight: { alignItems: 'flex-end', gap: 4 },
  revenueIcon: { fontSize: 36 },
  revenueSubLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  revenueSubValue: { color: '#fff', fontSize: 24, fontWeight: '800' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  menuCard: { width: '47%', borderRadius: 16, overflow: 'hidden' },
  menuCardGrad: { padding: 16, minHeight: 110, justifyContent: 'flex-end', position: 'relative' },
  menuCardIcon: { fontSize: 28, marginBottom: 8 },
  menuCardLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
  menuCardSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  comingSoon: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
  },
  comingSoonText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  activityIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.backgroundElevated, alignItems: 'center', justifyContent: 'center',
  },
  activityEmoji: { fontSize: 18 },
  activityInfo: { flex: 1 },
  activityAction: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  activityUser: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  activityTime: { fontSize: 11, color: COLORS.textMuted },
  splitCard: { gap: 12 },
  splitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  splitLabel: { width: 80, fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  splitBar: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  splitFill: { height: '100%', borderRadius: 4 },
  splitCount: { width: 24, textAlign: 'right', fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
});
