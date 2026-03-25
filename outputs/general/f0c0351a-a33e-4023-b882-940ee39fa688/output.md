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
/home/marshall/projects/brainy-builds/app/(main)/parent-dashboard.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/parent-dashboard.tsx
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
/home/marshall/projects/brainy-builds/app/(main)/rewards.tsx
/home/marshall/projects/brainy-builds/app/(main)/stories/[id].tsx
/home/marshall/projects/brainy-builds/app/(main)/stories/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/story/[id].tsx
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
        name="parent-dashboard"
        options={{
          title: 'Parent Dashboard',
          headerShown: true,
          headerStyle: { backgroundColor: '#8B5CF6' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
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
        name="stories"
        options={{
          title: 'Story Library',
          headerShown: true,
          headerStyle: { backgroundColor: '#8B5CF6' },
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
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
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
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');

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

  const handlePinSubmit = () => {
    if (pinInput === '1234') {
      setPinModalVisible(false);
      setPinInput('');
      router.push('/(main)/parent-dashboard');
    } else {
      Alert.alert('Wrong PIN', 'Please try again');
      setPinInput('');
    }
  };

  const openParentView = () => {
    setPinModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{profile?.name || 'Builder'}!</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.avatar}>{profile?.avatarId || '🎓'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.parentButton} onPress={openParentView}>
          <Text style={styles.parentButtonIcon}>👨‍👩‍👧</Text>
          <Text style={styles.parentButtonText}>Parent View</Text>
        </TouchableOpacity>

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

      <Modal
        visible={pinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Parent PIN</Text>
            <Text style={styles.modalSubtitle}>4-digit code required</Text>
            
            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              placeholder="••••"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPinModalVisible(false);
                  setPinInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handlePinSubmit}
                disabled={pinInput.length !== 4}
              >
                <Text style={styles.submitButtonText}>Enter</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.pinHint}>Demo PIN: 1234</Text>
          </View>
        </View>
      </Modal>
    </>
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
  headerRight: {
    alignItems: 'center',
  },
  avatar: {
    fontSize: 48,
  },
  parentButton: {
    backgroundColor: '#8B5CF6',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  parentButtonIcon: {
    fontSize: 24,
  },
  parentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  pinInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinHint: {
    marginTop: 16,
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
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

# 🛑 STOPPING — PIVOTING TO OPTION B

Marshall, understood. **We're going backend-first with permanent progress saving.**

This is the right call. Here's why:
- Your son's progress won't disappear
- Multiple devices work seamlessly
- Parent dashboard has real data
- Points system is permanent
- Achievement tracking works

---

## 🏗️ BACKEND ARCHITECTURE — TECHNICAL ASSESSMENT

**What needs to happen:**

### Database Schema (Prisma)
- `UserProgress` table (tracks which stories completed, points earned)
- `ReadingSession` table (pages read, time spent, timestamp)
- `UserPoints` table (balance, history)
- Link to existing `User` auth

### API Endpoints (Backend)
- `GET /stories` — fetch all stories with user progress
- `GET /stories/:id` — fetch single story with user progress
- `POST /stories/:id/start` — begin reading session
- `PUT /stories/:id/progress` — save page progress
- `POST /stories/:id/complete` — mark story complete, award points
- `GET /user/progress` — all user's reading history

### Frontend Changes
- Stories Library: fetch from API instead of hardcode
- Reading Screen: save progress to backend on each page
- Auto-sync to server (not just local state)
- Offline fallback (read locally, sync when online)

---

## 🚨 CRITICAL DECISION POINT

**Database choice:** You have Supabase already set up for auth.

Two options:

### **OPTION B1: Use Supabase (Recommended)**
- Same database as auth
- No new infrastructure
- Real-time sync possible
- Simpler deployment
- Your existing setup

### **OPTION B2: Separate PostgreSQL + Prisma**
- More complex deployment
- Two databases to manage
- Better for scaling later
- More work now

**I recommend B1 (Supabase).** One database, one auth system, one deployment.

---

## BUILD ORDER FOR OPTION B

**Phase 1: Database Schema (Today)**
1. Add tables to Prisma for progress tracking
2. Seed schema
3. Test connections

**Phase 2: Backend APIs (Tomorrow)**
1. Create story endpoints
2. Create progress endpoints
3. Create points system
4. Test with Postman

**Phase 3: Frontend Integration (Day 3)**
1. Update Stories Library to fetch from API
2. Update Reading Screen to save progress
3. Sync progress on completion
4. Test end-to-end

**Phase 4: Offline + Sync (Day 4)**
1. Local AsyncStorage fallback
2. Auto-sync when online
3. Conflict resolution

---

## QUESTIONS BEFORE I BUILD

I need answers so I build the right thing:

**1. Database preference:** Supabase (B1) or separate PostgreSQL (B2)?

**2. Story content:** Should stories live in:
   - A) Database (can edit without code)
   - B) Code file (easier for now, migrate later)

**3. Progress granularity:** Track:
   - A) Just completion (story done = 1 record)
   - B) Page-by-page (every page save = record)
   - C) Detailed sessions (time, pages, reading speed)

**4. Points system:** Should points:
   - A) Award on story completion only
   - B) Award per page read
   - C) Award based on reading time

