# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/school-builder

=== FILE STRUCTURE ===
/home/marshall/projects/school-builder/app/(auth)/create-profile.tsx
/home/marshall/projects/school-builder/app/(auth)/_layout.tsx
/home/marshall/projects/school-builder/app/(auth)/login.tsx
/home/marshall/projects/school-builder/app/(auth)/register.tsx
/home/marshall/projects/school-builder/app/index.tsx
/home/marshall/projects/school-builder/app.json
/home/marshall/projects/school-builder/app/_layout.tsx
/home/marshall/projects/school-builder/app/(main)/index.tsx
/home/marshall/projects/school-builder/app/(main)/_layout.tsx
/home/marshall/projects/school-builder/App.tsx
/home/marshall/projects/school-builder/assets/adaptive-icon.png
/home/marshall/projects/school-builder/assets/favicon.png
/home/marshall/projects/school-builder/assets/icon.png
/home/marshall/projects/school-builder/assets/splash-icon.png
/home/marshall/projects/school-builder/components/profile/AvatarPicker.tsx
/home/marshall/projects/school-builder/.env
/home/marshall/projects/school-builder/.expo/devices.json
/home/marshall/projects/school-builder/.expo/README.md
/home/marshall/projects/school-builder/.expo/settings.json
/home/marshall/projects/school-builder/.gitignore
/home/marshall/projects/school-builder/index.ts
/home/marshall/projects/school-builder/lib/services/profile.ts
/home/marshall/projects/school-builder/package.json
/home/marshall/projects/school-builder/package-lock.json
/home/marshall/projects/school-builder/src/contexts/AuthContext.tsx
/home/marshall/projects/school-builder/src/lib/supabase.ts
/home/marshall/projects/school-builder/supabase/migrations/20240101000000_create_profiles.sql
/home/marshall/projects/school-builder/tsconfig.json

=== PACKAGE.JSON ===
{
  "name": "school-builder",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.99.3",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-url-polyfill": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "typescript": "~5.9.2"
  },
  "private": true
}

=== EXISTING FILE CONTENTS ===
--- app/_layout.tsx ---
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

--- app/index.tsx ---
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

--- app/(auth)/_layout.tsx ---
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

--- app/(auth)/login.tsx ---
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007AFF', fontSize: 16 },
});

--- app/(auth)/register.tsx ---
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Success', 'Check your email for verification link');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Register'}</Text>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007AFF', fontSize: 16 },
});

--- app/(main)/_layout.tsx ---
import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

--- app/(main)/index.tsx ---
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, color: '#666', marginBottom: 40 },
  button: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, minWidth: 200, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

--- src/contexts/AuthContext.tsx ---
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

--- src/lib/supabase.ts ---
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

--- tsconfig.json ---
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}

--- app.json ---
{
  "expo": {
    "name": "school-builder",
    "slug": "school-builder",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "scheme": "schoolbuilder"
  }
}

=== SUMMARY ===
Files found: 11
Project path: /home/marshall/projects/school-builder
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# FRONTEND

**PROFILE CREATION SCREEN - BUILDING NOW**

Alright Marshall, let's build this profile creation screen with **placeholder avatars** since we need to source Lottie files later.

**What I'm Building:**

1. **ProfileCreationScreen** (`app/(auth)/create-profile.tsx`)
   - Name input field
   - 6 avatar options (using emoji placeholders for now)
   - Submit button
   - Supabase integration via profile service

2. **Updated Profile Service** (`lib/services/profile.ts`)
   - Create profile function
   - Get profile function
   - Error handling

3. **Navigation Flow**
   - After successful profile creation → redirect to (main)

**Tech Stack:**
- React Native components
- Expo Router navigation
- Supabase for storage
- TypeScript types

**Why Placeholders:**
- Unblocks development NOW
- Easy to swap for Lottie animations later
- No app crashes from missing assets

Let me generate the execution plan...

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/school-builder/app/\(auth\)
mkdir -p /home/marshall/projects/school-builder/lib/services

FILES:
/home/marshall/projects/school-builder/app/(auth)/create-profile.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { profileService } from '../../lib/services/profile';

const AVATARS = [
  { id: 'robot', emoji: '🤖', name: 'Robot' },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut' },
  { id: 'scientist', emoji: '👩‍🔬', name: 'Scientist' },
  { id: 'artist', emoji: '👨‍🎨', name: 'Artist' },
  { id: 'athlete', emoji: '⚽', name: 'Athlete' },
  { id: 'musician', emoji: '🎸', name: 'Musician' },
];

export default function CreateProfileScreen() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name');
      return;
    }

    if (!selectedAvatar) {
      Alert.alert('Avatar Required', 'Please select an avatar');
      return;
    }

    setLoading(true);
    try {
      await profileService.createProfile(name.trim(), selectedAvatar);
      router.replace('/(main)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>Let's get to know you!</Text>

      <View style={styles.section}>
        <Text style={styles.label}>What's your name?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={50}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Choose your avatar</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={[
                styles.avatarOption,
                selectedAvatar === avatar.id && styles.avatarSelected,
              ]}
              onPress={() => setSelectedAvatar(avatar.id)}
            >
              <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
              <Text style={styles.avatarName}>{avatar.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Profile'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  avatarSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FF',
  },
  avatarEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

/home/marshall/projects/school-builder/lib/services/profile.ts
import { supabase } from '../supabase';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_type: string;
  created_at: string;
}

class ProfileService {
  async createProfile(name: string, avatarType: string): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name,
        avatar_type: avatarType,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create profile');
    }

    return data;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  }

  async getCurrentUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return this.getProfile(user.id);
  }
}

export const profileService = new ProfileService();

/home/marshall/projects/school-builder/app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="sign-in" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="sign-up" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="create-profile" 
        options={{ 
          headerShown: true,
          title: 'Create Profile',
          headerBackVisible: false,
        }} 
      />
    </Stack>
  );
}

/home/marshall/projects/school-builder/lib/types/profile.ts
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_type: string;
  created_at: string;
}

export type AvatarType = 'robot' | 'astronaut' | 'scientist' | 'artist' | 'athlete' | 'musician';
---END PLAN---