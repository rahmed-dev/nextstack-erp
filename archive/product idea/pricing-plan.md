# Pricing Plan and Structure

Competitors cluster around $10–$40/mo per seat; positioning targets $5–$20/mo with a free offline core.

## Packages and pricing
- **Free Core**: $0. Offline-first, Drive sync optional. CRM, proposals/contracts, invoices, payments logging, basic GL CSV, limited templates, manual reminders, retainer tracking basic. PDFs watermarked or limited.  
- **Insights**: $10/mo or $96/yr (20% off). Dashboards and reports (cash snapshot, overdue/due-soon, A/R aging, P&L, Balance Sheet, GL PDF, profitability by client/project, retainer statements, collections performance), accountant pack ZIP, branded PDFs without watermark, scheduled reminders, multi-currency reporting, more templates.  
- **Collections Boost add-on** (optional): $4/mo or $40/yr, or bundle as Insights+ at ~$12/mo or $115/yr. Multi-channel reminders (email at launch; WhatsApp/SMS roadmap), send windows, escalation logic, reminder templates, analytics on reminder-to-payment conversion.

## Gating and hardening
- Signed license token with offline grace (14–30 days) tied to device; refresh on sync.  
- Gate premium report generation and remove watermarks only when license valid.  
- Store license in OS keystore plus encrypted local copy; hash/verify premium assets.  
- Free tier keeps CSV/JSON exports; PDFs are watermarked or disabled until upgraded.
- Public repo realities: assume bypass attempts. Use server-issued signed tokens (public-key verify in app) with expiry and device_id; gate premium assets/templates or services (e.g., email reminders) so a token you control is required. Watermark free outputs and keep pricing low enough that paying is easier than patching. Obfuscation alone is weak; rely on entitlements + gated services and write tests to fail closed when tokens are missing/expired.

## Upgrade and trial principles
- Earned trials after real activity (e.g., first overdue or first payment).  
- Inline, dismissible upgrade prompts near locked controls; no pop-ups.  
- Respect settings to hide upgrade hints; tone emphasizes optional value (“faster collections”, “clean exports”, “profitability view”).

## Validation targets
- Pricing experiments: A/B $8 vs $10 vs $12 and bundle vs separate add-on.  
- Activation metrics: lead + invoice + payment in 48 hours; trigger trial on need.  
- Success metrics: trial-to-paid conversion, overdue reduction, export usage as trust signal.
