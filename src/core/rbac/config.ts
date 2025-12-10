// Roles and permissions configuration backed by workspace storage.

export type ModuleId = "dashboard" | "accounting" | "crm" | "projects" | "settings";

export type RoleConfig = {
  id: string;
  label: string;
  modules: ModuleId[];
};

const STORAGE_KEY = "nextstack.rolesConfig";

const DEFAULT_ROLES: RoleConfig[] = [
  {
    id: "system-admin",
    label: "System Admin",
    modules: ["dashboard", "accounting", "crm", "projects", "settings"]
  },
  {
    id: "accounts-user",
    label: "Accounts User",
    modules: ["dashboard", "accounting"]
  },
  {
    id: "project-user",
    label: "Project User",
    modules: ["dashboard", "projects"]
  },
  {
    id: "crm-user",
    label: "CRM User",
    modules: ["dashboard", "crm"]
  }
];

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadRolesConfig(): RoleConfig[] {
  if (!canUseBrowserStorage()) {
    return DEFAULT_ROLES;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return DEFAULT_ROLES;
  }

  try {
    const parsed = JSON.parse(stored) as RoleConfig[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ROLES;
  } catch {
    return DEFAULT_ROLES;
  }
}

export function saveRolesConfig(roles: RoleConfig[]) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
}

function normalise(name: string) {
  return name.trim().toLowerCase();
}

function resolveRoleKey(name: string): string {
  const value = normalise(name);

  if (value === "owner") {
    return "system-admin";
  }

  if (value === "bookkeeper") {
    return "accounts-user";
  }

  if (value === "assistant") {
    return "crm-user";
  }

  return value;
}

export function findRoleConfig(roleName: string, roles: RoleConfig[]): RoleConfig | undefined {
  const key = resolveRoleKey(roleName);

  return (
    roles.find((role) => normalise(role.id) === key) ??
    roles.find((role) => normalise(role.label) === key)
  );
}

export function getDefaultRole(): RoleConfig {
  return DEFAULT_ROLES[0];
}