**5. Multi-user:** Will multiple kids use same account or separate accounts?

---

## WHAT I'M WAITING FOR

Tell me your answers to those 5 questions and I'll build the correct backend architecture.

**Don't guess** — tell me what matters for your son's experience.

Once you answer, I'll build:
- ✅ Correct database schema
- ✅ Correct API design
- ✅ Correct progress tracking
- ✅ No wasted effort on wrong approach

⏸️ **Waiting for your input**

---

# BACKEND

# 🛑 STOPPED — SWITCHING TO OPTION B

Marshall, **EXCELLENT CALL**. You're absolutely right — without backend persistence, your son loses all progress every time the app restarts. Let me build the proper backend foundation.

---

## 🏗️ BACKEND BUILD PLAN — OPTION B

### What I'm Building:

**1. Database Schema (Supabase)**
- `stories` table — story metadata
- `user_progress` table — reading completion tracking
- `user_points` table — points balance & history
- Row Level Security (RLS) policies

**2. Backend API Routes**
- `GET /api/stories` — fetch all stories with user progress
- `GET /api/stories/:id` — fetch single story with content
- `POST /api/stories/:id/complete` — mark story complete, award points
- `GET /api/user/points` — get current points balance
- `GET /api/user/progress` — get all reading progress

**3. Frontend Integration**
- Update Stories Library to fetch from API
- Update Reading Screen to save progress
- Add loading states
- Error handling

---

## 📊 Database Schema Design

```sql
-- Stories table (seed data)
CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  content JSONB NOT NULL, -- Array of page strings
  gradient JSONB NOT NULL, -- Array of color codes
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reading progress
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  current_page INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

-- User points tracking
CREATE TABLE user_points (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Points transaction history
CREATE TABLE points_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'spend')),
  source TEXT NOT NULL, -- 'story_completion', 'reward_purchase', etc.
  reference_id INTEGER, -- story_id or reward_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 Security (RLS Policies)

```sql
-- Users can only read their own progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only read their own points
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

-- Everyone can read stories (public data)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stories" ON stories
  FOR SELECT TO authenticated USING (true);
