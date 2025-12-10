# UX Pattern Analysis & Inspiration

## Inspiring Products Analysis

- **ERPNext v16 (desktop ERP)**  
  - Solves: structured business record‑keeping with Doctypes, list+form patterns, and powerful filters for power users.  
  - Navigation: module‑based sidebar and consistent list views that make it obvious “where you are” and which object you’re working with.  
  - Strengths: dense but readable tables, inline actions, clear separation of documents (Invoice, Payment, GL Entry), strong mental model for a system of record, and rich configurability for fields, workflows, and modules.  
  - Caution for our context: raw configuration surfaces can feel heavy if exposed without clear defaults or guidance.

- **Cashew (mobile finance)**  
  - Solves: daily overview of money plus frictionless expense logging.  
  - Navigation: dashboard‑first; cards and simple sections instead of deep menus.  
  - Strengths: calm visuals, one‑glance understanding of “how this month is going,” fast add‑expense flows, and low cognitive load.  
  - Limitation for us: not a full ERP—great for inspiration on tone and flows, but we need more hierarchy and traceability.

- **Obsidian (local‑first knowledge tool)**  
  - Solves: user‑owned, extensible knowledge base with flexible structure.  
  - Navigation: panes, backlinks, and graph views help power users shape their own workspace.  
  - Strengths: plugin ecosystem, user control over folder/vault structure, and the comfort of storing data in a Drive‑syncable vault.  
  - Caution for our context: very open‑ended; if copied too literally, business data could feel unstructured or hard to validate.

## Transferable UX Patterns

- **Navigation patterns**  
  - ERPNext‑style module sidebar with list+form as the default working view for CRM, Projects, and Accounting.  
  - Cashew‑style dashboard entry points per module that summarize “how things are going” before diving into lists.  
  - A global omnibox / command palette that lets users jump to DocTypes, individual documents, or reports from anywhere in the app.  
  - Obsidian‑like “workspace” concepts (saved views, configurable layouts) so power users can shape their workspace without breaking the underlying data model.

- **Interaction patterns**  
  - ERPNext inline edits and contextual actions in list views for fast updates to tasks, leads, and documents.  
  - Configurable modules and workflows—e.g., the ability to hide modules a user doesn’t need (like CRM) and customize lead states/flows—while shipping strong defaults so the app is usable from day one.  
  - Cashew’s quick‑add flows for expenses/income as primary actions from mobile and desktop dashboards.  
  - Obsidian’s extension mindset as inspiration for allowing optional advanced modules or views without bloating the core.

- **Visual patterns**  
  - Cashew’s calm, low‑noise visual language (soft colors, clear typography, focus on a few key numbers) as the baseline tone.  
  - ERPNext’s structured tables and clear field groupings for serious, data‑heavy screens.  
  - Obsidian’s “this is my vault” feeling via subtle branding, local‑first cues, and reassuring sync/status indicators.

## Anti‑Patterns to Avoid

- Exposing ERP‑level configuration in a way that feels like a setup project—configuration should be powerful but layered behind sensible defaults and guided flows.  
- Over‑dashboarding with too many charts and cards competing for attention instead of a clear “here’s what matters now.”  
- Obsidian‑style unbounded flexibility for core business data (especially accounting) that would hurt auditability and accuracy.  
- Navigation that forces users to “hunt” for documents or reports instead of following the natural Lead → Project → Invoice → GL chain.

## Design Inspiration Strategy

- **What to adopt**  
  - ERPNext’s Doctype mental model, list+form ergonomics, and the idea of configurable workflows and modules.  
  - Cashew’s dashboard‑first mobile home with extremely fast expense and income capture.  
  - Obsidian’s local‑first, Drive‑friendly “vault” mindset to reinforce ownership and trust.

- **What to adapt**  
  - ERPNext’s module navigation and configurability, simplified and opinionated for a single‑owner context: fewer modules visible by default, with clear controls to toggle modules like CRM on/off and customize key states (e.g., lead flows).  
  - Cashew’s visual tone, adapted to a slightly more serious, data‑heavy desktop look suited to power users and accounting work.  
  - Obsidian’s extensibility, constrained to safe, business‑aware extensions (extra views, reports, or workflow tweaks) rather than arbitrary freeform structures for financial data.

- **What to avoid**  
  - Heavy, configuration‑driven screens that make setup feel like an ERP implementation project rather than a focused business console.  
  - Overly playful or distracting visuals that fight the calm, in‑control feeling.  
  - Any configuration option that makes accounting less explainable or traceable in the name of flexibility.
