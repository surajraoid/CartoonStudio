import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, SlideInRight } from 'react-native-reanimated';
import { CharacterAvatar } from '../../components/common/CharacterAvatar';
import { GradientButton } from '../../components/common/GradientButton';
import { useStore } from '../../store/useStore';
import { COLORS, CHARACTER_PARTS, EMOTION_PRESETS } from '../../constants';
import { CharacterCustomization, Character } from '../../types';

const { width } = Dimensions.get('window');

const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  body: 'body1', head: 'head1', eyes: 'eyes2', mouth: 'mouth1',
  hair: 'hair3', accessories: 'none', outfit: 'casual',
  skinColor: '#FFD93D', hairColor: '#8B4513', eyeColor: '#6C5CE7',
  outfitColor: '#6C5CE7', backgroundColor: '#A29BFE', name: 'My Character',
};

const SKIN_COLORS = ['#FDBCB4', '#F5CBA7', '#FFD93D', '#D4A76A', '#A0522D', '#8B6331', '#654321', '#C0C0C0'];
const HAIR_COLORS = ['#000000', '#2C1503', '#8B4513', '#D2691E', '#FFD700', '#FF4500', '#FF69B4', '#9400D3', '#C0C0C0', '#FFFFFF'];
const EYE_COLORS = ['#2C1503', '#1E90FF', '#00B894', '#6C5CE7', '#FF6B6B', '#FDCB6E', '#2D3436', '#74B9FF'];
const OUTFIT_COLORS = ['#6C5CE7', '#FF6B6B', '#00B894', '#FDCB6E', '#0984E3', '#E17055', '#FD79A8', '#2D3436', '#74B9FF', '#FFFFFF'];
const BG_COLORS = ['#A29BFE', '#FD79A8', '#74B9FF', '#55EFC4', '#FDCB6E', '#E17055', '#2D3436', '#0B0B3B', '#FFFFFF'];

type TabId = 'face' | 'hair' | 'outfit' | 'colors' | 'accessories' | 'emotions';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'face', icon: '👁', label: 'Face' },
  { id: 'hair', icon: '💇', label: 'Hair' },
  { id: 'outfit', icon: '👕', label: 'Outfit' },
  { id: 'colors', icon: '🎨', label: 'Colors' },
  { id: 'accessories', icon: '🎩', label: 'Extras' },
  { id: 'emotions', icon: '😊', label: 'Emotions' },
];

