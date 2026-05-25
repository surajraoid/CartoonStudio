import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, TextInput, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInUp, FadeIn } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { GradientButton } from '../../components/common/GradientButton';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { CharacterAvatar } from '../../components/common/CharacterAvatar';
import { COLORS, SCENE_BACKGROUNDS, ANIMATION_TYPES } from '../../constants';
import { CartoonVideo, Scene } from '../../types';

const { width } = Dimensions.get('window');
const generateId = () => Math.random().toString(36).substr(2, 9);

export function VideoStudioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { characters, videos, addVideo, user } = useStore();
  const [activeTab, setActiveTab] = useState<'projects' | 'new'>('projects');
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [showRenderModal, setShowRenderModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('My Cartoon Episode');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedBg, setSelectedBg] = useState(SCENE_BACKGROUNDS[0]);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  const isPremium = user?.subscription === 'pro' || user?.subscription === 'studio';

  const addScene = () => {
    if (selectedChars.length === 0) {
      Alert.alert('No Characters', 'Please select at least one character for this scene.');
      return;
    }
    const scene: Scene = {
      id: generateId(),
      backgroundId: selectedBg.id,
      characters: selectedChars.map(id => ({
        characterId: id,
        position: { x: 0.5, y: 0.7 },
        scale: 1,
        emotion: 'happy',
        animation: 'wave',
      })),
      duration: 5,
      dialogue: '',
    };
    setScenes(prev => [...prev, scene]);
    setShowSceneModal(false);
    setSelectedChars([]);
  };

  const startRender = async () => {
    if (scenes.length === 0) {
      Alert.alert('No Scenes', 'Add at least one scene to create a video.');
      return;
    }
    if (!isPremium && scenes.length > 1) {
      Alert.alert('Pro Feature', 'Free users can only render 1-scene videos. Upgrade to Pro for full videos!', [
        { text: 'Upgrade', onPress: () => navigation.navigate('Subscription') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    setIsRendering(true);
    setRenderProgress(0);
    setShowRenderModal(true);

    // Simulate rendering progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 200));
      setRenderProgress(i);
    }

    const newVideo: CartoonVideo = {
      id: generateId(),
      title: videoTitle,
      description: videoDescription,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: scenes.length * 5,
      scenes,
      status: 'ready',
      quality: isPremium ? '1080p' : '480p',
      tags: ['cartoon', 'animation'],
      views: 0,
      likes: 0,
    };

    addVideo(newVideo);
    setIsRendering(false);
    setShowRenderModal(false);
    setScenes([]);
    Alert.alert('🎉 Video Ready!', `"${videoTitle}" has been created successfully!`, [
      { text: 'View', onPress: () => setActiveTab('projects') },
      { text: 'OK', style: 'cancel' },
    ]);
  };

  const renderProjects = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {videos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No Videos Yet</Text>
          <Text style={styles.emptySubtitle}>Create your first cartoon video</Text>
          <GradientButton title="+ Create Video" onPress={() => setActiveTab('new')} style={{ marginTop: 20 }} />
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Videos ({videos.length})</Text>
            <TouchableOpacity onPress={() => setActiveTab('new')}>
              <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.newVideoBtn}>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.newVideoBtnText}>New</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {videos.map((video, i) => (
            <AnimatedCard key={video.id} delay={i * 80} style={styles.videoCard} onPress={() => {}}>
              <LinearGradient colors={['#1A1A45', '#2D2D60']} style={styles.videoThumb}>
                <Text style={styles.videoPlayBtn}>▶</Text>
                <Text style={styles.videoDuration}>
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                </Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: video.status === 'ready' ? COLORS.success :
                    video.status === 'rendering' ? COLORS.warning : COLORS.textMuted
                }]}>
                  <Text style={styles.statusText}>{video.status.toUpperCase()}</Text>
                </View>
              </LinearGradient>

              <View style={styles.videoMeta}>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <View style={styles.videoTags}>
                  <View style={styles.qualityTag}>
                    <Text style={styles.qualityTagText}>{video.quality}</Text>
                  </View>
                  <Text style={styles.sceneCount}>{video.scenes.length} scenes</Text>
                </View>

                {video.status === 'ready' && (
                  <View style={styles.videoActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="share-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.actionBtnText}>Share</Text>
                    </TouchableOpacity>
                    {isPremium && (
                      <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                        <Text style={[styles.actionBtnText, { color: '#FF0000' }]}>YouTube</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="download-outline" size={16} color={COLORS.success} />
                      <Text style={[styles.actionBtnText, { color: COLORS.success }]}>Export</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </AnimatedCard>
          ))}
        </>
      )}
    </ScrollView>
  );

  const renderNew = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Video info */}
      <AnimatedCard delay={0} style={styles.infoCard}>
        <Text style={styles.cardTitle}>📝 Video Details</Text>
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={videoTitle}
          onChangeText={setVideoTitle}
          placeholder="My Cartoon Episode 1"
          placeholderTextColor={COLORS.textMuted}
        />
        <Text style={styles.inputLabel}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={videoDescription}
          onChangeText={setVideoDescription}
          placeholder="Describe your cartoon..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </AnimatedCard>

      {/* Scenes */}
      <AnimatedCard delay={80} style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🎬 Scenes ({scenes.length})</Text>
          <TouchableOpacity onPress={() => setShowSceneModal(true)} style={styles.addSceneBtn}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.addSceneText}>Add Scene</Text>
          </TouchableOpacity>
        </View>

        {!isPremium && (
          <View style={styles.limitBanner}>
            <Ionicons name="information-circle" size={14} color={COLORS.warning} />
            <Text style={styles.limitText}>Free plan: 1 scene per video. <Text style={{ color: COLORS.primary }} onPress={() => navigation.navigate('Subscription')}>Upgrade for unlimited</Text></Text>
          </View>
        )}

        {scenes.length === 0 ? (
          <View style={styles.emptyScenes}>
            <Text style={styles.emptyScenesText}>No scenes yet. Add your first scene!</Text>
          </View>
        ) : (
          <View style={styles.sceneList}>
            {scenes.map((scene, i) => {
              const bg = SCENE_BACKGROUNDS.find(b => b.id === scene.backgroundId);
              return (
                <View key={scene.id} style={styles.sceneItem}>
                  <LinearGradient colors={(bg?.color || ['#333', '#555']) as any} style={styles.scenePreview}>
                    <Text style={styles.sceneNum}>Scene {i + 1}</Text>
                    <Text style={styles.sceneChars}>{scene.characters.length} character(s)</Text>
                  </LinearGradient>
                  <TouchableOpacity
                    onPress={() => setScenes(prev => prev.filter(s => s.id !== scene.id))}
                    style={styles.deleteSceneBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </AnimatedCard>

      {/* Render button */}
      <AnimatedCard delay={160} style={styles.infoCard}>
        <Text style={styles.cardTitle}>🚀 Render & Export</Text>
        <View style={styles.renderInfo}>
          <View style={styles.renderItem}>
            <Ionicons name="film" size={16} color={COLORS.primary} />
            <Text style={styles.renderText}>Quality: {isPremium ? '1080p HD' : '480p (Free)'}</Text>
          </View>
          <View style={styles.renderItem}>
            <Ionicons name="time" size={16} color={COLORS.primary} />
            <Text style={styles.renderText}>Duration: ~{scenes.length * 5}s</Text>
          </View>
          <View style={styles.renderItem}>
            <Ionicons name="logo-youtube" size={16} color={isPremium ? '#FF0000' : COLORS.textMuted} />
            <Text style={[styles.renderText, !isPremium && { color: COLORS.textMuted }]}>
              YouTube Upload: {isPremium ? 'Available' : 'Pro only'}
            </Text>
          </View>
        </View>

        <GradientButton
          title={scenes.length === 0 ? '🎬 Add Scenes First' : '🎬 Render Video'}
          onPress={startRender}
          disabled={scenes.length === 0}
          size="lg"
          style={{ marginTop: 12 }}
        />
      </AnimatedCard>
    </ScrollView>
  );

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>🎬 Video Studio</Text>
        <View style={styles.headerTabs}>
          {(['projects', 'new'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.headerTab, activeTab === tab && styles.headerTabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.headerTabText, activeTab === tab && styles.headerTabTextActive]}>
                {tab === 'projects' ? 'Projects' : '+ New'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'projects' ? renderProjects() : renderNew()}

      {/* Add Scene Modal */}
      <Modal visible={showSceneModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <LinearGradient colors={['#1A1A35', '#242444']} style={styles.modalContent}>
              <Text style={styles.modalTitle}>🎬 Add Scene</Text>

              <Text style={styles.modalLabel}>Background</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bgRow}>
                {SCENE_BACKGROUNDS.map(bg => (
                  <TouchableOpacity
                    key={bg.id}
                    onPress={() => (!bg.isPremium || isPremium) ? setSelectedBg(bg) : navigation.navigate('Subscription')}
                    style={[styles.bgItem, selectedBg.id === bg.id && styles.bgItemActive]}
                  >
                    <LinearGradient colors={bg.color as any} style={styles.bgPreview}>
                      {bg.isPremium && !isPremium && <Text style={styles.lockIcon}>🔒</Text>}
                    </LinearGradient>
                    <Text style={styles.bgLabel}>{bg.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Characters</Text>
              {characters.length === 0 ? (
                <Text style={styles.noCharsText}>No characters yet. Create one first!</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.charRow}>
                  {characters.map(char => (
                    <TouchableOpacity
                      key={char.id}
                      onPress={() => setSelectedChars(prev =>
                        prev.includes(char.id) ? prev.filter(id => id !== char.id) : [...prev, char.id]
                      )}
                      style={[styles.charItem, selectedChars.includes(char.id) && styles.charItemActive]}
                    >
                      <CharacterAvatar customization={char.customization} size={60} />
                      <Text style={styles.charItemName} numberOfLines={1}>{char.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <View style={styles.modalBtns}>
                <GradientButton title="Add Scene" onPress={addScene} style={{ flex: 1 }} />
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSceneModal(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Render Progress Modal */}
      <Modal visible={showRenderModal} transparent animationType="fade">
        <View style={styles.renderOverlay}>
          <Animated.View entering={SlideInUp} style={styles.renderModal}>
            <LinearGradient colors={['#1A1A35', '#242444']} style={styles.renderModalContent}>
              <Text style={styles.renderTitle}>🎬 Rendering Video...</Text>
              <Text style={styles.renderSubtitle}>"{videoTitle}"</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: `${renderProgress}%` as any }]}>
                  <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={StyleSheet.absoluteFill} />
                </Animated.View>
              </View>
              <Text style={styles.progressText}>{renderProgress}%</Text>
              <Text style={styles.renderHint}>
                {renderProgress < 30 ? '⚙️ Initializing scenes...' :
                  renderProgress < 60 ? '🎨 Applying animations...' :
                    renderProgress < 90 ? '🎵 Adding audio tracks...' : '✨ Finalizing video...'}
              </Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  headerTabs: { flexDirection: 'row', backgroundColor: COLORS.backgroundElevated, borderRadius: 10, padding: 3, gap: 2 },
  headerTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  headerTabActive: { backgroundColor: COLORS.primary },
  headerTabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  headerTabTextActive: { color: '#fff' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  newVideoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  newVideoBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  videoCard: { flexDirection: 'row', gap: 12, padding: 10, marginBottom: 6 },
  videoThumb: {
    width: 110, height: 75, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', position: 'relative',
  },
  videoPlayBtn: { fontSize: 24, color: 'rgba(255,255,255,0.7)' },
  videoDuration: { position: 'absolute', bottom: 4, left: 6, color: '#fff', fontSize: 10, fontWeight: '700' },
  statusBadge: { position: 'absolute', top: 4, right: 4, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  videoMeta: { flex: 1, justifyContent: 'space-between' },
  videoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 20 },
  videoTags: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qualityTag: { backgroundColor: COLORS.primary + '30', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  qualityTagText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  sceneCount: { fontSize: 11, color: COLORS.textMuted },
  videoActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtnText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  infoCard: { padding: 16, gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.backgroundElevated, borderRadius: 10, padding: 12,
    color: COLORS.textPrimary, fontSize: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  multilineInput: { height: 80, textAlignVertical: 'top' },
  addSceneBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addSceneText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  limitBanner: {
    flexDirection: 'row', gap: 6, alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '15', borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: COLORS.warning + '40',
  },
  limitText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  emptyScenes: { padding: 20, alignItems: 'center' },
  emptyScenesText: { color: COLORS.textMuted, fontSize: 13 },
  sceneList: { gap: 8 },
  sceneItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scenePreview: { flex: 1, height: 50, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 12 },
  sceneNum: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sceneChars: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  deleteSceneBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.error + '20', alignItems: 'center', justifyContent: 'center' },
  renderInfo: { gap: 8 },
  renderItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  renderText: { color: COLORS.textSecondary, fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalContent: { padding: 24, gap: 14, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  modalLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  bgRow: { gap: 10 },
  bgItem: { alignItems: 'center', gap: 6 },
  bgItemActive: { transform: [{ scale: 1.05 }] },
  bgPreview: {
    width: 70, height: 50, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  lockIcon: { fontSize: 18 },
  bgLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  charRow: { gap: 10 },
  charItem: { alignItems: 'center', gap: 4, padding: 6, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  charItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  charItemName: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600', width: 66, textAlign: 'center' },
  noCharsText: { color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic' },
  modalBtns: { gap: 10, marginTop: 4 },
  cancelBtn: { alignItems: 'center', padding: 10 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  renderOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  renderModal: { width: '100%', borderRadius: 24, overflow: 'hidden' },
  renderModalContent: { padding: 32, alignItems: 'center', gap: 12 },
  renderTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  renderSubtitle: { fontSize: 14, color: COLORS.textSecondary },
  progressBar: { width: '100%', height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  progressText: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  renderHint: { fontSize: 13, color: COLORS.textSecondary },
});
