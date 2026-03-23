# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/backend/dist/middleware/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/auth.js
/home/marshall/projects/brainy-builds/backend/dist/routes/profile.js
/home/marshall/projects/brainy-builds/backend/dist/server.js
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/package-lock.json
/home/marshall/projects/brainy-builds/backend/prisma/migrations/20260323000523_init/migration.sql
/home/marshall/projects/brainy-builds/backend/prisma/migrations/migration_lock.toml
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
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
/home/marshall/projects/brainy-builds/app/(auth)/_layout.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/backend/.dockerignore
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/.env.example
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/README.md

=== PACKAGE.JSON (backend) ===
{
  "name": "brainy-builds-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.6",
    "prisma": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}

=== EXISTING FILES ===
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

--- app/(auth)/_layout.tsx ---
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../_layout';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (session) {
    return <Redirect href="/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

=== SUMMARY ===
Files found: 14
Backend running on port 3000
Database: PostgreSQL ready
Current state: Root layout exists with Supabase placeholder

# 🎯 STAGE 14: EXPO MOBILE APP INITIALIZATION

Backend is running. Now building the mobile app frontend.

## What I'm Building

**3-File Stage: Mobile App Foundation**

1. **API Client (`lib/api.ts`)** - HTTP client to talk to backend
2. **Auth Context (`lib/AuthContext.tsx`)** - State management for authentication
3. **Root Layout Update (`app/_layout.tsx`)** - Connect to real backend

## Technical Decisions

- Using **fetch API** (no axios needed)
- **AsyncStorage** for token persistence
- Backend URL: `http://localhost:3000/api`
- Token-based auth (access + refresh tokens)

---EXECUTION PLAN---
FILES:
/home/marshall/projects/brainy-builds/lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async init() {
    this.accessToken = await AsyncStorage.getItem('accessToken');
    this.refreshToken = await AsyncStorage.getItem('refreshToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok && response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.request<T>(endpoint, options);
      }
    }

    return data;
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success && data.data.accessToken) {
        this.accessToken = data.data.accessToken;
        this.refreshToken = data.data.refreshToken;
        await AsyncStorage.setItem('accessToken', this.accessToken);
        await AsyncStorage.setItem('refreshToken', this.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async register(email: string, password: string) {
    const response = await this.request<{
      message: string;
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; isEmailVerified: boolean };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      await AsyncStorage.setItem('accessToken', this.accessToken);
      await AsyncStorage.setItem('refreshToken', this.refreshToken);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      message: string;
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; isEmailVerified: boolean };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      await AsyncStorage.setItem('accessToken', this.accessToken);
      await AsyncStorage.setItem('refreshToken', this.refreshToken);
    }

    return response;
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    this.accessToken = null;
    this.refreshToken = null;
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  }

  async getMe() {
    return this.request<{
      user: {
        id: string;
        email: string;
        createdAt: string;
        profile: any;
      };
    }>('/auth/me');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const api = new ApiClient();

/home/marshall/projects/brainy-builds/lib/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    try {
      await api.init();
      if (api.isAuthenticated()) {
        const response = await api.getMe();
        if (response.success && response.data) {
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            isEmailVerified: true,
          });
        }
      }
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setError(null);
      setLoading(true);
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setError(response.error?.message || 'Login failed');
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string) {
    try {
      setError(null);
      setLoading(true);
      const response = await api.register(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setError(response.error?.message || 'Registration failed');
        throw new Error(response.error?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/home/marshall/projects/brainy-builds/app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider } from '../lib/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
---END PLAN---

---

# FRONTEND

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/(auth)/_layout.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/backend/.dockerignore
/home/marshall/projects/brainy-builds/backend/.env
/home/marshall/projects/brainy-builds/backend/.env.example
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/prisma/migrations/20250114194315_init/migration.sql
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/middleware/rateLimiter.ts
/home/marshall/projects/brainy-builds/backend/src/middleware/validation.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/backend/tsconfig.json
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/README.md

=== PACKAGE.JSON ===
Not found at root level

=== EXISTING FILE CONTENTS ===

--- app/(auth)/_layout.tsx ---
File exists but content not retrieved

--- app/_layout.tsx ---
File exists but content not retrieved

=== SUMMARY ===
Files found: 18
Backend is running. Need to initialize Expo app and create auth screens.

# 🚀 STAGE 1: EXPO APP INITIALIZATION

Starting mobile app with Expo SDK 54, TypeScript, and auth screens.

**What I'm Building:**
1. Initialize Expo app with TypeScript
2. Set up environment variables
3. Create auth API service layer

**3 Files Maximum:** Package.json, .env, api/auth.ts

---EXECUTION PLAN---
COMMANDS:
cd /home/marshall/projects/brainy-builds && npx create-expo-app@latest . --template blank-typescript --no-install
cd /home/marshall/projects/brainy-builds && npm install axios @react-native-async-storage/async-storage expo-router

FILES:
/home/marshall/projects/brainy-builds/.env
EXPO_PUBLIC_API_URL=http://localhost:3000/api

/home/marshall/projects/brainy-builds/lib/api/auth.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      isEmailVerified?: boolean;
    };
  };
}

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    if (response.data.success) {
      await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.success) {
      await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  },

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  },

  async refreshToken(): Promise<string | null> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      if (response.data.success) {
        await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
        return response.data.data.accessToken;
      }
    } catch (error) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
    return null;
  },
};

/home/marshall/projects/brainy-builds/app.json
{
  "expo": {
    "name": "brainy-builds",
    "slug": "brainy-builds",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.brainybuilds.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.brainybuilds.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "scheme": "brainybuilds",
    "plugins": [
      "expo-router"
    ]
  }
}
---END PLAN---