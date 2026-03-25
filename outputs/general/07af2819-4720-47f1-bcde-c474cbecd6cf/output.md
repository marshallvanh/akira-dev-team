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
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/src/services/points.service.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/ProfileHeader.tsx
/home/marshall/projects/brainy-builds/components/ProgressChart.tsx
/home/marshall/projects/brainy-builds/components/story/ProgressBar.tsx
/home/marshall/projects/brainy-builds/components/story/TextToSpeech.tsx

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

# 🎯 STAGE 19 (TRIPLE FIX): Seed Database + Fix Imports

Marshall, we have **two separate issues** to fix:

1. **Seed script failure** - Schema requires `id` field but we're not providing it
2. **TypeScript compilation errors** - Import statements reference `checkAchievements` but the function is named `checkAndUnlockAchievements`

---

## THE PROBLEMS

**Problem 1: Seed Script**
```
Argument `id` is missing.
```
The schema has `@id @default(autoincrement())` but seed is trying to upsert without providing `id`. We need to change the upsert strategy.

**Problem 2: Import Mismatch**
```
Module '"../lib/achievements"' has no exported member 'checkAchievements'
```
The function is exported as `checkAndUnlockAchievements` but imported as `checkAchievements`.

---

## EXECUTION PLAN

```bash
# Step 1: Fix seed.ts to use findUnique/create instead of upsert
cat > /home/marshall/projects/brainy-builds/backend/prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed achievements
  const achievementsData = [
    {
      name: 'First Steps',
      description: 'Complete your first story',
      icon: '👣',
      category: 'story',
      requirement: 'complete_1_story',
      points: 50,
    },
    {
      name: 'Story Master',
      description: 'Complete 10 stories',
      icon: '📚',
      category: 'story',
      requirement: 'complete_10_stories',
      points: 200,
    },
    {
      name: 'Perfect Reader',
      description: 'Read an entire story without mistakes',
      icon: '👁️',
      category: 'reading',
      requirement: 'perfect_read',
      points: 150,
    },
    {
      name: 'Builder Apprentice',
      description: 'Build your first school structure',
      icon: '🧰',
      category: 'building',
      requirement: 'first_build',
      points: 75,
    },
    {
      name: 'Master Builder',
      description: 'Reach 50% school completion',
      icon: '🏗️',
      category: 'building',
      requirement: 'build_50_percent',
      points: 300,
    },
    {
      name: 'Weekly Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streak',
      requirement: 'streak_7_days',
      points: 100,
    },
    {
      name: 'Consistent Champion',
      description: 'Maintain a 30-day streak',
      icon: '⭐',
      category: 'streak',
      requirement: 'streak_30_days',
      points: 500,
    },
    {
      name: 'Point Collector',
      description: 'Earn 1000 total points',
      icon: '💰',
      category: 'points',
      requirement: 'earn_1000_points',
      points: 250,
    },
  ];

  for (const achievement of achievementsData) {
    const existing = await prisma.achievement.findUnique({
      where: { name: achievement.name },
    });

    if (!existing) {
      await prisma.achievement.create({
        data: achievement,
      });
    }
  }

  console.log('✅ Achievements seeded');

  // Seed rewards (12 total)
  const rewardsData = [
    {
      name: 'Wooden Plank',
      description: 'Quality wood for building',
      icon: '🪵',
      category: 'building',
      cost: 60,
    },
    {
      name: 'Stone Block',
      description: 'A solid stone block for construction',
      icon: '🪨',
      category: 'building',
      cost: 80,
    },
    {
      name: 'Golden Brick',
      description: 'A shiny golden brick for your school',
      icon: '🧱',
      category: 'building',
      cost: 100,
    },
    {
      name: 'Glass Window',
      description: 'A beautiful glass window',
      icon: '🪟',
      category: 'building',
      cost: 150,
    },
    {
      name: 'Red Door',
      description: 'A bright red entrance door',
      icon: '🚪',
      category: 'building',
      cost: 120,
    },
    {
      name: 'Steel Beam',
      description: 'Strong steel support beam',
      icon: '⬜',
      category: 'building',
      cost: 180,
    },
    {
      name: 'Premium Avatar',
      description: 'Unlock exclusive avatar cosmetics',
      icon: '👑',
      category: 'cosmetic',
      cost: 250,
    },
    {
      name: 'Extra Lives',
      description: 'Get 3 bonus reading attempts',
      icon: '❤️',
      category: 'power-up',
      cost: 200,
    },
    {
      name: 'Speed Boost',
      description: 'Read 50% faster for one week',
      icon: '⚡',
      category: 'power-up',
      cost: 175,
    },
    {
      name: 'XP Multiplier',
      description: 'Double points earned for 3 days',
      icon: '2️⃣',
      category: 'power-up',
      cost: 300,
    },
    {
      name: 'Theme Pack',
      description: 'Unlock dark mode and custom themes',
      icon: '🎨',
      category: 'cosmetic',
      cost: 225,
    },
    {
      name: 'Gold Badge',
      description: 'Display a prestigious gold badge',
      icon: '🏆',
      category: 'cosmetic',
      cost: 350,
    },
  ];

  for (const reward of rewardsData) {
    const existing = await prisma.reward.findUnique({
      where: { name: reward.name },
    });

    if (!existing) {
      await prisma.reward.create({
        data: reward,
      });
    }
  }

  console.log('✅ Rewards seeded');
  console.log('🌱 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Step 2: Fix achievements.controller.ts import
cat > /home/marshall/projects/brainy-builds/backend/src/controllers/achievements.controller.ts << 'EOF'
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkAndUnlockAchievements } from '../lib/achievements';

const prisma = new PrismaClient();

export async function getUserAchievements(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    const allAchievements = await prisma.achievement.findMany();

    const achievementsWithStatus = allAchievements.map((achievement) => {
      const unlocked = userAchievements.find((ua) => ua.achievementId === achievement.id);
      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
      };
    });

    res.json({
      achievements: achievementsWithStatus,
      totalUnlocked: userAchievements.length,
      totalPoints: userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0),
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
}

export async function checkNewAchievements(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    // Get user stats
    const progress = await prisma.progress.findMany({
      where: { userId, completed: true },
    });

    const storiesCompleted = progress.length;
    const perfectReads = progress.filter((p) => (p.accuracyScore ?? 0) >= 100).length;

    // Calculate streak (simplified - would need date checking in production)
    const currentStreak = 0; // TODO: Implement proper streak calculation

    // Get total points
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
    const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

    // Check for new achievements
    const newAchievements = await checkAndUnlockAchievements(userId, {
      storiesCompleted,
      perfectReads,
      currentStreak,
      totalPoints,
    });

    res.json({
      newAchievements,
      count: newAchievements.length,
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
}
EOF

# Step 3: Fix achievements.routes.ts import
cat > /home/marshall/projects/brainy-builds/backend/src/routes/achievements.routes.ts << 'EOF'
import { Router } from 'express';
import { getUserAchievements, checkNewAchievements } from '../controllers/achievements.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all user achievements
router.get('/', authenticateToken, getUserAchievements);

// Check for newly unlocked achievements
router.post('/check', authenticateToken, checkNewAchievements);

export default router;
EOF

# Step 4: Rebuild TypeScript
cd /home/marshall/projects/brainy-builds/backend && npm run build 2>&1

# Step 5: Run seed
cd /home/marshall/projects/brainy-builds/backend && npx prisma db seed 2>&1
```

