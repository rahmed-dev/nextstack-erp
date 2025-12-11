# Epic 3: Desktop Workspace, Sync & Configuration

Deliver a reliable local-first desktop app that runs comfortably on the user’s machines, stays in sync via Google Drive, and can be configured for their workflow and simple team roles.

## Story 3.1: Desktop Installation and First Launch

As a freelancer-owner,
I want to install and launch NextStack ERP on my machine,
So that I can use it as a local-first cockpit without needing a browser or separate server.

**Acceptance Criteria:**

**Given** I have downloaded the installer or package appropriate for my operating system  
**When** I run the installer and complete the standard installation flow  
**Then** the app is installed in a location consistent with platform norms  
**And** I can launch it from the usual application launcher or start menu

**Given** I launch the app for the first time  
**When** it starts successfully  
**Then** I see the main workspace shell (for example, navigation sidebar and a default home view)  
**And** the app creates a local workspace with a SQLite-backed data store on my machine without requiring network access

## Story 3.2: System Tray and Startup Behaviour

As a freelancer-owner,
I want the app to integrate with my desktop environment via a tray icon and optional auto-start,
So that it can stay out of the way while remaining available as a daily cockpit.

**Acceptance Criteria:**

**Given** NextStack ERP is running  
**When** I minimise it or close the main window (according to platform conventions)  
**Then** it can continue running in the background with a tray icon or equivalent status area entry  
**And** from that tray icon I can reopen the main window and see that my current workspace is still available

**Given** there is a setting for “Open on system startup”  
**When** I enable or disable this setting  
**Then** NextStack ERP is added to or removed from my operating system’s startup applications  
**And** on the next login the app either starts in the background with a tray icon or does not start, according to that setting

## Story 3.3: Notifications for Time-Sensitive Events

As a freelancer-owner,
I want native desktop notifications for important events such as follow-ups and invoice status changes,
So that I can notice critical items without constantly watching the app.

**Acceptance Criteria:**

**Given** notification types and basic rules (for example, upcoming follow-ups, invoices crossing configured ageing thresholds) are configured in settings  
**When** a configured event occurs while NextStack ERP is running  
**Then** I receive a native desktop notification from the app showing a concise summary and a way to identify which item needs attention  
**And** clicking the notification takes me to the relevant view or document inside the app

**Given** there is a notifications preferences area  
**When** I enable or disable specific notification types  
**Then** only the enabled types generate desktop notifications  
**And** the app does not send notifications that I have explicitly disabled

## Story 3.4: Workspace and Accounting Settings

As a freelancer-owner,
I want a central settings area for workspace and accounting configuration,
So that I can tailor currency, financial year, notification, and ageing behaviour to my business.

**Acceptance Criteria:**

**Given** I open the Settings area  
**When** I configure core accounting options such as base currency, financial year start, and key preferences  
**Then** those settings are saved in my local workspace  
**And** they are used consistently across invoices, reports, and dashboards without requiring me to re-enter them

**Given** there are configuration options for invoice ageing buckets and “approaching due” / “overdue” thresholds  
**When** I adjust those values in settings  
**Then** the Receivables and Payables views and any related dashboard or notification logic use the updated thresholds  
**And** no fixed number of days is hard-coded in the application logic for these states

## Story 3.5: Connect Google Account and Sync Workspace

As a freelancer-owner,
I want to connect my Google account so the app can back up and sync my workspace via Google Drive,
So that my local data is protected and can be used across devices without running my own server.

**Acceptance Criteria:**

**Given** I open the Sync or Cloud settings area  
**When** I choose to connect a Google account and complete the sign-in and consent flow  
**Then** NextStack ERP stores the necessary tokens using the operating system’s secure storage/keychain mechanisms  
**And** it records that my workspace is now linked to that Google account for backup and sync

**Given** I have connected my account and sync is enabled  
**When** I create or update invoices, payments, expenses, or other documents while online  
**Then** those changes are synchronised to Google Drive using the ops log-based sync approach  
**And** on another device with the same workspace connected, the app can pull and apply those changes without silently breaking accounting integrity

**Given** I have one or more existing local-only workspaces on my devices  
**When** I enable sync and choose to link a workspace to Google Drive  
**Then** I explicitly select which workspace becomes the shared Drive-backed workspace  
**And** the app does not silently merge unrelated histories between different workspaces

**Given** I am working offline or sync temporarily fails  
**When** I continue to create and edit documents  
**Then** all changes are stored locally and core workflows remain available  
**And** when connectivity returns, the app attempts to sync changes and clearly indicates sync status without discarding local work

## Story 3.6: Roles and Access for Desktop Workspace

As a System Admin,
I want to define roles and configure module-level permissions for users of my NextStack ERP workspace,
So that Accounts, Projects, and CRM access can be granted cleanly without hard-coding role behaviour.

**Acceptance Criteria:**

**Given** I open the Roles or Access Control settings as a System Admin  
**When** I view the list of roles  
**Then** I see at least the default roles: System Admin, Accounts User, Project User, and CRM User  
**And** I can add new roles or rename existing ones without changing application code

**Given** I edit the permissions for a role such as Accounts User, Project User, or CRM User  
**When** I toggle access to modules or doctypes (for example, Accounting, Projects, CRM) and save  
**Then** those permissions are stored as configuration data in the workspace  
**And** the permission engine uses that configuration at runtime rather than relying on hard-coded role checks

**Given** a user account is associated with one or more roles  
**When** that user signs in or otherwise uses the workspace  
**Then** they can only see and act on modules, doctypes, and actions allowed by their configured roles  
**And** modules or document types they do not have access to are hidden from navigation and search

**Given** a non-admin user with restricted roles attempts to open a screen, document, or action they do not have access to  
**When** they try to perform that action  
**Then** the app blocks it and shows a clear, non-technical explanation  
**And** their attempted actions are still recorded in an audit trail where appropriate, without exposing data they are not allowed to see
