---
title: Paywalled Reports & Pricing Strategy
date: 2025-12-07
author: Analyst
---

# Context
Offline-first freelance ERP (solo + tiny agencies). Free core; paid insights/reports/dashboards. Competitor pricing: $10–$40/mo per seat (Bonsai, Indy, Plutio, Harvest, FreshBooks, Wave Pro, Zoho Books, HoneyBook, Dubsado, Hectic/Moxie). No major local-first competitor.

# Pricing & Packaging (fit $5–$20/mo target)
- Free Core (offline): CRM, proposals/contracts, invoices, payments logging, basic GL, CSV export, Drive sync optional.
- Insights Bundle (paywalled): $10/mo; $96/yr (20% off). Regional discounts optional.
  - Dashboards: cash snapshot, overdue, due-soon, collections progress, retainer balance, profitability quick view.
  - Reports: A/R aging, P&L, Balance Sheet, General Ledger (clean PDF), Client/Project profitability, Retainer statements, Collections performance, Accountant export pack (ZIP of PDFs/CSVs).
  - Automation: reminders/dunning sequences, scheduled email (MVP) + WhatsApp/SMS (v1.1+), workflow nudges.
- Add-on: Collections Boost ($4/mo; $40/yr) if separated: multi-channel reminders, escalation rules, custom templates.
- Trials: 14-day Insights trial triggered on first overdue invoice or first sync; annual discount 20–30%.

# Exact Packages (proposed)
- Free Core: $0. Unlimited devices, offline-first. CSV exports free; PDFs watermarked. Manual reminders only.
- Insights: $10/mo or $96/yr. Unlocks dashboards, premium reports, PDF without watermark, accountant pack, scheduled reminders, profitability views, retainer statements.
- Collections Boost add-on: $4/mo or $40/yr. Unlocks multi-channel reminders (email/WhatsApp/SMS roadmap), send windows, escalation, reminder analytics. Bundle into Insights+ at $12/mo or $115/yr.

# Paywalled Report Lineup (what to lock)
- Dashboards (home + accounting): cash collected, overdue total, due next 7/30 days, collections progress, retainer balance, profitability sparkline.
- A/R Aging with drill into invoices and reminder actions.
- P&L and Balance Sheet (period selectable) with PDF/CSV export.
- General Ledger formatted PDF; CSV export allowed in free tier but watermark PDF behind paywall.
- Client/Project Profitability (revenue, expenses, time cost estimate).
- Retainer Ledger and Statements (prepaid, used, remaining).
- Collections Performance (sent reminders, response, paid after reminder).
- Accountant Package: ZIP of PDFs (P&L, BS, GL, AR aging), invoices, receipts, tax summary.

# Anti-bypass / Hardening (local-first realities)
- Signed license token (public-key): includes expiry, device_id; allow 14–30 day offline grace, then gate Insights module.
- Gate report generation via licensed module: decrypt templates/computation in-memory only when token valid; watermark outputs when expired.
- Hash/verify binaries/resources; obfuscate license check path; store license in OS keystore (where available) plus encrypted local copy.
- Throttle exports in free tier (CSV only, no formatted PDF); watermark unpaid PDFs.
- Light phone-home on sync to refresh token; core remains offline-capable.

# Feature Wedge (reinforce value of paywall)
- Faster cash: overdue alerts, one-tap reminders, partial payments, retainers.
- Scope control: deliverables + approvals; change-order prompts.
- Reliability/privacy: offline-first SQLite + Drive ops-log sync; optional E2E encryption of ops.
- Compliance-lite: numbered invoices, VAT/GST templates, audit log, exports; regional packs (PK/GCC/EU/US basics).

# Suggested Tiers Matrix
- Free Core: CRM, proposals/contracts, invoices, payments logging, draft expenses, basic GL CSV, Drive sync, basic reminders (manual), limited templates.
- Insights (paid): all dashboards, AR aging, P&L/BS/GL PDF, profitability, retainer statements, collections automation, accountant pack, unlimited templates, scheduled reminders, multi-currency reporting.
- Add-on (optional): Collections Boost: WhatsApp/SMS/email sequences, escalation, send window rules, custom cadence analytics.

