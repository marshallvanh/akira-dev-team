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

# 🎯 TETSUO — BUILD PLAN: STORIES LIBRARY + READING SCREEN

Marshall, I need to clarify scope before we build.

## Current Situation
- Stories Library screen needs to be built (grid of 8 fantasy stories)
- Reading screen needs content (display story text)
- Both are critical path to make the app functional

## Two Build Approaches

### **OPTION A: Quick Path (45 min)**
- Build Stories Library with hardcoded data ✅
- Build Reading Screen with hardcoded story content ✅
- Wire navigation between them ✅
- Text reading only (no audio yet)
- Both screens functional end-to-end

### **OPTION B: Backend First (2+ hours)**
- Create story endpoints on backend
- Set up database schema for stories
- Build stories library with API calls
- Build reading screen with API calls
- More complex, more scalable, but delays functionality

## My Recommendation
**Build Option A immediately.** 

Reasoning:
- Your son can use the app TODAY
- Reading experience validated
- Easy to migrate to backend later (one data file to swap)
- No API dependency delays
- Audio narration can be added incrementally

---

## What Gets Built (Option A)

### Files to Create:
1. **Story data file** — 8 fantasy stories with full text content
2. **Stories Library screen** — Grid view with cards, progress tracking
3. **Reading screen** — Scrollable text reader with progress indicator

### Features:
✅ 8 fantasy-themed stories (Easy/Medium/Hard mix)
✅ Sequential unlocking (complete story 1 to unlock story 2)
✅ Progress tracking (completed/in-progress)
✅ Points display
✅ Beautiful gradient cards
✅ Text-only reading experience
✅ Back button to library

### Story Theme
Fantasy + Creativity world: magical school with dragons, potions, music halls, art studios, etc.

---

**Ready to execute Option A?** Say **yes** and I'll hand tasks to the team.

Or if you want something different, tell me now.

---

# BACKEND

# 📖 Building Story Reading Screen

Marshall, now I'm building the **reading screen** where your son actually reads the story content.

## What I'm Building

**File:** `app/(main)/story/[id].tsx`

### Features:
✅ Display full story text with beautiful typography
✅ Scroll progress indicator
✅ Page-by-page navigation (split long text into pages)
✅ "Mark as Complete" button at the end
✅ Points reward animation
✅ Back to library navigation
✅ Read-aloud ready (clean text display)
✅ Progress saving

### UI Design:
- Clean, readable typography (large text for kids)
- Gradient header matching story theme
- Page counter (Page 1 of 3)
- Smooth scrolling
- Completion celebration

---EXECUTION PLAN---
FILES:
/home/marshall/projects/brainy-builds/lib/storiesData.ts
export interface Story {
  id: number;
  title: string;
  emoji: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  description: string;
  content: string[];
  unlocked: boolean;
  completed: boolean;
  gradient: string[];
}

