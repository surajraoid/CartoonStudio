import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SubscriptionBadge } from '../../components/common/SubscriptionBadge';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { GradientButton } from '../../components/common/GradientButton';
import { useStore } from '../../store/useStore';
import { COLORS, SUBSCRIPTION_PLANS } from '../../constants';

export function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout, characters, videos } = useStore();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [hd, setHd] = useState(false);

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === user?.subscription);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-circle-outline', label: 'Edit Profile', onPress: () => {}, color: COLORS.primary },
        { icon: 'lock-closed-outline', label: 'Change Password', onPress: () => {}, color: COLORS.primary },
        { icon: 'mail-outline', label: 'Email Preferences', onPress: () => {}, color: COLORS.primary },
      ],
    },
    {
      title: 'Subscription',
      items: [
        { icon: 'diamond-outline', label: 'Manage Subscription', onPress: () => navigation.navigate('Subscription'), color: '#FFD700' },
        { icon: 'receipt-outline', label: 'Billing History', onPress: () => {}, color: '#FFD700' },
        { icon: 'gift-outline', label: 'Redeem Code', onPress: () => {}, color: '#FFD700' },
      ],
    },
    {
      title: 'Content',
      items: [
        { icon: 'cloud-upload-outline', label: 'Export All Characters', onPress: () => {}, color: COLORS.success },
        { icon: 'logo-youtube', label: 'YouTube Connection', onPress: () => {}, color: '#FF0000' },
        { icon: 'share-social-outline', label: 'Share Profile', onPress: () => {}, color: COLORS.info },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', onPress: () => {}, color: COLORS.info },
        { icon: 'chatbubble-outline', label: 'Contact Support', onPress: () => {}, color: COLORS.info },
        { icon: 'star-outline', label: 'Rate the App', onPress: () => {}, color: '#FFD700' },
        { icon: 'bug-outline', label: 'Report a Bug', onPress: () => {}, color: COLORS.warning },
      ],
    },
  ];

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 }]}
      >
        {/* Profile header */}
        <Animated.View entering={FadeInDown.delay(0)}>
          <LinearGradient colors={['#6C5CE7', '#A29BFE', '#FD79A8']} style={styles.profileBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <LinearGradient colors={['#fff', '#f0f0f0']} style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </LinearGradient>
              {user?.role === 'admin' && (
                <View style={styles.adminBadge}>
                  <Ionicons name="shield-checkmark" size={14} color={COLORS.accent} />
                </View>
              )}
            </View>

            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <SubscriptionBadge tier={user?.subscription || 'free'} size="md" />
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statsRow}>
          {[
            { label: 'Characters', value: characters.length, icon: '🎨' },
            { label: 'Videos', value: videos.length, icon: '🎬' },
            { label: 'Member Since', value: user?.createdAt?.split('T')[0]?.split('-')[0] || '2024', icon: '📅' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Current Plan */}
        {currentPlan && (
          <Animated.View entering={FadeInDown.delay(150)}>
            <TouchableOpacity onPress={() => navigation.navigate('Subscription')} activeOpacity={0.9}>
              <LinearGradient colors={currentPlan.color as any} style={styles.planCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View>
                  <Text style={styles.planCardLabel}>Current Plan</Text>
                  <Text style={styles.planCardName}>{currentPlan.name}</Text>
                  <Text style={styles.planCardPrice}>
                    {currentPlan.price === 0 ? 'Free Forever' : `$${currentPlan.price}/month`}
                  </Text>
                </View>
                <View style={styles.planCardRight}>
                  {user?.subscription !== 'studio' && (
                    <View style={styles.upgradeTag}>
                      <Text style={styles.upgradeTagText}>Upgrade ↗</Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 36 }}>
                    {user?.subscription === 'free' ? '⭐' : user?.subscription === 'pro' ? '💎' : '👑'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Settings toggles */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <AnimatedCard style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>⚙️ Preferences</Text>
            {[
              { label: 'Push Notifications', value: notifications, setter: setNotifications, icon: 'notifications-outline' },
              { label: 'Auto-Save Characters', value: autoSave, setter: setAutoSave, icon: 'save-outline' },
              { label: 'HD Preview Mode', value: hd, setter: setHd, icon: 'videocam-outline' },
            ].map(({ label, value, setter, icon }) => (
              <View key={label} style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name={icon as any} size={18} color={COLORS.textSecondary} />
                  <Text style={styles.settingLabel}>{label}</Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={setter}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </AnimatedCard>
        </Animated.View>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <Animated.View key={section.title} entering={FadeInDown.delay(250 + si * 60)}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <AnimatedCard style={styles.menuCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, ii < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={item.onPress}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </AnimatedCard>
          </Animated.View>
        ))}

        {/* Admin button */}
        {user?.role === 'admin' && (
          <Animated.View entering={FadeInDown.delay(550)}>
            <GradientButton
              title="🛡️ Open Admin Panel"
              onPress={() => navigation.navigate('Admin')}
              gradient={['#E17055', '#D63031']}
              style={{ marginBottom: 12 }}
            />
          </Animated.View>
        )}

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(600)}>
          <GradientButton
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            style={{ marginBottom: 20 }}
          />
        </Animated.View>

        <Text style={styles.version}>CartoonAI Studio v1.0.0 • Made with ❤️</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, gap: 14 },
  profileBanner: {
    borderRadius: 24, padding: 24, alignItems: 'center', gap: 8,
    marginBottom: 0,
  },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: COLORS.primary },
  adminBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center',
  },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  statsRow: {
    flexDirection: 'row', gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.backgroundCard, borderRadius: 14,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },
  planCard: {
    borderRadius: 18, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  planCardLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  planCardName: { color: '#fff', fontSize: 22, fontWeight: '800', marginVertical: 2 },
  planCardPrice: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  planCardRight: { alignItems: 'flex-end', gap: 8 },
  upgradeTag: {
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  upgradeTagText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  settingsCard: { gap: 2 },
  settingsTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingLabel: { fontSize: 14, color: COLORS.textSecondary },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: -4 },
  menuCard: { padding: 0, gap: 0 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12 },
});
