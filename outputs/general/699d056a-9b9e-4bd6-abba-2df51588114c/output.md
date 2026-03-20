# TETSUO

Tetsuo here.

Good. That's a tight definition. Let me break it down technically.

---

## What You Just Defined

**Tradie OS** — A mobile app for sole traders that:

1. **Automatically tracks the workday** — time, location, activity
2. **Produces tax-ready data** — expense categorisation, mileage, deductions
3. **Produces invoice-ready data** — billable hours, job summaries, client records
4. **Requires no manual input** — passive capture, smart defaults, minimal friction

---

## Technical Implications

This is not a simple app. You're describing:

| Feature | Technical Requirement |
|---------|----------------------|
| Automatic time tracking | Background location services, motion detection, geofencing |
| No manual input | ML/heuristics to infer job start/end, travel vs work |
| Tax-ready output | ATO-compliant categories, GST handling, FY reporting |
| Invoice-ready output | Client management, job-to-invoice pipeline, PDF/email generation |
| Mobile-first | Expo/React Native, offline-capable, battery-efficient |

---

## Build Order I'd Recommend

**Phase 1 — Passive Tracking Core**
- Background location capture
- Automatic job detection (geofence or motion-based)
- Local data storage (offline-first)

**Phase 2 — Data Structure**
- Job model (start, end, location, client, notes)
- Expense model (amount, category, receipt, GST)
- Mileage model (trip start, trip end, distance, purpose)

**Phase 3 — Output Generation**
- Invoice builder (job → line items → PDF)
- Tax summary (FY view, BAS-ready totals)

**Phase 4 — Integrations**
- Xero / MYOB sync
- Bank feed matching (stretch goal)

---

## Red Flags to Address Early

1. **Battery drain** — Background location kills batteries. Need smart polling.
2. **Permission trust** — Users must grant location + motion. Onboarding matters.
3. **Inference accuracy** — If auto-detection is wrong too often, users abandon it.
4. **ATO compliance** — Tax-ready means actually compliant, not just "looks like it."

---

## What I Need From You

1. **Confirm this scope is correct** — or tell me what's missing
2. **Pick the tradie type** — Sparky? Plumber? Carpenter? Their workflows differ.
3. **Define one user** — Name, trade, pain point. We build for them first.

---

Ready when you are, Marshall.

---

# RESEARCH

# Research Report: Tradie OS Competitive Landscape

---

## 1. Research Question

What existing solutions compete with Tradie OS, and how does Marshall's concept differentiate in the market?

---

## 2. Options Considered

| App | Target User | Core Approach |
|-----|-------------|---------------|
| **Tradie OS (Marshall's)** | Sole traders | Automatic tracking → tax-ready/invoice-ready data, zero manual input |
| **Tradify** | Small trade teams | Job management with scheduling, quoting, invoicing |
| **Connecteam** | Field teams | Time tracking with geofencing, team management |
| **AroFlo** | Sole traders to 50+ teams | Full job management, estimating, reporting |
| **Tradie Tool (UK)** | Trade businesses | Job management with SMS/email automation |
| **NextMinute** | AU/NZ residential tradies | Quoting, scheduling, invoicing, accounting sync |
| **TRADIE app** | Sole tradies | CRM with leads, quotes, invoices, review automation |

---

## 3. Comparison and Tradeoffs

| Factor | Tradie OS (Yours) | Competitors |
|--------|-------------------|-------------|
| **Manual input required** | Minimal to none (that's the pitch) | Significant — most require manual job entry, time logging |
| **Automation focus** | Core differentiator | Automation exists but for notifications/reminders, not data capture |
| **Tax-ready output** | Built-in goal | Requires manual export or accountant handoff |
| **Target user** | Sole traders only | Many target teams, add complexity sole traders don't need |
| **Pricing** | TBD | Ranges from free tiers to $30+/month |
| **Market validation** | Early — someone just said yes | Established players with reviews and traction |

**Key insight:** Competitors automate *workflows* (reminders, scheduling). Marshall's Tradie OS automates *data capture itself*. That's a different value proposition.

---

## 4. Risks and Gotchas

### Market Risks
- **"Tradie OS" name conflict** — An app called "Tradie - Job Management" already exists on the App Store. Another called "TRADIE" launched recently. Name collision is real.
- **Crowded category** — Tradify, AroFlo, Connecteam all have SEO presence and reviews. Discovery will be hard without differentiation.

### Product Risks
- **"Automatic" is a big promise** — If tracking requires even occasional manual input, trust breaks. The bar is high.
- **Tax-ready means jurisdiction-specific** — GST, BAS, different rules per country. Scope creep risk.

### Validation Risks
- **No public reviews yet for Tradie OS** — Search results found Marshall's App Store listing but no ratings. Early stage confirmed.

---

## 5. Recommendation

**Marshall's positioning is strong — but the name needs attention.**

Here's what I'd tell him:

1. **The concept differentiates.** "Zero manual input" is not what competitors offer. They automate notifications; you automate the work itself. That's a real gap.

2. **Rename or namespace carefully.** "Tradie OS" and "Tradie - Job Management" and "TRADIE" are all live. Confusion is inevitable. Consider a distinctive name or tagline that owns the "automatic" angle.

3. **Double down on the tax-ready promise.** No competitor clearly owns "opens app, data is already tax-ready." That's the wedge.

4. **Validate with real tradies, not just one.** One yes is signal. Five yeses with similar feedback is a pattern.

---

## 6. Sources

- App Store: Tradie - Job Management (Paul Vosloo)
- App Store: TRADIE (Sebastian Charles Booth)
- Connecteam: Best Tradie Business Software guide
- AroFlo: Best Apps for Tradies
- Tradify: Feature pages
- Tradie Tool UK: Product site
- NextMinute: AU/NZ tradie app

---

**Bottom line:** The market is crowded with job management tools. It is *not* crowded with truly automatic data capture for tax and invoicing. That's Marshall's lane. He should own it clearly and name it distinctly.