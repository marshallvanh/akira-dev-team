# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
No files found

=== PACKAGE.JSON ===
Not found

=== EXISTING FILE CONTENTS ===


=== SUMMARY ===
Files found: 0
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# BACKEND

# Phase 1 Foundation - Stage 1: Project Setup

Starting with the absolute foundation. This stage creates the project directory structure and initializes the GitHub repository.

---

## 📦 Stage 1: Repository & Base Structure

**What this does:**
- Creates `~/projects/brainy-builds` directory
- Initializes Git repository
- Creates initial README with project overview
- Sets up basic folder structure

**Files in this stage:**
1. README.md (project documentation)
2. .gitignore (what Git should ignore)
3. docker-compose.yml (orchestrates all containers)

---

## 📄 File Previews

### 1. README.md
- Project name and description
- Tech stack overview
- Setup instructions placeholder

### 2. .gitignore
- Standard Node.js ignores
- Environment files
- Docker volumes

### 3. docker-compose.yml
- PostgreSQL container definition
- Network setup for services
- Volume mounts for data persistence

---

## ⚡ What Happens Next

After you approve:
1. Creates project directory
2. Initializes Git
3. Creates these 3 files
4. Sets up GitHub remote (marshallvanh/brainy-builds)

**Note:** I won't push to GitHub yet - we'll do that after all foundation files are ready.

---

**Ready? Say "yes" to execute Stage 1.**

💰 *Cost: $0.1220 (7 calls this session)*

---

# DEVOPS

# Phase 1: Foundation - Stage 1 of 4

## Stage 1: GitHub Repository + Project Structure

I'll create the repository and basic folder structure.

---

## 📦 What This Stage Does

1. Creates GitHub repo: `marshallvanh/brainy-builds`
2. Initializes with README
3. Creates basic folder structure
4. Adds .gitignore

---

## 📄 Files Created (3 files)

### **File 1: README.md**
```markdown
# Brainy Builds

Educational app for kids Grade 3-6 featuring AI-generated stories, math challenges, and gamification.

## Tech Stack

- **Mobile:** React Native + Expo
- **Backend:** Node.js + Express + PostgreSQL
- **Infrastructure:** Docker

## Project Structure

- `mobile/` - React Native Expo app
- `backend/` - Node.js API server
- `admin-panel/` - Story review interface
- `docker-compose.yml` - Container orchestration

## Setup

See individual README files in each directory.

## License

Private - Marshall Vanh
```

### **File 2: .gitignore**
```gitignore
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
.expo-shared/
dist/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Database
*.db
*.sqlite
postgres-data/

# Docker
docker-compose.override.yml
```

### **File 3: docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: brainy-builds-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: brainy
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme123}
      POSTGRES_DB: brainy_builds
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U brainy"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: brainy-builds-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://brainy:${DB_PASSWORD:-changeme123}@postgres:5432/brainy_builds
      JWT_SECRET: ${JWT_SECRET:-temp_secret_change_in_production}
      PORT: 3000
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres-data:
```

---

## 🔧 Execution Plan

```bash
# Create project directory
mkdir -p ~/projects/brainy-builds && cd ~/projects/brainy-builds

# Initialize Git
git init

# Create folder structure
mkdir -p mobile backend admin-panel

# Create README.md
cat > README.md << 'EOF'
# Brainy Builds

Educational app for kids Grade 3-6 featuring AI-generated stories, math challenges, and gamification.

## Tech Stack

- **Mobile:** React Native + Expo
- **Backend:** Node.js + Express + PostgreSQL
- **Infrastructure:** Docker

## Project Structure

- `mobile/` - React Native Expo app
- `backend/` - Node.js API server
- `admin-panel/` - Story review interface
- `docker-compose.yml` - Container orchestration

## Setup

See individual README files in each directory.

## License

Private - Marshall Vanh
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
.expo-shared/
dist/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Database
*.db
*.sqlite
postgres-data/

# Docker
docker-compose.override.yml
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: brainy-builds-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: brainy
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme123}
      POSTGRES_DB: brainy_builds
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U brainy"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: brainy-builds-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://brainy:${DB_PASSWORD:-changeme123}@postgres:5432/brainy_builds
      JWT_SECRET: ${JWT_SECRET:-temp_secret_change_in_production}
      PORT: 3000
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres-data:
EOF

# Verify structure
ls -la
```

---

## ✅ Verification

After running, you should see:
```
brainy-builds/
├── .git/
├── .gitignore
├── README.md
├── docker-compose.yml
├── mobile/
├── backend/
└── admin-panel/
```

---

## 🔍 What This Sets Up

- Git repository initialized
- Docker Compose configured for PostgreSQL
- Clean project structure
- Proper gitignore for Node/Expo/Docker

---

**Say YES to run Stage 1 (creates repo structure)**

💰 *Cost: $0.1366 (7 calls this session)*