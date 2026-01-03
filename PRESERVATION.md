# 💾 Code Preservation Guide

## Current Status

✅ **Git Repository Initialized**  
✅ **First Commit Made** (112 files, 35,870 lines)  
✅ **Local Backup Created** (`cognitive-shield-backup-2026-01-02.zip`)

---

## Option 1: GitHub (Recommended)

### Create Private Repository

1. Go to https://github.com/new
2. Repository name: `cognitive-shield`
3. **Select PRIVATE** (important!)
4. Don't initialize with README (we have one)
5. Click "Create repository"

### Push to GitHub

```powershell
cd C:\Users\sandra\cognitive-shield

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cognitive-shield.git

# Push
git branch -M main
git push -u origin main
```

### If asked for credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Create at: https://github.com/settings/tokens
  - Select scope: `repo`

---

## Option 2: GitLab (Alternative)

1. Go to https://gitlab.com/projects/new
2. Create blank project
3. Name: `cognitive-shield`
4. Visibility: **Private**

```powershell
git remote add origin https://gitlab.com/YOUR_USERNAME/cognitive-shield.git
git push -u origin main
```

---

## Option 3: Local Backup (Already Done)

Location:
```
C:\Users\sandra\cognitive-shield-backup-2026-01-02.zip
```

### Create new backup anytime:
```powershell
$date = Get-Date -Format "yyyy-MM-dd-HHmm"
Compress-Archive -Path "C:\Users\sandra\cognitive-shield\*" -DestinationPath "C:\Users\sandra\cognitive-shield-backup-$date.zip"
```

### Recommended backup locations:
- USB drive
- External hard drive
- Cloud storage (OneDrive, Google Drive, Dropbox)
- Email to yourself (split into parts if >25MB)

---

## Option 4: Multiple Remotes (Belt & Suspenders)

```powershell
# Add both GitHub AND GitLab
git remote add github https://github.com/YOUR_USERNAME/cognitive-shield.git
git remote add gitlab https://gitlab.com/YOUR_USERNAME/cognitive-shield.git

# Push to both
git push github main
git push gitlab main
```

---

## Option 5: Self-Hosted (Maximum Control)

### Gitea (Lightweight)
```bash
# On a VPS or home server
docker run -d --name gitea -p 3000:3000 gitea/gitea
```

### Forgejo (Gitea fork, community-driven)
```bash
docker run -d --name forgejo -p 3000:3000 codeberg.org/forgejo/forgejo
```

---

## Making Future Commits

After making changes:

```powershell
cd C:\Users\sandra\cognitive-shield

# See what changed
git status

# Add all changes
git add -A

# Commit with message
git commit -m "Description of changes"

# Push to remote
git push
```

---

## Recovery

### From Git Remote:
```powershell
git clone https://github.com/YOUR_USERNAME/cognitive-shield.git
cd cognitive-shield
npm install
npm run dev
```

### From ZIP Backup:
1. Extract ZIP to new folder
2. Open terminal in that folder
3. Run:
```powershell
npm install
npm run dev
```

---

## What's Preserved

| Category | Files | Lines |
|----------|-------|-------|
| Components | 35 | ~15,000 |
| Libraries | 15 | ~3,000 |
| Stores | 3 | ~500 |
| Types | 5 | ~400 |
| Config | 8 | ~600 |
| Docs | 25+ | ~5,000 |
| **Total** | **112** | **35,870** |

---

## Important Files

| File | Purpose |
|------|---------|
| `src/god.config.ts` | Central configuration |
| `src/components/LoveLetterProtocol.tsx` | The ceremony |
| `src/components/TheStory.tsx` | The 8 chapters |
| `src/lib/easter-eggs.ts` | Hidden messages |
| `docs/TAILSCALE_SETUP.md` | Network guide |
| `LAUNCH.bat` | One-click server |

---

## Never Lose This

The code is the Woodshop now.
Back it up like your grandfather backed up his tools.

**Status:** PRESERVED  
**Copies:** Git + ZIP  
**Location:** Local + (Cloud pending)



