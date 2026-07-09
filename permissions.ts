/**
 * Defines the departments within the organization.
 * Using a TypeScript union type provides type safety and autocompletion.
 */
export type Department = 'HR' | 'SALES' | 'MARKETING' | 'TECH' | 'FINANCE';

/**
 * Defines the system roles available to users.
 * This helps in creating a clear hierarchy for access control.
 */
export type SystemRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

/**
 * Represents a generic menu item for navigation components like a sidebar.
 * The `requiredRoles` property allows for fine-grained control over visibility.
 */
export interface MenuItem {
  path: string;
  label: string;
  requiredRoles: SystemRole[];
}

/**
 * Checks if a user has access to a specific agent-related resource.
 * Access is granted if the user is an ADMIN or if their department is in the allowed list.
 * This function centralizes the logic for "agent access".
 * @param userDept The department of the current user.
 * @param userRole The system role of the current user.
 * @param allowedDepts An array of departments that are permitted to access the resource.
 * @returns `true` if the user has access, otherwise `false`.
 */
export function hasAgentAccess(userDept: Department, userRole: SystemRole, allowedDepts: Department[]): boolean {
  // An ADMIN has universal access, overriding any department restrictions.
  if (userRole === 'ADMIN') {
    return true;
  }
  // A non-admin user has access only if their department is explicitly included.
  return allowedDepts.includes(userDept);
}

/**
 * Checks if a user has access to a knowledge base article or section.
 * Access is granted if the user is an ADMIN or if their department is within the allowed scopes.
 * This is useful for filtering content that is relevant only to specific departments.
 * @param userDept The department of the current user.
 * @param userRole The system role of the current user.
 * @param allowedScopes An array of departments that define the visibility scope.
 * @returns `true` if the user has access, otherwise `false`.
 */
export function hasKnowledgeAccess(userDept: Department, userRole: SystemRole, allowedScopes: Department[]): boolean {
  // An ADMIN can view all knowledge base content.
  if (userRole === 'ADMIN') {
    return true;
  }
  // Other users can only see content scoped to their department.
  return allowedScopes.includes(userDept);
}

/**
 * Filters a list of menu items based on the user's role.
 * This function dynamically adjusts navigation, ensuring users only see links they are permitted to access.
 * The filtering logic is inclusive; an ADMIN sees all, a MANAGER sees MANAGER and EMPLOYEE items, etc.
 * @param userRole The system role of the current user.
 * @param menuItems The full list of menu items to filter.
 * @returns A new array containing only the menu items the user is allowed to see.
 */
export function filterSidebarMenu(userRole: SystemRole, menuItems: MenuItem[]): MenuItem[] {
  const roleHierarchy: Record<SystemRole, number> = {
    ADMIN: 3,
    MANAGER: 2,
    EMPLOYEE: 1,
  };

  const userLevel = roleHierarchy[userRole];

  // Filter items where the user's role level is high enough for at least one of the required roles.
  return menuItems.filter(item =>
    item.requiredRoles.some(requiredRole => userLevel >= roleHierarchy[requiredRole])
  );
}