```

---

## 🎯 API Endpoints I'm Building

**Backend routes:**
- `GET /api/stories` — List all stories with user's progress merged in
- `GET /api/stories/:id` — Single story with content + progress
- `POST /api/stories/:id/complete` — Mark complete, award points, unlock next
- `GET /api/user/points` — Current balance
- `POST /api/user/points/spend` — Deduct points (for rewards later)

---

## ⚙️ Build Steps

**Phase 1: Database Setup (15 min)**
1. Create migration file with schema
2. Seed stories data
3. Set up RLS policies

**Phase 2: Backend API (30 min)**
1. Create story routes with progress logic
2. Create points routes
3. Add authentication middleware
4. Test endpoints

**Phase 3: Frontend Integration (30 min)**
1. Update Stories Library to fetch from API
2. Update Reading Screen to save progress
3. Add loading/error states
4. Test full flow

**Total:** ~75 minutes

---

## 📁 Files I'll Create

**Backend:**
- `backend/supabase/migrations/001_stories_schema.sql`
- `backend/supabase/seed.sql`
- `backend/src/routes/stories.ts` (updated)
- `backend/src/routes/progress.ts` (new)
- `backend/src/routes/points.ts` (new)
- `backend/src/middleware/auth.ts` (updated)

**Frontend:**
- `lib/storiesData.ts` (keep for TypeScript types)
- `app/(main)/stories/index.tsx` (update to use API)
- `app/(main)/story/[id].tsx` (update to save progress)
- `lib/api.ts` (update with new endpoints)

---

## ✅ What This Gives You

**Persistent Progress:**
- Son reads Story 1, completes it
- Progress saved to database
- App closes/restarts
- Progress still there — Story 2 unlocked
- Points balance preserved

**Multi-Device Support:**
- Same account works on phone/tablet
- Progress syncs across devices

**Analytics Ready:**
- Parent dashboard can show real data
- Track reading time, completion rates
- Points history

---

## 🚀 Ready to Build Backend First?

This is the right approach. Building foundation properly means:
- No lost progress
- Real data for parent dashboard
- Scalable for future features
- Professional architecture

**Say "build it" and I'll execute all three phases.**

Or ask questions if anything is unclear.

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/backend/supabase/migrations
mkdir -p /home/marshall/projects/brainy-builds/backend/src/routes
mkdir -p /home/marshall/projects/brainy-builds/backend/src/controllers
mkdir -p /home/marshall/projects/brainy-builds/backend/src/types

FILES:
/home/marshall/projects/brainy-builds/backend/supabase/migrations/001_stories_schema.sql
-- Stories and Progress Schema
-- This migration creates tables for story content and user reading progress

-- Stories table (seed data)
CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  content JSONB NOT NULL,
  gradient JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reading progress
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  current_page INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

-- User points tracking
CREATE TABLE IF NOT EXISTS user_points (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Points transaction history
CREATE TABLE IF NOT EXISTS points_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'spend')),
  source TEXT NOT NULL,
  reference_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_points
CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" ON user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON user_points
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for points_transactions
CREATE POLICY "Users can view own transactions" ON points_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON points_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for stories (public read for authenticated users)
CREATE POLICY "Authenticated users can read stories" ON stories
  FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_story_id ON user_progress(story_id);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_stories_order_index ON stories(order_index);

-- Function to automatically update user_progress.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

/home/marshall/projects/brainy-builds/backend/supabase/seed.sql
-- Seed stories data
-- Run this after migrations to populate the stories table

INSERT INTO stories (title, emoji, difficulty, points, description, content, gradient, order_index) VALUES
(
  'The Crystal Seed',
  '💎',
  'Easy',
  50,
  'Discover a magical seed that grows dreams and begins your school adventure.',
  '["Once upon a time, in a world where dreams could take shape, there lived a young builder named Alex.\n\nOne sunny morning, Alex discovered something extraordinary buried in the garden - a glowing crystal seed that sparkled with all the colors of the rainbow.", "\"This is no ordinary seed,\" whispered a friendly firefly named Spark. \"This is a Dream Seed! It can grow anything you imagine, but only if you believe.\"\n\nAlex closed their eyes and imagined the most wonderful school ever - a place where learning was magical, where every student could discover their special gifts, and where imagination had no limits.", "The crystal seed began to glow brighter and brighter. Suddenly, a tiny sprout emerged from the ground, shimmering with starlight.\n\n\"Your journey begins now,\" said Spark with a smile. \"This seed will grow into your magical school, one story at a time. But remember, you must help it grow by reading, learning, and never giving up!\"", "Alex picked up the sprouting seed carefully and planted it in the perfect spot. The adventure of building the most amazing school in all the land had just begun.\n\n🌟 The End 🌟"]'::jsonb,
  '["#A78BFA", "#C084FC"]'::jsonb,
  1
),
(
  'Starlight Classroom',
  '⭐',
  'Easy',
  50,
  'Build your first classroom among the clouds where students learn to fly.',
  '["The crystal seed had grown into a beautiful tree with branches reaching toward the sky. Alex knew it was time to build the first classroom.\n\n\"But where should we build it?\" Alex wondered aloud.", "\"In the clouds, of course!\" chirped Spark the firefly. \"The best ideas come when you reach for the stars.\"\n\nAlex looked up and saw fluffy white clouds floating by. With a leap of faith and a sprinkle of dream dust, they jumped!", "To Alex''s amazement, the clouds were soft and bouncy like giant pillows. Together with Spark, they built the most beautiful classroom anyone had ever seen.\n\nThe desks were made of moonbeams, the chairs floated gently, and the chalkboard showed stars and constellations.", "\"This classroom will teach students to reach for their dreams,\" Alex said proudly.\n\nAnd just like that, the Starlight Classroom was complete, waiting for its first students to arrive.\n\n🌟 The End 🌟"]'::jsonb,
  '["#60A5FA", "#818CF8"]'::jsonb,
  2
),
(
  'The Book Forest',
  '📚',
  'Medium',
  75,
  'Create a library where books grow on trees and stories come alive.',
  '["With the classroom floating among the stars, Alex realized every school needs a library - a place where stories live and grow.\n\nBut this would be no ordinary library.", "\"What if books grew on trees?\" Alex suggested to Spark.\n\n\"Brilliant!\" exclaimed Spark. \"Every tree can hold a different kind of story!\"\n\nThey planted magical seeds in the ground below the Starlight Classroom.", "Within moments, trees began to sprout! One tree grew adventure books, another grew mystery books, and a third grew books about science and discovery.\n\nThe leaves whispered stories to anyone who would listen.", "Students could pick a book like picking an apple, and when they finished reading, the book would grow back for the next reader.\n\n\"A library that never runs out of stories,\" Alex smiled. \"Perfect!\"\n\n🌟 The End 🌟"]'::jsonb,
  '["#34D399", "#10B981"]'::jsonb,
  3
),
(
  'Potion Laboratory',
  '⚗️',
  'Medium',
  75,
  'Design a science lab where potions bubble with colorful magic.',
  '["Every great school needs a place for experiments and discoveries. Alex decided to build a science laboratory unlike any other.\n\nThis lab would combine science with a touch of magic!", "Inside, there were bubbling cauldrons of every color. Purple potions that made things float, green ones that helped plants grow super fast, and golden ones that made everything sparkle.\n\n\"Science is like magic,\" explained Spark, \"but you can learn the rules!\"", "Alex created special tables where students could safely mix ingredients, observe reactions, and discover amazing things. There were microscopes that could see into other dimensions and telescopes that showed the future of stars.", "The most exciting part was the Rainbow Reaction Chamber - when you mixed kindness with curiosity, it created the most beautiful explosions of color!\n\n\"Learning science should be this fun everywhere,\" Alex declared.\n\n🌟 The End 🌟"]'::jsonb,
  '["#F472B6", "#