---

## WHAT THIS FIXES

1. **Seed script** - Changes from `upsert` to `findUnique` + `create` pattern
2. **Controller import** - Changes `checkAchievements` to `checkAndUnlockAchievements`
3. **Routes import** - Removes unused imports from achievements route
4. **TypeScript compilation** - Should now pass
5. **Database population** - 8 achievements + 12 rewards

---

Say **yes** to fix both issues and seed the database.

---

# BACKEND

# 🎯 STAGE 19 (RETRY): Fix Achievement Seed + Import Errors

Marshall, I found **two critical issues** that need fixing:

## ❌ PROBLEM 1: Seed Script Using Wrong Upsert Key
The seed is trying to upsert by `name`, but Prisma requires `id` for the `Achievement` model since there's no `@@unique([name])` constraint in the schema.

## ❌ PROBLEM 2: Import Error in Controllers
`src/controllers/achievements.controller.ts` imports `checkAchievements` but the actual export is `checkAndUnlockAchievements`.

---

## ✅ THE FIX

1. **Update seed.ts** - Remove upsert, just create achievements if they don't exist
2. **Fix import name** - Change `checkAchievements` to `checkAndUnlockAchievements`
3. **Run seed** - Populate database
4. **Rebuild TypeScript** - Ensure compilation works

---

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/backend/prisma

