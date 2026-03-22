# TETSUO

========================
STOP — INFORMATION REQUIRED
========================

Marshall, I still don't have visibility into the project. You keep asking me to build, but I can't make technical decisions without seeing:

1. **What framework is this?** (React Native? Next.js? Expo?)
2. **What auth is already implemented?** (Clerk? Supabase Auth? Nothing?)
3. **What's the current file structure?**
4. **What UI library exists?** (NativeWind? Tamagui? Plain React Native?)
5. **Is Supabase already configured?** (client initialized? .env set up?)

========================
WHAT I NEED RIGHT NOW
========================

Give me the output of these commands:

```bash
cd ~/projects/school-builder && cat package.json
```

```bash
cd ~/projects/school-builder && ls -la app/
```

```bash
cd ~/projects/school-builder && cat app/_layout.tsx
```

```bash
cd ~/projects/school-builder && cat .env.local || cat .env || echo "no env"
```

```bash
cd ~/projects/school-builder && ls -la lib/ || ls -la utils/ || echo "no lib dir"
```

========================
WHY I'M BLOCKING THIS
========================

You're asking me to build a complex multi-step form with:
- Lottie animations (package dependency)
- Avatar customization state management
- Supabase integration (needs client config)
- Navigation flow (needs to know where user came from)
- File uploads for avatars potentially

**I cannot design this correctly without seeing:**
- What navigation system you're using
- What state management is in place
- Whether Supabase client exists
- What the profiles table schema is
- What dependencies are already installed

========================
THE RIGHT ORDER
========================

Once I see the project:

1. **I'll define the Supabase schema** for profiles table
2. **I'll specify the tech stack** for this screen (components, state, navigation)
3. **I'll hand to Architect** to design the component structure
4. **Then workers build** the actual screens

But right now I'm being asked to approve a build without knowing if we even have React Native installed.

**Paste the command outputs. Then we build this right.**

---

# FRONTEND

I need to see the current project state before I can build this correctly. I've been asking for outputs but not receiving them. Let me try a different approach.

**Please run this single command and paste the full output:**

```bash
cd ~/projects/school-builder && { echo "=== DIRECTORY STRUCTURE ==="; ls -la; echo "=== PACKAGE.JSON ==="; cat package.json 2>/dev/null || echo "no package.json"; echo "=== APP STRUCTURE ==="; find app -type f 2>/dev/null | head -20 || echo "no app dir"; echo "=== ENV ==="; cat .env.local 2>/dev/null || cat .env 2>/dev/null || echo "no env"; echo "=== SUPABASE ==="; ls -la supabase 2>/dev/null || echo "no supabase dir"; }
```

**Why I need this:**

I cannot build a profile creation screen without knowing:
1. Is this Expo/React Native or Next.js?
2. What auth system exists (if any)?
3. What's the Supabase schema for profiles?
4. What's already built in the app directory?
5. What dependencies are installed?

**I will not fabricate or guess.** Once you show me what exists, I'll build the complete profile creation screen with:
- Name input
- Avatar type selection (animal/person)
- Animal customization (species, color, accessories)
- Person customization (skin tone, hair, outfit)
- School name input
- Grade selection
- Lottie animations
- Supabase integration
- Full TypeScript types
- Complete executable plan

**Show me the project state first.**