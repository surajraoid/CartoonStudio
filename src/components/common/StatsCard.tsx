import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS, SIZES } from '../../constants';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  gradient: string[];
  delay?: number;
  suffix?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label, value, icon, gradient, delay = 0, suffix = '',
}) => (
  <Animated.View entering={FadeInUp.delay(delay).springify()} style={styles.wrapper}>
    <LinearGradient colors={gradient as any} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}{suffix}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  </Animated.View>
);

const styles = StyleSheet.create({
  wrapper: { flex: 1, margin: 4 },
  card: {
    borderRadius: SIZES.radiusMd,
    padding: 14,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  icon: { fontSize: 24, marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  label: { fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginTop: 2, textAlign: 'center' },
});
