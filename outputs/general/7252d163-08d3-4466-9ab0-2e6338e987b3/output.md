# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/(auth)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/login.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/(auth)/register.tsx
/home/marshall/projects/brainy-builds/app/index.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/achievements.tsx
/home/marshall/projects/brainy-builds/app/(main)/history.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/parent-dashboard.tsx
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
/home/marshall/projects/brainy-builds/app/(main)/rewards.tsx
/home/marshall/projects/brainy-builds/app/(main)/stories/[id].tsx
/home/marshall/projects/brainy-builds/app/(main)/stories/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/story/[week].tsx
/home/marshall/projects/brainy-builds/backend/dist/controllers/achievements.controller.js
/home/marshall/projects/brainy-builds/backend/dist/controllers/rewards.controller.js
/home/marshall/projects/brainy-builds/backend/dist/lib/achievements.js
/home/marshall/projects/brainy-builds/backend/dist/middleware/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/achievements.js
/home/marshall/projects/brainy-builds/backend/dist/routes/achievements.routes.js
/home/marshall/projects/brainy-builds/backend/dist/routes/analytics.js
/home/marshall/projects/brainy-builds/backend/dist/routes/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/profile.js
/home/marshall/projects/brainy-builds/backend/dist/routes/rewards.routes.js
/home/marshall/projects/brainy-builds/backend/dist/routes/stories.js
/home/marshall/projects/brainy-builds/backend/dist/server.js
/home/marshall/projects/brainy-builds/backend/dist/services/points.service.js
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/package-lock.json
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/prisma/seed.ts
/home/marshall/projects/brainy-builds/backend/src/controllers/achievements.controller.ts
/home/marshall/projects/brainy-builds/backend/src/controllers/rewards.controller.ts
/home/marshall/projects/brainy-builds/backend/src/lib/achievements.ts
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/achievements.routes.ts
/home/marshall/projects/brainy-builds/backend/src/routes/achievements.ts
/home/marshall/projects/brainy-builds/backend/src/routes/analytics.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/routes/rewards.routes.ts
/home/marshall/projects/brainy-builds/backend/src/routes/stories.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/src/services/points.service.ts

=== PACKAGE.JSON ===
{
  "name": "brainy-builds",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.23.1",
    "@react-native-voice/voice": "^3.2.4",
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.7",
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-speech": "~12.0.2",
    "expo-speech-recognition": "^3.1.2",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "~3.31.1"
  },
  "devDependencies": {
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  }
}

=== EXISTING FILE CONTENTS ===
--- app/_layout.tsx ---
import { Slot } from 'expo-router';
import { AuthProvider } from '../lib/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

--- app/index.tsx ---
import { Redirect } from 'expo-router';
import { useAuth } from '../lib/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});

--- app/(auth)/_layout.tsx ---
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen 
        name="profile-setup"
        options={{
          headerShown: true,
          headerTitle: 'Profile Setup',
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack>
  );
}

--- app/(auth)/login.tsx ---
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(main)');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🏗️</Text>
          <Text style={styles.title}>Brainy Builds</Text>
          <Text style={styles.subtitle}>Build your dream school!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

--- app/(auth)/register.tsx ---
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(auth)/profile-setup');
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🏗️</Text>
            <Text style={styles.title}>Join Brainy Builds</Text>
            <Text style={styles.subtitle}>Start building your school today!</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter password again"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating account...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

--- app/(main)/_layout.tsx ---
import { Stack } from 'expo-router';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';

