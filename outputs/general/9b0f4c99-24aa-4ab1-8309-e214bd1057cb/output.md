# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/(auth)/profile-setup.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/app/(main)/index.tsx
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
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
          headerShown: true,
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
        <TouchableOpacity style={styles.storyCard} onPress={handleStoryPress}>
          <Text style={styles.storyIcon}>📖</Text>
          <View style={styles.storyContent}>
            <Text style={styles.storyTitle}>The Amazing School Builder</Text>
            <Text style={styles.storySubtitle}>Week 1 • Tap to read</Text>
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

# FRONTEND

# ✅ EXECUTION COMPLETE

**5 actions succeeded, 0 failed**

---

## 📁 Files Created

✅ **`/types/game.ts`** — Game type definitions (WordPuzzle, LetterTile, GameState)

✅ **`/app/(main)/puzzle.tsx`** — Complete word puzzle game screen with:
- Scrambled letter tiles (tap to add to answer)
- Answer zone (tap letters to remove)
- Hint system and point rewards
- Clear and Check buttons
- Score tracking across puzzles

✅ **`/app/(main)/index.tsx`** — Updated dashboard with puzzle game navigation card

---

## 🎮 What Kids Experience

1. **Dashboard** → Tap "Word Puzzle" card
2. **Puzzle Screen** → See hint and scrambled letters
3. **Tap Letters** → Build answer in answer zone
4. **Check Answer** → Get instant feedback
5. **Earn Points** → Correct answers add to score
6. **Next Puzzle** → Automatically loads next challenge

---

## 🧩 Game Mechanics

- 4 puzzles cycling (SCHOOL, BUILDER, LIBRARY, PLAYGROUND)
- Difficulty levels: easy (100pts), medium (150pts), hard (200pts)
- Visual feedback: purple tiles turn gray when used
- Answer zone: blue tiles, tap to remove
- Validation on "Check Answer" button press

---

## 📊 Next Stage: Enhanced Story Reader

**Building next:** Story screen where kids:
- Read 500-750 word AI-generated stories
- Tap each word to highlight it as they read
- Unlock "Read Aloud" mode after finishing
- Track reading progress and comprehension

This adds interactive reading mechanics and post-reading audio playback.

---

**Ready to build enhanced story reader?**

Say **yes** to continue or describe what you need changed.

💰 *Cost: $2.0127 (41 calls this session)*

---

# BACKEND

Understood. I'll build the word puzzle game first, then move on to building the enhanced story screen with tap-to-highlight and read-aloud features.

Let me complete the current execution plan first:

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)
mkdir -p /home/marshall/projects/brainy-builds/types

