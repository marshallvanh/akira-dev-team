# TETSUO

Tetsuo here.

Now we're talking. This is a real feature with real technical weight. Let me break it down.

---

## What You're Describing

**Trip Replay** — For any job, the tradie can:

1. Open the job in the app
2. See a map of the workday
3. View the route taken to site (and back home)
4. See a visual "line" of the roads travelled

This is not just tracking. This is **recorded journey playback**.

---

## Technical Requirements

| Component | What's Needed |
|-----------|---------------|
| **GPS capture** | Background location logging at intervals (every 30s–2min while moving) |
| **Geofencing** | Define "site" and "home" zones — triggers job start/end automatically |
| **Route storage** | Array of lat/long coordinates with timestamps, stored per job |
| **Map rendering** | Display route as polyline on a map (MapView in Expo) |
| **Battery management** | Smart polling — high frequency while moving, low/off while stationary |
| **Offline support** | Cache GPS points locally, sync when back online |

---

## Data Model (Simplified)

```typescript
type Job = {
  id: string;
  clientId: string;
  startTime: Date;
  endTime: Date;
  site: GeoPoint;
  route: RoutePoint[];
};

type RoutePoint = {
  lat: number;
  lng: number;
  timestamp: Date;
  speed?: number;
};

type GeoPoint = {
  lat: number;
  lng: number;
  radius: number; // geofence radius in meters
};
```

---

## How It Works (User Flow)

1. **Tradie leaves home** → App detects exit from "home" geofence → Starts recording GPS
2. **Tradie arrives at site** → App detects entry to "site" geofence → Marks job start, continues recording
3. **Tradie leaves site** → App detects exit → Marks job end, records return trip
4. **Tradie arrives home** → App detects entry → Stops recording, saves full route
5. **Later** → Tradie opens job → Sees map with route polyline, timestamps, distance

---

## Tech Stack Implications

| Need | Tool |
|------|------|
| Background location | `expo-location` with background task |
| Geofencing | `expo-location` geofencing API |
| Map display | `react-native-maps` (MapView) |
| Route polyline | Native MapView polyline component |
| Local storage | SQLite or WatermelonDB (offline-first) |
| Cloud sync | Supabase (already in your stack) |

---

## Red Flags

1. **Battery drain** — This is the biggest risk. Background GPS is power-hungry. We need adaptive polling (fast when moving, slow when still).

2. **User permissions** — iOS and Android require explicit "always on" location permission. Many users deny this. Onboarding must explain *why* it matters.

3. **Storage size** — A full day of GPS points adds up. Need to balance accuracy (more points) vs storage (fewer points). Smart compression helps.

4. **Privacy concerns** — You're storing location history. Need clear data policy and user control over deletion.

5. **GPS drift** — Urban canyons, tunnels, poor signal = messy routes. May need smoothing algorithm to clean up the polyline.

---

## Build Sequence for This Feature

**Phase 1 — Location Capture**
- Background GPS logging
- Local storage of route points
- Basic geofence detection (home/site)

**Phase 2 — Job Linking**
- Auto-create job when site geofence entered
- Attach route data to job record
- Sync to Supabase when online

**Phase 3 — Map Playback**
- Display job on map
- Draw route polyline
- Show start/end markers, timestamps, distance

**Phase 4 — Polish**
- Route smoothing
- Mileage calculation (for tax deductions)
- Export route as image or PDF (for invoices/records)

---

## What I Need From You

1. **Confirm this matches your vision** — Anything missing?
2. **Define "home" and "site"** — Does the tradie set these manually once? Or does the app learn them?
3. **How many sites per tradie?** — One regular site? Multiple clients = multiple sites?
4. **Mileage for tax?** — Should we calculate ATO-compliant mileage deductions from this data?

---

This is the core of your "automatic" promise. Get this right, and everything else (invoices, tax summaries) flows from it.

What's your call, Marshall?

---

# RESEARCH

# Research Report: Geofencing + GPS Route History for Tradie OS

---

## 1. Research Question

How should Tradie OS implement geofencing and GPS tracking so users can view previous jobs on a map with the exact route taken to and from site?

