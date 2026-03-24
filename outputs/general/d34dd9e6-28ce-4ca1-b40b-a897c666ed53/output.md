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

# TETSUO

```csv
path,line,col,code,message,explanation
/home/marshall/projects/brainy-builds/types/story.ts,0,0,UPDATE,"Adding audio and reading tracking types","Enhanced Story interface with audio URL, word tracking, and completion state"
/home/marshall/projects/brainy-builds/app/(main)/story.tsx,0,0,CREATE,"Creating enhanced story reader screen","Interactive story with tap-to-highlight, progress tracking, and read-aloud mode"
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx,0,0,UPDATE,"Adding story route to navigation","Register new story screen in main layout"
/home/marshall/projects/brainy-builds/app/(main)/index.tsx,0,0,UPDATE,"Updating story card navigation","Point to new enhanced story screen"
```

---EXECUTION PLAN---
COMMANDS:
```bash
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)
npx expo install expo-speech
```

FILES:
```typescript
<<<<<<< FILEPATH: /home/marshall/projects/brainy-builds/types/story.ts >>>>>>>
export interface Story {
  id: number;
  weekNumber: number;
  title: string;
  content: string;
  words: string[];
  audioUrl?: string;
  pointsReward: number;
  readingLevel: number;
}

export interface ReadingProgress {
  storyId: number;
  wordsHighlighted: Set<number>;
  percentComplete: number;
  hasCompletedReading: boolean;
  hasListenedToAudio: boolean;
}

export interface WordHighlight {
  index: number;
  word: string;
  isHighlighted: boolean;
}
<<<<<<< FILEPATH: /home/marshall/projects/brainy-builds/app/(main)/story.tsx >>>>>>>
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Story, ReadingProgress, WordHighlight } from '../../types/story';

const SAMPLE_STORY: Story = {
  id: 1,
  weekNumber: 1,
  title: 'The Amazing School Builder',
  content: `Once upon a time, in a small town called Brightville, there lived a young builder named Sam. Sam loved to build things with blocks, wood, and even cardboard boxes.

One day, the mayor of Brightville came to Sam with a very special request. "Sam," said the mayor, "our town needs a new school. All the children need a place to learn and grow. Can you help us build it?"

Sam's eyes lit up with excitement. "A whole school? That would be amazing! I'll do my best!" Sam gathered tools, made careful plans, and started working right away.

First, Sam built the strong foundation. "Every great building needs a solid base," Sam said while mixing concrete and laying bricks. The foundation took three whole days to complete, but Sam knew it was important to do it right.

Next came the walls. Sam carefully measured each wall to make sure they were straight and tall. "Walls keep us safe and warm," Sam explained to the curious children who came to watch. The walls were painted bright yellow to make everyone feel happy.

Then Sam added big windows so sunlight could fill the classrooms. "Natural light helps students learn better," Sam said with a smile. Each window was placed perfectly to catch the morning sun.

After the windows came the roof. Sam climbed high on scaffolding to place each shingle carefully. "A good roof protects everything inside from rain and snow," Sam told the workers. The roof was painted red, making the school easy to spot from far away.

Inside, Sam built strong desks, tall bookshelves, and even a special reading corner with soft cushions. "Every child deserves a comfortable place to read and learn," Sam said while arranging the furniture.

Finally, after weeks of hard work, the school was complete. The mayor, parents, and children all gathered for the grand opening. Everyone cheered when they saw what Sam had built.

"Thank you, Sam!" shouted the children. "This is the best school ever!" Sam felt proud, knowing that this building would help many children learn and grow for years to come.

From that day on, Sam continued building wonderful things for Brightville. But the school always remained Sam's favorite project, because it was built with care, patience, and love for learning.`,
  words: [],
  pointsReward: 250,
  readingLevel: 3,
};