# Go-to-Market Notes
- ICP: solo freelancers + micro agencies (<=5). Target geos where offline/privacy matter (PK/GCC/SEA/EU freelancers).
- Hook: “Own your data. Works offline. Pay only for insights.”
- Activation: guide to first lead + first invoice + first payment; auto-offer Insights trial at first overdue.

# Core vs Paid Features (quick table)
| Area | Core (Free) | Paid (Insights / Collections Boost) |
| --- | --- | --- |
| Data/store | Offline-first SQLite; Drive sync optional | Same |
| CRM & docs | Leads/stages, proposals, contracts, invoices, payments logging | Unlimited templates, branded PDFs (no watermark) |
| Accounting | Basic GL CSV; numbered invoices; VAT/GST templates | GL/P&L/BS PDFs; accountant ZIP; multi-currency reporting |
| Reports/Dashboards | None (list views only) | Dashboards, AR aging, profitability, retainer statements, collections performance |
| Reminders | Manual only | Scheduled dunning; multi-channel (email at launch; WhatsApp/SMS v1.1); escalation windows; templates |
| Retainers | Track balances basic | Statements, applied usage views |
| Exports | CSV/JSON; PDFs watermarked/limited | Clean PDFs; accountant pack |
| Automations | None | Workflow nudges; reminder schedules; collections analytics |
| Support | Community/FAQ | Priority (if offered later) |

# Tier-by-Feature Grid (suggested)
- Free Core
  - CRM (leads, stages), proposals/contracts, invoices, payments logging
  - Basic GL CSV export; numbered invoices; VAT/GST templates; manual reminders
  - Drive sync (optional); offline-first; limited templates; retainer tracking basic (no statements)
  - Reports: basic list views only; no dashboards; CSV exports allowed; PDFs watermarked or disabled
- Insights (paid)
  - Dashboards (cash, overdue, due-soon, collections, retainer, profitability)
  - Reports: AR aging, P&L, Balance Sheet, GL PDF, Client/Project profitability, Retainer statements, Collections performance
  - Automation: scheduled reminders/dunning; saved reminder templates; accountant ZIP export; multi-currency reporting
  - Customization: more templates, saved filters, bulk actions; branded PDFs without watermark
- Collections Boost add-on (optional)
  - Multi-channel reminders (email at launch; WhatsApp/SMS v1.1+), send windows, escalation logic
  - Templates per client/tone; analytics on reminder-to-payment conversion

# GTM Launch Plan (concise)
- Messaging pillars: offline-first reliability; data ownership; faster cash (collections + retainers); pay only for insights.
- Channels: indie hacker/freelancer communities (Twitter/X, IndieHackers, Upwork/Behance groups), accountant/bookkeeper partners, niche geo communities (PK/GCC/SEA/EU freelance forums), Android early access (mobile capture story).
- Funnel:
  - Landing with “Own your data” + “Works offline” + “Insights $8–$12/mo”; CTA: download + 14-day Insights trial.
  - In-app onboarding: seed sample data; prompt first lead + first invoice + payment; trigger trial at first overdue or first payment.
  - Nurture: email/in-app tips on reminders, retainer ledger, accountant pack; upsell to annual.
- Pricing experiments: A/B $8 vs $10 vs $12; test including Collections Boost vs separate add-on; offer regional pricing if payments support it.
- Success metrics: activation (lead+invoice+payment in 48h), trial-to-paid %, overdue collection uplift, retention at 30/90 days, export usage (trust proxy).

# Roadmap Notes (multi-channel reminders)
- Email: launch-ready (MVP) for reminders/dunning.
- WhatsApp: add in v1.1; requires opt-in and template approval; start with manual send-from-device, then serverless bridge if needed.
- SMS: add in v1.1+; regional pricing differences; cap sends; allow user-provided API keys where possible.
- Collections Boost pricing stays valid as channels expand; early adopters grandfathered.

# Sources (pricing pages, accessed programmatically)
- Bonsai: https://www.hellobonsai.com/pricing
- Indy: https://weareindy.com/pricing
- Plutio: https://plutio.com/pricing
- Harvest: https://www.getharvest.com/pricing
- FreshBooks: https://www.freshbooks.com/pricing
- Wave: https://www.waveapps.com/pricing
- Zoho Books: https://www.zoho.com/books/pricing/
- HoneyBook: https://www.honeybook.com/pricing
- Dubsado: https://www.dubsado.com/pricing
- Hectic/Moxie: https://www.hecticapp.com/pricing
