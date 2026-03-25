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
/home/marshall/projects/brainy-builds/app/\(main\)/parent-dashboard.tsx
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
/home/marshall/projects/brainy-builds/app/(main)/story.tsx
/home/marshall/projects/brainy-builds/app/(main)/story/[week].tsx
/home/marshall/projects/brainy-builds/backend/dist/middleware/auth.js
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
/home/marshall/projects/brainy-builds/STAGE-4-DASHBOARD-COMPLETE.md
/home/marshall/projects/brainy-builds/test-profile-stage3.sh

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

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/history.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/parent-dashboard.tsx
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
/home/marshall/projects/brainy-builds/components/ProgressChart.tsx
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/ProfileHeader.tsx
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
/home/marshall/projects/brainy-builds/STAGE-4-DASHBOARD-COMPLETE.md
/home/marshall/projects/brainy-builds/test-profile-stage3.sh
/home/marshall/projects/brainy-builds/types/story.ts

=== PACKAGE.JSON ===
{
  "dependencies": {
    "@react-native-voice/voice": "^3.2.4",
    "expo-speech": "~55.0.9",
    "expo-speech-recognition": "^3.1.2"
  }
}

=== EXISTING FILE CONTENTS ===
--- backend/src/routes/analytics.ts ---
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:userId/analytics', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await prisma.readingSession.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { startedAt: 'desc' },
      take: 30,
    });

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

    const storiesCompleted = sessions.filter((s) => s.completedAt).length;
    const averageAccuracy =
      sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length || 0;

    const weeklyData = getWeeklyBreakdown(sessions);
    const currentStreak = calculateStreak(sessions);

    res.json({
      totalMinutesRead: Math.round(totalMinutesRead),
      storiesCompleted,
      averageAccuracy: Math.round(averageAccuracy),
      currentStreak,
      weeklyData,
      recentSessions: sessions.slice(0, 10),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

function getWeeklyBreakdown(sessions: any[]) {
  const weeks = [0, 0, 0, 0];
  const now = new Date();

  sessions.forEach((session) => {
    const sessionDate = new Date(session.startedAt);
    const weeksDiff = Math.floor(
      (now.getTime() - sessionDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    if (weeksDiff < 4 && session.completedAt) {
      weeks[weeksDiff]++;
    }
  });

  return weeks.reverse();
}

function calculateStreak(sessions: any[]) {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions
    .filter((s) => s.completedAt)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.startedAt);
    sessionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}

export default router;

--- app/(main)/parent-dashboard.tsx ---
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../_layout';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import ProgressChart from '../../components/ProgressChart';

interface Analytics {
  totalMinutesRead: number;
  storiesCompleted: number;
  averageAccuracy: number;
  currentStreak: number;
  weeklyData: number[];
  recentSessions: any[];
}

export default function ParentDashboard() {
  const { session } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      if (!session?.user?.id) return;
      const response = await api.get(`/analytics/${session.user.id}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parent Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statValue}>{analytics?.storiesCompleted || 0}</Text>
          <Text style={styles.statLabel}>Stories Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{analytics?.totalMinutesRead || 0} min</Text>
          <Text style={styles.statLabel}>Time Reading</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>{analytics?.averageAccuracy || 0}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{analytics?.currentStreak || 0} days</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <ProgressChart data={analytics?.weeklyData || [0, 0, 0, 0]} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {analytics?.recentSessions.slice(0, 5).map((session, index) => (
          <View key={index} style={styles.sessionCard}>
            <View style={styles.sessionIcon}>
              <Text style={styles.sessionEmoji}>📖</Text>
            </View>
            <View style={styles.sessionContent}>
              <Text style={styles.sessionTitle}>Story Session</Text>
              <Text style={styles.sessionDate}>
                {new Date(session.startedAt).toLocaleDateString()}
              </Text>
            </View>
            {session.completedAt && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Complete</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text style={styles.insightText}>
            Great progress this week! Your child completed {analytics?.weeklyData[3] || 0}{' '}
            stories.
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🌟</Text>
          <Text style={styles.insightText}>
            Reading accuracy is at {analytics?.averageAccuracy || 0}%. Keep practicing!
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📥 Download Full Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { fontSize: 16, color: '#3B82F6', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  loadingText: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 100 },
  statsGrid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionEmoji: { fontSize: 24 },
  sessionContent: { flex: 1 },
  sessionTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  sessionDate: { fontSize: 12, color: '#6B7280' },
  completedBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  

---

# FRONTEND

# 🚀 FULL AUTO-BUILD MODE - STAGE 14 PARENT ANALYTICS DASHBOARD

**Building Stage 14 from scratch, then auto-continuing through all remaining stages...**

---

## STAGE 14: PARENT ANALYTICS DASHBOARD

**What I'm building:**
- Parent dashboard screen with reading analytics
- Weekly progress charts and visualizations
- Reading session history tracking
- Analytics API endpoints with streak calculation
- Insights and report export functionality

---

---EXECUTION PLAN---

COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/backend/src/routes
mkdir -p /home/marshall/projects/brainy-builds/components
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)

FILES:
/home/marshall/projects/brainy-builds/backend/src/routes/analytics.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:userId/analytics', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await prisma.readingSession.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { startedAt: 'desc' },
      take: 30,
    });

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

    const storiesCompleted = sessions.filter((s) => s.completedAt).length;
    const averageAccuracy =
      sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length || 0;

    const weeklyData = getWeeklyBreakdown(sessions);
    const currentStreak = calculateStreak(sessions);

    res.json({
      totalMinutesRead: Math.round(totalMinutesRead),
      storiesCompleted,
      averageAccuracy: Math.round(averageAccuracy),
      currentStreak,
      weeklyData,
      recentSessions: sessions.slice(0, 10),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

function getWeeklyBreakdown(sessions: any[]) {
  const weeks = [0, 0, 0, 0];
  const now = new Date();

  sessions.forEach((session) => {
    const sessionDate = new Date(session.startedAt);
    const weeksDiff = Math.floor(
      (now.getTime() - sessionDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    if (weeksDiff < 4 && session.completedAt) {
      weeks[weeksDiff]++;
    }
  });

  return weeks.reverse();
}

function calculateStreak(sessions: any[]) {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions
    .filter((s) => s.completedAt)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.startedAt);
    sessionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}

export default router;

/home/marshall/projects/brainy-builds/app/\(main\)/parent-dashboard.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../_layout';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import ProgressChart from '../../components/ProgressChart';

interface Analytics {
  totalMinutesRead: number;
  storiesCompleted: number;
  averageAccuracy: number;
  currentStreak: number;
  weeklyData: number[];
  recentSessions: any[];
}

export default function ParentDashboard() {
  const { session } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      if (!session?.user?.id) return;
      const response = await api.get(`/analytics/${session.user.id}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parent Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statValue}>{analytics?.storiesCompleted || 0}</Text>
          <Text style={styles.statLabel}>Stories Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{analytics?.totalMinutesRead || 0} min</Text>
          <Text style={styles.statLabel}>Time Reading</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>{analytics?.averageAccuracy || 0}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{analytics?.currentStreak || 0} days</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <ProgressChart data={analytics?.weeklyData || [0, 0, 0, 0]} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {analytics?.recentSessions.length === 0 ? (
          <Text style={styles.emptyText}>No reading sessions yet</Text>
        ) : (
          analytics?.recentSessions.slice(0, 5).map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionIcon}>
                <Text style={styles.sessionEmoji}>📖</Text>
              </View>
              <View style={styles.sessionContent}>
                <Text style={styles.sessionTitle}>Story Session</Text>
                <Text style={styles.sessionDate}>
                  {new Date(session.startedAt).toLocaleDateString()}
                </Text>
              </View>
              {session.completedAt && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Complete</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text style={styles.insightText}>
            Great progress this week! Your child completed {analytics?.weeklyData[3] || 0}{' '}
            stories.
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>🌟</Text>
          <Text style={styles.insightText}>
            Reading accuracy is at {analytics?.averageAccuracy || 0}%. Keep practicing!
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📥 Download Full Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { fontSize: 16, color: '#3B82F6', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  loadingText: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 100 },
  statsGrid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', padding: 20 },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionEmoji: { fontSize: 24 },
  sessionContent: { flex: 1 },
  sessionTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  sessionDate: { fontSize: 12, color: '#6B7280' },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: { fontSize: 12, color: '#059669', fontWeight: '600' },
  insightCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: { fontSize: 24, marginRight: 12 },
  insightText: { flex: 1, fontSize: 14, color: '#92400E', lineHeight: 20 },
  exportButton: { margin: 16, backgroundColor: '#3B82F6', padding: 16, borderRadius: 12 },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

/home/marshall/projects/brainy-builds/components/ProgressChart.tsx
import { View, Text, StyleSheet } from 'react-native';

interface ProgressChartProps {
  data: number[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const maxValue = Math.max(...data, 1);
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barColumn}>
              <View style={[styles.bar, { height: `${(value / maxValue) * 100}%` }]}>
                <Text style={styles.barValue}>{value}</Text>
              </View>
            </View>
            <Text style={styles.label}>{labels[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
    alignItems: 'flex-end',
  },
  barContainer: { alignItems: 'center', flex: 1 },
  barColumn: {
    width: '100%',
    height: '85%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barValue: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  label: { fontSize: 11, color: '#6B7280', marginTop: 8, textAlign: 'center' },
});

/home/marshall/projects/brainy-builds/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import analyticsRoutes from './routes/analytics';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);