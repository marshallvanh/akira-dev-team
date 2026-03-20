# TETSUO

Tetsuo here. Handing off to Architect now.

---

# Architect Brief

**Project:** TradeMate — Job tracking app for solo tradies

**User:** Dave, electrician, works alone, needs to track jobs, travel, and hours automatically

**Platform:** Mobile app (React Native + Expo), Supabase backend

---

## Confirmed Scope for MVP

| Feature | Description |
|---------|-------------|
| Office location in profile | User sets home/office address once |
| Multiple sites per client | Each client can have many job sites |
| Geofence triggers | Auto-detect arrival/departure at office and sites |
| Background GPS tracking | Capture breadcrumbs while traveling |
| Multi-stop day handling | Office → Site A → Site B → Office as separate trip segments |
| Road-snapped route display | Clean route lines via Google Roads API |
| Trip-to-job linking | Each trip automatically linked to correct job |

---

## Data Entities Confirmed

- **User** (profile, office address, settings)
- **Client** (name, contact info)
- **Site** (belongs to client, has address + geofence)
- **Job** (belongs to site, has status, dates, notes)
- **Trip** (belongs to job, has start/end, raw breadcrumbs, snapped route)
- **Breadcrumb** (lat, lng, timestamp, belongs to trip)

---

## Technical Constraints

- Offline-first (tradie may lose signal on site)
- Background location tracking (app not always in foreground)
- Google Roads API for route snapping (called during sync, not real-time)
- Supabase for auth, database, storage
- Expo Location API for geofencing and GPS

---

# Architect — Deliver the Following

1. **Data Flow Diagram** — How data moves from GPS capture → local storage → cloud sync → display
2. **Database Schema** — Full table structure for Supabase
3. **Folder Structure** — Project organization for React Native app
4. **Screen Map** — All screens, what they do, how they connect
5. **API Endpoints** — What the backend needs to expose
6. **Sync Strategy** — How offline data gets reconciled with cloud

---

Architect, you're up. Design the system.

---

# Architect Response

Architect here. Taking the brief. Designing now.

---

## 1. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │ Geofence    │───▶│ Trip State  │───▶│ Local SQLite DB     │ │
│  │ Triggers    │    │ Manager     │    │ (offline-first)     │ │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘ │
│                                                   │             │
│  ┌─────────────┐                                  │             │
│  │ Background  │──────────────────────────────────┤             │
│  │ GPS Capture │                                  │             │
│  └─────────────┘                                  │             │
│                                                   ▼             │
│                                        ┌─────────────────────┐  │
│                                        │ Sync Manager        │  │
│                                        │ (when online)       │  │
│                                        └──────────┬──────────┘  │
│                                                   │             │
└───────────────────────────────────────────────────┼─────────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE CLOUD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │ Auth        │    │ PostgreSQL  │    │ Storage             │ │
│  │ (user login)│    │ (all data)  │    │ (photos if needed)  │ │
│  └─────────────┘    └──────┬──────┘    └─────────────────────┘ │
│                            │                                    │
│                            ▼                                    │
│                 ┌─────────────────────┐                        │
│                 │ Edge Function:      │                        │
│                 │ Road Snap Service   │                        │
│                 │ (calls Google API)  │                        │
│                 └─────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema (Supabase PostgreSQL)

```sql
-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  trade TEXT,
  office_address TEXT,
  office_lat DECIMAL(10, 7),
  office_lng DECIMAL(10, 7),
  office_geofence_radius INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITES
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  geofence_radius INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  scheduled_date DATE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIPS
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  origin_type TEXT NOT NULL, -- 'office' or 'site'
  origin_site_id UUID REFERENCES sites(id),
  destination_type TEXT NOT NULL, -- 'office' or 'site'
  destination_site_id UUID REFERENCES sites(id),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  distance_meters INTEGER,
  duration_seconds INTEGER,
  snapped_route JSONB, -- GeoJSON LineString after road-snapping
  sync_status TEXT DEFAULT 'pending', -- pending, synced, snap_pending
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BREADCRUMBS
CREATE TABLE breadcrumbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  accuracy DECIMAL(6, 2),
  speed DECIMAL(6, 2),
  heading DECIMAL(5, 2),
  captured_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_sites_client ON sites(client_id);
CREATE INDEX idx_jobs_site ON jobs(site_id);
CREATE INDEX idx_jobs_user ON jobs(user_id);
CREATE INDEX idx_trips_job ON trips(job_id);
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_breadcrumbs_trip ON breadcrumbs(trip_id);
CREATE INDEX idx_breadcrumbs_captured ON breadcrumbs(captured_at);
```

