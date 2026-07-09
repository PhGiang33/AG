'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Department, SystemRole } from '@/permissions';

interface User {
  id: string;
  name: string;
  department: Department;
  role: SystemRole;
}

/**
 * A mock hook to simulate fetching the current user's data.
 * In a real application, you would replace this with your actual authentication hook
 * (e.g., from NextAuth.js, Clerk, or your own auth context).
 * @returns A mock user object.
 */
const useMockUser = (): { user: User | null; isLoading: boolean } => {
  // --- MOCK USER DATA ---
  // Change the role and department here to test different scenarios.
  const mockUser: User = {
    id: '123',
    name: 'John Doe',
    department: 'TECH',
    role: 'EMPLOYEE', // Try 'ADMIN', 'MANAGER', or 'EMPLOYEE'
  };
  // ----------------------

  return { user: mockUser, isLoading: false };
};

interface RoleGuardProps {
  allowedRoles: SystemRole[];
  fallbackUrl?: string;
  children: ReactNode;
}

/**
 * A client-side component that guards content based on user roles.
 * It checks if the current user's role is in the `allowedRoles` list.
 * If the user is not authorized, it redirects them to a fallback URL.
 */
export default function RoleGuard({ allowedRoles, fallbackUrl = '/dashboard', children }: RoleGuardProps) {
  const { user, isLoading } = useMockUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until user data is loaded.
    }

    if (!user || !allowedRoles.includes(user.role)) {
      // If user is not found or their role is not allowed, redirect.
      router.push(fallbackUrl);
    }
  }, [user, isLoading, allowedRoles, fallbackUrl, router]);

  // While loading or if the user is not yet available, render nothing to prevent content flashing.
  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return null; // Or a loading spinner component.
  }

  // If the user has the required role, render the protected content.
  return <>{children}</>;
}