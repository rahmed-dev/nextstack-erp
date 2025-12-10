# Epic 4: Leads & Pipeline (Post-MVP)

Allow the user to track leads and follow-ups in a structured pipeline so they stop losing opportunities in Upwork and elsewhere.

## Story 4.1: Create and Manage Leads

As a freelancer-owner,
I want to create and update leads with clear fields for client, value, and next actions,
So that I have a single, structured place to track potential work instead of relying on Upwork messages and memory.

**Acceptance Criteria:**

**Given** I open the Leads list  
**When** I create a new lead with at least: client or organization name, short description, source (for example Upwork, referral, direct), estimated value, stage, and next action with a next-action date  
**Then** the lead is saved and appears in the Leads list with those fields visible in columns or detail view  
**And** I can optionally store a link back to the original job/posting or external reference

**Given** an existing lead  
**When** I edit its fields (for example, update description, change estimated value, refine next action and date) and save  
**Then** the changes are stored and reflected wherever that lead appears  
**And** history or comments on the lead can record key notes without losing the main field values

## Story 4.2: Lead Pipeline Stages and Transitions

As a freelancer-owner,
I want to move leads through a simple, configurable pipeline of stages,
So that I can see at a glance which opportunities are open, in discussion, proposed, won, or lost.

**Acceptance Criteria:**

**Given** default pipeline stages are defined in configuration (at least Open, In Discussion, Proposal Sent, Won, Lost)  
**When** I change a lead’s stage from Open to In Discussion, Proposal Sent, Won, or Lost  
**Then** the new stage is saved on the lead and visible in the Leads list and detail views  
**And** the set of stages shown in the UI comes from the configurable pipeline settings rather than being hard-coded in application logic

**Given** I mark a lead as Won  
**When** I save the lead  
**Then** it is clearly visible as Won in the pipeline views  
**And** I can still see its history and original details for context when creating projects or invoices later

**Given** I mark a lead as Lost  
**When** I save the lead and optionally enter a reason for loss  
**Then** the lead is recorded as Lost with that reason stored for later analysis  
**And** Lost leads no longer appear in default “active leads” views while remaining available for reporting

## Story 4.3: Follow-Up Today and Overdue Leads View

As a freelancer-owner,
I want focused views of leads that need follow-up today or are overdue based on their next-action date,
So that I can start my day knowing exactly which conversations need attention.

**Acceptance Criteria:**

**Given** leads have a next-action date and next-action description  
**When** I open a “Today” or “Follow Up Today” leads view  
**Then** I see leads whose next-action date is today, grouped or highlighted so they stand out  
**And** I can filter or sort this view further by stage, source, or estimated value

**Given** I open an “Overdue” leads view  
**When** the system compares each lead’s next-action date to the current date  
**Then** I see leads whose next-action date is in the past and which are not in a closed stage such as Won or Lost  
**And** there is no hard-coded number of days threshold; overdue is determined by whether the next-action date is before today

**Given** I complete or update a follow-up on a lead from either view  
**When** I update its next action and next-action date and save  
**Then** that lead disappears from the current “Today” or “Overdue” view if it no longer matches the criteria  
**And** it will appear again in the appropriate view when its new next-action date is reached or passes