export default function MainLayout() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: true,
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                Logout
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          title: 'Achievements',
          headerShown: true,
          headerStyle: { backgroundColor: '#10B981' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="rewards"
        options={{
          title: 'Rewards Store',
          headerShown: true,
          headerStyle: { backgroundColor: '#F59E0B' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="story/[week]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="story"
        options={{
          title: 'Story Time',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

--- app/(main)/index.tsx ---
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../lib/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';

interface Profile {
  id: number;
  name: string;
  schoolName: string;
  avatarId: string;
  grade: number;
}

interface DashboardStats {
  buildingProgress: number;
  pointsBalance: number;
  weeklyStreak: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    buildingProgress: 0,
    pointsBalance: 0,
    weeklyStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      if (!user?.id) return;

      const profileResponse = await api.get(`/profile/${user.id}`);
      setProfile(profileResponse.data);

      setStats({
        buildingProgress: 35,
        pointsBalance: 1250,
        weeklyStreak: 5,
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{profile?.name || 'Builder'}!</Text>
        </View>
        <Text style={styles.avatar}>{profile?.avatarId || '🎓'}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.progressCard]}>
          <Text style={styles.statIcon}>🏗️</Text>
          <Text style={styles.statValue}>{stats.buildingProgress}%</Text>
          <Text style={styles.statLabel}>School Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stats.buildingProgress}%` }]} />
          </View>
        </View>

        <View style={[styles.statCard, styles.pointsCard]}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{stats.pointsBalance}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={[styles.statCard, styles.streakCard]}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{stats.weeklyStreak} days</Text>
          <Text style={styles.statLabel}>Weekly Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Story Library</Text>
        <TouchableOpacity 
          style={styles.storyCard} 
          onPress={() => router.push('/(main)/stories')}
        >
          <Text style={styles.storyIcon}>📖</Text>
          <View style={styles.storyContent}>
            <Text style={styles.storyTitle}>Browse Stories</Text>
            <Text style={styles.storySubtitle}>Read, listen, and build your school</Text>
          </View>
          <Text style={styles.storyArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your School: {profile?.schoolName}</Text>
        <View style={styles.schoolPreview}>
          <Text style={styles.schoolEmoji}>🏫</Text>
          <Text style={styles.schoolStatus}>Building in progress...</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(main)/achievements')}
          >
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(main)/rewards')}
          >
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionText}>Rewards</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  avatar: {
    fontSize: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 100,
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
  },
  progressCard: {
    borderColor: '#3B82F6',
  },
  pointsCard: {
    borderColor: '#F59E0B',
  },
  streakCard: {
    borderColor: '#EF4444',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  storyIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  storySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  storyArrow: {
    fontSize: 24,
    color: '#8B5CF6',
  },
  schoolPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  schoolEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  schoolStatus: {
    fontSize: 16,
    color: '#6B7280',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});

--- lib/AuthContext.tsx ---
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

--- lib/api.ts ---
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('supabase.auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

=== SUMMARY ===
Files found: 9
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# TETSUO

=== TECHNICAL ASSESSMENT ===

**Current State:**
- Story reading screens complete
- Backend achievements/rewards routes exist
- UI pattern established from existing screens
- Both achievements and rewards are core engagement features

**Next Stage: Gamification Screens**

Build order:
1. Achievements screen — display earned badges, progress bars, locked achievements
2. Rewards store screen — browseable rewards catalog with purchase flow

**Technology Stack:**
- Same React Native + expo-router pattern
- API integration via lib/api.ts
- Backend endpoints already functional
- Match existing card-based UI design

**Red Flags:**
- None — straightforward UI build on working backend

**Handoff:**
Passing to Frontend Worker to build both gamification screens.

---

<execute_worker>
<worker_name>Frontend Worker</worker_name>
<worker_context>
You are building the gamification screens for Brainy Builds.

Project: /home/marshall/projects/brainy-builds

**What exists:**
- Backend achievements API at /api/achievements working
- Backend rewards API at /api/rewards working  
- lib/api.ts for API calls
- Points system already tracking progress
- Design system established (card-based, colorful, kid-friendly)

**What you're building:**
1. app/(main)/achievements.tsx — Achievement display with earned/locked states
2. app/(main)/rewards.tsx — Rewards store with purchase functionality

**Requirements:**
- Achievements show progress bars, earned badges with dates, locked achievements grayed out
- Rewards show point cost, purchase button, confirmation flow
- Handle insufficient points gracefully
- Clean, engaging UI matching existing screens
- Error handling for all API calls

Use existing screens (stories, dashboard) as design reference.
</worker_context>
<task>
Build achievements and rewards screens with full backend integration.

Create:
1. app/(main)/achievements.tsx — full achievement tracking UI
2. app/(main)/rewards.tsx — rewards store with purchase flow

Both must integrate with existing backend APIs and match app design system.
</task>
</execute_worker>

=== FRONTEND WORKER ACTIVE ===

**Current Status**: Building gamification screens (achievements + rewards)

**Build Plan:**
1. **Achievements Screen** — earned badges, progress tracking, locked achievements
2. **Rewards Store** — browseable catalog with purchase confirmation

---EXECUTION PLAN---

FILES:

/home/marshall/projects/brainy-builds/app/(main)/achievements.tsx
```typescript
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

interface Achievement {
  id: number;
  title: string;
  description: string;
  emoji: string;
  points: number;
  category: string;
  requirement: number;
  isUnlocked?: boolean;
  progress?: number;
  unlockedAt?: string;
}

interface AchievementStats {
  totalAchievements: number;
  unlockedCount: number;
  totalPointsEarned: number;
}

export default function AchievementsScreen() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: 0,
    unlockedCount: 0,
    totalPointsEarned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const response = await api.get(`/achievements/user/${user.id}`);
      const achievementsData = response.data;

      setAchievements(achievementsData);

      const unlocked = achievementsData.filter((a: Achievement) => a.isUnlocked);
      const pointsEarned = unlocked.reduce((sum: number, a: Achievement) => sum + a.points, 0);

      setStats({
        totalAchievements: achievementsData.length,
        unlockedCount: unlocked.length,
        totalPointsEarned: pointsEarned,
      });
    } catch (err) {
      console.error('Error loading achievements:', err);
      setError('Failed to load achievements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'unlocked') return achievement.isUnlocked;
    if (filter === 'locked') return !achievement.isUnlocked;
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>😞</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAchievements}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsHeader}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.unlockedCount}/{stats.totalAchievements}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.totalPointsEarned}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {stats.totalAchievements > 0 
              ? Math.round((stats.unlockedCount / stats.totalAchievements) * 100)
              : 0}%
          </Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unlocked' && styles.filterButtonActive]}
          onPress={() => setFilter('unlocked')}
        >
          <Text style={[styles.filterText, filter === 'unlocked' && styles.filterTextActive]}>
            Unlocked
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'locked' && styles.filterButtonActive]}
          onPress={() => setFilter('locked')}
        >
          <Text style={[styles.filterText, filter === 'locked' && styles.filterTextActive]}>
            Locked
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.achievementsList}>
        {filteredAchievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              achievement.isUnlocked ? styles.achievementUnlocked : styles.achievementLocked,
            ]}
          >
            <View style={styles.achievementHeader}>
              <Text
                style={[
                  styles.achievementEmoji,
                  !achievement.isUnlocked && styles.achievementEmojiLocked,
                ]}
              >
                {achievement.emoji}
              </Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <Text style={styles.unlockedDate}>
                    Unlocked {formatDate(achievement.unlockedAt)}
                  </Text>
                )}
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsText}>{achievement.points} pts</Text>
              </View>
            </View>

            {!achievement.isUnlocked && achievement.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          (achievement.progress / achievement.requirement) * 100,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {achievement.progress}/{achievement.requirement}
                </Text>
              </View>
            )}

            {achievement.isUnlocked && (
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedBadgeText}>✓ Unlocked</Text>
              </View>
            )}
          </View>
        ))}

        {filteredAchievements.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>
              {filter === 'unlocked'
                ? 'No achievements unlocked yet. Keep reading!'
                : filter === 'locked'
                ? 'All achievements unlocked! 🎉'
                : 'No achievements available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  achievementsList: {
    flex: 1,
    padding: 16,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  achievementUnlocked: {
    borderColor: '#10B981',
  },
  achievementLocked: {
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  achievementEmoji: {
    fontSize: 48,
  },
  achievementEmojiLocked: {
    opacity: 0.4,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  unlockedDate: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600',
  },
  pointsBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  unlockedBadge: {
    marginTop: 12,
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  unlockedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,

---

# BACKEND

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/(auth)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/login.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/(auth)/register.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/achievements.tsx
/home/marshall/projects/brainy-builds/app/(main)/history.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
/home/marshall/projects/brainy-builds/app/(main)/rewards.tsx
/home/marshall/projects/brainy-builds/app/(main)/stories/[id].tsx
/home/marshall/projects/brainy-builds/app/(main)/stories/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/story/[week].tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/index.tsx
/home/marshall/projects/brainy-builds/lib/api.ts
/home/marshall/projects/brainy-builds/lib/AuthContext.tsx
/home/marshall/projects/brainy-builds/lib/supabase.ts
/home/marshall/projects/brainy-builds/backend/src/routes/achievements.routes.ts
/home/marshall/projects/brainy-builds/backend/src/routes/rewards.routes.ts
/home/marshall/projects/brainy-builds/backend/src/controllers/achievements.controller.ts
/home/marshall/projects/brainy-builds/backend/src/controllers/rewards.controller.ts

=== EXISTING FILE CONTENTS ===

--- app/(main)/achievements.tsx (PLACEHOLDER) ---
import { View, Text, StyleSheet } from 'react-native';

export default function AchievementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Achievements Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 18,
    color: '#6B7280',
  },
});

--- app/(main)/rewards.tsx (PLACEHOLDER) ---
import { View, Text, StyleSheet } from 'react-native';

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rewards Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 18,
    color: '#6B7280',
  },
});

