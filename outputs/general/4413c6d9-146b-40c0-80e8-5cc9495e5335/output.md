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
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
/home/marshall/projects/brainy-builds/components/profile/AvatarSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/GradeSelector.tsx
/home/marshall/projects/brainy-builds/components/profile/ProfileHeader.tsx
/home/marshall/projects/brainy-builds/components/story/ProgressBar.tsx
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

# 🎮 STAGE 13: WORD GAMES & VOCABULARY CHALLENGES

Building fun mini-games to reinforce vocabulary and comprehension from the stories.

**What this creates:**
- Word matching game (match word to definition)
- Fill-in-the-blank sentences from story
- Vocabulary quiz after each story completion
- Points earned for correct answers
- "Practice Mode" to review past story words

**Technical approach:**
- Extract key vocabulary from each story
- Quiz component with multiple choice answers
- Track vocabulary mastery in database
- Award bonus points for perfect scores

---

⚡ **3 files only:**
1. `app/(main)/vocabulary.tsx` - Vocabulary game screen
2. `lib/vocabularyGame.ts` - Game logic and scoring
3. `components/VocabularyQuiz.tsx` - Quiz UI component

---

**Features:**
- 5 vocabulary words per story
- Multiple choice with 4 options
- Instant feedback (correct/incorrect)
- Earn 50 points per correct answer
- Review missed words at end

Say **yes** to build vocabulary games or **skip** to next stage.

💰 *Cost: $1.4446 (28 calls this session)*

---

# FRONTEND

# 🎮 STAGE 13: INTERACTIVE MINI-GAMES

Building fun educational games that reinforce reading comprehension and vocabulary.

**What this creates:**
- Word matching game (match words to definitions)
- Sentence scramble (put words in correct order)
- Multiple choice comprehension quiz
- Games unlock after completing stories
- Earn bonus points for perfect scores

**Implementation:**
- 3 game screens in `app/(main)/games/` folder
- Game state management with scoring
- Integration with existing points system

---

**Ready to build?** Say **yes** to create mini-games or **cancel** to skip.

💰 *Cost: $1.4417 (28 calls this session)*

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)/games

FILES:
/home/marshall/projects/brainy-builds/app/(main)/games/word-match.tsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

interface WordPair {
  word: string;
  definition: string;
}

const gamePairs: WordPair[] = [
  { word: 'architect', definition: 'A person who designs buildings' },
  { word: 'foundation', definition: 'The base that supports a building' },
  { word: 'blueprint', definition: 'A detailed plan or drawing' },
  { word: 'structure', definition: 'Something that has been built' },
];