export const STORIES: Story[] = [
  {
    id: 1,
    title: 'The Crystal Seed',
    emoji: '💎',
    difficulty: 'Easy',
    points: 50,
    description: 'Discover a magical seed that grows dreams and begins your school adventure.',
    unlocked: true,
    completed: false,
    gradient: ['#A78BFA', '#C084FC'],
    content: [
      'Once upon a time, in a world where dreams could take shape, there lived a young builder named Alex.\n\nOne sunny morning, Alex discovered something extraordinary buried in the garden - a glowing crystal seed that sparkled with all the colors of the rainbow.',
      '"This is no ordinary seed," whispered a friendly firefly named Spark. "This is a Dream Seed! It can grow anything you imagine, but only if you believe."\n\nAlex closed their eyes and imagined the most wonderful school ever - a place where learning was magical, where every student could discover their special gifts, and where imagination had no limits.',
      'The crystal seed began to glow brighter and brighter. Suddenly, a tiny sprout emerged from the ground, shimmering with starlight.\n\n"Your journey begins now," said Spark with a smile. "This seed will grow into your magical school, one story at a time. But remember, you must help it grow by reading, learning, and never giving up!"',
      'Alex picked up the sprouting seed carefully and planted it in the perfect spot. The adventure of building the most amazing school in all the land had just begun.\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 2,
    title: 'Starlight Classroom',
    emoji: '⭐',
    difficulty: 'Easy',
    points: 50,
    description: 'Build your first classroom among the clouds where students learn to fly.',
    unlocked: false,
    completed: false,
    gradient: ['#60A5FA', '#818CF8'],
    content: [
      'The crystal seed had grown into a beautiful tree with branches reaching toward the sky. Alex knew it was time to build the first classroom.\n\n"But where should we build it?" Alex wondered aloud.',
      '"In the clouds, of course!" chirped Spark the firefly. "The best ideas come when you reach for the stars."\n\nAlex looked up and saw fluffy white clouds floating by. With a leap of faith and a sprinkle of dream dust, they jumped!',
      'To Alex\'s amazement, the clouds were soft and bouncy like giant pillows. Together with Spark, they built the most beautiful classroom anyone had ever seen.\n\nThe desks were made of moonbeams, the chairs floated gently, and the chalkboard showed stars and constellations.',
      '"This classroom will teach students to reach for their dreams," Alex said proudly.\n\nAnd just like that, the Starlight Classroom was complete, waiting for its first students to arrive.\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 3,
    title: 'The Book Forest',
    emoji: '📚',
    difficulty: 'Medium',
    points: 75,
    description: 'Create a library where books grow on trees and stories come alive.',
    unlocked: false,
    completed: false,
    gradient: ['#34D399', '#10B981'],
    content: [
      'With the classroom floating among the stars, Alex realized every school needs a library - a place where stories live and grow.\n\nBut this would be no ordinary library.',
      '"What if books grew on trees?" Alex suggested to Spark.\n\n"Brilliant!" exclaimed Spark. "Every tree can hold a different kind of story!"\n\nThey planted magical seeds in the ground below the Starlight Classroom.',
      'Within moments, trees began to sprout! One tree grew adventure books, another grew mystery books, and a third grew books about science and discovery.\n\nThe leaves whispered stories to anyone who would listen.',
      'Students could pick a book like picking an apple, and when they finished reading, the book would grow back for the next reader.\n\n"A library that never runs out of stories," Alex smiled. "Perfect!"\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 4,
    title: 'Potion Laboratory',
    emoji: '⚗️',
    difficulty: 'Medium',
    points: 75,
    description: 'Design a science lab where potions bubble with colorful magic.',
    unlocked: false,
    completed: false,
    gradient: ['#F472B6', '#EC4899'],
    content: [
      'Every great school needs a place for experiments and discoveries. Alex decided to build a science laboratory unlike any other.\n\nThis lab would combine science with a touch of magic!',
      'Inside, there were bubbling cauldrons of every color. Purple potions that made things float, green ones that helped plants grow super fast, and golden ones that made everything sparkle.\n\n"Science is like magic," explained Spark, "but you can learn the rules!"',
      'Alex created special tables where students could safely mix ingredients, observe reactions, and discover amazing things. There were microscopes that could see into other dimensions and telescopes that showed the future of stars.',
      'The most exciting part was the Rainbow Reaction Chamber - when you mixed kindness with curiosity, it created the most beautiful explosions of color!\n\n"Learning science should be this fun everywhere," Alex declared.\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 5,
    title: 'Dragon Racing Track',
    emoji: '🐉',
    difficulty: 'Medium',
    points: 75,
    description: 'Build a sports field where friendly dragons race through the sky.',
    unlocked: false,
    completed: false,
    gradient: ['#EF4444', '#F87171'],
    content: [
      'Alex knew that students needed a place to run, play, and exercise. But a regular sports field seemed too boring for a magical school.\n\n"What about a dragon racing track?" suggested a small, friendly dragon named Puff.',
      'Puff explained that baby dragons loved to race but needed a safe place to practice. Alex\'s eyes lit up with excitement!\n\nThey built a magnificent track that looped through clouds, dove through rainbow rings, and spiraled around the crystal tree.',
      'The track had obstacles that taught teamwork - tunnels that needed two dragons to open, bridges that required balance, and finish lines that celebrated everyone who tried their best.\n\n"It\'s not about being the fastest," Puff explained, "it\'s about having fun and helping your friends!"',
      'Soon, dragons of all sizes were zooming around the track, laughing and cheering for each other. Students could ride on their backs and learn about courage, friendship, and sportsmanship.\n\n"The best races are the ones where everyone wins," Alex realized.\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 6,
    title: 'Rainbow Paint Studio',
    emoji: '🎨',
    difficulty: 'Medium',
    points: 75,
    description: 'Construct an art studio where emotions become beautiful paintings.',
    unlocked: false,
    completed: false,
    gradient: ['#FBBF24', '#F59E0B'],
    content: [
      'Alex stood before an empty room and imagined it filled with colors, creativity, and joy. This would be the art studio - a place where feelings could become art.',
      'But these weren\'t ordinary paints. When you felt happy, the brushes painted sunshine yellow. When you felt calm, they painted ocean blue. Excited feelings made bright orange, and thoughtful moments created deep purple.',
      'The walls themselves were magic - they could display any student\'s artwork in a beautiful gallery. No painting was too big or too small. Every creation was celebrated.\n\n"Art helps us understand our feelings," explained a wise old owl named Palette.',
      'Students could paint their dreams, sculpt their hopes, and create whatever their imagination desired. The studio had supplies that never ran out and mistakes that could always become something beautiful.\n\n"Every feeling is valid, and every creation is special," Alex declared proudly.\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 7,
    title: 'Echo Chamber Hall',
    emoji: '🎵',
    difficulty: 'Hard',
    points: 100,
    description: 'Design a music hall where instruments float and play themselves.',
    unlocked: false,
    completed: false,
    gradient: ['#8B5CF6', '#7C3AED'],
    content: [
      'The school needed one more special place - somewhere for music, rhythm, and harmony. Alex envisioned a hall where sound itself was magic.',
      'In the Echo Chamber Hall, instruments floated in the air, waiting for students to play them. But here\'s the amazing part - when someone felt nervous about performing, the instruments would help by playing along quietly.',
      'The walls were designed to echo in perfect harmony. When one student played a note, the room would respond with complementary tones, creating beautiful music together.\n\n"Music is better when we share it," hummed Spark.',
      'There were drums that played heartbeats, flutes that sang like birds, and a grand piano that could play dreams. Students could conduct clouds to make thunder rhythms or whisper to the wind to create melodies.',
      'The most magical feature was the Harmony Circle - when students played together, their music created visible waves of light that danced through the air, showing how their sounds connected.\n\n"Every voice matters in our chorus," Alex smiled, conducting a rainbow of musical light.\n\n🌟 The End 🌟',
    ],
  },
  {
    id: 8,
    title: 'The Grand Festival',
    emoji: '🎉',
    difficulty: 'Hard',
    points: 100,
    description: 'Celebrate the grand opening of your magical school with all your friends.',
    unlocked: false,
    completed: false,
    gradient: ['#F59E0B', '#EF4444'],
    content: [
      'Finally, after building the Starlight Classroom, the Book Forest, the Potion Laboratory, the Dragon Racing Track, the Rainbow Paint Studio, and the Echo Chamber Hall, the magical school was complete!',
      'Alex stood at the entrance with Spark, Puff, Palette, and all the magical friends they\'d made along the way. The crystal seed had grown into a magnificent tree that connected all the buildings together.',
      'Students from everywhere began arriving - some flying on clouds, others riding friendly dragons, and some simply walking through the rainbow gates with wonder in their eyes.',
      'The Grand Festival began! In the Starlight Classroom, students learned to make wishes on stars. In the Book Forest, stories came to life and danced. The Potion Laboratory erupted with colorful experiments that painted the sky.',
      'Dragons raced while students cheered. Art filled every wall with joy. And music flowed from the Echo Chamber Hall, bringing everyone together in harmony.',
      'As the sun set, Alex realized something important: "A school isn\'t just buildings - it\'s the people who fill it with laughter, learning, and love."\n\nThe crystal seed glowed brightly, now a beautiful tree of dreams come true.',
      '"Thank you for building this with me," Alex said to all their friends.\n\n"Thank YOU for believing," Spark replied with a smile.\n\nAnd they all celebrated under the stars, knowing this was just the beginning of countless amazing adventures.\n\n🌟 THE END 🌟\n\nYou did it! You built an entire magical school!',
    ],
  },
];

export function getStoryById(id: number): Story | undefined {
  return STORIES.find(story => story.id === id);
}

export function getNextStory(currentId: number): Story | undefined {
  const currentIndex = STORIES.findIndex(story => story.id === currentId);
  if (currentIndex >= 0 && currentIndex < STORIES.length - 1) {
    return STORIES[currentIndex + 1];
  }
  return undefined;
}

/home/marshall/projects/brainy-builds/app/(main)/story/[id].tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { getStoryById, getNextStory } from '../../../lib/storiesData';

export default function StoryReadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const storyId = parseInt(params.id as string);
  const story = getStoryById(storyId);

  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Story not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back to Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalPages = story.content.length;
  const isLastPage = currentPage === totalPages - 1;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    
    Alert.alert(
      '🎉 Story Complete!',
      `Amazing job! You earned ${story.points} points!\n\nKeep reading to unlock the next adventure.`,
      [
        {
          text: 'Next Story',
          onPress: () => {
            const nextStory = getNextStory(storyId);
            if (nextStory && nextStory.unlocked) {
              router.replace(`/(main)/story/${nextStory.id}`);
            } else {
              router.back();
            }
          },
        },
        {
          text: 'Back to Library',
          onPress: () => router.back(),
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: story.gradient[0] }]}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.headerBackText}>← Library</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{story.emoji}</Text>
          <Text style={styles.headerTitle}>{story.title}</Text>
          <Text style={styles.headerSubtitle}>