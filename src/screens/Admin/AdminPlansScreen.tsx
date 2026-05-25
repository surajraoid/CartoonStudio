import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedCard } from '../../components/common/AnimatedCard';
import { GradientButton } from '../../components/common/GradientButton';
import { COLORS, SUBSCRIPTION_PLANS } from '../../constants';

export function AdminPlansScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState(SUBSCRIPTION_PLANS.map(p => ({ ...p, enabled: true })));
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const handleEditPrice = (planId: string, currentPrice: number) => {
    setEditingPlan(planId);
    setEditPrice(currentPrice.toString());
  };

  const handleSavePrice = (planId: string) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: newPrice } : p));
    setEditingPlan(null);
    Alert.alert('✅ Updated', 'Plan price has been updated successfully.');
  };

  const togglePlan = (planId: string) => {
    if (planId === 'free') { Alert.alert('Cannot disable', 'The Free plan cannot be disabled.'); return; }
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>💎 Subscription Plans</Text>
          <Text style={styles.headerSub}>Manage pricing & features</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>

        <Animated.View entering={FadeInDown.delay(0)} style={styles.warningBanner}>
          <Ionicons name="warning" size={16} color={COLORS.warning} />
          <Text style={styles.warningText}>Changes to pricing take effect immediately for new subscribers.</Text>
        </Animated.View>

        {plans.map((plan, i) => (
          <Animated.View key={plan.id} entering={FadeInDown.delay(i * 80)}>
            <AnimatedCard style={styles.planCard}>
              {/* Plan header */}
              <LinearGradient colors={plan.color as any} style={styles.planHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.planHeaderLeft}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planId}>ID: {plan.id}</Text>
                </View>
                <Switch
                  value={plan.enabled !== false}
                  onValueChange={() => togglePlan(plan.id)}
                  trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.8)' }}
                  thumbColor="#fff"
                />
              </LinearGradient>

              {/* Price section */}
              <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Monthly Price</Text>
                {editingPlan === plan.id ? (
                  <View style={styles.priceEditRow}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={editPrice}
                      onChangeText={setEditPrice}
                      keyboardType="decimal-pad"
                      autoFocus
                    />
                    <TouchableOpacity style={styles.saveBtn} onPress={() => handleSavePrice(plan.id)}>
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelSmBtn} onPress={() => setEditingPlan(null)}>
                      <Ionicons name="close" size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceValue}>
                      {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}/month`}
                    </Text>
                    {plan.id !== 'free' && (
                      <TouchableOpacity
                        style={styles.editPriceBtn}
                        onPress={() => handleEditPrice(plan.id, plan.price)}
                      >
                        <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.editPriceBtnText}>Edit</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Features */}
              <View style={styles.featuresSection}>
                <Text style={styles.featuresLabel}>Features ({plan.features.length})</Text>
                {plan.features.map((feature, fi) => (
                  <View key={fi} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {plan.id === 'free' ? '1' : plan.id === 'pro' ? '1' : '1'}
                  </Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    ${(plan.price * (plan.id === 'free' ? 0 : plan.id === 'pro' ? 1 : 1)).toFixed(0)}
                  </Text>
                  <Text style={styles.statLabel}>MRR</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: plan.enabled ? COLORS.success : COLORS.error }]}>
                    {plan.enabled ? '●' : '●'}
                  </Text>
                  <Text style={styles.statLabel}>Status</Text>
                </View>
              </View>
            </AnimatedCard>
          </Animated.View>
        ))}

        {/* Promo codes section */}
        <Animated.View entering={FadeInDown.delay(350)}>
          <AnimatedCard style={styles.promoCard}>
            <Text style={styles.promoTitle}>🎟️ Promo Codes</Text>
            <Text style={styles.promoSubtitle}>Manage discount codes for special promotions</Text>
            <View style={styles.promoList}>
              {[
                { code: 'LAUNCH50', discount: '50%', uses: 23, active: true },
                { code: 'CREATOR30', discount: '30%', uses: 45, active: true },
                { code: 'SUMMER2024', discount: '25%', uses: 100, active: false },
              ].map((promo, i) => (
                <View key={i} style={styles.promoRow}>
                  <View style={styles.promoCodeBg}>
                    <Text style={styles.promoCode}>{promo.code}</Text>
                  </View>
                  <View style={styles.promoInfo}>
                    <Text style={styles.promoDiscount}>{promo.discount} off</Text>
                    <Text style={styles.promoUses}>{promo.uses} uses</Text>
                  </View>
                  <View style={[styles.promoBadge, { backgroundColor: promo.active ? COLORS.success + '20' : COLORS.error + '20' }]}>
                    <Text style={[styles.promoBadgeText, { color: promo.active ? COLORS.success : COLORS.error }]}>
                      {promo.active ? 'Active' : 'Expired'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <GradientButton title="+ Add Promo Code" onPress={() => Alert.alert('Coming Soon', 'Promo code creation coming soon!')} variant="outline" size="sm" style={{ marginTop: 8 }} />
          </AnimatedCard>
        </Animated.View>

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
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textMuted },
  scroll: { padding: 16, gap: 14 },
  warningBanner: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '15', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: COLORS.warning + '40',
  },
  warningText: { flex: 1, color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  planCard: { padding: 0, overflow: 'hidden', gap: 0 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  planHeaderLeft: {},
  planName: { color: '#fff', fontSize: 18, fontWeight: '800' },
  planId: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  priceSection: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  priceLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceValue: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  editPriceBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  editPriceBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  priceEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dollarSign: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  priceInput: {
    flex: 1, backgroundColor: COLORS.backgroundElevated, borderRadius: 8,
    padding: 10, color: COLORS.textPrimary, fontSize: 18, fontWeight: '700',
    borderWidth: 1, borderColor: COLORS.primary,
  },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelSmBtn: { padding: 6 },
  featuresSection: { padding: 16, gap: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  featuresLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '700', marginBottom: 2 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureText: { flex: 1, color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  statsRow: { flexDirection: 'row', padding: 14, gap: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  promoCard: { gap: 12 },
  promoTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  promoSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  promoList: { gap: 8 },
  promoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.backgroundElevated, borderRadius: 10, padding: 10,
  },
  promoCodeBg: { backgroundColor: COLORS.primary + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  promoCode: { color: COLORS.primary, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  promoInfo: { flex: 1 },
  promoDiscount: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 13 },
  promoUses: { color: COLORS.textMuted, fontSize: 11 },
  promoBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  promoBadgeText: { fontSize: 11, fontWeight: '700' },
});
