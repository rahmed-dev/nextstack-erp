// RBAC metadata and helpers.

export type RoleName = "Owner" | "Bookkeeper" | "Assistant" | (string & {});

type PermissionMap = Partial<Record<RoleName, string[]>>;

// Simple module-level permissions for early vertical slices.
const MODULE_PERMISSIONS: PermissionMap = {
  Owner: [
    "module:dashboard",
    "module:accounting",
    "module:crm",
    "module:projects",
    "module:settings"
  ],
  Bookkeeper: ["module:dashboard", "module:accounting"],
  Assistant: ["module:dashboard"]
};

export function canAccess(role: RoleName, resource: string, action: string): boolean {
  void action;

  if (resource.startsWith("module:")) {
    const allowed = MODULE_PERMISSIONS[role] ?? MODULE_PERMISSIONS.Owner ?? [];
    return allowed.includes(resource);
  }

  // Non-module resources will be governed by more detailed rules later.
  return true;
}
