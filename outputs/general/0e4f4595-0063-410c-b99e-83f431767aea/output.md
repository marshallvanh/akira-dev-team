# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/README.md

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

=== SUMMARY ===
Files found: 1
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# BACKEND

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/(auth)/create-profile.tsx
/home/marshall/projects/brainy-builds/src/types/profile.ts
/home/marshall/projects/brainy-builds/supabase/migrations/001_create_profiles.sql
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts

=== EXISTING FILE CONTENTS ===

--- backend/src/routes/auth.ts ---
File exists but checking content...

--- backend/src/middleware/auth.ts ---
File not found - needs to be created

--- backend/src/server.ts ---
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

=== SUMMARY ===
- backend/src/routes/auth.ts exists (need to verify content)
- backend/src/middleware/auth.ts MISSING
- Server already imports auth routes

# Backend Stage 3: Auth Routes & Middleware

Creating authentication route handler and JWT middleware.

## What This Does

Creates two files only:
1. **backend/src/routes/auth.ts** - Registration and login endpoints
2. **backend/src/middleware/auth.ts** - JWT verification middleware

## Implementation Details

**auth.ts:**
- POST /register - Create new user account
- POST /login - Authenticate and issue JWT
- Uses bcrypt for password hashing
- Returns JWT token on success

**auth.ts middleware:**
- Verifies JWT tokens from Authorization header
- Adds user info to request object
- Returns 401 on invalid/missing tokens

Both files integrate with existing Prisma schema and server setup.

---

Say YES to create these 2 files.

💰 *Cost: $0.4170 (22 calls this session)*