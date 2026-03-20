# TETSUO

Tetsuo here. Good decisions. Let me lock these in.

---

## Final Decisions Captured

| Question | Your Answer | What It Means |
|----------|-------------|---------------|
| **Multi-stop days** | Handle site-to-site | App tracks Office → Site A → Site B → Office as separate trip segments, all linked to their respective jobs |
| **Route display** | Road-snapped | Route line follows actual roads like Google/Apple Maps, not a jagged point-to-point line |

---

## What Road-Snapping Looks Like

You nailed the description. Here's the difference:

| Type | Visual | How It Works |
|------|--------|--------------|
| **Raw breadcrumbs** | Jagged line cutting across blocks, sometimes through buildings | Just connects GPS dots every 30 seconds |
| **Road-snapped** | Clean line that follows the actual streets you drove | GPS points get matched to real roads via an API |

You want the second one. Professional, clear, defensible for mileage claims.

---

## Technical Implication

Road-snapping requires an API call:

| Option | Cost | Quality |
|--------|------|---------|
| **Google Roads API** | $0.01 per 100 points snapped | Excellent accuracy |
| **Mapbox Map Matching** | Free tier available, then usage-based | Very good accuracy |

For a typical 45-minute drive with points every 30 seconds, that's ~90 points per trip. Roughly $0.009 per trip with Google. Negligible cost.

**My recommendation:** Start with Google Roads API. It's what Google Maps uses. Familiar look for users.

---

## Red Flag Addressed

Road-snapping adds a small delay when saving trips (API call needed). We'll do this:

1. Save raw breadcrumbs immediately (offline-safe)
2. Snap to roads when syncing to cloud (background task)
3. User sees clean route when they open the job later

No waiting. No data loss if offline.

---

## Confirmed Scope for MVP

| Feature | Included |
|---------|----------|
| Office location in profile | ✓ |
| Multiple sites per client | ✓ |
| Geofence triggers for office + all sites | ✓ |
| Background GPS tracking while traveling | ✓ |
| Multi-stop trip segmentation (site-to-site) | ✓ |
| Road-snapped route display | ✓ |
| Trip linked to correct job automatically | ✓ |

---

## Build Sequence

| Phase | What Gets Built |
|-------|-----------------|
| **Phase 1** | Office setup in profile, geofence creation, background GPS capture |
| **Phase 2** | Trip segmentation logic (detect site entries/exits, link to jobs) |
| **Phase 3** | Cloud sync + road-snapping via Google Roads API |
| **Phase 4** | Map view with route polyline display |

---

## Next Step

All questions answered. Scope is locked.

I'm handing this to **Architect** to design:
- Data flow diagram
- Folder structure
- Screen map
- API endpoints

Once architecture is approved, we build Phase 1.

Ready for me to brief Architect?

---

# BACKEND

Great, thanks for clarifying, Marshall. Here's how we'll proceed based on your decisions:

---

## Finalized Decisions

1. **Multi-stop Days**:
   - We'll support multi-stop days for the MVP.
   - This means handling trips like Office → Site A → Site B → Office.

2. **Route Display**:
   - We'll implement road-snapped routes.
   - This will ensure the map shows clean lines that follow actual roads, similar to Google Maps or Apple Maps.

---

## Updated Plan

### Implementation Steps

1. **Geofencing Setup**:
   - Define geofences for "Office" and each job site.
   - Handle trigger events for entering/exiting any geofence.

2. **Background GPS Tracking**:
   - Capture GPS points at intervals while moving.
   - Implement logic for multi-stop days.

3. **Data Storage & Sync**:
   - Associate GPS data with jobs and store in Supabase.
   - Ensure data syncs properly from local to cloud.

4. **Map Integration**:
   - Use Google Maps API to render road-snapped route lines.
   - Ensure the map clearly shows traveled roads for each job trip.

### Tech Stack

- **Geofencing & GPS**: Expo Location API
- **Map Rendering**: Google Maps API for road-snapping
- **Data Storage**: Supabase for cloud syncing
- **Local Storage**: SQLite or similar for offline-first storage

---

## Next Steps

1. **Architectural Design**:
   - I'll have Architect design the data flow and system components to support multi-stop and road-snapped routes.

2. **Phase 1 Build**:
   - Geofencing setup, GPS tracking, and office setup in profile.
   - Start with the backend logic for handling multi-stop days.

