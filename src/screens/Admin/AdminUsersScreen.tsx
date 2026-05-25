import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SubscriptionBadge } from '../../components/common/SubscriptionBadge';
import { GradientButton } from '../../components/common/GradientButton';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { useStore } from '../../store/useStore';
import { COLORS, SUBSCRIPTION_PLANS } from '../../constants';
import { User, SubscriptionTier } from '../../types';

export function AdminUsersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { allUsers, loadAllUsers, updateUserSubscription, deleteUser } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | SubscriptionTier>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { loadAllUsers(); }, []);

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.subscription === filter;
    return matchSearch && matchFilter;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}'s account? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => deleteUser(user.id),
        },
      ]
    );
  };

  const handleUpdateSubscription = (userId: string, tier: SubscriptionTier) => {
    updateUserSubscription(userId, tier);
    setShowModal(false);
    setSelectedUser(null);
    Alert.alert('✅ Updated', 'User subscription has been updated.');
  };

  const TIER_COLORS = {
    free: ['#636e72', '#b2bec3'],
    pro: ['#6C5CE7', '#A29BFE'],
    studio: ['#FFD700', '#FFA500'],
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>👥 User Management</Text>
          <Text style={styles.headerSub}>{allUsers.length} total users</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search users..."
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(['all', 'free', 'pro', 'studio'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? `All (${allUsers.length})` :
                  `${f.charAt(0).toUpperCase() + f.slice(1)} (${allUsers.filter(u => u.subscription === f).length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
        {filtered.map((user, i) => (
          <Animated.View key={user.id} entering={FadeInDown.delay(i * 60)}>
            <AnimatedCard style={styles.userCard}>
              {/* User avatar */}
              <View style={styles.userAvatarWrap}>
                <LinearGradient colors={TIER_COLORS[user.subscription] as any} style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
                {user.role === 'admin' && (
                  <View style={styles.adminDot}>
                    <Ionicons name="shield-checkmark" size={10} color={COLORS.accent} />
                  </View>
                )}
              </View>

              {/* User info */}
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <SubscriptionBadge tier={user.subscription} size="sm" />
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userStats}>
                  <Text style={styles.userStat}>🎨 {user.charactersCreated} chars</Text>
                  <Text style={styles.userStat}>🎬 {user.videosCreated} videos</Text>
                  <Text style={styles.userStat}>📅 {user.createdAt.split('T')[0]}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.userActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEditUser(user)}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                {user.role !== 'admin' && (
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(user)}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </View>
            </AnimatedCard>
          </Animated.View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No users found</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit User Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <LinearGradient colors={['#1A1A35', '#242444']} style={styles.modalContent}>
              {selectedUser && (
                <>
                  <Text style={styles.modalTitle}>Edit User: {selectedUser.name}</Text>
                  <Text style={styles.modalEmail}>{selectedUser.email}</Text>

                  <Text style={styles.modalLabel}>Change Subscription</Text>
                  {SUBSCRIPTION_PLANS.map(plan => (
                    <TouchableOpacity
                      key={plan.id}
                      style={[
                        styles.planOption,
                        selectedUser.subscription === plan.id && styles.planOptionActive,
                      ]}
                      onPress={() => handleUpdateSubscription(selectedUser.id, plan.id as SubscriptionTier)}
                    >
                      <LinearGradient colors={plan.color as any} style={styles.planOptionGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Text style={styles.planOptionName}>{plan.name}</Text>
                        <Text style={styles.planOptionPrice}>
                          {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
                        </Text>
                        {selectedUser.subscription === plan.id && (
                          <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowModal(false); setSelectedUser(null); }}>
                    <Text style={styles.cancelText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </LinearGradient>
          </View>
        </View>
      </Modal>
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
  headerSub: { fontSize: 12, color: COLORS.textMuted },
  searchSection: { padding: 16, gap: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.backgroundCard, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  filters: { gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
    backgroundColor: COLORS.backgroundCard, borderWidth: 1, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  scroll: { padding: 16, gap: 10 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  userAvatarWrap: { position: 'relative' },
  userAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  adminDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center',
  },
  userInfo: { flex: 1, gap: 4 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  userName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  userEmail: { fontSize: 11, color: COLORS.textMuted },
  userStats: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  userStat: { fontSize: 10, color: COLORS.textSecondary },
  userActions: { gap: 8 },
  editBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary + '20', alignItems: 'center', justifyContent: 'center',
  },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.error + '20', alignItems: 'center', justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalContent: { padding: 24, gap: 12, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  modalEmail: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 4 },
  planOption: { borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  planOptionActive: { borderColor: '#fff' },
  planOptionGrad: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8 },
  planOptionName: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 15 },
  planOptionPrice: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  cancelBtn: { alignItems: 'center', padding: 12 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
});
