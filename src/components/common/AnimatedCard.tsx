import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { COLORS, SIZES } from '../../constants';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  delay?: number;
  elevation?: 'low' | 'medium' | 'high';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  onPress,
  delay = 0,
  elevation = 'medium',
}) => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.3);

  const elevationShadows = {
    low: { shadowRadius: 4, elevation: 4 },
    medium: { shadowRadius: 8, elevation: 8 },
    high: { shadowRadius: 16, elevation: 16 },
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.1, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      shadowOpacity.value = withTiming(0.3, { duration: 200 });
    }
  };

  if (onPress) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).springify()}>
        <AnimatedTouchable
          style={[styles.card, elevationShadows[elevation], animatedStyle, style]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {children}
        </AnimatedTouchable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[styles.card, elevationShadows[elevation], style]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