---

## 2. Options Considered

| Approach | Description | Examples |
|----------|-------------|----------|
| **Native GPS + Geofencing** | Build custom using Expo Location API + device GPS | Custom implementation |
| **Radar.io** | Third-party SDK for geofencing, trip tracking, route history | Radar SDK |
| **Google Maps Platform** | Maps display + Routes API for visualization | Google Maps SDK |
| **allGeo / Timeero pattern** | Background pings stored as breadcrumb trail, rendered on map | Field service app model |
| **Hybrid approach** | Expo Location for capture + Mapbox/Google for display | Most flexible |

---

## 3. Comparison and Tradeoffs

| Factor | Native Only | Radar.io | Google Maps | Hybrid (Recommended) |
|--------|-------------|----------|-------------|----------------------|
| **Geofencing** | Yes — Expo supports it | Yes — core feature | No — display only | Yes |
| **Background tracking** | Yes — but battery tricky | Yes — optimized | No | Yes |
| **Route breadcrumbs** | Manual implementation | Built-in trip tracking | No | Manual + display |
| **Map visualization** | Need separate library | Basic maps included | Excellent | Excellent |
| **Battery efficiency** | You manage it | They optimize it | N/A | Mixed |
| **Cost** | Free (dev time) | Free tier, then paid | Pay per request | Moderate |
| **Offline support** | You build it | Limited | Limited | You build it |
| **Control over data** | Full | Their servers | Their servers | Full |

**Key insight:** The "breadcrumb trail" pattern is standard — store GPS pings every X seconds/meters, then render as a polyline on a map. This is how Timeero, busybusy, and field service apps do it.

---

## 4. Risks and Gotchas

### Battery Drain — The Big One
Background GPS is a battery killer. Solutions:
- Use significant location change monitoring (less accurate, much lighter)
- Poll every 30-60 seconds instead of continuous
- Use geofence entry/exit as triggers to start/stop detailed tracking
- **Tradie OS angle:** Only track when "on the clock" or within job geofence radius

### Permission Trust
iOS and Android now aggressively warn users about background location. You need:
- Clear onboarding explaining why you need it
- "Always allow" permission (hardest to get)
- Fallback if user only grants "while using"

### Accuracy vs. Battery Tradeoff
| Mode | Accuracy | Battery Impact |
|------|----------|----------------|
| High accuracy GPS | ~10m | High |
| Balanced | ~50m | Medium |
| Significant change only | ~100m+ | Low |

For route display, balanced mode is usually enough. Users don't need sub-meter precision to see "I drove down Main St to the job."

### Storage and Sync
A full day of GPS pings (every 30 sec) = ~1,000-2,000 points. Not huge, but:
- Store locally first (offline-first)
- Sync to Supabase when on WiFi or periodically
- Compress old routes (simplify polylines after 30 days)

### Map Rendering Costs
Google Maps and Mapbox charge per map load and per directions request. For MVP:
- Use free tiers (Google: 28,000 loads/month free; Mapbox: 50,000)
- Cache rendered routes
- Don't call Directions API — just draw the breadcrumbs as a polyline

---

## 5. Recommendation

**Use a hybrid approach:**

| Component | Tool | Why |
|-----------|------|-----|
| **Geofencing** | Expo Location (native) | Free, works offline, you control it |
| **Background GPS capture** | Expo Location with balanced accuracy | Store breadcrumbs locally |
| **Map display** | react-native-maps (Google or Apple Maps) | Free tier sufficient for MVP |
| **Route visualization** | Polyline from stored breadcrumbs | No Directions API cost |
| **Job detection** | Geofence triggers | Auto-start tracking when entering saved job site |

### How It Works for the Tradie

1. **Setup:** Tradie saves a job site address → app geocodes it → creates geofence (e.g., 100m radius)
2. **Auto-tracking:** Tradie drives toward site → enters geofence → app starts logging GPS breadcrumbs
3. **On-site:** Breadcrumbs continue while at job
4. **Departure:** Tradie leaves geofence → app logs exit time, continues tracking until home geofence
5. **Review:** Tradie opens old job → sees map with polyline route (drive in, on-site, drive out)

