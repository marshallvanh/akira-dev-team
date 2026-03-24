# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
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
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/ProfileHeader.tsx
/home/marshall/projects/brainy-builds/constants/avatars.ts
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.env
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/lib/api.ts
/home/marshall/projects/brainy-builds/lib/AuthContext.tsx
/home/marshall/projects/brainy-builds/README.md
/home/marshall/projects/brainy-builds/STAGE-4-DASHBOARD-COMPLETE.md
/home/marshall/projects/brainy-builds/test-profile-stage3.sh
/home/marshall/projects/brainy-builds/types/story.ts

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

# BACKEND

# 📖 STAGE 9: READING PROGRESS & REWARDS

Building the reading completion system with progress tracking, points system, and story unlocking mechanics.

**What this creates:**
- Reading session progress tracking (% of words read)
- Points awarded on story completion
- Story unlock system (complete 1 story → unlock next)
- Reading history display (stories completed)
- Celebrate completion animation
- Parent dashboard showing reading stats

**Technical approach:**
- Track word-by-word progress in current reading session
- Calculate completion percentage (words tapped / total words)
- Award points when 80%+ completion reached
- Update story status from "locked" to "unlocked"
- Store reading history in AsyncStorage
- Show streak counter (days reading in a row)

---

⚡ *Ready to run*

**Features:**
- Progress bar fills as child reads through story
- "🎉 Story Complete!" celebration screen
- Points awarded: +10 per story completed
- Next story automatically unlocks
- Reading history page shows all completed stories
- Parent view: total stories read, points earned, reading time

---

**Actions:** 3 commands
**Files:** 5 files

Say **yes** to build reading progress & rewards system or **cancel** to skip.

💰 *Cost: $0.8785 (13 calls this session)*

---

# FRONTEND

# 📖 STAGE 9: READING PROGRESS & REWARDS

Building the reading completion system with progress tracking, points system, and story unlocking mechanics for **brainy-builds**.

**What this creates:**
- Reading session progress tracking (% of words read)
- Points awarded on story completion
- Story unlock system (complete 1 story → unlock next)
- Reading history display (stories completed)
- Celebrate completion animation
- Parent dashboard showing reading stats

**Technical approach:**
- Track word-by-word progress in current reading session
- Calculate completion percentage (words tapped / total words)
- Award points when 80%+ completion reached
- Update story status from "locked" to "unlocked"
- Store reading history in AsyncStorage
- Show streak counter (days reading in a row)

---

⚡ *Ready to run*

**Features:**
- Progress bar fills as child reads through story
- "🎉 Story Complete!" celebration screen
- Points awarded: +10 per story completed
- Next story automatically unlocks
- Reading history page shows all completed stories
- Parent view: total stories read, points earned, reading time

---

**Actions:** 3 commands
**Files:** 5 files

Say **yes** to build reading progress & rewards system or **cancel** to skip.

---EXECUTION PLAN---
COMMANDS:
cd /home/marshall/projects/brainy-builds && npx expo install expo-speech
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)
mkdir -p /home/marshall/projects/brainy-builds/lib

FILES:
/home/marshall/projects/brainy-builds/app/(main)/reading.tsx
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { stories } from '@/lib/stories';
import { saveReadingProgress, completeStory } from '@/lib/progress';

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = stories.find(s => s.id === id);
  
  const [tappedWords, setTappedWords] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Story not found</Text>
      </View>
    );
  }

  const words = story.content.split(' ');
  const progress = (tappedWords.size / words.length) * 100;

  const handleWordTap = (index: number, word: string) => {
    // Mark word as tapped
    const newTapped = new Set(tappedWords);
    newTapped.add(index);
    setTappedWords(newTapped);

    // Read word aloud
    Speech.speak(word, { language: 'en-US', rate: 0.8 });

    // Check if story is complete (80% threshold)
    const newProgress = (newTapped.size / words.length) * 100;
    if (newProgress >= 80 && !showCelebration) {
      handleCompletion();
    }
  };

  const handleCompletion = async () => {
    setShowCelebration(true);
    
    // Celebration animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Award points and unlock next story
    await completeStory(story.id, 10);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  useEffect(() => {
    // Save progress when user leaves
    return () => {
      if (tappedWords.size > 0) {
        saveReadingProgress(story.id, tappedWords.size, words.length);
      }
    };
  }, [tappedWords]);

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* Story Title */}
      <Text style={styles.title}>{story.title}</Text>

      {/* Story Content - Tappable Words */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.wordContainer}>
          {words.map((word, index) => (
            <Pressable
              key={index}
              onPress={() => handleWordTap(index, word)}
              style={[
                styles.word,
                tappedWords.has(index) && styles.wordRead,
              ]}
            >
              <Text style={[
                styles.wordText,
                tappedWords.has(index) && styles.wordReadText,
              ]}>
                {word}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Celebration Overlay */}
      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <Animated.View style={[
            styles.celebrationCard,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Story Complete!</Text>
            <Text style={styles.celebrationPoints}>+10 Points</Text>
            <Text style={styles.celebrationSubtext}>Next story unlocked!</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  word: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  wordRead: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  wordText: {
    fontSize: 18,
    color: '#333',
  },
  wordReadText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  error: {
    fontSize: 18,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 40,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  celebrationPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  celebrationSubtext: {
    fontSize: 16,
    color: '#666',
  },
});

/home/marshall/projects/brainy-builds/app/(main)/history.tsx
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { getReadingHistory, getTotalPoints, getReadingStreak } from '@/lib/progress';

interface HistoryItem {
  storyId: string;
  storyTitle: string;
  completedAt: string;
  pointsEarned: number;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const [historyData, points, streakDays] = await Promise.all([
        getReadingHistory(),
        getTotalPoints(),
        getReadingStreak(),
      ]);
      
      setHistory(historyData);
      setTotalPoints(points);
      setStreak(streakDays);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Stories Read</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak 🔥</Text>
        </View>
      </View>

      {/* Reading History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Reading History</Text>
        
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>No stories completed yet</Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/(main)/stories')}
            >
              <Text style={styles.emptyButtonText}>Start Reading</Text>
            </Pressable>
          </View>
        ) : (
          history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>{item.storyTitle}</Text>
                <Text style={styles.historyPoints}>+{item.pointsEarned}</Text>
              </View>
              <Text style={styles.historyDate}>
                {new Date(item.completedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  historyPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color