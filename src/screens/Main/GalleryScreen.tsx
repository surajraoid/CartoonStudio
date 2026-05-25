import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CharacterAvatar } from '../../components/common/CharacterAvatar';
import { GradientButton } from '../../components/common/GradientButton';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');

export function GalleryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { characters, deleteCharacter, toggleFavorite } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = characters.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.isFavorite;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Character',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCharacter(id) },
      ]
    );
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>🖼️ Gallery</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons name={viewMode === 'grid' ? 'list' : 'grid'} size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('Create')}
          >
            <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.addBtnGrad}>
              <Ionicons name="add" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <Animated.View entering={FadeInDown.delay(50)} style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search characters..."
            placeholderTextColor={COLORS.textMuted}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          {(['all', 'favorites'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? `All (${characters.length})` : `⭐ Favorites (${characters.filter(c => c.isFavorite).length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Content */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>{search ? '🔍' : '🎨'}</Text>
          <Text style={styles.emptyTitle}>
            {search ? 'No results found' : filter === 'favorites' ? 'No favorites yet' : 'No characters yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {!search && filter === 'all' && 'Create your first cartoon character!'}
          </Text>
          {!search && filter === 'all' && (
            <GradientButton
              title="+ Create Character"
              onPress={() => navigation.navigate('Create')}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.gridContainer,
            { paddingBottom: insets.bottom + 80 }
          ]}
        >
          {viewMode === 'grid' ? (
            <View style={styles.grid}>
              {filtered.map((char, i) => (
                <AnimatedCard
                  key={char.id}
                  delay={i * 50}
                  style={styles.gridCard}
                  onPress={() => navigation.navigate('Create', { characterId: char.id })}
                >
                  <View style={styles.gridCardInner}>
                    <CharacterAvatar customization={char.customization} size={90} />

                    <TouchableOpacity
                      style={styles.favBtn}
                      onPress={() => toggleFavorite(char.id)}
                    >
                      <Ionicons
                        name={char.isFavorite ? 'star' : 'star-outline'}
                        size={16}
                        color={char.isFavorite ? '#FFD700' : COLORS.textMuted}
                      />
                    </TouchableOpacity>

                    <Text style={styles.gridCharName} numberOfLines={1}>{char.name}</Text>

                    <View style={styles.gridActions}>
                      <TouchableOpacity
                        style={styles.gridActionBtn}
                        onPress={() => navigation.navigate('Studio')}
                      >
                        <Text style={styles.gridActionIcon}>🎬</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.gridActionBtn, { backgroundColor: COLORS.error + '20' }]}
                        onPress={() => handleDelete(char.id, char.name)}
                      >
                        <Ionicons name="trash-outline" size={14} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
              ))}

              {/* Add new card */}
              <TouchableOpacity
                style={[styles.gridCard, styles.addNewCard]}
                onPress={() => navigation.navigate('Create')}
              >
                <LinearGradient colors={['#6C5CE7' + '30', '#A29BFE' + '30']} style={styles.addNewInner}>
                  <Ionicons name="add-circle-outline" size={36} color={COLORS.primary} />
                  <Text style={styles.addNewText}>Create New</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {filtered.map((char, i) => (
                <AnimatedCard key={char.id} delay={i * 50} style={styles.listCard} onPress={() => navigation.navigate('Create', { characterId: char.id })}>
                  <CharacterAvatar customization={char.customization} size={70} />
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{char.name}</Text>
                    <Text style={styles.listMeta}>{char.customization.outfit} • {char.customization.accessories !== 'none' ? char.customization.accessories : 'no accessory'}</Text>
                    <View style={styles.listTags}>
                      {char.animations.map(a => (
                        <View key={a} style={styles.animTag}>
                          <Text style={styles.animTagText}>{a}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.listActions}>
                    <TouchableOpacity onPress={() => toggleFavorite(char.id)}>
                      <Ionicons name={char.isFavorite ? 'star' : 'star-outline'} size={20} color={char.isFavorite ? '#FFD700' : COLORS.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(char.id, char.name)}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  headerRight: { flexDirection: 'row', gap: 8 },
  viewToggle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.backgroundCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  addBtn: { borderRadius: 19, overflow: 'hidden' },
  addBtnGrad: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { padding: 16, gap: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.backgroundCard, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
    backgroundColor: COLORS.backgroundCard, borderWidth: 1, borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  gridContainer: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  gridCard: {
    width: (width - 44) / 2,
    padding: 0, overflow: 'hidden',
  },
  gridCardInner: { padding: 12, alignItems: 'center', position: 'relative' },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.backgroundElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  gridCharName: {
    fontSize: 13, fontWeight: '700', color: COLORS.textPrimary,
    marginTop: 8, textAlign: 'center',
  },
  gridActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  gridActionBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.backgroundElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  gridActionIcon: { fontSize: 14 },
  addNewCard: { borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.primary, backgroundColor: 'transparent' },
  addNewInner: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 20, minHeight: 160, borderRadius: 16,
  },
  addNewText: { color: COLORS.primary, fontWeight: '600', marginTop: 8, fontSize: 13 },
  listContainer: { gap: 10 },
  listCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  listInfo: { flex: 1 },
  listName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  listMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  listTags: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  animTag: { backgroundColor: COLORS.primary + '25', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  animTagText: { color: COLORS.primary, fontSize: 10, fontWeight: '600' },
  listActions: { gap: 12 },
});