3. **Testing & Validation**:
   - Validate the route display accuracy using the Google Maps API.
   - Ensure the user experience aligns with expectations.

---

## What to Check

- Verify that the app tracks multi-stop days correctly.
- Ensure the map displays road-snapped routes accurately.
- Test the end-to-end flow from leaving the office to returning.

---

I'll move forward with the architectural design based on these specs. If you have any other thoughts or changes, just let me know!

---

# FRONTEND

Got it, Marshall.

---

# Final Decisions

1. **Multi-stop Days**: 
   - Implement site-to-site handling for MVP.
   - Trips can be: Office → Site A → Site B → Office.

2. **Route Display**:
   - Use road-snapped lines for clarity.
   - Leverage Google Maps or Apple Maps visual style for traveled roads.

---

# Updated Plan

## Technical Requirements

- **Data Model**:
  - Support multiple trips in one day.
  - Accurately segment trips between sites.

- **GPS Tracking**:
  - Capture and store breadcrumbs efficiently.
  - Implement road-snapping using Google Roads API to ensure clean route lines.

- **Map Display**:
  - Use Google Maps SDK to render routes that appear like traditional maps.
  - Ensure polylines follow roads accurately.

---

## Backend Dependencies

- **Google Roads API**: For converting raw GPS breadcrumbs into road-following polylines.
- **Google Maps SDK**: For map rendering with road-snapped routes.

---

## Next Steps

1. **Architectural Design**:
   - I'll have Architect map out the data flow, folder structure, and screen connections.
   - Ensure system supports multi-stop trip segmentation and road-snapping.

2. **Phase 1 Development**:
   - Begin with geofence setup and background GPS capture.
   - Implement map view with road-snapped route display.

---

## What to Check

- Ensure the app correctly segments trips and links them to jobs.
- Verify road-snapped routes display accurately on the map.
- Test multi-stop days to ensure all segments are captured and displayed.

---

## Timeline

- **Architecture**: 1 week
- **Phase 1 Build**: 3-4 weeks (including road-snapping implementation)
- **Testing & Feedback**: 1-2 weeks

Total: ~6-7 weeks for MVP delivery.

---

I'll move this to the Architect and get the system design ready. If there's anything else you need, just let me know!

---

# REVIEWER

Tetsuo here.

Perfect. Both questions answered. Let me lock this in.

---

## Final Decisions Captured

| Question | Your Answer | What It Means |
|----------|-------------|---------------|
| **Multi-stop days** | Handle site-to-site | App tracks Office → Site A → Site B → Office as separate trip segments, all linked to their respective jobs |
| **Route display** | Road-snapped (clean lines) | Route looks like Google Maps directions — follows actual roads, not jagged GPS dots |

---

## What Road-Snapping Looks Like

You nailed it. Exactly like Google Maps or Apple Maps.

| Raw Breadcrumbs | Road-Snapped |
|-----------------|--------------|
| GPS points connected with straight lines | GPS points matched to actual roads |
| Cuts through buildings, parks, corners | Follows streets cleanly |
| Looks like a kid drew it | Looks professional |

We'll use **Google Roads API** to snap your GPS breadcrumbs to real roads. Small cost per call, but worth it for the clean look.

---

## Updated Scope for MVP

| Feature | Included |
|---------|----------|
| Office location in profile | ✅ |
| Multiple sites per client | ✅ |
| Geofence triggers (auto start/stop) | ✅ |
| Background GPS tracking | ✅ |
| Multi-stop day handling | ✅ |
| Road-snapped route display | ✅ |
| Trip segments linked to jobs | ✅ |

---

## How Multi-Stop Days Work

```
6:30am — Leave Office → GPS starts
7:15am — Arrive Site A (Mrs. Patterson) → Trip 1 saved, Job A starts
11:00am — Leave Site A → GPS starts, Job A ends
11:45am — Arrive Site B (Mr. Collins) → Trip 2 saved, Job B starts
4:00pm — Leave Site B → GPS starts, Job B ends
4:30pm — Arrive Office → Trip 3 saved, day complete
```

Each job gets its own inbound and outbound trip. Clean separation.

---

## Next Steps

1. **Architect** designs full system — data flow, folder structure, screen map
2. **Backend** specs the database schema and Google Roads API integration
3. **Frontend** specs the map UI and profile "Office" field
4. **Build Phase 1** begins

I'll kick this to Architect now.

Anything else before we move to architecture, Marshall?