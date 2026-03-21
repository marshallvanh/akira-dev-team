# TETSUO

*Tetsuo — Technical Assessment*

**Request:** Supabase client with SecureStore adapter

**Feasibility:** ✅ Straightforward build

**Technical specs:**
- Supabase JS v2 client
- `expo-secure-store` for token persistence
- `react-native-url-polyfill` required for RN environment
- `detectSessionInUrl: false` mandatory for React Native

**Red flags:** None

**Handoff:** Approved for Akira to execute.

---

*Akira — Execution Plan*

**Mode:** BUILD

**File:** `~/projects/school-builder/src/lib/supabase.ts`

```bash
mkdir -p ~/projects/school-builder/src/lib

cat > ~/projects/school-builder/src/lib/supabase.ts << 'EOF'
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
EOF
```

---

⚡ **Plan ID:** a3f82b17
**Commands:** 2
**Files:** 1

Say **yes** to execute.

---

# BACKEND

*Akira — Execution Plan*

**What I understood:**
- Build `src/lib/supabase.ts` for SchoolBuilder
- Use Supabase v2 client
- Integrate `expo-secure-store` for session persistence
- Use environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Project path: `~/projects/school-builder`

**Mode:** BUILD

**File to create:**
- `src/lib/supabase.ts`

---

**1. Supabase Client Setup**

**File:** `~/projects/school-builder/src/lib/supabase.ts`

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

**Execution Steps:**

1. **Create Directory:**
   Ensure the `lib` directory exists:
   ```bash
   mkdir -p ~/projects/school-builder/src/lib
   ```

2. **Write File:**
   Save the Supabase client setup to the correct path:
   ```bash
   cat > ~/projects/school-builder/src/lib/supabase.ts << 'EOF'
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
EOF
   ```

3. **Dependencies:**
   Ensure `expo-secure-store` and other required packages are installed:
   ```bash
   cd ~/projects/school-builder
   npx expo install @supabase/supabase-js expo-secure-store react-native-url-polyfill
   ```

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

Say **yes** to execute this plan with the full file content.