--- backend/src/routes/achievements.routes.ts ---
import { Router } from 'express';
import { 
  getUserAchievements, 
  checkAndAwardAchievements 
} from '../controllers/achievements.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/user/:userId', authenticateToken, getUserAchievements);
router.post('/check/:userId', authenticateToken, checkAndAwardAchievements);

export default router;

--- backend/src/routes/rewards.routes.ts ---
import { Router } from 'express';
import { 
  getAvailableRewards, 
  purchaseReward, 
  getUserRewards 
} from '../controllers/rewards.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/available', authenticateToken, getAvailableRewards);
router.post('/purchase', authenticateToken, purchaseReward);
router.get('/user/:userId', authenticateToken, getUserRewards);

export default router;

--- backend/src/controllers/achievements.controller.ts ---
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { checkAchievements } from '../lib/achievements';

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: parseInt(userId) },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

export const checkAndAwardAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const newAchievements = await checkAchievements(parseInt(userId));

    res.json({ 
      newAchievements,
      count: newAchievements.length 
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
};

--- backend/src/controllers/rewards.controller.ts ---
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAvailableRewards = async (req: Request, res: Response) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
    });

    res.json(rewards);
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
};

export const purchaseReward = async (req: Request, res: Response) => {
  try {
    const { userId, rewardId } = req.body;

    const user = await prisma.profile.findUnique({
      where: { id: userId },
    });

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!user || !reward) {
      return res.status(404).json({ error: 'User or reward not found' });
    }

    if (user.pointsBalance < reward.pointsCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const purchase = await prisma.userReward.create({
      data: {
        userId,
        rewardId,
        purchasedAt: new Date(),
      },
    });

    await prisma.profile.update({
      where: { id: userId },
      data: {
        pointsBalance: user.pointsBalance - reward.pointsCost,
      },
    });

    res.json({ success: true, purchase });
  } catch (error) {
    console.error('Purchase reward error:', error);
    res.status(500).json({ error: 'Failed to purchase reward' });
  }
};

