import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientButton } from '../../components/common/GradientButton';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../constants';

export function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    await register(name.trim(), email.trim(), password);
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.backgroundCard, COLORS.background]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>

          <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <LinearGradient colors={['#6C5CE7', '#FD79A8']} style={styles.logoCircle}>
              <Text style={{ fontSize: 32 }}>✨</Text>
            </LinearGradient>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your cartoon journey for free!</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150)} style={styles.form}>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {[
              { label: 'Full Name', icon: 'person-outline', value: name, setter: setName, placeholder: 'Your creative name', type: 'default' as const },
              { label: 'Email', icon: 'mail-outline', value: email, setter: setEmail, placeholder: 'your@email.com', type: 'email-address' as const },
            ].map(({ label, icon, value, setter, placeholder, type }) => (
              <View key={label} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name={icon as any} size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={value}
                    onChangeText={setter}
                    keyboardType={type}
                    autoCapitalize={type === 'default' ? 'words' : 'none'}
                  />
                </View>
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Min 6 characters"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPw}
                />
              </View>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsBox}>
              {['3 free characters per month', '1 cartoon video included', 'No credit card required'].map(b => (
                <View key={b} style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.benefitText}>{b}</Text>
                </View>
              ))}
            </View>

            <GradientButton
              title="🚀 Create Free Account"
              onPress={handleRegister}
              loading={isLoading}
              size="lg"
              gradient={['#6C5CE7', '#A29BFE']}
            />

            <Text style={styles.terms}>
              By creating an account you agree to our{' '}
              <Text style={{ color: COLORS.primary }}>Terms of Service</Text> and{' '}
              <Text style={{ color: COLORS.primary }}>Privacy Policy</Text>
            </Text>
          </Animated.View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 24 },
  backBtn: {
    position: 'absolute', left: 0, top: 0,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.backgroundElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  form: {
    backgroundColor: COLORS.backgroundCard, borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: COLORS.border, gap: 4,
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.error + '20', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: COLORS.error + '40', marginBottom: 8,
  },
  errorText: { color: COLORS.error, fontSize: 13, flex: 1 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 7 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.backgroundElevated, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, height: 50,
  },
  inputIcon: { marginLeft: 14 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 15, paddingHorizontal: 12 },
  eyeBtn: { paddingHorizontal: 14 },
  benefitsBox: {
    backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: COLORS.success + '30', gap: 8, marginVertical: 12,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitText: { color: COLORS.textPrimary, fontSize: 13 },
  terms: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 17 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: COLORS.textSecondary, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});