export default function StoryScreen() {
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [wordHighlights, setWordHighlights] = useState<WordHighlight[]>([]);
  const [progress, setProgress] = useState<ReadingProgress>({
    storyId: 1,
    wordsHighlighted: new Set(),
    percentComplete: 0,
    hasCompletedReading: false,
    hasListenedToAudio: false,
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    loadStory();
    return () => {
      Speech.stop();
    };
  }, []);

  const loadStory = () => {
    const words = SAMPLE_STORY.content
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    const highlights: WordHighlight[] = words.map((word, index) => ({
      index,
      word: word.replace(/[.,!?;:]/g, ''),
      isHighlighted: false,
    }));

    setStory({ ...SAMPLE_STORY, words });
    setWordHighlights(highlights);
  };

  const handleWordTap = (index: number) => {
    if (progress.hasCompletedReading || isPlayingAudio) return;

    setWordHighlights(prev =>
      prev.map(h =>
        h.index === index ? { ...h, isHighlighted: true } : h
      )
    );

    const newHighlighted = new Set(progress.wordsHighlighted);
    newHighlighted.add(index);

    const percentComplete = (newHighlighted.size / wordHighlights.length) * 100;
    const hasCompleted = percentComplete >= 80;

    setProgress({
      ...progress,
      wordsHighlighted: newHighlighted,
      percentComplete: Math.round(percentComplete),
      hasCompletedReading: hasCompleted,
    });

    if (hasCompleted && !progress.hasCompletedReading) {
      setTimeout(() => {
        Alert.alert(
          '🎉 Great Reading!',
          `You've read ${Math.round(percentComplete)}% of the story! Now you can listen to it being read aloud.`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }, 500);
    }
  };

  const handleReadAloud = async () => {
    if (!story || !progress.hasCompletedReading) return;

    if (isPlayingAudio) {
      Speech.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    
    const sentences = story.content
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 0);

    for (let i = 0; i < sentences.length; i++) {
      if (!isPlayingAudio) break;

      await new Promise<void>((resolve) => {
        Speech.speak(sentences[i], {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.85,
          onDone: () => resolve(),
          onStopped: () => resolve(),
          onError: () => resolve(),
        });
      });
    }

    setIsPlayingAudio(false);
    setProgress({ ...progress, hasListenedToAudio: true });
  };

  const handleComplete = () => {
    Alert.alert(
      '⭐ Story Complete!',
      `You earned ${story?.pointsReward || 0} points for reading and listening!`,
      [
        {
          text: 'Back to Dashboard',
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  const paragraphs = story.content.split('\n\n');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{progress.percentComplete}%</Text>
        </View>
      </View>

      <View style={styles.titleCard}>
        <Text style={styles.weekBadge}>Week {story.weekNumber}</Text>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.subtitle}>Tap each word as you read</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress.percentComplete}%` }]} />
      </View>

      <ScrollView style={styles.storyContainer} contentContainerStyle={styles.storyContent}>
        {paragraphs.map((paragraph, pIndex) => {
          const paragraphWords = paragraph.split(/\s+/).filter(w => w.length > 0);
          const startIndex = paragraphs
            .slice(0, pIndex)
            .reduce((acc, p) => acc + p.split(/\s+/).filter(w => w.length > 0).length, 0);

          return (
            <View key={pIndex} style={styles.paragraph}>
              {paragraphWords.map((word, wIndex) => {
                const globalIndex = startIndex + wIndex;
                const highlight = wordHighlights[globalIndex];
                
                return (
                  <TouchableOpacity
                    key={globalIndex}
                    onPress={() => handleWordTap(globalIndex)}
                    disabled={progress.hasCompletedReading || isPlayingAudio}
                  >
                    <Text
                      style={[
                        styles.word,
                        highlight?.isHighlighted && styles.wordHighlighted,
                      ]}
                    >
                      {word}{' '}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.controls}>
        {progress.hasCompletedReading && (
          <TouchableOpacity
            style={[styles.audioButton, isPlayingAudio && styles.audioButtonPlaying]}
            onPress={handleReadAloud}
          >
            <Text style={styles.audioButtonText}>
              {isPlayingAudio ? '⏸️ Pause Reading' : '🔊 Read Aloud'}
            </Text>
          </TouchableOpacity>
        )}

        {progress.hasCompletedReading && progress.hasListenedToAudio && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>
              ✓ Complete Story (+{story.pointsReward} pts)
            </Text>
          </TouchableOpacity>
        )}

        {!progress.hasCompletedReading && (
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>
              📖 Tap each word as you read to track your progress
            </Text>
          </View>
        )}
      </View>
    </View>
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
  progressContainer: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 100,
  },
  titleCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    alignItems: 'center',
  },
  weekBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  storyContainer: {
    flex: 1,
  },
  storyContent: {
    padding: 20,
  },
  paragraph: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  word: {
    fontSize: 18,
    lineHeight: 32,
    color: '#111827',
  },
  wordHighlighted: {
    backgroundColor: '#FDE047',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  controls: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  audioButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  audioButtonPlaying: {
    backgroundColor: '#EF4444',
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  instructionText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '600',
  },
});

---

# BACKEND

```csv
path,line,col,code,message,explanation
/home/marshall/projects/brainy-builds/app/(main)/story.tsx,0,0,CREATE,"Creating enhanced story reader screen","Interactive story with tap-to-highlight words and read-aloud feature"
/home/marshall/projects/brainy-builds/types/story.ts,0,0,UPDATE,"Adding audio and interaction types","Adding Story, WordState, and ReadingProgress interfaces"
/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx,0,0,UPDATE,"Adding story route to navigation","Registering story screen in navigation stack"
/home/marshall/projects/brainy-builds/app/(main)/index.tsx,0,0,UPDATE,"Fixing story navigation link","Updating story card to navigate to /story route"
```

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/brainy-builds/app/\(main\)
mkdir -p /home/marshall/projects/brainy-builds/types

FILES:
/home/marshall/projects/brainy-builds/types/story.ts
export interface Story {
  id: number;
  title: string;
  content: string;
  wordCount: number;
  readingTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface WordState {
  word: string;
  index: number;
  highlighted: boolean;
  isCurrentAudio: boolean;
}

export interface ReadingProgress {
  wordsRead: number;
  totalWords: number;
  percentComplete: number;
  readAloudUnlocked: boolean;
  completed: boolean;
}

/home/marshall/projects/brainy-builds/app/(main)/story.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Story, WordState, ReadingProgress } from '../../types/story';

const SAMPLE_STORY: Story = {
  id: 1,
  title: 'The Amazing School Builder',
  content: `Once upon a time, in a small town called Brightville, there lived a young builder named Alex. Alex loved building things more than anything else in the world. Every day after school, Alex would rush home to work on projects in the garage.

One morning, Alex woke up with an amazing idea. "I'm going to build the best school ever!" Alex exclaimed. This school would be different from any other school. It would have a library filled with thousands of books, a giant playground with swings that reached the clouds, and classrooms with windows so big you could see the whole town.

Alex started drawing plans. The school needed strong walls, a sturdy roof, and floors that could hold hundreds of students. Alex measured twice and cut once, just like Dad always said. The first step was laying the foundation. Alex dug deep into the ground and poured concrete to make the base strong.

Next came the walls. Brick by brick, Alex carefully stacked them, making sure each one was level. The walls grew taller each day. Neighbors would walk by and watch in amazement. "What a wonderful school!" they would say.

After the walls came the roof. Alex climbed up high on scaffolding and placed each shingle carefully. The roof needed to keep out rain and snow, so Alex made sure every piece fit perfectly together.

Inside the school, Alex built wide hallways where students could walk side by side with their friends. The classrooms had big desks and comfortable chairs. The library had tall shelves that reached the ceiling, waiting to be filled with adventure stories and science books.

The playground was Alex's favorite part. There were slides, swings, monkey bars, and even a sandbox for the younger kids. Alex tested each piece of equipment to make sure it was safe and fun.

Finally, after many weeks of hard work, the school was complete. On opening day, children from all over town came to see it. They ran through the hallways, picked books from the library, and played on every piece of playground equipment.

The mayor of Brightville gave Alex a special medal. "Thank you for building such an amazing school," the mayor said. "You've given our children a wonderful place to learn and grow."

Alex smiled proudly. Building the school had been hard work, but seeing all the happy children made every moment worth it. That night, Alex fell asleep dreaming of the next big project to build.`,
  wordCount: 420,
  readingTimeMinutes: 4,
  difficulty: 'medium',
  points: 200,
};

export default function StoryScreen() {
  const router = useRouter();
  const [words, setWords] = useState<WordState[]>([]);
  const [progress, setProgress] = useState<ReadingProgress>({
    wordsRead: 0,
    totalWords: 0,
    percentComplete: 0,
    readAloudUnlocked: false,
    completed: false,
  });
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    loadStory();
    return () => {
      Speech.stop();
    };
  }, []);

  const loadStory = () => {
    const wordArray = SAMPLE_STORY.content.split(/\s+/);
    const initialWords: WordState[] = wordArray.map((word, index) => ({
      word,
      index,
      highlighted: false,
      isCurrentAudio: false,
    }));

    setWords(initialWords);
    setProgress({
      wordsRead: 0,
      totalWords: initialWords.length,
      percentComplete: 0,
      readAloudUnlocked: false,
      completed: false,
    });
  };

  const handleWordTap = (index: number) => {
    if (isReading) return;

    const updatedWords = [...words];
    if (!updatedWords[index].highlighted) {
      updatedWords[index].highlighted = true;
      setWords(updatedWords);

      const wordsRead = updatedWords.filter(w => w.highlighted).length;
      const percentComplete = Math.round((wordsRead / words.length) * 100);
      const readAloudUnlocked = percentComplete >= 80;

      setProgress({
        wordsRead,
        totalWords: words.length,
        percentComplete,
        readAloudUnlocked,
        completed: readAloudUnlocked,
      });
    }
  };

  const handleReadAloud = async () => {
    if (!progress.readAloudUnlocked) {
      Alert.alert('Keep Reading!', 'Tap at least 80% of the words to unlock Read Aloud mode.');
      return;
    }

    setIsReading(true);

    const sentences = SAMPLE_STORY.content.split(/[.!?]+/).filter(s => s.trim());
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;

      const sentenceWords = sentence.split(/\s+/);
      const startIndex = words.findIndex(w => 
        sentenceWords[0] && w.word.includes(sentenceWords[0])
      );

      if (startIndex >= 0) {
        for (let j = 0; j < sentenceWords.length; j++) {
          const wordIndex = startIndex + j;
          if (wordIndex < words.length) {
            setWords(prev => prev.map((w, idx) => ({
              ...w,
              isCurrentAudio: idx === wordIndex,
            })));
          }

          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }

      await Speech.speak(sentence, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.85,
      });

      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setWords(prev => prev.map(w => ({ ...w, isCurrentAudio: false })));
    setIsReading(false);

    Alert.alert(
      '🎉 Story Complete!',
      `Great job reading! You earned ${SAMPLE_STORY.points} points!`,
      [
        {
          text: 'Back to Dashboard',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleStopReading = () => {
    Speech.stop();
    setIsReading(false);
    setWords(prev => prev.map(w => ({ ...w, isCurrentAudio: false })));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progress.percentComplete}% Read</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress.percentComplete}%` }]} />
      </View>

      <View style={styles.storyHeader}>
        <Text style={styles.storyTitle}>{SAMPLE_STORY.title}</Text>
        <Text style={styles.storyMeta}>
          📖 {SAMPLE_STORY.wordCount} words • ⏱️ {SAMPLE_STORY.readingTimeMinutes} min read • ⭐ {SAMPLE_STORY.points} points
        </Text>
      </View>

      <ScrollView style={styles.storyContent} contentContainerStyle={styles.storyContentContainer}>
        <View style={styles.wordsContainer}>
          {words.map((wordState, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleWordTap(index)}
              disabled={isReading}
              style={styles.wordWrapper}
            >
              <Text
                style={[
                  styles.word,
                  wordState.highlighted && styles.wordHighlighted,
                  wordState.isCurrentAudio && styles.wordAudioHighlight,
                ]}
              >
                {wordState.word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.controls}>
        {!progress.readAloudUnlocked && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              💡 Tap words as you read to unlock Read Aloud mode
            </Text>
          </View>
        )}
        {progress.readAloudUnlocked && !isReading && (
          <TouchableOpacity style={styles.readAloudButton} onPress={handleReadAloud}>
            <Text style={styles.readAloudText}>🔊 Read Aloud</Text>
          </TouchableOpacity>
        )}
        {isReading && (
          <TouchableOpacity style={styles.stopButton} onPress={handleStopReading}>
            <Text style={styles.stopText}>⏹️ Stop Reading</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  progressContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  storyHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  storyMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  storyContent: {
    flex: 1,
  },
  storyContentContainer: {
    padding: 20,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  wordWrapper: {
    marginRight: 4,
    marginBottom: 4,
  },
  word: {
    fontSize: 18,
    lineHeight: 28,
    color: '#111827',
  },
  wordHighlighted: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  wordAudioHighlight: {
    backgroundColor: '#BFDBFE',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontWeight: '600',
  },
  controls: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  hintContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  hintText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '600',
  },
  readAloudButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  readAloudText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

/home/marshall/projects/brainy-builds/app/(main)/_layout.tsx
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
        name="story"
        options={{
          title: 'Story Time',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="puzzle"
        options={{
          title: 'Word Puzzle',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

/home/marshall/projects/brainy-builds/app/(main)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../_layout';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';

interface Profile {
  id: number;
  name: