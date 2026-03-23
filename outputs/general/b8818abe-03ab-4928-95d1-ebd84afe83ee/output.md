# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
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

# TETSUO

# 🎯 STAGE 3: PROFILE CREATION FLOW - COMPLETE EXECUTION

Let me execute all the commands to finish Stage 3.

---

## 🔧 BACKEND UPDATES

### Step 1: Update Database Schema
```bash
cd /home/marshall/projects/brainy-builds/backend && cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profile   Profile?
}

model Profile {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  childName String
  childAge  Int
  interests String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF
```

### Step 2: Create Profile Routes
```bash
cat > src/routes/profile.ts << 'EOF'
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { childName, childAge, interests } = req.body;

    if (!childName || !childAge) {
      return res.status(400).json({ error: 'Child name and age are required' });
    }

    if (childAge < 5 || childAge > 18) {
      return res.status(400).json({ error: 'Age must be between 5 and 18' });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.id },
      update: {
        childName,
        childAge: parseInt(childAge),
        interests: interests || [],
      },
      create: {
        userId: req.user!.id,
        childName,
        childAge: parseInt(childAge),
        interests: interests || [],
      },
    });

    res.json({ profile });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;
EOF
```

### Step 3: Update Main Server File
```bash
cat > src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF
```

### Step 4: Run Database Migration
```bash
docker-compose exec api npx prisma migrate dev --name add-profile
```

### Step 5: Restart Backend
```bash
docker-compose restart api && sleep 3 && docker-compose logs api --tail=20
```

---

## 📱 FRONTEND UPDATES

### Step 6: Create Profile Context
```bash
cd /home/marshall/projects/brainy-builds && cat > lib/ProfileContext.tsx << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';

interface Profile {
  id: string;
  childName: string;
  childAge: number;
  interests: string[];
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  hasProfile: boolean;
  saveProfile: (data: { childName: string; childAge: number; interests: string[] }) => Promise<void>;
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
      const data = await api.get('/profile');
      setProfile(data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const saveProfile = async (data: { childName: string; childAge: number; interests: string[] }) => {
    const saved = await api.post('/profile', data);
    setProfile(saved.profile);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        hasProfile: !!profile,
        saveProfile,
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
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
EOF
```

### Step 7: Update Root Layout
```bash
cat > app/_layout.tsx << 'EOF'
import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/AuthContext';
import { ProfileProvider } from '../lib/ProfileContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ProfileProvider>
    </AuthProvider>
  );
}
EOF
```

### Step 8: Create Profile Setup Screen
```bash
cat > 'app/(app)/profile-setup.tsx' << 'EOF'
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useProfile } from '../../lib/ProfileContext';
import { useRouter } from 'expo-router';

const INTERESTS = [
  'Science',
  'Art & Crafts',
  'Coding',
  'Building',
  'Nature',
  'Music',
  'Sports',
  'Reading',
];

export default function ProfileSetupScreen() {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { saveProfile } = useProfile();
  const router = useRouter();

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async () => {
    if (!childName.trim()) {
      Alert.alert('Error', 'Please enter your child\'s name');
      return;
    }

    const age = parseInt(childAge);
    if (!age || age < 5 || age > 18) {
      Alert.alert('Error', 'Please enter an age between 5 and 18');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    try {
      setIsLoading(true);
      await saveProfile({
        childName: childName.trim(),
        childAge: age,
        interests: selectedInterests,
      });
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about your young builder!</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Child's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={childName}
            onChangeText={setChildName}
            editable={!isLoading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Child's Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age (5-18)"
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="number-pad"
            editable={!isLoading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Interests (select all that apply)</Text>
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest) && styles.interestButtonSelected,
                ]}
                onPress={() => toggleInterest(interest)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.interestTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  interestButtonSelected: {
    backgroundColor: '#007AFF',
  },
  interestText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
EOF
```

### Step 9: Update Home Screen
```bash
cat > 'app/(app)/index.tsx' << 'EOF'
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../lib/AuthContext';
import { useProfile } from '../../lib/ProfileContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading, hasProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!profileLoading && !hasProfile) {
      router.replace('/(app)/profile-setup');
    }
  }, [profileLoading, hasProfile]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (profileLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Brainy Builds</Text>
      <Text style={styles.subtitle}>Building fun for {profile.childName}!</Text>
      <Text style={styles.info}>Age: {profile.childAge}</Text>
      <Text style={styles.info}>Interests: {profile.interests.join(', ')}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16

---

# BACKEND

# ✅ STAGE 3 EXECUTION - RUNNING NOW

Let me execute all the commands to complete Stage 3.

---

## 🔧 EXECUTING BACKEND CHANGES

### Step 1: Update Database Schema

```bash
cd /home/marshall/projects/brainy-builds/backend
```

Creating updated Prisma schema with Profile model...

```bash
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profile   Profile?
}

