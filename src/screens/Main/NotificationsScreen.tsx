import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../constants';

const TYPE_CONFIG = {
  success: { icon: 'checkmark-circle', color: COLORS.success, bg: COLORS.success + '20' },
  info: { icon: 'information-circle', color: COLORS.info, bg: COLORS.info + '20' },
  warning: { icon: 'warning', color: COLORS.warning, bg: COLORS.warning + '20' },
  error: { icon: 'alert-circle', color: COLORS.error, bg: COLORS.error + '20' },
};

export function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useStore();

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
        {unreadCount > 0 && (
          <Animated.View entering={FadeInDown.delay(0)} style={styles.unreadBanner}>
            <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          </Animated.View>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>No new notifications</Text>
          </View>
        ) : (
          notifications.map((notif, i) => {
            const config = TYPE_CONFIG[notif.type];
            return (
              <Animated.View key={notif.id} entering={FadeInDown.delay(i * 60)}>
                <TouchableOpacity
                  onPress={() => markNotificationRead(notif.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.notifCard, !notif.read && styles.notifCardUnread]}>
                    <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                      <Ionicons name={config.icon as any} size={22} color={config.color} />
                    </View>
                    <View style={styles.notifContent}>
                      <View style={styles.notifHeader}>
                        <Text style={styles.notifTitle} numberOfLines={1}>{notif.title}</Text>
                        <Text style={styles.notifTime}>{formatTime(notif.createdAt)}</Text>
                      </View>
                      <Text style={styles.notifMessage}>{notif.message}</Text>
                    </View>
                    {!notif.read && <View style={styles.unreadDot} />}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })
        )}
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
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  markAll: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  scroll: { padding: 16, gap: 8 },
  unreadBanner: {
    backgroundColor: COLORS.primary + '20', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: COLORS.primary + '40', marginBottom: 8,
  },
  unreadText: { color: COLORS.primary, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: COLORS.backgroundCard, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, position: 'relative',
  },
  notifCardUnread: { borderColor: COLORS.primary + '50', backgroundColor: COLORS.primary + '08' },
  notifIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  notifTime: { fontSize: 11, color: COLORS.textMuted, marginLeft: 8 },
  notifMessage: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
    position: 'absolute', top: 14, right: 14,
  },
});
