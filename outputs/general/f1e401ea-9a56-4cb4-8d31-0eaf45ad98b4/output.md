# TETSUO

**TECHNICAL ASSESSMENT - APPROVED**

Alright. Based on memory:
- Expo SDK 54 + Expo Router
- Supabase configured and working
- Auth is complete
- Target: Kids Grade 3-6
- Next: Profile creation with avatar selection using Lottie

**RECOMMENDED APPROACH**

1. **Profile data model** - name, grade, avatar choice
2. **Lottie avatar library** - 6-8 kid-friendly animated avatars
3. **Simple form pattern** - name input, grade picker, avatar selector
4. **Supabase profiles table** - user_id FK, display_name, grade, avatar_id
5. **Navigation flow** - after auth → profile creation → main app

**BUILD SEQUENCE**

1. **Architect** defines profile schema and screen structure
2. **Database** creates Supabase migration for profiles table
3. **Frontend** builds the profile creation screen with avatar selection
4. **Integration** hooks it into auth flow

**RED FLAGS**

- Need to confirm Lottie assets - do we have them or sourcing them?
- Grade selection UX for kids needs to be visual, not dropdown
- Avatar selection should feel fun, not like a form

**HANDOFF**

Passing to **Akira** to coordinate the build sequence.

This is a straightforward feature but execution matters for kid UX.

Let's build it right.

---

💰 *Cost: $12.7356 (106 calls this session)*

---

# BACKEND

Alright, trusting the memory. Here's what I'm building:

**PROFILE CREATION SCREEN FOR SCHOOL-BUILDER**

Based on memory:
- Expo SDK 54 + Expo Router
- Supabase backend configured
- Auth complete
- Target: Kids Grade 3-6
- Feature: Avatar selection with Lottie animations

**What I'm building:**

1. **Database schema** - `profiles` table in Supabase
2. **Profile creation screen** - Simple form with name + avatar selection
3. **Avatar components** - Lottie-based avatar picker
4. **Supabase client functions** - Create/update profile logic
5. **Navigation flow** - Redirect after profile creation

**Tech decisions:**
- Store profile data in `public.profiles` table
- Link profiles to auth.users via user_id
- Use expo-lottie for avatar animations
- Keep it simple for kids - minimal fields, fun UI

Let me build this out properly with full implementation:

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/school-builder/supabase/migrations
mkdir -p /home/marshall/projects/school-builder/app/(auth)
mkdir -p /home/marshall/projects/school-builder/components/profile
mkdir -p /home/marshall/projects/school-builder/lib/services
mkdir -p /home/marshall/projects/school-builder/assets/avatars

FILES:
/home/marshall/projects/school-builder/supabase/migrations/20240101000000_create_profiles.sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  grade INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can create own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

/home/marshall/projects/school-builder/lib/services/profile.ts
import { supabase } from '../supabase';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_id: string;
  grade: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  display_name: string;
  avatar_id: string;
  grade?: number;
}

export class ProfileService {
  /**
   * Create a new profile for the current user
   */
  static async createProfile(data: CreateProfileData): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return { profile: null, error: new Error('User not authenticated') };
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name: data.display_name.trim(),
          avatar_id: data.avatar_id,
          grade: data.grade || null
        })
        .select()
        .single();

      if (error) {
        return { profile: null, error: new Error(error.message) };
      }

      return { profile, error: null };
    } catch (err) {
      return { profile: null, error: err instanceof Error ? err : new Error('Unknown error') };
    }
  }

  /**
   * Get profile for the current user
   */
  static async getProfile(): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return { profile: null, error: new Error('User not authenticated') };
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Profile doesn't exist yet - this is okay
        if (error.code === 'PGRST116') {
          return { profile: null, error: null };
        }
        return { profile: null, error: new Error(error.message) };
      }

      return { profile, error: null };
    } catch (err) {
      return { profile: null, error: err instanceof Error ? err : new Error('Unknown error') };
    }
  }

  /**
   * Update existing profile
   */
  static async updateProfile(data: Partial<CreateProfileData>): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return { profile: null, error: new Error('User not authenticated') };
      }

      const updateData: Record<string, any> = {};
      if (data.display_name) updateData.display_name = data.display_name.trim();
      if (data.avatar_id) updateData.avatar_id = data.avatar_id;
      if (data.grade !== undefined) updateData.grade = data.grade;

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { profile: null, error: new Error(error.message) };
      }

      return { profile, error: null };
    } catch (err) {
      return { profile: null, error: err instanceof Error ? err : new Error('Unknown error') };
    }
  }
}

