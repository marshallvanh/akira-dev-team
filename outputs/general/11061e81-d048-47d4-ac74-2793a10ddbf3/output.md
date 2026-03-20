# TETSUO

# Akira — Build Mode

## What I Understood

Create the complete school-builder Expo project on the server with proper folder structure.

---

## Execution Plan

### Step 1: Create Expo Project

```bash
cd ~/projects && npx create-expo-app school-builder --template blank
```

### Step 2: Create Source Folders

```bash
cd ~/projects/school-builder && mkdir -p src/screens src/components src/constants src/data src/utils src/storage src/navigation
```

### Step 3: Create Asset Folders

```bash
mkdir -p assets/avatars assets/icons assets/sounds
```

### Step 4: Verify Structure

```bash
find ~/projects/school-builder -type d | head -20
```

---

## Expected Result

```
/home/user/projects/school-builder
├── App.js
├── app.json
├── package.json
├── node_modules/
├── assets/
│   ├── avatars/
│   ├── icons/
│   └── sounds/
└── src/
    ├── components/
    ├── constants/
    ├── data/
    ├── navigation/
    ├── screens/
    ├── storage/
    └── utils/
```

---

## What Success Looks Like

After Step 1:
```
✅ Your project is ready!
```

After Step 4:
```
/home/user/projects/school-builder
/home/user/projects/school-builder/src
/home/user/projects/school-builder/src/screens
/home/user/projects/school-builder/src/components
...
```

---

## What Failure Looks Like

- `npm ERR!` — Node/npm issue
- `EACCES permission denied` — permissions issue
- `command not found: npx` — Node not installed

---

⚡ **Execution Plan Ready — Plan ID: sb-init-001**

**Commands (4):**
1. `cd ~/projects && npx create-expo-app school-builder --template blank`
2. `cd ~/projects/school-builder && mkdir -p src/screens src/components src/constants src/data src/utils src/storage src/navigation`
3. `mkdir -p assets/avatars assets/icons assets/sounds`
4. `find ~/projects/school-builder -type d | head -20`

---

Reply **EXECUTE** to run now or **MODIFY** if you want changes.

---

# BACKEND

# Project Setup: SchoolBuilder

I'll guide you through setting up the SchoolBuilder project, including creating the Expo project and setting up the folder structure on the server.

---

## Step 1: Create the Expo Project

### Command:
```bash
npx create-expo-app school-builder --template blank
```

### What Success Looks Like:
- "✅ Your project is ready!"
- Folder `school-builder` created in your current directory

### What Failure Looks Like:
- "Command not found" 
- Red error messages
- "EACCES permission denied"

---

## Step 2: Create Folder Structure

### Command:
```bash
mkdir -p ~/school-builder/src/screens ~/school-builder/src/components ~/school-builder/src/data ~/school-builder/src/utils
```

### Verification:
After running the mkdir command, verify with:

```bash
ls -la ~/school-builder/src/
```

### Expected Output:
```
drwxr-xr-x  components
drwxr-xr-x  data
drwxr-xr-x  screens
drwxr-xr-x  utils
```

### What Failure Looks Like:
- "No such file or directory"
- "Permission denied"

---

## Step 3: Navigate to Project Directory

### Command:
```bash
cd ~/school-builder
```

---

## Summary

1. **Run each command** one by one.
2. **Verify success** using the criteria provided.
3. **Confirm folder structure** with the `ls` command.
4. **Report any issues** here if you encounter errors.

---

Please proceed with running the commands and let me know how it goes!

---

# FRONTEND

# Building the School-Builder Project on the Server

I'll guide you through creating the Expo project and setting up the folder structure. Let's get started.

---

## Step 1: Create the Expo Project

Run this command to create a new Expo project named `school-builder`:

```bash
npx create-expo-app school-builder --template blank
```

### What success looks like:
- You see a message like: `✅ Your project is ready!`
- It suggests running `cd school-builder` and `npm start`.

---

## Step 2: Set Up the Folder Structure

Once the Expo project is created, navigate into the project directory and create the necessary folders:

```bash
cd school-builder
mkdir -p src/screens src/components src/data src/utils
```

### What success looks like:
- No output means the folders were created successfully.

---

## Step 3: Verify the Folder Structure

Run this command to verify the folders were created correctly:

```bash
ls -la src/
```

### Expected output:
```
drwxr-xr-x  screens
drwxr-xr-x  components
drwxr-xr-x  data
drwxr-xr-x  utils
```

---

## Backend Dependencies

- None at this stage. We're just setting up the front-end project structure.

---

## What to Check

1. **Expo Project Creation**: Ensure the project initializes successfully.
2. **Folder Structure**: Confirm the `src` directory contains `screens`, `components`, `data`, and `utils`.

Once you've run these commands, let me know if everything looks correct or if you encounter any issues.

---

# DEVOPS

# Akira — Build Mode

## What I Understood

Create the complete school-builder Expo project on the server with proper folder structure.

---

## Execution Plan

**Step 1:** Create the Expo project
**Step 2:** Add the src folder structure
**Step 3:** Verify everything exists

---

## Commands to Execute

```bash
# Step 1: Navigate to projects folder and create Expo app
cd ~/projects && npx create-expo-app school-builder --template blank

# Step 2: Create src folder structure
cd ~/projects/school-builder && mkdir -p src/screens src/components src/data src/utils src/constants src/navigation src/storage

# Step 3: Create assets subfolders
mkdir -p assets/avatars assets/icons assets/sounds

# Step 4: Verify structure
ls -la ~/projects/school-builder/
ls -la ~/projects/school-builder/src/
```

---

## What Success Looks Like

**After Step 1:**
```
✅ Your project is ready!

To run your project, navigate to the directory and run one of the following npm commands.

- cd school-builder
- npm start
```

**After Step 4:**
```
school-builder/
├── App.js
├── app.json
├── package.json
├── node_modules/
├── assets/
│   ├── avatars/
│   ├── icons/
│   └── sounds/
└── src/
    ├── components/
    ├── constants/
    ├── data/
    ├── navigation/
    ├── screens/
    ├── storage/
    └── utils/
```

---

## What Failure Looks Like

- `command not found: npx` — Node.js not installed
- `EACCES permission denied` — permissions issue
- `directory already exists` — project folder exists, need to remove or rename

---

⚡ **Execution Plan Ready — Plan ID: sb-expo-001**

**Commands (4):**
1. `cd ~/projects && npx create-expo-app school-builder --template blank`
2. `cd ~/projects/school-builder && mkdir -p src/screens src/components src/data src/utils src/constants src/navigation src/storage`
3. `mkdir -p assets/avatars assets/icons assets/sounds`
4. `ls -la ~/projects/school-builder/ && ls -la ~/projects/school-builder/src/`

---

Reply **EXECUTE** to run now or **CANCEL** to abort.