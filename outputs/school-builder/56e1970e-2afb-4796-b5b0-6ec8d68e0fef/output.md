# TETSUO

*Tetsuo — Technical Assessment*

**Request:** Build 8 auth system files for SchoolBuilder

**Feasibility:** ✅ Ready to build

**Technical Notes:**
- Supabase client exists at `src/lib/supabase.ts` — will import from there
- Expo Router file-based routing requires specific directory structure
- Route groups `(auth)` and `(main)` need escaped parentheses in mkdir
- Supabase v2 auth listener uses `subscription.unsubscribe()` pattern

**Build Order:**
1. `src/contexts/AuthContext.tsx` — auth state management (dependency for all screens)
2. `app/_layout.tsx` — root layout wraps app with AuthProvider
3. `app/index.tsx` — entry redirect based on auth state
4. `app/(auth)/_layout.tsx` — auth group layout
5. `app/(auth)/login.tsx` — login screen
6. `app/(auth)/register.tsx` — register screen
7. `app/(main)/_layout.tsx` — protected group layout
8. `app/(main)/index.tsx` — main dashboard

**Red Flags:** None. Standard Expo Router + Supabase auth pattern.

**Handoff:** Approved for execution.

---

*Akira — Execution Plan*

**What I understood:**
- Build 8 files for SchoolBuilder auth system
- Project at `~/projects/school-builder`
- `src/lib/supabase.ts` already exists
- Use Supabase v2, Expo Router, TypeScript

**Mode:** BUILD

---

```bash
mkdir -p ~/projects/school-builder/src/contexts
mkdir -p ~/projects/school-builder/app/\(auth\)
mkdir -p ~/projects/school-builder/app/\(main\)

cat > ~/projects/school-builder/src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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

cat > ~/projects/school-builder/app/index.tsx << 'EOF'
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
EOF

cat > ~/projects/school-builder/app/\(auth\)/_layout.tsx << 'EOF'
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    />
  );
}
EOF

cat > ~/projects/school-builder/app/\(auth\)/login.tsx << 'EOF'
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
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
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(main)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>SchoolBuilder</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
});
EOF

cat > ~/projects/school-builder/app/\(auth\)/register.tsx << 'EOF'
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function RegisterScreen() {
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

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Success',
        'Please check your email to verify your account',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
});
EOF

cat > ~/projects/school-builder/app/\(main\)/_layout.tsx << 'EOF'
import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function MainLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#3b82f6' },
        headerTintColor:

---

# FRONTEND

*Tetsuo — Technical Assessment*

**Request:** Build remaining SchoolBuilder authentication files using Supabase v2 and Expo Router

**Feasibility:** ✅ Clear and straightforward

**Technical Notes:**
- Use `src/lib/supabase.ts` for existing Supabase v2 client
- Expo Router for navigation
- TypeScript for type safety and consistency
- Supabase auth hooks for session management

**Dependencies Required:**
- `expo-router`
- `@supabase/supabase-js` (already installed)
- `react-native-url-polyfill` (already imported in `supabase.ts`)

**File Structure to Implement:**

1. **Contexts**
   - `src/contexts/AuthContext.tsx`: Context for authentication state and actions

2. **Layouts and Screens**
   - `app/_layout.tsx`: Root layout with `AuthProvider`
   - `app/index.tsx`: Entry point with redirect based on session
   - `app/(auth)/_layout.tsx`: Layout for authentication screens
   - `app/(auth)/login.tsx`: Login screen
   - `app/(auth)/register.tsx`: Register screen
   - `app/(main)/_layout.tsx`: Layout for main app screens
   - `app/(main)/index.tsx`: Main dashboard screen

**Handoff:** Approved for execution.

---

*Akira — Execution Plan*

**What I understood:**
- Build complete auth system UI for SchoolBuilder
- Use existing Supabase client at `src/lib/supabase.ts`
- Implement using Expo Router and TypeScript

**Mode:** BUILD

**Steps for File Creation:**

1. **Auth Context**
   - Manage user session and authentication actions

2. **Layouts and Screens**
   - Organize authentication and main app navigation

---

**1. Auth Context Setup**

**File:** `~/projects/school-builder/src/contexts/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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
```

---

**2. Root Layout**

**File:** `~/projects/school-builder/app/_layout.tsx`
```typescript
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
```

---

**3. Index Entry Point**

**File:** `~/projects/school-builder/app/index.tsx`
```typescript
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
```

---

**4. Auth Group Layout**

**File:** `~/projects/school-builder/app/(auth)/_layout.tsx`
```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    />
  );
}
```

---

**5. Login Screen**

**File:** `~/projects/school-builder/app/(auth)/login.tsx`
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
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
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(main)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>SchoolBuilder</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

---

**6. Register Screen**

**File:** `~/projects/school-builder/app/(auth)/register.tsx`
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function RegisterScreen() {
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

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Success',
        'Please check your email to verify your account',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

---

**7. Main Group Layout**

**File:** `~/projects/school-builder/app/(main)/_layout.tsx`
```typescript
import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    />
  );
}
```

---

**8. Main Dashboard Screen**

**File:** `~/projects/school-builder/app/(main)/index.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Dashboard() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SchoolBuilder!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
});
```

---

**Execution Plan Summary:**
- **Create Directories:** Ensure all directories exist for file paths
- **Write Files:** Full contents for each component
- **Verify:** Check all files are present and correctly implemented

**Commands to Execute:**

```bash
# Create necessary directories
mkdir -p ~/projects/school-builder/src/contexts
mkdir -p ~/projects/school-builder/app/(auth)
mkdir -p ~/projects/school-builder/app/(main)

# Write files
cat > ~/projects/school-builder/src/contexts/AuthContext.tsx << 'EOF'
<Content of AuthContext.tsx>
EOF

cat > ~/projects/school-builder/app/_layout.tsx << 'EOF'
<Content of _layout.tsx>
EOF

cat > ~/projects/school-builder/app/index.tsx << 'EOF'
<Content of index.tsx>
EOF

cat > ~/projects/school-builder/app/(auth)/_layout.tsx << 'EOF'
<Content of (auth)/_layout.tsx>
EOF

cat > ~/projects/school-builder/app/(auth)/login.tsx << 'EOF'
<Content of login.tsx>
EOF

cat > ~/projects/school-builder/app/(auth)/register.tsx << 'EOF'
<Content of register.tsx>
EOF

cat > ~/projects/school-builder/app/(main)/_layout.tsx << 'EOF'
<Content of (main)/_layout.tsx>
EOF

cat > ~/projects/school-builder/app/(main)/index.tsx << 'EOF'
<Content of (main)/index.tsx>
EOF
```

Replace `<Content of ...>` with the respective file content provided above.

Say **yes** to execute.