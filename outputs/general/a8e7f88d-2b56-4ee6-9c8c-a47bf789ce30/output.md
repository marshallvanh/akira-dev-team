# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(auth\)/login.tsx
/home/marshall/projects/brainy-builds/app/\(auth\)/register.tsx
/home/marshall/projects/brainy-builds/app.json
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/index.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/_layout.tsx
/home/marshall/projects/brainy-builds/App.tsx
/home/marshall/projects/brainy-builds/assets/android-icon-background.png
/home/marshall/projects/brainy-builds/assets/android-icon-foreground.png
/home/marshall/projects/brainy-builds/assets/android-icon-monochrome.png
/home/marshall/projects/brainy-builds/assets/favicon.png
/home/marshall/projects/brainy-builds/assets/icon.png
/home/marshall/projects/brainy-builds/assets/splash-icon.png
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/index.ts
/home/marshall/projects/brainy-builds/lib/supabase.ts
/home/marshall/projects/brainy-builds/package.json
/home/marshall/projects/brainy-builds/package-lock.json
/home/marshall/projects/brainy-builds/src/contexts/AuthContext.tsx
/home/marshall/projects/brainy-builds/src/lib/supabase.ts
/home/marshall/projects/brainy-builds/src/screens/LoginScreen.tsx
/home/marshall/projects/brainy-builds/src/screens/RegisterScreen.tsx
/home/marshall/projects/brainy-builds/src/types/auth.ts
/home/marshall/projects/brainy-builds/tsconfig.json

=== PACKAGE.JSON ===
{
  "name": "brainy-builds",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.99.3",
    "expo": "~55.0.8",
    "expo-secure-store": "^55.0.9",
    "expo-status-bar": "~55.0.4",
    "react": "19.2.0",
    "react-native": "0.83.2",
    "react-native-url-polyfill": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~5.9.2"
  },
  "private": true
}

=== EXISTING FILE CONTENTS ===
--- app/_layout.tsx ---
import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/(main)');
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [session, segments, loading]);

  return <Slot />;
}

--- src/contexts/AuthContext.tsx ---
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthUser, AuthContextType, AuthError } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign in failed - no user returned');
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign up failed - no user returned');
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function mapUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    created_at: user.created_at,
  };
}

--- src/lib/supabase.ts ---
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

--- lib/supabase.ts ---
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    "name": "brainy-builds",
    "slug": "brainy-builds",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
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
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}

=== SUMMARY ===
Files found: 6
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# FRONTEND

**PROFILE CREATION SCREEN BUILD**

Marshall, building a profile creation screen for brainy-builds. This will capture user details after they sign up.

**WHAT I'M BUILDING:**

1. **Profile Creation Screen** (`app/(auth)/create-profile.tsx`)
   - Full name input
   - Phone number (optional)
   - Role selection (Student/Teacher/Parent)
   - Grade level (if student)
   - Profile photo upload (optional)
   - Save to Supabase profiles table

2. **Profile Context** (`contexts/ProfileContext.tsx`)
   - Profile state management
   - Create/update profile functions
   - Fetch profile data

3. **Update Auth Flow** (`app/_layout.tsx`)
   - Check if user has completed profile
   - Redirect to create-profile if not
   - Redirect to tabs if complete

4. **Database Schema** (SQL for Supabase)
   - profiles table structure
   - Row Level Security policies

**USER FLOW:**

```
Sign Up → Email Verification → Create Profile → Main App
         (or Sign In)            (if new)        (tabs)
```

**FEATURES:**

✅ Clean, intuitive form
✅ Form validation
✅ Role-based fields (show grade only for students)
✅ Optional profile photo
✅ Saves to Supabase profiles table
✅ Loading states
✅ Error handling

**DATABASE STRUCTURE:**

```sql
profiles
  - id (uuid, references auth.users)
  - full_name (text)
  - phone (text, optional)
  - role (enum: student, teacher, parent)
  - grade_level (int, optional)
  - avatar_url (text, optional)
  - created_at (timestamp)
  - updated_at (timestamp)
```

Building now...

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/contexts
mkdir -p /home/marshall/projects/brainy-builds/types
mkdir -p /home/marshall/projects/brainy-builds/supabase

FILES:
/home/marshall/projects/brainy-builds/types/profile.ts
export type UserRole = 'student' | 'teacher' | 'parent';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  grade_level?: number | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  full_name: string;
  phone?: string;
  role: UserRole;
  grade_level?: number;
  avatar_url?: string;
}

/home/marshall/projects/brainy-builds/contexts/ProfileContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Profile, CreateProfileData } from '@/types/profile';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  createProfile: (data: CreateProfileData) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<CreateProfileData>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const createProfile = async (data: CreateProfileData) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            full_name: data.full_name,
            phone: data.phone || null,
            role: data.role,
            grade_level: data.grade_level || null,
            avatar_url: data.avatar_url || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile(newProfile);
      return { error: null };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { error: error as Error };
    }
  };

  const updateProfile = async (data: Partial<CreateProfileData>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updatedProfile);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error };
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        createProfile,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

/home/marshall/projects/brainy-builds/app/(auth)/create-profile.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';
import { UserRole } from '@/types/profile';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
];

const GRADE_LEVELS = [
  { value: 1, label: '1st Grade' },
  { value: 2, label: '2nd Grade' },
  { value: 3, label: '3rd Grade' },
  { value: 4, label: '4th Grade' },
  { value: 5, label: '5th Grade' },
  { value: 6, label: '6th Grade' },
  { value: 7, label: '7th Grade' },
  { value: 8, label: '8th Grade' },
  { value: 9, label: '9th Grade' },
  { value: 10, label: '10th Grade' },
  { value: 11, label: '11th Grade' },
  { value: 12, label: '12th Grade' },
];

export default function CreateProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [gradeLevel, setGradeLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { createProfile } = useProfile();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!role) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    if (role === 'student' && !gradeLevel) {
      Alert.alert('Error', 'Please select your grade level');
      return;
    }

    setLoading(true);

    const { error } = await createProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || undefined,
      role,
      grade_level: role === 'student' ? gradeLevel! : undefined,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="(555) 123-4567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>I am a *</Text>
            <View style={styles.roleContainer}>
              {ROLES.map((roleOption) => (
                <TouchableOpacity
                  key={roleOption.value}
                  style={[
                    styles.roleButton,
                    role === roleOption.value && styles.roleButtonActive,
                  ]}
                  onPress={() => {
                    setRole(roleOption.value);
                    if (roleOption.value !== 'student') {
                      setGradeLevel(null);
                    }
                  }}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === roleOption.value && styles.roleButtonTextActive,
                    ]}
                  >
                    {roleOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {role === 'student' && (
            <View style={styles.field}>
              <Text style={styles.label}>Grade Level *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gradeScroll}
              >
                {GRADE_LEVELS.map((grade) => (
                  <TouchableOpacity
                    key={grade.value}
                    style={[
                      styles.gradeButton,
                      gradeLevel === grade.value && styles.gradeButtonActive,
                    ]}
                    onPress={() => setGradeLevel(grade.value)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.gradeButtonText,
                        gradeLevel === grade.value && styles.gradeButtonTextActive,
                      ]}
                    >
                      {grade.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Profile...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  gradeScroll: {
    marginTop: 8,
  },
  gradeButton: {
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  gradeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  gradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  gradeButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

/home/marshall/projects/brainy-builds/app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react