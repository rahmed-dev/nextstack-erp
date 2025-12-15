# Epic 5: Projects & Work Management (Post-MVP)

Let the user organize work into projects and tasks and connect that work back to invoices and expenses.

## Story 5.1: Create and Manage Projects

As a freelancer-owner,
I want to create projects with clear client, scope, and status information,
So that I can see all active work and its state in one structured place.

**Acceptance Criteria:**

**Given** I open the Projects list
**When** I create a new project with at least: project name, client, status (for example, Planned, In Progress, On Hold, Completed, Cancelled), and an optional high-level description
**Then** the project is saved and appears in the Projects list with those fields visible
**And** the Projects list is rendered using the DocType metadata-driven listing system via route `/list?doctype=project` with columns, filters, status chips, and actions configured in the project DocType metadata
**And** I can optionally link the project to one or more leads or invoices for traceability

**Given** an existing project  
**When** I update its status, description, or other core fields and save  
**Then** the changes are stored and reflected in the Projects list and detail view  
**And** the project’s status drives how it appears in views (for example, active vs completed vs cancelled) without changing any underlying transactional document lifecycle

## Story 5.2: Tasks Under Projects with Status and Dates

As a freelancer-owner,
I want to create tasks under projects with subject, description, status, and due dates,
So that I can break down project work into manageable units and see what needs doing next.

**Acceptance Criteria:**

**Given** I am viewing a specific project
**When** I add a task with at least: subject, optional detailed description, status (for example, To Do, In Progress, Blocked, Done), and an optional due date
**Then** the task is saved under that project and appears in both the project's task list and any global task views
**And** task lists (both project-scoped and global) use the DocType metadata-driven listing system via routes like `/list?doctype=task` with appropriate filters for project context
**And** I can later update the task's status, due date, or description as work progresses

**Given** I am working through a project’s tasks  
**When** I filter or sort tasks by status or due date  
**Then** I can quickly see what is overdue, due soon, or completed for that project  
**And** no hard-coded thresholds are used beyond comparing task due dates to the current date

## Story 5.3: Link Projects to Invoices and Expenses

As a freelancer-owner,
I want to link projects to invoices and expenses,
So that revenue and costs can be traced back to the projects that generated them.

**Acceptance Criteria:**

**Given** there are existing projects  
**When** I create or edit an invoice or expense  
**Then** I can optionally associate it with a project  
**And** those links are stored so that I can later see which documents are related to each project

**Given** I am viewing a project in NextStack ERP  
**When** I open a “Financial Links” or similar section for that project  
**Then** I can see at least a list or summary of invoices and expenses linked to that project, with amounts and basic status  
**And** I can drill down into those documents without breaking their own document lifecycle or accounting behaviour
