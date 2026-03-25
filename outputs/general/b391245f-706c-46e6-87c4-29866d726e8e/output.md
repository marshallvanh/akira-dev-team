# BACKEND

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
--- backend/prisma/seed.ts ---
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
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  console.log('✅ Achievements seeded');

  // Seed rewards
  const rewardsData = [
    {
      name: 'Golden Brick',
      description: 'A shiny golden brick for your school',
      icon: '🧱',
      category: 'building',
      cost: 100,
    },
    {
      name: 'Stone Block',
      description: 'A solid stone block for construction',
      icon: '🪨',
      category: 'building',
      cost: 80,
    },
    {
      name: 'Wooden Plank',
      description: 'Quality wood for building',
      icon: '🪵',
      category: 'building',
      cost: 60,
    },
    {
      name: 'Glass Window',
      description: 'A beautiful glass window',
      icon: '🪟',
      category: 'building',
      cost: 150,
    },
    {
      name: 'Door',
      description: 'An entrance door',
      icon: '🚪',
      category: '

--- backend/package.json ---
{
  "name": "brainy-builds-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.6",
    "prisma": "^5.8.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}

--- backend/prisma/schema.prisma ---
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  profile   Profile?
  sessions  Session[]
  progress  Progress[]
  achievements UserAchievement[]
  rewards   UserReward[]
}

model Profile {
  id         Int      @id @default(autoincrement())
  userId     Int      @unique
  user       User     @relation(fields: [userId], references: [id])
  name       String
  grade      Int
  schoolName String
  avatarId   String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Session {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Progress {
  id            Int      @id @default(autoincrement())
  userId        Int
  user          User     @relation(fields: [userId], references: [id])
  week          Int
  wordsRead     Int      @default(0)
  totalWords    Int
  completed     Boolean  @default(false)
  accuracyScore Float?
  completedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Achievement {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String
  icon        String
  category    String
  requirement String
  points      Int
  createdAt   DateTime @default(now())
  users       UserAchievement[]
}

model UserAchievement {
  id            Int         @id @default(autoincrement())
  userId        Int
  user          User        @relation(fields: [userId], references: [id])
  achievementId Int
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  unlockedAt    DateTime    @default(now())

  @@unique([userId, achievementId])
}

model Reward {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String
  icon        String
  category    String
  cost        Int
  createdAt   DateTime @default(now())
  users       UserReward[]
}

model UserReward {
  id          Int      @id @default(autoincrement())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  rewardId    Int
  reward      Reward   @relation(fields: [rewardId], references: [id])
  purchasedAt DateTime @default(now())

  @@unique([userId, rewardId])
}

=== SUMMARY ===
Files found: 3
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

# 🎯 STAGE 19: Complete Database Seed + Add Package Script

Great progress! The backend controllers and routes are built and compiled. Now we need to:

1. **Complete the seed.ts file** (it was truncated)
2. **Add seed script to package.json**
3. **Run the seed to populate database**

---

## WHAT'S MISSING

The `seed.ts` file is incomplete. It stops mid-line at:
```typescript
{
  name: 'Door',
  description: 'An entrance door',
  icon: '🚪',
  category: '
```

We need to:
- Complete the rewards array (12 total rewards)
- Add the upsert logic for rewards
- Add the main() call and error handling
- Update package.json with seed script
- Run the seed

---

## DELIVERABLES

✅ Complete seed.ts with 12 rewards
✅ Add `prisma:seed` script to package.json
✅ Seed the database with achievements + rewards
✅ Verify compilation still works

---

---EXECUTION PLAN---
FILES:
/home/marshall/projects/brainy-builds/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const achiev