export const getUserRewards = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const rewards = await prisma.userReward.findMany({
      where: { userId: parseInt(userId) },
      include: {
        reward: true,
      },
      orderBy: { purchasedAt: 'desc' },
    });

    res.json(rewards);
  } catch (error) {
    console.error('Get user rewards error:', error);
    res.status(500).json({ error: 'Failed to fetch user rewards' });
  }
};

=== SUMMARY ===
Files found: Key files loaded
Project path: /home/marshall/projects/brainy-builds
Backend routes exist for achievements & rewards
Frontend screens are placeholders only

=== TECHNICAL ASSESSMENT ===

**Current State:**
- ✅ Story reading interface complete
- ✅ Backend achievements & rewards APIs ready
- ⚠️ Frontend achievements screen is placeholder
- ⚠️ Frontend rewards screen is placeholder

**Next Stage: Gamification UI**

Build order:
1. Achievements screen — show unlocked badges, progress bars
2. Rewards store screen — browse and purchase rewards with points

**Technology Stack:**
- React Native components (FlatList for scrolling)
- Existing API integration via lib/api.ts
- Auth context for user ID
- Visual design matching story screens

**Requirements:**
- Achievements: Grid of badges with locked/unlocked states
- Rewards: Store interface with point balance and purchase flow
- Both need loading states and error handling
- Kid-friendly animations and emojis

