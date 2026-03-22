# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/(auth)/create-profile.tsx
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
/home/marshall/projects/brainy-builds/contexts/ProfileContext.tsx
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
/home/marshall/projects/brainy-builds/supabase/schema.sql
/home/marshall/projects/brainy-builds/tsconfig.json
/home/marshall/projects/brainy-builds/types/profile.ts

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
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@supabase/supabase-js": "^2.99.3",
    "expo": "~55.0.8",
    "expo-router": "~5.0.7",
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

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/(auth)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/login.tsx
/home/marshall/projects/brainy-builds/app/(auth)/register.tsx
/home/marshall/projects/brainy-builds/app.json
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
/home/marshall/projects/brainy-builds/App.tsx
/home/marshall/projects/brainy-builds/assets/android-icon-background.png
/home/marshall/projects/brainy-builds/assets/android-icon-foreground.png
/home/marshall/projects/brainy-builds/assets/android-icon-monochrome.png
/home/marshall/projects/brainy-builds/assets/favicon.png
/home/marshall/projects/brainy-builds/assets/icon.png
/home/marshall/projects/brainy-builds/assets/splash-icon.png
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/index.ts
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
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@supabase/supabase-js": "^2.99.3",
    "expo": "~55.0.8",
    "expo-router": "~5.0.7",
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
import { supabase } from '@/src/lib/supabase';

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

--- app/(auth)/register.tsx ---
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
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
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

=== SUMMARY ===
Files found: 3
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

**PROFILE CREATION SCREEN - STEP 1: BASIC INFO**

Building a simple profile creation screen with name input, school name input, and grade selector. This will be the post-signup flow before entering the main app.

---

## 🎯 WHAT'S BEING BUILT

**3 New Files:**
1. `src/types/profile.ts` - Profile type definitions
2. `app/(auth)/create-profile.tsx` - Profile creation screen
3. `supabase/migrations/001_create_profiles.sql` - Database schema

**Components on Screen:**
- Name text input
- School name text input  
- Grade selector (K through 12)
- Submit button

---

## 🗄️ DATABASE SCHEMA

```sql
profiles (
  id: uuid (references auth.users)
  display_name: text
  school_name: text
  grade_level: text (K, 1-12)
  created_at: timestamptz
  updated_at: timestamptz
)
```

---

## 📱 SCREEN LAYOUT

```
┌──────────────────────────┐
│  Create Your Profile     │
│                          │
│  [Name Input]            │
│  [School Name Input]     │
│                          │
│  Select Your Grade:      │
│  [K][1][2][3][4][5][6]  │
│  [7][8][9][10][11][12]  │
│                          │
│  [Continue Button]       │
└──────────────────────────┘
```

---

## 🔄 FLOW

1. User signs up via `register.tsx`
2. After successful signup, redirect to `create-profile.tsx`
3. User fills in name, school, and grade
4. Submit creates profile in database
5. Navigate to `/(main)` home screen

---

## ✅ FEATURES

- Text inputs with validation
- Grade buttons in a grid layout
- Selected grade highlights
- Loading state on submit
- Error handling with alerts
- Auto-navigation after success

---

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/src/types
mkdir -p /home/marshall/projects/brainy-builds/supabase/migrations

FILES:
/home/marshall/projects/brainy-builds/src/types/profile.ts
export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

export interface Profile {
  id: string;
  display_name: string;
  school_name: string;
  grade_level: GradeLevel;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  display_name: string;
  school_name: string;
  grade_level: GradeLevel;
}

/home/marshall/projects/brainy-builds/supabase/migrations/001_create_profiles.sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  school_name text not null,
  grade_level text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

/home/marshall/projects/brainy-builds/app/\(auth\)/create-profile.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import type { GradeLevel } from '@/src/types/profile';

const GRADES: GradeLevel[] = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function CreateProfileScreen() {
  const [displayName, setDisplayName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      Alert.alert('Missing Info', 'Please enter your name');
      return;
    }

    if (!schoolName.trim()) {
      Alert.alert('Missing Info', 'Please enter your school name');
      return;
    }

    if (!gradeLevel) {
      Alert.alert('Missing Info', 'Please select your grade');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      Alert.alert('Error', 'No authenticated user found');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        display_name: displayName.trim(),
        school_name: schoolName.trim(),
        grade_level: gradeLevel,
      });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.replace('/(main)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>School Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your school name"
          value={schoolName}
          onChangeText={setSchoolName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Your Grade</Text>
        <View style={styles.gradeGrid}>
          {GRADES.map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.gradeButton,
                gradeLevel === grade && styles.gradeButtonSelected,
              ]}
              onPress={() => setGradeLevel(grade)}
            >
              <Text
                style={