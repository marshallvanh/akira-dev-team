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
/home/marshall/projects/brainy-builds/backend/dist/lib/achievements.js
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
/home/marshall/projects/brainy-builds/backend/src/lib/achievements.ts
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

# BACKEND

# 🎯 STAGE 18: Complete Rewards + Achievements Backend

Great! Backend is building. Now implementing the full rewards and achievements system.

---

## WHAT WE'RE BUILDING

**Backend APIs:**
1. **Rewards Controller** - Get rewards, purchase with points
2. **Achievements Controller** - Get achievements, unlock and award points
3. **Points Service** - Calculate earned/spent/balance
4. **Database Seeds** - Populate 12+ rewards and 8+ achievements

**Integration:**
- Connect frontend rewards store to real backend
- Connect frontend achievements to real backend
- Real-time points balance updates
- Purchase validation and error handling

---

## ARCHITECTURE

```
Frontend (React Native)
    ↓
lib/api.ts (Axios calls)
    ↓
Backend Express Routes
    ↓
Controllers (business logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

---

## FILES BEING CREATED

**Backend:**
- `src/controllers/rewards.controller.ts` - Rewards API logic
- `src/controllers/achievements.controller.ts` - Achievements API logic
- `src/routes/rewards.routes.ts` - Rewards endpoints
- `src/routes/achievements.routes.ts` - Achievements endpoints
- `src/services/points.service.ts` - Points calculation service
- `prisma/seed.ts` - Database seeding script

**Updates:**
- `src/server.ts` - Register new routes
- `package.json` - Add seed script

---

## IMPLEMENTATION PLAN

**Step 1:** Create rewards controller with purchase validation
**Step 2:** Create achievements controller with unlock logic
**Step 3:** Build points calculation service
**Step 4:** Create database seed with rewards + achievements
**Step 5:** Update main server to register routes
**Step 6:** Build and test compilation
**Step 7:** Run database seed

---

## DELIVERABLES

✅ Full rewards purchase system with points validation
✅ Achievement unlock system with points awards
✅ Points balance calculation (earned - spent)
✅ 12+ rewards in database (100-750 points)
✅ 8+ achievements in database (50-500 points)
✅ Complete backend API ready for frontend integration

---

**Building now...**

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/backend/src/controllers
mkdir -p /home/marshall/projects/brainy-builds/backend/src/services

FILES:
/home/marshall/projects/brainy-builds/backend/src/controllers/rewards.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRewards = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const rewards = await prisma.reward.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        category: true,
        cost: true,
      },
      orderBy: { cost: 'asc' },
    });

    const userRewards = await prisma.userReward.findMany({
      where: { userId: parseInt(userId) },
      select: { rewardId: true, purchasedAt: true },
    });

    const purchasedIds = new Set(userRewards.map(ur => ur.rewardId));

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: parseInt(userId) },
      include: { achievement: true },
    });

    const earnedPoints = achievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

    const spent = await prisma.userReward.findMany({
      where: { userId: parseInt(userId) },
      include: { reward: true },
    });

    const spentPoints = spent.reduce((sum, ur) => sum + ur.reward.cost, 0);
    const balance = earnedPoints - spentPoints;

    const rewardsWithStatus = rewards.map(reward => ({
      ...reward,
      isPurchased: purchasedIds.has(reward.id),
      canAfford: balance >= reward.cost,
    }));

    res.json({
      rewards: rewardsWithStatus,
      pointsBalance: balance,
      earnedPoints,
      spentPoints,
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
};

export const purchaseReward = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { rewardId } = req.body;

    const userIdNum = parseInt(userId);

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    const existing = await prisma.userReward.findFirst({
      where: { userId: userIdNum, rewardId },
    });

    if (existing) {
      return res.status(400).json({ error: 'Reward already purchased' });
    }

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: userIdNum },
      include: { achievement: true },
    });

    const earnedPoints = achievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

    const spent = await prisma.userReward.findMany({
      where: { userId: userIdNum },
      include: { reward: true },
    });

    const spentPoints = spent.reduce((sum, ur) => sum + ur.reward.cost, 0);
    const balance = earnedPoints - spentPoints;

    if (balance < reward.cost) {
      return res.status(400).json({
        error: 'Insufficient points',
        required: reward.cost,
        available: balance,
      });
    }

    const purchase = await prisma.userReward.create({
      data: {
        userId: userIdNum,
        rewardId,
        purchasedAt: new Date(),
      },
      include: { reward: true },
    });

    res.json({
      success: true,
      message: `Successfully purchased ${reward.name}!`,
      purchase,
      newBalance: balance - reward.cost,
    });
  } catch (error) {
    console.error('Purchase reward error:', error);
    res.status(500).json({ error: 'Failed to purchase reward' });
  }
};

/home/marshall/projects/brainy-builds/backend/src/controllers/achievements.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);

    const allAchievements = await prisma.achievement.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        category: true,
        requirement: true,
        points: true,
      },
      orderBy: { points: 'asc' },
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: userIdNum },
      select: { achievementId: true, unlockedAt: true },
    });

    const unlockedMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua.unlockedAt])
    );

    const achievements = allAchievements.map(achievement => ({
      ...achievement,
      isUnlocked: unlockedMap.has(achievement.id),
      unlockedAt: unlockedMap.get(achievement.id) || null,
    }));

    const totalPoints = userAchievements.reduce((sum, ua) => {
      const achievement = allAchievements.find(a => a.id === ua.achievementId);
      return sum + (achievement?.points || 0);
    }, 0);

    res.json({
      achievements,
      unlockedCount: unlockedMap.size,
      totalCount: allAchievements.length,
      totalPoints,
      progressPercentage: Math.round((unlockedMap.size / allAchievements.length) * 100),
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

export const unlockAchievement = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { achievementId } = req.body;

    const userIdNum = parseInt(userId);

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const existing = await prisma.userAchievement.findFirst({
      where: { userId: userIdNum, achievementId },
    });

    if (existing) {
      return res.status(400).json({ error: 'Achievement already unlocked' });
    }

    const unlock = await prisma.userAchievement.create({
      data: {
        userId: userIdNum,
        achievementId,
        unlockedAt: new Date(),
      },
      include: { achievement: true },
    });

    res.json({
      success: true,
      message: `Unlocked ${achievement.name}! +${achievement.points} points`,
      achievement: unlock.achievement,
      unlock,
    });
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ error: 'Failed to unlock achievement' });
  }
};

/home/marshall/projects/brainy-builds/backend/src/routes/rewards.routes.ts
import { Router } from 'express';
import { getRewards, purchaseReward } from '../controllers/rewards.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:userId', authenticateToken, getRewards);
router.post('/:userId/purchase', authenticateToken, purchaseReward);

export default router;

/home/marshall/projects/brainy-builds/backend/src/routes/achievements.routes.ts
import { Router } from 'express';
import { getAchievements, unlockAchievement } from '../controllers/achievements.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:userId', authenticateToken, getAchievements);
router.post('/:userId/unlock', authenticateToken, unlockAchievement);

export default router;

/home/marshall/projects/brainy-builds/backend/src/services/points.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PointsService {
  async getUserBalance(userId: number): Promise<{
    earned: number;
    spent: number;
    balance: number;
  }> {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const earned = achievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

    const rewards = await prisma.userReward.findMany({
      where: { userId },
      include: { reward: true },
    });

    const spent = rewards.reduce((sum, ur) => sum + ur.reward.cost, 0);

    return {
      earned,
      spent,
      balance: earned - spent,
    };
  }

  async awardPoints(userId: number, achievementId: number): Promise<number> {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new Error('Achievement not found');
    }

    const existing = await prisma.userAchievement.findFirst({
      where: { userId, achievementId },
    });

    if (existing) {
      throw new Error('Achievement already unlocked');
    }

    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
        unlockedAt: new Date(),
      },
    });

    return achievement.points;
  }

  async canAfford(userId: number, cost: number): Promise<boolean> {
    const balance = await this.getUserBalance(userId);
    return balance.balance >= cost;
  }
}

export const pointsService = new PointsService();

/home/marshall/projects/brainy-builds/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import analyticsRoutes from './routes/analytics';
import achievementsRoutes from './routes/achievements.routes';
import rewardsRoutes from './routes/rewards.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/rewards', rewardsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;

/home/marshall/projects/brainy-builds/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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
      name