**Red Flags:**
- None — straightforward UI build on solid backend

---

<execute_worker>
<worker_name>Frontend Worker</worker_name>
<worker_context>
You are building the gamification screens for Brainy Builds.

Project: /home/marshall/projects/brainy-builds

**What exists:**
- Backend APIs at /api/achievements and /api/rewards working
- lib/api.ts for API calls
- Auth context provides user.id
- Design system from story screens

**What you're building:**
1. app/(main)/achievements.tsx — Achievement badge grid
2. app/(main)/rewards.tsx — Rewards store

**Requirements:**
- Achievements: Show locked/unlocked badges with progress
- Rewards: Store interface with purchase confirmation
- Both integrate with backend APIs
- Clean, kid-friendly UI with emojis
- Loading states and error handling

Match the visual design of existing screens (stories, dashboard).
</worker_context>
<task>
Build complete achievements and rewards screens with full backend integration.

Replace placeholder files:
1. app/(main)/achievements.tsx
2. app/(main)/rewards.tsx

Both must integrate with existing backend APIs and maintain consistent design.
</task>
</execute_worker>

=== BACKEND WORKER ACTIVE ===

**Current Status**: Backend APIs for achievements and rewards are complete.

**Next Stage**: Build frontend gamification screens

I'll create:
1. **Achievements Screen** (`app/(main)/achievements.tsx`) - Badge collection with progress tracking
2. **Rewards Store Screen** (`app/(main)/rewards.tsx`) - Shop interface to spend points

---EXECUTION PLAN---
FILES:
/home/marshall/projects/brainy-builds/app/(main)/achievements.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { api } from '../../lib/api';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  requirement: number;
  category: string;
}

interface UserAchievement {
  id: number;
  achievementId: number;
  unlockedAt: string;
  achievement: Achievement;
}

export default function AchievementsScreen() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const [userAchievementsResponse, allAchievementsResponse] = await Promise.all([
        api.get(`/achievements/user/${user.id}`),
        api.get('/achievements/all'),
      ]);

      setAchievements(userAchievementsResponse.data);
      setAllAchievements(allAchievementsResponse.data);
    } catch (err) {
      console.error('Error loading achievements:', err);
      setError('Failed to load achievements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async () => {
    try {
      setChecking(true);

      if (!user?.id) return;

      const response = await api.post(`/achievements/check/${user.id}`);
      
      if (response.data.count > 0) {
        Alert.alert(
          '🎉 New Achievement!',
          `You've unlocked ${response.data.count} new achievement${response.data.count > 1 ? 's' : ''}!`,
          [{ text: 'Awesome!', onPress: loadAchievements }]
        );
      } else {
        Alert.alert('All Caught Up!', 'No new achievements yet. Keep reading!');
      }
    } catch (err) {
      console.error('Error checking achievements:', err);
      Alert.alert('Error', 'Failed to check for new achievements');
    } finally {
      setChecking(false);
    }
  };

  const isUnlocked = (achievementId: number): boolean => {
    return achievements.some(ua => ua.achievementId === achievementId);
  };

  const getUnlockedDate = (achievementId: number): string | null => {
    const userAchievement = achievements.find(ua => ua.achievementId === achievementId);
    if (!userAchievement) return null;
    
    const date = new Date(userAchievement.unlockedAt);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>😞</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAchievements}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const unlockedCount = achievements.length;
  const totalCount = allAchievements.length;
  const progressPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🏆 Achievement Collection</Text>
          <Text style={styles.headerStats}>
            {unlockedCount} of {totalCount} unlocked ({progressPercentage}%)
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>

        <TouchableOpacity
          style={[styles.checkButton, checking && styles.checkButtonDisabled]}
          onPress={checkForNewAchievements}
          disabled={checking}
        >
          <Text style={styles.checkButtonText}>
            {checking ? 'Checking...' : '✨ Check for New Achievements'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style