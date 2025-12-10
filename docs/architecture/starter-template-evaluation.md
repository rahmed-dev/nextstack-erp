# Starter Template Evaluation

## Primary Technology Domain

Local-first **desktop application** with a web-based UI and SQLite storage, targeting Windows/macOS/Linux, with a future path to a companion mobile/web experience.

## Starter Options Considered

1. **Tauri + React + TypeScript + SQLite (recommended)**
   - Light desktop shell using the system WebView (better RAM profile than Electron).
   - React + TypeScript for a robust, future-friendly UI stack.
   - SQLite as embedded system of record, aligning with local-first requirements.
   - Clear path to implement a **DocType/metadata layer** in TypeScript for Frappe-like extensibility (config-driven doctypes, forms, lists, and workflows).
   - Packaging and updates are manageable, with a single primary runtime.

2. **Python backend (FastAPI/Django) + Web UI + Desktop shell (Tauri/Electron)**
   - Strong alignment with your Python/Frappe expertise and mental model.
   - Can run a local “NextStack Server” with a web UI speaking HTTP.
   - But heavier: multiple processes (desktop shell + Python server + DB), more RAM use, and more complex packaging.

3. **Python-only desktop (PySide/Qt + SQLite)**
   - Very stable and conservative stack with one primary language.
   - Easier to lean heavily on Python and Frappe-style patterns.
   - Less natural fit with your existing “web ERP” intuition and harder to reuse for future mobile/web.

Given NextStack ERP’s focus on being a **calm, always-available desktop cockpit** that is light on resources but still feels like a small ERP platform, option (1) strikes the best balance between:

- Performance and RAM usage
- Developer productivity (JS/TS is close to your current JS knowledge)
- Long-term extensibility (metadata-driven DocTypes and modules)
- Ability to reuse patterns later for web/mobile if needed

## Selected Starter: Tauri + React + TypeScript + SQLite

**Rationale for Selection:**

- Satisfies the low-RAM requirement better than Electron-based approaches.
- Keeps the UI stack in a web technology (React+TS) you can evolve and reuse, while aligning with your existing JS experience.
- Makes it natural to design a Frappe-like **DocType/metadata system** in the codebase:
  - Doctypes, fields, permissions, and workflows stored in SQLite as metadata.
  - Forms, lists, and views generated from that metadata.
  - Modules (CRM, Projects, Accounting) as discrete, extensible units.
- Keeps packaging and updates manageable for a one-person team while still giving you a clear ERP-style platform to grow.

**Initialization Command (baseline, to be verified at implementation time):**

```bash
# Desktop shell + React + TypeScript + Tauri
# (Exact flags may change; verify with current Tauri docs.)
npm create tauri-app@latest nextstack-erp \
  -- \
  --template react-ts
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript as the main application language for UI and most business logic.
- Rust as a thin “edge” for native integrations, filesystem, and SQLite access through Tauri commands.

**Styling Solution:**
- Use a modern, composable styling approach (e.g., Tailwind or CSS Modules) chosen during project setup and aligned with the UX spec.
- Keep the design system structured to support calm, ERP-like screens and traceable drill-down views.

**Build Tooling:**
- Vite-based dev/build pipeline for fast reloads and optimized production bundles.
- Tauri build tooling for platform-specific packaging and signing.

**Testing Framework:**
- Jest/Vitest for unit tests in TypeScript.
- Playwright (or similar) later for basic end-to-end flows around core ERP screens.

**Code Organization:**
- Clear separation of concerns:
  - `core` platform (DocType engine, permissions, navigation shell).
  - Module folders: `modules/crm`, `modules/accounting`, `modules/projects`, etc.
  - Shared components for lists, forms, dashboards.
- Metadata-first modeling of doctypes and workflows to mirror the strengths you know from Frappe.

**Development Experience:**
- Fast dev server and hot reload via Vite.
- TypeScript type-checking and linting to keep the growing ERP codebase manageable.
- A starter that is mainstream enough that you can find examples and patterns, but structured explicitly around NextStack ERP’s local-first and extensibility goals.

> **Note:** The actual `npm create` command and flags should be checked against the latest Tauri documentation when you initialize the repo, since CLI options evolve over time.
