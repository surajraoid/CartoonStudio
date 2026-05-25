import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, SIZES } from '../../constants';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradient = COLORS.gradient1,
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  variant = 'primary',
  size = 'md',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.02, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
  };

  const fontSizes = { sm: 13, md: 15, lg: 17 };

  if (variant === 'outline') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, styles.outlineButton, sizeStyles[size], style,
          disabled && styles.disabled]}
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.outlineText, { fontSize: fontSizes[size] }, textStyle]}>{title}</Text>
          </View>
        )}
      </AnimatedTouchable>
    );
  }

  if (variant === 'ghost') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, sizeStyles[size], style, disabled && styles.disabled]}
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.ghostText, { fontSize: fontSizes[size] }, textStyle]}>{title}</Text>
          </View>
        )}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      style={[animatedStyle, { borderRadius: sizeStyles[size].borderRadius }, style,
        disabled && styles.disabled]}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <LinearGradient
        colors={disabled ? ['#555', '#444'] : gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyles[size]]}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.text, { fontSize: fontSizes[size] }, textStyle]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ghostText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
