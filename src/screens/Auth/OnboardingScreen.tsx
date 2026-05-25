import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { GradientButton } from '../../components/common/GradientButton';
import { COLORS, SIZES } from '../../constants';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🎨',
    title: 'Create Cartoon\nCharacters',
    description: 'Design unique cartoon characters with our powerful editor. Customize every detail — from eyes to outfits!',
    gradient: ['#6C5CE7', '#A29BFE'] as const,
    accent: '#A29BFE',
  },
  {
    id: '2',
    emoji: '🎬',
    title: 'Make Amazing\nCartoon Videos',
    description: 'Bring your characters to life! Create animated cartoon stories with scenes, dialogue, and music.',
    gradient: ['#FD79A8', '#FDCB6E'] as const,
    accent: '#FD79A8',
  },
  {
    id: '3',
    emoji: '📺',
    title: 'Publish to\nYouTube',
    description: 'Export in HD and publish directly to YouTube. Grow your cartoon channel and reach millions of viewers!',
    gradient: ['#00B894', '#00CEC9'] as const,
    accent: '#00B894',
  },
  {
    id: '4',
    emoji: '🚀',
    title: 'Start Your\nCartoon Journey',
    description: 'Join thousands of creators. Start free, upgrade for premium features. Your cartoon story starts here!',
    gradient: ['#E17055', '#FDCB6E'] as const,
    accent: '#FDCB6E',
  },
];

export function OnboardingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login');
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <Animated.View entering={FadeIn.delay(100)} style={styles.emojiContainer}>
              <LinearGradient
                colors={item.gradient}
                style={styles.emojiCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </LinearGradient>

              {/* Floating decoration circles */}
              <View style={[styles.decoCircle, { top: -20, right: -10, backgroundColor: item.accent + '40', width: 60, height: 60 }]} />
              <View style={[styles.decoCircle, { bottom: 10, left: -20, backgroundColor: item.accent + '30', width: 80, height: 80 }]} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Animated.View>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      {/* Bottom section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
                index === currentIndex && { backgroundColor: SLIDES[currentIndex].accent },
              ]}
            />
          ))}
        </View>

        <GradientButton
          title={isLast ? '🚀 Get Started Free' : 'Next →'}
          onPress={goNext}
          gradient={SLIDES[currentIndex].gradient as any}
          size="lg"
          style={styles.nextBtn}
        />

        {!isLast && (
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {isLast && (
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Already have an account? <Text style={{ color: COLORS.primary }}>Sign In</Text></Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emojiContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  emojiCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  emoji: { fontSize: 72 },
  decoCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  textContainer: { alignItems: 'center' },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 24,
  },
  nextBtn: { width: '100%' },
  skipBtn: { paddingVertical: 8 },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
