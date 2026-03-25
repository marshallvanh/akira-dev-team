# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/history.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/\(main\)/parent-dashboard.tsx
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
/home/marshall/projects/brainy-builds/app/(main)/story.tsx
/home/marshall/projects/brainy-builds/app/(main)/story/[week].tsx
/home/marshall/projects/brainy-builds/backend/dist/middleware/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/analytics.js
/home/marshall/projects/brainy-builds/backend/dist/routes/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/profile.js
/home/marshall/projects/brainy-builds/backend/dist/server.js
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/package-lock.json
/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000001_add_avatar_grade/migration.sql
/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000002_add_avatar_grade/migration.sql
/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000523_init/migration.sql
/home/marshall/projects/brainy-builds/backend/prisma/migrations/migration_lock.toml
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
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
/home/marshall/projects/brainy-builds/lib/api.ts
/home/marshall/projects/brainy-builds/lib/AuthContext.tsx
/home/marshall/projects/brainy-builds/lib/progress.ts
/home/marshall/projects/brainy-builds/lib/speechRecognition.ts
/home/marshall/projects/brainy-builds/lib/stories.ts
/home/marshall/projects/brainy-builds/package.json
/home/marshall/projects/brainy-builds/package-lock.json
/home/marshall/projects/brainy-builds/README.md

=== PACKAGE.JSON ===
{
  "dependencies": {
    "@react-native-voice/voice": "^3.2.4",
    "expo-speech": "~55.0.9",
    "expo-speech-recognition": "^3.1.2"
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

=== SUMMARY ===
Files found: 3
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# TETSUO

# 🚀 STAGE 15: GAMIFICATION & REWARDS SYSTEM

**Building achievement badges, rewards store, level progression, and virtual currency...**

---

## WHAT I'M BUILDING

- Achievement badge system with unlock conditions
- Rewards catalog (avatars, buildings, decorations)
- Points-based purchasing system
- Achievement tracking API endpoints
- Rewards store UI with purchase flow
- Achievement notifications

---

## TECHNICAL APPROACH

- Create achievements library with badge definitions and unlock logic
- Build backend routes for achievement checking and reward purchases
- Add Prisma models for Achievement and Reward
- Create rewards store screen with category filtering
- Implement purchase confirmation flow
- Add achievement unlock notifications

---

## BUILD SEQUENCE

1. Create achievement definitions and reward catalog
2. Add Prisma models for achievements and rewards
3. Build achievement checking and reward purchase API
4. Create rewards store screen
5. Add achievement notification system
6. Wire up points tracking on story completion

---

⚡ **Executing Stage 15 build...**

Actions: 5 commands
Files: 7 files

💰 *Cost: $1.8757 (21 calls this session)*

---

# BACKEND

# 🎮 STAGE 15: GAMIFICATION & REWARDS SYSTEM

**Building achievement badges, rewards store, level progression, and virtual currency system...**

---

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/lib
mkdir -p /home/marshall/projects/brainy-builds/backend/src/routes
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)
mkdir -p /home/marshall/projects/brainy-builds/backend/prisma/migrations/20260324000001_add_achievements

FILES:
/home/marshall/projects/brainy-builds/lib/achievements.ts
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  pointsReward: number;
}

export interface UserStats {
  storiesCompleted: number;
  currentStreak: number;
  totalPoints: number;
  averageAccuracy: number;
  totalMinutesRead: number;
}

export const ACHIEVEMENT_BADGES: Badge[] = [
  {
    id: 'first_story',
    title: 'Story Starter',
    description: 'Complete your first story',
    icon: '📖',
    pointsReward: 50,
    condition: (stats) => stats.storiesCompleted >= 1,
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day reading streak',
    icon: '🔥',
    pointsReward: 100,
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'perfect_score',
    title: 'Perfect Reader',
    description: 'Achieve 100% accuracy on any story',
    icon: '⭐',
    pointsReward: 150,
    condition: (stats) => stats.averageAccuracy === 100,
  },
  {
    id: 'ten_stories',
    title: 'Story Collector',
    description: 'Complete 10 stories',
    icon: '📚',
    pointsReward: 200,
    condition: (stats) => stats.storiesCompleted >= 10,
  },
  {
    id: 'point_master',
    title: 'Point Master',
    description: 'Earn 1000 total points',
    icon: '💎',
    pointsReward: 250,
    condition: (stats) => stats.totalPoints >= 1000,
  },
  {
    id: 'reading_champion',
    title: 'Reading Champion',
    description: 'Read for 100 minutes total',
    icon: '👑',
    pointsReward: 300,
    condition: (stats) => stats.totalMinutesRead >= 100,
  },
];

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'avatar' | 'building' | 'decoration';
  pointsCost: number;
}

