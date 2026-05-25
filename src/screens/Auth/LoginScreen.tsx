import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GradientButton } from '../../components/common/GradientButton';
import { useStore } from '../../store/useStore';
import { COLORS, SIZES } from '../../constants';

export function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    const success = await login(email.trim(), password);
    if (!success) {
      setError('Invalid email or password. Try: admin@cartoonai.com or creator@test.com');
    }
  };

  const hints = [
    { email: 'admin@cartoonai.com', role: 'Admin (Studio)', icon: '👑' },
    { email: 'creator@test.com', role: 'Creator Pro', icon: '💎' },
    { email: 'user@test.com', role: 'Free User', icon: '⭐' },
  ];

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard, COLORS.background]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>

          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(0)} style={styles.logoSection}>
            <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🎨</Text>
            </LinearGradient>
            <Text style={styles.appName}>CartoonAI Studio</Text>
            <Text style={styles.tagline}>Create • Animate • Publish</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.form}>
            <Text style={styles.title}>Welcome Back! 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue creating</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <GradientButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              style={styles.loginBtn}
            />

            {/* Demo hints */}
            <View style={styles.hintsSection}>
              <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>Demo Accounts</Text><View style={styles.dividerLine} /></View>
              {hints.map(hint => (
                <TouchableOpacity
                  key={hint.email}
                  style={styles.hintCard}
                  onPress={() => { setEmail(hint.email); setPassword('password123'); }}
                >
                  <Text style={styles.hintIcon}>{hint.icon}</Text>
                  <View style={styles.hintInfo}>
                    <Text style={styles.hintEmail}>{hint.email}</Text>
                    <Text style={styles.hintRole}>{hint.role}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={14} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Register link */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.registerSection}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Create Free Account</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 12, marginBottom: 12,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  form: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: COLORS.border,
  },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.error + '20', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: COLORS.error + '40', marginBottom: 16,
  },
  errorText: { color: COLORS.error, fontSize: 13, flex: 1 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.backgroundElevated, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, height: 50,
  },
  inputIcon: { marginLeft: 14 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 15, paddingHorizontal: 12 },
  eyeBtn: { paddingHorizontal: 14 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  loginBtn: { marginBottom: 24 },
  hintsSection: { gap: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  hintCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.backgroundElevated, borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  hintIcon: { fontSize: 20 },
  hintInfo: { flex: 1 },
  hintEmail: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600' },
  hintRole: { fontSize: 11, color: COLORS.textMuted },
  registerSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' },
  registerText: { color: COLORS.textSecondary, fontSize: 14 },
  registerLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});
