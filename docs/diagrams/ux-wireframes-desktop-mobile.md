# NextStack ERP – Wireframes (Desktop & Mobile)

High-level wireframes based on ERPNext-style module launcher and workspaces. These are structural layouts only; content and visual details can be filled in later.

---

## 1. Desktop – Main Module Launcher

**Goal:** Simple ERPNext-like start screen with module icons, global search, and profile entry.

- **Top Bar**
  - Left: App icon + text `NextStack ERP`
  - Center: Wide search / command bar `Search or type a command (Ctrl+K)`
  - Right: (optional) sync/status icon, `Help` menu, user avatar/profile menu

- **Content Area**
  - Centered grid of **module tiles**, 3–4 per row
    - Tile contents: module icon, module name, optional sublabel (e.g. `Projects – Work & capacity`, `Accounting – Money & reports`)
    - Example core modules: `CRM`, `Projects`, `Accounting`, `Settings`, `Archives`
  - Plenty of white space top/bottom and sides; no extra chrome

- **Behaviors**
  - Hitting `Enter` in search runs command palette (jump to modules, docs, recent items)
  - Clicking a module tile opens that module’s **Workspace** (see next section)

---

## 2. Desktop – Module Workspace Shell (Generic)

This pattern applies to CRM, Projects, and Accounting workspaces.

- **Top Bar (same across modules)**
  - Left: Module icon + name (e.g. `Projects`), with dropdown to switch module
  - Center: Search / command bar scoped to the active module by default
  - Right: Contextual `Help`, notifications (optional), user avatar/profile

- **Left Sidebar**
  - Header: Module icon + name + small sublabel (e.g. `Projects & tasks`)
  - Groups (each collapsible), e.g. for Projects:
    - `Overview`
      - `Projects Home`
      - `My Tasks`
    - `Planning`
      - `Roadmap`
      - `Capacity`
    - `Reporting`
      - `Project P&L`
      - `Invoices`
      - `Workload Reports`
  - Footer: `Collapse` control, link to module `Settings`

- **Right Content Area (Workspace)**
  - Top: Breadcrumb + page title (e.g. `Projects Home`)
  - Below: grid/rows of **shortcut cards**, similar to ERPNext workspace:
    - Cards for: `Today’s Tasks`, `Active Projects`, `Overdue Items`, `Project P&L`, `Unbilled Work`, `Recent Invoices`
    - Each card: title, small metric (count/value), subtle chevron/launch icon

---

## 3. Desktop – Example: Projects Workspace States

### 3.1 Projects Home

- Left sidebar: `Projects` module groups as described above
- Content:
  - Row 1 cards: `Today’s Tasks`, `Active Projects`, `Overdue Items`
  - Row 2 cards: `Project P&L`, `Unbilled Work`, `Recent Invoices`
  - Optional third row: saved views (e.g. `This Week`, `By Client`, `By Status`)

### 3.2 My Tasks (List-first)

- Re-uses same shell: top bar + sidebar
- Content: dense table/list
  - Columns: `Project`, `Task`, `State`, `Next Action`, `Due`, `Effort`
  - Inline editing for `State` and `Next Action`
  - Filters row above table (client, project, timeframe, state)

---

## 4. Mobile – Wireframes

Mobile is a companion for quick capture and at-a-glance status, reflecting the same mental model.

### 4.1 Mobile Home

- Top row: `NextStack ERP` wordmark + compact search/command input
- Module selector:
  - Horizontal pill/chip row: `CRM`, `Projects`, `Accounting`
- Content sections:
  - `Today` card: summary of today’s tasks + quick links (`View tasks`, `Review projects`)
  - `This Month` money card: Income / Expenses / Net with tap-through to details
  - `Quick Actions` row: buttons `Log Expense`, `Create Invoice`, `Add Task`

### 4.2 Mobile – Projects Module

- Header: `Projects` with back arrow or module selector
- Optional tab row: `Home`, `My Tasks`, `Projects`
- Views:
  - `Home`: simplified cards like desktop `Projects Home` (Today’s tasks, Active projects)
  - `My Tasks`: single-column list, swipeable for complete/defer, minimal inline edit
  - `Projects`: list of projects with status pill and primary metrics

### 4.3 Mobile – Quick Capture

- Entry from `Quick Actions` or a central bottom `+` button
- Tabs or segmented controls: `Expense`, `Invoice`, `Note`
- Each form:
  - Top: minimal fields (date defaults to today)
  - Middle: key business fields (client, project, amount/category)
  - Bottom: primary action button (`Save & Close`), optional secondary (`Save & Add Another`)

---

These wireframes are intentionally high-level and layout-focused. When you’re ready, we can turn specific screens (e.g. Projects Home, Accounting Home, Mobile Home) into more detailed UI specs with states, component choices, and example data.
