import React from "react";
import { AppShell } from "../ui/layout/AppShell";
import { DashboardHome } from "../features/dashboards";
import { SalesInvoiceDraftPage } from "../features/sales-invoices";
import { SettingsView } from "../features/settings";
import { RoleName, canAccess } from "../core/rbac";
import { ListingScreen } from "../ui/components/listing/ListingScreen";

type ModuleId = "dashboard" | "accounting" | "crm" | "projects" | "settings";

type ModuleConfig = {
  id: ModuleId;
  label: string;
  resource: string;
};

const MODULES: ModuleConfig[] = [
  { id: "dashboard", label: "Dashboard", resource: "module:dashboard" },
  { id: "accounting", label: "Accounting", resource: "module:accounting" },
  { id: "crm", label: "CRM", resource: "module:crm" },
  { id: "projects", label: "Projects", resource: "module:projects" },
  { id: "settings", label: "Settings", resource: "module:settings" }
];

function getInitialRole(): RoleName {
  if (typeof window === "undefined") {
    return "System Admin" as RoleName;
  }

  const stored = window.localStorage.getItem("nextstack.currentRole");
  if (stored) {
    return stored as RoleName;
  }

  return "System Admin" as RoleName;
}

function getRequestedModule(): ModuleId | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const moduleParam = params.get("module") as ModuleId | null;

  return moduleParam;
}

function getRequestedView(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("view");
}

export function AppRouter() {
  const [role] = React.useState<RoleName>(() => getInitialRole());
  const [requestedModule] = React.useState<ModuleId | null>(() => getRequestedModule());
  const [requestedView] = React.useState<string | null>(() => getRequestedView());
  const viewToDocType: Record<string, string> = {
    "chart-of-accounts": "ChartOfAccount",
    clients: "Client",
    vendors: "Vendor"
  };

  const visibleModules = MODULES.filter((module) =>
    canAccess(role, module.resource, "view")
  );

  const requestedIsVisible =
    requestedModule != null &&
    visibleModules.some((module) => module.id === requestedModule);

  const forbidden =
    requestedModule != null &&
    !visibleModules.some((module) => module.id === requestedModule);

  const activeModule: ModuleId = requestedIsVisible ? requestedModule! : "dashboard";

  return (
    <AppShell>
      <div className="app-layout">
        <nav aria-label="Main navigation">
          <ul>
            {visibleModules.map((module) => (
              <li key={module.id}>
                <a
                  href={`/?module=${module.id}`}
                  data-testid={`nav-${module.id}`}
                >
                  {module.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="Workspace content">
          {forbidden ? (
            <p data-testid="forbidden-message">
              You do not have access to this area.
            </p>
          ) : (
            <>
              <p data-testid="active-module">Active module: {activeModule}</p>
              {activeModule === "dashboard" && <DashboardHome />}
              {activeModule === "accounting" &&
                (requestedView === "chart-of-accounts" ? (
                  <ListingScreen docType={viewToDocType["chart-of-accounts"]} />
                ) : (
                  <SalesInvoiceDraftPage />
                ))}
              {activeModule === "crm" &&
                (requestedView === "clients" || requestedView === "vendors" ? (
                  <ListingScreen docType={viewToDocType[requestedView ?? ""]} />
                ) : (
                  <p>CRM home</p>
                ))}
              {activeModule === "settings" && <SettingsView />}
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
