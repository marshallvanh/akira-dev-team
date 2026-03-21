# TETSUO

# Tetsuo — Build Sequence Confirmed

## Executing Steps 3-8

| Step | Task | Worker |
|------|------|--------|
| 3 | Supabase client config | Backend |
| 4 | AuthContext provider | Backend |
| 5 | Navigation with auth flow | Frontend |
| 6 | Login screen | Frontend |
| 7 | Register screen | Frontend |
| 8 | Protected route wrapper | Frontend |

---

## First: Check .env format

Need to verify the Supabase credentials format before building the client:

```bash
cat ~/projects/school-builder/.env
```

This confirms the variable names so the Supabase client config matches.

---

## Proposed Folder Structure

```
src/
├── constants/
│   ├── colors.js       (exists)
│   └── config.js       (exists)
├── lib/
│   └── supabase.ts     (Step 3)
├── contexts/
│   └── AuthContext.tsx (Step 4)
├── components/
│   └── ProtectedRoute.tsx (Step 8)
app/
├── _layout.tsx         (update for auth)
├── index.tsx           (update - redirect logic)
├── (auth)/
│   ├── _layout.tsx     (auth group layout)
│   ├── login.tsx       (Step 6)
│   └── register.tsx    (Step 7)
└── (main)/
    ├── _layout.tsx     (protected group layout)
    └── index.tsx       (home after login)
```

---

Ready to check .env and then build all 6 files in sequence?

**Say yes to proceed.**

---

# BACKEND

# Phase 1 Build — Steps 3 to 8

---

## Updated Context

- **Supabase credentials** confirmed in `.env` file.
- **`src/` folder status:** Contains `constants/colors.js` and `constants/config.js`.

---

## Build Plan for Steps 3-8

| Step | Task | Description |
|------|------|-------------|
| 3 | Supabase client config | Configure Supabase client using credentials from `.env` |
| 4 | AuthContext provider | Set up a React Context for managing authentication state |
| 5 | Navigation with auth flow | Implement navigation structure using Expo Router with auth integration |
| 6 | Login screen | Create a screen for user login |
| 7 | Register screen | Create a screen for user registration |
| 8 | Protected route wrapper | Implement logic to secure routes that require authentication |

---

## Step 3: Supabase Client Configuration

**File:** `src/lib/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
```

**Verification:**
- Ensure `.env` has `SUPABASE_URL` and `SUPABASE_ANON_KEY` correctly set.

---

## Step 4: AuthContext Provider

**File:** `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user || null);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
```

**Verification:**
- Test by wrapping the entire app with `<AuthProvider>` in the main entry file.

---

## Step 5: Navigation with Auth Flow

**File:** `src/navigation/index.tsx`

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Stack } from 'expo-router';

const Navigation = () => {
  const { user } = useAuth();

  return (
    <Stack>
      {user ? (
        <Stack.Screen name="Home" />
      ) : (
        <>
          <Stack.Screen name="Login" />
          <Stack.Screen name="Register" />
        </>
      )}
    </Stack>
  );
};

export default Navigation;
```

**Verification:**
- Ensure `Navigation` is included in the app's main component hierarchy.

---

## Step 6: Login Screen

**File:** `src/screens/Login.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      alert('Failed to sign in');
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;
```

**Verification:**
- Test rendering the Login screen and ensure proper layout and functionality.

---

## Step 7: Register Screen

**File:** `src/screens/Register.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      alert('Failed to register');
    }
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;
```

**Verification:**
- Test rendering the Register screen and ensure proper layout and functionality.

---

## Step 8: Protected Route Wrapper

**File:** `src/components/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="Login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

**Verification:**
- Ensure that protected routes redirect unauthenticated users to the Login screen.

---

## Summary

**Files Created:**

1. `src/lib/supabaseClient.ts`
2. `src/contexts/AuthContext.tsx`
3. `src/navigation/index.tsx`
4. `src/screens/Login.tsx`
5. `src/screens/Register.tsx`
6. `src/components/ProtectedRoute.tsx`

**Next Steps:**

- Wrap your application with `<AuthProvider>` in your main entry file (e.g., `App.tsx`).
- Integrate and test the navigation flow within your application.
- Verify all screens and authentication flows function as expected.

**Say "continue" for next steps or further modifications.**