# TETSUO

*Tetsuo — Technical Assessment*

**Request:** 8 remaining auth files for SchoolBuilder

**Feasibility:** ✅ Standard Expo Router auth pattern

**Architecture:**

```
src/
  contexts/
    AuthContext.tsx    # Auth state + Supabase listener

app/
  _layout.tsx          # Root layout, wraps AuthProvider
  index.tsx            # Entry redirect based on auth state
  (auth)/
    _layout.tsx        # Stack for unauthenticated routes
    login.tsx          # Login screen
    register.tsx       # Register screen
  (main)/
    _layout.tsx        # Stack for authenticated routes
    index.tsx          # Home/dashboard after login
```

**Build Order:**
1. `AuthContext.tsx` — foundation, other files import from it
2. `app/_layout.tsx` — wraps entire app with AuthProvider
3. `app/index.tsx` — redirect logic
4. `app/(auth)/_layout.tsx` — auth stack
5. `app/(auth)/login.tsx`
6. `app/(auth)/register.tsx`
7. `app/(main)/_layout.tsx` — main stack
8. `app/(main)/index.tsx`

**Tech decisions:**
- `onAuthStateChange` listener in context
- `expo-router` `Redirect` component for navigation
- Session stored via existing SecureStore adapter
- Minimal UI — functional, not styled

**Red flags:** None. Standard pattern.

**Handoff:** Approved for build.

---

*Akira — Execution Plan*

**Mode:** BUILD

**Files:** 8

---

```bash
# Create directories
mkdir -p ~/projects/school-builder/src/contexts
mkdir -p ~/projects/school-builder/app/\(auth\)
mkdir -p ~/projects/school-builder/app/\(main\)

# 1. AuthContext.tsx
cat > ~/projects/school-builder/src/contexts/AuthContext.tsx << 'EOF'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
EOF

# 2. app/_layout.tsx
cat > ~/projects/school-builder/app/_layout.tsx << 'EOF'
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
EOF

# 3. app/index.tsx
cat > ~/projects/school-builder/app/index.tsx << 'EOF'
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
EOF

# 4. app/(auth)/_layout.tsx
cat > ~/projects/school-builder/app/\(auth\)/_layout.tsx << 'EOF'
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
EOF

# 5. app/(auth)/login.tsx
cat > ~/projects/school-builder/app/\(auth\)/login.tsx << 'EOF'
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007AFF', fontSize: 16 },
});
EOF

# 6. app/(auth)/register.tsx
cat > ~/projects/school-builder/app/\(auth\)/register.tsx << 'EOF'
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Success', 'Check your email for verification link');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Register'}</Text>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007AFF', fontSize: 16 },
});
EOF

# 7. app/(main)/_layout.tsx
cat > ~/projects/school-builder/app/\(main\)/_layout.tsx << 'EOF'
import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
EOF

# 8. app/(main)/index.tsx
cat > ~/projects/school-builder/app/\(main\)/index.tsx << 'EOF'
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, color: '#666', marginBottom: 40 },
  button: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, minWidth: 200, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
EOF
```

---

⚡ **Plan ID:** f7a31d92  
**Commands:** 11  
**Files:** 8

Say **yes** to execute.

---

# FRONTEND

*Akira — Execution Plan*

**What I understood:**
- Build 8 remaining auth-related files for SchoolBuilder using Expo SDK 54, Expo Router, TypeScript, and Supabase v2.
- The project path is `~/projects/school-builder`.
- Files to create:
  1. `src/contexts/AuthContext.tsx`
  2. `app/_layout.tsx`
  3. `app/index.tsx`
  4. `app/(auth)/_layout.tsx`
  5. `app/(auth)/login.tsx`
  6. `app/(auth)/register.tsx`
  7. `app/(main)/_layout.tsx`
  8. `app/(main)/index.tsx`

**Mode:** BUILD

---

**1. Auth Context:**

**File:** `~/projects/school-builder/src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const setData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

**2. App Layout:**

**File:** `~/projects/school-builder/app/_layout.tsx`

```typescript
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)/_layout" />
        <Stack.Screen name="(main)/_layout" />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
```

---

**3. Home Index:**

**File:** `~/projects/school-builder/app/index.tsx`

```typescript
import { Redirect } from 'expo-router';

const HomeIndex = () => {
  return <Redirect href="/(main)" />;
};

export default HomeIndex;
```

---

**4. Auth Layout:**

**File:** `~/projects/school-builder/app/(auth)/_layout.tsx`

```typescript
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthLayout;
```

---

**5. Login Screen:**

**File:** `~/projects/school-builder/app/(auth)/login.tsx`

```typescript
import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { View, TextInput, Button, Text } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signOut } = useAuth();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default LoginScreen;
```

---

**6. Register Screen:**

**File:** `~/projects/school-builder/app/(auth)/register.tsx`

```typescript
import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { View, TextInput, Button, Text } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
```

---

**7. Main Layout:**

**File:** `~/projects/school-builder/app/(main)/_layout.tsx`

```typescript
import { Stack } from 'expo-router';

const MainLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default MainLayout;
```

---

**8. Main Index:**

**File:** `~/projects/school-builder/app/(main)/index.tsx`

```typescript
import React from 'react';
import { View, Text } from 'react-native';

const MainIndex = () => {
  return (
    <View>
      <Text>Welcome to the Main App!</Text>
    </View>
  );
};

export default MainIndex;
```

---

**Execution Steps:**

1. **Create Directories:**
   ```bash
   mkdir -p ~/projects/school-builder/src/contexts
   mkdir -p ~/projects/school-builder/app/(auth)
   mkdir -p ~/projects/school-builder/app/(main)
   ```

2. **Write Files:**
   Save each code block to the corresponding file path as shown above.

3. **Dependencies:**
   Ensure all necessary packages (`@supabase/supabase-js`, `expo-router`, `react`, `react-native`) are installed.

4. **Environment Variables:**
   Ensure the `.env` file contains:
   ```plaintext
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Test:**
   Verify the setup works by running the app:
   ```bash
   npx expo start
   ```

Say **yes** to execute this plan with all file creations.