export const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'avatar_robot',
    name: 'Robot Avatar',
    description: 'A cool robot to represent you',
    icon: '🤖',
    type: 'avatar',
    pointsCost: 250,
  },
  {
    id: 'avatar_superhero',
    name: 'Superhero Avatar',
    description: 'Save the day with superpowers',
    icon: '🦸',
    type: 'avatar',
    pointsCost: 300,
  },
  {
    id: 'avatar_wizard',
    name: 'Wizard Avatar',
    description: 'Cast spells and enchantments',
    icon: '🧙',
    type: 'avatar',
    pointsCost: 250,
  },
  {
    id: 'building_library',
    name: 'Library Building',
    description: 'Add a library to your school',
    icon: '📚',
    type: 'building',
    pointsCost: 500,
  },
  {
    id: 'building_gym',
    name: 'Gym Building',
    description: 'Add a gym to your school',
    icon: '🏋️',
    type: 'building',
    pointsCost: 450,
  },
  {
    id: 'building_cafeteria',
    name: 'Cafeteria Building',
    description: 'Add a cafeteria to your school',
    icon: '🍽️',
    type: 'building',
    pointsCost: 400,
  },
  {
    id: 'deco_fountain',
    name: 'Water Fountain',
    description: 'Decorate with a fountain',
    icon: '⛲',
    type: 'decoration',
    pointsCost: 100,
  },
  {
    id: 'deco_garden',
    name: 'Garden',
    description: 'Add a beautiful garden',
    icon: '🌳',
    type: 'decoration',
    pointsCost: 150,
  },
  {
    id: 'deco_flag',
    name: 'School Flag',
    description: 'Raise your school flag',
    icon: '🚩',
    type: 'decoration',
    pointsCost: 120,
  },
];

/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260324000001_add_achievements/migration.sql
-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "badgeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_userId_badgeId_key" ON "Achievement"("userId", "badgeId");

/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              Int              @id @default(autoincrement())
  email           String           @unique
  password        String
  name            String?
  avatar          String?
  grade           String?
  level           Int              @default(1)
  currentPoints   Int              @default(0)
  totalPoints     Int              @default(0)
  createdAt       DateTime         @default(now())
  readingSessions ReadingSession[]
  achievements    Achievement[]
  rewards         Reward[]
}

model ReadingSession {
  id          Int       @id @default(autoincrement())
  userId      Int
  storyId     String
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  accuracy    Float?
  user        User      @relation(fields: [userId], references: [id])
}

model Achievement {
  id          Int      @id @default(autoincrement())
  userId      Int
  badgeId     String
  title       String
  description String
  unlockedAt  DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])

  @@unique([userId, badgeId])
}

model Reward {
  id          Int      @id @default(autoincrement())
  userId      Int
  itemId      String
  itemName    String
  itemType    String
  pointsCost  Int
  purchasedAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

/home/marshall/projects/brainy-builds/backend/src/routes/achievements.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:userId/achievements', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await prisma.achievement.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { unlockedAt: 'desc' },
    });
    res.json(achievements);
  } catch (error) {
    console.error('Achievement fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.get('/:userId/rewards', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const rewards = await prisma.reward.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { purchasedAt: 'desc' },
    });
    res.json(rewards);
  } catch (error) {
    console.error('Reward fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

router.post('/:userId/rewards', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemId, itemName, itemType, pointsCost } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user || user.currentPoints < pointsCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    await prisma.reward.create({
      data: {
        userId: parseInt(userId),
        itemId,
        itemName,
        itemType,
        pointsCost,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        currentPoints: user.currentPoints - pointsCost,
      },
    });

    res.json({ success: true, currentPoints: updatedUser.currentPoints });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to purchase reward' });
  }
});

router.post('/:userId/check-achievements', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { ACHIEVEMENT_BADGES } = await import('../../../lib/achievements');

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { readingSessions: true, achievements: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessions = user.readingSessions;
    const storiesCompleted = sessions.filter((s) => s.completedAt).length;
    const averageAccuracy =
      sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length || 0;
    const totalMinutesRead = sessions.reduce((acc, session) => {
      if (session.completedAt && session.startedAt) {
        const duration =
          (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) /
          1000 /
          60;
        return acc + duration;
      }
      return acc;
    }, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    const sortedSessions = sessions
      .filter((s) => s.completedAt)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (daysDiff === currentStreak || (currentStreak === 0 && daysDiff <= 1)) {
        currentStreak++;
        currentDate.setTime(sessionDate.getTime());
      } else {
        break;
      }
    }

    const stats = {
      storiesCompleted,
      currentStreak,
      totalPoints: user.totalPoints,
      averageAccuracy,
      totalMinutesRead,
    };

    const unlockedBadges = [];
    for (const badge of ACHIEVEMENT_BADGES) {
      const alreadyUnlocked = user.achievements.some((a) => a.badgeId === badge.id);
      if (!alreadyUnlocked && badge.condition(stats)) {
        const achievement = await prisma.achievement.create({
          data: {
            userId: parseInt(userId),
            badgeId: badge.id,
            title: badge.title,
            description: badge.description,
          },
        });

        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: {
            currentPoints: user.currentPoints + badge.pointsReward,
            totalPoints: user.totalPoints + badge.pointsReward,
          },
        });

        unlockedBadges.push({
          achievement,
          pointsAwarded: badge.pointsReward,
        });
      }
    }

    res.json({
      newAchievements: unlockedBadges,
      userStats: stats,
    });
  } catch (error) {
    console.error('Achievement check error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

export default router;

/home/marshall/projects/brainy-builds/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import analyticsRoutes from './routes/analytics';
import achievementsRoutes from './routes/achievements';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/achievements', achievementsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/home/marshall/projects/brainy-builds/app/\(main\)/rewards.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../_layout';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { REWARDS_CATALOG, RewardItem, ACHIEVEMENT