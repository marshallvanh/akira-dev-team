# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/achievements.tsx
/home/marshall/projects/brainy-builds/app/(main)/history.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/parent-dashboard.tsx
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
/home/marshall/projects/brainy-builds/app/(main)/rewards.tsx
/home/marshall/projects/brainy-builds/app/(main)/story.tsx
/home/marshall/projects/brainy-builds/app/(main)/story/[week].tsx
/home/marshall/projects/brainy-builds/backend/dist/middleware/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/achievements.js
/home/marshall/projects/brainy-builds/backend/dist/routes/analytics.js
/home/marshall/projects/brainy-builds/backend/dist/routes/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/profile.js
/home/marshall/projects/brainy-builds/backend/dist/server.js
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/package-lock.json
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/achievements.ts
/home/marshall/projects/brainy-builds/backend/src/routes/analytics.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/ProfileHeader.tsx
/home/marshall/projects/brainy-builds/components/ProgressChart.tsx
/home/marshall/projects/brainy-builds/components/story/ProgressBar.tsx
/home/marshall/projects/brainy-builds/components/story/TextToSpeech.tsx
/home/marshall/projects/brainy-builds/components/story/VoiceReader.tsx
/home/marshall/projects/brainy-builds/constants/avatars.ts
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.env
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/lib/achievements.js
/home/marshall/projects/brainy-builds/lib/achievements.ts
/home/marshall/projects/brainy-builds/lib/api.ts
/home/marshall/projects/brainy-builds/lib/AuthContext.tsx
/home/marshall/projects/brainy-builds/lib/progress.ts
/home/marshall/projects/brainy-builds/lib/speechRecognition.ts
/home/marshall/projects/brainy-builds/lib/stories.ts
/home/marshall/projects/brainy-builds/lib/supabase.ts

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
    "@supabase/supabase-js": "^2.39.7",
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

--- app/(main)/_layout.tsx ---
import { Stack } from 'expo-router';

export default function MainLayout() {
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
import { useAuth } from '../_layout';
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
  const { session } = useAuth();
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
      if (!session?.user?.id) return;

      const profileResponse = await api.get(`/profile/${session.user.id}`);
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

  const handleStoryPress = () => {
    router.push('/story/1');
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
        <Text style={styles.sectionTitle}>This Week's Story</Text>
        <TouchableOpacity style={styles.storyCard} onPress={() => router.push('/(main)/story')}>
          <Text style={styles.storyIcon}>📖</Text>
          <View style={styles.storyContent}>
            <Text style={styles.storyTitle}>The School Builder</Text>
            <Text style={styles.storySubtitle}>Week 1 • Tap words to read • Read aloud when done</Text>
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
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Browse Projects</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Daily Challenge</Text>
          </View>
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

--- lib/supabase.ts ---
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

=== SUMMARY ===
Files found: 4
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# TETSUO

# 🔍 BACKEND BUILD FAILURE ANALYSIS

Marshall, the backend TypeScript compilation is failing. Need to diagnose before continuing.

---

## THE ISSUE

```bash
npm run build
```
Returns: `undefined`

This means either:
1. TypeScript compiler found errors in the code
2. The build script isn't configured correctly
3. Dependencies are missing

---

## DIAGNOSIS NEEDED

I need to see the actual error output to fix it.

**One question:**
Is this a **new project** or did the backend work before today?

Type:
- `new` — First time setting up backend
- `worked` — It compiled successfully before
- `dunno` — Not sure, just fix it

---

⚡ *Waiting for answer so I can run the right fix*

---

# BACKEND

# 🎯 STAGE 17: Backend Rewards API + Frontend Integration

## Current Status Analysis

**✅ Completed:**
- Frontend achievements screen with real-time tracking
- Frontend rewards store UI with purchase flow
- Database schema includes achievements + rewards tables
- Prisma client generated successfully

**❌ Missing:**
- Backend API routes for rewards
- Backend API routes for achievements tracking
- User points balance system
- Reward purchase logic with points deduction

**⚠️ Build Issue:**
- Backend `npm run build` showing "undefined" error
- Need to check TypeScript compilation issues

---

## STAGE 17 PLAN

### Backend Implementation

**1. Create Rewards Controller**
- GET `/api/rewards/:userId` - Fetch available rewards + user's purchases
- POST `/api/rewards/:userId/purchase` - Purchase a reward (deduct points)
- Validate point balance before purchase
- Create transaction record

**2. Create Achievements Controller**
- GET `/api/achievements/:userId` - Fetch user's achievement progress
- POST `/api/achievements/:userId/unlock` - Unlock an achievement
- Award points when achievement unlocked
- Track unlock timestamps

**3. Create Points Service**
- Calculate total points from achievements
- Track points spent on rewards
- Get current balance (earned - spent)

**4. Add Reward Seeds**
- Populate database with initial rewards
- Categories: building, decoration, special
- Various price points (100-1000 points)

---

## EXECUTION APPROACH

**Step 1: Fix Backend Build**
```bash
cd /home/marshall/projects/brainy-builds/backend
cat src/index.ts  # Check for errors
npm run build     # Re-attempt compilation
```

**Step 2: Build Rewards API**
- `src/controllers/rewards.controller.ts`
- `src/routes/rewards.routes.ts`
- `src/services/points.service.ts`

**Step 3: Build Achievements API**
- `src/controllers/achievements.controller.ts`
- `src/routes/achievements.routes.ts`

**Step 4: Seed Rewards Data**
- `prisma/seed-rewards.ts`
- Run seeder to populate rewards table

**Step 5: Update Main Server**
- Register new routes in `src/index.ts`
- Test API endpoints

---

## DELIVERABLES

By end of stage:
- ✅ Full rewards purchase system working
- ✅ Achievements tracking with point awards
- ✅ Points balance calculation
- ✅ 12+ rewards available in store
- ✅ Backend compiled and running
- ✅ Frontend connected to real APIs

---

**Ready to build the rewards backend?**

Say **yes** to start implementation or **skip** if you want to move to something else.