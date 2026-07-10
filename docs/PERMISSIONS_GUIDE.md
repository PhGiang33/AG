# Permissions and Access Control Guide

This guide explains how to use the decoupled permission utilities and components to implement role-based and department-based access control in the application.

## Overview

The access control system is built on two main parts:

1.  **`lib/utils/permissions.ts`**: A file containing core types (`SystemRole`, `Department`) and helper functions for checking permissions.
2.  **`components/shared/RoleGuard.tsx`**: A React component that protects routes or UI elements by checking the user's role and redirecting if they are not authorized.

This system is designed to be completely separate from existing application logic, making it safe to integrate incrementally.

---

## 1. Using the Permission Utility Functions

The functions in `lib/utils/permissions.ts` provide granular control for conditional rendering and data filtering logic.

### `hasAgentAccess`

Use this function to determine if a user can access resources restricted to certain departments (e.g., a specific customer support queue). An `ADMIN` always has access.

**Example: Conditionally showing a component**

```tsx
import { hasAgentAccess } from '@/lib/utils/permissions';

// Assume you have access to the user's role and department
const user = { department: 'SALES', role: 'EMPLOYEE' };
const allowedDepartmentsForQueue = ['SALES', 'TECH'];

function CustomerQueues() {
  const canAccessSalesQueue = hasAgentAccess(user.department, user.role, allowedDepartmentsForQueue);

  return (
    <div>
      <h2>Customer Support Queues</h2>
      {canAccessSalesQueue && <SalesQueueComponent />}
      {/* ... other queues */}
    </div>
  );
}
```

### `hasKnowledgeAccess`

Use this to filter content, such as knowledge base articles, that should only be visible to certain departments.

**Example: Filtering a list of articles**

```ts
import { hasKnowledgeAccess } from '@/lib/utils/permissions';

const user = { department: 'FINANCE', role: 'MANAGER' };

const allArticles = [
  { id: 1, title: 'Q4 Financial Report Guide', visibleTo: ['FINANCE'] },
  { id: 2, title: 'New Marketing Campaign', visibleTo: ['MARKETING', 'SALES'] },
  { id: 3, title: 'Server Maintenance Policy', visibleTo: ['TECH'] },
];

const visibleArticles = allArticles.filter(article =>
  hasKnowledgeAccess(user.department, user.role, article.visibleTo)
);

// `visibleArticles` will only contain the article with id: 1.
```

### `filterSidebarMenu`

Use this function in your main layout to build a navigation menu that automatically adjusts to the user's role.

**Example: Building a dynamic sidebar**

```tsx
import { filterSidebarMenu, MenuItem } from '@/lib/utils/permissions';

const user = { role: 'MANAGER' };

const allMenuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', requiredRoles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
  { path: '/team-reports', label: 'Team Reports', requiredRoles: ['MANAGER', 'ADMIN'] },
  { path: '/admin-panel', label: 'Admin Panel', requiredRoles: ['ADMIN'] },
];

function AppSidebar() {
  const accessibleMenuItems = filterSidebarMenu(user.role, allMenuItems);

  return (
    <nav>
      <ul>
        {accessibleMenuItems.map(item => (
          <li key={item.path}><a href={item.path}>{item.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
// For a 'MANAGER', the sidebar will show 'Dashboard' and 'Team Reports'.
// The 'Admin Panel' will be hidden.
```

---

## 2. Using the `RoleGuard` Component

The `<RoleGuard>` component is the easiest way to protect an entire page or a large section of UI. It wraps the protected content and handles redirection automatically.

**Example: Protecting an Admin Page**

To protect a page that should only be accessible to users with the `ADMIN` role, wrap the page's content in `<RoleGuard>`.

```tsx
// In a file like `app/admin/page.tsx`

import RoleGuard from '@/components/shared/RoleGuard';

function AdminDashboard() {
  return <div>Welcome to the Admin Dashboard!</div>;
}

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']} fallbackUrl="/unauthorized">
      <AdminDashboard />
    </RoleGuard>
  );
}
```

In this example:
- If the current user is an `ADMIN`, `<AdminDashboard />` will be rendered.
- If the user is a `MANAGER`, `EMPLOYEE`, or not logged in, they will be automatically redirected to `/unauthorized`. If `fallbackUrl` is not provided, it defaults to `/dashboard`.

You can wrap any component or group of components with `<RoleGuard>` to apply the same protection logic.

```tsx
<RoleGuard allowedRoles={['MANAGER', 'ADMIN']}>
  <ManagerSpecificComponent />
</RoleGuard>
```