FILES:
/home/marshall/projects/brainy-builds/types/game.ts
export interface WordPuzzle {
  id: number;
  word: string;
  scrambled: string;
  hint: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LetterTile {
  letter: string;
  index: number;
  isPlaced: boolean;
}

export interface GameState {
  currentPuzzle: WordPuzzle | null;
  userAnswer: string[];
  availableLetters: LetterTile[];
  score: number;
  puzzlesSolved: number;
}

/home/marshall/projects/brainy-builds/app/(main)/puzzle.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { WordPuzzle, LetterTile, GameState } from '../../types/game';

const PUZZLES: WordPuzzle[] = [
  { id: 1, word: 'SCHOOL', scrambled: 'LOOCSH', hint: 'A place where you learn', points: 100, difficulty: 'easy' },
  { id: 2, word: 'BUILDER', scrambled: 'ILDUBRE', hint: 'Someone who constructs things', points: 150, difficulty: 'medium' },
  { id: 3, word: 'LIBRARY', scrambled: 'YRBRIAL', hint: 'A room with many books', points: 150, difficulty: 'medium' },
  { id: 4, word: 'PLAYGROUND', scrambled: 'DORNUGPLAY', hint: 'Where kids play outside', points: 200, difficulty: 'hard' },
];

export default function PuzzleScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzle: null,
    userAnswer: [],
    availableLetters: [],
    score: 0,
    puzzlesSolved: 0,
  });

  useEffect(() => {
    loadNextPuzzle();
  }, []);

  const loadNextPuzzle = () => {
    const nextPuzzle = PUZZLES[gameState.puzzlesSolved % PUZZLES.length];
    const letters: LetterTile[] = nextPuzzle.scrambled.split('').map((letter, index) => ({
      letter,
      index,
      isPlaced: false,
    }));

    setGameState({
      ...gameState,
      currentPuzzle: nextPuzzle,
      userAnswer: [],
      availableLetters: letters,
    });
  };

  const handleLetterPress = (tile: LetterTile) => {
    if (tile.isPlaced) return;

    setGameState({
      ...gameState,
      userAnswer: [...gameState.userAnswer, tile.letter],
      availableLetters: gameState.availableLetters.map(t =>
        t.index === tile.index ? { ...t, isPlaced: true } : t
      ),
    });
  };

  const handleRemoveLetter = (index: number) => {
    const letter = gameState.userAnswer[index];
    const tileIndex = gameState.availableLetters.findIndex(
      t => t.letter === letter && t.isPlaced
    );

    setGameState({
      ...gameState,
      userAnswer: gameState.userAnswer.filter((_, i) => i !== index),
      availableLetters: gameState.availableLetters.map((t, i) =>
        i === tileIndex ? { ...t, isPlaced: false } : t
      ),
    });
  };

  const handleCheck = () => {
    const answer = gameState.userAnswer.join('');
    if (answer === gameState.currentPuzzle?.word) {
      const newScore = gameState.score + (gameState.currentPuzzle?.points || 0);
      Alert.alert(
        '🎉 Correct!',
        `You earned ${gameState.currentPuzzle?.points} points!`,
        [
          {
            text: 'Next Puzzle',
            onPress: () => {
              setGameState({
                ...gameState,
                score: newScore,
                puzzlesSolved: gameState.puzzlesSolved + 1,
              });
              setTimeout(loadNextPuzzle, 100);
            },
          },
        ]
      );
    } else {
      Alert.alert('Try Again', 'That\'s not quite right. Keep trying!');
    }
  };

  const handleClear = () => {
    setGameState({
      ...gameState,
      userAnswer: [],
      availableLetters: gameState.availableLetters.map(t => ({ ...t, isPlaced: false })),
    });
  };

  if (!gameState.currentPuzzle) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{gameState.score}</Text>
        </View>
      </View>

      <View style={styles.puzzleInfo}>
        <Text style={styles.puzzleNumber}>Puzzle {gameState.puzzlesSolved + 1}</Text>
        <Text style={styles.hint}>💡 {gameState.currentPuzzle.hint}</Text>
        <Text style={styles.points}>Worth {gameState.currentPuzzle.points} points</Text>
      </View>

      <View style={styles.answerSection}>
        <Text style={styles.sectionTitle}>Your Answer:</Text>
        <View style={styles.answerZone}>
          {gameState.userAnswer.length === 0 ? (
            <Text style={styles.emptyText}>Tap letters below</Text>
          ) : (
            gameState.userAnswer.map((letter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.answerTile}
                onPress={() => handleRemoveLetter(index)}
              >
                <Text style={styles.answerLetter}>{letter}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      <View style={styles.lettersSection}>
        <Text style={styles.sectionTitle}>Available Letters:</Text>
        <View style={styles.lettersGrid}>
          {gameState.availableLetters.map((tile) => (
            <TouchableOpacity
              key={tile.index}
              style={[styles.letterTile, tile.isPlaced && styles.letterTileUsed]}
              onPress={() => handleLetterPress(tile)}
              disabled={tile.isPlaced}
            >
              <Text style={[styles.letterText, tile.isPlaced && styles.letterTextUsed]}>
                {tile.letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.checkButton, gameState.userAnswer.length === 0 && styles.checkButtonDisabled]}
          onPress={handleCheck}
          disabled={gameState.userAnswer.length === 0}
        >
          <Text style={styles.checkText}>Check Answer</Text>
        </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 100,
  },
  puzzleInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    alignItems: 'center',
  },
  puzzleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  hint: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  points: {
    fontSize: 14,
    color: '#6B7280',
  },
  answerSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  answerZone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  answerTile: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  answerLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lettersSection: {
    padding: 20,
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  letterTile: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  letterTileUsed: {
    backgroundColor: '#E5E7EB',
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  letterTextUsed: {
    color: '#9CA3AF',
  },
  controls: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkButton: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  checkButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  checkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

/home/marshall/projects/brainy-builds/app/(main)/index.tsx
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

      <TouchableOpacity 
        style={styles.storyCard}
        onPress={() => router.push('/(main)/story')}
      >
        <Text style={styles.storyIcon}>📖</Text>
        <View style={styles.storyContent}>
          <Text style={styles.storyBadge}>This Week's Story</Text>
          <Text style={styles.storyTitle}>The School Builder</Text>
          <Text style={styles.storySubtitle}>Tap to read with word highlighting</Text>
        </View>
        <Text style={styles.storyArrow}>→</Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.progressCard]}>
          