FILES:
/home/marshall/projects/brainy-builds/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if achievements already exist
  const existingAchievements = await prisma.achievement.count();
  
  if (existingAchievements === 0) {
    // Seed achievements
    const achievementsData = [
      {
        name: 'First Steps',
        description: 'Complete your first story',
        icon: '👣',
        category: 'story',
        requirement: 'complete_1_story',
        points: 50,
      },
      {
        name: 'Story Master',
        description: 'Complete 10 stories',
        icon: '📚',
        category: 'story',
        requirement: 'complete_10_stories',
        points: 200,
      },
      {
        name: 'Perfect Reader',
        description: 'Read an entire story without mistakes',
        icon: '👁️',
        category: 'reading',
        requirement: 'perfect_read',
        points: 150,
      },
      {
        name: 'Builder Apprentice',
        description: 'Build your first school structure',
        icon: '🧰',
        category: 'building',
        requirement: 'first_build',
        points: 75,
      },
      {
        name: 'Master Builder',
        description: 'Reach 50% school completion',
        icon: '🏗️',
        category: 'building',
        requirement: 'build_50_percent',
        points: 300,
      },
      {
        name: 'Weekly Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        requirement: 'streak_7_days',
        points: 100,
      },
      {
        name: 'Consistent Champion',
        description: 'Maintain a 30-day streak',
        icon: '⭐',
        category: 'streak',
        requirement: 'streak_30_days',
        points: 500,
      },
      {
        name: 'Point Collector',
        description: 'Earn 1000 total points',
        icon: '💰',
        category: 'points',
        requirement: 'earn_1000_points',
        points: 250,
      },
    ];

    await prisma.achievement.createMany({
      data: achievementsData,
    });

    console.log('✅ Achievements seeded');
  } else {
    console.log('ℹ️  Achievements already exist, skipping...');
  }

  // Check if rewards already exist
  const existingRewards = await prisma.reward.count();

  if (existingRewards === 0) {
    // Seed rewards (12 total)
    const rewardsData = [
      {
        name: 'Wooden Plank',
        description: 'Quality wood for building',
        icon: '🪵',
        category: 'building',
        cost: 60,
      },
      {
        name: 'Stone Block',
        description: 'A solid stone block for construction',
        icon: '🪨',
        category: 'building',
        cost: 80,
      },
      {
        name: 'Golden Brick',
        description: 'A shiny golden brick for your school',
        icon: '🧱',
        category: 'building',
        cost: 100,
      },
      {
        name: 'Glass Window',
        description: 'A beautiful glass window',
        icon: '🪟',
        category: 'building',
        cost: 150,
      },
      {
        name: 'Red Door',
        description: 'A bright red entrance door',
        icon: '🚪',
        category: 'building',
        cost: 120,
      },
      {
        name: 'Steel Beam',
        description: 'Strong steel support beam',
        icon: '⬜',
        category: 'building',
        cost: 180,
      },
      {
        name: 'Premium Avatar',
        description: 'Unlock exclusive avatar cosmetics',
        icon: '👑',
        category: 'cosmetic',
        cost: 250,
      },
      {
        name: 'Extra Lives',
        description: 'Get 3 bonus reading attempts',
        icon: '❤️',
        category: 'power-up',
        cost: 200,
      },
      {
        name: 'Speed Boost',
        description: 'Read 50% faster for one week',
        icon: '⚡',
        category: 'power-up',
        cost: 175,
      },
      {
        name: 'XP Multiplier',
        description: 'Double points earned for 3 days',
        icon: '2️⃣',
        category: 'power-up',
        cost: 300,
      },
      {
        name: 'Theme Pack',
        description: 'Unlock dark mode and custom themes',
        icon: '🎨',
        category: 'cosmetic',
        cost: 225,
      },
      {
        name: 'Gold Badge',
        description: 'Display a prestigious gold badge',
        icon: '🏆',
        category: 'cosmetic',
        cost: 350,
      },
    ];

    await prisma.reward.createMany({
      data: rewardsData,
    });

    console.log('✅ Rewards seeded');
  } else {
    console.log('ℹ️  Rewards already exist, skipping...');
  }

  console.log('🌱 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/home/marshall/projects/brainy-builds/backend/src/controllers/achievements.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkAndUnlockAchievements } from '../lib/achievements';

const prisma = new PrismaClient();

export async function getUserAchievements(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    const allAchievements = await prisma.achievement.findMany();

    const achievementsWithStatus = allAchievements.map((achievement) => {
      const unlocked = userAchievements.find((ua) => ua.achievementId === achievement.id);
      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
      };
    });

    res.json({
      achievements: achievementsWithStatus,
      totalUnlocked: userAchievements.length,
      totalPoints: userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0),
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
}

export async function checkNewAchievements(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const progress = await prisma.progress.findMany({
      where: { userId, completed: true },
    });

    const storiesCompleted = progress.length;
    const perfectReads = progress.filter((p) => (p.accuracyScore ?? 0) >= 100).length;

    const currentStreak = 0;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
    const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

    const newAchievements = await checkAndUnlockAchievements(userId, {
      storiesCompleted,
      perfectReads,
      currentStreak,
      totalPoints,
    });

    res.json({
      newAchievements,
      count: newAchievements.length,
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
}

/home/marshall/projects/brainy-builds/backend/src/routes/achievements.routes.ts
import { Router } from 'express';
import { getUserAchievements, checkNewAchievements } from '../controllers/achievements.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getUserAchievements);

router.post('/check', authenticateToken, checkNewAchievements);

export default router;
---END PLAN---