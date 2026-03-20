# TETSUO

Tetsuo here.

Good calls. Let me lock this in.

---

## Decisions Captured

| Question | Your Answer | Implementation |
|----------|-------------|----------------|
| **Home location** | Set in profile as "Office" | Single address field in user profile. Geofence created from this. |
| **Future enhancement** | Learn frequent departure points | Post-MVP: detect patterns, suggest "You leave from here often — save as office?" |
| **Job sites** | Multiple sites per client | Client has many Sites. Each Site gets its own geofence. |

---

## Updated Data Model

```javascript
// User Profile
{
  user_id: "u_001",
  name: "Dave",
  trade: "Electrician",
  office: {
    address: "12 Smith St, Preston VIC 3072",
    lat: -37.7440,
    lng: 145.0150,
    geofence_radius: 100 // meters
  }
}

// Client
{
  client_id: "c_001",
  name: "Mrs. Patterson",
  sites: [
    {
      site_id: "s_001",
      label: "Main House",
      address: "14 Baxter St, Thornbury VIC 3071",
      lat: -37.7544,
      lng: 144.9980,
      geofence_radius: 100
    },
    {
      site_id: "s_002",
      label: "Investment Property",
      address: "8 George St, Northcote VIC 3070",
      lat: -37.7701,
      lng: 144.9950,
      geofence_radius: 100
    }
  ]
}
```

---

## Two Remaining Questions

**3. Multi-stop days**

Does Dave ever go:

- Office → Site A → Site B → Office (same day, two jobs)

Or is MVP just:

- Office → Site → Office (one job per trip)

Multi-stop changes how we segment trips. Need to know for architecture.

---

**4. Route display**

For MVP, which do you prefer:

| Option | Look | Effort |
|--------|------|--------|
| **Raw breadcrumbs** | Slightly jagged line following GPS points | Easy — just connect the dots |
| **Road-snapped** | Clean line that follows actual roads | Requires Google Roads API call, adds cost |

Raw is fine for proving the feature works. Road-snapped is polish.

Your call?

---

Once you answer these two, I'll hand off to Architect to design the full system.

---

# BACKEND

Great, Marshall. Thanks for the clarity. Here's how we'll proceed based on your input:

---

## Key Decisions

1. **Home Location ("Office")**:
   - Users set this once in their profile.
   - This becomes their "home" geofence — travel starts/ends here.

2. **Job Sites**:
   - Each client can have multiple saved sites.
   - Users can enter these manually or save them on first visit.

3. **Multi-Stop Days**:
   - For MVP, we'll focus on home → site → home trips.
   - Site-to-site handling can be a future enhancement.

4. **Route Display**:
   - For MVP, we'll use raw breadcrumbs to draw the route line on the map.
   - Road-snapped lines can be a post-MVP polish.

---

## Next Steps

1. **Architecture Design**:
   - I'll have Architect map out the data flow, folder structure, and screen connections.
   - This will guide our build process and ensure we cover all bases.

2. **Phase 1 Development**:
   - We'll start with geofence setup and background GPS capture.
   - Implement the "Office" setup in user profiles.

3. **Testing and Validation**:
   - Conduct user testing with the MVP flow to validate assumptions.
   - Gather feedback to refine the geofencing and GPS accuracy.

---

## What to Check

- Ensure "Office" geofence correctly triggers travel start/stop.
- Verify job sites can be added and saved accurately.
- Test the map display with raw breadcrumb routes for clarity and usability.

---

## Timeline

- **Architecture**: 1 week
- **Phase 1 Build**: 2-3 weeks
- **Testing & Feedback**: 1-2 weeks

Total: ~5-6 weeks for MVP delivery.

---

Let's move forward with the architecture design. I'll coordinate with Architect to get the system blueprints ready.

Sound good? Anything else you need clarified before we proceed?

---

# FRONTEND

Got it, Marshall. Let's incorporate the following based on your input:

---

# Key Decisions

1. **"Home" Location**
   - Users will set this explicitly in their profile as the "Office" address.
   - This serves as the start and end point for daily travel tracking.

2. **Multiple Job Sites**
   - Support multiple saved sites per tradie.
   - Each client can have distinct job site locations.

3. **Route Display for MVP**
   - Start with raw breadcrumb trails. Accept some jaggedness.
   - Road-snapping is a polish feature for post-MVP.

4. **Handling Multi-Stop Days**
   - MVP will focus on home → site → home.
   - Site-to-site trips can be a later feature. Focus on core flow first.

---

# Next Steps

1. **Architecture Design**
   - I'll move this to the Architect to design the data flow and system structure.
   - We'll ensure the data model supports multiple job sites and breadcrumb storage.

2. **Phase 1 Build**
   - Geofence setup: Define "Office" and job site boundaries.
   - Background GPS: Implement breadcrumb logging while traveling.

3. **UI Design**
   - Map view: Design the interface for viewing route history linked to jobs.

---

## How to Verify

Once implemented, you will be able to:

- Set your "Office" address in the profile.
- Add multiple job site locations for clients.
- View a raw route line on a map for any past job showing travel to and from the site.

---

I'll coordinate with the Architect to design the system and notify you once we're ready to start building Phase 1. If there's anything else you'd like to adjust or add, let me know!