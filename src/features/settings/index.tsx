import React from "react";
import { loadRolesConfig, saveRolesConfig, type ModuleId, type RoleConfig } from "../../core/rbac/config";

const MODULES: ModuleId[] = ["dashboard", "accounting", "crm", "projects", "settings"];

export function SettingsView() {
  const [roles, setRoles] = React.useState<RoleConfig[]>(() => loadRolesConfig());

  function toggleModule(roleId: string, moduleId: ModuleId) {
    setRoles((current) =>
      current.map((role) => {
        if (role.id !== roleId) {
          return role;
        }

        const hasModule = role.modules.includes(moduleId);
        return {
          ...role,
          modules: hasModule
            ? role.modules.filter((item) => item !== moduleId)
            : [...role.modules, moduleId]
        };
      })
    );
  }

  function handleLabelChange(roleId: string, label: string) {
    setRoles((current) =>
      current.map((role) =>
        role.id === roleId
          ? {
              ...role,
              label
            }
          : role
      )
    );
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    saveRolesConfig(roles);
  }

  return (
    <section>
      <h2>Roles &amp; Access Control</h2>
      <form onSubmit={handleSave}>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              {MODULES.map((moduleId) => (
                <th key={moduleId}>{moduleId}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} data-testid={`role-row-${role.id}`}>
                <td>
                  <input
                    data-testid={`role-label-${role.id}`}
                    value={role.label}
                    onChange={(event) =>
                      handleLabelChange(role.id, event.target.value)
                    }
                  />
                </td>
                {MODULES.map((moduleId) => (
                  <td key={moduleId}>
                    <input
                      type="checkbox"
                      data-testid={`role-module-${role.id}-${moduleId}`}
                      checked={role.modules.includes(moduleId)}
                      onChange={() => toggleModule(role.id, moduleId)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" data-testid="roles-save">
          Save roles
        </button>
      </form>
    </section>
  );
}