export default function WordMatchGame() {
  const router = useRouter();
  const [words, setWords] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffledWords = [...gamePairs.map(p => p.word)].sort(() => Math.random() - 0.5);
    const shuffledDefs = [...gamePairs.map(p => p.definition)].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setDefinitions(shuffledDefs);
  }, []);

  const handleWordPress = (word: string) => {
    if (matched.includes(word)) return;
    setSelectedWord(word);
    if (selectedDef) checkMatch(word, selectedDef);
  };

  const handleDefPress = (def: string) => {
    if (matched.some(w => gamePairs.find(p => p.word === w)?.definition === def)) return;
    setSelectedDef(def);
    if (selectedWord) checkMatch(selectedWord, def);
  };

  const checkMatch = (word: string, def: string) => {
    const pair = gamePairs.find(p => p.word === word && p.definition === def);
    if (pair) {
      setMatched([...matched, word]);
      setScore(score + 100);
      setSelectedWord(null);
      setSelectedDef(null);
      if (matched.length + 1 === gamePairs.length) {
        setTimeout(() => Alert.alert('Great Job!', `You scored ${score + 100} points!`, [
          { text: 'Back to Dashboard', onPress: () => router.back() }
        ]), 500);
      }
    } else {
      Alert.alert('Not a match', 'Try again!');
      setSelectedWord(null);
      setSelectedDef(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Word Match</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <Text style={styles.instructions}>Match each word with its definition</Text>

      <View style={styles.gameArea}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Words</Text>
          {words.map(word => (
            <TouchableOpacity
              key={word}
              style={[
                styles.card,
                selectedWord === word && styles.selectedCard,
                matched.includes(word) && styles.matchedCard
              ]}
              onPress={() => handleWordPress(word)}
              disabled={matched.includes(word)}
            >
              <Text style={styles.cardText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>Definitions</Text>
          {definitions.map(def => {
            const isMatched = matched.some(w => gamePairs.find(p => p.word === w)?.definition === def);
            return (
              <TouchableOpacity
                key={def}
                style={[
                  styles.card,
                  selectedDef === def && styles.selectedCard,
                  isMatched && styles.matchedCard
                ]}
                onPress={() => handleDefPress(def)}
                disabled={isMatched}
              >
                <Text style={styles.cardText}>{def}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  score: { fontSize: 20, fontWeight: 'bold', color: '#3B82F6' },
  instructions: { fontSize: 16, color: '#6B7280', marginBottom: 20, textAlign: 'center' },
  gameArea: { flex: 1, flexDirection: 'row', gap: 12 },
  column: { flex: 1 },
  columnTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  selectedCard: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  matchedCard: { borderColor: '#10B981', backgroundColor: '#D1FAE5', opacity: 0.6 },
  cardText: { fontSize: 14, color: '#111827', textAlign: 'center' },
  backButton: { backgroundColor: '#6B7280', padding: 16, borderRadius: 12, marginTop: 20 },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

/home/marshall/projects/brainy-builds/app/(main)/games/sentence-scramble.tsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

const sentences = [
  { original: 'The architect designed a beautiful school', words: ['The', 'architect', 'designed', 'a', 'beautiful', 'school'] },
  { original: 'Students learn in bright classrooms', words: ['Students', 'learn', 'in', 'bright', 'classrooms'] },
  { original: 'The library has many books', words: ['The', 'library', 'has', 'many', 'books'] },
];

export default function SentenceScrambleGame() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadSentence();
  }, [currentIndex]);

  const loadSentence = () => {
    const sentence = sentences[currentIndex];
    const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
    setScrambledWords(shuffled);
    setSelectedWords([]);
  };

  const handleWordPress = (word: string) => {
    setSelectedWords([...selectedWords, word]);
    setScrambledWords(scrambledWords.filter(w => w !== word));
  };

  const handleRemoveWord = (index: number) => {
    const word = selectedWords[index];
    setScrambledWords([...scrambledWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const userSentence = selectedWords.join(' ');
    const correctSentence = sentences[currentIndex].original;
    
    if (userSentence === correctSentence) {
      setScore(score + 150);
      Alert.alert('Correct!', 'Great job!', [
        { text: 'Next', onPress: () => {
          if (currentIndex < sentences.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            Alert.alert('Game Complete!', `Final Score: ${score + 150} points`, [
              { text: 'Back', onPress: () => router.back() }
            ]);
          }
        }}
      ]);
    } else {
      Alert.alert('Not quite right', 'Try again!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sentence Scramble</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <Text style={styles.instructions}>Put the words in the correct order</Text>
      <Text style={styles.progress}>Sentence {currentIndex + 1} of {sentences.length}</Text>

      <View style={styles.answerArea}>
        <Text style={styles.label}>Your sentence:</Text>
        <View style={styles.answerBox}>
          {selectedWords.length === 0 ? (
            <Text style={styles.placeholder}>Tap words below to build your sentence</Text>
          ) : (
            <View style={styles.wordRow}>
              {selectedWords.map((word, index) => (
                <TouchableOpacity key={index} onPress={() => handleRemoveWord(index)}>
                  <Text style={styles.selectedWord}>{word} </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.wordBank}>
        <Text style={styles.label}>Available words:</Text>
        <View style={styles.wordRow}>
          {scrambledWords.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordButton}
              onPress={() => handleWordPress(word)}
            >
              <Text style={styles.wordButtonText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, selectedWords.length === 0 && styles.disabledButton]}
        onPress={checkAnswer}
        disabled={selectedWords.length === 0}
      >
        <Text style={styles.checkButtonText}>Check Answer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  score: { fontSize: 20, fontWeight: 'bold', color: '#3B82F6' },
  instructions: { fontSize: 16, color: '#6B7280', marginBottom: 8, textAlign: 'center' },
  progress: { fontSize: 14, color: '#6B7280', marginBottom: 24, textAlign: 'center' },
  answerArea: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 24, minHeight: 100 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  answerBox: { minHeight: 60 },
  placeholder: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectedWord: { fontSize: 18, color: '#111827', fontWeight: '500' },
  wordBank: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 24 },
  wordButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, margin: 4 },
  wordButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  checkButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, marginBottom: 12 },
  disabledButton: { backgroundColor: '#D1D5DB' },
  checkButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  backButton: { backgroundColor: '#6B7280', padding: 16, borderRadius: 12 },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
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
      