---

## 3. Folder Structure (React Native + Expo)

```
trademate/
├── app/                          # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Dashboard / Today view
│   │   ├── jobs.tsx              # Job list
│   │   ├── clients.tsx           # Client list
│   │   └── profile.tsx           # User profile + office setup
│   ├── job/
│   │   ├── [id].tsx              # Job detail (with map)
│   │   └── new.tsx               # Create job
│   ├── client/
│   │   ├── [id].tsx              # Client detail + sites
│   │   └── new.tsx               # Create client
│   ├── site/
│   │   ├── [id].tsx              # Site detail
│   │   └── new.tsx               # Create site
│   └── _layout.tsx               # Root layout
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Map.tsx               # Map component wrapper
│   ├── jobs/
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   └── JobStatusBadge.tsx
│   ├── trips/
│   │   ├── TripCard.tsx
│   │   ├── TripMap.tsx           # Shows route polyline
│   │   └── TripSummary.tsx
│   └── geofence/
│       └── GeofenceStatus.tsx    # Shows current tracking state
│
├── services/
│   ├── location/
│   │   ├── geofencing.ts         # Geofence setup and triggers
│   │   ├── tracking.ts           # Background GPS capture
│   │   └── permissions.ts        # Location permission handling
│   ├── sync/
│   │   ├── syncManager.ts        # Coordinates all sync operations
│   │   ├── tripSync.ts           # Trip-specific sync logic
│   │   └── roadSnap.ts           # Google Roads API integration
│   └── api/
│       ├── supabase.ts           # Supabase client setup
│       ├── clients.ts            # Client CRUD
│       ├── sites.ts              # Site CRUD
│       ├── jobs.ts               # Job CRUD
│       └── trips.ts              # Trip CRUD
│
├── stores/                       # State management (Zustand)
│   ├── authStore.ts
│   ├── locationStore.ts          # Current tracking state
│   ├── jobStore.ts
│   └── syncStore.ts              # Sync queue and status
│
├── db/                           # Local SQLite
│   ├── schema.ts                 # Local table definitions
│   ├── migrations.ts             # Version migrations
│   └── queries.ts                # Common queries
│
├── hooks/
│   ├── useLocation.ts
│   ├── useGeofence.ts
│   ├── useSync.ts
│   └── useJob.ts
│
├── utils/
│   ├── geo.ts                    # Distance calculations, geofence math
│   ├── dates.ts                  # Date formatting
│   └── formatting.ts             # Display formatting
│
├── constants/
│   ├── colors.ts
│   ├── config.ts                 # API keys, feature flags
│   └── geofence.ts               # Default radius, etc.
│
└── types/
    ├── database.ts               # Supabase generated types
    ├── location.ts               # GPS and geofence types
    └── navigation.ts             # Route params
```

---

## 4. Screen Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTH FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐      ┌──────────┐      ┌──────────────────────┐  │
│  │ Login    │─────▶│ Register │─────▶│ Main App (tabs)      │  │
│  └──────────┘      └──────────┘      └──────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        MAIN TABS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Today    │  │ Jobs     │  │ Clients  │  │ Profile  │       │
│  │ (home)   │  │ (list)   │  │ (list)   │  │ (settings)│      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │              │              │
│       │             ▼             ▼              ▼              │
│       │       ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│       │       │ Job      │  │ Client   │  │ Office Setup │     │
│       │       │ Detail   │  │ Detail   │  │ (address)    │     │
│       │       └────┬─────┘  └────┬─────┘  └──────────────┘     │
│       │            │             │                              │
│       │            ▼             ▼                              │
│       │       ┌──────────┐  ┌──────────┐                       │
│       │       │ Trip Map │  │ Site     │                       │
│       │       │ (route)  │  │ Detail   │                       │
│       │       └──────────┘  └──────────┘                       │
│       │                                                         │
│       ▼                                                         │
│  ┌────────────────────────────────────────────┐                │
│  │ Today Screen shows:                        │                │
│  │ - Current tracking status                  │                │
│  │ - Active job (if on site)                  │                │
│  │ - Today's completed trips                  │                │
│  │ - Quick actions (start job, view map)      │                │
│  └────────────────────────────────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen

---

# ARCHITECT

Architect here. Taking the handoff from Tetsuo.

