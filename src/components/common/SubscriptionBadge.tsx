import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants';
import { SubscriptionTier } from '../../types';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  size?: 'sm' | 'md' | 'lg';
}

const TIER_CONFIG = {
  free: { label: 'FREE', gradient: ['#636e72', '#b2bec3'] as const, icon: '⭐' },
  pro: { label: 'PRO', gradient: ['#6C5CE7', '#A29BFE'] as const, icon: '💎' },
  studio: { label: 'STUDIO', gradient: ['#FFD700', '#FFA500'] as const, icon: '👑' },
};

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  tier,
  size = 'md',
}) => {
  const config = TIER_CONFIG[tier];

  const sizeConfig = {
    sm: { px: 6, py: 2, fontSize: 9, borderRadius: 6, iconSize: 10 },
    md: { px: 10, py: 4, fontSize: 11, borderRadius: 8, iconSize: 12 },
    lg: { px: 14, py: 6, fontSize: 13, borderRadius: 10, iconSize: 14 },
  };

  const sc = sizeConfig[size];

  return (
    <LinearGradient
      colors={config.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.badge, {
        paddingHorizontal: sc.px,
        paddingVertical: sc.py,
        borderRadius: sc.borderRadius,
      }]}
    >
      <Text style={{ fontSize: sc.iconSize }}>{config.icon}</Text>
      <Text style={[styles.label, { fontSize: sc.fontSize, marginLeft: 3 }]}>
        {config.label}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
