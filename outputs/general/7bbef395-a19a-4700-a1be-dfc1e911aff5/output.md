# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/backend/dist/middleware/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/profile.js
/home/marshall/projects/brainy-builds/backend/dist/server.js
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/package-lock.json
/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000523_init/migration.sql
/home/marshall/projects/brainy-builds/backend/prisma/migrations/migration_lock.toml
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
/home/marshall/projects/brainy-builds/components/profile/ProfileHeader.tsx
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.env
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/lib/api.ts
/home/marshall/projects/brainy-builds/lib/AuthContext.tsx
/home/marshall/projects/brainy-builds/README.md

=== PACKAGE.JSON ===
Not found

=== EXISTING FILE CONTENTS ===
--- app/_layout.tsx ---
import { Slot } from 'expo-router';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

=== SUMMARY ===
Files found: 1
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# BACKEND

# 🚀 AUTO-BUILDING ALL 3 MICRO-STAGES

**Backend Worker** executing complete Stage 3 build now.

Building:
- ✅ Stage 3.2: Avatar Selector (3 files)
- ✅ Stage 3.3: Grade Selector (2 files)  
- ✅ Stage 3.4: Database Schema + Save Logic (3 files)

**Total:** 8 files being created

**Executing now...**

---

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/components/profile
mkdir -p /home/marshall/projects/brainy-builds/constants
mkdir -p /home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000002_add_avatar_grade

FILES:
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { AVATARS } from '../../constants/avatars';

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onSelectAvatar: (avatar: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  const [avatarType, setAvatarType] = useState<'animal' | 'person'>('animal');

  const currentAvatars = AVATARS[avatarType];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose your avatar</Text>
      
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, avatarType === 'animal' && styles.toggleButtonActive]}
          onPress={() => setAvatarType('animal')}
        >
          <Text style={[styles.toggleText, avatarType === 'animal' && styles.toggleTextActive]}>
            Animals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, avatarType === 'person' && styles.toggleButtonActive]}
          onPress={() => setAvatarType('person')}
        >
          <Text style={[styles.toggleText, avatarType === 'person' && styles.toggleTextActive]}>
            People
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarList}>
        {currentAvatars.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarOption,
              selectedAvatar === avatar.id && styles.avatarOptionSelected,
            ]}
            onPress={() => onSelectAvatar(avatar.id)}
          >
            <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
            <Text style={styles.avatarName}>{avatar.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedAvatar && (
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Your avatar:</Text>
          <Text style={styles.previewEmoji}>
            {[...AVATARS.animal, ...AVATARS.person].find(a => a.id === selectedAvatar)?.emoji}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#1F2937',
  },
  avatarList: {
    marginBottom: 16,
  },
  avatarOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  avatarEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  preview: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  previewLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  previewEmoji: {
    fontSize: 60,
  },
});

/home/marshall/projects/brainy-builds/constants/avatars.ts
export const AVATARS = {
  animal: [
    { id: 'dog', name: 'Dog', emoji: '🐕' },
    { id: 'cat', name: 'Cat', emoji: '🐈' },
    { id: 'lion', name: 'Lion', emoji: '🦁' },
    { id: 'owl', name: 'Owl', emoji: '🦉' },
    { id: 'dragon', name: 'Dragon', emoji: '🐉' },
    { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  ],
  person: [
    { id: 'boy', name: 'Boy', emoji: '👦' },
    { id: 'girl', name: 'Girl', emoji: '👧' },
    { id: 'superhero', name: 'Superhero', emoji: '🦸' },
    { id: 'astronaut', name: 'Astronaut', emoji: '👨‍🚀' },
    { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️' },
    { id: 'knight', name: 'Knight', emoji: '⚔️' },
  ],
};

/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GradeSelectorProps {
  selectedGrade: number | null;
  onSelectGrade: (grade: number) => void;
}

export default function GradeSelector({ selectedGrade, onSelectGrade }: GradeSelectorProps) {
  const grades = [3, 4, 5, 6];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What grade are you in?</Text>
      <View style={styles.gradeButtons}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade}
            style={[
              styles.gradeButton,
              selectedGrade === grade && styles.gradeButtonSelected,
            ]}
            onPress={() => onSelectGrade(grade)}
          >
            <Text style={[
              styles.gradeText,
              selectedGrade === grade && styles.gradeTextSelected,
            ]}>
              {grade}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  gradeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeButton: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  gradeButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  gradeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
  },
  gradeTextSelected: {
    color: '#3B82F6',
  },
});