I've reviewed the locked scope. Now I'll design the full system before any code gets written.

---

# System Architecture: TradeMate GPS Tracking

## 1. System Overview

**What we're building:**
A mobile app feature that automatically tracks a tradie's travel between their office and job sites, captures GPS breadcrumbs, segments trips by job, and displays clean road-snapped routes on a map.

**Core components:**
- Mobile app (React Native / Expo)
- Background location service
- Local SQLite database (offline-first)
- Supabase cloud backend
- Google Roads API (road-snapping)
- Google Maps SDK (map display)

---

## 2. Folder Structure

```
trademate/
├── app/                          # Expo Router screens
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Dashboard / today's jobs
│   │   ├── jobs.tsx              # Job list
│   │   ├── clients.tsx           # Client list
│   │   └── profile.tsx           # User profile (office setup here)
│   ├── job/
│   │   ├── [id].tsx              # Job detail screen
│   │   └── [id]/
│   │       └── trip.tsx          # Trip map view for a job
│   ├── client/
│   │   ├── [id].tsx              # Client detail
│   │   └── [id]/
│   │       └── site/
│   │           └── [siteId].tsx  # Site detail / edit
│   └── _layout.tsx
│
├── src/
│   ├── components/
│   │   ├── map/
│   │   │   ├── TripMap.tsx       # Renders road-snapped route
│   │   │   └── GeofenceIndicator.tsx
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx
│   │   │   └── JobList.tsx
│   │   ├── clients/
│   │   │   ├── ClientCard.tsx
│   │   │   └── SiteList.tsx
│   │   └── profile/
│   │       └── OfficeSetup.tsx   # Office address input + map preview
│   │
│   ├── services/
│   │   ├── location/
│   │   │   ├── geofence.ts       # Geofence creation + monitoring
│   │   │   ├── tracking.ts       # Background GPS capture
│   │   │   └── permissions.ts    # Location permission handling
│   │   ├── trips/
│   │   │   ├── segmentation.ts   # Detects trip start/end, links to jobs
│   │   │   └── roadSnap.ts       # Google Roads API integration
│   │   ├── sync/
│   │   │   ├── syncManager.ts    # Handles offline → cloud sync
│   │   │   └── conflictResolver.ts
│   │   └── api/
│   │       ├── supabase.ts       # Supabase client
│   │       └── googleRoads.ts    # Roads API client
│   │
│   ├── database/
│   │   ├── schema.ts             # SQLite table definitions
│   │   ├── migrations/
│   │   │   └── 001_initial.ts
│   │   ├── repositories/
│   │   │   ├── userRepo.ts
│   │   │   ├── clientRepo.ts
│   │   │   ├── siteRepo.ts
│   │   │   ├── jobRepo.ts
│   │   │   ├── tripRepo.ts
│   │   │   └── breadcrumbRepo.ts
│   │   └── db.ts                 # Database connection
│   │
│   ├── hooks/
│   │   ├── useLocation.ts        # Location state + permissions
│   │   ├── useGeofence.ts        # Geofence event handling
│   │   ├── useActiveTrip.ts      # Current trip state
│   │   └── useSync.ts            # Sync status
│   │
│   ├── stores/
│   │   ├── userStore.ts          # Zustand store for user/profile
│   │   ├── tripStore.ts          # Active trip state
│   │   └── syncStore.ts          # Sync queue state
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── client.ts
│   │   ├── site.ts
│   │   ├── job.ts
│   │   ├── trip.ts
│   │   └── breadcrumb.ts
│   │
│   └── utils/
│       ├── geo.ts                # Distance calculations, point-in-polygon
│       ├── time.ts               # Duration formatting
│       └── constants.ts          # Geofence radius, tracking interval, etc.
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql       # Cloud database schema
│   └── functions/
│       └── snap-route/           # Edge function for road-snapping
│           └── index.ts
│
└── outputs/
    └── architecture/
        └── system-design.md      # This document
```

---