export function CharacterCreateScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { addCharacter, user } = useStore();
  const [customization, setCustomization] = useState<CharacterCustomization>(DEFAULT_CUSTOMIZATION);
  const [activeTab, setActiveTab] = useState<TabId>('face');
  const [showSave, setShowSave] = useState(false);
  const [charName, setCharName] = useState('My Character');

  const update = (key: keyof CharacterCustomization, value: string) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  const applyEmotion = (emotion: typeof EMOTION_PRESETS[0]) => {
    setCustomization(prev => ({ ...prev, eyes: emotion.eyes, mouth: emotion.mouth }));
  };

  const handleSave = () => {
    const newChar: Character = {
      id: generateId(),
      name: charName,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customization: { ...customization, name: charName },
      animations: ['wave'],
      isFavorite: false,
    };
    addCharacter(newChar);
    setShowSave(false);
    Alert.alert('🎉 Character Saved!', `"${charName}" has been added to your gallery.`, [
      { text: 'View Gallery', onPress: () => navigation.navigate('Gallery') },
      { text: 'Keep Creating', style: 'cancel' },
    ]);
  };

  const renderOptions = (options: string[], key: keyof CharacterCustomization, labels?: string[]) => (
    <View style={styles.optionsGrid}>
      {options.map((opt, i) => (
        <TouchableOpacity
          key={opt}
          style={[styles.optionBtn, customization[key] === opt && styles.optionBtnActive]}
          onPress={() => update(key, opt)}
        >
          <Text style={styles.optionText}>{labels?.[i] || opt.replace(/[a-z]+/g, '').replace(/(\d+)/, '#$1')}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderColorPicker = (colors: string[], key: keyof CharacterCustomization, label: string) => (
    <View style={styles.colorSection}>
      <Text style={styles.colorLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorDot,
              { backgroundColor: color, borderColor: color === '#FFFFFF' ? '#ccc' : color },
              customization[key] === color && styles.colorDotActive,
            ]}
            onPress={() => update(key, color)}
          >
            {customization[key] === color && (
              <Ionicons name="checkmark" size={14} color={color === '#FFFFFF' || color === '#FDCB6E' ? '#333' : '#fff'} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'face':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.optionGroupLabel}>Eye Style</Text>
            {renderOptions(CHARACTER_PARTS.eyes, 'eyes')}
            <Text style={styles.optionGroupLabel}>Mouth Style</Text>
            {renderOptions(CHARACTER_PARTS.mouths, 'mouth')}
          </View>
        );
      case 'hair':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.optionGroupLabel}>Hair Style</Text>
            <View style={styles.optionsGrid}>
              {CHARACTER_PARTS.hair.map((h, i) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.optionBtn, customization.hair === h && styles.optionBtnActive]}
                  onPress={() => update('hair', h)}
                >
                  <Text style={styles.optionText}>Style {i + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'outfit':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.optionGroupLabel}>Outfit Style</Text>
            <View style={styles.outfitGrid}>
              {CHARACTER_PARTS.outfits.map(outfit => (
                <TouchableOpacity
                  key={outfit}
                  style={[styles.outfitBtn, customization.outfit === outfit && styles.outfitBtnActive]}
                  onPress={() => update('outfit', outfit)}
                >
                  <Text style={styles.outfitIcon}>
                    {outfit === 'casual' ? '👕' : outfit === 'formal' ? '👔' : outfit === 'hero' ? '🦸' :
                      outfit === 'princess' ? '👸' : outfit === 'ninja' ? '🥷' : outfit === 'wizard' ? '🧙' : '🤖'}
                  </Text>
                  <Text style={[styles.outfitLabel, customization.outfit === outfit && { color: COLORS.primary }]}>
                    {outfit.charAt(0).toUpperCase() + outfit.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'colors':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {renderColorPicker(SKIN_COLORS, 'skinColor', '🎭 Skin Color')}
            {renderColorPicker(HAIR_COLORS, 'hairColor', '💇 Hair Color')}
            {renderColorPicker(EYE_COLORS, 'eyeColor', '👁 Eye Color')}
            {renderColorPicker(OUTFIT_COLORS, 'outfitColor', '👕 Outfit Color')}
            {renderColorPicker(BG_COLORS, 'backgroundColor', '🎨 Background')}
          </ScrollView>
        );
      case 'accessories':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.optionGroupLabel}>Accessories</Text>
            <View style={styles.outfitGrid}>
              {CHARACTER_PARTS.accessories.map(acc => (
                <TouchableOpacity
                  key={acc}
                  style={[styles.outfitBtn, customization.accessories === acc && styles.outfitBtnActive]}
                  onPress={() => update('accessories', acc)}
                >
                  <Text style={styles.outfitIcon}>
                    {acc === 'none' ? '🚫' : acc === 'glasses' ? '🕶' : acc === 'hat' ? '🎩' :
                      acc === 'crown' ? '👑' : acc === 'headband' ? '🎀' : '🎀'}
                  </Text>
                  <Text style={[styles.outfitLabel, customization.accessories === acc && { color: COLORS.primary }]}>
                    {acc.charAt(0).toUpperCase() + acc.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'emotions':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.optionGroupLabel}>Quick Emotion Presets</Text>
            <View style={styles.emotionGrid}>
              {EMOTION_PRESETS.map(em => (
                <TouchableOpacity
                  key={em.id}
                  style={styles.emotionBtn}
                  onPress={() => applyEmotion(em)}
                >
                  <Text style={styles.emotionEmoji}>{em.label.split(' ')[0]}</Text>
                  <Text style={styles.emotionLabel}>{em.label.split(' ').slice(1).join(' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>✨ Character Creator</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => setShowSave(true)}>
          <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.saveBtnGrad}>
            <Ionicons name="save-outline" size={16} color="#fff" />
            <Text style={styles.saveBtnText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <Animated.View entering={FadeIn} style={styles.previewSection}>
        <LinearGradient colors={['#1A1A35', '#242444']} style={styles.previewBg}>
          {/* Animated dots background */}
          <View style={[styles.previewDot, { top: 10, left: 20, width: 40, height: 40, backgroundColor: customization.backgroundColor + '50' }]} />
          <View style={[styles.previewDot, { top: 40, right: 10, width: 25, height: 25, backgroundColor: '#6C5CE7' + '40' }]} />
          <View style={[styles.previewDot, { bottom: 10, left: 50, width: 30, height: 30, backgroundColor: COLORS.secondary + '40' }]} />

          <CharacterAvatar customization={customization} size={160} />

          <View style={styles.previewInfo}>
            <Text style={styles.previewName}>{charName}</Text>
            <View style={styles.previewTags}>
              <View style={styles.tag}><Text style={styles.tagText}>{customization.outfit}</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>{customization.accessories}</Text></View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab content */}
      <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Save Modal */}
      <Modal visible={showSave} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animated.View entering={SlideInRight} style={styles.modalContent}>
            <LinearGradient colors={['#1A1A35', '#242444']} style={styles.modalInner}>
              <Text style={styles.modalTitle}>💾 Save Character</Text>
              <CharacterAvatar customization={{ ...customization, name: charName }} size={120} style={{ alignSelf: 'center', marginVertical: 16 }} />
              <Text style={styles.modalLabel}>Character Name</Text>
              <TextInput
                style={styles.modalInput}
                value={charName}
                onChangeText={setCharName}
                placeholder="Enter a creative name..."
                placeholderTextColor={COLORS.textMuted}
              />
              <View style={styles.modalButtons}>
                <GradientButton title="💾 Save Character" onPress={handleSave} style={{ flex: 1 }} />
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSave(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  saveBtn: { borderRadius: 10, overflow: 'hidden' },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  previewSection: { margin: 16, borderRadius: 20, overflow: 'hidden' },
  previewBg: {
    alignItems: 'center', padding: 24, borderRadius: 20,
    position: 'relative', flexDirection: 'row', gap: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  previewDot: { position: 'absolute', borderRadius: 999 },
  previewInfo: { flex: 1 },
  previewName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  previewTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: COLORS.primary + '30', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS.primary + '50',
  },
  tagText: { color: COLORS.textAccent, fontSize: 11, fontWeight: '600' },
  tabs: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  tab: {
    alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, backgroundColor: COLORS.backgroundCard,
    borderWidth: 1, borderColor: COLORS.border, gap: 2,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  tabLabelActive: { color: '#fff' },
  contentArea: { flex: 1, paddingHorizontal: 16 },
  tabContent: { paddingTop: 12, paddingBottom: 20 },
  optionGroupLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 10, marginTop: 4 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optionBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: COLORS.backgroundCard, borderWidth: 1, borderColor: COLORS.border,
  },
  optionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  outfitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  outfitBtn: {
    width: (width - 64) / 3, alignItems: 'center', padding: 12,
    backgroundColor: COLORS.backgroundCard, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  outfitBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  outfitIcon: { fontSize: 24, marginBottom: 4 },
  outfitLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  colorSection: { marginBottom: 16 },
  colorLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
  colorRow: { gap: 8, paddingVertical: 4 },
  colorDot: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
  },
  colorDotActive: { transform: [{ scale: 1.2 }], shadowColor: '#000', shadowRadius: 6, elevation: 6 },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  emotionBtn: {
    alignItems: 'center', padding: 14,
    backgroundColor: COLORS.backgroundCard, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border, width: (width - 64) / 3,
  },
  emotionEmoji: { fontSize: 28, marginBottom: 6 },
  emotionLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalInner: { padding: 24, gap: 12, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  modalLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  modalInput: {
    backgroundColor: COLORS.backgroundElevated, borderRadius: 12,
    padding: 14, color: COLORS.textPrimary, fontSize: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalButtons: { gap: 10 },
  cancelBtn: { alignItems: 'center', padding: 12 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
});