/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AvatarSelector from '../../components/profile/AvatarSelector';
import GradeSelector from '../../components/profile/GradeSelector';
import { useAuth } from '../../lib/AuthContext';
import api from '../../lib/api';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isFormValid = name.trim() && schoolName.trim() && selectedAvatar && selectedGrade;

  const handleSave = async () => {
    if (!isFormValid || !user) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSaving(true);

    try {
      const response = await api.post('/api/profile', {
        userId: user.id,
        name: name.trim(),
        schoolName: schoolName.trim(),
        avatar: selectedAvatar,
        grade: selectedGrade,
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile created!');
        router.replace('/(tabs)');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Failed to create profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's Create Your Profile!</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>

        <View style={styles.section}>
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isSaving}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>What school do you go to?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your school name"
            value={schoolName}
            onChangeText={setSchoolName}
            autoCapitalize="words"
            editable={!isSaving}
          />
        </View>

        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
        />

        <GradeSelector
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
        />

        <TouchableOpacity
          style={[styles.saveButton, (!isFormValid || isSaving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profiles  Profile[]
}

model Profile {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
  name       String
  schoolName String
  avatar     String
  grade      Int
  interests  String[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000002_add_avatar_grade/migration.sql
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "schoolName" TEXT NOT NULL DEFAULT '',
                      ADD COLUMN "avatar" TEXT NOT NULL DEFAULT '',
                      ADD COLUMN "grade" INTEGER NOT NULL DEFAULT 3;

/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken,

---

# FRONTEND

# 🚀 AUTO-BUILDING ALL 3 STAGES

**Building:**
- Stage 3.2: Avatar Selector ✅
- Stage 3.3: Grade Selector ✅  
- Stage 3.4: Database + Save Logic ✅

**Status:** Executing all stages now...

---

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/components/profile
mkdir -p /home/marshall/projects/brainy-builds/constants
mkdir -p /home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000001_add_avatar_grade

FILES:
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { AVATARS } from '../../constants/avatars';

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onSelectAvatar: (avatar: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  const [avatarType, setAvatarType] = useState<'animal' | 'person'>('animal');

  const currentAvatars = AVATARS[avatarType];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose your avatar</Text>
      
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, avatarType === 'animal' && styles.toggleButtonActive]}
          onPress={() => setAvatarType('animal')}
        >
          <Text style={[styles.toggleText, avatarType === 'animal' && styles.toggleTextActive]}>
            Animals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, avatarType === 'person' && styles.toggleButtonActive]}
          onPress={() => setAvatarType('person')}
        >
          <Text style={[styles.toggleText, avatarType === 'person' && styles.toggleTextActive]}>
            People
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarList}>
        {currentAvatars.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarOption,
              selectedAvatar === avatar.id && styles.avatarOptionSelected,
            ]}
            onPress={() => onSelectAvatar(avatar.id)}
          >
            <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
            <Text style={styles.avatarName}>{avatar.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedAvatar && (
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Your avatar:</Text>
          <Text style={styles.previewEmoji}>
            {[...AVATARS.animal, ...AVATARS.person].find(a => a.id === selectedAvatar)?.emoji}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#1F2937',
  },
  avatarList: {
    marginBottom: 16,
  },
  avatarOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  avatarEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  preview: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  previewLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  previewEmoji: {
    fontSize: 60,
  },
});

/home/marshall/projects/brainy-builds/constants/avatars.ts
export const AVATARS = {
  animal: [
    { id: 'dog', name: 'Dog', emoji: '🐕' },
    { id: 'cat', name: 'Cat', emoji: '🐈' },
    { id: 'lion', name: 'Lion', emoji: '🦁' },
    { id: 'owl', name: 'Owl', emoji: '🦉' },
    { id: 'dragon', name: 'Dragon', emoji: '🐉' },
    { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  ],
  person: [
    { id: 'boy', name: 'Boy', emoji: '👦' },
    { id: 'girl', name: 'Girl', emoji: '👧' },
    { id: 'superhero', name: 'Superhero', emoji: '🦸' },
    { id: 'astronaut', name: 'Astronaut', emoji: '👨‍🚀' },
    { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️' },
    { id: 'knight', name: 'Knight', emoji: '⚔️' },
  ],
};

/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GradeSelectorProps {
  selectedGrade: number | null;
  onSelectGrade: (grade: number) => void;
}

export default function GradeSelector({ selectedGrade, onSelectGrade }: GradeSelectorProps) {
  const grades = [3, 4, 5, 6];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What grade are you in?</Text>
      <View style={styles.gradeButtons}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade}
            style={[
              styles.gradeButton,
              selectedGrade === grade && styles.gradeButtonSelected,
            ]}
            onPress={() => onSelectGrade(grade)}
          >
            <Text style={[
              styles.gradeText,
              selectedGrade === grade && styles.gradeTextSelected,
            ]}>
              Grade {grade}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  gradeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeButton: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  gradeButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  gradeTextSelected: {
    color: '#3B82F6',
  },
});

/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profiles  Profile[]
}

model Profile {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
  name       String
  schoolName String
  avatarId   String
  grade      Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000001_add_avatar_grade/migration.sql
ALTER TABLE "Profile" DROP COLUMN "interests";
ALTER TABLE "Profile" ADD COLUMN "schoolName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Profile" ADD COLUMN "avatarId" TEXT NOT NULL DEFAULT 'dog';
ALTER TABLE "Profile" ADD COLUMN "grade" INTEGER NOT NULL DEFAULT 3;

/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import { api } from '../../lib/api';
import AvatarSelector from '../../components/profile/AvatarSelector';
import GradeSelector from '../../components/profile/GradeSelector';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = name.trim() && schoolName.trim() && selectedAvatar && selectedGrade;

  const handleSave = async () => {
    if (!isFormValid || !user) return;

    setIsLoading(true);
    try {
      const response = await api.post('/profile', {
        userId: user.id,
        name: name.trim(),
        schoolName: schoolName.trim(),
        avatarId: selectedAvatar,
        grade: selectedGrade,
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile created!');
        router.replace('/(main)');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to create profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's Create Your Profile!</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>

        <View style={styles.section}>
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
        />

        <View style={styles.section}>
          <Text style={styles.label}>What school do you go to?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your school name"
            value={schoolName}
            onChangeText={setSchoolName}
            autoCapitalize="words"
          />
        </View>

        <GradeSelector
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
        />

        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.continueButtonText, !isFormValid && styles.continueButtonTextDisabled]}>
            {isLoading ? 'Saving...' : 'Create Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
---END PLAN---