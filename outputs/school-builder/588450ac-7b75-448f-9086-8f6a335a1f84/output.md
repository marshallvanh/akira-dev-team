# TETSUO

*Tetsuo — Technical Assessment*

**Request:** Build Supabase client with SecureStore for auth storage

**Feasibility:** ✅ Straightforward

**Technical Notes:**
- Expo SecureStore is the correct choice for React Native auth token storage (encrypted, persistent)
- Supabase v2 requires a custom storage adapter since SecureStore is async
- Need to handle the async nature of SecureStore with Supabase's storage interface

**Dependencies Required:**
- `@supabase/supabase-js` (v2)
- `expo-secure-store`
- `react-native-url-polyfill`

**Build Sequence:**
1. Create directory if missing
2. Write supabase.ts with SecureStore adapter

**Handoff:** Approved for execution.

---

*Akira — Execution Plan*

**What I understood:**
- Create `~/projects/school-builder/src/lib/supabase.ts`
- Use Supabase v2 client
- Use `expo-secure-store` for auth storage (not AsyncStorage)
- Read from `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Mode:** BUILD

---

```bash
mkdir -p ~/projects/school-builder/src/lib

cat > ~/projects/school-builder/src/lib/supabase.ts << 'EOF'
import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

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

⚡ **Plan ID: sb-client-01**

This creates:
| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase v2 client with SecureStore adapter |

**Key details:**
- SecureStore adapter wraps async methods for Supabase's storage interface
- `detectSessionInUrl: false` — required for React Native (no browser URL)
- `persistSession: true` — keeps user logged in across app restarts
- `autoRefreshToken: true` — handles token refresh automatically

Say **yes** to execute.

---

# BACKEND

To set up the Supabase client using `expo-secure-store` for auth storage, I'll create the necessary file with the correct configuration. Here's the plan for writing the file:

---

**File to Create:**
- **Path:** `~/projects/school-builder/src/lib/supabase.ts`
- **Purpose:** Initialize the Supabase client with `expo-secure-store` for auth storage

**Content:**
```typescript
import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { SupabaseClientOptions } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const ExpoSecureStoreAdapter: SupabaseClientOptions['auth']['storage'] = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

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

**Steps to Execute:**

1. **Create Directory if Not Exists:**
   ```bash
   mkdir -p ~/projects/school-builder/src/lib
   ```

2. **Write File Content:**
   ```bash
   cat > ~/projects/school-builder/src/lib/supabase.ts << 'EOF'
   import 'react-native-url-polyfill/auto';
   import * as SecureStore from 'expo-secure-store';
   import { createClient } from '@supabase/supabase-js';
   import { SupabaseClientOptions } from '@supabase/supabase-js';

   const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
   const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

   const ExpoSecureStoreAdapter: SupabaseClientOptions['auth']['storage'] = {
     getItem: (key) => SecureStore.getItemAsync(key),
     setItem: (key, value) => SecureStore.setItemAsync(key, value),
     removeItem: (key) => SecureStore.deleteItemAsync(key),
   };

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

**Instructions to Verify:**

- **Check File Path:** Ensure `supabase.ts` exists at `~/projects/school-builder/src/lib/`.
- **Check Content:** Open the file and verify it contains the correct Supabase client setup.
- **Test Authentication:** Implement a basic login/logout flow to confirm that `expo-secure-store` handles session storage correctly.

Please run the commands above to create the file. Let me know if you need further assistance!