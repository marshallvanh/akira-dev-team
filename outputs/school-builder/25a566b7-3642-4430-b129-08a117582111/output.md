# TETSUO

Hold on.

========================
TECHNICAL ASSESSMENT
========================

You're asking me to build a profile creation screen, but I haven't seen the current project state yet. I need to understand:

1. What auth system is already in place (if any)
2. What framework we're using (Next.js? React? Something else?)
3. What's actually broken vs what's missing
4. Whether we have a database schema defined for user profiles

You told me to "read the current state" but I haven't gotten the output from those commands yet.

========================
WHAT I NEED BEFORE WE BUILD ANYTHING
========================

Run these commands and give me the output:

```bash
cd ~/projects/school-builder && ls -la
```

```bash
cd ~/projects/school-builder && cat package.json
```

```bash
cd ~/projects/school-builder && find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | grep -E "(auth|login|signup|profile)" | head -20
```

```bash
cd ~/projects/school-builder && cat .env.local 2>/dev/null || cat .env 2>/dev/null || echo "No env file found"
```

========================
RED FLAG
========================

You're jumping straight to "build a profile creation screen" without me seeing:
- What auth provider we're using (Clerk? NextAuth? Supabase? Custom?)
- What database we're using
- What UI framework we have
- Whether signup even works yet

Building the wrong thing in the wrong order is how projects die. Let me see what's there first, then I'll tell you exactly what to build and in what order.

Show me the project state.

---

# FRONTEND

I need to see the current project structure first to understand what exists and build correctly on top of it. Let me check:

```bash
cd ~/projects/school-builder && ls -laR
```

```bash
cd ~/projects/school-builder && cat app/_layout.tsx 2>/dev/null || echo "No root layout found"
```

```bash
cd ~/projects/school-builder && cat .env 2>/dev/null || cat .env.local 2>/dev/null || echo "No env file found"
```

```bash
cd ~/projects/school-builder && cat package.json
```

I need to see what's actually there before I can build the profile creation screen correctly. The avatar selection with animal/person options and customization is a specific UI feature that needs to integrate with:

1. The existing auth flow (wherever users land after signup)
2. The Supabase profiles table structure
3. The navigation setup
4. Any existing design system or components

Please run these commands so I can see the current state and build the profile creation screen that fits properly into the existing architecture.