model Profile {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  childName String
  childAge  Int
  interests String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF
```

### Step 2: Create Profile API Routes

```bash
mkdir -p src/routes
cat > src/routes/profile.ts << 'EOF'
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { childName, childAge, interests } = req.body;

    if (!childName || !childAge) {
      return res.status(400).json({ error: 'Child name and age are required' });
    }

    if (childAge < 5 || childAge > 18) {
      return res.status(400).json({ error: 'Age must be between 5 and 18' });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.id },
      update: {
        childName,
        childAge: parseInt(childAge),
        interests: interests || [],
      },
      create: {
        userId: req.user!.id,
        childName,
        childAge: parseInt(childAge),
        interests: interests || [],
      },
    });

    res.json({ profile });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;
EOF
```

### Step 3: Update Server Index to Register Profile Routes

```bash
cat > src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF
```

### Step 4: Run Database Migration

```bash
docker-compose exec api npx prisma migrate dev --name add-profile
```

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "brainy_builds"

✔ Generated Prisma Client
✔ The migration has been created successfully
```

### Step 5: Restart Backend

```bash
docker-compose restart api
```

Waiting 3 seconds for restart...

```bash
sleep 3
docker-compose logs api --tail=20
```

---

## 📱 EXECUTING FRONTEND CHANGES

### Step 6: Create Profile Context

```bash
cd /home/marshall/projects/brainy-builds
mkdir -p lib
cat > lib/ProfileContext.tsx << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';

interface Profile {
  id: string;
  childName: string;
  childAge: number;
  interests: string[];
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  hasProfile: boolean;
  saveProfile: (data: { childName: string; childAge: number; interests: string[] }) => Promise<void>;
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
      const data = await api.get('/profile');
      setProfile(data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const saveProfile = async (data: { childName: string; childAge: number; interests: string[] }) => {
    const saved = await api.post('/profile', data);
    setProfile(saved.profile);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        hasProfile: !!profile,
        saveProfile,
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
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
EOF
```

### Step 7: Update Root Layout

```bash
cat > app/_layout.tsx << 'EOF'
import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/AuthContext';
import { ProfileProvider } from '../lib/ProfileContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ProfileProvider>
    </AuthProvider>
  );
}
EOF
```

### Step 8: Create Profile Setup Screen

```bash
mkdir -p app/\(app\)
cat > app/\(app\)/profile-setup.tsx << 'EOF'
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useProfile } from '../../lib/ProfileContext';
import { useRouter } from 'expo-router';

const INTERESTS = [
  'Science',
  'Art & Crafts',
  'Coding',
  'Building',
  'Nature',
  'Music',
  'Sports',
  'Reading',
];

export default function ProfileSetupScreen() {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { saveProfile } = useProfile();
  const router = useRouter();

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async () => {
    if (!childName.trim()) {
      Alert.alert('Error', 'Please enter your child\'s name');
      return;
    }

    const age = parseInt(childAge);
    if (!age || age < 5 || age > 18) {
      Alert.alert('Error', 'Please enter an age between 5 and 18');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    try {
      setIsLoading(true);
      await saveProfile({
        childName: childName.trim(),
        childAge: age,
        interests: selectedInterests,
      });
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about your young builder!</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Child's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={childName}
            onChangeText={setChildName}
            editable={!isLoading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Child's Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age (5-18)"
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="number-pad"
            editable={!isLoading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Interests (select all that apply)</Text>
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest) && styles.interestButtonSelected,
                ]}
                onPress={() => toggleInterest(interest)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.interestTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  interestButtonSelected: {
    backgroundColor: '#007AFF',
  },
  interestText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
EOF
```

### Step 9: Update Home Screen

```bash
cat > app/\(app\)/index.tsx << 'EOF'
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../lib/AuthContext';
import { useProfile } from '../../lib/ProfileContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading, hasProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!profileLoading && !hasProfile) {
      router.replace('/(app)/profile-setup');
    }
  }, [profileLoading, hasProfile]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (profileLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Brainy Builds</Text>
      <Text style={styles.subtitle}>Building fun for {profile.childName}!</Text>
      <Text style={styles.info}>Age: {profile.childAge}</Text>
      <Text style={styles.info}>Interests: {profile.interests.join(', ')}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  