/home/marshall/projects/school-builder/components/profile/AvatarPicker.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = (width - 80) / 3; // 3 columns with padding

export interface Avatar {
  id: string;
  name: string;
  source: any; // Lottie JSON file
}

// Avatar data - these would be actual Lottie files in production
export const AVATARS: Avatar[] = [
  { id: 'robot', name: 'Robot', source: require('../../assets/avatars/robot.json') },
  { id: 'astronaut', name: 'Astronaut', source: require('../../assets/avatars/astronaut.json') },
  { id: 'scientist', name: 'Scientist', source: require('../../assets/avatars/scientist.json') },
  { id: 'artist', name: 'Artist', source: require('../../assets/avatars/artist.json') },
  { id: 'athlete', name: 'Athlete', source: require('../../assets/avatars/athlete.json') },
  { id: 'musician', name: 'Musician', source: require('../../assets/avatars/musician.json') },
];

interface AvatarPickerProps {
  selectedAvatarId: string | null;
  onSelectAvatar: (avatarId: string) => void;
}

export default function AvatarPicker({ selectedAvatarId, onSelectAvatar }: AvatarPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Avatar</Text>
      <ScrollView 
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {AVATARS.map((avatar) => (
          <AvatarItem
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatarId === avatar.id}
            onSelect={() => onSelectAvatar(avatar.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface AvatarItemProps {
  avatar: Avatar;
  isSelected: boolean;
  onSelect: () => void;
}

function AvatarItem({ avatar, isSelected, onSelect }: AvatarItemProps) {
  return (
    <Pressable
      style={[styles.avatarContainer, isSelected && styles.avatarSelected]}
      onPress={onSelect}
    >
      <View style={styles.avatarWrapper}>
        <LottieView
          source={avatar.source}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <Text style={[styles.avatarName, isSelected && styles.avatarNameSelected]}>
        {avatar.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    marginBottom: 20,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: AVATAR_SIZE - 10,
    height: AVATAR_SIZE - 10,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    borderWidth: 3,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSelected: {
    transform: [{ scale: 1.05 }],
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  avatarName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  avatarNameSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

/home/marshall/projects/school-builder/app/(auth)/create-profile.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import AvatarPicker from '../../components/profile/AvatarPicker';
import { ProfileService } from '../../lib/services/profile';

export default function CreateProfileScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async () => {
    // Validation
    if (!displayName.trim()) {
      Alert.alert('Missing Name', 'Please enter your name');
      return;
    }

    if (displayName.trim().length < 2) {
      Alert.alert('Name Too Short', 'Please enter at least 2 characters');
      return;
    }

    if (!selectedAvatar) {
      Alert.alert('Choose Avatar', 'Please select an avatar');
      return;
    }

    setIsLoading(true);

    try {
      const { profile, error } = await ProfileService.createProfile({
        display_name: displayName,
        avatar_id: selectedAvatar,
      });

      if (error) {
        Alert.alert('Error', error.message);
        setIsLoading(false);
        return;
      }

      if (!profile) {
        Alert.alert('Error', 'Failed to create profile');
        setIsLoading(false);
        return;
      }

      // Success - navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Profile creation error:', err);
      setIsLoading(false);
    }
  };

  const isValid = displayName.trim().length >= 2 && selectedAvatar !== null;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Your Profile</Text>
          <Text style={styles.headerSubtitle}>Let's get you set up!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
          />
          <Text style={styles.hint}>{displayName.length}/30 characters</Text>
        </View>

        <View style={styles.section}>
          <AvatarPicker
            selectedAvatarId={selectedAvatar}
            onSelectAvatar={setSelectedAvatar}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, (!isValid || isLoading) && styles.buttonDisabled]}
            onPress={handleCreateProfile}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Profile</Text>
            )}
          </Pressable>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: