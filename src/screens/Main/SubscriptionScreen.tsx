import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInUp, ZoomIn } from 'react-native-reanimated';
import { GradientButton } from '../../components/common/GradientButton';
import { useStore } from '../../store/useStore';
import { COLORS, SUBSCRIPTION_PLANS } from '../../constants';
import { SubscriptionTier } from '../../types';

const { width } = Dimensions.get('window');

export function SubscriptionScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, upgradeSubscription, isLoading } = useStore();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showSuccess, setShowSuccess] = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState('');

  const discount = billing === 'yearly' ? 0.6 : 1;

  const handleUpgrade = async (planId: SubscriptionTier, planName: string) => {
    if (planId === user?.subscription) {
      Alert.alert('Already Subscribed', `You're already on the ${planName} plan.`);
      return;
    }
    if (planId === 'free') return;

    Alert.alert(
      `Upgrade to ${planName}`,
      `You'll be charged $${(SUBSCRIPTION_PLANS.find(p => p.id === planId)?.price || 0 * discount).toFixed(2)}/${billing === 'yearly' ? 'month (billed yearly)' : 'month'}.\n\nThis is a demo — no real payment will be processed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe Now',
          onPress: async () => {
            const success = await upgradeSubscription(planId);
            if (success) {
              setUpgradedPlan(planName);
              setShowSuccess(true);
              setTimeout(() => {
                setShowSuccess(false);
                navigation.goBack();
              }, 3000);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={[COLORS.background, '#12123A', COLORS.background]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }]}
      >
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(0)} style={styles.hero}>
          <LinearGradient colors={['#FFD700', '#FFA500', '#FF6347']} style={styles.crownBg}>
            <Text style={styles.crownEmoji}>👑</Text>
          </LinearGradient>
          <Text style={styles.heroTitle}>Choose Your Plan</Text>
          <Text style={styles.heroSubtitle}>
            Unlock unlimited characters, HD videos, and YouTube publishing
          </Text>
        </Animated.View>

        {/* Billing toggle */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingBtn, billing === 'monthly' && styles.billingBtnActive]}
            onPress={() => setBilling('monthly')}
          >
            <Text style={[styles.billingBtnText, billing === 'monthly' && styles.billingBtnTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingBtn, billing === 'yearly' && styles.billingBtnActive]}
            onPress={() => setBilling('yearly')}
          >
            <Text style={[styles.billingBtnText, billing === 'yearly' && styles.billingBtnTextActive]}>Yearly</Text>
            <View style={styles.saveBadge}><Text style={styles.saveBadgeText}>SAVE 40%</Text></View>
          </TouchableOpacity>
        </Animated.View>

        {/* Plans */}
        {SUBSCRIPTION_PLANS.map((plan, i) => {
          const isCurrentPlan = user?.subscription === plan.id;
          const price = billing === 'yearly' && plan.price > 0
            ? (plan.price * discount).toFixed(2)
            : plan.price.toFixed(2);

          return (
            <Animated.View key={plan.id} entering={FadeInDown.delay(150 + i * 80)}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleUpgrade(plan.id as SubscriptionTier, plan.name)}
                style={[styles.planCard, plan.popular && styles.planCardPopular]}
              >
                {plan.popular && (
                  <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.popularBadge}>
                    <Text style={styles.popularText}>⚡ MOST POPULAR</Text>
                  </LinearGradient>
                )}

                <LinearGradient colors={plan.color as any} style={styles.planHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.priceRow}>
                      {plan.price === 0 ? (
                        <Text style={styles.planPrice}>Free</Text>
                      ) : (
                        <>
                          <Text style={styles.planPrice}>${price}</Text>
                          <Text style={styles.planPeriod}>/{plan.period}</Text>
                        </>
                      )}
                    </View>
                    {billing === 'yearly' && plan.price > 0 && (
                      <Text style={styles.savedText}>Save ${(plan.price * 12 * 0.4).toFixed(0)}/year</Text>
                    )}
                  </View>
                  {isCurrentPlan && (
                    <View style={styles.currentBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={styles.currentText}>Current</Text>
                    </View>
                  )}
                </LinearGradient>

                <View style={styles.planBody}>
                  {plan.features.map((feature, fi) => (
                    <View key={fi} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                  {plan.limitations.map((limit, li) => (
                    <View key={li} style={styles.featureRow}>
                      <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
                      <Text style={[styles.featureText, styles.featureLimited]}>{limit}</Text>
                    </View>
                  ))}

                  {plan.id !== 'free' && !isCurrentPlan && (
                    <LinearGradient
                      colors={plan.color as any}
                      style={styles.subscribeBtn}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.subscribeBtnText}>
                        {isLoading ? 'Processing...' : `Subscribe to ${plan.name}`}
                      </Text>
                    </LinearGradient>
                  )}

                  {isCurrentPlan && (
                    <View style={styles.activeIndicator}>
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                      <Text style={styles.activeText}>Your current plan</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Guarantees */}
        <Animated.View entering={FadeInDown.delay(450)} style={styles.guarantees}>
          {[
            { icon: '🔒', text: 'Secure payment with SSL encryption' },
            { icon: '↩️', text: '7-day money back guarantee' },
            { icon: '❌', text: 'Cancel anytime, no questions asked' },
            { icon: '📱', text: 'Works on Android and iOS' },
          ].map((g, i) => (
            <View key={i} style={styles.guaranteeRow}>
              <Text style={styles.guaranteeIcon}>{g.icon}</Text>
              <Text style={styles.guaranteeText}>{g.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes! Cancel your subscription at any time with no penalty.' },
            { q: 'What payment methods are accepted?', a: 'Credit/debit cards, PayPal, and Google Pay.' },
            { q: 'Do unused videos roll over?', a: 'No, but Studio Pro has unlimited videos so you never need to worry!' },
          ].map((faq, i) => (
            <View key={i} style={styles.faqItem}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={styles.faqA}>{faq.a}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <Animated.View entering={ZoomIn} style={styles.successCard}>
            <LinearGradient colors={['#1A1A35', '#242444']} style={styles.successContent}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>Welcome to {upgradedPlan}!</Text>
              <Text style={styles.successSubtitle}>Your subscription is now active. Enjoy all premium features!</Text>
              <View style={styles.confetti}>
                {['🌟', '✨', '🎊', '🎉', '⭐', '💎'].map((e, i) => (
                  <Text key={i} style={[styles.confettiEmoji, { top: Math.random() * 100, left: Math.random() * 200 }]}>{e}</Text>
                ))}
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
  scroll: { paddingHorizontal: 16 },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  hero: { alignItems: 'center', marginBottom: 24 },
  crownBg: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15,
  },
  crownEmoji: { fontSize: 44 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: 16 },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard, borderRadius: 14, padding: 4,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  billingBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  billingBtnActive: { backgroundColor: COLORS.primary },
  billingBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  billingBtnTextActive: { color: '#fff' },
  saveBadge: { backgroundColor: COLORS.success, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  saveBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  planCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  planCardPopular: { borderColor: COLORS.primary, borderWidth: 2 },
  popularBadge: { paddingVertical: 6, alignItems: 'center' },
  popularText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  planHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginTop: 4 },
  planPrice: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  planPeriod: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  savedText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  currentBadge: { flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: 6 },
  currentText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  planBody: { padding: 20, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  featureLimited: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  subscribeBtn: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  subscribeBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  activeIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 8, padding: 10 },
  activeText: { color: COLORS.success, fontWeight: '700', fontSize: 14 },
  guarantees: {
    backgroundColor: COLORS.backgroundCard, borderRadius: 16, padding: 16, gap: 10,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  guaranteeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  guaranteeIcon: { fontSize: 18 },
  guaranteeText: { color: COLORS.textSecondary, fontSize: 13 },
  faqSection: { gap: 12, marginBottom: 20 },
  faqTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  faqItem: {
    backgroundColor: COLORS.backgroundCard, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, gap: 6,
  },
  faqQ: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  faqA: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: { width: '100%', borderRadius: 28, overflow: 'hidden' },
  successContent: { padding: 40, alignItems: 'center', gap: 12, position: 'relative' },
  successEmoji: { fontSize: 72 },
  successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  successSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  confetti: { position: 'absolute', width: '100%', height: '100%' },
  confettiEmoji: { position: 'absolute', fontSize: 20 },
});
