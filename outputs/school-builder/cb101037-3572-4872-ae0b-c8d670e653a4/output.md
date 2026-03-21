# TETSUO

Let's hear it, Marshall.

What's the feature idea? Give me whatever you've got — rough concept, problem you're trying to solve, or just a spark. I'll help you think through:

- What it actually does
- Where it fits in the system
- What needs to exist before it can be built
- Whether it's ready to build or needs more shape first

What are you thinking?

---

# RESEARCH

# Research Report — Tradie OS Feature Brainstorm

---

## 1. Research Question

What new feature should be considered for Tradie OS, based on current market capabilities and gaps in the tradie job management space?

---

## 2. What I Found

**Tradie OS Context:**
- Tradie OS appears to be associated with TradiePad, an Australian construction management platform
- Current capabilities include: job management, budgeting, document management, communication, reporting, quality/safety management, mobile access
- The platform focuses on quoting, job tracking, and safety compliance

**Market Gaps Identified:**
Based on competitor analysis, these features are trending but may be missing or underdeveloped in Tradie OS:

| Feature | Who Has It | Tradie OS Status |
|---------|-----------|------------------|
| AI job notes / communication automation | ServiceTitan, newer apps | Not mentioned |
| Offline mobile mode | ServiceTitan | Not confirmed |
| GPS tracking | Tradify, others | Not mentioned |
| Drag-and-drop scheduling | Multiple competitors | Not mentioned |
| Recurring jobs automation | Multiple competitors | Not mentioned |
| Weather-resilient scheduling | Emerging feature | Not mentioned |
| Integrated payments (field signatures, instant pay) | ServiceTitan, TRADIE iOS app | Not mentioned |

---

## 3. Comparison — Feature Opportunities

| Feature Idea | User Value | Implementation Complexity | Competitive Advantage |
|--------------|-----------|--------------------------|----------------------|
| **AI-powered job notes** | High — saves admin time | Medium | High — few competitors have this |
| **Offline mobile mode** | High — tradies work in dead zones | High | Medium — ServiceTitan has it |
| **Weather-aware scheduling** | Medium — prevents wasted trips | Medium | High — emerging feature |
| **Instant field payments** | High — faster cash flow | Medium-High (payment integrations) | Medium |
| **Recurring job automation** | Medium — good for maintenance tradies | Low | Low — many have this |
| **Smart lead pipeline with auto-follow-up** | High — converts more quotes | Medium | Medium-High |

---

## 4. Risks and Gotchas

**AI Job Notes:**
- Requires reliable speech-to-text or structured input
- Risk of garbage-in-garbage-out if tradies don't use it properly
- Privacy considerations for voice recordings

**Offline Mode:**
- Sync conflicts when coming back online
- Significant engineering effort
- Must handle partial data gracefully

**Weather-Aware Scheduling:**
- Needs reliable weather API integration
- False positives could frustrate users
- Most valuable for outdoor trades only (roofers, concreters)

**Field Payments:**
- Payment provider fees eat into margins
- PCI compliance requirements
- Chargebacks and disputes to manage

**General Risk:**
- If Tradie OS is a smaller player, building complex features may stretch resources — simpler high-impact features may win

---

## 5. Recommendation

**Build: AI-Powered Job Notes with Auto-Summary**

**Why this feature:**

1. **High pain point** — Tradies hate paperwork. Voice-to-text job notes that auto-summarize into client-ready reports would save hours weekly.

2. **Differentiator** — Few competitors have genuine AI integration beyond buzzwords. This is a chance to lead.

3. **Medium complexity** — Can start simple (transcription + summary) and expand (auto-populate invoices, safety checklists).

4. **Compounds value** — Better notes → better reporting → better invoicing → faster payment. One feature improves the whole chain.

**MVP Scope:**
- Voice recording on mobile app
- AI transcription with job-specific terminology
- One-click summary generation
- Optional: auto-attach to job record

**Second choice:** Weather-aware scheduling — lower effort, high perceived value for outdoor trades, and no competitor owns this space yet.

---

## 6. Sources

| # | Source | Used For |
|---|--------|----------|
| 1 | tradiepad.com.au | Current Tradie OS capabilities |
| 2 | tradii.io | Competitor features |
| 3 | servicetitan.com | Competitor features, offline mode |
| 4 | apps.apple.com/tradie | iOS app feature set |
| 5 | play.google.com/tradie | Android app updates |
| 6 | newdigital.com.au | 2026 tradie app trends |
| 7 | spannerbot.com | Market comparison |

---

## Summary

**Feature to build:** AI-Powered Job Notes with Auto-Summary

**Why:** Solves the #1 tradie complaint (admin burden), creates differentiation, and has compounding benefits across the platform.

**Start with:** Voice recording → AI transcription → one-click summary → attach to job.

---

Ready to scope this further or explore the second option (weather-aware scheduling) if Marshall prefers.