### Data Model Sketch

```
Job {
  id
  client_id
  site_location (lat/lng)
  geofence_radius
}

Trip {
  id
  job_id
  started_at
  ended_at
  breadcrumbs: [{ lat, lng, timestamp }]
}
```

---

## 6. Sources

- Expo Location API: Background location + geofencing support
- Radar.io: Geofencing and trip tracking SDK
- Timeero, busybusy, FieldServicely: Field service app patterns
- Google Maps Platform: Pricing and free tier limits
- Mapbox: Pricing and free tier limits
- TrackTik, allGeo: Geofence + GPS best practices for field apps
- LiveViewGPS, Linxup: Battery optimization strategies

---

## Bottom Line

You don't need a third-party service for MVP. Expo Location handles geofencing and background GPS. Store breadcrumbs locally, sync to Supabase, render on a map with react-native-maps.

**The key UX win:** Tradie opens a past job, taps "View Route," sees a map with the exact line they drove — no manual logging required. That's the zero-input promise delivered.

Ready to spec this out in detail when you are, Marshall.

---

# ARCHITECT

Tetsuo here.

That's a strong feature. Let me break down what you're actually asking for.

---

## What You Want

When a tradie opens a past job, they see:

1. **A map** — showing the job site location
2. **A route line** — the actual roads taken to get there and back home
3. **Historical record** — every job becomes a visual, reviewable trip log

This is **trip reconstruction from GPS breadcrumbs** — not just geofencing.

---

## Technical Breakdown

| Component | What It Does | Technical Requirement |
|-----------|--------------|----------------------|
| **Geofencing** | Detects arrival/departure at known sites | Background location API, defined zones |
| **GPS breadcrumb tracking** | Records position at intervals during travel | Background location polling (every 30-60 sec) |
| **Route storage** | Saves array of lat/lng points per trip | Local DB + cloud sync |
| **Map rendering** | Displays job site + route polyline | React Native Maps or Mapbox |
| **Trip segmentation** | Splits day into: home → travel → site → travel → home | Logic layer using geofences + motion state |

---

## How It Would Work

```
6:45am — Tradie leaves home (geofence exit detected)
6:45-7:30am — GPS breadcrumbs recorded every 30 seconds
7:30am — Arrives at job site (geofence entry detected)
7:30am-4:00pm — On site (minimal tracking, saves battery)
4:00pm — Leaves site (geofence exit detected)
4:00-4:45pm — GPS breadcrumbs recorded
4:45pm — Arrives home (geofence entry detected)

Result: Job record now contains:
- Site location
- Arrival/departure times
- Full route polyline (outbound + return)
- Calculated distance (for mileage claims)
```

---

## What Gets Stored Per Job

```javascript
{
  job_id: "abc123",
  client: "Mrs. Patterson",
  site: {
    address: "14 Baxter St, Thornbury VIC 3071",
    lat: -37.7544,
    lng: 144.9980
  },
  trips: [
    {
      direction: "outbound",
      started_at: "2025-01-15T06:45:00Z",
      ended_at: "2025-01-15T07:30:00Z",
      distance_km: 12.4,
      breadcrumbs: [
        { lat: -37.7701, lng: 144.9631, timestamp: "2025-01-15T06:45:00Z" },
        { lat: -37.7685, lng: 144.9650, timestamp: "2025-01-15T06:45:30Z" },
        // ... every 30 seconds
      ]
    },
    {
      direction: "return",
      started_at: "2025-01-15T16:00:00Z",
      ended_at: "2025-01-15T16:45:00Z",
      distance_km: 13.1,
      breadcrumbs: [ ... ]
    }
  ],
  time_on_site: "8h 30m",
  created_at: "2025-01-15T07:30:00Z"
}
```

---

## Battery & Privacy Considerations

| Concern | Mitigation |
|---------|------------|
| **Battery drain** | Only track during travel (detected via geofence + motion). Sleep on site. |
| **Storage size** | Breadcrumbs compress well. ~2KB per trip. |
| **Privacy** | User owns all data. Clear consent during onboarding. Option to delete history. |
| **Accuracy** | 30-second intervals balance accuracy vs battery. Can snap to roads using Google Roads API if needed. |

