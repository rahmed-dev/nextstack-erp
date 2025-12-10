## Desktop App Specific Requirements

### Project-Type Overview

NextStack ERP is a desktop-first application built with Tauri and React, targeting Windows as the primary platform with Linux as a secondary—but supported—platform. macOS support is desirable, but for the first real version the priority is to have a stable Windows build and a working Linux build for development and power users. The product is explicitly local-first with Google Drive–based sync, and it is not a multi-tenant SaaS in its initial incarnation.

### Technical Architecture Considerations

- Desktop shell built using Tauri + React, packaging a local UI with a Rust backend and SQLite database on the user’s machine.
- Local SQLite is the primary source of truth; an append-only ops log drives sync to Google Drive.
- Google authentication and Drive access are used only for sync and license validation; core functionality remains available without network access.
- The future mobile app shares the same data model but is not required for the first shippable version.

### Platform Support

- **Must support**: Windows (primary target).
- **Should support**: Linux (supported for development and advanced users, with packaged builds where reasonable).
- **Nice to have**: macOS, with the understanding that it may follow Windows once the desktop model is stable.
- Installers/bundles should feel native enough on each OS (e.g., `.exe`/installer on Windows, package formats appropriate for Linux distros).

### System Integration

For the MVP that the freelancer will actually use, the app should feel like a first-class desktop citizen:

- **System tray icon** to quickly open the app or show lightweight status (e.g., sync state, notifications).
- **Native notifications** for important events such as upcoming follow-ups, invoices approaching due date, and invoices that have crossed the “more than a week late” threshold.
- **Use of OS keychain/secure storage** for sensitive data such as Google OAuth tokens, any license tokens, and encryption keys, rather than storing secrets in plain files.
- **Optional “open on startup”** setting so the app can run in the background as a daily cockpit without manual launching each day.

### Update Strategy

- Built-in **auto-update** is required; manually downloading and installing new builds is not acceptable for ongoing use.
- The app should be able to check for a new version, download it, and apply the update with minimal friction, respecting platform norms.
- Updates must be safe for the local SQLite data and ops log; migrations should be explicit and tested to avoid corrupting user data.

### Offline Capabilities

- Core workflows—recording leads, managing projects and tasks, creating invoices, logging payments and expenses, and viewing core dashboards—must work fully offline.
- Only operations that inherently require network access (e.g., Google login, Drive sync, remote license validation) should depend on connectivity.
- The app should never block core work just because the user is offline; instead, it should queue sync operations and clearly indicate sync status.
- Conflict resolution for sync should follow the previously defined append-only ops log and reconciliation rules, ensuring that offline work is never silently discarded.

### Implementation Considerations

- Package the desktop app with a focus on reliability and easy installs for non-technical users, especially on Windows.
- Treat the Drive sync and auto-update mechanisms as separate concerns: sync ensures data portability and multi-device use, while auto-update keeps the app itself current.
- Keep the initial implementation single-user/single-tenant per device; future roles and permissions can be layered on top of the existing doctype and data model once the desktop foundation is solid.