## 3. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MOBILE APP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │   Profile    │    │    Jobs      │    │   Clients    │                 │
│   │   Screen     │    │   Screen     │    │   Screen     │                 │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                   │                          │
│          ▼                   ▼                   ▼                          │
│   ┌─────────────────────────────────────────────────────┐                  │
│   │                    LOCAL DATABASE                    │                  │
│   │                      (SQLite)                        │                  │
│   │  ┌────────┐ ┌────────┐ ┌───────┐ ┌──────┐ ┌──────┐ │                  │
│   │  │ Users  │ │Clients │ │ Sites │ │ Jobs │ │Trips │ │                  │
│   │  └────────┘ └────────┘ └───────┘ └──────┘ └──────┘ │                  │
│   │                              ┌─────────────┐        │                  │
│   │                              │ Breadcrumbs │        │                  │
│   │                              └─────────────┘        │                  │
│   └─────────────────────────────────────────────────────┘                  │
│          ▲                                                                  │
│          │                                                                  │
│   ┌──────┴───────┐                                                         │
│   │  BACKGROUND  │                                                         │
│   │   SERVICES   │                                                         │
│   │              │                                                         │
│   │ ┌──────────┐ │    Geofence Event                                       │
│   │ │ Geofence │◄├────────────────────┐                                    │
│   │ │ Monitor  │ │                    │                                    │
│   │ └────┬─────┘ │                    │                                    │
│   │      │       │              ┌─────┴─────┐                              │
│   │      │ Start/│              │   OS      │                              │
│   │      │ Stop  │              │ Location  │                              │
│   │      ▼       │              │ Services  │                              │
│   │ ┌──────────┐ │                    │                                    │
│   │ │   GPS    │◄├────────────────────┘                                    │
│   │ │ Tracker  │ │    GPS Coordinates                                      │
│   │ └──────────┘ │                                                         │
│   └──────────────┘                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Sync (when online)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUD (Supabase)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────┐                  │
│   │                   POSTGRES DATABASE                  │                  │
│   │  ┌────────┐ ┌────────┐ ┌───────┐ ┌──────┐ ┌──────┐ │                  │
│   │  │ Users  │ │Clients │ │ Sites │ │ Jobs │ │Trips │ │                  │
│   │  └────────┘ └────────┘ └───────┘ └──────┘ └──────┘ │                  │
│   │                              ┌─────────────┐        │                  │
│   │                              │ Breadcrumbs │        │                  │
│   │                              └──────┬──────┘        │                  │
│   └─────────────────────────────────────┼───────────────┘                  │
│                                         │                                   │
│                                         │ Trigger                           │
│                                         ▼                                   │
│   ┌─────────────────────────────────────────────────────┐                  │
│   │                   EDGE FUNCTION                      │                  │
│   │                   snap-route                         │                  │
│   │                                                      │                  │
│   │   1. Receives raw breadcrumbs                       │                  │
│   │   2. Calls Google Roads API                         │                  │
│   │   3. Saves snapped polyline back to trip            │                  │
│   └─────────────────────────────────────────────────────┘                  │
│                         │                                                   │
│                         ▼                                                   │
│              ┌─────────────────────┐                                       │
│              │  Google Roads API   │                                       │
│              └─────────────────────┘                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

### Local (SQLite)

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  trade TEXT,
  office_address TEXT,
  office_lat REAL,
  office_lng REAL,
  office_geofence_radius INTEGER DEFAULT 100,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT
);

-- Clients table
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sites table (multiple per client)
CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  geofence_radius INTEGER DEFAULT 100,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Jobs table
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'scheduled',
  scheduled_date TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Trips table
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  job_id TEXT,
  origin_type TEXT NOT NULL,        -- 'office' or 'site'
  origin_id TEXT,                    -- site_id if origin is a site
  destination_type TEXT NOT NULL,   -- 'office' or 'site'
  destination_id TEXT,               -- site_id if destination is a site
  started_at TEXT NOT NULL,
  ended_at TEXT,
  distance_meters INTEGER,
  duration_seconds INTEGER,
  snapped_polyline TEXT,            -- Encoded polyline after road-snapping
  snap_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'complete', 'failed'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Breadcrumbs table (raw GPS points)
CREATE TABLE breadcrumbs (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  accuracy REAL,
  speed REAL,
  heading REAL,
  altitude REAL,
  timestamp TEXT NOT NULL,
  synced_at TEXT,
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- Sync queue table
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL,             -- 'insert', 'update', 'delete'
  payload TEXT,                      -- JSON of the record
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TEXT,
  error TEXT
);
```

### Cloud (Supabase Postgres)

Same schema as above, with additional:

```sql
-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE breadcrumbs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

-- Similar policies for other tables...

-- Trigger to call road-snapping function when trip syncs
CREATE OR REPLACE FUNCTION trigger_road_snap()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.snap_status = 'pending' AND NEW.ended_at IS NOT NULL THEN
    PERFORM net.http