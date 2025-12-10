// RBAC metadata and helpers.

import { findRoleConfig, getDefaultRole, loadRolesConfig, type ModuleId } from "./config";

export type RoleName = string & {};

export function canAccess(role: RoleName, resource: string, action: string): boolean {
  void action;

  if (!resource.startsWith("module:")) {
    // Non-module resources will be governed by more detailed rules later.
    return true;
  }

  const parts = resource.split(":");
  const moduleId = parts[1] as ModuleId | undefined;
  if (!moduleId) {
    return false;
  }

  const roles = loadRolesConfig();
  const roleConfig = findRoleConfig(role, roles) ?? getDefaultRole();

  return roleConfig.modules.includes(moduleId);
}
