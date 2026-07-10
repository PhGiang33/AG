'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Department, SystemRole } from '@/lib/utils/permissions';

interface User {
  id: string;
  name: string;
  department: Department;
  role: SystemRole;
}

/**
 * Mot hook mo phong de lay thong tin cua nguoi dung hien tai.
 * Trong ung dung thuc te, ban se thay the phan nay bang hook xac thuc that
 * (vi du tu NextAuth.js, Clerk, hoac context xac thuc cua rieng ban).
 * @returns Doi tuong user mo phong.
 */
const useMockUser = (): { user: User | null; isLoading: boolean } => {
  // --- DU LIEU NGUOI DUNG MO PHONG ---
  // Thay doi vai tro va phong ban o day de thu nghiem cac truong hop khac nhau.
  const mockUser: User = {
    id: '123',
    name: 'John Doe',
    department: 'TECH',
    role: 'EMPLOYEE', // Thu thay doi thanh 'ADMIN', 'MANAGER', hoac 'EMPLOYEE'
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
 * Mot component phia client giup bao ve noi dung dua tren vai tro nguoi dung.
 * No kiem tra xem vai tro cua nguoi dung hien tai co nam trong danh sach `allowedRoles` khong.
 * Neu nguoi dung khong co quyen, ho se bi chuyen huong den URL du phong (fallbackUrl).
 */
export default function RoleGuard({ allowedRoles, fallbackUrl = '/dashboard', children }: RoleGuardProps) {
  const { user, isLoading } = useMockUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Doi cho den khi du lieu nguoi dung duoc tai xong.
    }

    if (!user || !allowedRoles.includes(user.role)) {
      // Neu khong tim thay nguoi dung hoac vai tro khong duoc phep, tien hanh chuyen huong.
      router.push(fallbackUrl);
    }
  }, [user, isLoading, allowedRoles, fallbackUrl, router]);

  // Trong khi dang tai hoac neu nguoi dung chua san sang, khong hien thi gi de tranh nhay noi dung (content flashing).
  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return null; // Hoac tra ve mot component spinner dang tai.
  }

  // Neu nguoi dung co vai tro yeu cau, hien thi noi dung duoc bao ve.
  return <>{children}</>;
}