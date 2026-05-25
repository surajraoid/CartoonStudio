import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import { COLORS } from '../constants';

// Screens
import { OnboardingScreen } from '../screens/Auth/OnboardingScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { HomeScreen } from '../screens/Main/HomeScreen';
import { CharacterCreateScreen } from '../screens/Main/CharacterCreateScreen';
import { VideoStudioScreen } from '../screens/Main/VideoStudioScreen';
import { GalleryScreen } from '../screens/Main/GalleryScreen';
import { ProfileScreen } from '../screens/Main/ProfileScreen';
import { SubscriptionScreen } from '../screens/Main/SubscriptionScreen';
import { NotificationsScreen } from '../screens/Main/NotificationsScreen';
import { AdminDashboardScreen } from '../screens/Admin/AdminDashboardScreen';
import { AdminUsersScreen } from '../screens/Admin/AdminUsersScreen';
import { AdminPlansScreen } from '../screens/Admin/AdminPlansScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { unreadCount } = useStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, { focused: string; outline: string }> = {
            Home: { focused: 'home', outline: 'home-outline' },
            Create: { focused: 'color-wand', outline: 'color-wand-outline' },
            Studio: { focused: 'film', outline: 'film-outline' },
            Gallery: { focused: 'images', outline: 'images-outline' },
            Profile: { focused: 'person', outline: 'person-outline' },
          };
          const iconSet = icons[route.name];
          const iconName = focused ? iconSet?.focused : iconSet?.outline;
          return <Ionicons name={(iconName || 'help') as any} size={size} color={color} />;
        },
        tabBarBadge: route.name === 'Home' && unreadCount > 0 ? unreadCount : undefined,
        tabBarBadgeStyle: { backgroundColor: COLORS.error, fontSize: 10 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CharacterCreateScreen} />
      <Tab.Screen name="Studio" component={VideoStudioScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useStore();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Subscription"
              component={SubscriptionScreen}
              options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Admin"
              component={AdminDashboardScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="AdminUsers"
              component={AdminUsersScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="AdminPlans"
              component={AdminPlansScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: COLORS.backgroundCard,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