---

## What This Enables

1. **Mileage claims** — Automatic, defensible, ATO-ready
2. **Job history** — Visual proof of attendance
3. **Dispute protection** — "I was there from 7:30am to 4:00pm, here's the map"
4. **Invoice justification** — Attach trip summary to client invoice

---

## Open Questions For You

1. **Home location** — Do we ask for this explicitly, or learn it over time?
2. **Multiple job sites per day** — Should we handle site-to-site trips, or just home-to-site-to-home for MVP?
3. **Route display** — Raw breadcrumbs (jagged line) or road-snapped (clean line, requires API call)?
4. **Offline behavior** — Store locally and sync later, or require connectivity?

---

## My Recommendation

This feature is core to your "automatic" promise. It's also one of the hardest to get right.

**For MVP:**
- Home geofence (explicit)
- Job site geofences (created on first visit or manually)
- GPS breadcrumbs during travel only
- Raw polyline display (no road snapping yet)
- Offline-first storage, background sync

**Post-MVP:**
- Road snapping for cleaner maps
- Multi-site day support
- Learned locations (frequent sites auto-detected)

---

Ready to move this to Abby for architecture design, or do you want to answer those open questions first?

---

# FRONTEND

Got it, Marshall. You want to incorporate geofencing and GPS tracking in Tradie OS. This will allow users to:

- Automatically track routes taken to job sites and back home
- View a map with a visual line showing the path traveled
- Link this data to specific jobs for easy review

---

# Here's How We Can Implement This

## Technical Breakdown

### Key Features

1. **Geofencing**
   - Define virtual boundaries around job sites.
   - Trigger automatic job start/stop based on entering/exiting these zones.

2. **GPS Tracking**
   - Continuously track the user's location while en route to and from job sites.
   - Capture coordinates to map routes taken.

3. **Map Visualization**
   - Display the traveled route on a map within the app.
   - Allow users to review past routes associated with each job.

### Implementation Steps

1. **Location Permissions**
   - Request background location access from users during onboarding.
   - Explain the benefits clearly to gain trust (e.g., automatic job tracking).

2. **Geofencing Setup**
   - Use APIs like Google Maps Geofencing API or similar to define job site boundaries.
   - Handle entering/exiting events to start/stop job timers automatically.

3. **Continuous GPS Tracking**
   - Capture GPS coordinates at regular intervals while traveling.
   - Use efficient polling to minimize battery usage.

4. **Data Storage**
   - Store captured routes locally and/or in the cloud (consider data privacy and storage limits).

5. **Map Integration**
   - Use a library like Mapbox or Google Maps SDK to render route lines on a map.
   - Ensure route lines are clear and distinguishable.

### Red Flags to Address

- **Battery Drain**: Continuous GPS tracking can be resource-intensive. Implement smart polling to reduce impact.
- **User Privacy**: Be transparent about data usage. Allow users to opt-in and have control over their data.
- **Accuracy**: GPS can be imprecise in certain environments (e.g., dense urban areas). Test and adjust algorithms to handle variances.

---

## Backend Dependencies

- **Location APIs**: To handle GPS and geofencing.
- **Map Services**: For rendering maps and visualizing routes.
- **Data Storage**: For storing location data linked to jobs.

---

## Next Steps for You

1. **Confirm the importance**: Is this feature a "must-have" for MVP or a "nice-to-have" for later iterations?
2. **User Stories**: Define specific user stories around this feature. What exactly does the user see and do with route data?
3. **Validate with Users**: Make sure this feature resonates with your initial user base. Early feedback will guide prioritization.

---

## What to Check

- **Functionality**: Ensure the app correctly starts/stops job tracking based on geofence events.
- **Map Accuracy**: Verify that the map displays accurate routes with minimal errors.
- **Battery Usage**: Test on multiple devices to ensure battery consumption is reasonable.

Let me know how you want to proceed or if there's anything else you need clarified!