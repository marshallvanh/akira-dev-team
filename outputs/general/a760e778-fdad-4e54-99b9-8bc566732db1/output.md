# TETSUO

Running the command now.

```bash
mkdir -p ~/projects/school-builder/src/screens ~/projects/school-builder/src/components ~/projects/school-builder/src/data ~/projects/school-builder/src/utils
```

---

**What success looks like:**

No output. The terminal just returns to the prompt with no message. That means it worked.

---

**What failure looks like:**

- `Permission denied`
- `No such file or directory`
- Any red or yellow text

---

**To verify the folders exist, run:**

```bash
ls -la ~/projects/school-builder/src/
```

**Expected output:**

```
drwxr-xr-x  components
drwxr-xr-x  data
drwxr-xr-x  screens
drwxr-xr-x  utils
```

---

Run both commands and tell me what you see. I'll confirm we're good before moving to the next step.

---

# BACKEND

Got it. I'll create the specified folder structure on the server.

---

## Step 1: Execute Commands

I'll run the `mkdir` commands to create the directories.

```bash
mkdir -p ~/projects/school-builder/src/screens ~/projects/school-builder/src/components ~/projects/school-builder/src/data ~/projects/school-builder/src/utils
```

---

## Step 2: Verify Creation

To verify the directories were created, I'll list the contents of the `src` directory.

```bash
ls -la ~/projects/school-builder/src/
```

---

## Expected Output

After running the verification command, you should see:

```
total 0
drwxr-xr-x  6 user  staff  192 Oct 15 12:00 .
drwxr-xr-x  4 user  staff  128 Oct 15 12:00 ..
drwxr-xr-x  2 user  staff   64 Oct 15 12:00 components
drwxr-xr-x  2 user  staff   64 Oct 15 12:00 data
drwxr-xr-x  2 user  staff   64 Oct 15 12:00 screens
drwxr-xr-x  2 user  staff   64 Oct 15 12:00 utils
```

---

## Checking the Result

- Ensure `components`, `data`, `screens`, and `utils` directories are listed.
- Confirm there are no error messages.
- All directories should have permission settings like `drwxr-xr-x`.

Let me know if you encounter any issues or if everything looks correct.

---

# DEVOPS

Running the command now.

---

## Command

```bash
mkdir -p ~/projects/school-builder/src/screens ~/projects/school-builder/src/components ~/projects/school-builder/src/data ~/projects/school-builder/src/utils
```

---

## What Success Looks Like

No output. The terminal returns to the prompt with no message. That means it worked.

```
marshall@server:~$ mkdir -p ~/projects/school-builder/src/screens ~/projects/school-builder/src/components ~/projects/school-builder/src/data ~/projects/school-builder/src/utils
marshall@server:~$ 
```

---

## What Failure Looks Like

- `Permission denied` — need sudo or wrong directory
- `No such file or directory` — the `-p` flag should prevent this, but indicates path issue

---

## Verify It Worked

Run this to confirm the folders exist:

```bash
ls -la ~/projects/school-builder/src/
```

**Expected output:**

```
total 0
drwxr-xr-x  6 user  staff  192 Jan 15 10:00 .
drwxr-xr-x  3 user  staff   96 Jan 15 10:00 ..
drwxr-xr-x  2 user  staff   64 Jan 15 10:00 components
drwxr-xr-x  2 user  staff   64 Jan 15 10:00 data
drwxr-xr-x  2 user  staff   64 Jan 15 10:00 screens
drwxr-xr-x  2 user  staff   64 Jan 15 10:00 utils
```

---

Run those two commands and tell me what you see.